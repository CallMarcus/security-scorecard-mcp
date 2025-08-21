// SecurityScorecard API Types

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
