/**
 * Asset-level management and analysis functions for SecurityScorecard MCP
 * Provides granular asset inventory, scoring, and remediation capabilities
 */

export interface AssetScore {
  asset_name: string;
  asset_type: 'domain' | 'ip_address';
  score?: number;
  grade?: string;
  issues_count: number;
  critical_issues: number;
  high_issues: number;
  last_seen?: string;
}

export interface AssetInventory {
  parent_domain: string;
  total_assets: number;
  domains: AssetScore[];
  ip_addresses: AssetScore[];
  summary: {
    avg_score: number;
    worst_performers: AssetScore[];
    best_performers: AssetScore[];
    total_issues: number;
  };
}

export interface AssetFindings {
  asset_name: string;
  asset_type: 'domain' | 'ip_address';
  findings: {
    [issue_type: string]: {
      count: number;
      severity: string;
      factor: string;
      remediation_effort: 'low' | 'medium' | 'high';
      business_impact: string;
    };
  };
  remediation_priority: Array<{
    issue_type: string;
    priority_score: number;
    quick_win: boolean;
  }>;
}

/**
 * Get comprehensive asset inventory for organization
 */
export async function getAssetInventory(
  makeRequest: (endpoint: string) => Promise<any>,
  domain: string
): Promise<AssetInventory> {
  
  const [domainsResponse, ipsResponse] = await Promise.all([
    makeRequest(`/footprint/${domain}/assets/domains`),
    makeRequest(`/footprint/${domain}/assets/ips`)
  ]);

  const domains = domainsResponse.entries || [];
  const ips = ipsResponse.entries || [];

  // Calculate asset scores and issue counts
  const domainScores: AssetScore[] = [];
  const ipScores: AssetScore[] = [];

  for (const domainAsset of domains) {
    try {
      // Use factors endpoint to get issue summary for each domain asset
      let issueCount = 0;
      let criticalCount = 0;
      let highCount = 0;
      
      try {
        // Try to get factors for this domain directly
        const factors = await makeRequest(`/companies/${domainAsset.name}/factors`);
        factors.entries?.forEach((factor: any) => {
          factor.issue_summary?.forEach((issue: any) => {
            if (issue.count) {
              issueCount += issue.count;
              if (issue.severity === 'critical') criticalCount += issue.count;
              if (issue.severity === 'high') highCount += issue.count;
            }
          });
        });
      } catch (factorError) {
        // If direct access fails, try through parent domain with domain parameter
        const parentDomain = await findParentDomain(makeRequest, domainAsset.name);
        if (parentDomain) {
          const parentFactors = await makeRequest(`/companies/${parentDomain}/factors`);
          const issueTypes = extractIssueTypesFromFactors(parentFactors);
          
          // Sample a few issue types to estimate total issues
          for (const issueType of issueTypes.slice(0, 3)) {
            try {
              const issues = await makeRequest(`/companies/${parentDomain}/issues/${issueType}?domain=${domainAsset.name}`);
              const entries = issues.entries || [];
              issueCount += entries.length;
              criticalCount += entries.filter((i: any) => i.severity === 'critical').length;
              highCount += entries.filter((i: any) => i.severity === 'high').length;
            } catch (issueError) {
              continue;
            }
          }
        }
      }

      domainScores.push({
        asset_name: domainAsset.name,
        asset_type: 'domain',
        issues_count: issueCount,
        critical_issues: criticalCount,
        high_issues: highCount,
        last_seen: domainAsset.last_seen
      });
    } catch (error) {
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
  const sortedByRisk = allAssets.sort((a, b) => 
    (b.critical_issues + b.high_issues) - (a.critical_issues + a.high_issues)
  );

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
 * Get detailed findings for specific asset using correct API patterns
 */
export async function getAssetFindings(
  makeRequest: (endpoint: string) => Promise<any>,
  assetName: string,
  assetType: 'domain' | 'ip_address' = 'domain'
): Promise<AssetFindings> {
  
  const findings: { [key: string]: any } = {};
  
  try {
    // Determine if this is a child asset query or parent domain query
    const isChildAsset = await isChildAssetDomain(makeRequest, assetName);
    
    if (isChildAsset) {
      // For child assets, we need to query through parent domain
      const parentDomain = await findParentDomain(makeRequest, assetName);
      if (parentDomain) {
        // Get available issue types from parent's factors
        const factors = await makeRequest(`/companies/${parentDomain}/factors`);
        const issueTypes = extractIssueTypesFromFactors(factors);
        
        // Query each issue type with domain parameter for child asset
        for (const issueType of issueTypes.slice(0, 10)) { // Limit to avoid rate limits
          try {
            const issues = await makeRequest(`/companies/${parentDomain}/issues/${issueType}?domain=${assetName}`);
            processIssuesIntoFindings(issues.entries || [], findings, issueType);
          } catch (error) {
            // Skip issue types we can't access
            continue;
          }
        }
      }
    } else {
      // For parent domains, use /factors to get issue summary, then optionally fetch specific types
      const factors = await makeRequest(`/companies/${assetName}/factors`);
      
      // Extract issue types and counts from factor summaries
      factors.entries?.forEach((factor: any) => {
        factor.issue_summary?.forEach((issue: any) => {
          if (issue.type && issue.count > 0) {
            findings[issue.type] = {
              count: issue.count,
              severity: issue.severity || 'medium',
              factor: factor.name,
              remediation_effort: getRemediationEffort(issue.type),
              business_impact: getBusinessImpact(issue.type, issue.severity || 'medium')
            };
          }
        });
      });
      
      // If we need more detailed data, fetch specific issue types
      const issueTypes = Object.keys(findings).slice(0, 5); // Limit for performance
      for (const issueType of issueTypes) {
        try {
          const detailedIssues = await makeRequest(`/companies/${assetName}/issues/${issueType}`);
          // Update with more detailed information if available
          if (detailedIssues.entries && detailedIssues.entries.length > 0) {
            findings[issueType].count = detailedIssues.entries.length;
            const firstIssue = detailedIssues.entries[0];
            if (firstIssue.severity) {
              findings[issueType].severity = firstIssue.severity;
              findings[issueType].business_impact = getBusinessImpact(issueType, firstIssue.severity);
            }
          }
        } catch (error) {
          // Keep factor summary data if detailed fetch fails
          continue;
        }
      }
    }
  } catch (error) {
    // If all approaches fail, return empty findings with error context
    console.error(`Error fetching findings for ${assetName}:`, error);
  }

  // Calculate remediation priorities
  const priorities = Object.entries(findings).map(([issueType, data]) => ({
    issue_type: issueType,
    priority_score: calculatePriorityScore(data),
    quick_win: data.remediation_effort === 'low' && ['high', 'critical'].includes(data.severity)
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
export async function compareAssets(
  makeRequest: (endpoint: string) => Promise<any>,
  assetNames: string[]
): Promise<{
  comparison: Array<{
    asset_name: string;
    total_issues: number;
    critical_issues: number;
    high_issues: number;
    security_risk_score: number;
    top_issue_types: string[];
  }>;
  recommendations: string[];
}> {
  
  const comparisons = [];
  
  for (const asset of assetNames) {
    try {
      let totalIssues = 0;
      let criticalCount = 0;
      let highCount = 0;
      let mediumCount = 0;
      const issueTypeCounts: { [key: string]: number } = {};
      
      try {
        // Try to get factors for this asset directly
        const factors = await makeRequest(`/companies/${asset}/factors`);
        factors.entries?.forEach((factor: any) => {
          factor.issue_summary?.forEach((issue: any) => {
            if (issue.count) {
              totalIssues += issue.count;
              issueTypeCounts[issue.type] = (issueTypeCounts[issue.type] || 0) + issue.count;
              
              switch (issue.severity) {
                case 'critical':
                  criticalCount += issue.count;
                  break;
                case 'high':
                  highCount += issue.count;
                  break;
                case 'medium':
                  mediumCount += issue.count;
                  break;
              }
            }
          });
        });
      } catch (factorError) {
        // If direct access fails, try through parent domain
        const parentDomain = await findParentDomain(makeRequest, asset);
        if (parentDomain) {
          const parentFactors = await makeRequest(`/companies/${parentDomain}/factors`);
          const issueTypes = extractIssueTypesFromFactors(parentFactors);
          
          // Query specific issue types for this asset through parent
          for (const issueType of issueTypes.slice(0, 5)) {
            try {
              const issues = await makeRequest(`/companies/${parentDomain}/issues/${issueType}?domain=${asset}`);
              const entries = issues.entries || [];
              
              totalIssues += entries.length;
              issueTypeCounts[issueType] = (issueTypeCounts[issueType] || 0) + entries.length;
              
              entries.forEach((issue: any) => {
                switch (issue.severity) {
                  case 'critical':
                    criticalCount++;
                    break;
                  case 'high':
                    highCount++;
                    break;
                  case 'medium':
                    mediumCount++;
                    break;
                }
              });
            } catch (issueError) {
              continue;
            }
          }
        }
      }
      
      // Calculate risk score (weighted by severity)
      const riskScore = criticalCount * 5 + highCount * 3 + mediumCount * 1;
      
      // Get top issue types
      const topIssues = Object.entries(issueTypeCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([type]) => type);

      comparisons.push({
        asset_name: asset,
        total_issues: totalIssues,
        critical_issues: criticalCount,
        high_issues: highCount,
        security_risk_score: riskScore,
        top_issue_types: topIssues
      });
    } catch (error) {
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
function getFactorForIssueType(issueType: string): string {
  if (issueType.includes('patching') || issueType.includes('vuln')) return 'patching_cadence';
  if (issueType.includes('spf') || issueType.includes('dmarc') || issueType.includes('dns')) return 'dns_health';
  if (issueType.includes('tls') || issueType.includes('ssl') || issueType.includes('cert')) return 'network_security';
  if (issueType.includes('csp') || issueType.includes('hsts') || issueType.includes('xss')) return 'application_security';
  if (issueType.includes('leaked') || issueType.includes('breach')) return 'cubit_score';
  return 'endpoint_security';
}

/**
 * Determine if a domain is a child asset by checking if direct access returns 403/404
 */
async function isChildAssetDomain(makeRequest: (endpoint: string) => Promise<any>, domain: string): Promise<boolean> {
  try {
    await makeRequest(`/companies/${domain}`);
    return false; // If we can access it directly, it's a parent domain
  } catch (error: any) {
    if (error.message && (error.message.includes('403') || error.message.includes('404'))) {
      return true; // 403/404 suggests it's a child asset
    }
    throw error; // Re-throw other errors
  }
}

/**
 * Find parent domain for a child asset (simplified approach)
 * In a real implementation, this might query a company portfolio API
 */
async function findParentDomain(makeRequest: (endpoint: string) => Promise<any>, childDomain: string): Promise<string | null> {
  // Extract root domain as potential parent
  const parts = childDomain.split('.');
  if (parts.length > 2) {
    const rootDomain = parts.slice(-2).join('.');
    try {
      await makeRequest(`/companies/${rootDomain}`);
      return rootDomain;
    } catch (error) {
      return null;
    }
  }
  return null;
}

/**
 * Extract issue types from factors response
 */
function extractIssueTypesFromFactors(factors: any): string[] {
  const issueTypes = new Set<string>();
  factors.entries?.forEach((factor: any) => {
    factor.issue_summary?.forEach((issue: any) => {
      if (issue.type) {
        issueTypes.add(issue.type);
      }
    });
  });
  return Array.from(issueTypes);
}

/**
 * Process issue entries into findings object
 */
function processIssuesIntoFindings(issues: any[], findings: { [key: string]: any }, issueType: string) {
  if (!issues || issues.length === 0) return;
  
  const severities = issues.map(i => i.severity).filter(Boolean);
  const primarySeverity = severities[0] || 'medium';
  
  findings[issueType] = {
    count: issues.length,
    severity: primarySeverity,
    factor: getFactorForIssueType(issueType),
    remediation_effort: getRemediationEffort(issueType),
    business_impact: getBusinessImpact(issueType, primarySeverity)
  };
}

function getRemediationEffort(issueType: string): 'low' | 'medium' | 'high' {
  if (issueType.includes('spf') || issueType.includes('dmarc') || issueType.includes('hsts')) return 'low';
  if (issueType.includes('patching_cadence_v3_critical')) return 'high';
  if (issueType.includes('patching')) return 'medium';
  return 'medium';
}

function getBusinessImpact(issueType: string, severity: string): string {
  const impacts = {
    'critical': 'High risk of immediate security breach',
    'high': 'Significant security vulnerability',
    'medium': 'Moderate security risk',
    'low': 'Low security risk',
    'informational': 'Security best practice recommendation'
  };
  return impacts[severity as keyof typeof impacts] || 'Unknown risk level';
}

function calculatePriorityScore(data: any): number {
  const severityScores = { 'critical': 5, 'high': 4, 'medium': 3, 'low': 2, 'informational': 1 };
  const effortScores = { 'low': 3, 'medium': 2, 'high': 1 };
  
  const severityScore = severityScores[data.severity as keyof typeof severityScores] || 1;
  const effortScore = effortScores[data.remediation_effort as keyof typeof effortScores] || 1;
  
  return (severityScore * data.count * effortScore);
}

function generateComparisonRecommendations(comparisons: any[]): string[] {
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

function findCommonIssues(comparisons: any[]): string[] {
  const allIssues = comparisons.flatMap(c => c.top_issue_types);
  const issueCounts: { [key: string]: number } = {};
  
  allIssues.forEach(issue => {
    issueCounts[issue] = (issueCounts[issue] || 0) + 1;
  });
  
  return Object.entries(issueCounts)
    .filter(([, count]) => count >= Math.ceil(comparisons.length * 0.5))
    .map(([issue]) => issue);
}