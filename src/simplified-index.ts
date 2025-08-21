#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getFindingsByCategory } from "./get_findings_by_category.js";
import { getAssetInventory } from "./asset_management.js";
import { createSecurityScorecardClient } from "./api/client.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

interface SecurityScorecardConfig {
  apiToken: string;
  defaultDomain: string;
}

class SimplifiedSecurityScorecardServer {
  private server: Server;
  private client: any;
  private config: SecurityScorecardConfig;

  constructor() {
    this.server = new Server(
      {
        name: "security-scorecard-simplified",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.config = {
      apiToken: process.env.SECURITY_SCORECARD_API_TOKEN || process.env.SECURITY_SCORECARD_TOKEN || "",
      defaultDomain: process.env.COMPANY_DOMAIN || "example.com"
    };

    if (!this.config.apiToken) {
      console.error("❌ SECURITY_SCORECARD_API_TOKEN or SECURITY_SCORECARD_TOKEN environment variable is required");
      process.exit(1);
    }

    this.client = createSecurityScorecardClient(this.config.apiToken);
    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "security_dashboard",
            description: "📊 COMPLETE SECURITY OVERVIEW: Get comprehensive security status including score, grade, top risks, asset summary, and key metrics. Answers: 'How secure are we?' 'Show me our security posture' 'Give me a security summary'",
            inputSchema: {
              type: "object",
              properties: {
                domain: { 
                  type: "string", 
                  description: "Company domain to analyze", 
                  default: this.config.defaultDomain 
                }
              },
              required: ["domain"]
            }
          },
          {
            name: "analyze_security_risks",
            description: "🚨 COMPREHENSIVE RISK ANALYSIS: Deep dive into all security risks with severity prioritization, business impact assessment, and remediation effort estimates. Answers: 'What are our biggest risks?' 'What should we fix first?' 'Show me critical security issues'",
            inputSchema: {
              type: "object",
              properties: {
                domain: { 
                  type: "string", 
                  description: "Company domain to analyze", 
                  default: this.config.defaultDomain 
                },
                focus: {
                  type: "string",
                  enum: ["critical", "all", "quick-wins"],
                  default: "all",
                  description: "Focus area: critical (high-impact only), all (comprehensive), quick-wins (low-effort high-impact)"
                }
              },
              required: ["domain"]
            }
          },
          {
            name: "create_improvement_plan",
            description: "🎯 ACTIONABLE IMPROVEMENT ROADMAP: Generate strategic security improvement plan with ROI analysis, timeline, and specific next steps. Answers: 'How do we improve our security?' 'Create a security plan' 'What should we do to get to grade A?'",
            inputSchema: {
              type: "object",
              properties: {
                domain: { 
                  type: "string", 
                  description: "Company domain to analyze", 
                  default: this.config.defaultDomain 
                },
                target_grade: {
                  type: "string",
                  enum: ["C", "B", "A"],
                  default: "A",
                  description: "Target security grade to achieve"
                },
                timeline: {
                  type: "string",
                  enum: ["30-days", "90-days", "6-months"],
                  default: "90-days",
                  description: "Timeline for improvement plan"
                }
              },
              required: ["domain"]
            }
          },
          {
            name: "discover_assets",
            description: "🔍 COMPLETE ASSET INVENTORY: Comprehensive asset discovery with security context, risk levels, and vulnerability details for all domains and IPs. Answers: 'What assets do we have?' 'Which assets are most vulnerable?' 'Show me our infrastructure security'",
            inputSchema: {
              type: "object",
              properties: {
                domain: { 
                  type: "string", 
                  description: "Parent domain to discover assets for", 
                  default: this.config.defaultDomain 
                },
                include_risk_details: {
                  type: "boolean",
                  default: true,
                  description: "Include detailed security risk information for each asset"
                }
              },
              required: ["domain"]
            }
          },
          {
            name: "query_security_data",
            description: "🔧 DIRECT API ACCESS: Direct query to SecurityScorecard API for specific data needs not covered by other tools. Use when you need raw API responses or specific endpoint data.",
            inputSchema: {
              type: "object",
              properties: {
                endpoint: {
                  type: "string",
                  description: "API endpoint path (e.g., '/companies/domain.com/factors')"
                },
                method: {
                  type: "string",
                  enum: ["GET", "POST"],
                  default: "GET",
                  description: "HTTP method"
                },
                params: {
                  type: "object",
                  description: "Query parameters or request body",
                  default: {}
                }
              },
              required: ["endpoint"]
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "security_dashboard":
            return await this.getSecurityDashboard(args.domain as string);
          
          case "analyze_security_risks":
            return await this.analyzeSecurityRisks(args.domain as string, args.focus as string);
          
          case "create_improvement_plan":
            return await this.createImprovementPlan(args.domain as string, args.target_grade as string, args.timeline as string);
          
          case "discover_assets":
            return await this.discoverAssets(args.domain as string, args.include_risk_details as boolean);
          
          case "query_security_data":
            return await this.querySecurityData(args.endpoint as string, args.method as string, args.params);
          
          default:
            throw new McpError(ErrorCode.MethodNotFound, `Tool ${name} not found`);
        }
      } catch (error: any) {
        return {
          content: [
            {
              type: "text",
              text: `Error executing ${name}: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  /**
   * COMPREHENSIVE SECURITY DASHBOARD
   * One-stop security overview with all key metrics
   */
  private async getSecurityDashboard(domain: string): Promise<any> {
    const [scorecard, factors, findings, assets] = await Promise.all([
      this.client.getCompanyScorecard(domain).catch(() => null),
      this.client.getCompanyFactors(domain).catch(() => null),
      getFindingsByCategory(domain, this.config.apiToken).catch(() => null),
      getAssetInventory(domain, this.config.apiToken).catch(() => null)
    ]);

    const dashboard = {
      executive_summary: {
        domain,
        overall_score: scorecard?.data?.score || 0,
        security_grade: this.getGradeFromScore(scorecard?.data?.score || 0),
        total_assets: assets?.total_assets || 0,
        total_security_issues: assets?.summary?.total_issues || 0,
        risk_level: this.calculateRiskLevel(scorecard?.data?.score || 0, assets?.summary?.total_issues || 0)
      },
      key_metrics: {
        domains_monitored: assets?.domains?.length || 0,
        ip_addresses_monitored: assets?.ip_addresses?.length || 0,
        critical_findings: findings?.factor_breakdown?.reduce((sum, f) => sum + f.critical_count, 0) || 0,
        high_findings: findings?.factor_breakdown?.reduce((sum, f) => sum + f.high_count, 0) || 0
      },
      top_risk_factors: findings?.factor_breakdown?.slice(0, 5).map(factor => ({
        factor_name: factor.factor,
        issue_count: factor.issue_count,
        critical_issues: factor.critical_count,
        high_issues: factor.high_count,
        priority_score: factor.critical_count * 10 + factor.high_count * 5 + factor.issue_count
      })) || [],
      security_factors_overview: factors?.data?.entries?.map(f => ({
        name: f.name,
        score: f.score,
        grade: f.grade,
        weight: f.weight
      })) || [],
      immediate_actions: this.generateImmediateActions(findings, scorecard),
      next_review_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    return {
      content: [
        {
          type: "text",
          text: `# 📊 SECURITY DASHBOARD: ${domain}\n\n` +
                `## Executive Summary\n` +
                `**Security Score**: ${dashboard.executive_summary.overall_score}/100 (Grade: ${dashboard.executive_summary.security_grade})\n` +
                `**Risk Level**: ${dashboard.executive_summary.risk_level}\n` +
                `**Assets Monitored**: ${dashboard.executive_summary.total_assets} (${dashboard.key_metrics.domains_monitored} domains, ${dashboard.key_metrics.ip_addresses_monitored} IPs)\n` +
                `**Active Security Issues**: ${dashboard.executive_summary.total_security_issues}\n\n` +
                `## Key Security Metrics\n` +
                `- 🚨 **Critical Issues**: ${dashboard.key_metrics.critical_findings}\n` +
                `- ⚠️ **High Issues**: ${dashboard.key_metrics.high_findings}\n` +
                `- 📊 **Security Factors**: ${dashboard.security_factors_overview.length}/10 evaluated\n\n` +
                `## Top Risk Factors\n` +
                dashboard.top_risk_factors.map((factor, i) => 
                  `${i + 1}. **${factor.factor_name.replace(/_/g, ' ').toUpperCase()}**: ${factor.issue_count} issues (${factor.critical_issues} critical, ${factor.high_issues} high)`
                ).join('\n') + '\n\n' +
                `## Immediate Actions Required\n` +
                dashboard.immediate_actions.map((action, i) => `${i + 1}. ${action}`).join('\n') + '\n\n' +
                `## Security Factor Breakdown\n` +
                dashboard.security_factors_overview.map(factor => 
                  `- **${factor.name.replace(/_/g, ' ')}**: ${factor.score}/100 (${factor.grade}) - Weight: ${factor.weight}%`
                ).join('\n') + '\n\n' +
                `📅 **Next Review**: ${dashboard.next_review_date}\n\n` +
                `---\n*This dashboard provides a complete security overview. Use 'analyze_security_risks' for detailed risk analysis or 'create_improvement_plan' for actionable recommendations.*`
        }
      ]
    };
  }

  /**
   * COMPREHENSIVE RISK ANALYSIS
   * Deep dive into all security risks with prioritization
   */
  private async analyzeSecurityRisks(domain: string, focus: string = 'all'): Promise<any> {
    const [findings, factors, assets] = await Promise.all([
      getFindingsByCategory(domain, this.config.apiToken).catch(() => null),
      this.client.getCompanyFactors(domain).catch(() => null),
      getAssetInventory(domain, this.config.apiToken).catch(() => null)
    ]);

    let riskAnalysis = findings?.factor_breakdown || [];

    // Apply focus filter
    if (focus === 'critical') {
      riskAnalysis = riskAnalysis.filter(factor => factor.critical_count > 0);
    } else if (focus === 'quick-wins') {
      riskAnalysis = riskAnalysis.filter(factor => factor.issue_count > 0 && factor.critical_count === 0);
    }

    // Enhanced risk scoring
    const enhancedRisks = riskAnalysis.map(factor => {
      const factorData = factors?.data?.entries?.find(f => f.name === factor.factor);
      const businessImpact = this.calculateBusinessImpact(factor, factorData);
      const remediationEffort = this.estimateRemediationEffort(factor);
      
      const businessImpactScore = this.getImpactScore(businessImpact);
      const remediationEffortScore = this.getEffortScore(remediationEffort);
      
      return {
        ...factor,
        factor_weight: factorData?.weight || 0,
        current_score: factorData?.score || 0,
        business_impact: businessImpact,
        remediation_effort: remediationEffort,
        roi_score: businessImpactScore / remediationEffortScore,
        priority_rank: (factor.critical_count * 50 + factor.high_count * 20 + factor.issue_count * 5) * (factorData?.weight || 1)
      };
    }).sort((a, b) => b.priority_rank - a.priority_rank);

    return {
      content: [
        {
          type: "text",
          text: `# 🚨 SECURITY RISK ANALYSIS: ${domain} (${focus} focus)\n\n` +
                `## Risk Summary\n` +
                `**Total Risk Factors**: ${enhancedRisks.length}\n` +
                `**Critical Issues**: ${enhancedRisks.reduce((sum, r) => sum + r.critical_count, 0)}\n` +
                `**High Issues**: ${enhancedRisks.reduce((sum, r) => sum + r.high_count, 0)}\n` +
                `**Total Issues**: ${enhancedRisks.reduce((sum, r) => sum + r.issue_count, 0)}\n\n` +
                `## Prioritized Risk Factors\n\n` +
                enhancedRisks.map((risk, i) => 
                  `### ${i + 1}. ${risk.factor.replace(/_/g, ' ').toUpperCase()}\n` +
                  `- **Priority Score**: ${Math.round(risk.priority_rank)}\n` +
                  `- **Current Score**: ${risk.current_score}/100 (Weight: ${risk.factor_weight}%)\n` +
                  `- **Issues**: ${risk.issue_count} total (${risk.critical_count} critical, ${risk.high_count} high)\n` +
                  `- **Business Impact**: ${risk.business_impact}\n` +
                  `- **Remediation Effort**: ${risk.remediation_effort}\n` +
                  `- **ROI Score**: ${Math.round(risk.roi_score * 100)/100}\n` +
                  `- **Top Issue Types**: ${risk.issues?.slice(0, 3).map(i => i.issue_type).join(', ') || 'N/A'}\n`
                ).join('\n') + '\n' +
                `## Risk Mitigation Recommendations\n` +
                this.generateRiskMitigationPlan(enhancedRisks) + '\n\n' +
                `---\n*Use 'create_improvement_plan' to get actionable steps for addressing these risks.*`
        }
      ]
    };
  }

  /**
   * ACTIONABLE IMPROVEMENT PLAN
   * Strategic roadmap with specific next steps
   */
  private async createImprovementPlan(domain: string, targetGrade: string = 'A', timeline: string = '90-days'): Promise<any> {
    const [scorecard, findings, factors] = await Promise.all([
      this.client.getCompanyScorecard(domain).catch(() => null),
      getFindingsByCategory(domain, this.config.apiToken).catch(() => null),
      this.client.getCompanyFactors(domain).catch(() => null)
    ]);

    const currentScore = scorecard?.data?.score || 0;
    const targetScore = this.getScoreForGrade(targetGrade);
    const scoreGap = targetScore - currentScore;
    
    const plan = this.generateImprovementRoadmap(findings, factors, targetScore, timeline);

    return {
      content: [
        {
          type: "text",
          text: `# 🎯 SECURITY IMPROVEMENT PLAN: ${domain}\n\n` +
                `## Plan Overview\n` +
                `**Current Score**: ${currentScore}/100 (${this.getGradeFromScore(currentScore)})\n` +
                `**Target Score**: ${targetScore}/100 (${targetGrade})\n` +
                `**Score Gap**: ${scoreGap} points\n` +
                `**Timeline**: ${timeline}\n` +
                `**Estimated Effort**: ${plan.total_effort} person-weeks\n\n` +
                `## Strategic Priorities\n\n` +
                plan.phases.map((phase, i) => 
                  `### Phase ${i + 1}: ${phase.name} (${phase.timeline})\n` +
                  `**Goal**: ${phase.goal}\n` +
                  `**Expected Score Improvement**: +${phase.score_improvement} points\n` +
                  `**Effort Required**: ${phase.effort} person-weeks\n\n` +
                  `**Key Actions**:\n` +
                  phase.actions.map(action => `- ${action}`).join('\n') + '\n\n'
                ).join('') +
                `## Implementation Roadmap\n\n` +
                `### Immediate Actions (Week 1-2)\n` +
                plan.immediate_actions.map(action => `- [ ] ${action}`).join('\n') + '\n\n' +
                `### Quick Wins (Week 3-4)\n` +
                plan.quick_wins.map(win => `- [ ] ${win}`).join('\n') + '\n\n' +
                `### Strategic Improvements (Month 2-3)\n` +
                plan.strategic_improvements.map(improvement => `- [ ] ${improvement}`).join('\n') + '\n\n' +
                `## Success Metrics\n` +
                plan.success_metrics.map(metric => `- **${metric.name}**: ${metric.target}`).join('\n') + '\n\n' +
                `## Risk Mitigation\n` +
                plan.risk_mitigation.map(risk => `- **${risk.risk}**: ${risk.mitigation}`).join('\n') + '\n\n' +
                `---\n*This plan is customized for your current security posture and available resources.*`
        }
      ]
    };
  }

  /**
   * COMPLETE ASSET DISCOVERY
   * Comprehensive asset inventory with security context
   */
  private async discoverAssets(domain: string, includeRiskDetails: boolean = true): Promise<any> {
    const assets = await getAssetInventory(domain, this.config.apiToken);
    
    const assetReport = {
      summary: assets.summary,
      domain_assets: assets.domains.map(d => ({
        ...d,
        risk_level: this.calculateAssetRisk(d.issues_count, d.critical_issues),
        security_priority: d.critical_issues > 0 ? 'HIGH' : d.high_issues > 5 ? 'MEDIUM' : 'LOW'
      })),
      ip_assets: assets.ip_addresses.map(ip => ({
        ...ip,
        risk_level: this.calculateAssetRisk(ip.issues_count, ip.critical_issues),
        security_priority: ip.critical_issues > 0 ? 'HIGH' : ip.high_issues > 5 ? 'MEDIUM' : 'LOW'
      }))
    };

    return {
      content: [
        {
          type: "text",
          text: `# 🔍 ASSET INVENTORY: ${domain}\n\n` +
                `## Asset Summary\n` +
                `**Total Assets**: ${assets.total_assets}\n` +
                `**Domains**: ${assets.domains.length}\n` +
                `**IP Addresses**: ${assets.ip_addresses.length}\n` +
                `**Total Security Issues**: ${assets.summary.total_issues}\n` +
                `**Average Security Score**: ${Math.round(assets.summary.avg_score)}/100\n\n` +
                `## High-Priority Assets (Need Immediate Attention)\n` +
                assetReport.domain_assets
                  .filter(asset => asset.security_priority === 'HIGH')
                  .map(asset => `- **${asset.asset_name}**: ${asset.issues_count} issues (${asset.critical_issues} critical)`)
                  .join('\n') + '\n\n' +
                assetReport.ip_assets
                  .filter(asset => asset.security_priority === 'HIGH')
                  .map(asset => `- **${asset.asset_name}**: ${asset.issues_count} issues (${asset.critical_issues} critical)`)
                  .join('\n') + '\n\n' +
                `## Domain Assets (${assetReport.domain_assets.length})\n` +
                assetReport.domain_assets
                  .sort((a, b) => b.issues_count - a.issues_count)
                  .map(asset => 
                    `- **${asset.asset_name}** (${asset.risk_level} risk): ${asset.issues_count} issues (${asset.critical_issues} critical, ${asset.high_issues} high)`
                  ).join('\n') + '\n\n' +
                `## IP Assets (${assetReport.ip_assets.length})\n` +
                assetReport.ip_assets
                  .sort((a, b) => b.issues_count - a.issues_count)
                  .map(asset => 
                    `- **${asset.asset_name}** (${asset.risk_level} risk): ${asset.issues_count} issues (${asset.critical_issues} critical, ${asset.high_issues} high)`
                  ).join('\n') + '\n\n' +
                `## Asset Security Recommendations\n` +
                this.generateAssetRecommendations(assetReport) + '\n\n' +
                `---\n*Use 'analyze_security_risks' to get detailed security analysis for specific assets.*`
        }
      ]
    };
  }

  /**
   * DIRECT API ACCESS
   * For specific queries not covered by comprehensive tools
   */
  private async querySecurityData(endpoint: string, method: string = 'GET', params: any = {}): Promise<any> {
    try {
      const response = await this.client.callEndpoint(method.toUpperCase(), endpoint, params);
      
      return {
        content: [
          {
            type: "text",
            text: `# 🔧 API QUERY RESULT\n\n` +
                  `**Endpoint**: ${method} ${endpoint}\n` +
                  `**Status**: ${response.status}\n` +
                  `**Data Size**: ${JSON.stringify(response.data).length} bytes\n\n` +
                  `## Response Data\n` +
                  `\`\`\`json\n${JSON.stringify(response.data, null, 2)}\n\`\`\`\n\n` +
                  `---\n*Raw API response. Use other tools for processed insights.*`
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `# ❌ API Query Failed\n\n` +
                  `**Endpoint**: ${method} ${endpoint}\n` +
                  `**Error**: ${error.message}\n\n` +
                  `Please check the endpoint path and parameters.`
          }
        ]
      };
    }
  }

  // Helper methods
  private getGradeFromScore(score: number): string {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  private getScoreForGrade(grade: string): number {
    switch (grade) {
      case 'A': return 90;
      case 'B': return 80;
      case 'C': return 70;
      default: return 90;
    }
  }

  private calculateRiskLevel(score: number, totalIssues: number): string {
    if (score < 60 || totalIssues > 1000) return 'CRITICAL';
    if (score < 70 || totalIssues > 500) return 'HIGH';
    if (score < 80 || totalIssues > 100) return 'MEDIUM';
    return 'LOW';
  }

  private calculateBusinessImpact(factor: any, factorData: any): string {
    const weight = factorData?.weight || 0;
    const criticalIssues = factor.critical_count;
    
    if (weight > 15 && criticalIssues > 0) return 'CRITICAL';
    if (weight > 10 && criticalIssues > 0) return 'HIGH';
    if (weight > 5) return 'MEDIUM';
    return 'LOW';
  }

  private estimateRemediationEffort(factor: any): string {
    const totalIssues = factor.issue_count;
    if (totalIssues > 100) return 'HIGH';
    if (totalIssues > 20) return 'MEDIUM';
    return 'LOW';
  }

  private getImpactScore(impact: string): number {
    switch (impact) {
      case 'CRITICAL': return 10;
      case 'HIGH': return 7;
      case 'MEDIUM': return 4;
      case 'LOW': return 1;
      default: return 1;
    }
  }

  private getEffortScore(effort: string): number {
    switch (effort) {
      case 'HIGH': return 5;
      case 'MEDIUM': return 3;
      case 'LOW': return 1;
      default: return 1;
    }
  }

  private calculateAssetRisk(totalIssues: number, criticalIssues: number): string {
    if (criticalIssues > 0) return 'HIGH';
    if (totalIssues > 10) return 'MEDIUM';
    return 'LOW';
  }

  private generateImmediateActions(findings: any, scorecard: any): string[] {
    const actions = [];
    
    if (findings?.factor_breakdown) {
      const criticalFactors = findings.factor_breakdown.filter((f: any) => f.critical_count > 0);
      criticalFactors.forEach((factor: any) => {
        actions.push(`Address ${factor.critical_count} critical issues in ${factor.factor.replace(/_/g, ' ')}`);
      });
    }

    const score = scorecard?.data?.score || 0;
    if (score < 70) {
      actions.push("Implement basic security controls to improve overall score");
    }

    return actions.slice(0, 5); // Top 5 actions
  }

  private generateRiskMitigationPlan(risks: any[]): string {
    return risks.slice(0, 3).map((risk, i) => 
      `${i + 1}. **${risk.factor.replace(/_/g, ' ').toUpperCase()}**: Focus on ${risk.critical_count > 0 ? 'critical' : 'high'} priority issues first. Estimated effort: ${risk.remediation_effort}.`
    ).join('\n');
  }

  private generateImprovementRoadmap(findings: any, factors: any, targetScore: number, timeline: string): any {
    // Simplified roadmap generation
    return {
      total_effort: "12-16",
      phases: [
        {
          name: "Critical Issue Resolution",
          timeline: "Weeks 1-4",
          goal: "Address all critical security issues",
          score_improvement: 10,
          effort: "4-6",
          actions: ["Fix critical vulnerabilities", "Implement missing security controls", "Update security policies"]
        },
        {
          name: "Security Enhancement",
          timeline: "Weeks 5-8", 
          goal: "Improve security posture across all factors",
          score_improvement: 8,
          effort: "4-5",
          actions: ["Deploy advanced monitoring", "Enhance access controls", "Improve endpoint security"]
        },
        {
          name: "Continuous Improvement",
          timeline: "Weeks 9-12",
          goal: "Maintain and optimize security measures",
          score_improvement: 5,
          effort: "4-5",
          actions: ["Regular security assessments", "Security awareness training", "Process optimization"]
        }
      ],
      immediate_actions: ["Patch critical vulnerabilities", "Enable MFA", "Update security policies"],
      quick_wins: ["Configure DNS security", "Enable TLS", "Set up monitoring"],
      strategic_improvements: ["Implement SIEM", "Security training program", "Compliance framework"],
      success_metrics: [
        { name: "Security Score", target: `${targetScore}+` },
        { name: "Critical Issues", target: "0" },
        { name: "Mean Time to Resolution", target: "<24 hours" }
      ],
      risk_mitigation: [
        { risk: "Resource constraints", mitigation: "Prioritize high-impact, low-effort improvements" },
        { risk: "Business disruption", mitigation: "Phase implementation during maintenance windows" }
      ]
    };
  }

  private generateAssetRecommendations(assetReport: any): string {
    const highRiskAssets = [...assetReport.domain_assets, ...assetReport.ip_assets]
      .filter(asset => asset.security_priority === 'HIGH')
      .length;

    if (highRiskAssets > 0) {
      return `**Priority**: Focus on ${highRiskAssets} high-risk assets with critical issues.\n` +
             `**Actions**: Immediate security assessment and remediation required.\n` +
             `**Timeline**: Address critical issues within 48 hours.`;
    }

    return `**Status**: Good security posture across assets.\n` +
           `**Actions**: Continue regular monitoring and maintenance.\n` +
           `**Timeline**: Monthly security reviews recommended.`;
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("🔒 Simplified SecurityScorecard MCP Server running");
  }
}

const server = new SimplifiedSecurityScorecardServer();
server.start().catch(console.error);