import { RequestOptions, ApiResponse } from '../types/api.js';

export interface SecurityScorecardConfig {
  apiToken: string;
  baseUrl?: string;
}

export class SecurityScorecardApiClient {
  private baseUrl: string;
  private apiToken: string;

  constructor(config: SecurityScorecardConfig) {
    this.apiToken = config.apiToken;
    this.baseUrl = config.baseUrl || 'https://api.securityscorecard.io';
  }

  /**
   * Make a raw API request to any SecurityScorecard endpoint
   */
  async makeRequest<T = any>(
    method: string,
    path: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${path}`;
    const { queryParams, body, ...fetchOptions } = options;
    
    // Build query string
    const searchParams = new URLSearchParams();
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    
    const finalUrl = searchParams.toString() ? `${url}?${searchParams}` : url;
    
    const response = await fetch(finalUrl, {
      method,
      headers: {
        'Authorization': `Token ${this.apiToken}`,
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...fetchOptions,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText}\n${errorText}`);
    }
    
    const data = await response.json();
    return {
      data,
      status: response.status,
      headers: response.headers,
    };
  }

  /**
   * Fetch every page of a paginated list endpoint (issue #17).
   *
   * SSC uses two pagination styles:
   * - 'page':   footprint endpoints — `page` (0-based) + `page-size` (max 100);
   *             a short page means the list is exhausted.
   * - 'cursor': issues/findings endpoints — `size` + `cursor`, where the
   *             response carries `next_cursor` (or a full `next` URL).
   *
   * maxPages is a hard safety cap; `truncated: true` means it was hit while
   * pages were still coming, so callers should surface a truncation notice.
   */
  async fetchAllPages<T = any>(
    method: string,
    path: string,
    options: {
      style: 'page' | 'cursor';
      queryParams?: Record<string, any>;
      pageSize?: number;
      maxPages?: number;
    }
  ): Promise<{ entries: T[]; pages: number; truncated: boolean }> {
    const { style, queryParams = {}, pageSize = 100, maxPages = 20 } = options;
    const all: T[] = [];
    let pages = 0;
    let truncated = false;

    if (style === 'page') {
      for (let page = 0; page < maxPages; page += 1) {
        const response = await this.makeRequest(method, path, {
          queryParams: { ...queryParams, page, 'page-size': pageSize }
        });
        const entries: T[] = response.data?.entries ?? [];
        all.push(...entries);
        pages += 1;
        if (entries.length < pageSize) return { entries: all, pages, truncated: false };
      }
      truncated = true;
      return { entries: all, pages, truncated };
    }

    // cursor style
    let nextPath: string | null = null;
    let cursor: string | null = null;
    for (let i = 0; i < maxPages; i += 1) {
      let response;
      if (nextPath) {
        response = await this.makeRequest(method, nextPath);
      } else {
        const params: Record<string, any> = { ...queryParams, size: pageSize };
        if (cursor) params.cursor = cursor;
        response = await this.makeRequest(method, path, { queryParams: params });
      }
      const data = response.data ?? {};
      const entries: T[] = data.entries ?? [];
      all.push(...entries);
      pages += 1;

      const nextCursor = data.next_cursor ?? data.cursor?.next ?? null;
      const nextUrl = typeof data.next === 'string' ? data.next : (typeof data.links?.next === 'string' ? data.links.next : null);
      if (nextCursor) {
        cursor = String(nextCursor);
        nextPath = null;
      } else if (nextUrl) {
        // Follow the server-provided URL verbatim (minus origin) — it already
        // carries cursor and size query params.
        nextPath = nextUrl.replace(/^https?:\/\/[^/]+/, '');
        cursor = null;
      } else {
        return { entries: all, pages, truncated: false };
      }
    }
    return { entries: all, pages, truncated: true };
  }

  // === PORTFOLIO METHODS ===
  
  /**
   * Get all portfolios you have access to
   */
  async getPortfolios(queryParams?: Record<string, any>): Promise<ApiResponse<any>> {
    return this.makeRequest('GET', '/portfolios', { queryParams });
  }

  /**
   * Create a new portfolio
   */
  async createPortfolio(portfolioData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('POST', '/portfolios', { body: portfolioData });
  }

  /**
   * Get a specific portfolio
   */
  async getPortfolio(portfolioId: string): Promise<ApiResponse<any>> {
    return this.makeRequest('GET', `/portfolios/${portfolioId}`);
  }

  /**
   * Update a portfolio
   */
  async updatePortfolio(portfolioId: string, portfolioData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('PUT', `/portfolios/${portfolioId}`, { body: portfolioData });
  }

  /**
   * Delete a portfolio
   */
  async deletePortfolio(portfolioId: string): Promise<ApiResponse<any>> {
    return this.makeRequest('DELETE', `/portfolios/${portfolioId}`);
  }

  /**
   * Get companies in a portfolio
   */
  async getPortfolioCompanies(portfolioId: string, queryParams?: Record<string, any>): Promise<ApiResponse<any>> {
    return this.makeRequest('GET', `/portfolios/${portfolioId}/companies`, { queryParams });
  }

  /**
   * Add a company to a portfolio
   */
  async addCompanyToPortfolio(portfolioId: string, domain: string): Promise<ApiResponse<any>> {
    return this.makeRequest('PUT', `/portfolios/${portfolioId}/companies/${domain}`);
  }

  /**
   * Remove a company from a portfolio
   */
  async removeCompanyFromPortfolio(portfolioId: string, domain: string): Promise<ApiResponse<any>> {
    return this.makeRequest('DELETE', `/portfolios/${portfolioId}/companies/${domain}`);
  }

  /**
   * Bulk add companies to portfolio
   */
  async bulkAddCompaniesToPortfolio(portfolioData: any, queryParams?: Record<string, any>): Promise<ApiResponse<any>> {
    return this.makeRequest('PUT', '/portfolios/companies/bulk-upload', { body: portfolioData, queryParams });
  }

  // === COMPANY SCORECARD METHODS ===

  /**
   * Get company score by domain
   */
  async getCompanyScore(domain: string): Promise<ApiResponse<any>> {
    return this.makeRequest('GET', `/companies/${domain}/score`);
  }

  /**
   * Get company scorecard by domain
   */
  async getCompanyScorecard(domain: string): Promise<ApiResponse<any>> {
    return this.makeRequest('GET', `/companies/${domain}`);
  }

  /**
   * Get company active issues (uses /issues endpoint with status filter due to API bug in /active-issues)
   */
  async getCompanyActiveIssues(domain: string, queryParams?: Record<string, any>): Promise<ApiResponse<any>> {
    const { size, ...rest } = { status: 'open', ...queryParams } as Record<string, any>;
    const result = await this.fetchAllPages('GET', `/companies/${domain}/issues`, {
      style: 'cursor',
      queryParams: rest,
      pageSize: typeof size === 'number' ? size : 50
    });
    return {
      data: { entries: result.entries, total: result.entries.length, truncated: result.truncated },
      status: 200,
      headers: new Headers()
    };
  }

  /**
   * Get company factors
   */
  async getCompanyFactors(domain: string): Promise<ApiResponse<any>> {
    return this.makeRequest('GET', `/companies/${domain}/factors`);
  }

  /**
   * Get company factor summary
   */
  async getCompanyFactorSummary(domain: string): Promise<ApiResponse<any>> {
    return this.makeRequest('GET', `/companies/${domain}/summary-factors`);
  }

  /**
   * Get company history events
   */
  async getCompanyHistoryEvents(domain: string, queryParams?: Record<string, any>): Promise<ApiResponse<any>> {
    return this.makeRequest('GET', `/companies/${domain}/history/events`, { queryParams });
  }

  /**
   * Get company score history
   */
  async getCompanyScoreHistory(domain: string, queryParams?: Record<string, any>): Promise<ApiResponse<any>> {
    return this.makeRequest('GET', `/companies/${domain}/history/score`, { queryParams });
  }

  /**
   * Get company expanded risk
   */
  async getCompanyExpandedRisk(domain: string, queryParams?: Record<string, any>): Promise<ApiResponse<any>> {
    return this.makeRequest('GET', `/companies/${domain}/expanded-risk`, { queryParams });
  }

  // === ISSUE METHODS ===

  /**
   * Get specific issue type for a company
   */
  async getCompanyIssueType(domain: string, issueType: string, queryParams?: Record<string, any>): Promise<ApiResponse<any>> {
    return this.makeRequest('GET', `/companies/${domain}/issues/${issueType}`, { queryParams });
  }

  /**
   * Get issue context
   */
  async getIssueContext(domain: string, issueType: string): Promise<ApiResponse<any>> {
    return this.makeRequest('GET', `/companies/${domain}/issue-context/${issueType}`);
  }

  // === SEARCH METHODS ===

  /**
   * Search companies
   */
  async searchCompanies(searchData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('POST', '/companies/bulk-searches', { body: searchData });
  }

  /**
   * Search scorecards v2
   */
  async searchScorecardsV2(queryParams?: Record<string, any>): Promise<ApiResponse<any>> {
    return this.makeRequest('GET', '/v2/scorecards/search', { queryParams });
  }

  // === TAG METHODS ===

  /**
   * Get all scorecard tags
   */
  async getScorecardTags(queryParams?: Record<string, any>): Promise<ApiResponse<any>> {
    return this.makeRequest('GET', '/scorecard-tags', { queryParams });
  }

  /**
   * Create a scorecard tag
   */
  async createScorecardTag(tagData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('POST', '/scorecard-tags', { body: tagData });
  }

  /**
   * Update a scorecard tag
   */
  async updateScorecardTag(tagId: string, tagData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('PUT', `/scorecard-tags/${tagId}`, { body: tagData });
  }

  /**
   * Delete a scorecard tag
   */
  async deleteScorecardTag(tagId: string): Promise<ApiResponse<any>> {
    return this.makeRequest('DELETE', `/scorecard-tags/${tagId}`);
  }

  /**
   * Add company to tag
   */
  async addCompanyToTag(tagId: string, domain: string): Promise<ApiResponse<any>> {
    return this.makeRequest('POST', `/scorecard-tags/${tagId}/companies/${domain}`);
  }

  /**
   * Remove company from tag
   */
  async removeCompanyFromTag(tagId: string, domain: string): Promise<ApiResponse<any>> {
    return this.makeRequest('DELETE', `/scorecard-tags/${tagId}/companies/${domain}`);
  }

  // === ASSET FOOTPRINT METHODS ===

  /**
   * Get asset domains for parent domain
   */
  async getAssetDomains(parentDomain: string, queryParams?: Record<string, any>): Promise<ApiResponse<any>> {
    return this.makeRequest('GET', `/footprint/${parentDomain}/assets/domains`, { queryParams });
  }

  /**
   * Get asset IPs for parent domain
   */
  async getAssetIps(parentDomain: string, queryParams?: Record<string, any>): Promise<ApiResponse<any>> {
    return this.makeRequest('GET', `/footprint/${parentDomain}/assets/ips`, { queryParams });
  }

  /**
   * Get assignees for assets
   */
  async getAssetAssignees(parentDomain: string, assetType: string, queryParams?: Record<string, any>): Promise<ApiResponse<any>> {
    return this.makeRequest('GET', `/footprint/${parentDomain}/assignees/${assetType}/assets`, { queryParams });
  }

  // === REPORTS METHODS ===

  /**
   * Generate assessment report
   */
  async generateAssessmentReport(reportData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('POST', '/reports/assessments', { body: reportData });
  }

  /**
   * Generate scorecard footprint report
   */
  async generateScorecardFootprintReport(reportData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('POST', '/reports/scorecard-footprint', { body: reportData });
  }

  // === GENERIC METHOD FOR ANY ENDPOINT ===

  /**
   * Generic method to call any SecurityScorecard API endpoint
   * Useful for endpoints not explicitly implemented above
   */
  async callEndpoint(method: string, endpoint: string, options?: {
    queryParams?: Record<string, any>;
    body?: any;
    headers?: Record<string, string>;
  }): Promise<ApiResponse<any>> {
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return this.makeRequest(method.toUpperCase(), path, options || {});
  }
}

// === HELPER FUNCTIONS ===

/**
 * Create a configured SecurityScorecard API client
 */
export function createSecurityScorecardClient(apiToken: string, baseUrl?: string): SecurityScorecardApiClient {
  return new SecurityScorecardApiClient({ apiToken, baseUrl });
}

/**
 * Validate API token format
 */
export function validateApiToken(token: string): boolean {
  return typeof token === 'string' && token.length > 10;
}

export default SecurityScorecardApiClient;
