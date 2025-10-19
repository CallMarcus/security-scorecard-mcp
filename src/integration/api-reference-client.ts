import { readFileSync } from 'fs';
import { resolve } from 'path';

export interface ApiEndpoint {
  tag: string;
  method: string;
  path: string;
  operationId: string;
  summary: string;
  file: string;
  hasBody: boolean;
  requiredPathParams: string[];
  queryParams: string[];
}

export interface ApiSearchResult {
  score: number;
  keywordScore: number;
  semanticScore?: number;
  semanticText?: string;
  weights?: {
    keyword: number;
    semantic: number;
  };
  endpoint: ApiEndpoint;
}

export class ApiReferenceClient {
  private indexPath: string;
  private docsRoot: string;
  private index: ApiEndpoint[] | null = null;
  private embeddingsPath: string;
  private embeddings: Record<string, { text: string; embedding: number[] }> | null = null;
  private embedderPromise: Promise<any> | null = null;

  constructor() {
    // Flexible path resolution for scorecard-api-reference
    const apiRefPath = process.env.SCORECARD_API_REFERENCE_PATH
      || resolve(process.cwd(), '../scorecard-api-reference')
      || '/mnt/c/Claude/scorecard-api-reference';

    this.indexPath = resolve(apiRefPath, 'docs/api/index.jsonl');
    this.docsRoot = resolve(apiRefPath, 'docs');
    this.embeddingsPath = resolve(apiRefPath, 'docs/api/index-embeddings.json');
  }

  private loadIndex(): ApiEndpoint[] {
    if (this.index) return this.index;

    try {
      const indexContent = readFileSync(this.indexPath, 'utf8');
      this.index = indexContent
        .split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line) as ApiEndpoint);
      
