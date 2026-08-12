#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getFindingsByCategory } from "./get_findings_by_category.js";
import { getAssetInventory } from "./asset_management.js";
import { renderIssueTypeAnalysis, renderEmailSecurityAnalysis, renderDataCompletenessReport, renderImprovementPlan, renderAssetInventory } from "./analysis_modes.js";
import { createSecurityScorecardClient } from "./api/client.js";
import { ApiReferenceClient } from "./integration/api-reference-client.js";
import { getApiSchemaExtractor } from "./integration/api-schema.js";
import { z } from "zod";

interface SecurityScorecardConfig {
  apiToken: string;
  defaultDomain: string;
}

class SecurityScorecardServer {
  private server: McpServer;
  private client: any;
  private config: SecurityScorecardConfig;
  private apiReferenceClient: ApiReferenceClient;
  private apiDiscoveryWeights = {
    keyword: Number.isFinite(Number(process.env.API_DISCOVERY_KEYWORD_WEIGHT))
      ? Number(process.env.API_DISCOVERY_KEYWORD_WEIGHT)
      : 0.35,
    semantic: Number.isFinite(Number(process.env.API_DISCOVERY_SEMANTIC_WEIGHT))
      ? Number(process.env.API_DISCOVERY_SEMANTIC_WEIGHT)
      : 0.65
  };

  constructor() {
    this.server = new McpServer({
      name: "SSC MCP Server",
      version: "1.1.1"
    });

    this.config = {
      apiToken: process.env.SECURITY_SCORECARD_API_TOKEN || process.env.SECURITY_SCORECARD_TOKEN || "",
      defaultDomain: process.env.COMPANY_DOMAIN || "example.com"
    };

    if (!this.config.apiToken) {
      console.error("❌ SECURITY_SCORECARD_API_TOKEN or SECURITY_SCORECARD_TOKEN environment variable is required");
      process.exit(1);
    }

    this.client = createSecurityScorecardClient(this.config.apiToken);
    
    // Initialize API reference client for endpoint discovery
    this.apiReferenceClient = new ApiReferenceClient();
    
    this.setupTools();
  }

