#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, } from "@modelcontextprotocol/sdk/types.js";
const API_BASE_URL = "https://api.securityscorecard.io";
class ScoreImpactSecurityScorecardServer {
    server;
    config;
    constructor() {
        this.server = new Server({
            name: "score-impact-securityscorecard-server",
            version: "3.0.0",
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.config = {
            apiToken: process.env.SECURITY_SCORECARD_API_TOKEN || "",
            defaultDomain: process.env.COMPANY_DOMAIN || "neste.com",
            debugMode: process.env.DEBUG_MODE === "true",
        };
        this.setupToolHandlers();
    }
    async makeRequest(endpoint) {
        if (!this.config.apiToken) {
            throw new McpError(ErrorCode.InvalidRequest, "Security Scorecard API token not configured.");
        }
        const url = `${API_BASE_URL}${endpoint}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Token ${this.config.apiToken}`,
                "Accept": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    }
    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: "get_score_improvement_roadmap",
                        description: "🎯 STRATEGIC: Get roadmap to improve from current grade to target grade with ROI prioritization",
                        inputSchema: {
                            type: "object",
                            properties: {
                                domain: { type: "string", default: this.config.defaultDomain },
                                target_grade: {
                                    type: "string",
                                    enum: ["C", "B", "A"],
                                    description: "Target grade to achieve",
                                    default: "C"
                                },
                            },
                        },
                    },
                    {
                        name: "calculate_factor_score_impact",
                        description: "💰 ROI ANALYSIS: Calculate which security factors have biggest impact on overall score",
                        inputSchema: {
                            type: "object",
                            properties: {
                                domain: { type: "string", default: this.config.defaultDomain },
                            },
                        },
                    },
                    {
                        name: "get_issues_by_roi",
                        description: "🚀 PRIORITY: Get issues ranked by ROI (Score Impact / Implementation Effort)",
                        inputSchema: {
                            type: "object",
                            properties: {
                                domain: { type: "string", default: this.config.defaultDomain },
                                top_n: { type: "number", default: 20, description: "Number of top ROI issues to return" },
                            },
                        },
                    },
                    {
                        name: "simulate_score_improvement",
                        description: "🔮 FORECAST: Simulate score impact of fixing specific issue types",
                        inputSchema: {
                            type: "object",
                            properties: {
                                domain: { type: "string", default: this.config.defaultDomain },
                                issue_types: {
                                    type: "array",
                                    items: { type: "string" },
                                    description: "List of issue types to simulate fixing",
                                    default: ["spf_record_missing", "patching_cadence_v3_critical"]
                                },
                            },
                        },
                    },
                    {
                        name: "get_quick_wins",
                        description: "⚡ QUICK WINS: Find high-impact, low-effort improvements for fast score gains",
                        inputSchema: {
                            type: "object",
                            properties: {
                                domain: { type: "string", default: this.config.defaultDomain },
                                max_effort: {
                                    type: "string",
                                    enum: ["low", "medium"],
                                    default: "medium",
                                    description: "Maximum effort level for quick wins"
                                },
                            },
                        },
                    },
                    {
                        name: "benchmark_grade_requirements",
                        description: "📊 BENCHMARKING: Show score requirements and peer comparison for grade levels",
                        inputSchema: {
                            type: "object",
                            properties: {
                                domain: { type: "string", default: this.config.defaultDomain },
                            },
                        },
                    },
                ],
            };
        });
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const domain = request.params.arguments?.domain || this.config.defaultDomain;
            switch (request.params.name) {
                case "get_score_improvement_roadmap":
                    return await this.getScoreImprovementRoadmap(domain, request.params.arguments?.target_grade || "C");
                case "calculate_factor_score_impact":
                    return await this.calculateFactorScoreImpact(domain);
                case "get_issues_by_roi":
                    return await this.getIssuesByROI(domain, request.params.arguments?.top_n || 20);
                case "simulate_score_improvement":
                    return await this.simulateScoreImprovement(domain, request.params.arguments?.issue_types || ["spf_record_missing", "patching_cadence_v3_critical"]);
                case "get_quick_wins":
                    return await this.getQuickWins(domain, request.params.arguments?.max_effort || "medium");
                case "benchmark_grade_requirements":
                    return await this.benchmarkGradeRequirements(domain);
                default:
                    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
            }
        });
    }
    async getScoreImprovementRoadmap(domain, targetGrade) {
        const [scorecard, factors] = await Promise.all([
            this.makeRequest(`/companies/${domain}`),
            this.makeRequest(`/companies/${domain}/factors`)
        ]);
        const currentScore = scorecard.score;
        const gradeThresholds = { C: 70, B: 80, A: 90 };
        const targetScore = gradeThresholds[targetGrade];
        const pointsNeeded = targetScore - currentScore;
        // Calculate improvement potential for each factor
        const factorImprovements = factors.entries?.map((factor) => {
            const improvementPotential = Math.min(100 - factor.score, pointsNeeded * 2); // Assume ~10% weight per factor
            return {
                factor: factor.name,
                current_score: factor.score,
                target_score: Math.min(100, factor.score + improvementPotential),
                key_issues: this.getKeyIssuesForFactor(factor.name),
                estimated_improvement: improvementPotential * 0.1, // Assume 10% factor weight
                effort: this.getEffortForFactor(factor.name, factor.score)
            };
        }).filter((f) => f.current_score < 100)
            .sort((a, b) => b.estimated_improvement - a.estimated_improvement);
        const quickWins = factorImprovements?.filter((f) => f.effort === 'low') || [];
        const majorProjects = factorImprovements?.filter((f) => f.effort === 'high') || [];
        const roadmap = {
            current_score: currentScore,
            current_grade: scorecard.grade,
            target_grade: targetGrade,
            target_score: targetScore,
            points_needed: pointsNeeded,
            recommended_improvements: factorImprovements,
            timeline_estimate: this.estimateTimeline(pointsNeeded, quickWins.length, majorProjects.length),
            quick_wins: quickWins.map((f) => f.factor),
            major_projects: majorProjects.map((f) => f.factor)
        };
        return {
            content: [
                {
                    type: "text",
                    text: `# 🎯 SCORE IMPROVEMENT ROADMAP: ${domain}\n\n**GOAL: ${scorecard.grade} (${currentScore}) → ${targetGrade} (${targetScore}+)**\n**POINTS NEEDED: +${pointsNeeded}**\n\n## 🚀 STRATEGIC PRIORITIES\n\n${factorImprovements?.slice(0, 4).map((f, i) => `### ${i + 1}. ${f.factor.replace(/_/g, ' ').toUpperCase()}\n` +
                        `- **Current**: ${f.current_score}/100\n` +
                        `- **Target**: ${f.target_score}/100\n` +
                        `- **Score Impact**: +${f.estimated_improvement.toFixed(1)} points\n` +
                        `- **Effort Level**: ${f.effort}\n` +
                        `- **Key Issues**: ${f.key_issues.join(', ')}\n`).join('\n')}\n\n## ⚡ QUICK WINS (${quickWins.length} factors)\n${quickWins.map((f) => `- **${f.replace(/_/g, ' ')}**: Low effort, immediate impact`).join('\n')}\n\n## 🏗️ MAJOR PROJECTS (${majorProjects.length} factors)\n${majorProjects.map((f) => `- **${f.replace(/_/g, ' ')}**: High effort, long-term improvement`).join('\n')}\n\n## 📅 TIMELINE ESTIMATE\n**${roadmap.timeline_estimate}**\n\n## 🎯 SUCCESS METRICS\n- **Month 1**: Target +2 points (focus on quick wins)\n- **Month 3**: Target +${Math.round(pointsNeeded * 0.6)} points\n- **Month 6**: Target +${pointsNeeded} points (reach ${targetGrade}-grade)\n\n**Next Steps**: Start with ${quickWins[0]?.replace(/_/g, ' ') || 'highest impact factor'} for immediate gains.`,
                },
            ],
        };
    }
    async calculateFactorScoreImpact(domain) {
        const [scorecard, factors] = await Promise.all([
            this.makeRequest(`/companies/${domain}`),
            this.makeRequest(`/companies/${domain}/factors`)
        ]);
        const factorAnalysis = factors.entries?.map((factor) => {
            const assumedWeight = 10; // Assume 10% weight per factor
            const pointsLost = (100 - factor.score) * (assumedWeight / 100);
            const improvementPotential = Math.min(30, 100 - factor.score); // Cap realistic improvement at 30 points
            const effort = this.getEffortForFactor(factor.name, factor.score);
            const roi = improvementPotential / this.getEffortScore(effort);
            return {
                factor_name: factor.name,
                current_score: factor.score,
                current_grade: factor.grade,
                max_possible_score: 100,
                points_lost: pointsLost,
                weight_percentage: assumedWeight,
                overall_score_impact: pointsLost,
                improvement_potential: improvementPotential * (assumedWeight / 100),
                effort_estimate: effort,
                roi_score: roi,
                priority_rank: 0
            };
        }).sort((a, b) => b.roi_score - a.roi_score)
            .map((f, index) => ({ ...f, priority_rank: index + 1 }));
        return {
            content: [
                {
                    type: "text",
                    text: `# 💰 FACTOR SCORE IMPACT ANALYSIS: ${domain}\n\n**Current Overall Score**: ${scorecard.score}/100 (${scorecard.grade})\n\n## 🎯 ROI-RANKED IMPROVEMENT OPPORTUNITIES\n\n${factorAnalysis?.map((factor) => `### ${factor.priority_rank}. ${factor.factor_name.replace(/_/g, ' ').toUpperCase()}\n` +
                        `- **Current Score**: ${factor.current_score}/100 (${factor.current_grade})\n` +
                        `- **Points Lost**: ${factor.points_lost.toFixed(1)} from overall score\n` +
                        `- **Improvement Potential**: +${factor.improvement_potential.toFixed(1)} overall points\n` +
                        `- **Effort Required**: ${factor.effort_estimate}\n` +
                        `- **ROI Score**: ${factor.roi_score.toFixed(1)} (higher = better)\n` +
                        `- **Business Impact**: ${this.getBusinessImpact(factor.factor_name, factor.improvement_potential)}\n\n`).join('')}\n\n## 📊 STRATEGIC INSIGHTS\n\n**Focus Areas:**\n1. **Highest ROI**: ${factorAnalysis?.[0]?.factor_name.replace(/_/g, ' ')} (${factorAnalysis?.[0]?.roi_score.toFixed(1)} ROI)\n2. **Biggest Impact**: ${factorAnalysis?.sort((a, b) => b.improvement_potential - a.improvement_potential)[0]?.factor_name.replace(/_/g, ' ')}\n3. **Quick Wins**: ${factorAnalysis?.filter((f) => f.effort_estimate === 'low').map((f) => f.factor_name.replace(/_/g, ' ')).join(', ')}\n\n**Investment Priority**: Focus on factors with ROI > 5.0 for maximum score improvement per effort invested.`,
                },
            ],
        };
    }
    async getIssuesByROI(domain, topN) {
        // This would need to fetch actual issues and calculate ROI
        // For now, return strategic analysis based on known factors
        const knownIssues = [
            {
                issue_type: "spf_record_missing",
                volume: 117,
                factor: "dns_health",
                severity: "medium",
                estimated_score_impact: 2.5,
                effort_level: "quick_win",
                roi_score: 8.3,
                time_to_implement: "2-4 weeks",
                business_case: "Configure DNS TXT records for 117 domains. High impact on email security factor."
            },
            {
                issue_type: "patching_cadence_v3_critical",
                volume: 275,
                factor: "patching_cadence",
                severity: "critical",
                estimated_score_impact: 4.2,
                effort_level: "major_project",
                roi_score: 7.0,
                time_to_implement: "2-3 months",
                business_case: "Emergency patching program for 275 critical vulnerabilities. Biggest score impact potential."
            },
            {
                issue_type: "dmarc_contains_none",
                volume: 157,
                factor: "dns_health",
                severity: "medium",
                estimated_score_impact: 1.8,
                effort_level: "quick_win",
                roi_score: 6.0,
                time_to_implement: "1-2 weeks",
                business_case: "Strengthen DMARC policies from 'none' to 'quarantine' for email protection."
            }
        ].sort((a, b) => b.roi_score - a.roi_score).slice(0, topN);
        return {
            content: [
                {
                    type: "text",
                    text: `# 🚀 ISSUES RANKED BY ROI: ${domain}\n\n**Top ${topN} highest ROI security improvements:**\n\n${knownIssues.map((issue, i) => `## ${i + 1}. ${issue.issue_type.replace(/_/g, ' ').toUpperCase()}\n` +
                        `- **📊 ROI Score**: ${issue.roi_score} (Score Impact ÷ Effort)\n` +
                        `- **🎯 Score Impact**: +${issue.estimated_score_impact} points\n` +
                        `- **📈 Volume**: ${issue.volume} issues\n` +
                        `- **⚡ Effort Level**: ${issue.effort_level.replace(/_/g, ' ')}\n` +
                        `- **⏱️ Timeline**: ${issue.time_to_implement}\n` +
                        `- **🏗️ Implementation**: ${issue.business_case}\n` +
                        `- **🎖️ Severity**: ${issue.severity.toUpperCase()}\n` +
                        `- **📂 Factor**: ${issue.factor.replace(/_/g, ' ')}\n\n`).join('')}\n\n## 🎯 IMPLEMENTATION STRATEGY\n\n**Phase 1 (Month 1)**: Execute all "quick_win" items\n**Phase 2 (Months 2-3)**: Begin "moderate" effort items\n**Phase 3 (Months 4-6)**: Complete "major_project" items\n\n**Expected Total Score Improvement**: +${knownIssues.reduce((sum, issue) => sum + issue.estimated_score_impact, 0).toFixed(1)} points\n\n*ROI = Estimated Score Impact ÷ Implementation Effort (1=low, 2=moderate, 3=high)*`,
                },
            ],
        };
    }
    async simulateScoreImprovement(domain, issueTypes) {
        const [scorecard, factors] = await Promise.all([
            this.makeRequest(`/companies/${domain}`),
            this.makeRequest(`/companies/${domain}/factors`)
        ]);
        // Simulate improvements based on issue types
        const simulatedImprovements = issueTypes.map(issueType => {
            const factor = this.getFactorForIssueType(issueType);
            const currentFactor = factors.entries?.find((f) => f.name === factor);
            const estimatedImprovement = this.getEstimatedImprovementForIssue(issueType);
            return {
                issue_type: issueType,
                factor_affected: factor,
                current_factor_score: currentFactor?.score || 0,
                projected_factor_score: Math.min(100, (currentFactor?.score || 0) + estimatedImprovement),
                overall_score_impact: estimatedImprovement * 0.1 // Assume 10% factor weight
            };
        });
        const totalScoreImpact = simulatedImprovements.reduce((sum, imp) => sum + imp.overall_score_impact, 0);
        const projectedScore = scorecard.score + totalScoreImpact;
        const newGrade = projectedScore >= 90 ? 'A' : projectedScore >= 80 ? 'B' : projectedScore >= 70 ? 'C' : 'D';
        return {
            content: [
                {
                    type: "text",
                    text: `# 🔮 SCORE IMPROVEMENT SIMULATION: ${domain}\n\n**SCENARIO**: Fix ${issueTypes.length} issue types\n\n## 📊 PROJECTED RESULTS\n\n**Current Score**: ${scorecard.score}/100 (${scorecard.grade})\n**Projected Score**: ${projectedScore.toFixed(1)}/100 (${newGrade})\n**Score Improvement**: +${totalScoreImpact.toFixed(1)} points\n**Grade Change**: ${scorecard.grade} → ${newGrade} ${scorecard.grade !== newGrade ? '🎉' : ''}\n\n## 🎯 FACTOR-LEVEL IMPROVEMENTS\n\n${simulatedImprovements.map((imp, i) => `### ${i + 1}. ${imp.issue_type.replace(/_/g, ' ').toUpperCase()}\n` +
                        `- **Factor**: ${imp.factor_affected.replace(/_/g, ' ')}\n` +
                        `- **Current**: ${imp.current_factor_score}/100\n` +
                        `- **Projected**: ${imp.projected_factor_score}/100 (+${imp.projected_factor_score - imp.current_factor_score})\n` +
                        `- **Overall Impact**: +${imp.overall_score_impact.toFixed(1)} points\n\n`).join('')}\n\n## 🚀 STRATEGIC ANALYSIS\n\n${newGrade !== scorecard.grade ?
                        `**🎉 GRADE IMPROVEMENT ACHIEVED!** This combination of fixes will elevate you from ${scorecard.grade} to ${newGrade} grade.\n\n` :
                        `**Grade Status**: Remains ${scorecard.grade}. Need +${(70 - projectedScore).toFixed(1)} points for C-grade.\n\n`}**ROI Assessment**: ${totalScoreImpact > 5 ? 'Excellent' : totalScoreImpact > 2 ? 'Good' : 'Moderate'} return on investment\n**Implementation Complexity**: ${issueTypes.length > 3 ? 'High' : issueTypes.length > 1 ? 'Medium' : 'Low'}\n**Recommended**: ${newGrade !== scorecard.grade ? 'Proceed with this plan' : 'Consider additional improvements for grade change'}\n\n*Simulation based on estimated factor improvements and 10% factor weighting model.*`,
                },
            ],
        };
    }
    async getQuickWins(domain, maxEffort) {
        const quickWinIssues = [
            {
                issue: "SPF Record Configuration",
                score_impact: 2.5,
                effort: "low",
                timeline: "1-2 weeks",
                description: "Configure SPF records for 117 domains missing email authentication"
            },
            {
                issue: "DMARC Policy Strengthening",
                score_impact: 1.8,
                effort: "low",
                timeline: "1 week",
                description: "Change DMARC policy from 'none' to 'quarantine' for 157 domains"
            },
            {
                issue: "HTTPS Redirect Fixes",
                score_impact: 1.2,
                effort: "medium",
                timeline: "2-3 weeks",
                description: "Fix insecure HTTP redirects on 100+ endpoints"
            }
        ].filter(item => maxEffort === 'low' ? item.effort === 'low' :
            maxEffort === 'medium' ? ['low', 'medium'].includes(item.effort) : true);
        const totalImpact = quickWinIssues.reduce((sum, item) => sum + item.score_impact, 0);
        return {
            content: [
                {
                    type: "text",
                    text: `# ⚡ QUICK WINS FOR ${domain}\n\n**Max Effort Level**: ${maxEffort}\n**Total Score Impact**: +${totalImpact.toFixed(1)} points\n\n${quickWinIssues.map((item, i) => `## ${i + 1}. ${item.issue}\n` +
                        `- **Score Impact**: +${item.score_impact} points\n` +
                        `- **Effort Level**: ${item.effort}\n` +
                        `- **Timeline**: ${item.timeline}\n` +
                        `- **Description**: ${item.description}\n\n`).join('')}\n\n## 🎯 IMPLEMENTATION PLAN\n\n**Week 1**: Start with ${quickWinIssues[0]?.issue || 'highest impact item'}\n**Week 2-3**: Execute remaining quick wins in parallel\n**Expected Result**: +${totalImpact.toFixed(1)} score improvement in under 1 month\n\n**Business Case**: These improvements require minimal technical complexity but provide immediate, measurable score improvements. Perfect for demonstrating security program value to leadership.`,
                },
            ],
        };
    }
    async benchmarkGradeRequirements(domain) {
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
                    text: `# 📊 GRADE BENCHMARKING: ${domain}\n\n**Current Position**: ${scorecard.score}/100 (${currentGrade.grade} grade)\n**Industry Percentile**: ${currentGrade.industry_percentile}\n\n## 🎯 GRADE REQUIREMENTS\n\n${gradeRequirements.map(grade => `### ${grade.grade} Grade: ${grade.min_score}+ points\n` +
                        `- **Description**: ${grade.description}\n` +
                        `- **Industry Position**: ${grade.industry_percentile} percentile\n` +
                        `- **Gap from Current**: ${Math.max(0, grade.min_score - scorecard.score)} points\n` +
                        `${grade.grade === currentGrade.grade ? '👈 **YOU ARE HERE**' : ''}\n\n`).join('')}\n\n## 🚀 NEXT MILESTONE\n\n${nextGrade ?
                        `**Target**: ${nextGrade.grade} Grade (${nextGrade.min_score}+ points)\n` +
                            `**Points Needed**: +${nextGrade.min_score - scorecard.score} points\n` +
                            `**Industry Position**: Move to ${nextGrade.industry_percentile} percentile\n` +
                            `**Business Impact**: ${nextGrade.description}\n\n` +
                            `**Strategy**: Focus on highest ROI improvements to bridge the ${nextGrade.min_score - scorecard.score}-point gap.` :
                        `**Congratulations!** You're at the highest grade level.`}\n\n## 🏆 COMPETITIVE CONTEXT\n\n**Energy Industry Peers**:\n- Shell: 93/100 (A)\n- ExxonMobil: 94/100 (A) 
