/**
 * Example: Upgrading your existing MCP tools to use the new API client
 * This shows how to replace manual API calls with the type-safe client
 */

import { createSecurityScorecardClient } from '../src/api/client.js';
import { 
  FindingsByCategory, 
  RemediationReport, 
  AssetInventory,
  ApiResponse 
} from '../src/types/api.js';

// Initialize the client
const client = createSecurityScorecardClient(process.env.SECURITY_SCORECARD_TOKEN!);

/**
 * BEFORE: Manual API call with fetch()
 */
async function getFindingsByCategoryOLD(domain: string, category: string) {
  const response = await fetch(`https://api.securityscorecard.io/companies/${domain}/active-issues`, {
    headers: {
      'Authorization': `Token ${process.env.SECURITY_SCORECARD_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }
  
  const data = await response.json();
  // Manual filtering and processing...
  return data;
}

/**
 * AFTER: Type-safe client with intelligent processing
 */
export async function getFindingsByCategory(domain: string, category: string): Promise<FindingsByCategory> {
  try {
    // Type-safe API call
    const response = await client.getCompanyActiveIssues(domain);
    
    // Smart filtering and categorization
    const issues = response.data.entries || [];
    const categoryIssues = issues.filter((issue: any) => 
      issue.type.toLowerCase().includes(category.toLowerCase()) ||
      issue.factor?.toLowerCase().includes(category.toLowerCase())
    );
    
    // Calculate severity breakdown
    const severityBreakdown = categoryIssues.reduce((acc: any, issue: any) => {
      acc[issue.severity] = (acc[issue.severity] || 0) + 1;
      return acc;
    }, { critical: 0, high: 0, medium: 0, low: 0, informational: 0 });
    
    return {
      category,
      issues: categoryIssues,
      total_count: categoryIssues.length,
      severity_breakdown: severityBreakdown
    };
  } catch (error) {
    throw new Error(`Failed to get findings for ${domain}: ${error.message}`);
  }
}

/**
 * UPGRADED: Generate comprehensive remediation report
 */
export async function generateRemediationReport(domain: string): Promise<RemediationReport> {
  try {
    // Parallel API calls for better performance
    const [scorecard, activeIssues, factors] = await Promise.all([
      client.getCompanyScorecard(domain),
      client.getCompanyActiveIssues(domain),
      client.getCompanyFactors(domain)
    ]);
    
    const issues = activeIssues.data.entries || [];
    const criticalFindings = issues.filter((issue: any) => issue.severity === 'critical');
    const highFindings = issues.filter((issue: any) => issue.severity === 'high');
    
    // Generate intelligent recommendations
    const recommendations = generateRecommendations(issues, factors.data.entries);
    
    // Estimate score improvement potential
    const estimatedImprovement = calculateScoreImprovement(criticalFindings, highFindings);
    
    return {
      domain,
      current_score: scorecard.data.score,
      grade: scorecard.data.grade,
      critical_findings: criticalFindings,
      high_findings: highFindings,
      recommendations,
      estimated_score_improvement: estimatedImprovement
    };
  } catch (error) {
    throw new Error(`Failed to generate remediation report for ${domain}: ${error.message}`);
  }
}

/**
 * NEW: Asset inventory management
 */
export async function getAssetInventory(parentDomain: string): Promise<AssetInventory> {
  try {
    const [domains, ips] = await Promise.all([
      client.getAssetDomains(parentDomain),
      client.getAssetIps(parentDomain)
    ]);
    
    return {
      parent_domain: parentDomain,
      domains: domains.data.entries || [],
      ip_addresses: ips.data.entries || [],
      total_domains: domains.data.count || 0,
      total_ips: ips.data.count || 0,
      last_updated: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Failed to get asset inventory for ${parentDomain}: ${error.message}`);
  }
}

/**
 * NEW: Portfolio health monitoring
 */
export async function monitorPortfolioHealth(portfolioId: string) {
  try {
    const companies = await client.getPortfolioCompanies(portfolioId);
    
    // Get scores for all companies in parallel
    const scorePromises = companies.data.entries.map((company: any) =>
      client.getCompanyScorecard(company.domain).catch(error => ({
        domain: company.domain,
        error: error.message,
        data: null
      }))
    );
    
    const scores = await Promise.all(scorePromises);
    
    // Analyze portfolio health
    const healthyCompanies = scores.filter(s => s.data && s.data.score >= 700);
    const atRiskCompanies = scores.filter(s => s.data && s.data.score < 600);
    const averageScore = scores
      .filter(s => s.data)
      .reduce((sum, s) => sum + s.data.score, 0) / scores.filter(s => s.data).length;
    
    return {
      portfolio_id: portfolioId,
      total_companies: companies.data.count,
      healthy_companies: healthyCompanies.length,
      at_risk_companies: atRiskCompanies.length,
      average_score: Math.round(averageScore),
      score_distribution: categorizeByGrade(scores),
      failed_lookups: scores.filter(s => s.error).length
    };
  } catch (error) {
    throw new Error(`Failed to monitor portfolio health: ${error.message}`);
  }
}

/**
 * NEW: Smart bulk operations
 */
export async function bulkAnalyzeCompanies(domains: string[]) {
  const batchSize = 10; // Process in batches to avoid rate limits
  const results = [];
  
  for (let i = 0; i < domains.length; i += batchSize) {
    const batch = domains.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (domain) => {
      try {
        const [scorecard, issues] = await Promise.all([
          client.getCompanyScorecard(domain),
          client.getCompanyActiveIssues(domain, { limit: 100 })
        ]);
        
        return {
          domain,
          success: true,
          score: scorecard.data.score,
          grade: scorecard.data.grade,
          critical_issues: issues.data.entries?.filter((i: any) => i.severity === 'critical').length || 0,
          total_issues: issues.data.count || 0
        };
      } catch (error) {
        return {
          domain,
          success: false,
          error: error.message
        };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Rate limiting: wait between batches
    if (i + batchSize < domains.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return {
    total_analyzed: domains.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  };
}

// === HELPER FUNCTIONS ===

function generateRecommendations(issues: any[], factors: any[]) {
  const recommendations = [];
  
  // Group issues by factor
  const issuesByFactor = issues.reduce((acc, issue) => {
    const factor = issue.factor || 'unknown';
    if (!acc[factor]) acc[factor] = [];
    acc[factor].push(issue);
    return acc;
  }, {});
  
  // Generate recommendations for each factor
  for (const [factor, factorIssues] of Object.entries(issuesByFactor)) {
    const criticalCount = (factorIssues as any[]).filter(i => i.severity === 'critical').length;
    const highCount = (factorIssues as any[]).filter(i => i.severity === 'high').length;
    
    if (criticalCount > 0 || highCount > 0) {
      recommendations.push({
        issue_type: factor,
        severity: criticalCount > 0 ? 'critical' : 'high',
        impact: criticalCount > 0 ? 'high' : 'medium',
        effort: getEffortEstimate(factor),
        description: getRecommendationDescription(factor),
        remediation_steps: getRemediationSteps(factor)
      });
    }
  }
  
  return recommendations.sort((a, b) => {
    const severityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });
}

function calculateScoreImprovement(criticalFindings: any[], highFindings: any[]): number {
  // Simple estimation based on issue count and severity
  const criticalImpact = criticalFindings.length * 5;
  const highImpact = highFindings.length * 3;
  return Math.min(criticalImpact + highImpact, 100); // Cap at 100 points
}

function categorizeByGrade(scores: any[]) {
  return scores.reduce((acc, score) => {
    if (score.data) {
      const grade = score.data.grade;
      acc[grade] = (acc[grade] || 0) + 1;
    }
    return acc;
  }, {});
}

function getEffortEstimate(factor: string): 'low' | 'medium' | 'high' {
  const lowEffort = ['spf', 'dkim', 'cookie'];
  const highEffort = ['patching', 'infrastructure', 'network'];
  
  if (lowEffort.some(keyword => factor.toLowerCase().includes(keyword))) {
    return 'low';
  }
  if (highEffort.some(keyword => factor.toLowerCase().includes(keyword))) {
    return 'high';
  }
  return 'medium';
}

function getRecommendationDescription(factor: string): string {
  const descriptions: Record<string, string> = {
    'email': 'Implement proper email security controls including SPF, DKIM, and DMARC',
    'ssl': 'Update SSL/TLS certificates and implement proper HTTPS configurations',
    'patching': 'Establish regular patching schedule for operating systems and applications',
    'network': 'Review and secure network infrastructure and open ports',
    'application': 'Address application security vulnerabilities and implement secure coding practices'
  };
  
  for (const [key, description] of Object.entries(descriptions)) {
    if (factor.toLowerCase().includes(key)) {
      return description;
    }
  }
  
  return `Address ${factor} related security issues identified in the assessment`;
}

function getRemediationSteps(factor: string): string[] {
  const steps: Record<string, string[]> = {
    'email': [
      'Implement SPF record with proper IP allowlist',
      'Configure DKIM signing for outbound emails',
      'Set up DMARC policy with monitoring',
      'Regularly review email security configurations'
    ],
    'ssl': [
      'Replace expired or weak SSL certificates',
      'Implement HSTS headers',
      'Configure proper cipher suites',
      'Set up certificate monitoring alerts'
    ],
    'patching': [
      'Inventory all systems and software versions',
      'Establish automated patching schedule',
      'Test patches in staging environment',
      'Monitor vendor security advisories'
    ]
  };
  
  for (const [key, stepList] of Object.entries(steps)) {
    if (factor.toLowerCase().includes(key)) {
      return stepList;
    }
  }
  
  return [
    'Analyze the specific security findings',
    'Develop remediation plan with timeline',
    'Implement security controls',
    'Monitor and validate improvements'
  ];
}

export {
  client as apiClient,
  generateRecommendations,
  calculateScoreImprovement
};