  private setupTools() {
    // Register security_dashboard tool - Enhanced with MCP 2025-06-18 schema
    this.server.registerTool("security_dashboard", {
      title: "Security Dashboard Overview",
      description: "📊 SECURITY STATUS: Get comprehensive security score, grade, and key metrics with intelligent response modes. Supports minimal responses for quick queries and detailed analysis for comprehensive security overviews.",
      inputSchema: {
        domain: z.string()
          .min(1, "Domain is required")
          .describe("Company domain to analyze (e.g., example.com)")
          .default(this.config.defaultDomain),
        response_mode: z.enum(["minimal", "standard", "detailed"])
          .describe("Response detail level: minimal (10-20 tokens), standard (200-300 tokens), detailed (800+ tokens)")
          .default("minimal")
      }
    }, async (args) => {
      const { domain, response_mode = "minimal" } = args;
      
      try {
        // Use summary-factors endpoint which returns grade, score, and all factor data
        const summaryResponse = await this.client.getCompanyFactorSummary(domain);
        const score = summaryResponse.data?.score || 0;
        const grade = summaryResponse.data?.grade || 'F';

        if (response_mode === "minimal") {
          return {
            content: [{
              type: "text",
              text: `${domain}: Score ${score}/100, Grade ${grade}\n\n---\n*Generated: ${new Date().toISOString()} | Schema: 2025-06-18*`
            }]
          };
        }

        if (response_mode === "standard") {
          const factorsResponse = await this.client.getCompanyFactors(domain);
          const topRisks = factorsResponse.data?.entries ?
            factorsResponse.data.entries.slice(0, 3).map((f: any) => `${f.name}: ${f.score}/100`).join(", ") :
            "No risk data available";

          return {
            content: [{
              type: "text",
              text: `# Security Overview: ${domain}\n\n**Current Status:** Score ${score}/100, Grade ${grade}\n\n**Top 3 Risk Areas:** ${topRisks}\n\n**Status:** ${score >= 80 ? '✅ Good' : score >= 60 ? '⚠️ Needs attention' : '❌ Critical'}\n\n---\n*Generated: ${new Date().toISOString()} | Mode: ${response_mode} | Schema: 2025-06-18*`
            }]
          };
        }

        // Detailed mode - comprehensive analysis
        const factorsResponse = await this.client.getCompanyFactors(domain);
        let analysis = `# 📊 Comprehensive Security Dashboard: ${domain}\n\n`;
        analysis += `**Overall Security Score:** ${score}/100 (Grade ${grade})\n\n`;

        if (factorsResponse.data?.entries) {
          analysis += `## Security Factor Breakdown\n\n`;
          factorsResponse.data.entries.forEach((factor: any) => {
            analysis += `- **${factor.name}:** ${factor.score}/100\n`;
          });
        }

        analysis += `\n## Recommendations\n`;
        if (score < 60) analysis += `- 🚨 **Critical**: Immediate security attention required\n`;
        if (score < 80) analysis += `- ⚠️ **Priority**: Focus on lowest-scoring security factors\n`;
        analysis += `- 📈 **Target**: Aim for Grade A (80+ score) for optimal security posture`;
        
        // Add enhanced metadata footer
        analysis += `\n\n---\n*Generated: ${new Date().toISOString()} | Mode: ${response_mode} | Domain: ${domain} | Schema: 2025-06-18*`;

        return {
          content: [{
            type: "text",
            text: analysis
          }]
        };

      } catch (error) {
        throw new Error(`Failed to get security dashboard for ${domain}: ${error}`);
      }
    });

    // Register analyze_security_risks tool - Enhanced with MCP 2025-06-18 schema  
    this.server.registerTool("analyze_security_risks", {
      title: "Security Risk Analysis & Prioritization", 
      description: "🚨 SECURITY RISKS: Comprehensive security risk analysis with intelligent prioritization. Analyzes critical vulnerabilities, risk patterns, and provides actionable remediation guidance with flexible response modes.",
      inputSchema: {
        domain: z.string()
          .min(1, "Domain is required")
          .describe("Company domain to analyze (e.g., example.com)")
          .default(this.config.defaultDomain),
        focus: z.enum(["critical", "all", "quick-wins"])
          .describe("Focus area: critical (high/critical issues only), all (complete analysis), quick-wins (easy fixes)")
          .default("all"),
        response_mode: z.enum(["minimal", "standard", "detailed"])
          .describe("Response detail level: minimal (50-100 tokens), standard (300-500 tokens), detailed (comprehensive)")
          .default("minimal")
      }
    }, async (args) => {
      const { domain, focus = "all", response_mode = "minimal" } = args;
      
      try {
        const findings = await getFindingsByCategory(domain, this.config.apiToken);
        const factorBreakdown = findings.factor_breakdown || [];
        
        if (response_mode === "minimal") {
          const topIssues = factorBreakdown.slice(0, 3).map(f => 
            `${f.factor}: ${f.critical_count + f.high_count} critical/high`
          );
          return {
            content: [{
              type: "text", 
              text: `Top 3 issues: ${topIssues.join(", ")}\n\n---\n*Generated: ${new Date().toISOString()} | Focus: ${focus} | Schema: 2025-06-18*`
            }]
          };
        }

        // Standard and detailed modes with more comprehensive analysis
        let analysis = `# 🚨 Security Risk Analysis: ${domain}\n\n`;
        
        const criticalFactors = factorBreakdown.filter(f => (f.critical_count + f.high_count) > 0);
        analysis += `**Critical Risk Factors:** ${criticalFactors.length}\n\n`;
        
        criticalFactors.slice(0, response_mode === "standard" ? 5 : 10).forEach(factor => {
          analysis += `- **${factor.factor}**: ${factor.critical_count} critical, ${factor.high_count} high\n`;
        });

        if (response_mode === "detailed") {
          analysis += `\n## Risk Assessment Summary\n`;
          analysis += `- Total security factors analyzed: ${factorBreakdown.length}\n`;
          analysis += `- Factors with critical/high issues: ${criticalFactors.length}\n`;
          analysis += `- Immediate attention required: ${factorBreakdown.filter(f => f.critical_count > 0).length}\n`;
        }
        
        // Add enhanced metadata footer
        analysis += `\n\n---\n*Generated: ${new Date().toISOString()} | Focus: ${focus} | Mode: ${response_mode} | Schema: 2025-06-18*`;

        return {
          content: [{
            type: "text",
            text: analysis
          }]
        };

      } catch (error) {
        throw new Error(`Failed to analyze security risks for ${domain}: ${error}`);
      }
    });

    // Register remaining tools with similar pattern...
    this.registerRemainingTools();
  }

