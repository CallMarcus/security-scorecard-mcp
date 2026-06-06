import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  confidence?: number;  // 0-1 confidence score
  weights?: {
    keyword: number;
    semantic: number;
  };
  endpoint: ApiEndpoint;
}

export interface HybridSearchResponse {
  results: ApiSearchResult[];
  searchMode: 'hybrid' | 'keyword-only';
  semanticDisabledReason?: string;
}

// Synonym map for common security/API terms
const SYNONYMS: Record<string, string[]> = {
  // Security terms
  'score': ['grade', 'rating', 'scorecard'],
  'grade': ['score', 'rating'],
  'issue': ['finding', 'vulnerability', 'problem', 'risk'],
  'finding': ['issue', 'vulnerability'],
  'vulnerability': ['issue', 'finding', 'vuln', 'cve'],
  'risk': ['issue', 'threat', 'exposure'],
  'threat': ['risk', 'attack', 'malware'],

  // Asset terms
  'asset': ['company', 'domain', 'hostname', 'ip', 'footprint'],
  'company': ['organization', 'domain', 'vendor'],
  'domain': ['company', 'hostname', 'website'],
  'vendor': ['company', 'third-party', 'supplier'],
  'footprint': ['asset', 'infrastructure', 'digital-footprint'],

  // Action terms
  'get': ['list', 'fetch', 'retrieve', 'show'],
  'list': ['get', 'all', 'fetch'],
  'create': ['add', 'new', 'post'],
  'update': ['edit', 'modify', 'patch', 'put'],
  'delete': ['remove', 'destroy'],

  // Data terms
  'history': ['historical', 'trend', 'timeline'],
  'factor': ['category', 'criteria', 'metric'],
  'portfolio': ['collection', 'group', 'watchlist'],
  'report': ['export', 'download', 'pdf'],
};

export class ApiReferenceClient {
  private indexPath: string;
  private docsRoot: string;
  private index: ApiEndpoint[] | null = null;
  private embeddingsPath: string;
  private embeddings: Record<string, { text: string; embedding: number[] }> | null = null;
  private embedderPromise: Promise<any> | null = null;

