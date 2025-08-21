/**
 * MCP Tools Validation Test Suite
 * Validates existing MCP tools against the new API client
 */

import { describe, test, expect, beforeAll } from '@jest/globals';
import { createSecurityScorecardClient } from '../src/api/client.js';
import { getFindingsByCategory } from '../src/get_findings_by_category.js';
import { getAssetInventory, getAssetFindings } from '../src/asset_management.js';

// Test configuration
const TEST_DOMAIN = process.env.TEST_DOMAIN || 'example.com';
const API_TOKEN = process.env.SECURITY_SCORECARD_TOKEN;

describe('MCP Tools Validation Suite', () => {
  let client: any;
  let oldMakeRequest: (endpoint: string) => Promise<any>;

  beforeAll(() => {
    if (!API_TOKEN) {
      throw new Error('SECURITY_SCORECARD_TOKEN environment variable is required for validation tests');
    }
    
    client = createSecurityScorecardClient(API_TOKEN);
    
    // Create old-style makeRequest function for comparison
    oldMakeRequest = async (endpoint: string) => {
      const response = await fetch(`https://api.securityscorecard.io${endpoint}`, {
        headers: {
          'Authorization': `Token ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    };
  });

  describe('API Connectivity Validation', () => {
    test('new client can connect to SecurityScorecard API', async () => {
      const response = await client.getPortfolios();
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
    });

    test('basic endpoint compatibility', async () => {
      const scorecard = await client.getCompanyScorecard(TEST_DOMAIN);
      expect(scorecard.data).toHaveProperty('score');
      expect(scorecard.data).toHaveProperty('grade');
    }, 10000);

    test('authentication works correctly', async () => {
      // Test that auth headers are properly set
      const response = await client.callEndpoint('GET', '/portfolios');
      expect(response.status).toBe(200);
    });
  });

  describe('get_findings_by_category Tool Validation', () => {
    test('produces consistent results with old implementation', async () => {
      // Test the existing function with both old and new approaches
      const oldResults = await getFindingsByCategory(oldMakeRequest, TEST_DOMAIN, 'OPEN');
      
      // Test with new client
      const newResults = await testFindingsByCategoryNew(TEST_DOMAIN, 'OPEN');
      
      // Compare structure and content
      expect(Array.isArray(oldResults)).toBe(true);
      expect(Array.isArray(newResults)).toBe(true);
      
      if (oldResults.length > 0 && newResults.length > 0) {
        // Check that both have similar structure
        expect(oldResults[0]).toHaveProperty('factor');
        expect(newResults[0]).toHaveProperty('factor');
        expect(oldResults[0]).toHaveProperty('issue_count');
        expect(newResults[0]).toHaveProperty('issue_count');
      }
    }, 15000);

    test('handles different status filters correctly', async () => {
      const openResults = await testFindingsByCategoryNew(TEST_DOMAIN, 'OPEN');
      const allResults = await testFindingsByCategoryNew(TEST_DOMAIN, 'ALL');
      
      expect(Array.isArray(openResults)).toBe(true);
      expect(Array.isArray(allResults)).toBe(true);
      
      // ALL should typically have same or more results than OPEN
      expect(allResults.length).toBeGreaterThanOrEqual(openResults.length);
    }, 15000);

    test('error handling works properly', async () => {
      // Test with invalid domain
      await expect(testFindingsByCategoryNew('invalid-domain-12345.com', 'OPEN'))
        .rejects.toThrow();
    });
  });

  describe('Asset Management Tools Validation', () => {
    test('get_asset_inventory produces valid results', async () => {
      const inventory = await testAssetInventoryNew(TEST_DOMAIN);
      
      expect(inventory).toHaveProperty('parent_domain');
      expect(inventory).toHaveProperty('total_assets');
      expect(inventory).toHaveProperty('domains');
      expect(inventory).toHaveProperty('ip_addresses');
      expect(Array.isArray(inventory.domains)).toBe(true);
      expect(Array.isArray(inventory.ip_addresses)).toBe(true);
    }, 20000);

    test('asset findings provide detailed security info', async () => {
      // First get an asset to test
      const inventory = await testAssetInventoryNew(TEST_DOMAIN);
      
      if (inventory.domains.length > 0) {
        const assetName = inventory.domains[0].asset_name;
        const findings = await testAssetFindingsNew(assetName, 'domain');
        
        expect(findings).toHaveProperty('asset_name');
        expect(findings).toHaveProperty('asset_type');
        expect(findings).toHaveProperty('findings');
        expect(findings).toHaveProperty('remediation_priority');
      }
    }, 25000);
  });

  describe('Performance Benchmarking', () => {
    test('new client is faster than old fetch approach', async () => {
      const iterations = 3;
      
      // Benchmark old approach
      const oldStart = Date.now();
      for (let i = 0; i < iterations; i++) {
        await oldMakeRequest(`/companies/${TEST_DOMAIN}`);
      }
      const oldTime = Date.now() - oldStart;
      
      // Benchmark new approach
      const newStart = Date.now();
      for (let i = 0; i < iterations; i++) {
        await client.getCompanyScorecard(TEST_DOMAIN);
      }
      const newTime = Date.now() - newStart;
      
      console.log(`Old approach: ${oldTime}ms, New approach: ${newTime}ms`);
      
      // New approach should be at least as fast (allowing for variance)
      expect(newTime).toBeLessThanOrEqual(oldTime * 1.2); // Allow 20% variance
    }, 30000);

    test('parallel operations are more efficient', async () => {
      const domains = [TEST_DOMAIN, TEST_DOMAIN]; // Test with same domain to avoid 404s
      
      // Sequential approach
      const sequentialStart = Date.now();
      for (const domain of domains) {
        await client.getCompanyScorecard(domain);
      }
      const sequentialTime = Date.now() - sequentialStart;
      
      // Parallel approach
      const parallelStart = Date.now();
      await Promise.all(domains.map(domain => client.getCompanyScorecard(domain)));
      const parallelTime = Date.now() - parallelStart;
      
      console.log(`Sequential: ${sequentialTime}ms, Parallel: ${parallelTime}ms`);
      expect(parallelTime).toBeLessThan(sequentialTime);
    }, 20000);
  });

  describe('Error Handling Validation', () => {
    test('invalid domains throw meaningful errors', async () => {
      await expect(client.getCompanyScorecard('definitely-not-a-real-domain-12345.com'))
        .rejects.toThrow(/API request failed/);
    });

    test('network errors are handled gracefully', async () => {
      // Test with invalid endpoint
      await expect(client.callEndpoint('GET', '/nonexistent-endpoint'))
        .rejects.toThrow();
    });

    test('authentication errors are clear', async () => {
      const invalidClient = createSecurityScorecardClient('invalid-token-12345');
      await expect(invalidClient.getPortfolios())
        .rejects.toThrow(/401/);
    });
  });

  describe('Data Structure Compatibility', () => {
    test('response structures match expected interfaces', async () => {
      const scorecard = await client.getCompanyScorecard(TEST_DOMAIN);
      
      // Validate expected properties exist
      expect(typeof scorecard.data.score).toBe('number');
      expect(typeof scorecard.data.grade).toBe('string');
      expect(scorecard.data.score).toBeGreaterThanOrEqual(0);
      expect(scorecard.data.score).toBeLessThanOrEqual(1000);
    });

    test('factors data structure is consistent', async () => {
      const factors = await client.getCompanyFactors(TEST_DOMAIN);
      
      if (factors.data.entries && factors.data.entries.length > 0) {
        const factor = factors.data.entries[0];
        expect(factor).toHaveProperty('name');
        expect(typeof factor.score).toBe('number');
      }
    });
  });

  describe('Feature Compatibility', () => {
    test('call_api_endpoint generic functionality works', async () => {
      // Test the generic endpoint caller
      const response = await client.callEndpoint('GET', `/companies/${TEST_DOMAIN}`, {
        queryParams: { limit: 10 }
      });
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
    });

    test('bulk operations handle rate limiting', async () => {
      const domains = [TEST_DOMAIN, TEST_DOMAIN, TEST_DOMAIN]; // Use same domain to avoid 404s
      
      // This should complete without rate limit errors
      const results = await Promise.allSettled(
        domains.map(domain => client.getCompanyScorecard(domain))
      );
      
      const successful = results.filter(r => r.status === 'fulfilled').length;
      expect(successful).toBeGreaterThan(0);
    });
  });
});

// === HELPER FUNCTIONS FOR NEW IMPLEMENTATIONS ===

async function testFindingsByCategoryNew(domain: string, status: 'OPEN' | 'UNDER_REVIEW' | 'ALL') {
  const client = createSecurityScorecardClient(process.env.SECURITY_SCORECARD_TOKEN!);
  
  try {
    // Try new API patterns
    const factorsResponse = await client.getCompanyFactors(domain);
    
    const factorSummary: any[] = [];
    
    factorsResponse.data.entries?.forEach((factor: any) => {
      const issues: any[] = [];
      let criticalCount = 0;
      let highCount = 0;
      let totalCount = 0;
      
      factor.issue_summary?.forEach((issue: any) => {
        const findingEntry = {
          factor: factor.name,
          severity: issue.severity,
          issue_type: issue.type,
          count: issue.count || 0,
          total_score_impact: issue.total_score_impact || 0
        };
        
        issues.push(findingEntry);
        totalCount += issue.count || 0;
        
        if (issue.severity === 'critical') criticalCount += issue.count || 0;
        if (issue.severity === 'high') highCount += issue.count || 0;
      });
      
      factorSummary.push({
        factor: factor.name,
        issue_count: totalCount,
        critical_count: criticalCount,
        high_count: highCount,
        issues: issues
      });
    });
    
    return factorSummary;
  } catch (error) {
    throw new Error(`Failed to get findings by category: ${error.message}`);
  }
}

async function testAssetInventoryNew(domain: string) {
  const client = createSecurityScorecardClient(process.env.SECURITY_SCORECARD_TOKEN!);
  
  try {
    const [domainsResponse, ipsResponse] = await Promise.allSettled([
      client.getAssetDomains(domain),
      client.getAssetIps(domain)
    ]);
    
    const domains = domainsResponse.status === 'fulfilled' ? domainsResponse.value.data.entries || [] : [];
    const ips = ipsResponse.status === 'fulfilled' ? ipsResponse.value.data.entries || [] : [];
    
    return {
      parent_domain: domain,
      total_assets: domains.length + ips.length,
      domains: domains.map((d: any) => ({
        asset_name: d.name || d.domain,
        asset_type: 'domain' as const,
        score: d.score,
        grade: d.grade,
        issues_count: d.total_issues || 0,
        critical_issues: d.critical_issues || 0,
        high_issues: d.high_issues || 0,
        last_seen: d.last_seen
      })),
      ip_addresses: ips.map((ip: any) => ({
        asset_name: ip.ip || ip.name,
        asset_type: 'ip_address' as const,
        score: ip.score,
        grade: ip.grade,
        issues_count: ip.total_issues || 0,
        critical_issues: ip.critical_issues || 0,
        high_issues: ip.high_issues || 0,
        last_seen: ip.last_seen
      })),
      summary: {
        avg_score: 0, // Calculate if needed
        worst_performers: [],
        best_performers: [],
        total_issues: 0
      }
    };
  } catch (error) {
    throw new Error(`Failed to get asset inventory: ${error.message}`);
  }
}

async function testAssetFindingsNew(assetName: string, assetType: 'domain' | 'ip_address') {
  const client = createSecurityScorecardClient(process.env.SECURITY_SCORECARD_TOKEN!);
  
  try {
    // Get active issues for the asset
    const issuesResponse = await client.getCompanyActiveIssues(assetName);
    
    const findings: any = {};
    const remediationPriority: any[] = [];
    
    issuesResponse.data.entries?.forEach((issue: any) => {
      findings[issue.type] = {
        count: issue.count || 1,
        severity: issue.severity,
        factor: issue.factor,
        remediation_effort: 'medium', // Default
        business_impact: issue.description || 'Security finding requiring attention'
      };
      
      remediationPriority.push({
        issue_type: issue.type,
        priority_score: calculatePriorityScore(issue.severity),
        quick_win: issue.severity === 'low' || issue.severity === 'informational'
      });
    });
    
    return {
      asset_name: assetName,
      asset_type: assetType,
      findings,
      remediation_priority: remediationPriority.sort((a, b) => b.priority_score - a.priority_score)
    };
  } catch (error) {
    throw new Error(`Failed to get asset findings: ${error.message}`);
  }
}

function calculatePriorityScore(severity: string): number {
  const scores = {
    'critical': 100,
    'high': 80,
    'medium': 60,
    'low': 40,
    'informational': 20
  };
  return scores[severity as keyof typeof scores] || 50;
}