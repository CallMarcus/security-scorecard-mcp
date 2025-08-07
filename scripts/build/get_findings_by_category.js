export async function getFindingsByCategory(makeRequest, domain) {
    const issues = await makeRequest(`/companies/${domain}/issues?limit=200`);
    const factorMap = new Map();
    issues.entries?.forEach((issue) => {
        const factor = issue.factor || 'unknown';
        if (!factorMap.has(factor)) {
            factorMap.set(factor, []);
        }
        factorMap.get(factor).push(issue);
    });
    const factorSummary = Array.from(factorMap.entries())
        .map(([factor, factorIssues]) => ({
        factor,
        issue_count: factorIssues.length,
        critical_count: factorIssues.filter(i => i.severity === 'critical').length,
        high_count: factorIssues.filter(i => i.severity === 'high').length,
        issues: factorIssues
    }))
        .sort((a, b) => (b.critical_count * 10 + b.high_count * 5 + b.issue_count) -
        (a.critical_count * 10 + a.high_count * 5 + a.issue_count));
    return factorSummary;
}
