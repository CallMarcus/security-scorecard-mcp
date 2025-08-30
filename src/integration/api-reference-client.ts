import { readFileSync } from 'fs';
import { join, resolve } from 'path';

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
  endpoint: ApiEndpoint;
}

export class ApiReferenceClient {
  private indexPath: string;
  private docsRoot: string;
  private index: ApiEndpoint[] | null = null;

  constructor() {
    // Flexible path resolution for scorecard-api-reference
    const apiRefPath = process.env.SCORECARD_API_REFERENCE_PATH 
      || resolve(process.cwd(), '../scorecard-api-reference')
      || '/mnt/c/Claude/scorecard-api-reference';
      
    this.indexPath = resolve(apiRefPath, 'docs/api/index.jsonl');
    this.docsRoot = resolve(apiRefPath, 'docs');
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
        results.push({ score, endpoint });
      }
    }

    // Sort by score (highest first) and limit results
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