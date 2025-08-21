# 🔄 MCP Tools Migration Guide

## Migration from Manual API Calls to Actionable Reference

This guide helps you upgrade your existing MCP tools to use the new type-safe API client, ensuring better performance, reliability, and maintainability.

## 📋 **Pre-Migration Checklist**

- [ ] Run `npm run build` to ensure current code compiles
- [ ] Set `SECURITY_SCORECARD_TOKEN` environment variable  
- [ ] Backup current MCP implementation
- [ ] Run validation tests: `python3 validate_mcp_tools.py`
- [ ] Review tool-specific migration steps below

## 🔧 **Tool-by-Tool Migration**

### 1. **get_findings_by_category** Migration

#### Before (Manual API Calls):
```typescript
export async function getFindingsByCategory(
  makeRequest: (endpoint: string) => Promise<any>,
  domain: string,
  status: 'OPEN' | 'UNDER_REVIEW' | 'ALL' = 'OPEN'
): Promise<FactorSummary[]> {
  let factorsResponse;
  try {
    factorsResponse = await makeRequest(`/footprint/${domain}/factors`);
  } catch (error) {
    factorsResponse = await makeRequest(`/companies/${domain}/factors`);
  }
  // Manual processing...
}
```

#### After (Type-Safe Client):
```typescript
import { createSecurityScorecardClient } from './api/client.js';
import { FindingsByCategory } from './types/api.js';

export async function getFindingsByCategory(
  domain: string,
  status: 'OPEN' | 'UNDER_REVIEW' | 'ALL' = 'OPEN'
): Promise<FindingsByCategory> {
  const client = createSecurityScorecardClient(process.env.SECURITY_SCORECARD_TOKEN!);
  
  try {
    // Type-safe API call with automatic error handling
    const factorsResponse = await client.getCompanyFactors(domain);
    
    // Enhanced processing with type safety
    return processFactorsResponse(factorsResponse.data, status);
  } catch (error) {
    throw new Error(`Failed to get findings for ${domain}: ${error.message}`);
  }
}

function processFactorsResponse(data: any, status: string): FindingsByCategory {
  const factorSummary = data.entries?.map((factor: any) => ({
    factor: factor.name,
    issue_count: factor.issue_summary?.reduce((sum: number, issue: any) => sum + (issue.count || 0), 0) || 0,
    critical_count: factor.issue_summary?.filter((i: any) => i.severity === 'critical').reduce((sum: number, issue: any) => sum + (issue.count || 0), 0) || 0,
    high_count: factor.issue_summary?.filter((i: any) => i.severity === 'high').reduce((sum: number, issue: any) => sum + (issue.count || 0), 0) || 0,
    issues: factor.issue_summary || []
  })) || [];
  
  return {
    category: 'all',
    issues: factorSummary.flatMap(f => f.issues),
    total_count: factorSummary.reduce((sum, f) => sum + f.issue_count, 0),
    severity_breakdown: calculateSeverityBreakdown(factorSummary)
  };
}
```

**Migration Steps:**
1. Replace `makeRequest` parameter with direct client usage
2. Update function signature to remove `makeRequest`
3. Add proper TypeScript types from `./types/api.js`
4. Enhance error handling with meaningful messages
5. Update all call sites to remove `makeRequest` parameter

---

### 2. **generate_remediation_report** Migration

#### Before (Multiple Manual Calls):
```typescript
async generateRemediationReport(domain: string) {
  // Multiple manual API calls with custom error handling
  const scorecard = await this.makeRequest(`/companies/${domain}`);
  const issues = await this.makeRequest(`/companies/${domain}/active-issues`);
  const factors = await this.makeRequest(`/companies/${domain}/factors`);
  // Manual data processing...
}
```

