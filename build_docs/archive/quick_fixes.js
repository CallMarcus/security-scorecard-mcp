// quick_fixes.js
// Potential fixes to try in your MCP implementation

// Fix 1: Update the getCurrentFindings method to handle different response formats
async getCurrentFindings(domain, severity, factor, limit = 100) {
    // Try different endpoint variations
    const endpoints = [
        `/companies/${domain}/issues?limit=${limit}`,
        `/companies/${domain}/findings?limit=${limit}`,  // Alternative endpoint
        `/companies/${domain}/vulnerabilities?limit=${limit}`,  // Another possibility
    ];
    
    for (const endpoint of endpoints) {
        try {
            const issues = await this.makeRequest(endpoint);
            
            // Handle different possible response structures
            const entries = issues.entries || issues.items || issues.data || issues.findings || [];
            
            if (entries.length > 0 || issues.total > 0) {
                // Found data! Process it
                console.error(`[DEBUG] Found data at endpoint: ${endpoint}`);
                
                // Normalize the response
                const normalizedIssues = {
                    entries: entries,
                    total: issues.total || entries.length
                };
                
                // Continue with original processing logic...
                const issueAnalysis = {
                    total_issues: normalizedIssues.total,
                    by_severity: {},
                    by_factor: {},
                    by_type: {},
                    critical_assets: new Set(),
                };
                
                if (normalizedIssues.entries) {
                    normalizedIssues.entries.forEach((issue) => {
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
                            text: `# Current Security Findings for ${domain}\n\n**Total Issues:** ${issueAnalysis.total_issues}\n\n## Severity Distribution:\n${Object.entries(issueAnalysis.by_severity).map(([sev, count]) => `- **${sev.toUpperCase()}**: ${count} issues`).join('\n')}\n\n## By Security Factor:\n${Object.entries(issueAnalysis.by_factor).map(([factor, count]) => `- **${factor}**: ${count} issues`).join('\n')}\n\n## Most Common Issue Types:\n${Object.entries(issueAnalysis.by_type).slice(0, 10).map(([type, count]) => `- **${type}**: ${count} occurrences`).join('\n')}\n\n## Critical Assets (High/Critical Issues):\n${Array.from(issueAnalysis.critical_assets).slice(0, 20).map(asset => `- ${asset}`).join('\n')}\n\n*Full Issue Details:*\n\`\`\`json\n${JSON.stringify(normalizedIssues, null, 2)}\n\`\`\``,
                        },
                    ],
                };
            }
        } catch (error) {
            console.error(`[DEBUG] Endpoint ${endpoint} failed:`, error.message);
            continue;
        }
    }
    
    // If no data found, return a meaningful message
    return {
        content: [{
            type: "text",
            text: `⚠️ Unable to retrieve security findings for ${domain}.\n\n` +
                  `This could be due to:\n` +
                  `- API endpoint changes\n` +
                  `- Permission restrictions\n` +
                  `- No findings available for this domain\n\n` +
                  `Please check the API documentation or contact SecurityScorecard support.`
        }]
    };
}

// Fix 2: Handle undefined percentiles in compareWithIndustry
async compareWithIndustry(domain, industry) {
    const [scorecard, factors] = await Promise.all([
        this.makeRequest(`/companies/${domain}`),
        this.makeRequest(`/companies/${domain}/factors`)
    ]);
    
    // Fix percentile display
    const factorComparison = factors.entries?.map((factor) => {
        const percentileText = factor.percentile !== undefined && factor.percentile !== null
            ? `${factor.percentile}th percentile`
            : 'Percentile data not available';
        
        return `- **${factor.name}:** ${factor.score}/100 (${factor.grade}) - ${percentileText}`;
    }).join('\n');
    
    return {
        content: [{
            type: "text",
            text: `# Industry Comparison for ${domain}\n\n` +
                  `**Industry:** ${industry || scorecard.industry}\n` +
                  `**Your Score:** ${scorecard.score}/100\n` +
                  `**Your Grade:** ${scorecard.grade}\n\n` +
                  `## Factor Comparison:\n${factorComparison}\n\n` +
                  `*Full Comparison Data:*\n\`\`\`json\n${JSON.stringify({ scorecard, factors }, null, 2)}\n\`\`\``
        }]
    };
}

// Fix 3: Try to get issues from the factors endpoint
async getIssuesFromFactors(domain) {
    const factors = await this.makeRequest(`/companies/${domain}/factors`);
    
    // Some APIs include issue counts in factor data
    const issuesByFactor = {};
    let totalIssues = 0;
    
    factors.entries?.forEach(factor => {
        if (factor.issue_count || factor.issues_count || factor.findings_count) {
            const count = factor.issue_count || factor.issues_count || factor.findings_count;
            issuesByFactor[factor.name] = count;
            totalIssues += count;
        }
    });
    
    return { issuesByFactor, totalIssues };
}

// Fix 4: Alternative implementation for analyzeFindingsByPriority
async analyzeFindingsByPriority(domain, includeRemediation = true) {
    // First try to get issues normally
    let issues = await this.makeRequest(`/companies/${domain}/issues?limit=200`);
    
    // If no entries, try to construct from factors
    if (!issues.entries || issues.entries.length === 0) {
        const factors = await this.makeRequest(`/companies/${domain}/factors`);
        
        // Create synthetic issue data from factors
        const syntheticIssues = [];
        factors.entries?.forEach(factor => {
            if (factor.score < 70) {  // Low scoring factors likely have issues
                syntheticIssues.push({
                    issue_type: `${factor.name} - Low Score`,
                    severity: factor.score < 50 ? 'high' : 'medium',
                    factor: factor.name,
                    description: `Factor score: ${factor.score}/100 (${factor.grade})`,
                    priority_score: 100 - factor.score
                });
            }
        });
        
        return {
            content: [{
                type: "text",
                text: `# Priority Analysis for ${domain}\n\n` +
                      `⚠️ Unable to retrieve detailed findings. Showing factor-based analysis:\n\n` +
                      `## Low-Scoring Security Factors:\n\n` +
                      syntheticIssues.sort((a, b) => b.priority_score - a.priority_score)
                        .slice(0, 10)
                        .map((issue, index) => 
                          `### ${index + 1}. ${issue.issue_type}\n` +
                          `- **Severity:** ${issue.severity?.toUpperCase()}\n` +
                          `- **Description:** ${issue.description}\n` +
                          `---\n`
                        ).join('\n') +
                      `\n*Note: Detailed findings API unavailable. This analysis is based on factor scores.*`
            }]
        };
    }
    
    // Original implementation continues if issues found...
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
