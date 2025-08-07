#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getFindingsByCategory } from "./get_findings_by_category.js";
import { getEndpointDetails } from "./api_reference.js";
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, } from "@modelcontextprotocol/sdk/types.js";
// Base URL for the Security Scorecard API
const API_BASE_URL = "https://api.securityscorecard.io";
export class ScoreImpactSecurityScorecardServer {
    constructor() {
        this.factorCache = null;
        this.requestCache = new Map();
        this.server = new Server({
            name: "score-impact-securityscorecard-server-live",
            version: "4.0.2", // Incremented version for the fix
        }, {
            capabilities: {
                tools: {},
            },
        });
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
        this.requestsPerInterval = parseInt(process.env.REQUESTS_PER_INTERVAL || "5", 10);
        this.intervalMs = parseInt(process.env.REQUEST_INTERVAL_MS || "1000", 10);
        this.burstLimit = parseInt(process.env.REQUEST_BURST_LIMIT || String(this.requestsPerInterval), 10);
        this.tokens = this.burstLimit;
        this.lastRefill = Date.now();
        this.pageSize = parseInt(process.env.SCORECARD_PAGE_SIZE || "50", 10);
        this.setupToolHandlers();
    }
    /**
     * Log helper for debugging and troubleshooting. Respects DEBUG_MODE flag.
     */
    log(message, data) {
        if (this.config.debugMode) {
            if (data !== undefined) {
                console.error(`[debug] ${message}`, data);
            }
            else {
                console.error(`[debug] ${message}`);
            }
        }
    }
    /**
     * Wraps tool execution with logging and error handling to provide
     * user-friendly feedback and partial results when possible.
     */
    async executeTool(name, fn) {
        this.log(`Executing tool: ${name}`);
        try {
            const result = await fn();
            this.log(`Tool succeeded: ${name}`);
            return result;
        }
        catch (error) {
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
    async makeRequest(endpoint, method = "GET", body) {
        if (!this.config.apiToken) {
            throw new McpError(ErrorCode.InvalidRequest, "Security Scorecard API token not configured. Set the SECURITY_SCORECARD_API_TOKEN environment variable.");
        }
        const cacheKey = `${method}:${endpoint}:${body ? JSON.stringify(body) : ""}`;
        if (method === "GET") {
            const cached = this.requestCache.get(cacheKey);
            if (cached && cached.expiry > Date.now()) {
                this.log(`Cache hit: ${cacheKey}`);
                return cached.data;
            }
        }
        let allEntries = [];
        let nextUrl = `${API_BASE_URL}${endpoint}`;
        if (method === "GET" && !endpoint.includes("size=") && this.pageSize) {
            const url = new URL(nextUrl);
            url.searchParams.set("size", String(this.pageSize));
            nextUrl = url.toString();
        }
        let result = null;
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
                        throw new McpError(ErrorCode.InvalidRequest, `Authentication failed. Please check your API token. (HTTP 401)`);
                    case 403:
                        throw new McpError(ErrorCode.InvalidRequest, `Permission denied. Your API token may not have access to this resource. (HTTP 403)`);
                    case 404:
                        throw new McpError(ErrorCode.InvalidRequest, `Resource not found at ${endpoint}. Check the domain or identifier. (HTTP 404)`);
                    case 429:
                        const retryAfter = response.headers.get("Retry-After") || "60";
                        throw new McpError(ErrorCode.InvalidRequest, `Rate limit exceeded. Please wait ${retryAfter} seconds before trying again. (HTTP 429)`);
                    default:
                        throw new McpError(ErrorCode.InternalError, `API request failed with status ${response.status}: ${errorText}`);
                }
            }
            const jsonResponse = await response.json();
            if (jsonResponse.data !== undefined) {
                const entries = Array.isArray(jsonResponse.data)
                    ? jsonResponse.data
                    : [jsonResponse.data];
                allEntries = allEntries.concat(entries);
                result = { entries: allEntries };
                if (jsonResponse.pagination?.has_next) {
                    const url = new URL(nextUrl);
                    const currentPage = jsonResponse.pagination.page ?? 1;
                    url.searchParams.set("page", String(currentPage + 1));
                    url.searchParams.set("size", String(jsonResponse.pagination.size ?? this.pageSize));
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
                result = { entries: allEntries };
                if (jsonResponse.next_cursor) {
                    const url = new URL(nextUrl);
                    url.searchParams.set("cursor", jsonResponse.next_cursor);
                    nextUrl = url.toString();
                }
                else {
                    nextUrl = null;
                }
                continue;
            }
            result = jsonResponse;
            nextUrl = null;
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
    async throttleRequest() {
        while (true) {
            const now = Date.now();
            const elapsed = now - this.lastRefill;
            if (elapsed >= this.intervalMs) {
                const tokensToAdd = Math.floor(elapsed / this.intervalMs) * this.requestsPerInterval;
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
    async getFactors() {
        if (this.factorCache) {
            return this.factorCache;
        }
        const data = await this.makeRequest('/factors');
        this.factorCache = data.entries;
        return this.factorCache;
    }
    setupToolHandlers() {
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
                        description: "📊 List findings grouped by factor for a company domain.",
                        inputSchema: {
                            type: "object",
                            properties: {
                                domain: { type: "string", description: "Company domain to analyze.", default: this.config.defaultDomain }
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
                        name: "call_api_endpoint",
                        description: "🔧 Low-level helper to query any SecurityScorecard API endpoint.",
                        inputSchema: {
                            type: "object",
                            properties: {
                                endpoint: { type: "string", description: "REST API path, e.g. /companies/example.com" },
                                method: { type: "string", default: "GET", description: "HTTP method" },
                                body: { type: "object", description: "Optional JSON body for POST/PUT" }
                            },
                            required: ["endpoint"]
                        }
                    }
                ],
            };
        });
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const rawDomain = request.params.arguments?.domain || this.config.defaultDomain;
            switch (request.params.name) {
                case "get_score_improvement_roadmap": {
                    const domain = this.sanitizeDomain(rawDomain);
                    const grade = this.validateTargetGrade(request.params.arguments?.target_grade);
                    return await this.executeTool("get_score_improvement_roadmap", () => this.getScoreImprovementRoadmap(domain, grade));
                }
                case "calculate_factor_score_impact": {
                    const domain = this.sanitizeDomain(rawDomain);
                    return await this.executeTool("calculate_factor_score_impact", () => this.calculateFactorScoreImpact(domain));
                }
                case "get_issues_by_roi": {
                    const domain = this.sanitizeDomain(rawDomain);
                    const topNArg = request.params.arguments?.top_n;
                    const topN = topNArg !== undefined ? this.validateTopN(Number(topNArg)) : 10;
                    const status = this.validateIssueStatus(request.params.arguments?.status || "active");
                    return await this.executeTool("get_issues_by_roi", () => this.getIssuesByROI(domain, topN, status));
                }
                case "find_high_impact_findings_across_assets":
                    return await this.executeTool("find_high_impact_findings_across_assets", () => this.findHighImpactFindingsAcrossAssets(request.params.arguments?.issue_types ||
                        this.config.defaultIssueTypes, this.validateIssueStatus(request.params.arguments?.status || "active")));
                case "get_findings_by_asset": {
                    const domain = this.sanitizeDomain(rawDomain);
                    const assetType = this.validateAssetType(request.params.arguments?.asset_type || "domain");
                    return await this.executeTool("get_findings_by_asset", () => this.getFindingsByAsset(domain, assetType));
                }
                case "get_findings_by_category": {
                    const domain = this.sanitizeDomain(rawDomain);
                    return await this.executeTool("get_findings_by_category", () => this.getFindingsByCategoryTool(domain));
                }
                case "generate_remediation_report": {
                    const domain = this.sanitizeDomain(rawDomain);
                    return await this.executeTool("generate_remediation_report", () => this.generateRemediationReport(domain));
                }
                case "call_api_endpoint":
                    return await this.executeTool("call_api_endpoint", () => this.callApiEndpoint(request.params.arguments?.endpoint, request.params.arguments?.method, request.params.arguments?.body));
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
    async getScoreImprovementRoadmap(domain, targetGrade) {
        domain = this.sanitizeDomain(domain);
        targetGrade = this.validateTargetGrade(targetGrade);
        const [scorecard, companyFactors, allFactors] = await Promise.all([
            this.makeRequest(`/companies/${domain}`),
            this.makeRequest(`/companies/${domain}/factors`),
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
            .map((factor) => {
            const factorName = typeof factor.name === 'string'
                ? factor.name
                : (() => {
                    console.error(`[getScoreImprovementRoadmap] Expected factor name to be string but got: ${JSON.stringify(factor.name)}`);
                    return String(factor.name);
                })();
            const factorDetails = factorMap.get(factorName);
            if (!factorDetails || factor.score === 100)
                return null;
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
            .sort((a, b) => b.roi - a.roi);
        const quickWins = factorImprovements.filter((f) => f.effort === 'low');
        const formatFactor = (value, context) => {
            if (typeof value === 'string')
                return value;
            console.error(`[getScoreImprovementRoadmap] ${context} is not a string: ${JSON.stringify(value)}`);
            return String(value);
        };
        const formatIssues = (issues) => {
            if (!Array.isArray(issues)) {
                console.error(`[getScoreImprovementRoadmap] key_issues is not an array: ${JSON.stringify(issues)}`);
                return [];
            }
            return issues.map(issue => {
                if (typeof issue === 'string')
                    return issue;
                console.error(`[getScoreImprovementRoadmap] key issue is not a string: ${JSON.stringify(issue)}`);
                return String(issue);
            });
        };
        const text = `# 🎯 SCORE IMPROVEMENT ROADMAP: ${domain}\n\n` +
            `**GOAL: ${scorecard.grade} (${currentScore}) → ${targetGrade} (${targetScore}+)**\n` +
            `**POINTS NEEDED: +${pointsNeeded.toFixed(1)}**\n\n` +
            `## 🚀 STRATEGIC PRIORITIES (Ranked by ROI)\n\n` +
            `${factorImprovements
                .slice(0, 5)
                .map((f, i) => `### ${i + 1}. ${formatFactor(f.factor, 'factor name')
                .replace(/_/g, ' ')
                .toUpperCase()}\n` +
                `- **Current Score**: ${f.current_score}/100\n` +
                `- **Potential Gain**: +${f.estimated_improvement.toFixed(1)} overall points\n` +
                `- **Effort Level**: ${f.effort}\n` +
                `- **Key Issues**: ${formatIssues(f.key_issues).join(', ')}\n`)
                .join('\n')}\n\n` +
            `## ⚡ QUICK WINS (${quickWins.length} factors)\n` +
            `${quickWins
                .map((f) => `- **${formatFactor(f.factor, 'factor name').replace(/_/g, ' ')}**: Low effort for an estimated +${f.estimated_improvement.toFixed(1)} point gain.`)
                .join('\n')}\n\n` +
            `**Next Steps**: Focus on the highest ROI factors and all quick wins to efficiently bridge the ${pointsNeeded.toFixed(1)}-point gap.`;
        return { content: [{ type: 'text', text }] };
    }
    async calculateFactorScoreImpact(domain) {
        domain = this.sanitizeDomain(domain);
        const [scorecard, companyFactors, allFactors] = await Promise.all([
            this.makeRequest(`/companies/${domain}`),
            this.makeRequest(`/companies/${domain}/factors`),
            this.getFactors()
        ]);
        const factorMap = new Map(allFactors.map(f => [f.name, f]));
        const factorAnalysis = companyFactors.entries.map((factor) => {
            const factorDetails = factorMap.get(factor.name);
            if (!factorDetails)
                return null;
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
                priority_rank: 0
            };
        }).filter(Boolean)
            .sort((a, b) => b.roi_score - a.roi_score)
            .map((f, index) => ({ ...f, priority_rank: index + 1 }));
        const text = `# 💰 FACTOR SCORE IMPACT ANALYSIS: ${domain}\n\n` +
            `**Current Overall Score**: ${scorecard.score}/100 (${scorecard.grade})\n\n` +
            `## 🎯 ROI-RANKED IMPROVEMENT OPPORTUNITIES\n\n` +
            `${factorAnalysis.map((factor) => `### ${factor.priority_rank}. ${factor.factor_name.replace(/_/g, ' ').toUpperCase()}\n` +
                `- **ROI Score**: ${factor.roi_score.toFixed(1)} (Higher is better)\n` +
                `- **Current Score**: ${factor.current_score}/100 (Weight: ${factor.weight_percentage}%)\n` +
                `- **Impact on Score**: -${factor.points_lost.toFixed(1)} points from overall score\n` +
                `- **Effort to Improve**: ${factor.effort_estimate}\n`).join('\n')}\n\n` +
            `**Strategic Insight**: To maximize score improvement, prioritize factors with the highest ROI score. Start with **${factorAnalysis[0]?.factor_name.replace(/_/g, ' ')}**.`;
        return { content: [{ type: "text", text }] };
    }
    async getIssuesByROI(domain, topN, status = 'active') {
        domain = this.sanitizeDomain(domain);
        topN = this.validateTopN(topN);
        const [allIssues, allFactors] = await Promise.all([
            this.makeRequest(`/companies/${domain}/issues/${status}`),
            this.getFactors()
        ]);
        if (!allIssues.entries || allIssues.entries.length === 0) {
            return { content: [{ type: "text", text: `✅ No ${status} issues found for ${domain}.` }] };
        }
        const factorMap = new Map(allFactors.map(f => [f.name, f]));
        const issueCounts = allIssues.entries.reduce((acc, issue) => {
            acc[issue.type] = (acc[issue.type] || 0) + 1;
            return acc;
        }, {});
        const issueDetailsMap = new Map(allIssues.entries.map((issue) => [issue.type, issue]));
        // FIX: The map/filter/sort chain was refactored to be type-safe.
        // 1. Map to an array that can contain nulls.
        // 2. Filter out the nulls, which tells TypeScript the remaining items are valid IssueROI objects.
        // 3. Now sort and slice can be safely called.
        const issuesByRoi = Object.keys(issueCounts)
            .map((issueType) => {
            const issueDetail = issueDetailsMap.get(issueType);
            if (!issueDetail) {
                return null;
            }
            const factorName = this.getFactorForIssueType(issueType);
            const factorDetails = factorMap.get(factorName);
            const factorWeight = factorDetails?.weight || 5;
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
            };
        })
            .filter((issue) => issue !== null)
            .sort((a, b) => b.roi_score - a.roi_score)
            .slice(0, topN);
        const text = `# 🚀 ISSUES RANKED BY ROI: ${domain}\n\n` +
            `**Top ${issuesByRoi.length} highest ROI security improvements based on ${status} findings:**\n\n` +
            `${issuesByRoi.map((issue, i) => `## ${i + 1}. ${issue.issue_type.replace(/_/g, ' ').toUpperCase()}\n` +
                `- **📊 ROI Score**: ${issue.roi_score.toFixed(1)}\n` +
                `- **🎯 Est. Score Impact**: +${issue.estimated_score_impact.toFixed(2)} points\n` +
                `- **📈 Volume**: ${issue.volume} findings\n` +
                `- **⚡ Effort Level**: ${issue.effort_level.replace(/_/g, ' ')}\n` +
                `- **📂 Factor**: ${issue.factor.replace(/_/g, ' ')}\n`).join('\n')}\n\n` +
            `**Implementation Strategy**: Address these issues in order of their ROI score to achieve the fastest possible improvement in your security posture.`;
        return { content: [{ type: "text", text }] };
    }
    async findHighImpactFindingsAcrossAssets(issueTypes, status = 'active') {
        if (!issueTypes || issueTypes.length === 0) {
            return { content: [{ type: "text", text: "No issue types specified." }] };
        }
        let text = `# 🔍 TACTICAL FINDINGS ACROSS ALL ASSETS\n\nScanning for: ${issueTypes.join(', ')} (${status})\n\n`;
        try {
            const assetsResponse = await this.makeRequest('/esi/assets?type=domain');
            const domains = assetsResponse.entries;
            if (!domains || domains.length === 0) {
                return { content: [{ type: "text", text: "Could not find any domain assets for this organization." }] };
            }
            text += `Found ${domains.length} domains. Starting scan...\n\n`;
            const results = {};
            issueTypes.forEach(it => results[it] = []);
            const promises = domains.flatMap(domain => issueTypes.map(async (issueType) => {
                try {
                    const issues = await this.makeRequest(`/companies/${domain.name}/issues/${status}/${issueType}`);
                    if (issues.entries && issues.entries.length > 0) {
                        results[issueType].push(domain.name);
                    }
                }
                catch (error) {
                    // Ignore 404s for domains not yet scored, log others
                    if (!error.message || !error.message.includes('404')) {
                        console.error(`Error scanning ${domain.name} for ${issueType}: ${error.message}`);
                    }
                }
            }));
            await Promise.all(promises);
            text += "## 📊 SCAN RESULTS\n\n";
            issueTypes.forEach(issueType => {
                const affectedDomains = results[issueType];
                const effort = this.getEffortForIssue(issueType);
                text += `### ${issueType.replace(/_/g, ' ').toUpperCase()}\n` +
                    `- **Affected Domains**: ${affectedDomains.length} / ${domains.length}\n` +
                    `- **Effort to Fix**: ${effort.replace(/_/g, ' ')}\n` +
                    `- **Recommendation**: ${affectedDomains.length > 0 ? `High priority. Remediate across all ${affectedDomains.length} domains.` : 'No findings. ✅'}\n\n`;
            });
        }
        catch (error) {
            text += `**An error occurred during the scan:** ${error.message}`;
        }
        return { content: [{ type: "text", text }] };
    }
    async getFindingsByAsset(domain, assetType = "domain") {
        domain = this.sanitizeDomain(domain);
        assetType = this.validateAssetType(assetType);
        let text = `# 🔍 FINDINGS BY ASSET: ${domain}\n\n`;
        try {
            const assetsResponse = await this.makeRequest(`/esi/assets?type=${assetType}`);
            const assets = (assetsResponse.entries || []).filter((a) => a.name.includes(domain));
            if (assets.length === 0) {
                return { content: [{ type: "text", text: `No ${assetType} assets found for ${domain}.` }] };
            }
            const results = {};
            for (const asset of assets) {
                const issues = await this.makeRequest(`/esi/assets/${asset.id}/issues`);
                results[asset.name] = issues.entries || [];
            }
            text += `Found ${assets.length} ${assetType} assets.`;
            text += `\n\n\`\`\`json\n${JSON.stringify(results, null, 2)}\n\`\`\``;
        }
        catch (error) {
            text += `Error retrieving asset findings: ${error.message}`;
        }
        return { content: [{ type: "text", text }] };
    }
    async getFindingsByCategoryTool(domain) {
        domain = this.sanitizeDomain(domain);
        let text = `# 📊 FINDINGS BY CATEGORY: ${domain}\n\n`;
        try {
            const summary = await getFindingsByCategory(this.makeRequest.bind(this), domain);
            text += `\n\n\`\`\`json\n${JSON.stringify(summary, null, 2)}\n\`\`\``;
        }
        catch (error) {
            text += `Error retrieving category findings: ${error.message}`;
        }
        return { content: [{ type: "text", text }] };
    }
    async generateRemediationReport(domain) {
        domain = this.sanitizeDomain(domain);
        let text = `# 🛠️ REMEDIATION REPORT: ${domain}\n\n`;
        try {
            const [issuesInfo, factorsInfo] = await Promise.all([
                getEndpointDetails('/companies/{domain}/issues/active'),
                getEndpointDetails('/companies/{domain}/factors')
            ]);
            if (issuesInfo || factorsInfo) {
                text += '> Data sources:\n';
                if (issuesInfo)
                    text += `> - ${issuesInfo.method} ${issuesInfo.url}\n`;
                if (factorsInfo)
                    text += `> - ${factorsInfo.method} ${factorsInfo.url}\n`;
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
            text += prioritized.map((f, i) => `## ${i + 1}. ${f.factor.replace(/_/g, ' ').toUpperCase()} (Weight ${f.weight}%)\n` +
                `- **Critical**: ${f.critical_count}, **High**: ${f.high_count}, **Total**: ${f.issue_count}\n` +
                `- **Top Issues**: ${f.top_issues.join(', ') || 'None'}\n` +
                `- **Recommendation**: Focus on ${this.getKeyIssuesForFactor(f.factor).join(', ')}\n`).join('\n');
            text += `\n\n\`\`\`json\n${JSON.stringify(prioritized, null, 2)}\n\`\`\``;
        }
        catch (error) {
            text += `Error generating remediation report: ${error.message}`;
        }
        return { content: [{ type: "text", text }] };
    }
    async callApiEndpoint(endpoint, method, body) {
        const details = await getEndpointDetails(endpoint, method);
        const httpMethod = method || details?.method || "GET";
        const json = await this.makeRequest(endpoint, httpMethod, body);
        const summary = details
            ? `${httpMethod} ${details.url} - ${details.description || ''}`
            : `Response from \`${endpoint}\``;
        const text = `${summary}\n\n\`\`\`json\n${JSON.stringify(json, null, 2)}\n\`\`\``;
        return { content: [{ type: "text", text }] };
    }
    // --- HELPER METHODS ---
    sanitizeDomain(domain) {
        const trimmed = domain.trim().toLowerCase();
        const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
        if (!domainRegex.test(trimmed)) {
            throw new McpError(ErrorCode.InvalidRequest, `Invalid domain format: ${domain}`);
        }
        return trimmed;
    }
    validateTopN(value) {
        if (!Number.isInteger(value) || value < 1 || value > 100) {
            throw new McpError(ErrorCode.InvalidRequest, `Invalid top_n value: ${value}. Must be an integer between 1 and 100.`);
        }
        return value;
    }
    validateAssetType(value) {
        const allowed = ["domain", "ip_address"];
        if (!allowed.includes(value)) {
            throw new McpError(ErrorCode.InvalidRequest, `Invalid asset_type: ${value}`);
        }
        return value;
    }
    validateIssueStatus(value) {
        const allowed = ['active', 'historical'];
        if (!allowed.includes(value)) {
            throw new McpError(ErrorCode.InvalidRequest, `Invalid status: ${value}`);
        }
        return value;
    }
    validateTargetGrade(value) {
        const allowed = ["A", "B", "C"];
        if (!allowed.includes(value)) {
            throw new McpError(ErrorCode.InvalidRequest, `Invalid target_grade: ${value}`);
        }
        return value;
    }
    getKeyIssuesForFactor(factorName) {
        const issueMap = {
            'patching_cadence': ['unpatched vulnerabilities', 'slow patch times'],
            'dns_health': ['SPF/DMARC records', 'DNSSEC', 'nameserver config'],
            'network_security': ['TLS/SSL config', 'open ports', 'certificate validity'],
            'application_security': ['security headers', 'XSS', 'cookie security'],
            'endpoint_security': ['malware signatures', 'device policies'],
            'cubit_score': ['credential compromise', 'leaked data'],
        };
        return issueMap[factorName] || ['general configuration'];
    }
    getEffortForFactor(factorName, currentScore) {
        if (currentScore > 85)
            return 'low';
        if (factorName.includes('patching') || factorName.includes('application_security')) {
            return currentScore < 70 ? 'high' : 'medium';
        }
        if (factorName.includes('dns_health'))
            return 'low';
        return 'medium';
    }
    getEffortForIssue(issueType) {
        if (issueType.includes('spf') || issueType.includes('dmarc') || issueType.includes('hsts'))
            return 'quick_win';
        if (issueType.includes('patching_cadence_v3_critical'))
            return 'major_project';
        if (issueType.includes('patching'))
            return 'moderate';
        return 'moderate';
    }
    getEffortScore(effort) {
        switch (effort) {
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
    getSeverityScore(severity) {
        switch (severity) {
            case 'critical': return 5;
            case 'high': return 4;
            case 'medium': return 3;
            case 'low': return 2;
            default: return 1;
        }
    }
    getFactorForIssueType(issueType) {
        // This is a simplified mapping. A more robust solution might query an API endpoint if available.
        if (issueType.includes('patching') || issueType.includes('vuln'))
            return 'patching_cadence';
        if (issueType.includes('spf') || issueType.includes('dmarc') || issueType.includes('dns'))
            return 'dns_health';
        if (issueType.includes('tls') || issueType.includes('ssl') || issueType.includes('cert'))
            return 'network_security';
        if (issueType.includes('csp') || issueType.includes('hsts') || issueType.includes('xss'))
            return 'application_security';
        if (issueType.includes('leaked') || issueType.includes('breach'))
            return 'cubit_score';
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