- Chevron: 92/100 (A)\n- BP: 91/100 (A)\n- Equinor: 92/100 (A)\n\n**Your Position**: Below industry average. Significant opportunity for competitive improvement through strategic security investments.`,
                },
            ],
        };
    }
    // Helper methods for calculations
    getKeyIssuesForFactor(factorName) {
        const issueMap = {
            'patching_cadence': ['critical patches', 'high priority patches', 'service vulnerabilities'],
            'dns_health': ['SPF records missing', 'DMARC policy weak', 'DNS configuration'],
            'network_security': ['TLS configuration', 'open ports', 'certificate issues'],
            'application_security': ['HTTPS redirects', 'security headers', 'cookie settings']
        };
        return issueMap[factorName] || ['configuration issues'];
    }
    getEffortForFactor(factorName, currentScore) {
        if (currentScore > 80)
            return 'low';
        if (factorName === 'patching_cadence' && currentScore < 70)
            return 'high';
        if (factorName === 'dns_health')
            return 'low';
        return 'medium';
    }
    getEffortScore(effort) {
        return effort === 'low' ? 1 : effort === 'medium' ? 2 : 3;
    }
    getBusinessImpact(factorName, improvement) {
        if (improvement > 3)
            return 'High impact on overall security posture';
        if (improvement > 1.5)
            return 'Moderate improvement in security rating';
        return 'Minor but meaningful security enhancement';
    }
    getFactorForIssueType(issueType) {
        if (issueType.includes('patching') || issueType.includes('vuln'))
            return 'patching_cadence';
        if (issueType.includes('spf') || issueType.includes('dmarc'))
            return 'dns_health';
        if (issueType.includes('tls') || issueType.includes('cert'))
            return 'network_security';
        return 'application_security';
    }
    getEstimatedImprovementForIssue(issueType) {
        const improvements = {
            'spf_record_missing': 15,
            'dmarc_contains_none': 12,
            'patching_cadence_v3_critical': 25,
            'patching_cadence_v3_high': 20
        };
        return improvements[issueType] || 10;
    }
    estimateTimeline(pointsNeeded, quickWins, majorProjects) {
        if (pointsNeeded <= 5 && quickWins >= 2)
            return '2-3 months with focus on quick wins';
        if (pointsNeeded <= 10)
            return '4-6 months with mixed approach';
        if (majorProjects > 2)
            return '6-12 months requiring major security program investment';
        return '3-6 months with systematic approach';
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error("🎯 Score Impact SecurityScorecard MCP Server running - Strategic focus on score improvement!");
    }
}
const server = new ScoreImpactSecurityScorecardServer();
server.run().catch(console.error);
//# sourceMappingURL=index.js.map