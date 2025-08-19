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
 * Get all assets using pagination to overcome API limits
 */
async function getAllAssetsPaginated(
  makeRequest: (endpoint: string, method?: string, body?: any) => Promise<any>,
  domain: string,
  assetType?: 'domain' | 'ip_address'
): Promise<any[]> {
  const allAssets: any[] = [];
  let offset = 0;
  const limit = 100; // Use higher limit for pagination
  
  const debugMode = process.env.DEBUG_MODE === "true";
  function debugLog(message: string, data?: any) {
    if (debugMode) {
      console.log(`[PAGINATION] ${message}`);
      if (data) console.log(JSON.stringify(data, null, 2));
    }
  }
  
  // Try different pagination patterns and endpoint variations
  // COMPREHENSIVE API ENDPOINT HIERARCHY: Based on user feedback discovery
  // UPDATED: Based on test results - removed failing scorecard endpoints, prioritized working ones
  const endpointVariations = [
    // LEVEL 1: API Reference Endpoints (Broadest Coverage) - WORKING
    { url: `/footprint/parentDomain/assets/domains`, method: 'GET', useBody: false, priority: 'highest' },
    { url: `/footprint/parentDomain/assets/ips`, method: 'GET', useBody: false, priority: 'highest' },
    
    // LEVEL 2: Digital Footprint POST API (Domain-scoped) - WORKING
    { url: `/parent-domains/${domain}/domains`, method: 'POST', useBody: true, priority: 'high' },
    { url: `/parent-domains/${domain}/ips`, method: 'POST', useBody: true, priority: 'high' },
    
    // LEVEL 3: Domain-specific footprint API - WORKING
    { url: `/footprint/${domain}/assets/domains`, method: 'GET', useBody: false, priority: 'medium' },
    { url: `/footprint/${domain}/assets/ips`, method: 'GET', useBody: false, priority: 'medium' },
    { url: `/footprint/${domain}/domains`, method: 'GET', useBody: false, priority: 'medium' },
    { url: `/footprint/${domain}/ips`, method: 'GET', useBody: false, priority: 'medium' },
    
    // LEVEL 4: Companies endpoints (External monitoring - limited but working)
    { url: `/companies/${domain}/assets`, method: 'GET', useBody: false, priority: 'low' },
    { url: `/companies/${domain}/inventory`, method: 'GET', useBody: false, priority: 'low' },
    { url: `/companies/${domain}/footprint`, method: 'GET', useBody: false, priority: 'low' }
  ];
  
  for (const endpointConfig of endpointVariations) {
    try {
      debugLog(`Trying endpoint: ${endpointConfig.url} (${endpointConfig.method})`);
      let hasMore = true;
      let page = 0;
      
      while (hasMore) {
        let response = null;
        
        try {
          if (endpointConfig.useBody && endpointConfig.method === 'POST') {
            // POST endpoints: Digital Footprint API
            const body: any = {
              page: page,
              page_size: limit
            };
            
            // Add filters if we're looking for specific asset type
            if (assetType) {
              body.filters = [{ field: 'status', operator: 'in', values: ['CLAIMED', 'ATTRIBUTED'] }];
            }
            
            debugLog(`Trying POST ${endpointConfig.url} with body:`, body);
            response = await makeRequest(endpointConfig.url, endpointConfig.method, body);
            
          } else {
            // GET endpoints: Various API types with different parameter handling
            let finalUrl = endpointConfig.url;
            let queryParams = `page=${page}&size=${limit}`;
            
            // Handle API Reference endpoints with parentDomain parameter
            if (endpointConfig.url.includes('/footprint/parentDomain/')) {
              // API Reference endpoints: replace parentDomain with actual domain
              finalUrl = endpointConfig.url.replace('/parentDomain/', `/${domain}/`);
              debugLog(`API Reference endpoint transformation: ${endpointConfig.url} → ${finalUrl}`);
            }
            
            // Add asset type filtering for legacy endpoints
            if (!endpointConfig.url.includes('/footprint/') && !endpointConfig.url.includes('/parent-domains/')) {
              if (assetType) {
                queryParams += `&type=${assetType}`;
              }
            }
            
            const fullUrl = `${finalUrl}?${queryParams}`;
            debugLog(`Trying GET ${fullUrl} (Priority: ${endpointConfig.priority || 'standard'})`);
            response = await makeRequest(fullUrl, endpointConfig.method);
          }
          
          if (response && (response.entries || response.data || response.assets)) {
            debugLog(`Success with: ${endpointConfig.url}`);
          }
          
        } catch (error) {
          debugLog(`Error with ${endpointConfig.url}: ${error}`);
          break;
        }
        
        if (!response) {
          debugLog(`No response for ${endpointConfig.url}, trying next endpoint`);
          break;
        }
        
        // Extract data from various response structures
        const data = response.entries || response.data || response.assets || 
                    response.results || response.items || [];
        
        if (!Array.isArray(data) || data.length === 0) {
          debugLog(`No data found in response for ${endpointConfig.url}`);
          break;
        }
        
        allAssets.push(...data);
        debugLog(`Found ${data.length} assets on page ${page}, total: ${allAssets.length}`);
        
        // Check if we should continue paginating
        hasMore = data.length === limit;
        page += 1;
        
        // Safety limit to prevent infinite loops
        if (page > 100) {
          debugLog(`Safety limit reached at page ${page}`);
          break;
        }
      }
      
      // If we found assets with this endpoint, stop trying others
      if (allAssets.length > 0) {
        debugLog(`Successfully found ${allAssets.length} assets using ${endpointConfig.url}`);
        break;
      }
      
    } catch (error) {
      debugLog(`Endpoint ${endpointConfig.url} failed: ${error}`);
      continue;
    }
  }
  
  return allAssets;
}