      return this.index;
    } catch (error) {
      throw new Error(`Failed to load API index from ${this.indexPath}: ${error}`);
    }
  }

  private loadEmbeddings(): Record<string, { text: string; embedding: number[] }> {
    if (this.embeddings) return this.embeddings;

    try {
      const raw = readFileSync(this.embeddingsPath, 'utf8');
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        this.embeddings = parsed as Record<string, { text: string; embedding: number[] }>;
        return this.embeddings;
      }
      throw new Error('Embedding cache is not an object');
    } catch (error) {
      console.warn(`⚠️  Failed to load API embeddings from ${this.embeddingsPath}: ${error}`);
      this.embeddings = {};
      return this.embeddings;
    }
  }

  private async getEmbedder(): Promise<any> {
    if (!this.embedderPromise) {
      this.embedderPromise = import('@xenova/transformers').then(module => {
        const moduleAny = module as any;
        const pipelineFactory = moduleAny.pipeline || moduleAny.default?.pipeline;
        if (!pipelineFactory) {
          throw new Error('Feature extraction pipeline is unavailable');
        }
        return pipelineFactory('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      });
    }
    return this.embedderPromise;
  }

  private async createEmbeddingFromQuery(query: string): Promise<number[]> {
    const extractor = await this.getEmbedder();
    const result = await extractor(query, { pooling: 'mean', normalize: true });
    const raw = result?.data;

    if (Array.isArray(raw)) {
      return raw.flatMap((value: unknown) => typeof value === 'number' ? value : []);
    }

    if (raw && ArrayBuffer.isView(raw)) {
      return Array.from(raw as Float32Array);
    }

    if (raw && typeof raw === 'object' && 'data' in raw) {
      const inner = (raw as { data: Float32Array }).data;
      if (inner && ArrayBuffer.isView(inner)) {
        return Array.from(inner as Float32Array);
      }
    }

    throw new Error('Unable to extract embedding data from query result');
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (!a.length || a.length !== b.length) return 0;

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i += 1) {
      const valA = a[i];
      const valB = b[i];
      dot += valA * valB;
      normA += valA * valA;
      normB += valB * valB;
    }

    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private calculateScore(endpoint: ApiEndpoint, query: string, tag?: string, method?: string): number {
    const tokens = query.toLowerCase().split(/[\s\/:\-_]+/).filter(t => t);
    const searchText = [
      endpoint.summary || '',
      endpoint.path || '',
      endpoint.operationId || '',
      endpoint.tag || '',
      endpoint.method || ''
    ].join(' ').toLowerCase();

    let score = tokens.reduce((sum, token) => {
      const matches = (searchText.match(new RegExp(token, 'g')) || []).length;
      return sum + matches;
    }, 0);

    // Bonus for exact tag match
    if (tag && endpoint.tag.toLowerCase() === tag.toLowerCase()) {
      score += 3;
    }

    // Bonus for exact method match  
    if (method && endpoint.method.toLowerCase() === method.toLowerCase()) {
      score += 2;
    }

    // Prefer shorter paths (often listing endpoints)
    score += Math.max(0, 3 - endpoint.path.split('/').length);

    return score;
  }

  search(query: string, options: {
    tag?: string;
    method?: string;
    limit?: number;
  } = {}): ApiSearchResult[] {
    const { tag, method, limit = 8 } = options;
    const index = this.loadIndex();

    const results: ApiSearchResult[] = [];
    
    for (const endpoint of index) {
      const score = this.calculateScore(endpoint, query, tag, method);
      if (score > 0) {
        results.push({
          score,
          keywordScore: score,
          endpoint,
        });
      }
    }

    // Sort by score (highest first) and limit results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async semanticSearch(query: string, options: {
    limit?: number;
    queryEmbedding?: number[];
  } = {}): Promise<ApiSearchResult[]> {
    const { limit = 8, queryEmbedding } = options;
    const embeddings = this.loadEmbeddings();
    const embeddingKeys = Object.keys(embeddings);
    if (embeddingKeys.length === 0) {
      return [];
    }

    const index = this.loadIndex();
    const queryVector = queryEmbedding ?? await this.createEmbeddingFromQuery(query);
    const results: ApiSearchResult[] = [];

    for (const endpoint of index) {
      const record = embeddings[endpoint.operationId];
      if (!record || !Array.isArray(record.embedding)) continue;

      const similarity = this.cosineSimilarity(queryVector, record.embedding);
      if (similarity <= 0) continue;

      results.push({
        score: similarity,
        keywordScore: 0,
        semanticScore: similarity,
        semanticText: record.text,
        endpoint,
      });
    }

    return results
      .sort((a, b) => (b.semanticScore ?? 0) - (a.semanticScore ?? 0))
      .slice(0, limit);
  }

  async hybridSearch(query: string, options: {
    tag?: string;
    method?: string;
    limit?: number;
    keywordWeight?: number;
    semanticWeight?: number;
    queryEmbedding?: number[];
  } = {}): Promise<ApiSearchResult[]> {
    const {
      tag,
      method,
      limit = 8,
      keywordWeight = 0.4,
      semanticWeight = 0.6,
      queryEmbedding,
    } = options;

    const keywordResults = this.search(query, { tag, method, limit: Math.max(limit * 2, limit) });
    const semanticResults = await this.semanticSearch(query, { limit: Math.max(limit * 3, limit), queryEmbedding });

    const combined = new Map<string, ApiSearchResult>();

    for (const result of keywordResults) {
      combined.set(result.endpoint.operationId, {
        ...result,
        semanticScore: result.semanticScore,
      });
    }

    for (const semantic of semanticResults) {
      const existing = combined.get(semantic.endpoint.operationId);
      if (existing) {
        existing.semanticScore = semantic.semanticScore;
        existing.semanticText = semantic.semanticText;
      } else {
        combined.set(semantic.endpoint.operationId, {
          ...semantic,
          keywordScore: 0,
        });
      }
    }

    if (combined.size === 0) {
      return [];
    }

    const maxKeyword = Math.max(0, ...Array.from(combined.values()).map(r => r.keywordScore || 0));
    const maxSemantic = Math.max(0, ...Array.from(combined.values()).map(r => Math.max(0, r.semanticScore ?? 0)));

    const results: ApiSearchResult[] = [];
    for (const result of combined.values()) {
      const keywordComponent = maxKeyword > 0 ? (result.keywordScore || 0) / maxKeyword : 0;
      const semanticComponent = maxSemantic > 0 ? Math.max(0, result.semanticScore ?? 0) / maxSemantic : 0;
      const score = (keywordComponent * keywordWeight) + (semanticComponent * semanticWeight);

      results.push({
        ...result,
        score,
        weights: {
          keyword: keywordWeight,
          semantic: semanticWeight,
        },
      });
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  getEndpointDoc(filePath: string): string {
    try {
      const fullPath = resolve(this.docsRoot, filePath);
      return readFileSync(fullPath, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read endpoint documentation: ${error}`);
    }
  }

  getEndpointCount(): number {
    const index = this.loadIndex();
    return index.length;
  }

  getEndpointsByCategory(category: string): ApiEndpoint[] {
    const index = this.loadIndex();
    return index.filter(endpoint =>
      endpoint.tag.toLowerCase().includes(category.toLowerCase())
    );
  }

  getSecurityEndpoints(): ApiEndpoint[] {
    const index = this.loadIndex();
    const securityTerms = [
      'vulnerability', 'security', 'risk', 'compliance', 
      'threat', 'malware', 'breach', 'scan', 'audit'
    ];

    return index.filter(endpoint => {
      const searchText = [
        endpoint.summary,
        endpoint.path,
        endpoint.tag
      ].join(' ').toLowerCase();

      return securityTerms.some(term => searchText.includes(term));
    });
  }
}