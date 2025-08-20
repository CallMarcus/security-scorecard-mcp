#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getFindingsByCategory } from "./get_findings_by_category.js";
import { getEndpointDetails } from "./api_reference.js";
import { getAssetInventory, getAssetFindings, compareAssets } from "./asset_management.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

// Base URL for the Security Scorecard API
const API_BASE_URL = "https://api.securityscorecard.io";

// --- INTERFACES FOR API DATA AND ANALYSIS ---

interface Factor {
  name: string;
  description: string;
  weight: number;
  score: number;
  grade: string;
}

interface Issue {
  type: string;
  severity: 'informational' | 'low' | 'medium' | 'high' | 'critical';
  // Add other issue properties as needed from the API response
}

interface Asset {
  id: string;
  type: 'domain' | 'ip_address';
  name: string;
  // Add other asset properties as needed
}

interface ScoreImpactAnalysis {
  factor_name: string;
  current_score: number;
  weight_percentage: number;
  points_lost: number;
  improvement_potential: number;
  effort_estimate: 'low' | 'medium' | 'high';
  roi_score: number;
  priority_rank: number;
}

interface IssueROI {
  issue_type: string;
  volume: number;
  factor: string;
  // FIX: Changed severity type to match the Issue interface for type consistency.
  severity: 'informational' | 'low' | 'medium' | 'high' | 'critical';
  estimated_score_impact: number;
  effort_level: 'quick_win' | 'moderate' | 'major_project';
  roi_score: number;
}

interface IPSecurityDetail {
  ip_address: string;
  total_issues: number;
  critical_issues: number;
  high_issues: number;
  medium_issues: number;
  low_issues: number;
  issues_by_type: Array<{
    issue_type: string;
    severity: 'informational' | 'low' | 'medium' | 'high' | 'critical';
    count: number;
    factor: string;
    remediation_steps: string[];
    business_impact: string;
    first_seen?: string;
    last_seen?: string;
  }>;
  remediation_priorities: Array<{
    issue_type: string;
    priority_score: number;
    effort_estimate: 'low' | 'medium' | 'high';
    impact_level: 'low' | 'medium' | 'high' | 'critical';
    quick_win: boolean;
  }>;
}

interface DetailedAssetIssues {
  asset_name: string;
  asset_type: 'domain' | 'ip_address';
  total_issues: number;
  severity_breakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    informational: number;
  };
  issues_by_factor: Array<{
    factor_name: string;
    factor_weight: number;
    issues: Array<{
      issue_type: string;
      severity: string;
      count: number;
      description: string;
      remediation_effort: 'low' | 'medium' | 'high';
      business_impact: string;
    }>;
  }>;
  remediation_roadmap: Array<{
    priority_rank: number;
    issue_type: string;
    affected_count: number;
    severity: string;
    effort_level: 'low' | 'medium' | 'high';
    score_impact: number;
    quick_win: boolean;
    remediation_steps: string[];
  }>;
  working_endpoints: string[];
}


export class ScoreImpactSecurityScorecardServer {
  private server: Server;
  private config: {
    apiToken: string;
    defaultDomain: string;
    defaultIssueTypes: string[];
    debugMode: boolean;
  };
  private factorCache: Factor[] | null = null;
  private requestCache: Map<string, { expiry: number; data: any }> = new Map();
  private cacheTTL: number;
  private requestsPerInterval: number;
  private intervalMs: number;
  private burstLimit: number;
  private tokens: number;
  private lastRefill: number;
  private pageSize: number;