/**
 * Validate if a string is a domain name
 */
function isValidDomain(str: string): boolean {
  if (!str) return false;
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return domainRegex.test(str);
}

/**
 * Validate if a string is an IP address
 */
function isValidIP(str: string): boolean {
  if (!str) return false;
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(str);
}

/**
 * Get comprehensive asset inventory for organization using working API endpoints
 * Enhanced version with pagination and multiple discovery methods
 */
export async function getAssetInventory(
  makeRequest: (endpoint: string, method?: string, body?: any) => Promise<any>,
  domain: string
): Promise<AssetInventory> {
  
  const debugMode = process.env.DEBUG_MODE === "true";
  
  function debugLog(message: string, data?: any) {
    if (debugMode) {
      console.log(`[ASSET DEBUG] ${message}`);
      if (data) console.log(JSON.stringify(data, null, 2));
    }
  }
  
  try {
    // First try multiple asset discovery methods
    let domains: any[] = [];
    let ips: any[] = [];
    
    // Method 1: Try working endpoints hierarchy (based on test results)
    debugLog("Trying working endpoint hierarchy (primary method)...");
    try {
      const [domainsResponse, ipsResponse] = await Promise.all([
        // Try API Reference first, then footprint
        makeRequest(`/footprint/parentDomain/assets/domains`.replace('/parentDomain/', `/${domain}/`))
          .catch(() => makeRequest(`/footprint/${domain}/assets/domains`))
          .catch(() => makeRequest(`/footprint/${domain}/domains`))
          .catch(() => ({ entries: [] })),
        makeRequest(`/footprint/parentDomain/assets/ips`.replace('/parentDomain/', `/${domain}/`))
          .catch(() => makeRequest(`/footprint/${domain}/assets/ips`))
          .catch(() => makeRequest(`/footprint/${domain}/ips`))
          .catch(() => ({ entries: [] }))
      ]);
      
      // Parse footprint API responses
      domains = domainsResponse.entries || domainsResponse.data || domainsResponse.domains || [];
      ips = ipsResponse.entries || ipsResponse.data || ipsResponse.ips || [];
      
      debugLog(`Footprint GET results: ${domains.length} domains, ${ips.length} IPs`);
      debugLog("GET domain response structure:", domainsResponse);
      debugLog("GET IP response structure:", ipsResponse);
      
      // If footprint endpoints work, we found our data!
      if (domains.length > 0 || ips.length > 0) {
        debugLog("SUCCESS: Footprint GET endpoints returned data!");
      }
      
    } catch (error) {
      debugLog("Footprint GET endpoints failed, trying POST alternatives...", error);
    }
    
    // Method 2: Try POST endpoints for Digital Footprint API (fallback)
    if (domains.length === 0 && ips.length === 0) {
      debugLog("Trying Digital Footprint POST endpoints as fallback...");
      try {
        const [domainsResponse, ipsResponse] = await Promise.all([
          makeRequest(`/parent-domains/${domain}/domains`, 'POST', { page: 0, page_size: 100 }).catch(() => ({ entries: [] })),
          makeRequest(`/parent-domains/${domain}/ips`, 'POST', { page: 0, page_size: 100 }).catch(() => ({ entries: [] }))
        ]);
        
        // Parse Digital Footprint API responses
        domains = domainsResponse.entries || domainsResponse.data || domainsResponse.domains || [];
        ips = ipsResponse.entries || ipsResponse.data || ipsResponse.ips || [];
        
        debugLog(`Digital Footprint POST results: ${domains.length} domains, ${ips.length} IPs`);
        debugLog("POST domain response structure:", domainsResponse);
        debugLog("POST IP response structure:", ipsResponse);
        
      } catch (error) {
        debugLog("Digital Footprint POST endpoints failed, trying other fallback methods...", error);
      }
    }
    
    // Method 2: Try standard assets endpoint with pagination
    if (domains.length === 0) {
      debugLog("Trying paginated assets endpoint...");
      domains = await getAllAssetsPaginated(makeRequest, domain, 'domain');
      ips = await getAllAssetsPaginated(makeRequest, domain, 'ip_address');
    }
    
    // Method 3: Try assets endpoint without type filter
    if (domains.length === 0) {
      debugLog("Trying generic assets endpoint...");
      const allAssets = await getAllAssetsPaginated(makeRequest, domain);
      domains = allAssets.filter((asset: any) => 
        asset.type === 'domain' || asset.asset_type === 'domain' || 
        (!asset.type && !asset.asset_type && isValidDomain(asset.name || asset.domain))
      );
      ips = allAssets.filter((asset: any) => 
        asset.type === 'ip_address' || asset.asset_type === 'ip_address' ||
        (!asset.type && !asset.asset_type && isValidIP(asset.name || asset.ip || asset.address))
      );
    }
    
    // Method 4: Enhanced asset discovery through issue data (with pagination)
    if (domains.length === 0) {
      debugLog('Using enhanced asset discovery through issue data...');
      
      // Get factors data to discover assets mentioned in issues using hierarchical approach
      let factorsResponse;
      try {
        // Try broader API Reference endpoint first
        factorsResponse = await makeRequest(`/footprint/${domain}/factors`);
      } catch (error) {
        try {
          // Fallback to scorecard endpoint
          factorsResponse = await makeRequest(`/scorecard/${domain}/factors`);
        } catch (error2) {
          // Final fallback to companies endpoint
          factorsResponse = await makeRequest(`/companies/${domain}/factors`);
        }
      }
      const discoveredDomains = new Set<string>();
      const discoveredIPs = new Set<string>();
      
      // Add the main domain
      discoveredDomains.add(domain);
      
      // Extract assets from issue data with pagination
      for (const factor of factorsResponse.entries || []) {
        debugLog(`Processing factor: ${factor.name}`);
        
        // Process ALL issue types, not just first 3
        for (const issueType of (factor.issue_summary || [])) {
          if (!issueType.type || issueType.count === 0) continue;
          
          try {
            debugLog(`Discovering assets from issue type: ${issueType.type}`);
            
            // Use pagination to get ALL issues, not just first 10
            let offset = 0;
            const limit = 100;
            let hasMore = true;
            
            while (hasMore) {
              // Use working companies endpoint instead of failing scorecard
              const issues = await makeRequest(
                `/companies/${domain}/issues?type=${issueType.type}&status=open&size=${limit}&offset=${offset}`
              );
              
              const issueEntries = issues.entries || [];
              if (issueEntries.length === 0) break;
              
              for (const issue of issueEntries) {
                // Extract domain names
                if (issue.domain && issue.domain !== domain && isValidDomain(issue.domain)) {
                  discoveredDomains.add(issue.domain);
                }
                if (issue.parent_domain && issue.parent_domain !== domain && isValidDomain(issue.parent_domain)) {
                  discoveredDomains.add(issue.parent_domain);
                }
                if (issue.hostname && isValidDomain(issue.hostname)) {
                  discoveredDomains.add(issue.hostname);
                }
                
                // Extract IP addresses
                if (issue.ip && isValidIP(issue.ip)) {
                  discoveredIPs.add(issue.ip);
                }
                if (issue.ip_address && isValidIP(issue.ip_address)) {
                  discoveredIPs.add(issue.ip_address);
                }
                if (issue.host && isValidIP(issue.host)) {
                  discoveredIPs.add(issue.host);
                }
                
                // Look for IPs in other fields
                if (issue.details) {
                  const ipMatches = JSON.stringify(issue.details).match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g);
                  if (ipMatches) {
                    ipMatches.forEach(ip => {
                      if (isValidIP(ip)) discoveredIPs.add(ip);
                    });
                  }
                }
              }
              
              hasMore = issueEntries.length === limit;
              offset += limit;
              
              // Safety limit
              if (offset > 5000) {
                debugLog(`Safety limit reached for issue type ${issueType.type}`);
                break;
              }
            }
            
            debugLog(`Found ${discoveredDomains.size} domains and ${discoveredIPs.size} IPs so far`);
            
          } catch (error) {
            debugLog(`Error processing issue type ${issueType.type}: ${error}`);
            continue;
          }
        }
      }
      
      // Convert discovered assets to proper format
      ips = Array.from(discoveredIPs).map(ip => ({
        name: ip,
        ip: ip,
        address: ip,
        type: 'ip_address',
        asset_type: 'ip_address'
      }));
      
      // Convert discovered domains to domain objects
      domains = Array.from(discoveredDomains).map(domainName => ({
        name: domainName,
        domain: domainName,
        hostname: domainName,
        last_seen: new Date().toISOString()
      }));
    }

  // Calculate asset scores and issue counts
  const domainScores: AssetScore[] = [];
  const ipScores: AssetScore[] = [];

  for (const domainAsset of domains) {
    try {
      // Extract domain name from various possible field names
      const domainName = domainAsset.name || domainAsset.domain || domainAsset.hostname || domainAsset.asset_name || 'unknown';
      
      if (domainName === 'unknown') {
        console.log('Warning: Could not extract domain name from asset:', JSON.stringify(domainAsset));
      }
      
      // Use factors endpoint to get issue summary for each domain asset
      let issueCount = 0;
      let criticalCount = 0;
      let highCount = 0;
      
      try {
        // Try to get factors for this domain directly using hierarchical approach
        let factors;
        try {
          factors = await makeRequest(`/footprint/${domainName}/factors`);
        } catch (error) {
          try {
            factors = await makeRequest(`/scorecard/${domainName}/factors`);
          } catch (error2) {
            factors = await makeRequest(`/companies/${domainName}/factors`);
          }
        }
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
        const parentDomain = await findParentDomain(makeRequest, domainName);
        if (parentDomain) {
          let parentFactors;
          try {
            parentFactors = await makeRequest(`/footprint/${parentDomain}/factors`);
          } catch (error) {
            try {
              parentFactors = await makeRequest(`/scorecard/${parentDomain}/factors`);
            } catch (error2) {
              parentFactors = await makeRequest(`/companies/${parentDomain}/factors`);
            }
          }
          const issueTypes = extractIssueTypesFromFactors(parentFactors);
          
          // Sample a few issue types to estimate total issues
          for (const issueType of issueTypes.slice(0, 3)) {
            try {
              // Use working companies endpoint instead of failing scorecard
              const issues = await makeRequest(`/companies/${parentDomain}/issues?type=${issueType}&domain=${domainName}&status=open`);
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
        asset_name: domainName,
        asset_type: 'domain',
        issues_count: issueCount,
        critical_issues: criticalCount,
        high_issues: highCount,
        last_seen: domainAsset.last_seen || new Date().toISOString()
      });
    } catch (error) {
      // Asset may not have scoring data yet
      const domainName = domainAsset.name || domainAsset.domain || domainAsset.hostname || domainAsset.asset_name || 'unknown';
      domainScores.push({
        asset_name: domainName,
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
  
  } catch (error) {
    // If entire function fails, return basic structure with just the main domain
    console.error('getAssetInventory failed:', error);
    return {
      parent_domain: domain,
      total_assets: 1,
      domains: [{
        asset_name: domain,
        asset_type: 'domain',
        issues_count: 0,
        critical_issues: 0,
        high_issues: 0
      }],
      ip_addresses: [],
      summary: {
        avg_score: 0,
        worst_performers: [],
        best_performers: [],
        total_issues: 0
      }
    };
  }
}

/**
 * Get detailed findings for specific asset using correct API patterns
 */
export async function getAssetFindings(
  makeRequest: (endpoint: string, method?: string, body?: any) => Promise<any>,
  domain: string,
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
        // Get available issue types from parent's factors using hierarchical approach
        let factors;
        try {
          factors = await makeRequest(`/footprint/${parentDomain}/factors`);
        } catch (error) {
          try {
            factors = await makeRequest(`/scorecard/${parentDomain}/factors`);
          } catch (error2) {
            factors = await makeRequest(`/companies/${parentDomain}/factors`);
          }
        }
        const issueTypes = extractIssueTypesFromFactors(factors);
        
        // Query each issue type with domain parameter for child asset
        for (const issueType of issueTypes.slice(0, 10)) { // Limit to avoid rate limits
          try {
            // Use working companies endpoint instead of failing scorecard
            const issues = await makeRequest(`/companies/${parentDomain}/issues?type=${issueType}&domain=${assetName}&status=open`);
            processIssuesIntoFindings(issues.entries || [], findings, issueType);
          } catch (error) {
            // Skip issue types we can't access
            continue;
          }
        }
      }
    } else {
      // For parent domains, use hierarchical factors to get issue summary, then optionally fetch specific types
      let factors;
      try {
        factors = await makeRequest(`/footprint/${assetName}/factors`);
      } catch (error) {
        try {
          factors = await makeRequest(`/scorecard/${assetName}/factors`);
        } catch (error2) {
          factors = await makeRequest(`/companies/${assetName}/factors`);
        }
      }
      
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
          // Use working companies endpoint instead of failing scorecard
          const detailedIssues = await makeRequest(`/companies/${assetName}/issues?type=${issueType}&status=open`);
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
  makeRequest: (endpoint: string, method?: string, body?: any) => Promise<any>,
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
        // Try to get factors for this asset directly using hierarchical approach
        let factors;
        try {
          factors = await makeRequest(`/footprint/${asset}/factors`);
        } catch (error) {
          try {
            factors = await makeRequest(`/scorecard/${asset}/factors`);
          } catch (error2) {
            factors = await makeRequest(`/companies/${asset}/factors`);
          }
        }
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
          let parentFactors;
          try {
            parentFactors = await makeRequest(`/footprint/${parentDomain}/factors`);
          } catch (error) {
            try {
              parentFactors = await makeRequest(`/scorecard/${parentDomain}/factors`);
            } catch (error2) {
              parentFactors = await makeRequest(`/companies/${parentDomain}/factors`);
            }
          }
          const issueTypes = extractIssueTypesFromFactors(parentFactors);
          
          // Query specific issue types for this asset through parent
          for (const issueType of issueTypes.slice(0, 5)) {
            try {
              // Use working companies endpoint instead of failing scorecard
              const issues = await makeRequest(`/companies/${parentDomain}/issues?type=${issueType}&domain=${asset}&status=open`);
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
async function isChildAssetDomain(makeRequest: (endpoint: string, method?: string, body?: any) => Promise<any>, domain: string): Promise<boolean> {
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
async function findParentDomain(makeRequest: (endpoint: string, method?: string, body?: any) => Promise<any>, childDomain: string): Promise<string | null> {
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