  private registerRemainingTools() {
    // Register create_improvement_plan tool
    this.server.registerTool("create_improvement_plan", {
      title: "Security Improvement Plan",
      description: "🎯 IMPROVEMENT PLAN: Generate security improvement recommendations. INTELLIGENT RESPONSES: Use 'minimal' for simple questions like 'what should I fix first?' (50-100 tokens). Use 'standard' for improvement summary (300-500 tokens). Use 'detailed' for full roadmap.",
      inputSchema: {
        domain: z.string().describe("Company domain to analyze").default(this.config.defaultDomain),
        target_grade: z.enum(["C", "B", "A"]).describe("Target security grade").default("A"),
        timeline: z.enum(["30-days", "90-days", "6-months"]).describe("Timeline for improvement").default("90-days"),
        response_mode: z.enum(["minimal", "standard", "detailed"]).describe("Response detail level").default("minimal")
      }
    }, async (args) => {
      const { domain, target_grade = "A", timeline = "90-days", response_mode = "minimal" } = args;

      try {
        // Use summary-factors endpoint which returns grade, score, and all factor data
        const summaryResponse = await this.client.getCompanyFactorSummary(domain);
        const currentScore = summaryResponse.data?.score || 0;
        const findings = await getFindingsByCategory(domain, this.config.apiToken);
        const factorBreakdown = findings.factor_breakdown || [];

        return {
          content: [{
            type: "text",
            text: renderImprovementPlan(domain, currentScore, target_grade, timeline, factorBreakdown, response_mode)
          }]
        };

      } catch (error) {
        throw new Error(`Failed to create improvement plan for ${domain}: ${error}`);
      }
    });

    // Register discover_assets tool
    this.server.registerTool("discover_assets", {
      title: "Asset Discovery",
      description: "🔍 ASSET INVENTORY: Discover domains and IPs with security context and data completeness validation. INTELLIGENT RESPONSES: Use 'minimal' for simple questions like 'how many assets?' (20-50 tokens). Use 'standard' for asset overview (200-400 tokens). Use 'detailed' for comprehensive inventory.",
      inputSchema: {
        domain: z.string().describe("Parent domain to discover assets for").default(this.config.defaultDomain),
        include_risk_details: z.boolean().describe("Include security risk information").default(true),
        response_mode: z.enum(["minimal", "standard", "detailed"]).describe("Response detail level").default("minimal")
      }
    }, async (args) => {
      const { domain, include_risk_details = true, response_mode = "minimal" } = args;

      try {
        const assets = await getAssetInventory(domain, this.config.apiToken);

        return {
          content: [{
            type: "text",
            text: renderAssetInventory(domain, assets, include_risk_details, response_mode)
          }]
        };

      } catch (error) {
        throw new Error(`Failed to discover assets for ${domain}: ${error}`);
      }
    });

    // Register analyze_email_security tool  
    this.server.registerTool("analyze_email_security", {
      title: "Email Security Analysis",
      description: "📧 EMAIL SECURITY: Analyze SPF, DMARC, DKIM issues with domain-by-domain breakdown and cross-validation. INTELLIGENT RESPONSES: Use 'minimal' for simple counts like 'how many SPF missing?' (10-30 tokens). Use 'standard' for email security overview (200-400 tokens). Use 'detailed' for comprehensive email analysis.",
      inputSchema: {
        domain: z.string().describe("Company domain to analyze").default(this.config.defaultDomain),
        response_mode: z.enum(["minimal", "standard", "detailed"]).describe("Response detail level").default("minimal")
      }
    }, async (args) => {
      const { domain, response_mode = "minimal" } = args;
      
      try {
        const findings = await getFindingsByCategory(domain, this.config.apiToken);
        const factorBreakdown = findings.factor_breakdown || [];

        return {
          content: [{
            type: "text",
            text: renderEmailSecurityAnalysis(domain, factorBreakdown, response_mode)
          }]
        };

      } catch (error) {
        throw new Error(`Failed to analyze email security for ${domain}: ${error}`);
      }
    });

    // Register API discovery tool for endpoint search
    this.server.registerTool("api_discovery", {
      title: "SecurityScorecard API Discovery",
      description: "Search and discover SecurityScorecard API endpoints. Returns both human-readable summary and structured JSON for programmatic use.",
      inputSchema: {
        query: z.string()
          .min(1, "Search query is required")
          .describe("Search query for API endpoints (e.g., 'security score', 'vulnerabilities', 'company data')"),
        tag: z.string()
          .describe("Filter by API tag/category (e.g., 'Companies', 'Portfolios', 'Issues')")
          .optional(),
        method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"])
          .describe("Filter by HTTP method")
          .optional(),
        limit: z.number()
          .min(1)
          .max(20)
          .describe("Maximum number of results to return")
          .default(8),
        include_schema: z.boolean()
          .describe("Include detailed request/response schema for top result")
          .default(false)
      }
    }, async (args) => {
      const { query, tag, method, limit = 8, include_schema = false } = args;

      try {
        const searchResponse = await this.apiReferenceClient.hybridSearchWithMetadata(query, {
          tag,
          method,
          limit,
          keywordWeight: this.apiDiscoveryWeights.keyword,
          semanticWeight: this.apiDiscoveryWeights.semantic
        });

        const { results, searchMode, semanticDisabledReason } = searchResponse;
        const totalEndpoints = this.apiReferenceClient.getEndpointCount();

        if (results.length === 0) {
          return {
            content: [{
              type: "text",
              text: `# API Discovery Results\n\nNo endpoints found for query: "${query}"\n\n**Suggestions:**\n- Try broader terms like "company", "security", "score"\n- Use specific API categories: "Companies", "Portfolios", "Issues"\n- Search for HTTP methods: "GET", "POST"\n\n**Available:** ${totalEndpoints} total endpoints`
            }]
          };
        }

        // Build human-readable response
        let response = `# API Discovery Results\n\n**Query:** "${query}"\n**Found:** ${results.length} endpoints\n`;
        response += `**Search mode:** ${searchMode}`;
        if (semanticDisabledReason) {
          response += ` (${semanticDisabledReason})`;
        }
        response += `\n**Indexed:** ${totalEndpoints} total endpoints\n\n`;

        // Build structured JSON for programmatic use
        const structuredResults = results.map((result) => {
          const { endpoint } = result;
          return {
            operationId: endpoint.operationId,
            method: endpoint.method,
            path: endpoint.path,
            summary: endpoint.summary,
            tag: endpoint.tag,
            requiredParams: endpoint.requiredPathParams,
            queryParams: endpoint.queryParams,
            hasBody: endpoint.hasBody,
            scores: {
              hybrid: Number(result.score.toFixed(3)),
              keyword: Number(result.keywordScore.toFixed(3)),
              semantic: Number((result.semanticScore ?? 0).toFixed(3)),
              confidence: Number((result.confidence ?? 0).toFixed(3))
            },
            curl: `curl -H "Authorization: Token $TOKEN" "https://api.securityscorecard.io${endpoint.path}"`
          };
        });

        // Add each result to human-readable output
        results.forEach((result, index) => {
          const { endpoint } = result;
          const confidence = result.confidence ?? 0;
          response += `## ${index + 1}. ${endpoint.method} ${endpoint.path}\n`;
          response += `**Summary:** ${endpoint.summary}\n`;
          response += `**Category:** ${endpoint.tag} | **Confidence:** ${(confidence * 100).toFixed(0)}%\n`;

          if (endpoint.requiredPathParams.length > 0) {
            response += `**Required:** ${endpoint.requiredPathParams.join(", ")}\n`;
          }
          if (endpoint.queryParams.length > 0) {
            response += `**Query params:** ${endpoint.queryParams.slice(0, 5).join(", ")}${endpoint.queryParams.length > 5 ? '...' : ''}\n`;
          }

          response += `\`\`\`bash\ncurl -H "Authorization: Token $TOKEN" "https://api.securityscorecard.io${endpoint.path}"\n\`\`\`\n\n`;
        });

        // Add structured JSON block
        response += `## Structured Results\n\n\`\`\`json\n${JSON.stringify(structuredResults, null, 2)}\n\`\`\`\n\n`;

        // Add schema details for top result if requested
        if (include_schema && results.length > 0) {
          const topResult = results[0];
          const schemaExtractor = getApiSchemaExtractor();
          // Try operationId first, fall back to method+path
          const schemaDesc = schemaExtractor.getSchemaDescription(
            topResult.endpoint.operationId,
            topResult.endpoint.method,
            topResult.endpoint.path
          );

          if (schemaDesc) {
            response += `## Schema Details (Top Result)\n\n${schemaDesc}\n\n`;
          } else {
            response += `## Schema Details\n\n*Schema not found for ${topResult.endpoint.method} ${topResult.endpoint.path}*\n\n`;
          }
        }

        response += `---\n*${searchMode} search | ${totalEndpoints} endpoints indexed | ${new Date().toISOString()}*`;

        return {
          content: [{
            type: "text",
            text: response
          }]
        };

      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `# API Discovery Error\n\n**Query:** "${query}"\n**Error:** ${error}\n\n**Troubleshooting:**\n- Check that docs/api/index.jsonl exists\n- Verify docs/api/index-embeddings.json for semantic search\n- Run npm run api:embed to regenerate embeddings`
          }]
        };
      }
    });

    // Register remaining tools for completeness
    this.registerAnalysisTools();
    this.registerUtilityTools();
  }

  private registerAnalysisTools() {
    // Register analyze_issue_types tool
    this.server.registerTool("analyze_issue_types", {
      title: "Issue Type Analysis",
      description: "🔍 ISSUE BREAKDOWN: Get detailed breakdown of security issues by specific types (SPF, DMARC, patching, etc.). INTELLIGENT RESPONSES: Use 'minimal' for specific counts (20-50 tokens). Use 'standard' for issue type summary (200-300 tokens). Use 'detailed' for comprehensive breakdown.",
      inputSchema: {
        domain: z.string().describe("Company domain to analyze").default(this.config.defaultDomain),
        focus_factor: z.enum(["dns_health", "application_security", "network_security", "endpoint_security", "all"]).describe("Focus on specific security factor").default("all"),
        response_mode: z.enum(["minimal", "standard", "detailed"]).describe("Response detail level").default("minimal")
      }
    }, async (args) => {
      const { domain, focus_factor = "all", response_mode = "minimal" } = args;
      
      try {
        const findings = await getFindingsByCategory(domain, this.config.apiToken);
        const factorBreakdown = findings.factor_breakdown || [];

        return {
          content: [{
            type: "text",
            text: renderIssueTypeAnalysis(domain, factorBreakdown, focus_factor, response_mode)
          }]
        };

      } catch (error) {
        throw new Error(`Failed to analyze issue types for ${domain}: ${error}`);
      }
    });
  }

  private registerUtilityTools() {
    // Register validate_data_completeness tool
    this.server.registerTool("validate_data_completeness", {
      title: "Data Completeness Validation",
      description: "✅ DATA VALIDATION: Cross-validate tool results for accuracy and completeness. INTELLIGENT RESPONSES: Use 'minimal' for validation status (25 tokens). Use 'standard' for validation summary (200-400 tokens). Use 'detailed' for full data audit.",
      inputSchema: {
        domain: z.string().describe("Company domain to validate").default(this.config.defaultDomain),
        expected_asset_count: z.number().describe("Expected number of assets for validation").optional(),
        response_mode: z.enum(["minimal", "standard", "detailed"]).describe("Response detail level").default("minimal")
      }
    }, async (args) => {
      const { domain, expected_asset_count, response_mode = "minimal" } = args;
      
      try {
        const assets = await getAssetInventory(domain, this.config.apiToken);

        return {
          content: [{
            type: "text",
            text: renderDataCompletenessReport(domain, assets, expected_asset_count, response_mode)
          }]
        };

      } catch (error) {
        throw new Error(`Failed to validate data completeness for ${domain}: ${error}`);
      }
    });

    // Register query_security_data tool
    this.server.registerTool("query_security_data", {
      title: "Security Data Query",
      description: "Direct API access with smart endpoint validation. Uses API discovery to validate endpoints, suggest alternatives, and provide parameter hints.",
      inputSchema: {
        endpoint: z.string().describe("API endpoint to query (e.g., /companies/{domain}/factors)"),
        domain: z.string().describe("Domain to use in endpoint").default(this.config.defaultDomain),
        method: z.enum(["GET", "POST", "PUT", "DELETE"]).describe("HTTP method").default("GET"),
        validate_only: z.boolean().describe("Only validate endpoint without calling API").default(false)
      }
    }, async (args) => {
      const { endpoint, domain, method = "GET", validate_only = false } = args;

      // Pre-call validation: search for matching endpoints
      const searchResponse = await this.apiReferenceClient.hybridSearchWithMetadata(
        `${method} ${endpoint}`,
        { method, limit: 5, keywordWeight: this.apiDiscoveryWeights.keyword, semanticWeight: this.apiDiscoveryWeights.semantic }
      );

      // Check if endpoint path exists in index
      const exactMatch = searchResponse.results.find(r =>
        r.endpoint.path.toLowerCase() === endpoint.toLowerCase() &&
        r.endpoint.method.toUpperCase() === method.toUpperCase()
      );

      const searchModeNote = searchResponse.searchMode === 'keyword-only'
        ? `\n*Note: Using keyword-only search (${searchResponse.semanticDisabledReason})*`
        : '';

      // If validate_only, just return validation results
      if (validate_only) {
        if (exactMatch) {
          const ep = exactMatch.endpoint;
          return {
            content: [{
              type: "text",
              text: `# Endpoint Validated\n\n**${ep.method} ${ep.path}**\n${ep.summary}\n\n` +
                    `**Required params:** ${ep.requiredPathParams.join(', ') || 'none'}\n` +
                    `**Query params:** ${ep.queryParams.join(', ') || 'none'}\n` +
                    `**Has body:** ${ep.hasBody}${searchModeNote}`
            }]
          };
        } else {
          const suggestions = searchResponse.results.slice(0, 3).map(r =>
            `- \`${r.endpoint.method} ${r.endpoint.path}\` - ${r.endpoint.summary}`
          ).join('\n');
          return {
            content: [{
              type: "text",
              text: `# Endpoint Not Found\n\n**Requested:** ${method} ${endpoint}\n\n**Similar endpoints:**\n${suggestions}${searchModeNote}`
            }]
          };
        }
      }

      try {
        // Replace {domain} placeholder in endpoint
        const processedEndpoint = endpoint.replace(/{domain}/g, domain);

        const { createSecurityScorecardClient } = await import('./api/client.js');
        const client = createSecurityScorecardClient(this.config.apiToken);
        const response = await client.callEndpoint(method, processedEndpoint);

        // Include validation info in successful response
        let validationNote = '';
        if (!exactMatch && searchResponse.results.length > 0) {
          validationNote = `\n\n*Note: Endpoint not in API index. If issues occur, try: ${searchResponse.results[0].endpoint.path}*`;
        }

        return {
          content: [{
            type: "text",
            text: `# API Query Results\n\n**Endpoint:** ${processedEndpoint}\n**Method:** ${method}${validationNote}\n\n\`\`\`json\n${JSON.stringify(response.data, null, 2)}\n\`\`\``
          }]
        };

      } catch (error) {
        // On error, use discovery to suggest alternatives
        const errorQuery = `${method} ${endpoint} ${String(error).slice(0, 50)}`;
        const errorSearch = await this.apiReferenceClient.hybridSearchWithMetadata(errorQuery, { limit: 3 });

        const suggestions = errorSearch.results.map(r => {
          const ep = r.endpoint;
          const params = ep.requiredPathParams.length > 0 ? ` (requires: ${ep.requiredPathParams.join(', ')})` : '';
          return `- \`${ep.method} ${ep.path}\`${params} - ${ep.summary}`;
        }).join('\n');

        return {
          content: [{
            type: "text",
            text: `# API Query Failed\n\n**Error:** ${error}\n\n**Suggested alternatives:**\n${suggestions}\n\n**Tips:**\n- Check that required path parameters are provided\n- Verify the domain exists in SecurityScorecard\n- Use \`validate_only: true\` to check endpoint syntax first`
          }]
        };
      }
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("SSC MCP Server running");
  }
}

// Start the server
const server = new SecurityScorecardServer();
server.start().catch(console.error);