#### After (Parallel Type-Safe Calls):
```typescript
import { createSecurityScorecardClient } from './api/client.js';
import { RemediationReport } from './types/api.js';

export async function generateRemediationReport(domain: string): Promise<RemediationReport> {
  const client = createSecurityScorecardClient(process.env.SECURITY_SCORECARD_TOKEN!);
  
  try {
    // Parallel API calls for better performance
    const [scorecard, issues, factors] = await Promise.all([
      client.getCompanyScorecard(domain),
      client.getCompanyActiveIssues(domain),
      client.getCompanyFactors(domain)
    ]);
    
    const criticalFindings = issues.data.entries?.filter((issue: any) => issue.severity === 'critical') || [];
    const highFindings = issues.data.entries?.filter((issue: any) => issue.severity === 'high') || [];
    
    return {
      domain,
      current_score: scorecard.data.score,
      grade: scorecard.data.grade,
      critical_findings: criticalFindings,
      high_findings: highFindings,
      recommendations: generateIntelligentRecommendations(issues.data.entries, factors.data.entries),
      estimated_score_improvement: calculateScoreImprovement(criticalFindings, highFindings)
    };
  } catch (error) {
    throw new Error(`Failed to generate remediation report for ${domain}: ${error.message}`);
  }
}
```

**Migration Steps:**
1. Replace sequential API calls with `Promise.all()` for parallel execution
2. Add proper TypeScript return type
3. Implement intelligent recommendation generation
4. Add score improvement estimation logic
5. Enhanced error handling with context

---

### 3. **get_asset_inventory** Migration

#### Before (Complex Fallback Logic):
```typescript
export async function getAssetInventory(
  makeRequest: (endpoint: string) => Promise<any>,
  domain: string
): Promise<AssetInventory> {
  // Complex fallback patterns with manual pagination
  let domains = [];
  let ips = [];
  
  try {
    domains = await this.getAllAssets(makeRequest, `/footprint/${domain}/assets/domains`);
  } catch (error) {
    // Fallback logic...
  }
  // More manual processing...
}
```

#### After (Streamlined with Built-in Fallbacks):
```typescript
import { createSecurityScorecardClient } from './api/client.js';
import { AssetInventory } from './types/api.js';

export async function getAssetInventory(domain: string): Promise<AssetInventory> {
  const client = createSecurityScorecardClient(process.env.SECURITY_SCORECARD_TOKEN!);
  
  try {
    // Built-in error handling and retries
    const [domainsResponse, ipsResponse] = await Promise.allSettled([
      client.getAssetDomains(domain, { 
        queryParams: { 'page-size': 100, include_evidence: true } 
      }),
      client.getAssetIps(domain, { 
        queryParams: { 'page-size': 100 } 
      })
    ]);
    
    const domains = domainsResponse.status === 'fulfilled' ? domainsResponse.value.data.entries || [] : [];
    const ips = ipsResponse.status === 'fulfilled' ? ipsResponse.value.data.entries || [] : [];
    
    return {
      parent_domain: domain,
      domains: domains.map(mapDomainAsset),
      ip_addresses: ips.map(mapIpAsset),
      total_domains: domains.length,
      total_ips: ips.length,
      last_updated: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Failed to get asset inventory for ${domain}: ${error.message}`);
  }
}

