// Auto-generated TypeScript types for SecurityScorecard API

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
}

// === API DATA TYPES ===

export interface FactorList {
  entries?: FactorListItem[];
}

export interface FactorListItem {
  /** permanent key for this factor */
  key?: string;
  /** human-readable name */
  name?: string;
  /** human-readable description */
  description?: string;
}

export interface IssueTypeList {
  entries?: IssueTypeListItem[];
}

export interface IssueTypeListItem {
  /** permanent key for this issue type */
  key?: string;
  /** severity of this type of issue */
  severity?: string;
  /** human-readable name */
  short_description?: string;
  /** human-readable description */
  long_description?: string;
  /** steps to resolve the issue */
  recommendation?: string;
}

export interface CompanyScoreHistory {
  /** list of historical scores (this can be empty if the company hasn't been scored yet) */
  entries?: CompanyScoreHistoryEntry[];
}

export interface CompanyFactorScoreHistory {
  /** list of historical factor scores (this can be empty if the company hasn't been scored yet) */
  entries?: CompanyFactorScoreHistoryEntry[];
}

export interface CompanyScoreHistoryEntry {
  /** primary domain of the company */
  domain?: string;
  /** effective date for this score */
  date?: string;
  /** company security score from 0 to 100 */
  score?: number;
}

export interface CompanyFactorScoreHistoryEntry {
  /** effective date for this score */
  date?: string;
  factors?: Record<string, any>[];
}

export interface IndustryScoreHistory {
  entries?: IndustryScoreHistoryEntry[];
}

export interface IndustryScoreHistoryEntry {
  /** industry (permanent key) */
  industry?: string;
  /** effective date for these scores */
  date?: string;
  /** minimum score for companies on this industry */
  minScore?: number;
  /** maximum score for companies on this industry */
  maxScore?: number;
  /** average score for companies on this industry */
  avgScore?: number;
}

export interface BusinessImpact {
}

export interface LifecycleStatus {
}

export interface DataTypesShared {
}

export interface Risk {
  /** The aggregate score of all 1st and 2nd connections detected for a company. */
  risk_score?: number;
}

export interface BusinessUnit {
}

export interface ContractEndDate {
}

export interface CompanyId {
}

export interface InternalContact {
}

export interface Company {
  /** ID of the company */
  id?: string;
  /** Domain of the company */
  domain?: string;
  /** Name of the company */
  name?: string;
  /** Date on which the company started to be followed */
  added_date?: string;
  /** Tags visible to the current user that are linked to the company */
  tags?: Record<string, any>[];
  /** Portfolios visible to the current user where the company belongs to */
  portfolios?: Record<string, any>[];
  /** Flag that determines if the company is monitored (belongs to at least one portfolio) or non-monitored */
  monitored?: boolean;
  business_impact?: BusinessImpact;
  lifecycle_status?: LifecycleStatus;
  data_types_shared?: DataTypesShared[];
  risk?: Risk;
  business_unit?: BusinessUnit;
  contract_end_date?: ContractEndDate;
  vendor_id?: CompanyId;
  internal_contact?: InternalContact;
}

export interface Note {
  id?: string;
  note?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: Record<string, any>;
  updated_by?: Record<string, any>;
}

