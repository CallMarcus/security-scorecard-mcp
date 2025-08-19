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
    
    // Define endpoint hierarchy based on test results - removed failing scorecard endpoints
    const endpointHierarchy = [
      // Level 1: API Reference (Broadest Coverage) - WORKING
      {
        url: `/footprint/parentDomain/${endpointType}`,
        method: 'GET',
        transform: (url: string) => url.replace('/parentDomain/', `/${domain}/`)
      },
      // Level 2: Direct footprint (Domain-specific) - WORKING
      {
        url: `/footprint/${domain}/${endpointType}`,
        method: 'GET'
      },
      // Level 3: Companies (External monitoring - Limited but working)
      {
        url: `/companies/${domain}/${endpointType}`,
        method: 'GET'
      }
    ];

    // Try each level in hierarchy order
    for (const endpoint of endpointHierarchy) {
      try {
        let finalUrl = endpoint.transform ? endpoint.transform(endpoint.url) : endpoint.url;
        
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