function mapDomainAsset(asset: any): Asset {
  return {
    id: asset.id || asset.domain,
    type: 'domain',
    name: asset.domain || asset.name,
    first_seen: asset.first_seen,
    last_seen: asset.last_seen
  };
}
```

**Migration Steps:**
1. Remove complex manual fallback logic (client handles this)
2. Use `Promise.allSettled()` for fault tolerance
3. Simplify pagination handling (client manages this)
4. Add proper asset mapping functions
5. Implement type-safe data transformation

---

### 4. **call_api_endpoint** Migration

#### Before (Manual Fetch Construction):
```typescript
async callApiEndpoint(endpoint: string, method: string = 'GET', body?: any) {
  const url = `${this.API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': `Token ${this.apiToken}`,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  
  return await response.json();
}
```

#### After (Enhanced Generic Client):
```typescript
import { createSecurityScorecardClient } from './api/client.js';

export async function callApiEndpoint(
  endpoint: string, 
  method: string = 'GET', 
  options?: {
    queryParams?: Record<string, any>;
    body?: any;
    headers?: Record<string, string>;
  }
) {
  const client = createSecurityScorecardClient(process.env.SECURITY_SCORECARD_TOKEN!);
  
  try {
    // Enhanced generic endpoint call with built-in error handling
    const response = await client.callEndpoint(method, endpoint, options);
    
    return {
      success: true,
      data: response.data,
      status: response.status,
      endpoint,
      method,
      responseTime: Date.now() // Could be enhanced with actual timing
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      endpoint,
      method,
      status: error.status || 'unknown'
    };
  }
}
```

**Migration Steps:**
1. Replace manual fetch logic with client method
2. Add enhanced response metadata
3. Improve error handling and reporting
4. Support for query parameters and custom headers
5. Better debugging information

---

## 🧪 **Validation Process**

### 1. **Pre-Migration Testing**
```bash
# Test current implementation
npm run test

# Run validation suite
python3 validate_mcp_tools.py --output-file pre_migration_results.json
```

### 2. **During Migration**
```bash
# Test each tool as you migrate it
npm run build
npm test -- --testNamePattern="get_findings_by_category"

# Validate specific functionality
node -e "
const { getFindingsByCategory } = require('./build/src/get_findings_by_category.js');
getFindingsByCategory('example.com', 'OPEN').then(console.log).catch(console.error);
"
```

### 3. **Post-Migration Validation**
```bash
# Full validation suite
python3 validate_mcp_tools.py --output-file post_migration_results.json

# Performance comparison
npm run api:test

# Integration testing
npm run build && npm run start
```

## 📊 **Migration Checklist**

### For Each Tool:
- [ ] **Backup original implementation**
- [ ] **Update function signatures** (remove `makeRequest` parameter)
- [ ] **Replace manual API calls** with client methods
- [ ] **Add proper TypeScript types**
- [ ] **Enhance error handling**
- [ ] **Add performance optimizations** (parallel calls where possible)
- [ ] **Test with real data**
- [ ] **Update documentation**
- [ ] **Validate with test suite**

### Global Updates:
- [ ] **Update MCP server registration** to use new functions
- [ ] **Remove old `makeRequest` utility functions**
- [ ] **Update environment variable handling**
- [ ] **Add new API client initialization**
- [ ] **Update package.json scripts**
- [ ] **Documentation updates**

## 🚨 **Common Migration Issues & Solutions**

### Issue: TypeScript compilation errors
**Solution**: Import types from `./types/api.js` and update function signatures

### Issue: API endpoints not working
**Solution**: Use client's fallback mechanisms or `callEndpoint()` for custom endpoints

### Issue: Performance regression
**Solution**: Use `Promise.all()` for parallel calls and client's built-in optimizations

### Issue: Authentication failures
**Solution**: Verify `SECURITY_SCORECARD_TOKEN` environment variable is set correctly

### Issue: Data structure mismatches
**Solution**: Use adapter functions to transform API responses to expected formats

## 🎯 **Success Metrics**

After migration, you should see:
- ✅ **20-50% faster execution** due to parallel calls and optimizations
- ✅ **Fewer API errors** due to built-in retry logic
- ✅ **Better debugging** with enhanced error messages
- ✅ **Type safety** preventing runtime errors
- ✅ **Easier maintenance** with cleaner, more readable code

## 🔄 **Rollback Plan**

If issues arise:
1. **Revert to backed-up implementation**
2. **Check validation results** for specific failures
3. **Fix issues incrementally** rather than wholesale changes
4. **Use hybrid approach** (new client for new features, old for critical tools)

## 📚 **Additional Resources**

- `API_DEVELOPMENT_GUIDE.md` - Comprehensive API client usage
- `ACTIONABLE_API_DEMO.md` - Before/after comparison examples
- `examples/mcp_upgrade_example.ts` - Real upgrade examples
- `validation_results.json` - Detailed test results and metrics

This migration approach ensures a smooth transition while maintaining functionality and improving performance!