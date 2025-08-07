/**
 * Asset-level management and analysis functions for SecurityScorecard MCP
 * Provides granular asset inventory, scoring, and remediation capabilities
 */
/**
 * Get comprehensive asset inventory for organization
 */
export async function getAssetInventory(makeRequest, domain) {
    const [domainsResponse, ipsResponse] = await Promise.all([
        makeRequest(`/footprint/${domain}/assets/domains`),
        makeRequest(`/footprint/${domain}/assets/ips`)
    ]);
    const domains = domainsResponse.entries || [];
    const ips = ipsResponse.entries || [];
    // Calculate asset scores and issue counts
    const domainScores = [];
    const ipScores = [];
    for (const domainAsset of domains) {
        try {
            const issues = await makeRequest(`/companies/${domainAsset.name}/issues/active`);
            const issueCount = issues.entries?.length || 0;
            const criticalCount = issues.entries?.filter((i) => i.severity === 'critical').length || 0;
            const highCount = issues.entries?.filter((i) => i.severity === 'high').length || 0;
            domainScores.push({
                asset_name: domainAsset.name,
                asset_type: 'domain',
                issues_count: issueCount,
                critical_issues: criticalCount,
                high_issues: highCount,
                last_seen: domainAsset.last_seen
            });
        }
        catch (error) {
            // Asset may not have scoring data yet
            domainScores.push({
                asset_name: domainAsset.name,
                asset_type: 'domain',
                issues_count: 0,
                critical_issues: 0,
                high_issues: 0
            });
        }
    }
    // Calculate summary statistics
    const allAssets = [...domainScores, ...ipScores];
    const totalIssues = allAssets.reduce((sum, asset) => sum + asset.issues_count, 0);
    // Sort by risk (critical + high issues)
    const sortedByRisk = allAssets.sort((a, b) => (b.critical_issues + b.high_issues) - (a.critical_issues + a.high_issues));
    return {
        parent_domain: domain,
        total_assets: domains.length + ips.length,
        domains: domainScores,
        ip_addresses: ipScores,
        summary: {
            avg_score: 0, // Would need individual scores from API
            worst_performers: sortedByRisk.slice(0, 5),
            best_performers: sortedByRisk.slice(-5).reverse(),
            total_issues: totalIssues
        }
    };
}
/**
 * Get detailed findings for specific asset
 */
export async function getAssetFindings(makeRequest, assetName, assetType = 'domain') {
    const issues = await makeRequest(`/companies/${assetName}/issues/active`);
    const findings = {};
    for (const issue of issues.entries || []) {
        if (!findings[issue.type]) {
            findings[issue.type] = {
                count: 0,
                severity: issue.severity,
                factor: getFactorForIssueType(issue.type),
                remediation_effort: getRemediationEffort(issue.type),
                business_impact: getBusinessImpact(issue.type, issue.severity)
            };
        }
        findings[issue.type].count++;
    }
    // Calculate remediation priorities
    const priorities = Object.entries(findings).map(([issueType, data]) => ({
        issue_type: issueType,
        priority_score: calculatePriorityScore(data),
        quick_win: data.remediation_effort === 'low' && data.severity in ['high', 'critical']
    })).sort((a, b) => b.priority_score - a.priority_score);
    return {
        asset_name: assetName,
        asset_type: assetType,
        findings,
        remediation_priority: priorities
    };
}
/**
 * Compare assets by security posture
 */
export async function compareAssets(makeRequest, assetNames) {
    const comparisons = [];
    for (const asset of assetNames) {
        try {
            const issues = await makeRequest(`/companies/${asset}/issues/active`);
            const entries = issues.entries || [];
            const criticalCount = entries.filter((i) => i.severity === 'critical').length;
            const highCount = entries.filter((i) => i.severity === 'high').length;
            // Calculate risk score (weighted by severity)
            const riskScore = criticalCount * 5 + highCount * 3 +
                entries.filter((i) => i.severity === 'medium').length * 1;
            // Get top issue types
            const issueTypeCounts = {};
            entries.forEach((issue) => {
                issueTypeCounts[issue.type] = (issueTypeCounts[issue.type] || 0) + 1;
            });
            const topIssues = Object.entries(issueTypeCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([type]) => type);
            comparisons.push({
                asset_name: asset,
                total_issues: entries.length,
                critical_issues: criticalCount,
                high_issues: highCount,
                security_risk_score: riskScore,
                top_issue_types: topIssues
            });
        }
        catch (error) {
            comparisons.push({
                asset_name: asset,
                total_issues: 0,
                critical_issues: 0,
                high_issues: 0,
                security_risk_score: 0,
                top_issue_types: []
            });
        }
    }
    // Generate recommendations
    const recommendations = generateComparisonRecommendations(comparisons);
    return {
        comparison: comparisons.sort((a, b) => b.security_risk_score - a.security_risk_score),
        recommendations
    };
}
// Helper functions
function getFactorForIssueType(issueType) {
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
    return 'endpoint_security';
}
function getRemediationEffort(issueType) {
    if (issueType.includes('spf') || issueType.includes('dmarc') || issueType.includes('hsts'))
        return 'low';
    if (issueType.includes('patching_cadence_v3_critical'))
        return 'high';
    if (issueType.includes('patching'))
        return 'medium';
    return 'medium';
}
function getBusinessImpact(issueType, severity) {
    const impacts = {
        'critical': 'High risk of immediate security breach',
        'high': 'Significant security vulnerability',
        'medium': 'Moderate security risk',
        'low': 'Low security risk',
        'informational': 'Security best practice recommendation'
    };
    return impacts[severity] || 'Unknown risk level';
}
function calculatePriorityScore(data) {
    const severityScores = { 'critical': 5, 'high': 4, 'medium': 3, 'low': 2, 'informational': 1 };
    const effortScores = { 'low': 3, 'medium': 2, 'high': 1 };
    const severityScore = severityScores[data.severity] || 1;
    const effortScore = effortScores[data.remediation_effort] || 1;
    return (severityScore * data.count * effortScore);
}
function generateComparisonRecommendations(comparisons) {
    const recommendations = [];
    if (comparisons.length > 1) {
        const highest = comparisons[0];
        const lowest = comparisons[comparisons.length - 1];
        if (highest.security_risk_score > lowest.security_risk_score * 2) {
            recommendations.push(`Focus immediate attention on ${highest.asset_name} - it has significantly higher risk than other assets`);
        }
        const commonIssues = findCommonIssues(comparisons);
        if (commonIssues.length > 0) {
            recommendations.push(`Common issues across assets: ${commonIssues.join(', ')} - consider organization-wide remediation`);
        }
    }
    return recommendations;
}
function findCommonIssues(comparisons) {
    const allIssues = comparisons.flatMap(c => c.top_issue_types);
    const issueCounts = {};
    allIssues.forEach(issue => {
        issueCounts[issue] = (issueCounts[issue] || 0) + 1;
    });
    return Object.entries(issueCounts)
        .filter(([, count]) => count >= Math.ceil(comparisons.length * 0.5))
        .map(([issue]) => issue);
}