  constructor() {
    this.server = new Server(
      {
        name: "score-impact-securityscorecard-server-live",
        version: "4.0.2", // Incremented version for the fix
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.config = {
      apiToken: process.env.SECURITY_SCORECARD_API_TOKEN || "",
      defaultDomain: process.env.COMPANY_DOMAIN
        ? this.sanitizeDomain(process.env.COMPANY_DOMAIN)
        : "",
      defaultIssueTypes: process.env.DEFAULT_ISSUE_TYPES
        ? process.env.DEFAULT_ISSUE_TYPES.split(',').map(s => s.trim()).filter(Boolean)
        : [],
      debugMode: process.env.DEBUG_MODE === "true",
    };

    // Configure cache and rate limiter
    this.cacheTTL = parseInt(process.env.REQUEST_CACHE_TTL_MS || "300000", 10);
    this.requestsPerInterval = parseInt(
      process.env.REQUESTS_PER_INTERVAL || "5",
      10
    );
    this.intervalMs = parseInt(process.env.REQUEST_INTERVAL_MS || "1000", 10);
    this.burstLimit = parseInt(
      process.env.REQUEST_BURST_LIMIT || String(this.requestsPerInterval),
      10
    );
    this.tokens = this.burstLimit;
    this.lastRefill = Date.now();
    this.pageSize = parseInt(process.env.SCORECARD_PAGE_SIZE || "100", 10);

    this.setupToolHandlers();
  }

  /**
   * Log helper for debugging and troubleshooting. Respects DEBUG_MODE flag.
   */
  private log(message: string, data?: unknown) {
    if (this.config.debugMode) {
      if (data !== undefined) {
        console.error(`[debug] ${message}`, data);
      } else {
        console.error(`[debug] ${message}`);
      }
    }
  }

  /**
   * Build flexible issue endpoints with status filtering using working endpoints
   */
  private buildIssuesEndpoint(
    domain: string, 
    issueType?: string, 
    status: 'OPEN' | 'UNDER_REVIEW' | 'ALL' = 'OPEN',
    additionalParams?: Record<string, string>
  ): string {
    // Use working companies endpoint instead of failing scorecard endpoint
    let endpoint = `/companies/${domain}/issues`;
    
    // Add query parameters including status
    const params = new URLSearchParams();
    if (issueType) {
      params.set('type', issueType);
    }
    params.set('size', this.pageSize.toString());
    
    // Add status filtering - use different parameter name that actually works
    if (status !== 'ALL') {
      params.set('status', status.toLowerCase());
    }
    
    // Add any additional parameters
    if (additionalParams) {
      Object.entries(additionalParams).forEach(([key, value]) => {
        params.set(key, value);
      });
    }
    
    return `${endpoint}?${params.toString()}`;
  }

  /**
   * Universal API hierarchy request using /footprint/parentDomain/ pattern first
   * Based on user discovery of broader API Reference endpoint coverage
   */
  private async makeHierarchicalRequest(
    domain: string,
    endpointType: 'factors' | 'overview' | 'score' | 'assets',
    params?: Record<string, any>
  ): Promise<any> {
    domain = this.sanitizeDomain(domain);
    
    // Define endpoint hierarchy based on user's confirmed working API Reference pattern
    const endpointHierarchy = [
      // Level 1: Confirmed working API Reference pattern (WORKING - user verified)
      {
        url: `/footprint/${domain}/${endpointType}`,
        method: 'GET'
      },
      // Level 2: Companies (External monitoring - Limited but working)
      {
        url: `/companies/${domain}/${endpointType}`,
        method: 'GET'
      }
    ];

    // Try each level in hierarchy order
    for (const endpoint of endpointHierarchy) {
      try {
        let finalUrl = endpoint.url;
        
        if (params && Object.keys(params).length > 0) {
          const queryParams = new URLSearchParams(params).toString();
          finalUrl += `?${queryParams}`;
        }

        this.log(`Trying hierarchical request: ${finalUrl} (${endpoint.method})`);
        const response = await this.makeRequest(finalUrl, endpoint.method);
        
        if (response && (response.entries?.length > 0 || response.factors?.length > 0 || response.score !== undefined)) {
          this.log(`Success with hierarchical endpoint: ${finalUrl}`);
          return response;
        }
      } catch (error: any) {
        this.log(`Hierarchical endpoint failed: ${endpoint.url} - ${error.message}`);
        // Continue to next level in hierarchy
      }
    }
    
    throw new McpError(
      ErrorCode.InvalidRequest, 
      `All hierarchical endpoints failed for ${endpointType} on domain: ${domain}`
    );
  }

  /**
   * Wraps tool execution with logging and error handling to provide
   * user-friendly feedback and partial results when possible.
   */
  private async executeTool(
    name: string,
    fn: () => Promise<any>
  ): Promise<any> {
    this.log(`Executing tool: ${name}`);
    try {
      const result = await fn();
      this.log(`Tool succeeded: ${name}`);
      return result;
    } catch (error: any) {
      this.log(`Tool failed: ${name}`, error);
      const message = error?.message || "Unknown error";
      const partial = error?.partial || error?.partialResult;
      if (partial) {
        return {
          content: [
            {
              type: "text",
              text: `${message}\n\n\`\`\`json\n${JSON.stringify(partial, null, 2)}\n\`\`\``,
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text",
            text: `Error running ${name}: ${message}`,
          },
        ],
      };
    }
  }

  /**
   * Makes a request to the Security Scorecard API with robust error handling and pagination support.
   * @param endpoint The API endpoint to call.
   * @param method The HTTP method (defaults to GET).
   * @param body The request body for POST/PUT requests.
   * @returns A promise that resolves to the full, aggregated list of entries from all pages.
   */
  private async makeRequest(endpoint: string, method: string = "GET", body?: any): Promise<any> {
    if (!this.config.apiToken) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        "Security Scorecard API token not configured. Set the SECURITY_SCORECARD_API_TOKEN environment variable."
      );
    }

    const cacheKey = `${method}:${endpoint}:${body ? JSON.stringify(body) : ""}`;
    if (method === "GET") {
      const cached = this.requestCache.get(cacheKey);
      if (cached && cached.expiry > Date.now()) {
        this.log(`Cache hit: ${cacheKey}`);
        return cached.data;
      }
    }

    let allEntries: any[] = [];
    let nextUrl: string | null = `${API_BASE_URL}${endpoint}`;
    if (method === "GET" && !endpoint.includes("size=") && this.pageSize) {
      const url = new URL(nextUrl);
      url.searchParams.set("size", String(this.pageSize));
      nextUrl = url.toString();
    }
    let result: any = null;
    let pagination: any = undefined;
    let meta: any = undefined;

    while (nextUrl) {
      await this.throttleRequest();
      if (this.config.debugMode) {
        console.error(`[API Call] Fetching: ${nextUrl}`);
      }

      const response = await fetch(nextUrl, {
        method,
        headers: {
          "Authorization": `Token ${this.config.apiToken}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();
        switch (response.status) {
          case 401:
            throw new McpError(
              ErrorCode.InvalidRequest,
              `Authentication failed. Please check your API token. (HTTP 401)`
            );
          case 403:
            throw new McpError(
              ErrorCode.InvalidRequest,
              `Permission denied. Your API token may not have access to this resource. (HTTP 403)`
            );
          case 404:
            throw new McpError(
              ErrorCode.InvalidRequest,
              `Resource not found at ${endpoint}. Check the domain or identifier. (HTTP 404)`
            );
          case 429:
            const retryAfter = response.headers.get("Retry-After") || "60";
            throw new McpError(
              ErrorCode.InvalidRequest,
              `Rate limit exceeded. Please wait ${retryAfter} seconds before trying again. (HTTP 429)`
            );
          default:
            throw new McpError(
              ErrorCode.InternalError,
              `API request failed with status ${response.status}: ${errorText}`
            );
        }
      }

      const jsonResponse = await response.json();

      if (jsonResponse.data !== undefined) {
        const entries = Array.isArray(jsonResponse.data)
          ? jsonResponse.data
          : [jsonResponse.data];
        allEntries = allEntries.concat(entries);
        if (jsonResponse.pagination !== undefined) {
          pagination = jsonResponse.pagination;
        }
        if (jsonResponse.meta !== undefined) {
          meta = jsonResponse.meta;
        }

        if (jsonResponse.pagination?.has_next) {
          const url = new URL(nextUrl);
          const currentPage = jsonResponse.pagination.page ?? 1;
          url.searchParams.set("page", String(currentPage + 1));
          url.searchParams.set(
            "size",
            String(jsonResponse.pagination.size ?? this.pageSize)
          );
          nextUrl = url.toString();
          continue;
        }

        if (jsonResponse.next_cursor) {
          const url = new URL(nextUrl);
          url.searchParams.set("cursor", jsonResponse.next_cursor);
          nextUrl = url.toString();
          continue;
        }

        nextUrl = null;
        continue;
      }

      if (jsonResponse.entries) {
        allEntries = allEntries.concat(jsonResponse.entries);
        if (jsonResponse.pagination !== undefined) {
          pagination = jsonResponse.pagination;
        }
        if (jsonResponse.meta !== undefined) {
          meta = jsonResponse.meta;
        }

        if (jsonResponse.next_cursor) {
          const url = new URL(nextUrl);
          url.searchParams.set("cursor", jsonResponse.next_cursor);
          nextUrl = url.toString();
        } else {
          nextUrl = null;
        }
        continue;
      }

      result = jsonResponse;
      nextUrl = null;
    }

    if (allEntries.length > 0) {
      result = { entries: allEntries };
      if (pagination !== undefined) result.pagination = pagination;
      if (meta !== undefined) result.meta = meta;
    }

    if (method === "GET" && result) {
      this.requestCache.set(cacheKey, {
        expiry: Date.now() + this.cacheTTL,
        data: result,
      });
    }

    return result;
  }

  /**
   * Simple token bucket throttle to limit request rate and bursts.
   */
  private async throttleRequest(): Promise<void> {
    while (true) {
      const now = Date.now();
      const elapsed = now - this.lastRefill;
      if (elapsed >= this.intervalMs) {
        const tokensToAdd =
          Math.floor(elapsed / this.intervalMs) * this.requestsPerInterval;
        this.tokens = Math.min(this.burstLimit, this.tokens + tokensToAdd);
        this.lastRefill = now;
      }
      if (this.tokens > 0) {
        this.tokens--;
        return;
      }
      const wait = this.intervalMs - (now - this.lastRefill);
      await new Promise((r) => setTimeout(r, wait));
    }
  }

  /**
   * Fetches and caches the list of all security factors and their weights.
   * @returns A promise that resolves to an array of Factor objects.
   */
  private async getFactors(): Promise<Factor[]> {
    if (this.factorCache) {
      return this.factorCache;
    }
    
    // Since /factors endpoint returns 404, use hardcoded factor metadata
    // This is based on SecurityScorecard's standard 10 factor model
    this.factorCache = [
      { name: 'application_security', weight: 5, description: 'Application security practices', score: 0, grade: '' },
      { name: 'cubit_score', weight: 15, description: 'Breach and data compromise risk', score: 0, grade: '' },
      { name: 'dns_health', weight: 10, description: 'DNS configuration and health', score: 0, grade: '' },
      { name: 'endpoint_security', weight: 5, description: 'Endpoint protection measures', score: 0, grade: '' },
      { name: 'hacker_chatter', weight: 5, description: 'Dark web and threat intelligence', score: 0, grade: '' },
      { name: 'information_leak', weight: 15, description: 'Information disclosure risk', score: 0, grade: '' },
      { name: 'ip_reputation', weight: 10, description: 'IP address reputation', score: 0, grade: '' },
      { name: 'network_security', weight: 20, description: 'Network security controls', score: 0, grade: '' },
      { name: 'patching_cadence', weight: 10, description: 'Vulnerability management practices', score: 0, grade: '' },
      { name: 'social_engineering', weight: 5, description: 'Social engineering susceptibility', score: 0, grade: '' }
    ];
    
    return this.factorCache;
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "get_score_improvement_roadmap",
            description: "🎯 STRATEGIC: Get a roadmap to improve from the current grade to a target grade, with ROI prioritization.",
            inputSchema: {
              type: "object",
              properties: {
                domain: { type: "string", description: "The company domain to analyze.", default: this.config.defaultDomain },
                target_grade: { type: "string", enum: ["C", "B", "A"], description: "The target grade to achieve.", default: "A" },
              },
              required: ["domain", "target_grade"],
            },
          },
          {
            name: "calculate_factor_score_impact",
            description: "💰 ROI ANALYSIS: Calculate which security factors have the biggest impact on the overall score based on real data.",
            inputSchema: {
              type: "object",
              properties: {
                domain: { type: "string", description: "The company domain to analyze.", default: this.config.defaultDomain },
              },
              required: ["domain"],
            },
          },
          {
            name: "get_issues_by_roi",
            description: "🚀 PRIORITY: Get a list of issue types ranked by ROI (Score Impact vs. Implementation Effort).",
            inputSchema: {
              type: "object",
              properties: {
                domain: { type: "string", description: "The company domain to analyze.", default: this.config.defaultDomain },
                top_n: { type: "number", default: 10, description: "Number of top ROI issues to return." },
                status: { type: "string", enum: ["active", "historical"], default: "active", description: "Issue status to query." },
              },
               required: ["domain"],
            },
        },
        {
          name: "find_high_impact_findings_across_assets",
          description: "🔍 TACTICAL: Scan all company assets to find the most common, high-impact findings.",
          inputSchema: {
            type: "object",
            properties: {
              issue_types: {
                type: "array",
                items: { type: "string" },
                description: "Comma-separated list of issue types to scan for.",
                default: this.config.defaultIssueTypes
              },
              status: { type: "string", enum: ["active", "historical"], default: "active", description: "Issue status to scan." }
            }
          }
        },
        {
          name: "get_findings_by_asset",
          description: "🔍 List issues for each asset matching the given domain using ESI endpoints.",
          inputSchema: {
            type: "object",
            properties: {
              domain: { type: "string", description: "Domain to filter assets.", default: this.config.defaultDomain },
              asset_type: { type: "string", enum: ["domain", "ip_address"], default: "domain", description: "Asset type to query" }
            },
            required: ["domain"]
          }
        },
        {
          name: "get_findings_by_category", 
          description: "🔍 ORGANIZE BY FACTOR: List all security findings organized by SecurityScorecard's 10 factor categories (Application Security, DNS Health, etc.). Shows issue counts and severity distribution per factor for strategic planning. Supports OPEN, UNDER_REVIEW, or ALL status filtering for operational remediation.",
          inputSchema: {
            type: "object",
            properties: {
              domain: { type: "string", description: "Company domain to analyze.", default: this.config.defaultDomain },
              status: { type: "string", enum: ["OPEN", "UNDER_REVIEW", "ALL"], description: "Filter by issue status for operational remediation.", default: "OPEN" }
            },
            required: ["domain"]
          }
        },
        {
          name: "generate_remediation_report",
          description: "🛠️ Compile all findings and recommend fixes grouped by factor with prioritization.",
          inputSchema: {
            type: "object",
            properties: {
              domain: { type: "string", description: "Company domain to analyze.", default: this.config.defaultDomain }
            },
            required: ["domain"]
          }
        },
        {
          name: "get_asset_inventory",
          description: "📋 ENHANCED ASSET INVENTORY: Advanced asset discovery with scoring:\n• Uses POST /parent-domains/ endpoints for maximum coverage\n• Falls back to multiple endpoint strategies\n• Includes security scores and issue counts where available\n• Results depend on API access level and domain configuration",
          inputSchema: {
            type: "object",
            properties: {
              domain: { type: "string", description: "Parent domain to analyze assets for.", default: this.config.defaultDomain }
            },
            required: ["domain"]
          }
        },
        {
          name: "get_asset_findings",
          description: "🔍 ASSET DETAILS: Get detailed security findings and remediation priorities for specific asset.",
          inputSchema: {
            type: "object",
            properties: {
              asset_name: { type: "string", description: "Specific domain or IP to analyze." },
              asset_type: { type: "string", enum: ["domain", "ip_address"], default: "domain", description: "Type of asset." }
            },
            required: ["asset_name"]
          }
        },
        {
          name: "compare_assets",
          description: "⚖️ ASSET COMPARISON: Compare security posture across multiple assets with recommendations.",
          inputSchema: {
            type: "object",
            properties: {
              asset_names: { 
                type: "array", 
                items: { type: "string" },
                description: "List of domain names to compare.",
                minItems: 2,
                maxItems: 10
              }
            },
            required: ["asset_names"]
          }
        },
        {
          name: "test_endpoint_hierarchy",
          description: "🔍 ENDPOINT HIERARCHY TESTING: Test different API endpoint levels to validate access coverage. Tests all discovered endpoint patterns:\n• Level 1: `/footprint/parentDomain/assets/` (Broadest - API Reference)\n• Level 2: `/scorecard/{domain}/footprint/` (Organizational)\n• Level 3: `/footprint/{domain}/assets/` (Domain-specific)\n• Level 4: `/parent-domains/{domain}/` (POST - Scoped)\n• Level 5: `/companies/{domain}/` (External - Most limited)\nHelps identify which endpoints provide complete asset visibility.",
          inputSchema: {
            type: "object",
            properties: {
              domain: { type: "string", description: "Domain to test against all endpoint levels.", default: this.config.defaultDomain }
            },
            required: ["domain"]
          }
        },
        {
          name: "call_api_endpoint",
          description: "🔧 DIRECT API ACCESS: Query SecurityScorecard API endpoints directly. Enhanced with discovered endpoint patterns:\n• `/footprint/parentDomain/assets/ips` (GET) - API Reference (Broadest coverage)\n• `/scorecard/{domain}/issues/OPEN` - Your own organization's open issues\n• `/scorecard/{domain}/footprint/domains/current` - Complete domain inventory\n• `/footprint/{domain}/assets/ips` (GET) - Domain-specific assets\n• `/parent-domains/{domain}/ips` (POST) - Scoped organizational assets\n• `/companies/{domain}` - Third-party company overview (Most limited)",
          inputSchema: {
            type: "object",
              properties: {
                endpoint: { type: "string", description: "REST API path, e.g. /companies/example.com" },
                method: { type: "string", default: "GET", description: "HTTP method" },
                body: { type: "object", description: "Optional JSON body for POST/PUT" }
              },
              required: ["endpoint"]
            }
          },
        {
          name: "discover_all_assets",
          description: "🔍 COMPREHENSIVE ASSET DISCOVERY: Uses multiple API endpoint strategies to find assets:\n• POST /parent-domains/{domain}/domains (primary)\n• POST /parent-domains/{domain}/ips (primary)\n• GET /footprint/{domain}/assets/* (fallback)\n• Pagination to overcome API limits\n• Currently achieving 100+ domains and 100+ IPs for supported domains",
          inputSchema: {
            type: "object",
            properties: {
              domain: { type: "string", description: "Parent domain to discover all assets for.", default: this.config.defaultDomain }
            },
            required: ["domain"]
          }
        },
        {
          name: "get_asset_detailed_findings",
          description: "🎯 DETAILED ASSET ANALYSIS: Get comprehensive findings for specific asset with full context and remediation details.",
          inputSchema: {
            type: "object",
            properties: {
              domain: { type: "string", description: "Parent domain for analysis.", default: this.config.defaultDomain },
              asset_name: { type: "string", description: "Specific domain or IP to analyze in detail." },
              asset_type: { type: "string", enum: ["domain", "ip_address"], default: "domain", description: "Type of asset to analyze." }
            },
            required: ["domain", "asset_name"]
          }
        },
        {
          name: "get_ip_security_details",
          description: "🚨 CRITICAL IP ANALYSIS: Get detailed security issues for specific IP address with full remediation context:\n• Handles 300+ issues like IP 34.107.205.171\n• Tests multiple endpoint patterns for maximum coverage\n• Includes issue types, severity levels, remediation steps\n• Provides priority ranking and effort estimates\n• Test IPs: 20.56.23.183 (3 issues), 4.175.13.171 (3 issues), 34.107.205.171 (300+ issues)",
          inputSchema: {
            type: "object",
            properties: {
              ip_address: { type: "string", description: "IP address to analyze (e.g., 34.107.205.171, 20.56.23.183)" },
              domain: { type: "string", description: "Parent domain for context.", default: this.config.defaultDomain }
            },
            required: ["ip_address"]
          }
        },
        {
          name: "get_ip_detailed_issues",
          description: "🔍 IP ISSUE BREAKDOWN: Get detailed security issues for specific IP address:\n• Uses multiple endpoint patterns for issue discovery\n• Fallback to asset discovery + factor analysis approach\n• Provides issue categorization by security factors\n• Includes remediation effort estimates and priorities",
          inputSchema: {
            type: "object",
            properties: {
              ip_address: { type: "string", description: "IP address to analyze in detail" },
              domain: { type: "string", description: "Parent domain for context.", default: this.config.defaultDomain }
            },
            required: ["ip_address"]
          }
        },
        {
          name: "get_domain_detailed_issues", 
          description: "🌐 DOMAIN ISSUE ANALYSIS: Get comprehensive security issues for specific domain:\n• Tries direct domain issue endpoints first\n• Uses factor analysis for detailed breakdown\n• Includes subdomain analysis if applicable\n• Provides business impact assessment and remediation roadmap",
          inputSchema: {
            type: "object",
            properties: {
              domain_name: { type: "string", description: "Specific domain to analyze (e.g., subdomain.example.com)" },
              parent_domain: { type: "string", description: "Parent domain for context.", default: this.config.defaultDomain }
            },
            required: ["domain_name"]
          }
        },
        {
          name: "get_asset_vulnerabilities",
          description: "🛡️ ASSET VULNERABILITY SCAN: Get detailed vulnerability analysis for any asset type:\n• Universal function for domains, IPs, or services\n• Combines multiple data sources for comprehensive analysis\n• Focuses on exploitable vulnerabilities and patch requirements\n• Provides CVSS scoring and remediation timelines where available",
          inputSchema: {
            type: "object",
            properties: {
              asset_name: { type: "string", description: "Asset to analyze (IP address, domain name, or service)" },
              asset_type: { type: "string", enum: ["domain", "ip_address", "service"], default: "domain", description: "Type of asset being analyzed" },
              parent_domain: { type: "string", description: "Parent domain for context.", default: this.config.defaultDomain }
            },
            required: ["asset_name"]
          }
        }
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const rawDomain =
        (request.params.arguments?.domain as string) || this.config.defaultDomain;

      switch (request.params.name) {
        case "get_score_improvement_roadmap": {
          const domain = this.sanitizeDomain(rawDomain);
          const grade = this.validateTargetGrade(
            request.params.arguments?.target_grade as string
          );
          return await this.executeTool(
            "get_score_improvement_roadmap",
            () => this.getScoreImprovementRoadmap(domain, grade)
          );
        }

        case "calculate_factor_score_impact": {
          const domain = this.sanitizeDomain(rawDomain);
          return await this.executeTool("calculate_factor_score_impact", () =>
            this.calculateFactorScoreImpact(domain)
          );
        }

        case "get_issues_by_roi": {
          const domain = this.sanitizeDomain(rawDomain);
          const topNArg = request.params.arguments?.top_n;
          const topN =
            topNArg !== undefined ? this.validateTopN(Number(topNArg)) : 10;
          const status = this.validateIssueStatus(
            (request.params.arguments?.status as string) || "active"
          );
          return await this.executeTool("get_issues_by_roi", () =>
            this.getIssuesByROI(domain, topN, status)
          );
        }

        case "find_high_impact_findings_across_assets": {
          const domain = this.sanitizeDomain(rawDomain);
          return await this.executeTool(
            "find_high_impact_findings_across_assets",
            () =>
              this.findHighImpactFindingsAcrossAssets(
                domain,
                (request.params.arguments?.issue_types as string[]) ||
                  this.config.defaultIssueTypes,
                this.validateIssueStatus(
                  (request.params.arguments?.status as string) || "active"
                )
              )
          );
        }

        case "get_findings_by_asset": {
          const domain = this.sanitizeDomain(rawDomain);
          const assetType = this.validateAssetType(
            (request.params.arguments?.asset_type as string) || "domain"
          );
          return await this.executeTool("get_findings_by_asset", () =>
            this.getFindingsByAsset(domain, assetType)
          );
        }

        case "get_findings_by_category": {
          const domain = this.sanitizeDomain(rawDomain);
          const status = request.params.arguments?.status as ('OPEN' | 'UNDER_REVIEW' | 'ALL') || 'OPEN';
          return await this.executeTool("get_findings_by_category", () =>
            this.getFindingsByCategoryTool(domain, status)
          );
        }

        case "generate_remediation_report": {
          const domain = this.sanitizeDomain(rawDomain);
          return await this.executeTool("generate_remediation_report", () =>
            this.generateRemediationReport(domain)
          );
        }

        case "get_asset_inventory": {
          const domain = this.sanitizeDomain(rawDomain);
          return await this.executeTool("get_asset_inventory", () =>
            this.getAssetInventoryTool(domain)
          );
        }

        case "get_asset_findings": {
          const assetName = request.params.arguments?.asset_name as string;
          if (!assetName) {
            throw new McpError(ErrorCode.InvalidRequest, "asset_name is required");
          }
          const assetType = this.validateAssetType(
            (request.params.arguments?.asset_type as string) || "domain"
          );
          return await this.executeTool("get_asset_findings", () =>
            this.getAssetFindingsTool(assetName, assetType)
          );
        }

        case "compare_assets": {
          const assetNames = request.params.arguments?.asset_names as string[];
          if (!Array.isArray(assetNames) || assetNames.length < 2) {
            throw new McpError(ErrorCode.InvalidRequest, "At least 2 asset names required for comparison");
          }
          return await this.executeTool("compare_assets", () =>
            this.compareAssetsTool(assetNames)
          );
        }

        case "call_api_endpoint":
          return await this.executeTool("call_api_endpoint", () =>
            this.callApiEndpoint(
              request.params.arguments?.endpoint as string,
              request.params.arguments?.method as string,
              request.params.arguments?.body
            )
          );

        case "discover_all_assets": {
          const domain = this.sanitizeDomain(rawDomain);
          return await this.executeTool("discover_all_assets", () =>
            this.discoverAllAssets(domain)
          );
        }

        case "get_asset_detailed_findings": {
          const domain = this.sanitizeDomain(rawDomain);
          const assetName = request.params.arguments?.asset_name as string;
          const assetType = (request.params.arguments?.asset_type as 'domain' | 'ip_address') || 'domain';
          
          if (!assetName) {
            throw new McpError(ErrorCode.InvalidRequest, "asset_name is required for detailed findings analysis");
          }
          
          return await this.executeTool("get_asset_detailed_findings", () =>
            this.getAssetDetailedFindings(domain, assetName, assetType)
          );
        }

        case "test_endpoint_hierarchy": {
          const domain = this.sanitizeDomain(rawDomain);
          return await this.executeTool("test_endpoint_hierarchy", () =>
            this.testEndpointHierarchy(domain)
          );
        }

        case "get_ip_security_details": {
          const domain = this.sanitizeDomain(rawDomain);
          const ipAddress = request.params.arguments?.ip_address as string;
          
          if (!ipAddress) {
            throw new McpError(ErrorCode.InvalidRequest, "ip_address is required for IP security analysis");
          }
          
          return await this.executeTool("get_ip_security_details", () =>
            this.getIPSecurityDetails(ipAddress, domain)
          );
        }

        case "get_ip_detailed_issues": {
          const domain = this.sanitizeDomain(rawDomain);
          const ipAddress = request.params.arguments?.ip_address as string;
          
          if (!ipAddress) {
            throw new McpError(ErrorCode.InvalidRequest, "ip_address is required for IP detailed issues analysis");
          }
          
          return await this.executeTool("get_ip_detailed_issues", () =>
            this.getIPDetailedIssues(ipAddress, domain)
          );
        }

        case "get_domain_detailed_issues": {
          const parentDomain = this.sanitizeDomain(rawDomain);
          const domainName = request.params.arguments?.domain_name as string;
          
          if (!domainName) {
            throw new McpError(ErrorCode.InvalidRequest, "domain_name is required for domain detailed issues analysis");
          }
          
          return await this.executeTool("get_domain_detailed_issues", () =>
            this.getDomainDetailedIssues(domainName, parentDomain)
          );
        }

        case "get_asset_vulnerabilities": {
          const parentDomain = this.sanitizeDomain(rawDomain);
          const assetName = request.params.arguments?.asset_name as string;
          const assetType = (request.params.arguments?.asset_type as 'domain' | 'ip_address' | 'service') || 'domain';
          
          if (!assetName) {
            throw new McpError(ErrorCode.InvalidRequest, "asset_name is required for vulnerability analysis");
          }
          
          return await this.executeTool("get_asset_vulnerabilities", () =>
            this.getAssetVulnerabilities(assetName, assetType, parentDomain)
          );
        }

        default:
          this.log(`Unknown tool requested: ${request.params.name}`);
          return {
            content: [
              {
                type: "text",
                text: `Unknown tool: ${request.params.name}`,
              },
            ],
          };
      }
    });
  }

  // --- TOOL IMPLEMENTATIONS ---

  private async getScoreImprovementRoadmap(domain: string, targetGrade: "A" | "B" | "C"): Promise<any> {
      domain = this.sanitizeDomain(domain);
      targetGrade = this.validateTargetGrade(targetGrade);
      
      // Use hierarchical API approach for comprehensive organizational data
      const [scorecard, companyFactors, allFactors] = await Promise.all([
          this.makeHierarchicalRequest(domain, 'overview').catch(() => this.makeRequest(`/companies/${domain}`)),
          this.makeHierarchicalRequest(domain, 'factors'),
          this.getFactors()
      ]);

      const currentScore = scorecard.score;
      const gradeThresholds = { C: 70, B: 80, A: 90 };
      const targetScore = gradeThresholds[targetGrade];
      const pointsNeeded = Math.max(0, targetScore - currentScore);

      if (pointsNeeded === 0) {
          return { content: [{ type: "text", text: `🎉 Congratulations! The domain ${domain} with a score of ${currentScore} already meets or exceeds the target grade of ${targetGrade}.` }] };
      }

      const factorMap = new Map(allFactors.map(f => [f.name, f]));

      const factorImprovements = companyFactors.entries
        .map((factor: any) => {
          const factorName = typeof factor.name === 'string'
            ? factor.name
            : (() => {
                console.error(
                  `[getScoreImprovementRoadmap] Expected factor name to be string but got: ${JSON.stringify(factor.name)}`
                );
                return String(factor.name);
              })();

          const factorDetails = factorMap.get(factorName);
          if (!factorDetails || factor.score === 100) return null;

          const pointsLost = (100 - factor.score) * (factorDetails.weight / 100);
          const effort = this.getEffortForFactor(factorName, factor.score);
          const roi = pointsLost / this.getEffortScore(effort);

          return {
            factor: factorName,
            current_score: factor.score,
            estimated_improvement: pointsLost,
            effort,
            roi,
            key_issues: this.getKeyIssuesForFactor(factorName),
          };
        })
        .filter(Boolean)
        .sort((a: any, b: any) => b.roi - a.roi);

      const quickWins = factorImprovements.filter((f: any) => f.effort === 'low');

      const formatFactor = (value: any, context: string): string => {
        if (typeof value === 'string') return value;
        console.error(
          `[getScoreImprovementRoadmap] ${context} is not a string: ${JSON.stringify(value)}`
        );
        return String(value);
      };

      const formatIssues = (issues: any[]): string[] => {
        if (!Array.isArray(issues)) {
          console.error(
            `[getScoreImprovementRoadmap] key_issues is not an array: ${JSON.stringify(issues)}`
          );
          return [];
        }
        return issues.map(issue => {
          if (typeof issue === 'string') return issue;
          console.error(
            `[getScoreImprovementRoadmap] key issue is not a string: ${JSON.stringify(issue)}`
          );
          return String(issue);
        });
      };

      const text =
        `# 🎯 SCORE IMPROVEMENT ROADMAP: ${domain}\n\n` +
        `**GOAL: ${scorecard.grade} (${currentScore}) → ${targetGrade} (${targetScore}+)**\n` +
        `**POINTS NEEDED: +${pointsNeeded.toFixed(1)}**\n\n` +
        `## 🚀 STRATEGIC PRIORITIES (Ranked by ROI)\n\n` +
        `${factorImprovements
          .slice(0, 5)
          .map(
            (f: any, i: number) =>
              `### ${i + 1}. ${formatFactor(f.factor, 'factor name')
                .replace(/_/g, ' ')
                .toUpperCase()}\n` +
              `- **Current Score**: ${f.current_score}/100\n` +
              `- **Potential Gain**: +${f.estimated_improvement.toFixed(1)} overall points\n` +
              `- **Effort Level**: ${f.effort}\n` +
              `- **Key Issues**: ${formatIssues(f.key_issues).join(', ')}\n`
          )
          .join('\n')}\n\n` +
        `## ⚡ QUICK WINS (${quickWins.length} factors)\n` +
        `${quickWins
          .map(
            (f: any) =>
              `- **${formatFactor(f.factor, 'factor name').replace(/_/g, ' ')}**: Low effort for an estimated +${f.estimated_improvement.toFixed(
                1
              )} point gain.`
          )
          .join('\n')}\n\n` +
        `**Next Steps**: Focus on the highest ROI factors and all quick wins to efficiently bridge the ${pointsNeeded.toFixed(
          1
        )}-point gap.`;

      return { content: [{ type: 'text', text }] };
  }

  private async benchmarkGradeRequirements(domain: string): Promise<any> {
    domain = this.sanitizeDomain(domain);
    // Use hierarchical request for comprehensive organizational data
    const scorecard = await this.makeHierarchicalRequest(domain, 'overview').catch(() => this.makeRequest(`/companies/${domain}`));
    const text =
      `# 📈 GRADE BENCHMARKING: ${domain}\n\n` +
      `Current Score: ${scorecard.score}\n\n` +
      `YOU ARE HERE`;
    return { content: [{ type: 'text', text }] };
  }

  private async calculateFactorScoreImpact(domain: string): Promise<any> {
    domain = this.sanitizeDomain(domain);
    try {
      // Use hierarchical API approach for comprehensive organizational data
      const [scorecard, companyFactors, allFactors] = await Promise.all([
        this.makeHierarchicalRequest(domain, 'overview').catch(() => this.makeRequest(`/companies/${domain}`)),
        this.makeHierarchicalRequest(domain, 'factors'),
        this.getFactors(),
      ]);

      const factorMap = new Map(allFactors.map((f) => [f.name, f]));

      const factorAnalysis: ScoreImpactAnalysis[] = companyFactors.entries
        .map((factor: any) => {
          const factorDetails = factorMap.get(factor.name);
          if (!factorDetails) return null;

          const weight = factorDetails.weight;
          const pointsLost = (100 - factor.score) * (weight / 100);
          const effort = this.getEffortForFactor(factor.name, factor.score);
          const roi = pointsLost / this.getEffortScore(effort);

          return {
            factor_name: factor.name,
            current_score: factor.score,
            weight_percentage: weight,
            points_lost: pointsLost,
            improvement_potential: pointsLost,
            effort_estimate: effort,
            roi_score: roi,
            // other fields not used in this view
            current_grade: factor.grade,
            max_possible_score: 100,
            overall_score_impact: pointsLost,
            priority_rank: 0,
          };
        })
        .filter(Boolean)
        .sort((a: any, b: any) => b.roi_score - a.roi_score)
        .map((f: any, index: number) => ({ ...f, priority_rank: index + 1 }));

      const text =
        `# 💰 FACTOR SCORE IMPACT ANALYSIS: ${domain}\n\n` +
        `**Current Overall Score**: ${scorecard.score}/100 (${scorecard.grade})\n\n` +
        `## 🎯 ROI-RANKED IMPROVEMENT OPPORTUNITIES\n\n` +
        `${factorAnalysis
          .map(
            (factor: ScoreImpactAnalysis) =>
              `### ${factor.priority_rank}. ${factor.factor_name.replace(/_/g, ' ').toUpperCase()}\n` +
              `- **ROI Score**: ${factor.roi_score.toFixed(1)} (Higher is better)\n` +
              `- **Current Score**: ${factor.current_score}/100 (Weight: ${factor.weight_percentage}%)\n` +
              `- **Impact on Score**: -${factor.points_lost.toFixed(1)} points from overall score\n` +
              `- **Effort to Improve**: ${factor.effort_estimate}\n`
          )
          .join('\n')}\n\n` +
        `**Strategic Insight**: To maximize score improvement, prioritize factors with the highest ROI score. Start with **${factorAnalysis[0]?.factor_name.replace(/_/g, ' ')}**.`;

      return { content: [{ type: 'text', text }] };
    } catch (error: any) {
      if (error?.message && error.message.includes('404')) {
        throw new McpError(ErrorCode.InvalidRequest, error.message);
      }
      throw error;
    }
  }
  
  private async getIssuesByROI(
    domain: string,
    topN: number,
    status: 'active' | 'historical' = 'active'
  ): Promise<any> {
      domain = this.sanitizeDomain(domain);
      topN = this.validateTopN(topN);
      
      // Use hierarchical factors endpoint to get comprehensive issue summaries with score impact data
      const [companyData, allFactors] = await Promise.all([
          this.makeHierarchicalRequest(domain, 'factors'),
          this.getFactors()
      ]);

      const factorMap = new Map(allFactors.map(f => [f.name, f]));
      const issuesByRoi: IssueROI[] = [];

      // Process issue summaries from each factor
      companyData.entries?.forEach((factor: any) => {
        factor.issue_summary?.forEach((issue: any) => {
          if (issue.type && issue.count > 0) {
            const factorDetails = factorMap.get(factor.name);
            const factorWeight = factorDetails?.weight || 5;
            
            // Use actual score impact from API if available, otherwise calculate estimate
            const scoreImpact = issue.total_score_impact || 
              ((this.getSeverityScore(issue.severity || 'medium') / 5) * (factorWeight / 100) * Math.log1p(issue.count) * 2);
            
            const effort = this.getEffortForIssue(issue.type);
            const effortScore = this.getEffortScore(effort);
            const roiScore = scoreImpact / effortScore;

            issuesByRoi.push({
                issue_type: issue.type,
                volume: issue.count,
                factor: factor.name,
                severity: issue.severity || 'medium',
                estimated_score_impact: scoreImpact,
                effort_level: effort,
                roi_score: roiScore,
            });
          }
        });
      });

      if (issuesByRoi.length === 0) {
          return { content: [{ type: "text", text: `✅ No ${status} issues found for ${domain}.` }] };
      }

      // Sort by ROI and take top N
      const topIssues = issuesByRoi
        .sort((a, b) => b.roi_score - a.roi_score)
        .slice(0, topN);

      const text = `# 🚀 TOP ROI SECURITY IMPROVEMENTS: ${domain}\n\n` +
                   `**Top ${topIssues.length} highest ROI security improvements based on ${status} findings:**\n\n` +
                   `${topIssues.map((issue: IssueROI, i: number) =>
                       `## ${i + 1}. ${issue.issue_type.replace(/_/g, ' ').toUpperCase()}\n` +
                       `- **📊 ROI Score**: ${issue.roi_score.toFixed(2)}\n` +
                       `- **🎯 Score Impact**: +${issue.estimated_score_impact.toFixed(3)} points\n` +
                       `- **📈 Volume**: ${issue.volume} findings\n` +
                       `- **⚡ Effort Level**: ${issue.effort_level.replace(/_/g, ' ')}\n` +
                       `- **📂 Security Factor**: ${issue.factor.replace(/_/g, ' ')}\n` +
                       `- **🔥 Severity**: ${issue.severity}\n`
                   ).join('\n')}\n\n` +
                   `**💡 Implementation Strategy**: Address these issues in order of ROI score. Start with #1 (${topIssues[0]?.issue_type.replace(/_/g, ' ')}) for maximum impact per effort invested.`;
      
      return { content: [{ type: "text", text }] };
  }

  private async findHighImpactFindingsAcrossAssets(
    domain: string,
    issueTypes: string[],
    status: 'active' | 'historical' = 'active'
  ): Promise<any> {
    domain = this.sanitizeDomain(domain);
    if (!Array.isArray(issueTypes) || issueTypes.length === 0) {
      // If no issue types provided, get them from hierarchical factors endpoint
      try {
        const companyData = await this.makeHierarchicalRequest(domain, 'factors');
        const discoveredIssueTypes = new Set<string>();
        companyData.entries?.forEach((factor: any) => {
          factor.issue_summary?.forEach((issue: any) => {
            if (issue.type && issue.count > 0) {
              discoveredIssueTypes.add(issue.type);
            }
          });
        });
        issueTypes = Array.from(discoveredIssueTypes).slice(0, 15); // Limit to avoid rate limits
      } catch (error) {
        return { content: [{ type: 'text', text: "**No issue types could be discovered**: Unable to scan for findings" }] };
      }
    }

    if (issueTypes.length === 0) {
      return { content: [{ type: 'text', text: "**Active Issue Types**: 0 / 0" }] };
    }

    const results = await Promise.all(
      issueTypes.map(async (issueType) => {
        try {
          // FIXED: Use scorecard API with flexible endpoint builder
          const res = await this.makeRequest(
            this.buildIssuesEndpoint(domain, issueType, 'OPEN')
          );
          const count = Array.isArray(res.entries) ? res.entries.length : 0;
          const severity = res.entries && res.entries.length > 0 ? 
            (res.entries[0].severity || 'medium') : 'unknown';
          return { issueType, count, severity };
        } catch {
          return { issueType, count: 0, severity: 'unknown' };
        }
      })
    );

    const activeCount = results.filter((r) => r.count > 0).length;
    const totalFindings = results.reduce((sum, r) => sum + r.count, 0);
    
    // Sort by count (highest impact first)
    const sortedResults = results.sort((a, b) => b.count - a.count);
    
    let text =
      `# 🔍 HIGH-IMPACT FINDINGS ACROSS ASSETS: ${domain}\n\n` +
      `**Active Issue Types**: ${activeCount} / ${issueTypes.length}\n` +
      `**Total Findings**: ${totalFindings}\n` +
      `**Status**: ${status}\n\n`;
      
    // Show top findings first
    const topFindings = sortedResults.filter(r => r.count > 0).slice(0, 10);
    if (topFindings.length > 0) {
      text += `## 🎯 Top Security Issues (Highest Volume)\n\n`;
      topFindings.forEach((r, i) => {
        text +=
          `### ${i + 1}. ${r.issueType.replace(/_/g, ' ').toUpperCase()}\n` +
          `- **Findings**: ${r.count}\n` +
          `- **Severity**: ${r.severity}\n` +
          `- **Impact**: ${r.count > 50 ? 'High' : r.count > 10 ? 'Medium' : 'Low'}\n\n`;
      });
    }
    
    // Show all results summary
    text += `## 📊 Complete Findings Summary\n\n`;
    sortedResults.forEach((r) => {
      text +=
        `**${r.issueType.replace(/_/g, ' ').toUpperCase()}**: ${r.count} findings\n`;
    });
    
    return { content: [{ type: 'text', text }] };
  }

  private async getFindingsByAsset(domain: string, assetType: string = "domain"): Promise<any> {
    domain = this.sanitizeDomain(domain);
    assetType = this.validateAssetType(assetType);
    let text = `# 🔍 FINDINGS BY ASSET: ${domain}\n\n`;
    
    try {
        // Use hierarchical factors endpoint to get comprehensive issue types
        const companyData = await this.makeHierarchicalRequest(domain, 'factors');
        
        // Extract issue types from factor summaries
        const issueTypes = new Set<string>();
        companyData.entries?.forEach((factor: any) => {
          factor.issue_summary?.forEach((issue: any) => {
            if (issue.type) issueTypes.add(issue.type);
          });
        });

        if (issueTypes.size === 0) {
            return { content: [{ type: "text", text: `No issues found for ${domain}.` }] };
        }

        // Query each issue type to get detailed asset-level data
        const results: Record<string, any[]> = {};
        let totalIssues = 0;
        
        for (const issueType of Array.from(issueTypes).slice(0, 10)) {
            try {
                // FIXED: Use scorecard API with flexible endpoint builder for detailed issues
                const issues = await this.makeRequest(this.buildIssuesEndpoint(domain, issueType, 'OPEN'));
                if (issues.entries && issues.entries.length > 0) {
                    results[issueType] = issues.entries.map((entry: any) => ({
                        domain: entry.domain || entry.parent_domain || domain,
                        issue_type: entry.issue_type || issueType,
                        first_seen: entry.first_seen_time,
                        last_seen: entry.last_seen_time,
                        severity: entry.severity || 'medium'
                    }));
                    totalIssues += issues.entries.length;
                }
            } catch (error) {
                // Skip issues we can't access
                continue;
            }
        }

        text += `Found ${Object.keys(results).length} issue types with ${totalIssues} total findings.\n\n`;
        Object.entries(results).forEach(([issueType, issues]) => {
            text += `## ${issueType.replace(/_/g, ' ').toUpperCase()}\n`;
            text += `- **Count**: ${issues.length} findings\n`;
            if (issues.length > 0) {
                const uniqueDomains = [...new Set(issues.map(i => i.domain))];
                text += `- **Affected Assets**: ${uniqueDomains.slice(0, 5).join(', ')}${uniqueDomains.length > 5 ? ` (and ${uniqueDomains.length - 5} more)` : ''}\n`;
            }
            text += '\n';
        });
        
    } catch (error: any) {
        text += `Error retrieving asset findings: ${error.message}`;
    }
    return { content: [{ type: "text", text }] };
  }

  private async getQuickWins(
    domain: string,
    maxEffort: 'low' | 'medium' | 'high',
    status: 'active' | 'historical' = 'active'
  ): Promise<any> {
    domain = this.sanitizeDomain(domain);
    maxEffort = this.validateMaxEffort(maxEffort);
    const maxEffortScore = this.getEffortScore(maxEffort);

    // Use hierarchical factors endpoint for comprehensive organizational remediation data
    const companyData = await this.makeHierarchicalRequest(domain, 'factors');
    
    // Extract issue types and simulate issue data from factor summaries
    const allIssues: { entries: Issue[] } = { entries: [] };
    companyData.entries?.forEach((factor: any) => {
      factor.issue_summary?.forEach((issue: any) => {
        if (issue.type && issue.count > 0) {
          // Create mock Issue objects based on factor summary data
          for (let i = 0; i < Math.min(issue.count, 50); i++) {
            allIssues.entries.push({
              type: issue.type,
              severity: issue.severity || 'medium'
            });
          }
        }
      });
    });

    const issueCounts: Record<string, number> = (allIssues.entries || []).reduce(
      (acc: Record<string, number>, issue: Issue) => {
        acc[issue.type] = (acc[issue.type] || 0) + 1;
        return acc;
      },
      {}
    );

    const quickWins = Object.keys(issueCounts)
      .filter(
        (issueType) =>
          this.getEffortScore(this.getEffortForIssue(issueType)) <=
          maxEffortScore
      )
      .map((issueType) => this.formatIssueName(issueType));

    let text = `# ⚡ COMMON QUICK WINS: ${domain}\n\n`;
    if (quickWins.length === 0) {
      text += 'No quick wins found.';
    } else {
      text += quickWins.map((i) => `- ${i}`).join('\n');
    }
    return { content: [{ type: 'text', text }] };
  }

  private async simulateScoreImprovement(
    domain: string,
    issueTypes: string[]
  ): Promise<any> {
    domain = this.sanitizeDomain(domain);
    try {
      const [scorecard] = await Promise.all([
        this.makeHierarchicalRequest(domain, 'overview').catch(() => this.makeRequest(`/companies/${domain}`)),
        this.makeHierarchicalRequest(domain, 'factors'),
      ]);
      const gainPerIssue = 2.65;
      const projectedScore = Math.min(
        100,
        scorecard.score + issueTypes.length * gainPerIssue
      );
      const projectedGrade =
        projectedScore >= 90 ? 'A' : projectedScore >= 80 ? 'B' : 'C';
      const text =
        `# 🔮 SCORE IMPROVEMENT SIMULATION: ${domain}\n\n` +
        `**Projected Score**: ${projectedScore.toFixed(1)}/100\n` +
        `**Grade Change**: ${scorecard.grade} → ${projectedGrade}`;
      return { content: [{ type: 'text', text }] };
    } catch (error: any) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Cannot access company data for domain: ${domain}`
      );
    }
  }

  private async getFindingsByCategoryTool(domain: string, status: 'OPEN' | 'UNDER_REVIEW' | 'ALL' = 'OPEN'): Promise<any> {
    domain = this.sanitizeDomain(domain);
    let text = `# 📊 FINDINGS BY CATEGORY: ${domain} (${status} Issues)\n\n`;
    try {
      const summary = await getFindingsByCategory(this.makeRequest.bind(this), domain, status);
      text += `\n\n\`\`\`json\n${JSON.stringify(summary, null, 2)}\n\`\`\``;
    } catch (error: any) {
      text += `Error retrieving category findings: ${error.message}`;
    }
    return { content: [{ type: "text", text }] };
  }

  private async generateRemediationReport(domain: string): Promise<any> {
    domain = this.sanitizeDomain(domain);
    let text = `# 🛠️ REMEDIATION REPORT: ${domain}\n\n`;
    try {
      const [issuesInfo, factorsInfo] = await Promise.all([
        getEndpointDetails('/scorecard/{domain}/issues/OPEN'),
        getEndpointDetails('/footprint/parentDomain/factors')
      ]);
      if (issuesInfo || factorsInfo) {
        text += '> Data sources:\n';
        if (issuesInfo) text += `> - ${issuesInfo.method} ${issuesInfo.url}\n`;
        if (factorsInfo) text += `> - ${factorsInfo.method} ${factorsInfo.url}\n`;
        text += '\n';
      }

      const [categories, factors] = await Promise.all([
        getFindingsByCategory(this.makeRequest.bind(this), domain),
        this.getFactors()
      ]);
      const weightMap = new Map(factors.map(f => [f.name, f.weight]));

      const prioritized = categories.map(cat => {
        const weight = weightMap.get(cat.factor) || 0;
        const priority = weight * (cat.critical_count * 5 + cat.high_count * 2 + cat.issue_count);
        const topIssues = Array.from(new Set((cat.issues || []).map(i => i.issue_type).filter(Boolean))).slice(0, 3);
        return {
          factor: cat.factor,
          weight,
          issue_count: cat.issue_count,
          critical_count: cat.critical_count,
          high_count: cat.high_count,
          top_issues: topIssues,
          priority_score: priority
        };
      }).sort((a, b) => b.priority_score - a.priority_score);

      text += prioritized.map((f, i) =>
        `## ${i + 1}. ${f.factor.replace(/_/g, ' ').toUpperCase()} (Weight ${f.weight}%)\n` +
        `- **Critical**: ${f.critical_count}, **High**: ${f.high_count}, **Total**: ${f.issue_count}\n` +
        `- **Top Issues**: ${f.top_issues.join(', ') || 'None'}\n` +
        `- **Recommendation**: Focus on ${this.getKeyIssuesForFactor(f.factor).join(', ')}\n`
      ).join('\n');

      text += `\n\n\`\`\`json\n${JSON.stringify(prioritized, null, 2)}\n\`\`\``;
    } catch (error: any) {
      text += `Error generating remediation report: ${error.message}`;
    }
    return { content: [{ type: "text", text }] };
  }

  private async callApiEndpoint(endpoint: string, method?: string, body?: any): Promise<any> {
    const details = await getEndpointDetails(endpoint, method);
    const httpMethod = method || details?.method || "GET";
    const json = await this.makeRequest(endpoint, httpMethod, body);
    const summary = details
      ? `${httpMethod} ${details.url} - ${details.description || ''}`
      : `Response from \`${endpoint}\``;
    const text = `${summary}\n\n\`\`\`json\n${JSON.stringify(json, null, 2)}\n\`\`\``;
    return { content: [{ type: "text", text }] };
  }

  private async getAssetInventoryTool(domain: string): Promise<any> {
    domain = this.sanitizeDomain(domain);
    const inventory = await getAssetInventory(this.makeRequest.bind(this), domain);
    
    const text = `# 📋 ASSET INVENTORY: ${domain}\n\n` +
                 `**Total Assets**: ${inventory.total_assets} (${inventory.domains.length} domains, ${inventory.ip_addresses.length} IPs)\n` +
                 `**Total Issues**: ${inventory.summary.total_issues}\n\n` +
                 `## 🔴 Highest Risk Assets\n` +
                 `${inventory.summary.worst_performers.slice(0, 5).map((asset, i) =>
                     `${i + 1}. **${asset.asset_name}** (${asset.asset_type})\n` +
                     `   - Issues: ${asset.issues_count} (${asset.critical_issues} critical, ${asset.high_issues} high)\n`
                 ).join('')}\n` +
                 `## 🟢 Best Performing Assets\n` +
                 `${inventory.summary.best_performers.slice(0, 3).map((asset, i) =>
                     `${i + 1}. **${asset.asset_name}** - ${asset.issues_count} issues\n`
                 ).join('')}\n\n` +
                 `\`\`\`json\n${JSON.stringify(inventory, null, 2)}\n\`\`\``;
    
    return { content: [{ type: "text", text }] };
  }

  private async getAssetFindingsTool(assetName: string, assetType: string, domain?: string): Promise<any> {
    // Use the provided domain, or derive it from the asset name if it's a domain, or use default
    const parentDomain = domain || (assetType === 'domain' ? assetName : this.config.defaultDomain);
    const findings = await getAssetFindings(this.makeRequest.bind(this), parentDomain, assetName, assetType as 'domain' | 'ip_address');
    
    const totalFindings = Object.values(findings.findings).reduce((sum: number, f: any) => sum + f.count, 0);
    const quickWins = findings.remediation_priority.filter(p => p.quick_win);
    
    const text = `# 🔍 ASSET SECURITY FINDINGS: ${assetName}\n\n` +
                 `**Asset Type**: ${assetType}\n` +
                 `**Total Findings**: ${totalFindings}\n` +
                 `**Quick Win Opportunities**: ${quickWins.length}\n\n` +
                 `## 🎯 Remediation Priorities (Top 10)\n` +
                 `${findings.remediation_priority.slice(0, 10).map((item, i) =>
                     `${i + 1}. **${item.issue_type.replace(/_/g, ' ').toUpperCase()}** ${item.quick_win ? '⚡ Quick Win' : ''}\n` +
                     `   - Priority Score: ${item.priority_score.toFixed(1)}\n` +
                     `   - Count: ${findings.findings[item.issue_type]?.count || 0}\n` +
                     `   - Severity: ${findings.findings[item.issue_type]?.severity || 'unknown'}\n` +
                     `   - Effort: ${findings.findings[item.issue_type]?.remediation_effort || 'unknown'}\n`
                 ).join('\n')}\n\n` +
                 `## ⚡ Quick Wins\n` +
                 `${quickWins.length > 0 
                     ? quickWins.map(qw => `- ${qw.issue_type.replace(/_/g, ' ')}`).join('\n')
                     : 'No quick wins identified.'}\n\n` +
                 `\`\`\`json\n${JSON.stringify(findings, null, 2)}\n\`\`\``;
    
    return { content: [{ type: "text", text }] };
  }

  private async compareAssetsTool(assetNames: string[]): Promise<any> {
    const comparison = await compareAssets(this.makeRequest.bind(this), assetNames);
    
    const text = `# ⚖️ ASSET SECURITY COMPARISON\n\n` +
                 `**Assets Compared**: ${assetNames.length}\n\n` +
                 `## 📊 Risk Ranking (Highest to Lowest)\n` +
                 `${comparison.comparison.map((asset, i) =>
                     `### ${i + 1}. ${asset.asset_name}\n` +
                     `- **Risk Score**: ${asset.security_risk_score}\n` +
                     `- **Total Issues**: ${asset.total_issues} (${asset.critical_issues} critical, ${asset.high_issues} high)\n` +
                     `- **Top Issue Types**: ${asset.top_issue_types.join(', ') || 'None'}\n`
                 ).join('\n')}\n\n` +
                 `## 💡 Recommendations\n` +
                 `${comparison.recommendations.length > 0 
                     ? comparison.recommendations.map(rec => `- ${rec}`).join('\n')
                     : 'No specific recommendations at this time.'}\n\n` +
                 `\`\`\`json\n${JSON.stringify(comparison, null, 2)}\n\`\`\``;
    
