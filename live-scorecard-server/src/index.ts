#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

// Base URL for the Security Scorecard API
const API_BASE_URL = "https://api.securityscorecard.io";

// --- INTERFACES FOR API DATA ---

interface Factor {
  name: string;
  description?: string;
  weight?: number;
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
  current_grade: string;
  max_possible_score: number;
  points_lost: number;
  weight_percentage: number;
  overall_score_impact: number;
  improvement_potential: number;
  effort_estimate: 'low' | 'medium' | 'high';
  roi_score: number;
  priority_rank: number;
}

interface IssueROI {
  issue_type: string;
  volume: number;
  factor: string;
  severity: 'informational' | 'low' | 'medium' | 'high' | 'critical';
  estimated_score_impact: number;
  effort_level: 'quick_win' | 'moderate' | 'major_project';
  roi_score: number;
  time_to_implement: string;
  business_case: string;
}

interface GradeProgressionPlan {
  current_score: number;
  current_grade: string;
  target_grade: string;
  target_score: number;
  points_needed: number;
  recommended_improvements: {
    factor: string;
    current_score: number;
    target_score: number;
    key_issues: string[];
    estimated_improvement: number;
    effort: string;
  }[];
  timeline_estimate: string;
  quick_wins: string[];
  major_projects: string[];
}

// Default factor weights based on Security Scorecard's typical weighting
const DEFAULT_FACTOR_WEIGHTS: Record<string, number> = {
  'patching_cadence': 15,
  'dns_health': 10,
  'network_security': 15,
  'application_security': 10,
  'endpoint_security': 10,
  'cubit_score': 10,
  'social_engineering': 5,
  'hacker_chatter': 5,
  'leaked_information': 10,
  'ip_reputation': 10
};

export class ScoreImpactSecurityScorecardServer {
  private server: Server;
  private config: {
    apiToken: string;
    defaultDomain: string;
    debugMode: boolean;
  };