  constructor() {
    // Self-contained: API reference data is now in this repository
    // Use project root (two levels up from src/integration/)
    const projectRoot = resolve(__dirname, '../..');
    const apiRefPath = process.env.SCORECARD_API_REFERENCE_PATH || projectRoot;

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
    const isNumericArrayLike = (candidate: unknown): candidate is ArrayLike<number> => (
      ArrayBuffer.isView(candidate) && !(candidate instanceof DataView)
    );

    if (Array.isArray(raw)) {
      const flatten = (value: unknown): number[] => {
        if (typeof value === 'number') {
          return [value];
        }
        if (Array.isArray(value)) {
          return value.flatMap(inner => flatten(inner));
        }
        if (value && typeof value === 'object') {
          if (isNumericArrayLike(value)) {
            return Array.from(value);
          }
          if ('data' in value) {
            const inner = (value as { data?: unknown }).data;
            if (isNumericArrayLike(inner)) {
              return Array.from(inner);
            }
          }
        }
        return [];
      };

      const flattened = raw.flatMap(item => flatten(item));
      if (flattened.length > 0) {
        return flattened;
      }
    }

    if (isNumericArrayLike(raw)) {
      return Array.from(raw);
    }

    if (raw && typeof raw === 'object' && 'data' in raw) {
      const inner = (raw as { data: Float32Array }).data;
      if (isNumericArrayLike(inner)) {
        return Array.from(inner);
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

  private expandWithSynonyms(tokens: string[]): string[] {
    const expanded = new Set<string>(tokens);
    for (const token of tokens) {
      const synonyms = SYNONYMS[token];
      if (synonyms) {
        for (const syn of synonyms) {
          expanded.add(syn);
        }
      }
    }
    return Array.from(expanded);
  }

  private calculateScore(endpoint: ApiEndpoint, query: string, tag?: string, method?: string): number {
    const rawTokens = query.toLowerCase().split(/[\s\/:\-_]+/).filter(t => t);
    const tokens = this.expandWithSynonyms(rawTokens);

    // Build searchable text with field weighting
    const pathText = (endpoint.path || '').toLowerCase();
    const summaryText = (endpoint.summary || '').toLowerCase();
    const operationIdText = (endpoint.operationId || '').toLowerCase();
    const tagText = (endpoint.tag || '').toLowerCase();
    const methodText = (endpoint.method || '').toLowerCase();
    const paramsText = [...endpoint.requiredPathParams, ...endpoint.queryParams].join(' ').toLowerCase();

    // Helpers for matching - original tokens use looser matching, synonyms use strict word boundary
    const matchesLoose = (text: string, token: string): boolean => {
      // Substring match - good for original user tokens
      return text.includes(token);
    };

    const matchesStrict = (text: string, token: string): boolean => {
      // Word boundary match - prevents "score" matching "scorecard"
      const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Word boundary at start, allow hyphen/underscore/s continuation
      return new RegExp(`\\b${escaped}(?:[-_s]|es\\b|\\b)`).test(text);
    };

    let score = 0;

    for (const token of tokens) {
      const isOriginal = rawTokens.includes(token);
      const weight = isOriginal ? 1.0 : 0.5; // Synonyms worth half

      // Original tokens use loose matching (user intent), synonyms use strict (avoid false positives)
      const matches = isOriginal ? matchesLoose : matchesStrict;

      // Field-weighted scoring
      if (matches(pathText, token)) score += 3 * weight;      // Path most important
      if (matches(operationIdText, token)) score += 2 * weight;
      if (matches(summaryText, token)) score += 1.5 * weight;
      if (matches(paramsText, token)) score += 1 * weight;
      if (matches(tagText, token)) score += 0.8 * weight;
    }

    // Bonus for exact tag match
    if (tag && tagText === tag.toLowerCase()) {
      score += 3;
    }

    // Bonus for exact method match
    if (method && methodText === method.toLowerCase()) {
      score += 2;
    }

    // Only apply tiebreaker bonuses when the endpoint has keyword relevance
    if (score > 0) {
      // Prefer shorter paths (often listing endpoints)
      score += Math.max(0, 3 - endpoint.path.split('/').length);

      // Version bias: prefer v2 endpoints over v1 or unversioned
      if (pathText.includes('/v2/')) {
        score += 2;
      } else if (pathText.includes('/v1/')) {
        score += 0.5; // Slight penalty vs v2
      }

      // Deprecation detection: downweight if summary/path hints at deprecation
      const deprecationHints = ['deprecated', 'legacy', 'old', 'obsolete'];
      const fullText = `${summaryText} ${pathText} ${operationIdText}`;
      for (const hint of deprecationHints) {
        if (fullText.includes(hint)) {
          score *= 0.5; // Halve score for deprecated endpoints
          break;
        }
      }
    }

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
    const response = await this.hybridSearchWithMetadata(query, options);
    return response.results;
  }

  async hybridSearchWithMetadata(query: string, options: {
    tag?: string;
    method?: string;
    limit?: number;
    keywordWeight?: number;
    semanticWeight?: number;
    queryEmbedding?: number[];
  } = {}): Promise<HybridSearchResponse> {
    const {
      tag,
      method,
      limit = 8,
      keywordWeight = 0.4,
      semanticWeight = 0.6,
      queryEmbedding,
    } = options;

    const keywordResults = this.search(query, { tag, method, limit: Math.max(limit * 2, limit) });

    // Try semantic search with graceful fallback
    let semanticResults: ApiSearchResult[] = [];
    let searchMode: 'hybrid' | 'keyword-only' = 'hybrid';
    let semanticDisabledReason: string | undefined;

    try {
      semanticResults = await this.semanticSearch(query, { limit: Math.max(limit * 3, limit), queryEmbedding });
      if (semanticResults.length === 0) {
        searchMode = 'keyword-only';
        semanticDisabledReason = 'No embeddings available';
      }
    } catch (error) {
      searchMode = 'keyword-only';
      semanticDisabledReason = error instanceof Error ? error.message : 'Semantic search unavailable';
      console.warn(`⚠️  Semantic search disabled: ${semanticDisabledReason}`);
    }

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
      return { results: [], searchMode, semanticDisabledReason };
    }

    const maxKeyword = Math.max(0, ...Array.from(combined.values()).map(r => r.keywordScore || 0));
    const maxSemantic = Math.max(0, ...Array.from(combined.values()).map(r => Math.max(0, r.semanticScore ?? 0)));

    // Adjust weights if semantic is disabled
    const effectiveKeywordWeight = searchMode === 'keyword-only' ? 1.0 : keywordWeight;
    const effectiveSemanticWeight = searchMode === 'keyword-only' ? 0.0 : semanticWeight;

    const results: ApiSearchResult[] = [];
    for (const result of combined.values()) {
      const keywordComponent = maxKeyword > 0 ? (result.keywordScore || 0) / maxKeyword : 0;
      const semanticComponent = maxSemantic > 0 ? Math.max(0, result.semanticScore ?? 0) / maxSemantic : 0;
      const score = (keywordComponent * effectiveKeywordWeight) + (semanticComponent * effectiveSemanticWeight);

      results.push({
        ...result,
        score,
        weights: {
          keyword: effectiveKeywordWeight,
          semantic: effectiveSemanticWeight,
        },
      });
    }

    // Sort by score
    results.sort((a, b) => b.score - a.score);

    // Calculate confidence scores
    const topScore = results[0]?.score ?? 0;
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const nextScore = results[i + 1]?.score ?? 0;
      const margin = topScore > 0 ? (result.score - nextScore) / topScore : 0;

      // Confidence based on:
      // - Normalized score (40%)
      // - Having both keyword and semantic matches (30%)
      // - Score margin from next result (30%)
      const normalizedScore = topScore > 0 ? result.score / topScore : 0;
      const hasBothSignals = (result.keywordScore > 0 && (result.semanticScore ?? 0) > 0) ? 1 : 0.6;
      const marginBonus = Math.min(margin * 2, 0.3);

      result.confidence = Math.min(1, (normalizedScore * 0.4) + (hasBothSignals * 0.3) + marginBonus);
    }

    const sortedResults = results.slice(0, limit);

    return { results: sortedResults, searchMode, semanticDisabledReason };
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