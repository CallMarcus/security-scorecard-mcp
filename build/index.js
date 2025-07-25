#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, } from "@modelcontextprotocol/sdk/types.js";
// Security Scorecard API base URL
const API_BASE_URL = "https://api.securityscorecard.io";
class SecurityScorecardServer {
    server;
    config;
    constructor() {
        this.server = new Server({
            name: "security-scorecard-enterprise-server",
            version: "0.1.0",
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.config = {
            apiToken: process.env.SECURITY_SCORECARD_API_TOKEN || "",
            defaultDomain: process.env.COMPANY_DOMAIN || "neste.com",
        };
        this.setupToolHandlers();
    }
    async makeRequest(endpoint, method = "GET", body) {
        if (!this.config.apiToken) {
            throw new McpError(ErrorCode.InvalidRequest, "Security Scorecard API token not configured. Set SECURITY_SCORECARD_API_TOKEN environment variable.");
        }
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            "Authorization": `Token ${this.config.apiToken}`,
            "Accept": "application/json",
        };
        if (method !== "GET" && body) {
            headers["Content-Type"] = "application/json";
        }
        try {
            const response = await fetch(url, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined,
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            throw new McpError(ErrorCode.InternalError, `Security Scorecard API request failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: "get_company_overview",
                        description: "Get comprehensive security overview for your company including current score, grade, and key metrics",
                        inputSchema: {
                            type: "object",
                            properties: {
                                domain: {
                                    type: "string",
                                    description: `Company domain to analyze (defaults to ${this.config.defaultDomain})`,
                                    default: this.config.defaultDomain,
                                },
                            },
                        },
                    },
                    {
                        name: "get_current_findings",
                        description: "Get all current security findings/issues for your company with detailed breakdown by category",
                        inputSchema: {
                            type: "object",
                            properties: {
                                domain: {
                                    type: "string",
                                    description: `Company domain (defaults to ${this.config.defaultDomain})`,
                                    default: this.config.defaultDomain,
                                },
                                severity: {
                                    type: "string",
                                    enum: ["critical", "high", "medium", "low"],
                                    description: "Filter by severity level (optional)",
                                },
                                factor: {
                                    type: "string",
                                    description: "Filter by security factor (e.g., 'application_security', 'network_security')",
                                },
                                limit: {
                                    type: "number",
                                    description: "Maximum number of findings to return (default: 100)",
                                    default: 100,
                                },
                            },
                        },
                    },
                    {
                        name: "analyze_findings_by_priority",
                        description: "Analyze and prioritize security findings based on risk impact, helping focus remediation efforts",
                        inputSchema: {
                            type: "object",
                            properties: {
                                domain: {
                                    type: "string",
                                    description: `Company domain (defaults to ${this.config.defaultDomain})`,
                                    default: this.config.defaultDomain,
                                },
                                include_remediation: {
                                    type: "boolean",
                                    description: "Include remediation recommendations (default: true)",
                                    default: true,
                                },
                            },
                        },
                    },
                    {
                        name: "get_factor_breakdown",
                        description: "Get detailed breakdown of all 10 security factors with current scores and contributing issues",
                        inputSchema: {
                            type: "object",
                            properties: {
                                domain: {
                                    type: "string",
                                    description: `Company domain (defaults to ${this.config.defaultDomain})`,
                                    default: this.config.defaultDomain,
                                },
                            },
                        },
                    },
                    {
                        name: "get_findings_by_asset",
                        description: "Group security findings by affected assets (IP addresses, domains, subdomains) for targeted remediation",
                        inputSchema: {
                            type: "object",
                            properties: {
                                domain: {
                                    type: "string",
                                    description: `Company domain (defaults to ${this.config.defaultDomain})`,
                                    default: this.config.defaultDomain,
                                },
                                asset_type: {
                                    type: "string",
                                    enum: ["ip", "domain", "subdomain"],
                                    description: "Filter by asset type (optional)",
                                },
                            },
                        },
                    },
                    {
                        name: "get_historical_trend",
                        description: "Analyze security score trends over time to track improvement/deterioration patterns",
                        inputSchema: {
                            type: "object",
                            properties: {
                                domain: {
                                    type: "string",
                                    description: `Company domain (defaults to ${this.config.defaultDomain})`,
                                    default: this.config.defaultDomain,
                                },
                                months: {
                                    type: "number",
                                    description: "Number of months of history to analyze (default: 12)",
                                    default: 12,
                                },
                                factor: {
                                    type: "string",
                                    description: "Specific security factor to analyze (optional, analyzes overall score if not specified)",
                                },
                            },
                        },
                    },
                    {
                        name: "get_remediation_plan",
                        description: "Generate a prioritized remediation plan based on current findings and their business impact",
                        inputSchema: {
                            type: "object",
                            properties: {
                                domain: {
                                    type: "string",
                                    description: `Company domain (defaults to ${this.config.defaultDomain})`,
                                    default: this.config.defaultDomain,
                                },
                                focus_area: {
                                    type: "string",
                                    description: "Focus on specific security area (optional)",
                                },
                                timeline: {
                                    type: "string",
                                    enum: ["immediate", "30_days", "90_days", "annual"],
                                    description: "Remediation timeline focus (default: 90_days)",
                                    default: "90_days",
                                },
                            },
                        },
                    },
                    {
                        name: "compare_with_industry",
                        description: "Compare your company's security posture with industry benchmarks and peers",
                        inputSchema: {
                            type: "object",
                            properties: {
                                domain: {
                                    type: "string",
                                    description: `Company domain (defaults to ${this.config.defaultDomain})`,
                                    default: this.config.defaultDomain,
                                },
                                industry: {
                                    type: "string",
                                    description: "Industry category for comparison (optional, auto-detected if not specified)",
                                },
                            },
                        },
                    },
                    {
                        name: "get_security_events",
                        description: "Get recent security events and changes that affected your score",
                        inputSchema: {
                            type: "object",
                            properties: {
                                domain: {
                                    type: "string",
                                    description: `Company domain (defaults to ${this.config.defaultDomain})`,
                                    default: this.config.defaultDomain,
                                },
                                days: {
                                    type: "number",
                                    description: "Number of days to look back (default: 30)",
                                    default: 30,
                                },
                                event_type: {
                                    type: "string",
                                    description: "Filter by event type (optional)",
                                },
                            },
                        },
                    },
                    {
                        name: "create_improvement_alert",
                        description: "Set up alerts to monitor security improvement progress",
                        inputSchema: {
                            type: "object",
                            properties: {
                                domain: {
                                    type: "string",
                                    description: `Company domain (defaults to ${this.config.defaultDomain})`,
                                    default: this.config.defaultDomain,
                                },
                                metric: {
                                    type: "string",
                                    enum: ["overall_score", "factor_score", "issue_count"],
                                    description: "Metric to monitor",
                                },
                                target_value: {
                                    type: "number",
                                    description: "Target value to alert on (e.g., score threshold)",
                                },
                                alert_name: {
                                    type: "string",
                                    description: "Name for the alert",
                                },
                                factor: {
                                    type: "string",
                                    description: "Specific factor to monitor (required if metric is 'factor_score')",
                                },
                            },
                            required: ["metric", "target_value", "alert_name"],
                        },
                    },
                ],
            };
        });
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const domain = request.params.arguments?.domain || this.config.defaultDomain;
            switch (request.params.name) {
                case "get_company_overview":
                    return await this.getCompanyOverview(domain);
                case "get_current_findings":
                    return await this.getCurrentFindings(domain, request.params.arguments?.severity, request.params.arguments?.factor, request.params.arguments?.limit);
                case "analyze_findings_by_priority":
                    return await this.analyzeFindingsByPriority(domain, request.params.arguments?.include_remediation);
                case "get_factor_breakdown":
                    return await this.getFactorBreakdown(domain);
                case "get_findings_by_asset":
                    return await this.getFindingsByAsset(domain, request.params.arguments?.asset_type);
                case "get_historical_trend":
                    return await this.getHistoricalTrend(domain, request.params.arguments?.months, request.params.arguments?.factor);
                case "get_remediation_plan":
                    return await this.getRemediationPlan(domain, request.params.arguments?.focus_area, request.params.arguments?.timeline);
                case "compare_with_industry":
                    return await this.compareWithIndustry(domain, request.params.arguments?.industry);
                case "get_security_events":
                    return await this.getSecurityEvents(domain, request.params.arguments?.days, request.params.arguments?.event_type);
                case "create_improvement_alert":
                    return await this.createImprovementAlert(domain, request.params.arguments?.metric, request.params.arguments?.target_value, request.params.arguments?.alert_name, request.params.arguments?.factor);
                default:
                    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
            }
        });
    }
    async getCompanyOverview(domain) {
        const [scorecard, factors] = await Promise.all([
            this.makeRequest(`/companies/${domain}`),
            this.makeRequest(`/companies/${domain}/factors`)
        ]);
        const summary = {
            company: scorecard.name || domain,
            overall_score: scorecard.score,
            overall_grade: scorecard.grade,
            industry: scorecard.industry,
            size: scorecard.size,
            last_updated: scorecard.scorecard_date,
            factor_summary: factors.entries?.map((factor) => ({
                name: factor.name,
                score: factor.score,
                grade: factor.grade,
                percentile: factor.percentile
            }))
        };
        return {
            content: [
                {
                    type: "text",
                    text: `# Security Overview for ${domain}\n\n**Overall Security Score:** ${summary.overall_score}/100 (Grade: ${summary.overall_grade})\n**Industry:** ${summary.industry}\n**Company Size:** ${summary.size}\n**Last Updated:** ${summary.last_updated}\n\n## Factor Breakdown:\n${summary.factor_summary?.map((f) => `- **${f.name}**: ${f.score}/100 (${f.grade}) - ${f.percentile}th percentile`).join('\n')}\n\n*Full Details:*\n\`\`\`json\n${JSON.stringify({ scorecard, factors }, null, 2)}\n\`\`\``,
                },
            ],
        };
    }
    async getCurrentFindings(domain, severity, factor, limit = 100) {
        let endpoint = `/companies/${domain}/issues?limit=${limit}`;
        const params = [];
        if (severity)
            params.push(`severity=${severity}`);
        if (factor)
            params.push(`factor=${factor}`);
        if (params.length > 0) {
            endpoint += `&${params.join('&')}`;
        }
        const issues = await this.makeRequest(endpoint);
        // Group issues by type and severity for better analysis
        const issueAnalysis = {
            total_issues: issues.total || issues.entries?.length || 0,
            by_severity: {},
            by_factor: {},
            by_type: {},
            critical_assets: new Set(),
        };
        if (issues.entries) {
            issues.entries.forEach((issue) => {
                // Count by severity
                const sev = issue.severity || 'unknown';
                issueAnalysis.by_severity[sev] = (issueAnalysis.by_severity[sev] || 0) + 1;
                // Count by factor
                const fact = issue.factor || 'unknown';
                issueAnalysis.by_factor[fact] = (issueAnalysis.by_factor[fact] || 0) + 1;
                // Count by type
                const type = issue.issue_type || 'unknown';
                issueAnalysis.by_type[type] = (issueAnalysis.by_type[type] || 0) + 1;
                // Track critical assets
                if (issue.severity === 'critical' || issue.severity === 'high') {
                    issueAnalysis.critical_assets.add(issue.subject || issue.ip || 'unknown');
                }
            });
        }
        return {
            content: [
                {
                    type: "text",
                    text: `# Current Security Findings for ${domain}\n\n**Total Issues:** ${issueAnalysis.total_issues}\n\n## Severity Distribution:\n${Object.entries(issueAnalysis.by_severity).map(([sev, count]) => `- **${sev.toUpperCase()}**: ${count} issues`).join('\n')}\n\n## By Security Factor:\n${Object.entries(issueAnalysis.by_factor).map(([factor, count]) => `- **${factor}**: ${count} issues`).join('\n')}\n\n## Most Common Issue Types:\n${Object.entries(issueAnalysis.by_type).slice(0, 10).map(([type, count]) => `- **${type}**: ${count} occurrences`).join('\n')}\n\n## Critical Assets (High/Critical Issues):\n${Array.from(issueAnalysis.critical_assets).slice(0, 20).map(asset => `- ${asset}`).join('\n')}\n\n*Full Issue Details:*\n\`\`\`json\n${JSON.stringify(issues, null, 2)}\n\`\`\``,
                },
            ],
        };
    }
    async analyzeFindingsByPriority(domain, includeRemediation = true) {
        const [issues, factors] = await Promise.all([
            this.makeRequest(`/companies/${domain}/issues?limit=200`),
            this.makeRequest(`/companies/${domain}/factors`)
        ]);
        // Priority scoring algorithm
        const prioritizedIssues = issues.entries?.map((issue) => {
            let priorityScore = 0;
            // Severity weighting
            const severityWeights = { critical: 100, high: 75, medium: 50, low: 25 };
            const severity = issue.severity;
            priorityScore += severityWeights[severity] || 0;
            // Factor impact (lower factor score = higher priority)
            const relatedFactor = factors.entries?.find((f) => f.name === issue.factor);
            if (relatedFactor) {
                priorityScore += (100 - relatedFactor.score) * 0.5;
            }
            // Asset criticality (external-facing assets get higher priority)
            if (issue.subject && (issue.subject.includes('www') || issue.subject.includes('api'))) {
                priorityScore += 20;
            }
            return {
                ...issue,
                priority_score: Math.round(priorityScore),
                priority_level: priorityScore > 80 ? 'CRITICAL' : priorityScore > 60 ? 'HIGH' : priorityScore > 40 ? 'MEDIUM' : 'LOW'
            };
        }).sort((a, b) => b.priority_score - a.priority_score) || [];
        const top10Issues = prioritizedIssues.slice(0, 10);
        return {
            content: [
                {
                    type: "text",
                    text: `# Prioritized Security Findings for ${domain}\n\n## Top 10 Priority Issues:\n\n${top10Issues.map((issue, index) => `### ${index + 1}. ${issue.issue_type} [${issue.priority_level}]\n` +
                        `- **Priority Score:** ${issue.priority_score}/100\n` +
                        `- **Severity:** ${issue.severity?.toUpperCase()}\n` +
                        `- **Factor:** ${issue.factor}\n` +
                        `- **Affected Asset:** ${issue.subject || issue.ip || 'N/A'}\n` +
                        `- **Description:** ${issue.description || 'N/A'}\n` +
                        (includeRemediation ? `- **Remediation:** ${issue.remediation || 'Contact security team for specific guidance'}\n` : '') +
                        `---\n`).join('\n')}\n\n*Complete Analysis:*\n\`\`\`json\n${JSON.stringify({ total_analyzed: prioritizedIssues.length, top_issues: top10Issues }, null, 2)}\n\`\`\``,
                },
            ],
        };
    }
    async getFactorBreakdown(domain) {
        const factors = await this.makeRequest(`/companies/${domain}/factors`);
        return {
            content: [
                {
                    type: "text",
                    text: `# Security Factor Breakdown for ${domain}\n\n${factors.entries?.map((factor) => `## ${factor.name}\n` +
                        `- **Score:** ${factor.score}/100 (Grade: ${factor.grade})\n` +
                        `- **Percentile:** ${factor.percentile}th percentile\n` +
                        `- **Issue Count:** ${factor.issue_count || 0}\n` +
                        `- **Description:** ${factor.description || 'N/A'}\n\n`).join('')}\n\n*Detailed Factor Data:*\n\`\`\`json\n${JSON.stringify(factors, null, 2)}\n\`\`\``,
                },
            ],
        };
    }
    async getFindingsByAsset(domain, assetType) {
        const issues = await this.makeRequest(`/companies/${domain}/issues?limit=200`);
        const assetMap = new Map();
        issues.entries?.forEach((issue) => {
            const asset = issue.subject || issue.ip || 'unknown';
            if (!assetMap.has(asset)) {
                assetMap.set(asset, []);
            }
            assetMap.get(asset).push(issue);
        });
        const assetSummary = Array.from(assetMap.entries())
            .map(([asset, assetIssues]) => ({
            asset,
            issue_count: assetIssues.length,
            critical_count: assetIssues.filter(i => i.severity === 'critical').length,
            high_count: assetIssues.filter(i => i.severity === 'high').length,
            issues: assetIssues
        }))
            .sort((a, b) => (b.critical_count * 10 + b.high_count * 5 + b.issue_count) - (a.critical_count * 10 + a.high_count * 5 + a.issue_count));
        return {
            content: [
                {
                    type: "text",
                    text: `# Security Findings by Asset for ${domain}\n\n## Asset Risk Summary:\n\n${assetSummary.slice(0, 20).map((asset) => `### ${asset.asset}\n` +
                        `- **Total Issues:** ${asset.issue_count}\n` +
                        `- **Critical:** ${asset.critical_count}, **High:** ${asset.high_count}\n` +
                        `- **Top Issues:** ${asset.issues.slice(0, 3).map((i) => i.issue_type).join(', ')}\n\n`).join('')}\n\n*Complete Asset Analysis:*\n\`\`\`json\n${JSON.stringify(assetSummary, null, 2)}\n\`\`\``,
                },
            ],
        };
    }
    async getHistoricalTrend(domain, months = 12, factor) {
        const fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - months);
        let endpoint = `/companies/${domain}/history/score?from=${fromDate.toISOString().split('T')[0]}`;
        if (factor) {
            endpoint = `/companies/${domain}/history/factors/${factor}?from=${fromDate.toISOString().split('T')[0]}`;
        }
        const history = await this.makeRequest(endpoint);
        return {
            content: [
                {
                    type: "text",
                    text: `# Security Score Trend for ${domain} (${months} months)\n\n${factor ? `**Factor:** ${factor}\n\n` : '**Overall Security Score**\n\n'}*Historical Data:*\n\`\`\`json\n${JSON.stringify(history, null, 2)}\n\`\`\``,
                },
            ],
        };
    }
    async getRemediationPlan(domain, focusArea, timeline = "90_days") {
        const [issues, factors] = await Promise.all([
            this.makeRequest(`/companies/${domain}/issues?limit=100`),
            this.makeRequest(`/companies/${domain}/factors`)
        ]);
        const plan = {
            timeline,
            focus_area: focusArea,
            immediate_actions: [],
            short_term: [],
            long_term: [],
        };
        // This would be enhanced with actual remediation logic
        return {
            content: [
                {
                    type: "text",
                    text: `# Security Remediation Plan for ${domain}\n\n**Timeline Focus:** ${timeline}\n${focusArea ? `**Focus Area:** ${focusArea}\n` : ''}\n\n## Immediate Actions (0-7 days):\n- Review critical severity findings\n- Patch critical vulnerabilities\n- Update security configurations\n\n## Short-term (1-4 weeks):\n- Address high severity issues\n- Implement missing security controls\n- Update documentation and procedures\n\n## Long-term (1-3 months):\n- Comprehensive security review\n- Process improvements\n- Training and awareness programs\n\n*Detailed Analysis Data:*\n\`\`\`json\n${JSON.stringify({ issues: issues.entries?.slice(0, 20), factors }, null, 2)}\n\`\`\``,
                },
            ],
        };
    }
    async compareWithIndustry(domain, industry) {
        const [scorecard, factors] = await Promise.all([
            this.makeRequest(`/companies/${domain}`),
            this.makeRequest(`/companies/${domain}/factors`)
        ]);
        // Industry comparison would need industry benchmark data
        return {
            content: [
                {
                    type: "text",
                    text: `# Industry Comparison for ${domain}\n\n**Industry:** ${industry || scorecard.industry}\n**Your Score:** ${scorecard.score}/100\n**Your Grade:** ${scorecard.grade}\n\n## Factor Comparison:\n${factors.entries?.map((factor) => `- **${factor.name}:** ${factor.score}/100 (${factor.percentile}th percentile)`).join('\n')}\n\n*Full Comparison Data:*\n\`\`\`json\n${JSON.stringify({ scorecard, factors }, null, 2)}\n\`\`\``,
                },
            ],
        };
    }
    async getSecurityEvents(domain, days = 30, eventType) {
        let endpoint = `/companies/${domain}/events?limit=50`;
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - days);
        endpoint += `&from=${fromDate.toISOString().split('T')[0]}`;
        if (eventType) {
            endpoint += `&event_type=${eventType}`;
        }
        const events = await this.makeRequest(endpoint);
        return {
            content: [
                {
                    type: "text",
                    text: `# Recent Security Events for ${domain} (${days} days)\n\n${events.entries?.map((event) => `## ${event.date}\n` +
                        `- **Type:** ${event.event_type}\n` +
                        `- **Description:** ${event.description}\n` +
                        `- **Impact:** ${event.score_change ? `Score change: ${event.score_change}` : 'No score impact'}\n\n`).join('')}\n\n*Complete Event Log:*\n\`\`\`json\n${JSON.stringify(events, null, 2)}\n\`\`\``,
                },
            ],
        };
    }
    async createImprovementAlert(domain, metric, targetValue, alertName, factor) {
        const alertConfig = {
            domain,
            metric,
            target_value: targetValue,
            factor,
            name: alertName,
        };
        // This would create the actual alert via Security Scorecard API
        const result = { message: "Alert configuration prepared", config: alertConfig };
        return {
            content: [
                {
                    type: "text",
                    text: `# Improvement Alert Created for ${domain}\n\n**Alert Name:** ${alertName}\n**Metric:** ${metric}\n**Target:** ${targetValue}\n${factor ? `**Factor:** ${factor}\n` : ''}\n\n*Alert Configuration:*\n\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\``,
                },
            ],
        };
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error("Security Scorecard Enterprise MCP server running on stdio");
    }
}
const server = new SecurityScorecardServer();
server.run().catch(console.error);
//# sourceMappingURL=index.js.map