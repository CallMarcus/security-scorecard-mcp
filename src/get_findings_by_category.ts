export interface FindingEntry {
  factor: string;
  severity?: string;
  issue_type?: string;
  [key: string]: any;
}

export interface FactorSummary {
  factor: string;
  issue_count: number;
  critical_count: number;
  high_count: number;
  issues: FindingEntry[];
}

export async function getFindingsByCategory(
  makeRequest: (endpoint: string) => Promise<any>,
  domain: string
): Promise<FactorSummary[]> {
  const issues = await makeRequest(`/companies/${domain}/issues?limit=200`);
  const factorMap = new Map<string, FindingEntry[]>();
  issues.entries?.forEach((issue: FindingEntry) => {
    const factor = issue.factor || 'unknown';
    if (!factorMap.has(factor)) {
      factorMap.set(factor, []);
    }
    factorMap.get(factor)!.push(issue);
  });
  const factorSummary: FactorSummary[] = Array.from(factorMap.entries())
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
