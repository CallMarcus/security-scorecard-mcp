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
  domain: string,
  apiToken: string,
  status: 'OPEN' | 'UNDER_REVIEW' | 'ALL' = 'OPEN'
): Promise<{ factor_breakdown: FactorSummary[] }> {
  const { createSecurityScorecardClient } = await import('./api/client.js');
  const client = createSecurityScorecardClient(apiToken);
  
  const makeRequest = async (endpoint: string) => {
    const response = await client.callEndpoint('GET', endpoint);
    return response.data;
  };
  // ENHANCED: Use confirmed working API Reference pattern from user discovery
  let factorsResponse;
  try {
    // Level 1: Use confirmed working API Reference pattern (user verified)
    factorsResponse = await makeRequest(`/footprint/${domain}/factors`);
  } catch (error) {
    // Level 2: Fallback to companies API (working but limited)
    factorsResponse = await makeRequest(`/companies/${domain}/factors`);
  }
  const factorSummary: FactorSummary[] = [];
  
  // Process each factor and its issue summary
  factorsResponse.entries?.forEach((factor: any) => {
    const issues: FindingEntry[] = [];
    let criticalCount = 0;
    let highCount = 0;
    let totalCount = 0;
    
    // Extract issues from the factor's issue_summary
    factor.issue_summary?.forEach((issue: any) => {
      const findingEntry: FindingEntry = {
        factor: factor.name,
        severity: issue.severity,
        issue_type: issue.type,
        count: issue.count || 0,
        total_score_impact: issue.total_score_impact || 0
      };
      
      issues.push(findingEntry);
      totalCount += issue.count || 0;
      
      if (issue.severity === 'critical') {
        criticalCount += issue.count || 0;
      } else if (issue.severity === 'high') {
        highCount += issue.count || 0;
      }
    });
    
    // Only include factors that have issues
    if (totalCount > 0) {
      factorSummary.push({
        factor: factor.name,
        issue_count: totalCount,
        critical_count: criticalCount,
        high_count: highCount,
        issues: issues
      });
    }
  });
  
  // Sort by risk priority (critical issues weighted highest)
  const sortedFactors = factorSummary.sort((a, b) => 
    (b.critical_count * 10 + b.high_count * 5 + b.issue_count) -
    (a.critical_count * 10 + a.high_count * 5 + a.issue_count)
  );
  
  return { factor_breakdown: sortedFactors };
}