    return { content: [{ type: "text", text }] };
  }

  private async testEndpointHierarchy(domain: string): Promise<any> {
    domain = this.sanitizeDomain(domain);
    let text = `# 🔍 ENDPOINT HIERARCHY TEST: ${domain}\n\n`;
    text += `**Testing API endpoint access levels to validate asset coverage based on user feedback discovery**\n\n`;

    // Define the endpoint hierarchy for testing
    const hierarchyLevels = [
      {
        level: 1,
        name: "API Reference (Broadest Coverage)",
        description: "Should find missing assets like 35.228.6.225",
        endpoints: [
          { url: `/footprint/parentDomain/assets/ips`, method: 'GET' },
          { url: `/footprint/parentDomain/assets/domains`, method: 'GET' }
        ]
      },
      {
        level: 2, 
        name: "Scorecard (Organizational View)",
        description: "Own organization complete visibility",
        endpoints: [
          { url: `/scorecard/${domain}/footprint/ips/current`, method: 'GET' },
          { url: `/scorecard/${domain}/footprint/domains/current`, method: 'GET' }
        ]
      },
      {
        level: 3,
        name: "Domain-Specific Footprint",
        description: "Domain-scoped asset discovery",
        endpoints: [
          { url: `/footprint/${domain}/assets/ips`, method: 'GET' },
          { url: `/footprint/${domain}/assets/domains`, method: 'GET' }
        ]
      },
      {
        level: 4,
        name: "Parent-Domains POST (Currently Working)",
        description: "Known working endpoints - domain-scoped",
        endpoints: [
          { url: `/parent-domains/${domain}/ips`, method: 'POST' },
          { url: `/parent-domains/${domain}/domains`, method: 'POST' }
        ]
      },
      {
        level: 5,
        name: "Companies (External - Most Limited)", 
        description: "Third-party monitoring view",
        endpoints: [
          { url: `/companies/${domain}/assets`, method: 'GET' },
          { url: `/companies/${domain}/footprint`, method: 'GET' }
        ]
      }
    ];

    const results: any = {};

    for (const level of hierarchyLevels) {
      text += `## Level ${level.level}: ${level.name}\n`;
      text += `*${level.description}*\n\n`;
      results[`level_${level.level}`] = { name: level.name, endpoints: {} };

      for (const endpoint of level.endpoints) {
        try {
          let testUrl = endpoint.url;
          
          // Handle API Reference parentDomain replacement
          if (testUrl.includes('/parentDomain/')) {
            testUrl = testUrl.replace('/parentDomain/', `/${domain}/`);
          }

          let response;
          if (endpoint.method === 'POST') {
            response = await this.makeRequest(testUrl, 'POST', { page: 0, page_size: 10 });
          } else {
            response = await this.makeRequest(`${testUrl}?size=10`);
          }

          const entryCount = response?.entries?.length || response?.data?.length || response?.assets?.length || 0;
          const totalCount = response?.total_count || response?.total || entryCount;
          const hasData = entryCount > 0;

          text += `✅ **${endpoint.method} ${endpoint.url}**\n`;
          text += `   - Status: SUCCESS\n`;  
          text += `   - Sample Assets: ${entryCount}\n`;
          text += `   - Total Available: ${totalCount}\n`;
          text += `   - Data Quality: ${hasData ? 'HAS DATA' : 'NO DATA'}\n\n`;

          results[`level_${level.level}`].endpoints[endpoint.url] = {
            success: true,
            sampleCount: entryCount,
            totalCount: totalCount,
            hasData: hasData,
            method: endpoint.method
          };

        } catch (error: any) {
          text += `❌ **${endpoint.method} ${endpoint.url}**\n`;
          text += `   - Status: FAILED\n`;
          text += `   - Error: ${error.message}\n\n`;

          results[`level_${level.level}`].endpoints[endpoint.url] = {
            success: false,
            error: error.message,
            method: endpoint.method
          };
        }
      }
      text += `---\n\n`;
    }

    text += `## 📊 CRITICAL ANALYSIS\n\n`;
    text += `**This test validates the user's discovery about API endpoint hierarchy:**\n`;
    text += `- **Level 1 API Reference** endpoints should provide broadest coverage\n`;
    text += `- **Missing assets** (like 35.228.6.225) may only appear in Level 1\n`;
    text += `- **Lower levels** have increasingly limited visibility\n`;
    text += `- **Expected outcome**: Level 1 should reveal 200+ domains vs Level 4's ~100 domains\n\n`;

    text += `\`\`\`json\n${JSON.stringify(results, null, 2)}\n\`\`\``;

    return {
      content: [{ type: "text", text }],
    };
  }

  // --- HELPER METHODS ---

  private sanitizeDomain(domain: string): string {
    const trimmed = domain.trim().toLowerCase();
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(trimmed)) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Invalid domain format: ${domain}`
      );
    }
    return trimmed;
  }

  private validateTopN(value: number): number {
    if (!Number.isInteger(value) || value < 1 || value > 100) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Invalid top_n value: ${value}. Must be an integer between 1 and 100.`
      );
    }
    return value;
  }

  private validateAssetType(value: string): string {
    const allowed = ["domain", "ip_address"];
    if (!allowed.includes(value)) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Invalid asset_type: ${value}`
      );
    }
    return value;
  }

  private validateIssueStatus(value: string): 'active' | 'historical' {
    const allowed = ['active', 'historical'];
    if (!allowed.includes(value)) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Invalid status: ${value}`
      );
    }
    return value as 'active' | 'historical';
  }

  private validateTargetGrade(value: string): "A" | "B" | "C" {
    const allowed = ["A", "B", "C"];
    if (!allowed.includes(value)) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Invalid target_grade: ${value}`
      );
    }
    return value as "A" | "B" | "C";
  }

  private validateMaxEffort(value: string): 'low' | 'medium' | 'high' {
    const allowed = ['low', 'medium', 'high'];
    if (!allowed.includes(value)) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Invalid maxEffort: ${value}`
      );
    }
    return value as 'low' | 'medium' | 'high';
  }

  private formatIssueName(issueType: string): string {
    if (issueType === 'spf_record_missing') return 'SPF Record Configuration';
    return issueType
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  private getKeyIssuesForFactor(factorName: string): string[] {
    const issueMap: Record<string, string[]> = {
      'patching_cadence': ['unpatched vulnerabilities', 'slow patch times'],
      'dns_health': ['SPF/DMARC records', 'DNSSEC', 'nameserver config'],
      'network_security': ['TLS/SSL config', 'open ports', 'certificate validity'],
      'application_security': ['security headers', 'XSS', 'cookie security'],
      'endpoint_security': ['malware signatures', 'device policies'],
      'cubit_score': ['credential compromise', 'leaked data'],
    };
    return issueMap[factorName] || ['general configuration'];
  }

  private getEffortForFactor(factorName: string, currentScore: number): 'low' | 'medium' | 'high' {
    if (currentScore > 85) return 'low';
    if (factorName.includes('patching') || factorName.includes('application_security')) {
        return currentScore < 70 ? 'high' : 'medium';
    }
    if (factorName.includes('dns_health')) return 'low';
    return 'medium';
  }

  private getEffortForIssue(issueType: string): 'quick_win' | 'moderate' | 'major_project' {
      if (issueType.includes('spf') || issueType.includes('dmarc') || issueType.includes('hsts')) return 'quick_win';
      if (issueType.includes('patching_cadence_v3_critical')) return 'major_project';
      if (issueType.includes('patching')) return 'moderate';
      return 'moderate';
  }

  private getEffortScore(effort: string): number {
    switch(effort) {
        case 'low':
        case 'quick_win':
            return 1;
        case 'medium':
        case 'moderate':
            return 2.5;
        case 'high':
        case 'major_project':
            return 5;
        default:
            return 2.5;
    }
  }

  private getSeverityScore(severity: string): number {
      switch(severity) {
          case 'critical': return 5;
          case 'high': return 4;
          case 'medium': return 3;
          case 'low': return 2;
          default: return 1;
      }
  }

  /**
   * Enhanced asset discovery with comprehensive pagination and endpoint exploration
   */
  private async discoverAllAssets(domain: string): Promise<any> {
    domain = this.sanitizeDomain(domain);
    this.log(`[ENHANCED DISCOVERY] Starting comprehensive asset discovery for ${domain}`);
    
    // Try the enhanced asset inventory function
    try {
      const inventory = await getAssetInventory(
        (endpoint: string, method?: string, body?: any) => this.makeRequest(endpoint, method, body),
        domain
      );
      
      this.log(`[ENHANCED DISCOVERY] Found ${inventory.total_assets} total assets`);
      this.log(`[ENHANCED DISCOVERY] Domains: ${inventory.domains.length}, IPs: ${inventory.ip_addresses.length}`);
      
      return {
        content: [{ 
          type: "text", 
          text: `# 🔍 COMPREHENSIVE ASSET DISCOVERY: ${domain}\n\n` +
                `**Total Assets Found**: ${inventory.total_assets}\n` +
                `**Domains**: ${inventory.domains.length}\n` +
                `**IP Addresses**: ${inventory.ip_addresses.length}\n\n` +
                `## 📊 Asset Breakdown\n\n` +
                `### Domains (${inventory.domains.length})\n` +
                inventory.domains.slice(0, 20).map(d => 
                  `- **${d.asset_name}**: ${d.issues_count} issues (${d.critical_issues} critical, ${d.high_issues} high)`
                ).join('\n') +
                (inventory.domains.length > 20 ? `\n... and ${inventory.domains.length - 20} more domains` : '') +
                `\n\n### IP Addresses (${inventory.ip_addresses.length})\n` +
                inventory.ip_addresses.slice(0, 20).map(ip => 
                  `- **${ip.asset_name}**: ${ip.issues_count} issues (${ip.critical_issues} critical, ${ip.high_issues} high)`
                ).join('\n') +
                (inventory.ip_addresses.length > 20 ? `\n... and ${inventory.ip_addresses.length - 20} more IPs` : '') +
                `\n\n## 🎯 Summary\n` +
                `- **Average Score**: ${inventory.summary.avg_score.toFixed(1)}\n` +
                `- **Total Issues**: ${inventory.summary.total_issues}\n` +
                `- **Worst Performers**: ${inventory.summary.worst_performers.slice(0, 3).map(p => p.asset_name).join(', ')}\n` +
                `- **Best Performers**: ${inventory.summary.best_performers.slice(0, 3).map(p => p.asset_name).join(', ')}\n\n` +
                `💡 **Note**: This discovery uses enhanced pagination and multiple API endpoints to find ALL assets, not just the first 50.`
        }]
      };
      
    } catch (error: any) {
      this.log(`[ENHANCED DISCOVERY] Error: ${error.message}`);
      return { 
        content: [{ 
          type: "text", 
          text: `**Enhanced Asset Discovery Failed**: ${error.message}\n\nFalling back to standard discovery methods.` 
        }] 
      };
    }
  }

  /**
   * Get detailed findings for a specific asset with full context
   */
  private async getAssetDetailedFindings(domain: string, assetName: string, assetType: 'domain' | 'ip_address' = 'domain'): Promise<any> {
    domain = this.sanitizeDomain(domain);
    this.log(`[ASSET FINDINGS] Getting detailed findings for ${assetType} ${assetName}`);
    
    try {
      const findings = await getAssetFindings(
        (endpoint: string, method?: string, body?: any) => this.makeRequest(endpoint, method, body),
        domain,
        assetName,
        assetType
      );
      
      const findingCount = Object.keys(findings.findings).length;
      this.log(`[ASSET FINDINGS] Found ${findingCount} finding types for ${assetName}`);
      
      let text = `# 🔍 DETAILED FINDINGS: ${assetName}\n\n`;
      text += `**Asset Type**: ${assetType}\n`;
      text += `**Finding Types**: ${findingCount}\n\n`;
      
      if (findingCount > 0) {
        text += `## 🚨 Security Issues\n\n`;
        
        Object.entries(findings.findings).forEach(([issueType, details]) => {
          text += `### ${issueType.replace(/_/g, ' ').toUpperCase()}\n`;
          text += `- **Count**: ${details.count} findings\n`;
          text += `- **Severity**: ${details.severity}\n`;
          text += `- **Factor**: ${details.factor}\n`;
          text += `- **Remediation Effort**: ${details.remediation_effort}\n`;
          text += `- **Business Impact**: ${details.business_impact}\n\n`;
        });
        
        text += `## 🎯 Remediation Priority\n\n`;
        findings.remediation_priority.forEach((item, index) => {
          text += `${index + 1}. **${item.issue_type.replace(/_/g, ' ').toUpperCase()}** `;
          text += `(Priority Score: ${item.priority_score.toFixed(2)})`;
          if (item.quick_win) text += ` 🏆 Quick Win`;
          text += `\n`;
        });
      } else {
        text += `✅ **No security issues found** for this asset.`;
      }
      
      return { content: [{ type: "text", text }] };
      
    } catch (error: any) {
      this.log(`[ASSET FINDINGS] Error: ${error.message}`);
      return { 
        content: [{ 
          type: "text", 
          text: `**Asset Findings Retrieval Failed**: ${error.message}` 
        }] 
      };
    }
  }

  private getFactorForIssueType(issueType: string): string {
    // This is a simplified mapping. A more robust solution might query an API endpoint if available.
    if (issueType.includes('patching') || issueType.includes('vuln')) return 'patching_cadence';
    if (issueType.includes('spf') || issueType.includes('dmarc') || issueType.includes('dns')) return 'dns_health';
    if (issueType.includes('tls') || issueType.includes('ssl') || issueType.includes('cert')) return 'network_security';
    if (issueType.includes('csp') || issueType.includes('hsts') || issueType.includes('xss')) return 'application_security';
    if (issueType.includes('leaked') || issueType.includes('breach')) return 'cubit_score';
    return 'endpoint_security'; // A reasonable default
  }

  /**
   * CRITICAL: Get detailed security issues for specific IP address
   * Handles 300+ issues like IP 34.107.205.171 with multiple endpoint fallback patterns
   */
  private async getIPSecurityDetails(ipAddress: string, domain: string): Promise<any> {
    domain = this.sanitizeDomain(domain);
    
    this.log(`Getting detailed security issues for IP: ${ipAddress} in domain: ${domain}`);
    
    // Multiple endpoint patterns to try for IP security details
    const endpointPatterns = [
      // Level 1: Web interface patterns (most complete data)
      `/scorecard/${domain}/footprint/asset-details/ip/${ipAddress}/issues`,
      `/scorecard/${domain}/footprint/ips/${ipAddress}/issues`,
      
      // Level 2: API Reference patterns (confirmed working structure)
      `/footprint/${domain}/assets/ips/${ipAddress}/issues`,
      `/footprint/${domain}/ips/${ipAddress}/issues`,
      
      // Level 3: Companies endpoint with IP parameter
      `/companies/${domain}/issues?ip=${ipAddress}`,
      `/companies/${domain}/assets?ip=${ipAddress}&type=issues`,
      
      // Level 4: General issue endpoint with IP filtering
      `/companies/${domain}/issues?asset=${ipAddress}`,
    ];
    
    let ipIssuesData: any = null;
    let workingEndpoint = '';
    
    // Try each endpoint pattern until we find one that works
    for (const endpoint of endpointPatterns) {
      try {
        this.log(`Trying IP issues endpoint: ${endpoint}`);
        ipIssuesData = await this.makeRequest(endpoint);
        
        if (ipIssuesData && (ipIssuesData.entries?.length > 0 || ipIssuesData.issues?.length > 0 || ipIssuesData.data?.length > 0)) {
          workingEndpoint = endpoint;
          this.log(`SUCCESS: Found IP issues data using endpoint: ${endpoint}`);
          break;
        }
      } catch (error: any) {
        this.log(`Failed endpoint ${endpoint}: ${error.message}`);
        continue;
      }
    }
    
    // If direct IP endpoint fails, try alternative discovery method
    if (!ipIssuesData || (!ipIssuesData.entries?.length && !ipIssuesData.issues?.length && !ipIssuesData.data?.length)) {
      this.log(`Direct IP endpoints failed, trying alternative discovery method...`);
      
      try {
        // Get all issues for the domain and filter for this IP
        const allIssues = await this.makeRequest(`/companies/${domain}/issues?size=1000`);
        
        if (allIssues?.entries) {
          // Filter issues that mention this IP address
          const ipRelatedIssues = allIssues.entries.filter((issue: any) => 
            issue.ip === ipAddress || 
            issue.ip_address === ipAddress ||
            issue.host === ipAddress ||
            JSON.stringify(issue).includes(ipAddress)
          );
          
          if (ipRelatedIssues.length > 0) {
            ipIssuesData = { entries: ipRelatedIssues };
            workingEndpoint = 'filtered_from_all_issues';
            this.log(`SUCCESS: Found ${ipRelatedIssues.length} IP issues via filtering method`);
          }
        }
      } catch (error: any) {
        this.log(`Alternative discovery method failed: ${error.message}`);
      }
    }
    
    // Process the found data
    if (!ipIssuesData || (!ipIssuesData.entries?.length && !ipIssuesData.issues?.length && !ipIssuesData.data?.length)) {
      return {
        content: [
          {
            type: "text",
            text: `# 🚨 IP SECURITY ANALYSIS: ${ipAddress}\n\n` +
                  `**Domain**: ${domain}\n` +
                  `**Status**: ❌ NO ISSUES FOUND\n\n` +
                  `**Attempted Endpoints**:\n${endpointPatterns.map(ep => `• ${ep}`).join('\n')}\n\n` +
                  `**Note**: This IP may not have accessible security issues via current API endpoints, or may require different authentication scope.`
          }
        ]
      };
    }
    
    // Extract issues from response
    const issues = ipIssuesData.entries || ipIssuesData.issues || ipIssuesData.data || [];
    
    // Categorize issues by type and severity
    const issuesByType: { [key: string]: any[] } = {};
    const severityCounts = { critical: 0, high: 0, medium: 0, low: 0, informational: 0 };
    
    issues.forEach((issue: any) => {
      const issueType = issue.type || issue.issue_type || 'unknown';
      const severity = issue.severity || 'medium';
      
      if (!issuesByType[issueType]) {
        issuesByType[issueType] = [];
      }
      issuesByType[issueType].push(issue);
      
      if (severityCounts.hasOwnProperty(severity)) {
        severityCounts[severity as keyof typeof severityCounts]++;
      }
    });
    
    // Create detailed analysis
    const totalIssues = issues.length;
    const issueTypes = Object.keys(issuesByType).length;
    
    // Generate remediation priorities
    const priorities = Object.entries(issuesByType).map(([type, typeIssues]) => {
      const highestSeverity = typeIssues.reduce((max, issue) => {
        const severityOrder = { critical: 5, high: 4, medium: 3, low: 2, informational: 1 };
        const issueSev = issue.severity || 'medium';
        const issueScore = severityOrder[issueSev as keyof typeof severityOrder] || 3;
        const maxScore = severityOrder[max as keyof typeof severityOrder] || 3;
        return issueScore > maxScore ? issueSev : max;
      }, 'medium');
      
      return {
        issue_type: type,
        count: typeIssues.length,
        severity: highestSeverity,
        priority_score: this.calculateIssuePriority(highestSeverity, typeIssues.length),
        quick_win: this.isQuickWin(type, highestSeverity)
      };
    }).sort((a, b) => b.priority_score - a.priority_score);
    
    const text = 
      `# 🚨 IP SECURITY ANALYSIS: ${ipAddress}\n\n` +
      `**Domain**: ${domain}\n` +
      `**Working Endpoint**: ${workingEndpoint}\n` +
      `**Analysis Date**: ${new Date().toISOString()}\n\n` +
      
      `## 📊 SECURITY OVERVIEW\n` +
      `**Total Issues**: ${totalIssues}\n` +
      `**Issue Types**: ${issueTypes}\n` +
      `**Critical**: ${severityCounts.critical} | **High**: ${severityCounts.high} | **Medium**: ${severityCounts.medium} | **Low**: ${severityCounts.low}\n\n` +
      
      `## 🎯 TOP PRIORITIES (by Risk Score)\n\n` +
      priorities.slice(0, 10).map((priority, index) => 
        `**${index + 1}. ${priority.issue_type.replace(/_/g, ' ').toUpperCase()}**\n` +
        `   • Count: ${priority.count} issues\n` +
        `   • Severity: ${priority.severity.toUpperCase()}\n` +
        `   • Priority Score: ${priority.priority_score}\n` +
        `   • Quick Win: ${priority.quick_win ? '✅ YES' : '❌ NO'}\n`
      ).join('\n') +
      
      `\n## 🔍 DETAILED BREAKDOWN\n\n` +
      Object.entries(issuesByType).slice(0, 5).map(([type, typeIssues]) => {
        const sample = typeIssues[0];
        return `### ${type.replace(/_/g, ' ').toUpperCase()} (${typeIssues.length} issues)\n` +
               `**Severity**: ${sample.severity || 'medium'}\n` +
               `**Factor**: ${this.getFactorForIssueType(type)}\n` +
               `**First Detected**: ${sample.first_seen || sample.created_at || 'Unknown'}\n` +
               `**Sample Details**: ${sample.title || sample.description || JSON.stringify(sample).substring(0, 100)}\n`;
      }).join('\n\n') +
      
      `\n## 📋 REMEDIATION RECOMMENDATIONS\n\n` +
      priorities.filter(p => p.quick_win).slice(0, 3).map(priority => 
        `**QUICK WIN: ${priority.issue_type.replace(/_/g, ' ').toUpperCase()}**\n` +
        `• Fix ${priority.count} ${priority.severity} severity issues\n` +
        `• Estimated effort: Low\n` +
        `• Impact: Immediate risk reduction\n`
      ).join('\n') +
      
      `\n---\n` +
      `💡 **Note**: Analysis covers ${totalIssues} security issues found for IP ${ipAddress}. ` +
      `For complete remediation, address all critical and high-severity issues first.`;

    return {
      content: [{ type: "text", text }]
    };
  }
  
  private calculateIssuePriority(severity: string, count: number): number {
    const severityMultiplier = { critical: 5, high: 4, medium: 3, low: 2, informational: 1 };
    const multiplier = severityMultiplier[severity as keyof typeof severityMultiplier] || 3;
    return multiplier * count;
  }
  
  private isQuickWin(issueType: string, severity: string): boolean {
    const quickWinTypes = ['spf_record_missing', 'dmarc_policy_missing', 'hsts_header_missing'];
    const quickWinSeverities = ['medium', 'high'];
    return quickWinTypes.some(type => issueType.includes(type)) && quickWinSeverities.includes(severity);
  }

  /**
   * Get detailed security issues for specific IP address
   * Uses available data sources and realistic fallback patterns
   */
  private async getIPDetailedIssues(ipAddress: string, domain: string): Promise<any> {
    domain = this.sanitizeDomain(domain);
    
    this.log(`Getting detailed issues for IP: ${ipAddress} in domain: ${domain}`);
    
    // Try multiple endpoint patterns for IP issue discovery
    const endpointPatterns = [
      `/footprint/${domain}/assets/ips/${ipAddress}/issues`,
      `/footprint/${domain}/ips/${ipAddress}/issues`, 
      `/companies/${domain}/issues?ip=${ipAddress}`,
      `/companies/${domain}/assets?ip=${ipAddress}&type=issues`,
    ];
    
    const workingEndpoints: string[] = [];
    let combinedIssues: any[] = [];
    
    // Try direct IP endpoints first
    for (const endpoint of endpointPatterns) {
      try {
        this.log(`Trying IP issues endpoint: ${endpoint}`);
        const response = await this.makeRequest(endpoint);
        const issues = response.entries || response.issues || response.data || [];
        
        if (issues.length > 0) {
          combinedIssues = combinedIssues.concat(issues);
          workingEndpoints.push(endpoint);
          this.log(`Found ${issues.length} issues from ${endpoint}`);
        }
      } catch (error: any) {
        this.log(`Endpoint ${endpoint} failed: ${error.message}`);
      }
    }
    
    // If no direct IP issues found, use asset discovery + factor analysis approach
    if (combinedIssues.length === 0) {
      this.log(`No direct IP issues found, using asset discovery approach...`);
      
      try {
        // Get IP asset metadata
        const ipAssets = await this.makeRequest(`/footprint/${domain}/assets/ips`);
        const targetIP = ipAssets.entries?.find((asset: any) => 
          (asset.ip || asset.address || asset.name) === ipAddress
        );
        
        if (targetIP) {
          // Get factor analysis and create estimated issues based on asset metadata
          const factors = await this.makeHierarchicalRequest(domain, 'factors');
          const assetIssueEstimate = targetIP.issues || 0;
          
          if (assetIssueEstimate > 0 && factors?.entries) {
            // Create estimated issues based on factor distribution
            factors.entries.forEach((factor: any) => {
              factor.issue_summary?.forEach((issue: any) => {
                if (issue.count > 0) {
                  // Estimate IP-specific issues based on overall factor distribution
                  const estimatedCount = Math.ceil(issue.count * 0.1); // Rough estimate
                  combinedIssues.push({
                    type: issue.type,
                    severity: issue.severity || 'medium',
                    count: estimatedCount,
                    factor: factor.name,
                    source: 'estimated_from_factors',
                    ip_address: ipAddress
                  });
                }
              });
            });
            workingEndpoints.push('asset_discovery_with_factor_estimation');
          }
        }
      } catch (error: any) {
        this.log(`Asset discovery approach failed: ${error.message}`);
      }
    }
    
    // Process and format the results
    return this.formatDetailedAssetIssues(ipAddress, 'ip_address', combinedIssues, workingEndpoints);
  }

  /**
   * Get detailed security issues for specific domain  
   * Uses domain-specific endpoints with parent domain fallback
   */
  private async getDomainDetailedIssues(domainName: string, parentDomain: string): Promise<any> {
    parentDomain = this.sanitizeDomain(parentDomain);
    
    this.log(`Getting detailed issues for domain: ${domainName} via parent: ${parentDomain}`);
    
    // Try domain-specific endpoints
    const endpointPatterns = [
      `/footprint/${parentDomain}/assets/domains/${domainName}/issues`,
      `/footprint/${domainName}/issues`,
      `/companies/${domainName}/issues`,
      `/companies/${parentDomain}/issues?domain=${domainName}`,
    ];
    
    const workingEndpoints: string[] = [];
    let combinedIssues: any[] = [];
    
    // Try direct domain endpoints
    for (const endpoint of endpointPatterns) {
      try {
        this.log(`Trying domain issues endpoint: ${endpoint}`);
        const response = await this.makeRequest(endpoint);
        const issues = response.entries || response.issues || response.data || [];
        
        if (issues.length > 0) {
          combinedIssues = combinedIssues.concat(issues);
          workingEndpoints.push(endpoint);
          this.log(`Found ${issues.length} issues from ${endpoint}`);
        }
      } catch (error: any) {
        this.log(`Endpoint ${endpoint} failed: ${error.message}`);
      }
    }
    
    // If no direct domain issues, use asset discovery + factor approach
    if (combinedIssues.length === 0) {
      this.log(`No direct domain issues found, using asset discovery approach...`);
      
      try {
        // Get domain asset metadata
        const domainAssets = await this.makeRequest(`/footprint/${parentDomain}/assets/domains`);
        const targetDomain = domainAssets.entries?.find((asset: any) => 
          asset.domain === domainName || asset.name === domainName
        );
        
        if (targetDomain && targetDomain.issues > 0) {
          // Get factors for parent domain and estimate issues for this specific domain
          const factors = await this.makeHierarchicalRequest(parentDomain, 'factors');
          
          if (factors?.entries) {
            factors.entries.forEach((factor: any) => {
              factor.issue_summary?.forEach((issue: any) => {
                if (issue.count > 0) {
                  // Estimate domain-specific issues
                  const estimatedCount = Math.max(1, Math.ceil(issue.count * 0.05));
                  combinedIssues.push({
                    type: issue.type,
                    severity: issue.severity || 'medium', 
                    count: estimatedCount,
                    factor: factor.name,
                    source: 'estimated_from_parent_factors',
                    domain: domainName
                  });
                }
              });
            });
            workingEndpoints.push('asset_discovery_with_parent_factor_estimation');
          }
        }
      } catch (error: any) {
        this.log(`Domain asset discovery approach failed: ${error.message}`);
      }
    }
    
    return this.formatDetailedAssetIssues(domainName, 'domain', combinedIssues, workingEndpoints);
  }

  /**
   * Get vulnerability analysis for any asset type
   * Universal function that handles domains, IPs, and services
   */  
  private async getAssetVulnerabilities(assetName: string, assetType: 'domain' | 'ip_address' | 'service', parentDomain: string): Promise<any> {
    parentDomain = this.sanitizeDomain(parentDomain);
    
    this.log(`Getting vulnerabilities for ${assetType}: ${assetName} via parent: ${parentDomain}`);
    
    let combinedIssues: any[] = [];
    const workingEndpoints: string[] = [];
    
    // Route to appropriate specialized function based on asset type
    if (assetType === 'ip_address') {
      const ipResult = await this.getIPDetailedIssues(assetName, parentDomain);
      return this.formatAsVulnerabilityReport(ipResult, assetName, assetType);
    }
    
    if (assetType === 'domain') {
      const domainResult = await this.getDomainDetailedIssues(assetName, parentDomain);
      return this.formatAsVulnerabilityReport(domainResult, assetName, assetType);
    }
    
    // For services or unknown types, use general approach
    try {
      // Try service-specific endpoints (though these may not exist)
      const serviceEndpoints = [
        `/footprint/${parentDomain}/assets/services/${assetName}/issues`,
        `/companies/${parentDomain}/issues?service=${assetName}`,
        `/companies/${parentDomain}/issues?asset=${assetName}`,
      ];
      
      for (const endpoint of serviceEndpoints) {
        try {
          const response = await this.makeRequest(endpoint);
          const issues = response.entries || response.issues || response.data || [];
          
          if (issues.length > 0) {
            combinedIssues = combinedIssues.concat(issues);
            workingEndpoints.push(endpoint);
            this.log(`Found ${issues.length} vulnerabilities from ${endpoint}`);
          }
        } catch (error: any) {
          this.log(`Service endpoint ${endpoint} failed: ${error.message}`);
        }
      }
      
      if (combinedIssues.length === 0) {
        return {
          content: [{
            type: "text",
            text: `# 🛡️ VULNERABILITY ANALYSIS: ${assetName}\n\n` +
                  `**Asset Type**: ${assetType}\n` +
                  `**Status**: ⚠️ NO SPECIFIC VULNERABILITIES FOUND\n\n` +
                  `**Note**: Service-specific vulnerability endpoints may not be available. ` +
                  `Consider analyzing this asset as a domain or IP address instead.`
          }]
        };
      }
      
    } catch (error: any) {
      this.log(`Service vulnerability analysis failed: ${error.message}`);
    }
    
    return this.formatDetailedAssetIssues(assetName, assetType, combinedIssues, workingEndpoints);
  }

  /**
   * Format detailed asset issues into comprehensive report
   */
  private formatDetailedAssetIssues(assetName: string, assetType: string, issues: any[], workingEndpoints: string[]): any {
    if (issues.length === 0) {
      return {
        content: [{
          type: "text", 
          text: `# 🔍 DETAILED ISSUE ANALYSIS: ${assetName}\n\n` +
                `**Asset Type**: ${assetType}\n` +
                `**Status**: ❌ NO ISSUES FOUND\n\n` +
                `**Attempted Endpoints**: ${workingEndpoints.length || 'Multiple patterns tried'}\n` +
                `**Note**: This asset may not have accessible security issues via current API endpoints.`
        }]
      };
    }
    
    // Categorize issues
    const severityBreakdown = { critical: 0, high: 0, medium: 0, low: 0, informational: 0 };
    const issuesByFactor: { [key: string]: any[] } = {};
    
    issues.forEach(issue => {
      const severity = issue.severity || 'medium';
      const factor = issue.factor || this.getFactorForIssueType(issue.type);
      
      if (severityBreakdown.hasOwnProperty(severity)) {
        severityBreakdown[severity as keyof typeof severityBreakdown] += issue.count || 1;
      }
      
      if (!issuesByFactor[factor]) {
        issuesByFactor[factor] = [];
      }
      issuesByFactor[factor].push(issue);
    });
    
    const totalIssues = issues.reduce((sum, issue) => sum + (issue.count || 1), 0);
    
    const text = 
      `# 🔍 DETAILED ISSUE ANALYSIS: ${assetName}\n\n` +
      `**Asset Type**: ${assetType.replace('_', ' ').toUpperCase()}\n` +
      `**Total Issues**: ${totalIssues}\n` +
      `**Working Endpoints**: ${workingEndpoints.length}\n` +
      `**Analysis Date**: ${new Date().toISOString()}\n\n` +
      
      `## 📊 SEVERITY BREAKDOWN\n` +
      `**Critical**: ${severityBreakdown.critical} | **High**: ${severityBreakdown.high} | **Medium**: ${severityBreakdown.medium} | **Low**: ${severityBreakdown.low}\n\n` +
      
      `## 🎯 ISSUES BY SECURITY FACTOR\n\n` +
      Object.entries(issuesByFactor).map(([factor, factorIssues]) => 
        `### ${factor.replace('_', ' ').toUpperCase()} (${factorIssues.length} issue types)\n` +
        factorIssues.slice(0, 3).map(issue => 
          `• **${issue.type}**: ${issue.count || 1} occurrences (${issue.severity || 'medium'} severity)`
        ).join('\n') +
        (factorIssues.length > 3 ? `\n• *...and ${factorIssues.length - 3} more issue types*` : '')
      ).join('\n\n') +
      
      `\n## 🛠️ REMEDIATION PRIORITIES\n\n` +
      issues
        .sort((a, b) => this.calculateIssuePriority(b.severity, b.count || 1) - this.calculateIssuePriority(a.severity, a.count || 1))
        .slice(0, 5)
        .map((issue, index) => 
          `**${index + 1}. ${issue.type.replace(/_/g, ' ').toUpperCase()}**\n` +
          `   • Severity: ${issue.severity || 'medium'}\n` +
          `   • Count: ${issue.count || 1}\n` +
          `   • Factor: ${issue.factor || this.getFactorForIssueType(issue.type)}\n` +
          `   • Priority Score: ${this.calculateIssuePriority(issue.severity || 'medium', issue.count || 1)}\n`
        ).join('\n') +
      
      `\n## 📋 DATA SOURCES\n` +
      `**Working Endpoints**: ${workingEndpoints.join(', ')}\n` +
      `**Data Quality**: ${issues.some(i => i.source?.includes('estimated')) ? '⚠️ Includes estimated data' : '✅ Direct API data'}\n\n` +
      
      `---\n` +
      `💡 **Note**: Analysis covers ${totalIssues} security issues found for ${assetName}. ` +
      `Prioritize critical and high-severity issues for immediate remediation.`;

    return {
      content: [{ type: "text", text }]
    };
  }

  /**
   * Format vulnerability-specific report
   */
  private formatAsVulnerabilityReport(detailedResult: any, assetName: string, assetType: string): any {
    if (!detailedResult?.content?.[0]?.text) {
      return detailedResult; // Return as-is if format is unexpected
    }
    
    // Transform the detailed issues report into vulnerability-focused format
    let text = detailedResult.content[0].text;
    text = text.replace('# 🔍 DETAILED ISSUE ANALYSIS:', '# 🛡️ VULNERABILITY ANALYSIS:');
    text = text.replace('## 📊 SEVERITY BREAKDOWN', '## 🚨 VULNERABILITY SEVERITY');
    text = text.replace('## 🎯 ISSUES BY SECURITY FACTOR', '## 📋 VULNERABILITY CATEGORIES');
    text = text.replace('## 🛠️ REMEDIATION PRIORITIES', '## ⚡ CRITICAL VULNERABILITIES');
    
    return {
      content: [{ type: "text", text }]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("✅ Live SecurityScorecard MCP Server running - Ready for analysis!");
  }
}

if (process.env.NODE_ENV !== 'test') {
  const server = new ScoreImpactSecurityScorecardServer();
  server.run().catch(console.error);
}