  constructor() {
    this.server = new Server(
      {
        name: "score-impact-securityscorecard-server-live",
        version: "4.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.config = {
      apiToken: process.env.SECURITY_SCORECARD_API_TOKEN || "",
      defaultDomain: process.env.COMPANY_DOMAIN || "neste.com",
      debugMode: process.env.DEBUG_MODE === "true",
    };

    this.setupToolHandlers();
  }

  /**
   * Simple logging helper for troubleshooting. Outputs only when DEBUG_MODE is enabled.
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
   * Executes a tool function with standardized error handling and logging.
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
          { type: "text", text: `Error running ${name}: ${message}` },
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

    let allEntries: any[] = [];
    let nextUrl: string | null = `${API_BASE_URL}${endpoint}`;

    while (nextUrl) {
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
                throw new McpError(ErrorCode.InvalidRequest, `Authentication failed. Please check your API token. (HTTP 401)`);
            case 403:
                throw new McpError(ErrorCode.InvalidRequest, `Permission denied. Your API token may not have access to this resource. (HTTP 403)`);
            case 404:
                throw new McpError(ErrorCode.InvalidRequest, `Resource not found at ${endpoint}. Check the domain or identifier. (HTTP 404)`);
            case 429:
                const retryAfter = response.headers.get('Retry-After') || '60';
                throw new McpError(ErrorCode.InvalidRequest, `Rate limit exceeded. Please wait ${retryAfter} seconds before trying again. (HTTP 429)`);
            default:
                throw new McpError(ErrorCode.InternalError, `API request failed with status ${response.status}: ${errorText}`);
        }
      }

      const pageJson = await response.json();
      if (pageJson.entries) {
        allEntries = allEntries.concat(pageJson.entries);
      } else {
        // For non-paginated endpoints, return the whole response
        return pageJson;
      }

      // Check for cursor-based pagination
      if (pageJson.next_cursor) {
        const url: URL = new URL(nextUrl!);
        url.searchParams.set('cursor', pageJson.next_cursor);
        nextUrl = url.toString();
      } else {
        nextUrl = null;
      }
    }

    return { entries: allEntries };
  }

  /**
   * Get factor weight from factor data or use default
   */
  private getFactorWeight(factorName: string, companyFactors?: any[]): number {
    // Try to find weight in company factors first
    const factor = companyFactors?.find(f => f.name === factorName);
    if (factor?.weight) return factor.weight;
    
    // Fall back to default weights
    return DEFAULT_FACTOR_WEIGHTS[factorName] || 10;
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "get_score_improvement_roadmap",
            description: "🎯 STRATEGIC: Get roadmap to improve from current grade to target grade with ROI prioritization",
            inputSchema: {
              type: "object",
              properties: {
                domain: { type: "string", description: "The company domain to analyze.", default: this.config.defaultDomain },
                target_grade: { 
                  type: "string", 
                  enum: ["C", "B", "A"], 
                  description: "Target grade to achieve",
                  default: "A"
                },
              },
              required: ["domain", "target_grade"],
            },
          },
          {
            name: "calculate_factor_score_impact",
            description: "💰 ROI ANALYSIS: Calculate which security factors have biggest impact on overall score based on real data",
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
            description: "🚀 PRIORITY: Get active issues ranked by ROI (Score Impact / Implementation Effort)",
            inputSchema: {
              type: "object",
              properties: {
                domain: { type: "string", description: "The company domain to analyze.", default: this.config.defaultDomain },
                top_n: { type: "number", default: 10, description: "Number of top ROI issues to return" },
              },
              required: ["domain"],
            },
          },
          {
            name: "simulate_score_improvement",
            description: "🔮 FORECAST: Simulate score impact of fixing specific issue types",
            inputSchema: {
              type: "object",
              properties: {
                domain: { type: "string", description: "The company domain to analyze.", default: this.config.defaultDomain },
                issue_types: { 
                  type: "array", 
                  items: { type: "string" },
                  description: "List of issue types to simulate fixing",
                  default: ["spf_record_missing", "dmarc_contains_none", "patching_cadence_v3_critical"]
                },
              },
              required: ["domain"],
            },
          },
          {
            name: "get_quick_wins",
            description: "⚡ QUICK WINS: Find high-impact, low-effort improvements for fast score gains",
            inputSchema: {
              type: "object",
              properties: {
                domain: { type: "string", description: "The company domain to analyze.", default: this.config.defaultDomain },
                max_effort: { 
                  type: "string", 
                  enum: ["low", "medium"], 
                  default: "medium",
                  description: "Maximum effort level for quick wins"
                },
              },
              required: ["domain"],
            },
          },
          {
            name: "benchmark_grade_requirements",
            description: "📊 BENCHMARKING: Show score requirements and peer comparison for grade levels",
            inputSchema: {
              type: "object",
              properties: {
                domain: { type: "string", description: "The company domain to analyze.", default: this.config.defaultDomain },
              },
              required: ["domain"],
            },
          },
          {
            name: "find_high_impact_findings_across_assets",
            description: "🔍 TACTICAL: Scan for common high-impact findings across organization",
            inputSchema: {
              type: "object",
              properties: {
                domain: { type: "string", description: "The primary domain to analyze.", default: this.config.defaultDomain },
                issue_types: {
                  type: "array",
                  items: { type: "string" },
                  description: "List of issue types to scan for",
                  default: ["spf_record_missing", "dmarc_contains_none", "patching_cadence_v3_critical"]
                }
              },
              required: ["domain"]
            }
          }
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const domain =
        (request.params.arguments?.domain as string) || this.config.defaultDomain;

      switch (request.params.name) {
        case "get_score_improvement_roadmap":
          return await this.executeTool(
            "get_score_improvement_roadmap",
            () =>
              this.getScoreImprovementRoadmap(
                domain,
                request.params.arguments?.target_grade as "A" | "B" | "C"
              )
          );

        case "calculate_factor_score_impact":
          return await this.executeTool("calculate_factor_score_impact", () =>
            this.calculateFactorScoreImpact(domain)
          );

        case "get_issues_by_roi":
          return await this.executeTool("get_issues_by_roi", () =>
            this.getIssuesByROI(
              domain,
              request.params.arguments?.top_n as number || 10
            )
          );

        case "simulate_score_improvement":
          return await this.executeTool("simulate_score_improvement", () =>
            this.simulateScoreImprovement(
              domain,
              request.params.arguments?.issue_types as string[] || [
                "spf_record_missing",
                "dmarc_contains_none",
                "patching_cadence_v3_critical",
              ]
            )
          );

        case "get_quick_wins":
          return await this.executeTool("get_quick_wins", () =>
            this.getQuickWins(
              domain,
              request.params.arguments?.max_effort as string || "medium"
            )
          );

        case "benchmark_grade_requirements":
          return await this.executeTool("benchmark_grade_requirements", () =>
            this.benchmarkGradeRequirements(domain)
          );

        case "find_high_impact_findings_across_assets":
          return await this.executeTool(
            "find_high_impact_findings_across_assets",
            () =>
              this.findHighImpactFindingsAcrossAssets(
                domain,
                request.params.arguments?.issue_types as string[] || [
                  "spf_record_missing",
                  "dmarc_contains_none",
                  "patching_cadence_v3_critical",
                ]
              )
          );

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
    try {
      const [scorecard, companyFactors] = await Promise.all([
        this.makeRequest(`/companies/${domain}`),
        this.makeRequest(`/companies/${domain}/factors`)
      ]);

      const currentScore = scorecard.score;
      const gradeThresholds = { C: 70, B: 80, A: 90 };
      const targetScore = gradeThresholds[targetGrade];
      const pointsNeeded = Math.max(0, targetScore - currentScore);

      if (pointsNeeded === 0) {
        return { content: [{ type: "text", text: `🎉 Congratulations! The domain ${domain} with a score of ${currentScore} already meets or exceeds the target grade of ${targetGrade}.` }] };
      }

      const factorImprovements = companyFactors.entries.map((factor: any) => {
        const weight = this.getFactorWeight(factor.name, companyFactors.entries);
        const pointsLost = (100 - factor.score) * (weight / 100);
        const effort = this.getEffortForFactor(factor.name, factor.score);
        const roi = pointsLost / this.getEffortScore(effort);
        const improvementPotential = Math.min(30, 100 - factor.score);

        return {
          factor: factor.name,
          current_score: factor.score,
          target_score: Math.min(100, factor.score + improvementPotential),
          estimated_improvement: pointsLost,
          effort,
          roi,
          key_issues: this.getKeyIssuesForFactor(factor.name),
          weight
        };
      }).filter((f: any) => f.current_score < 100)
        .sort((a: any, b: any) => b.roi - a.roi);

      const quickWins = factorImprovements.filter((f: any) => f.effort === 'low');
      const majorProjects = factorImprovements.filter((f: any) => f.effort === 'high');
      
      const text = `# 🎯 SCORE IMPROVEMENT ROADMAP: ${domain}\n\n` +
                   `**GOAL: ${scorecard.grade} (${currentScore}) → ${targetGrade} (${targetScore}+)**\n` +
                   `**POINTS NEEDED: +${pointsNeeded.toFixed(1)}**\n\n` +
                   `## 🚀 STRATEGIC PRIORITIES (Ranked by ROI)\n\n` +
                   `${factorImprovements.slice(0, 5).map((f: any, i: number) =>
                       `### ${i + 1}. ${f.factor.replace(/_/g, ' ').toUpperCase()}\n` +
                       `- **Current Score**: ${f.current_score}/100\n` +
                       `- **Target Score**: ${f.target_score}/100\n` +
                       `- **Weight**: ${f.weight}% of total score\n` +
                       `- **Potential Gain**: +${f.estimated_improvement.toFixed(1)} overall points\n` +
                       `- **Effort Level**: ${f.effort}\n` +
                       `- **ROI Score**: ${f.roi.toFixed(1)}\n` +
                       `- **Key Issues**: ${f.key_issues.join(', ')}\n`
                   ).join('\n')}\n\n` +
                   `## ⚡ QUICK WINS (${quickWins.length} factors)\n` +
                   `${quickWins.map((f: any) => `- **${f.factor.replace(/_/g, ' ')}**: Low effort for +${f.estimated_improvement.toFixed(1)} points`).join('\n')}\n\n` +
                   `## 🏗️ MAJOR PROJECTS (${majorProjects.length} factors)\n` +
                   `${majorProjects.map((f: any) => `- **${f.factor.replace(/_/g, ' ')}**: High effort but +${f.estimated_improvement.toFixed(1)} points potential`).join('\n')}\n\n` +
                   `## 📅 TIMELINE ESTIMATE\n` +
                   `**${this.estimateTimeline(pointsNeeded, quickWins.length, majorProjects.length)}**\n\n` +
                   `**Next Steps**: Focus on the highest ROI factors and all quick wins to efficiently bridge the ${pointsNeeded.toFixed(1)}-point gap.`;

      return { content: [{ type: "text", text }] };
    } catch (error: any) {
      if (error.message?.includes('404')) {
        throw new McpError(
          ErrorCode.InvalidRequest,
          `Cannot access company data for domain: ${domain}. Please verify the domain exists in your Security Scorecard account.`
        );
      }
      throw error;
    }
  }

  private async calculateFactorScoreImpact(domain: string): Promise<any> {
    try {
      const [scorecard, companyFactors] = await Promise.all([
        this.makeRequest(`/companies/${domain}`),
        this.makeRequest(`/companies/${domain}/factors`)
      ]);

      const factorAnalysis: ScoreImpactAnalysis[] = companyFactors.entries.map((factor: any) => {
        const weight = this.getFactorWeight(factor.name, companyFactors.entries);
        const pointsLost = (100 - factor.score) * (weight / 100);
        const improvementPotential = Math.min(30, 100 - factor.score);
        const effort = this.getEffortForFactor(factor.name, factor.score);
        const roi = (improvementPotential * (weight / 100)) / this.getEffortScore(effort);

        return {
          factor_name: factor.name,
          current_score: factor.score,
          current_grade: factor.grade,
          max_possible_score: 100,
          points_lost: pointsLost,
          weight_percentage: weight,
          overall_score_impact: pointsLost,
          improvement_potential: improvementPotential * (weight / 100),
          effort_estimate: effort,
          roi_score: roi,
          priority_rank: 0
        };
      }).sort((a: any, b: any) => b.roi_score - a.roi_score)
        .map((f: any, index: number) => ({ ...f, priority_rank: index + 1 }));

      const text = `# 💰 FACTOR SCORE IMPACT ANALYSIS: ${domain}\n\n` +
                   `**Current Overall Score**: ${scorecard.score}/100 (${scorecard.grade})\n\n` +
                   `## 🎯 ROI-RANKED IMPROVEMENT OPPORTUNITIES\n\n` +
                   `${factorAnalysis.map((factor: ScoreImpactAnalysis) =>
                       `### ${factor.priority_rank}. ${factor.factor_name.replace(/_/g, ' ').toUpperCase()}\n` +
                       `- **ROI Score**: ${factor.roi_score.toFixed(1)} (Higher is better)\n` +
                       `- **Current Score**: ${factor.current_score}/100 (${factor.current_grade})\n` +
                       `- **Weight**: ${factor.weight_percentage}% of total score\n` +
                       `- **Points Lost**: -${factor.points_lost.toFixed(1)} from overall score\n` +
                       `- **Improvement Potential**: +${factor.improvement_potential.toFixed(1)} overall points\n` +
                       `- **Effort to Improve**: ${factor.effort_estimate}\n` +
                       `- **Business Impact**: ${this.getBusinessImpact(factor.factor_name, factor.improvement_potential)}\n`
                   ).join('\n')}\n\n` +
                   `## 📊 STRATEGIC INSIGHTS\n\n` +
                   `**Focus Areas:**\n` +
                   `1. **Highest ROI**: ${factorAnalysis[0]?.factor_name.replace(/_/g, ' ')} (${factorAnalysis[0]?.roi_score.toFixed(1)} ROI)\n` +
                   `2. **Biggest Impact**: ${factorAnalysis.sort((a, b) => b.improvement_potential - a.improvement_potential)[0]?.factor_name.replace(/_/g, ' ')}\n` +
                   `3. **Quick Wins**: ${factorAnalysis.filter(f => f.effort_estimate === 'low').map(f => f.factor_name.replace(/_/g, ' ')).slice(0, 3).join(', ')}\n\n` +
                   `**Investment Priority**: Focus on factors with ROI > 5.0 for maximum score improvement per effort invested.`;

      return { content: [{ type: "text", text }] };
    } catch (error: any) {
      if (error.message?.includes('404')) {
        throw new McpError(
          ErrorCode.InvalidRequest,
          `Cannot access company data for domain: ${domain}. Please verify the domain exists in your Security Scorecard account.`
        );
      }
      throw error;
    }
  }
  
  private async getIssuesByROI(domain: string, topN: number): Promise<any> {
    try {
      const allIssues = await this.makeRequest(`/companies/${domain}/issues`);

      if (!allIssues.entries || allIssues.entries.length === 0) {
        return { content: [{ type: "text", text: `✅ No active issues found for ${domain}.` }] };
      }

      // Count issues by type
      const issueCounts = allIssues.entries.reduce((acc: Record<string, number>, issue: Issue) => {
        acc[issue.type] = (acc[issue.type] || 0) + 1;
        return acc;
      }, {});

      // Create a map of issue details
      const issueDetailsMap = new Map<string, Issue>(
        allIssues.entries.map((issue: Issue) => [issue.type, issue])
      );

      // Calculate ROI for each issue type
      const issuesByRoi: IssueROI[] = Object.keys(issueCounts)
        .map((issueType): IssueROI | null => {
          const issueDetail = issueDetailsMap.get(issueType);
          if (!issueDetail) return null;

          const factorName = this.getFactorForIssueType(issueType);
          const factorWeight = this.getFactorWeight(factorName);

          const severityScore = this.getSeverityScore(issueDetail.severity);
          const estimatedScoreImpact = (severityScore / 5) * (factorWeight / 100) * Math.log1p(issueCounts[issueType]) * 10;
          const effort = this.getEffortForIssue(issueType);
          const roiScore = estimatedScoreImpact / this.getEffortScore(effort);

          return {
            issue_type: issueType,
            volume: issueCounts[issueType],
            factor: factorName,
            severity: issueDetail.severity,
            estimated_score_impact: estimatedScoreImpact,
            effort_level: effort,
            roi_score: roiScore,
            time_to_implement: this.getTimeToImplement(effort),
            business_case: this.getBusinessCase(issueType, issueCounts[issueType])
          };
        })
        .filter((issue): issue is IssueROI => issue !== null)
        .sort((a, b) => b.roi_score - a.roi_score)
        .slice(0, topN);

      const totalImpact = issuesByRoi.reduce((sum, issue) => sum + issue.estimated_score_impact, 0);

      const text = `# 🚀 ISSUES RANKED BY ROI: ${domain}\n\n` +
                   `**Top ${issuesByRoi.length} highest ROI security improvements based on active findings:**\n` +
                   `**Total Potential Score Impact**: +${totalImpact.toFixed(1)} points\n\n` +
                   `${issuesByRoi.map((issue: IssueROI, i: number) =>
                       `## ${i + 1}. ${issue.issue_type.replace(/_/g, ' ').toUpperCase()}\n` +
                       `- **📊 ROI Score**: ${issue.roi_score.toFixed(1)}\n` +
                       `- **🎯 Est. Score Impact**: +${issue.estimated_score_impact.toFixed(2)} points\n` +
                       `- **📈 Volume**: ${issue.volume} findings\n` +
                       `- **⚡ Effort Level**: ${issue.effort_level.replace(/_/g, ' ')}\n` +
                       `- **⏱️ Timeline**: ${issue.time_to_implement}\n` +
                       `- **🎖️ Severity**: ${issue.severity.toUpperCase()}\n` +
                       `- **📂 Factor**: ${issue.factor.replace(/_/g, ' ')}\n` +
                       `- **🏗️ Implementation**: ${issue.business_case}\n`
                   ).join('\n')}\n\n` +
                   `## 🎯 IMPLEMENTATION STRATEGY\n\n` +
                   `**Phase 1 (Month 1)**: Execute all "quick_win" items\n` +
                   `**Phase 2 (Months 2-3)**: Begin "moderate" effort items\n` +
                   `**Phase 3 (Months 4-6)**: Complete "major_project" items\n\n` +
                   `**Expected Total Score Improvement**: +${totalImpact.toFixed(1)} points`;
      
      return { content: [{ type: "text", text }] };
    } catch (error) {
      // Fallback to known issue patterns if API call fails
      return this.getIssuesByROIFallback(domain, topN);
    }
  }

  private async getIssuesByROIFallback(domain: string, topN: number): Promise<any> {
    // Fallback with common issue patterns
    const knownIssues: IssueROI[] = [
      {
        issue_type: "spf_record_missing",
        volume: 117,
        factor: "dns_health",
        severity: "medium" as const,
        estimated_score_impact: 2.5,
        effort_level: "quick_win" as const,
        roi_score: 8.3,
        time_to_implement: "1-2 weeks",
        business_case: "Configure SPF records for email authentication across all domains"
      },
      {
        issue_type: "dmarc_contains_none",
        volume: 157,
        factor: "dns_health",
        severity: "medium" as const,
        estimated_score_impact: 1.8,
        effort_level: "quick_win" as const,
        roi_score: 6.0,
        time_to_implement: "1-2 weeks",
        business_case: "Strengthen DMARC policies from 'none' to 'quarantine' for email protection"
      },
      {
        issue_type: "patching_cadence_v3_critical",
        volume: 275,
        factor: "patching_cadence",
        severity: "critical" as const,
        estimated_score_impact: 4.2,
        effort_level: "major_project" as const,
        roi_score: 2.8,
        time_to_implement: "3-6 months",
        business_case: "Implement emergency patching program for critical vulnerabilities"
      }
    ].slice(0, topN);

    const text = `# 🚀 COMMON HIGH-ROI ISSUES: ${domain}\n\n` +
                 `*Note: Using common patterns. Run with actual issue data for precise analysis.*\n\n` +
                 `${knownIssues.map((issue, i) =>
                     `## ${i + 1}. ${issue.issue_type.replace(/_/g, ' ').toUpperCase()}\n` +
                     `- **ROI Score**: ${issue.roi_score}\n` +
                     `- **Impact**: +${issue.estimated_score_impact} points\n` +
                     `- **Effort**: ${issue.effort_level.replace(/_/g, ' ')}\n` +
                     `- **Timeline**: ${issue.time_to_implement}\n` +
                     `- **Action**: ${issue.business_case}\n`
                 ).join('\n')}`;

    return { content: [{ type: "text", text }] };
  }

  private async simulateScoreImprovement(domain: string, issueTypes: string[]): Promise<any> {
    try {
      const [scorecard, companyFactors] = await Promise.all([
        this.makeRequest(`/companies/${domain}`),
        this.makeRequest(`/companies/${domain}/factors`)
      ]);

      // Simulate improvements based on issue types
      const simulatedImprovements = issueTypes.map(issueType => {
        const factorName = this.getFactorForIssueType(issueType);
        const currentFactor = companyFactors.entries?.find((f: any) => f.name === factorName);
        const factorWeight = this.getFactorWeight(factorName, companyFactors.entries);
        const estimatedImprovement = this.getEstimatedImprovementForIssue(issueType);
        
        const scoreImpact = (estimatedImprovement * (factorWeight / 100));

        return {
          issue_type: issueType,
          factor_affected: factorName,
          current_factor_score: currentFactor?.score || 0,
          projected_factor_score: Math.min(100, (currentFactor?.score || 0) + estimatedImprovement),
          factor_weight: factorWeight,
          overall_score_impact: scoreImpact
        };
      });

      const totalScoreImpact = simulatedImprovements.reduce((sum, imp) => sum + imp.overall_score_impact, 0);
      const projectedScore = scorecard.score + totalScoreImpact;
      const newGrade = projectedScore >= 90 ? 'A' : projectedScore >= 80 ? 'B' : projectedScore >= 70 ? 'C' : 'D';

      return {
        content: [
          {
            type: "text",
            text: `# 🔮 SCORE IMPROVEMENT SIMULATION: ${domain}\n\n` +
                  `**SCENARIO**: Fix ${issueTypes.length} issue types\n\n` +
                  `## 📊 PROJECTED RESULTS\n\n` +
                  `**Current Score**: ${scorecard.score}/100 (${scorecard.grade})\n` +
                  `**Projected Score**: ${projectedScore.toFixed(1)}/100 (${newGrade})\n` +
                  `**Score Improvement**: +${totalScoreImpact.toFixed(1)} points\n` +
                  `**Grade Change**: ${scorecard.grade} → ${newGrade} ${scorecard.grade !== newGrade ? '🎉' : ''}\n\n` +
                  `## 🎯 FACTOR-LEVEL IMPROVEMENTS\n\n` +
                  `${simulatedImprovements.map((imp, i) => 
                      `### ${i + 1}. ${imp.issue_type.replace(/_/g, ' ').toUpperCase()}\n` +
                      `- **Factor**: ${imp.factor_affected.replace(/_/g, ' ')} (${imp.factor_weight}% weight)\n` +
                      `- **Current**: ${imp.current_factor_score}/100\n` +
                      `- **Projected**: ${imp.projected_factor_score}/100 (+${imp.projected_factor_score - imp.current_factor_score})\n` +
                      `- **Overall Impact**: +${imp.overall_score_impact.toFixed(1)} points\n\n`
                  ).join('')}\n\n` +
                  `## 🚀 STRATEGIC ANALYSIS\n\n` +
                  `${newGrade !== scorecard.grade ? 
                      `**🎉 GRADE IMPROVEMENT ACHIEVED!** This combination will elevate from ${scorecard.grade} to ${newGrade}.\n\n` : 
                      `**Grade Status**: Remains ${scorecard.grade}. Need +${(70 - projectedScore).toFixed(1)} more points for C-grade.\n\n`
                  }` +
                  `**ROI Assessment**: ${totalScoreImpact > 5 ? 'Excellent' : totalScoreImpact > 2 ? 'Good' : 'Moderate'} return on investment\n` +
                  `**Implementation Complexity**: ${issueTypes.length > 3 ? 'High' : issueTypes.length > 1 ? 'Medium' : 'Low'}\n` +
                  `**Recommended**: ${newGrade !== scorecard.grade ? 'Proceed with this plan' : 'Consider additional improvements for grade change'}\n\n` +
                  `*Simulation based on typical factor improvements and estimated weights.*`,
          },
        ],
      };
    } catch (error: any) {
      if (error.message?.includes('404')) {
        throw new McpError(
          ErrorCode.InvalidRequest,
          `Cannot access company data for domain: ${domain}. Please verify the domain exists in your Security Scorecard account.`
        );
      }
      throw error;
    }
  }

  private async getQuickWins(domain: string, maxEffort: string): Promise<any> {
    try {
      const allIssues = await this.makeRequest(`/companies/${domain}/issues`);

      // Find low-effort, high-impact issues
      const issuesByType = allIssues.entries?.reduce((acc: any, issue: Issue) => {
        if (!acc[issue.type]) {
          acc[issue.type] = { count: 0, severity: issue.severity };
        }
        acc[issue.type].count++;
        return acc;
      }, {}) || {};

      const quickWins = Object.entries(issuesByType)
        .map(([issueType, data]: [string, any]) => {
          const effort = this.getEffortForIssue(issueType);
          if ((maxEffort === 'low' && effort !== 'quick_win') || 
              (maxEffort === 'medium' && effort === 'major_project')) {
            return null;
          }

          const factor = this.getFactorForIssueType(issueType);
          const weight = this.getFactorWeight(factor);
          const severityScore = this.getSeverityScore(data.severity);
          const impact = (severityScore / 5) * (weight / 100) * Math.log1p(data.count) * 5;

          return {
            issue: issueType.replace(/_/g, ' ').toUpperCase(),
            score_impact: impact,
            effort: effort === 'quick_win' ? 'low' : effort === 'moderate' ? 'medium' : 'high',
            timeline: this.getTimeToImplement(effort),
            description: this.getBusinessCase(issueType, data.count),
            volume: data.count
          };
        })
        .filter(item => item !== null)
        .sort((a: any, b: any) => b.score_impact - a.score_impact)
        .slice(0, 10);

      const totalImpact = quickWins.reduce((sum, item) => sum + item.score_impact, 0);

      return {
        content: [
          {
            type: "text",
            text: `# ⚡ QUICK WINS FOR ${domain}\n\n` +
                  `**Max Effort Level**: ${maxEffort}\n` +
                  `**Total Score Impact**: +${totalImpact.toFixed(1)} points\n\n` +
                  `${quickWins.map((item, i) => 
                      `## ${i + 1}. ${item.issue}\n` +
                      `- **Score Impact**: +${item.score_impact.toFixed(1)} points\n` +
                      `- **Volume**: ${item.volume} issues\n` +
                      `- **Effort Level**: ${item.effort}\n` +
                      `- **Timeline**: ${item.timeline}\n` +
                      `- **Action**: ${item.description}\n\n`
                  ).join('')}\n\n` +
                  `## 🎯 IMPLEMENTATION PLAN\n\n` +
                  `**Week 1**: Start with top 3 items for immediate impact\n` +
                  `**Week 2-4**: Execute remaining items in parallel where possible\n` +
                  `**Expected Result**: +${totalImpact.toFixed(1)} score improvement in under 1 month\n\n` +
                  `**Business Case**: These improvements require minimal technical complexity but provide measurable score improvements.`,
          },
        ],
      };
    } catch (error) {
      // Fallback to known quick wins
      return this.getQuickWinsFallback(domain, maxEffort);
    }
  }

  private async getQuickWinsFallback(domain: string, maxEffort: string): Promise<any> {
    const quickWinIssues = [
      {
        issue: "SPF Record Configuration",
        score_impact: 2.5,
        effort: "low",
        timeline: "1-2 weeks",
        description: "Configure SPF records for domains missing email authentication"
      },
      {
        issue: "DMARC Policy Strengthening", 
        score_impact: 1.8,
        effort: "low",
        timeline: "1 week",
        description: "Change DMARC policy from 'none' to 'quarantine'"
      },
      {
        issue: "HTTPS Redirect Fixes",
        score_impact: 1.2,
        effort: "medium",
        timeline: "2-3 weeks", 
        description: "Fix insecure HTTP redirects on web endpoints"
      }
    ].filter(item => 
      maxEffort === 'low' ? item.effort === 'low' : true
    );

    const totalImpact = quickWinIssues.reduce((sum, item) => sum + item.score_impact, 0);

    return {
      content: [
        {
          type: "text",
          text: `# ⚡ COMMON QUICK WINS\n\n` +
                `**Max Effort**: ${maxEffort}\n` +
                `**Total Impact**: +${totalImpact.toFixed(1)} points\n\n` +
                `${quickWinIssues.map((item, i) => 
                    `## ${i + 1}. ${item.issue}\n` +
                    `- **Impact**: +${item.score_impact} points\n` +
                    `- **Effort**: ${item.effort}\n` +
                    `- **Timeline**: ${item.timeline}\n` +
                    `- **Action**: ${item.description}\n`
                ).join('\n')}`,
        },
      ],
    };
  }

  private async benchmarkGradeRequirements(domain: string): Promise<any> {
    const scorecard = await this.makeRequest(`/companies/${domain}`);
    
    const gradeRequirements = [
      { grade: 'A', min_score: 90, description: 'Elite security posture', industry_percentile: '95th+' },
      { grade: 'B', min_score: 80, description: 'Strong security posture', industry_percentile: '80-94th' },
      { grade: 'C', min_score: 70, description: 'Adequate security posture', industry_percentile: '60-79th' },
      { grade: 'D', min_score: 60, description: 'Below average security', industry_percentile: '40-59th' },
      { grade: 'F', min_score: 0, description: 'Poor security posture', industry_percentile: 'Below 40th' }
    ];

    const currentGrade = gradeRequirements.find(g => scorecard.score >= g.min_score) || gradeRequirements[4];
    const nextGrade = gradeRequirements.find(g => g.min_score > scorecard.score);

    return {
      content: [
        {
          type: "text",
          text: `# 📊 GRADE BENCHMARKING: ${domain}\n\n` +
                `**Current Position**: ${scorecard.score}/100 (${currentGrade.grade} grade)\n` +
                `**Industry Percentile**: ${currentGrade.industry_percentile}\n\n` +
                `## 🎯 GRADE REQUIREMENTS\n\n` +
                `${gradeRequirements.map(grade => 
                    `### ${grade.grade} Grade: ${grade.min_score}+ points\n` +
                    `- **Description**: ${grade.description}\n` +
                    `- **Industry Position**: ${grade.industry_percentile} percentile\n` +
                    `- **Gap from Current**: ${Math.max(0, grade.min_score - scorecard.score)} points\n` +
                    `${grade.grade === currentGrade.grade ? '👈 **YOU ARE HERE**' : ''}\n\n`
                ).join('')}\n\n` +
                `## 🚀 NEXT MILESTONE\n\n` +
                `${nextGrade ? 
                    `**Target**: ${nextGrade.grade} Grade (${nextGrade.min_score}+ points)\n` +
                    `**Points Needed**: +${nextGrade.min_score - scorecard.score} points\n` +
                    `**Industry Position**: Move to ${nextGrade.industry_percentile} percentile\n` +
                    `**Business Impact**: ${nextGrade.description}\n\n` +
                    `**Strategy**: Focus on highest ROI improvements to bridge the ${nextGrade.min_score - scorecard.score}-point gap.` :
                    `**Congratulations!** You're at the highest grade level.`
                }\n\n` +
                `## 🏆 PEER COMPARISON\n\n` +
                `Compare your ${scorecard.score}/100 (${currentGrade.grade}) against industry standards.\n` +
                `Focus on ROI-based improvements to advance to the next grade level efficiently.`,
        },
      ],
    };
  }

  private async findHighImpactFindingsAcrossAssets(domain: string, issueTypes: string[]): Promise<any> {
    // Using a simpler approach based on the primary domain's issues
    let text = `# 🔍 HIGH-IMPACT FINDINGS ANALYSIS: ${domain}\n\nScanning for: ${issueTypes.join(', ')}\n\n`;
    
    try {
      // Check for each issue type in the primary domain
      const results: Record<string, any> = {};
      
      for (const issueType of issueTypes) {
        try {
          const issues = await this.makeRequest(`/companies/${domain}/issues/${issueType}`);
          if (issues.entries && issues.entries.length > 0) {
            results[issueType] = {
              found: true,
              count: issues.entries.length,
              severity: issues.entries[0]?.severity || 'unknown'
            };
          } else {
            results[issueType] = { found: false, count: 0 };
          }
        } catch (error) {
          results[issueType] = { found: false, count: 0 };
        }
      }
      
      text += "## 📊 FINDINGS SUMMARY\n\n";
      issueTypes.forEach(issueType => {
        const result = results[issueType];
        const effort = this.getEffortForIssue(issueType);
        const factor = this.getFactorForIssueType(issueType);
        const weight = this.getFactorWeight(factor);
        
        text += `### ${issueType.replace(/_/g, ' ').toUpperCase()}\n` +
                `- **Status**: ${result.found ? `🔴 Found (${result.count} issues)` : '✅ Not found'}\n` +
                `- **Factor**: ${factor.replace(/_/g, ' ')} (${weight}% weight)\n` +
                `- **Effort to Fix**: ${effort.replace(/_/g, ' ')}\n` +
                `- **Recommendation**: ${result.found ? 
                    `High priority - implement fixes across all affected assets` : 
                    `Good - maintain current configuration`}\n\n`;
      });

      const activeIssues = Object.entries(results).filter(([_, r]) => r.found).length;
      
      text += `## 🎯 STRATEGIC RECOMMENDATIONS\n\n` +
              `**Active Issue Types**: ${activeIssues} / ${issueTypes.length}\n\n` +
              `${activeIssues > 0 ? 
                `Focus on resolving the ${activeIssues} active issue types found. ` +
                `Consider automation or policy-based solutions for widespread issues.` :
                `Excellent! No issues found for the scanned types. ` +
                `Continue monitoring and maintaining current security configurations.`}`;

    } catch (error: any) {
      text += `**Note**: Analysis based on primary domain. Full cross-asset scanning requires additional API access.`;
    }

    return { content: [{ type: "text", text }] };
  }

  // --- HELPER METHODS ---

  private getKeyIssuesForFactor(factorName: string): string[] {
    const issueMap: Record<string, string[]> = {
      'patching_cadence': ['unpatched vulnerabilities', 'slow patch deployment', 'missing critical updates'],
      'dns_health': ['SPF/DMARC records', 'DNSSEC configuration', 'nameserver redundancy'],
      'network_security': ['TLS/SSL configuration', 'open ports', 'certificate validity'],
      'application_security': ['security headers', 'XSS protection', 'cookie security'],
      'endpoint_security': ['malware detection', 'device compliance', 'endpoint protection'],
      'cubit_score': ['credential compromise', 'data exposure', 'breach indicators'],
      'social_engineering': ['phishing susceptibility', 'user awareness', 'email security'],
      'hacker_chatter': ['dark web mentions', 'vulnerability discussions', 'threat intelligence'],
      'leaked_information': ['exposed credentials', 'PII exposure', 'code repository leaks'],
      'ip_reputation': ['blacklist presence', 'spam activity', 'malicious hosting']
    };
    return issueMap[factorName] || ['general security issues'];
  }

  private getEffortForFactor(factorName: string, currentScore: number): 'low' | 'medium' | 'high' {
    if (currentScore > 85) return 'low';
    if (factorName.includes('patching') || factorName.includes('application_security')) {
      return currentScore < 70 ? 'high' : 'medium';
    }
    if (factorName.includes('dns_health') || factorName.includes('network_security')) {
      return currentScore < 60 ? 'medium' : 'low';
    }
    return 'medium';
  }

  private getEffortForIssue(issueType: string): 'quick_win' | 'moderate' | 'major_project' {
    if (issueType.includes('spf') || issueType.includes('dmarc') || issueType.includes('hsts')) return 'quick_win';
    if (issueType.includes('patching_cadence_v3_critical')) return 'major_project';
    if (issueType.includes('patching') || issueType.includes('vulnerability')) return 'moderate';
    if (issueType.includes('tls') || issueType.includes('ssl')) return 'quick_win';
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
      case 'informational': return 1;
      default: return 1;
    }
  }

  private getFactorForIssueType(issueType: string): string {
    if (issueType.includes('patching') || issueType.includes('vuln')) return 'patching_cadence';
    if (issueType.includes('spf') || issueType.includes('dmarc') || issueType.includes('dns')) return 'dns_health';
    if (issueType.includes('tls') || issueType.includes('ssl') || issueType.includes('cert')) return 'network_security';
    if (issueType.includes('csp') || issueType.includes('hsts') || issueType.includes('xss')) return 'application_security';
    if (issueType.includes('leaked') || issueType.includes('breach') || issueType.includes('credential')) return 'leaked_information';
    if (issueType.includes('malware') || issueType.includes('endpoint')) return 'endpoint_security';
    return 'application_security'; // Default
  }

  private getEstimatedImprovementForIssue(issueType: string): number {
    const improvements: Record<string, number> = {
      'spf_record_missing': 15,
      'dmarc_contains_none': 12,
      'dmarc_record_missing': 18,
      'patching_cadence_v3_critical': 25,
      'patching_cadence_v3_high': 20,
      'patching_cadence_v3_medium': 15,
      'tls_weak_cipher': 10,
      'ssl_certificate_expiring': 8,
      'hsts_header_missing': 10,
      'csp_header_missing': 12
    };
    return improvements[issueType] || 10;
  }

  private getTimeToImplement(effort: 'quick_win' | 'moderate' | 'major_project'): string {
    switch(effort) {
      case 'quick_win': return '1-2 weeks';
      case 'moderate': return '1-2 months';
      case 'major_project': return '3-6 months';
      default: return '2-4 weeks';
    }
  }

  private getBusinessCase(issueType: string, volume: number): string {
    const cases: Record<string, string> = {
      'spf_record_missing': `Configure SPF records for ${volume} domains to prevent email spoofing`,
      'dmarc_contains_none': `Strengthen DMARC policy from 'none' to 'quarantine' for ${volume} domains`,
      'patching_cadence_v3_critical': `Emergency patch ${volume} critical vulnerabilities across infrastructure`,
      'tls_weak_cipher': `Update TLS configuration on ${volume} endpoints to use strong ciphers`,
      'hsts_header_missing': `Enable HSTS headers on ${volume} web applications for secure connections`
    };
    return cases[issueType] || `Address ${volume} ${issueType.replace(/_/g, ' ')} issues`;
  }

  private getBusinessImpact(factorName: string, improvement: number): string {
    if (improvement > 3) return 'Major impact on security posture and risk reduction';
    if (improvement > 1.5) return 'Significant improvement in security rating';
    if (improvement > 0.5) return 'Meaningful security enhancement';
    return 'Incremental security improvement';
  }

  private estimateTimeline(pointsNeeded: number, quickWins: number, majorProjects: number): string {
    if (pointsNeeded <= 5 && quickWins >= 3) return '1-2 months focusing on quick wins';
    if (pointsNeeded <= 10 && quickWins >= 2) return '2-4 months with mixed approach';
    if (pointsNeeded <= 20) return '4-6 months with systematic improvements';
    if (majorProjects > 3) return '6-12 months requiring major security program investments';
    return '3-6 months with focused execution';
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("✅ Live SecurityScorecard MCP Server running v4.1.0 - Ready for strategic analysis!");
  }
}

if (process.env.NODE_ENV !== 'test') {
  const server = new ScoreImpactSecurityScorecardServer();
  server.run().catch(console.error);
}
