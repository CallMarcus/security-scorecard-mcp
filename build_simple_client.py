#!/usr/bin/env python3
"""
Simple, reliable SecurityScorecard API Client Generator
Focuses on working TypeScript code without complex parameter parsing
"""

import json
import pathlib
import re

def generate_simple_client():
    """Generate a simple, working API client"""
    
    client_code = '''import { RequestOptions, ApiResponse } from '../types/api.js';

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
      throw new Error(`API request failed: ${response.status} ${response.statusText}\\n${errorText}`);
    }
    
    const data = await response.json();
    return {
      data,
      status: response.status,
      headers: response.headers,
    };
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
   * Get company scorecard by domain
   */
  async getCompanyScorecard(domain: string): Promise<ApiResponse<any>> {
    return this.makeRequest('GET', `/companies/${domain}`);
  }

  /**
   * Get company active issues
   */
  async getCompanyActiveIssues(domain: string, queryParams?: Record<string, any>): Promise<ApiResponse<any>> {
    return this.makeRequest('GET', `/companies/${domain}/active-issues`, { queryParams });
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
'''

    return client_code

def generate_simple_types():
    """Generate simple TypeScript types"""
    
    types_code = '''// SecurityScorecard API Types

export interface RequestOptions {
  queryParams?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

// === COMMON DATA TYPES ===

export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  privacy: 'public' | 'private';
  created_at: string;
  updated_at: string;
}

export interface Company {
  domain: string;
  name?: string;
  score: number;
  grade: string;
  factors: Factor[];
  size?: string;
  industry?: string;
}

export interface Factor {
  name: string;
  description: string;
  weight: number;
  score: number;
  grade: string;
}

export interface Issue {
  type: string;
  severity: 'informational' | 'low' | 'medium' | 'high' | 'critical';
  count: number;
  description?: string;
  detail_url?: string;
}

export interface ScoreHistory {
  date: string;
  score: number;
  grade: string;
}

export interface Tag {
  id: string;
  name: string;
  description?: string;
  color?: string;
  created_at: string;
}

export interface Asset {
  id: string;
  type: 'domain' | 'ip_address';
  name: string;
  first_seen?: string;
  last_seen?: string;
}

// === API REQUEST/RESPONSE TYPES ===

export interface PortfolioListResponse {
  entries: Portfolio[];
  count: number;
}

export interface CompanySearchRequest {
  query: string;
  limit?: number;
  offset?: number;
}

export interface CompanySearchResponse {
  entries: Company[];
  count: number;
  total: number;
}

export interface HistoryEventsResponse {
  entries: any[];
  count: number;
}

// === MCP TOOL TYPES ===

export interface FindingsByCategory {
  category: string;
  issues: Issue[];
  total_count: number;
  severity_breakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    informational: number;
  };
}

export interface RemediationReport {
  domain: string;
  current_score: number;
  grade: string;
  critical_findings: Issue[];
  high_findings: Issue[];
  recommendations: Recommendation[];
  estimated_score_improvement: number;
}

export interface Recommendation {
  issue_type: string;
  severity: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  description: string;
  remediation_steps: string[];
}

export interface AssetInventory {
  parent_domain: string;
  domains: Asset[];
  ip_addresses: Asset[];
  total_domains: number;
  total_ips: number;
  last_updated: string;
}
'''

    return types_code

def main():
    """Generate simple, working API client"""
    
    # Create directories
    pathlib.Path("src/api").mkdir(parents=True, exist_ok=True)
    pathlib.Path("src/types").mkdir(parents=True, exist_ok=True)
    
    # Generate simple client
    client_code = generate_simple_client()
    pathlib.Path("src/api/client.ts").write_text(client_code, encoding="utf-8")
    
    # Generate simple types
    types_code = generate_simple_types()
    pathlib.Path("src/types/api.ts").write_text(types_code, encoding="utf-8")
    
    print("✅ Generated simple, working API client!")
    print("📁 Files created:")
    print("   - src/api/client.ts (Main API client)")
    print("   - src/types/api.ts (TypeScript types)")
    print("\n🚀 Usage:")
    print("   import { createSecurityScorecardClient } from './src/api/client.js';")
    print("   const client = createSecurityScorecardClient(process.env.API_TOKEN!);")
    print("   const portfolios = await client.getPortfolios();")

if __name__ == "__main__":
    main()