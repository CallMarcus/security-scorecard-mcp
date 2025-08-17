# SecurityScorecard MCP Enhancement Specification

## Executive Summary

The current SecurityScorecard MCP implementation has significant limitations preventing access to the full API data. This specification outlines the required enhancements to unlock complete functionality.

**Latest Test Results (16 Aug 2025)**: Partial improvements achieved - asset limit increased from 50 to 100 domains, but IP addresses still missing and API response parsing issues persist.

## Current Limitations

### 1. Artificial Data Restrictions
- **~~50-asset limit~~**: **PARTIALLY FIXED** - Now returns 100 domains (still limited, actual has hundreds)
- **0 IP addresses**: **NOT FIXED** - No IP data returned despite IPs being tracked
- **Missing pagination**: **PARTIALLY ADDRESSED** - Some pagination in new tools
- **Incomplete findings**: **PARTIALLY FIXED** - New detailed findings tool added

### 2. API Implementation Gaps
- Most endpoints return only company-level information - **NOT FIXED**
- ESI (Enterprise Security Intelligence) endpoints not implemented - **NOT FIXED**
- Query parameters not properly supported - **NOT FIXED**
- Response parsing limited to top-level data - **NOT FIXED**

### 3. Potential API Version Mismatch (NEW)
- Issue types contain "V2" suffix (e.g., "UNSAFE SRI V2", "HSTS INCORRECT V2")
- SecurityScorecard has V3 scorecard - may need different API endpoints
- Current MCP might be using outdated API version

## Test Results After Claude Code Attempt

### Improvements Achieved
1. **Asset Discovery**: Increased from 50 to 100 domains
2. **New Tools Added**:
   - `discover_all_assets`: Retrieves 100 domains with pagination
   - `get_asset_detailed_findings`: Provides comprehensive findings with severity and remediation priorities

### Remaining Issues
1. **IP Addresses**: Still shows 0 IPs in all tools
2. **Direct Asset Queries**: Cannot query assets not in inventory (e.g., neste.ee returns 0 findings)
3. **API Response Parsing**: Most endpoints still return company-level data only
4. **Missing Assets**: Many domains like neste.ee appear in aggregated findings but not in inventory

### Specific neste.ee Findings
- **Direct query**: Returns 0 findings
- **Appears in**: Aggregated findings via `get_findings_by_asset()`
- **Has 4 issue types**:
  - UNSAFE SRI V2 (18 findings)
  - COOKIE MISSING HTTP ONLY (1 finding)
  - WAF DETECTED V2 (3 findings)
  - COOKIE MISSING SECURE ATTRIBUTE (1 finding)
- **Not in inventory**: Doesn't appear in 100-domain list
- **No IP data**: Cannot retrieve associated IP addresses

## Technical Analysis

### Identified Issues

#### Asset Inventory Limitations
```javascript
// Current implementation after fixes:
const ASSET_LIMIT = 100; // Increased from 50, but still limited
const SHOW_IPS = false; // IPs still excluded or filtered out

// Actual API capability:
// - Hundreds of domains available (possibly 350+)
// - IP addresses tracked and available
// - Full pagination should be possible
```

#### Non-Functional Endpoints (Confirmed Still Broken)
```javascript
// These endpoints return company info instead of actual data:
'/companies/{domain}/history/factors/ip_reputation/issues'
'/companies/{domain}/issues?asset={specific_asset}'
'/companies/{domain}/factors/{factor}/issues/{issue_type}'
'/companies/{domain}/dns_health'
'/companies/{domain}/assets?limit=200&include_ips=true'
'/companies/{domain}/factors/ip_reputation/issues'

// ESI endpoints returning 404:
'/esi/entities/{uuid}/issues'
'/esi/entities/{uuid}/assets'
'/esi/entities/ed270fb8-61e7-5450-a0bc-e7402f16aa52/issues?domain=neste.ee'

// Returns 403 Forbidden:
'/companies/neste.ee' // Attempting direct query of subdomain
```

#### API Version Investigation Required
```javascript
// Current API might be V2, need to investigate:
const potentialV3Endpoints = [
    '/v3/companies/{domain}/assets',
    '/api/v3/companies/{domain}/issues',
    '/scorecard/v3/companies/{domain}',
    '/companies/{domain}/scorecard/v3/factors'
];

// Issue types suggest versioned detection rules:
// - "UNSAFE SRI V2"
// - "HSTS INCORRECT V2"
// - "REDIRECT CHAIN CONTAINS HTTP V2"
// Need to check if V3 versions exist
```

## Required Enhancements

### Priority 1: Full Asset Discovery with IPs

#### Implementation Requirements
```javascript
async function getAllAssetsWithIPs(domain) {
    const assets = [];
    let offset = 0;
    const limit = 100;
    
    // Try multiple endpoint patterns
    const endpointPatterns = [
        `/companies/${domain}/assets?limit=${limit}&offset=${offset}&type=all`,
        `/companies/${domain}/assets?limit=${limit}&offset=${offset}&include_ips=true`,
        `/v3/companies/${domain}/assets?limit=${limit}&offset=${offset}`,
        `/companies/${domain}/portfolio/assets?limit=${limit}&offset=${offset}`
    ];
    
    // Need to find the correct endpoint that returns actual data
    for (const pattern of endpointPatterns) {
        const response = await callAPI(pattern);
        
        // Check if response contains actual asset data, not company info
        if (!isCompanyInfoOnly(response)) {
            // Parse actual asset data from response
            const data = extractAssetData(response);
            if (data && data.length > 0) {
                assets.push(...data);
                break;
            }
        }
    }
    
    return {
        domains: assets.filter(a => a.type === 'domain'),
        ips: assets.filter(a => a.type === 'ip_address'),
        total: assets.length
    };
}

function isCompanyInfoOnly(response) {
    // Check if response only contains company-level data
    return response.grade && response.score && 
           !response.assets && !response.entries && 
           !response.issues && !response.data;
}

function extractAssetData(response) {
    // Try multiple paths to find asset data
    const paths = [
        response.assets,
        response.data?.assets,
        response.entries,
        response.data?.entries,
        response.results,
        response.items
    ];
    
    for (const data of paths) {
        if (Array.isArray(data)) return data;
    }
    return null;
}
```

### Priority 2: Asset-to-IP Mapping for Unlisted Domains

#### Implementation Requirements
```javascript
async function getAssetDataIncludingUnlisted(domain, assetName) {
    // For assets like neste.ee that don't appear in inventory
    // but have findings in aggregated data
    
    // Step 1: Try to get findings from aggregated data
    const aggregatedFindings = await getAggregatedFindings(domain);
    const assetFindings = extractFindingsForAsset(aggregatedFindings, assetName);
    
    // Step 2: Attempt to resolve IPs through different methods
    const ipMethods = [
        // Method 1: DNS resolution endpoint
        `/companies/${domain}/dns_records?domain=${assetName}`,
        // Method 2: Historical DNS data
        `/companies/${domain}/dns_history?domain=${assetName}`,
        // Method 3: Network mapping
        `/companies/${domain}/network_map?asset=${assetName}`,
        // Method 4: IP reputation with asset filter
        `/companies/${domain}/factors/ip_reputation/issues?asset=${assetName}`
    ];
    
    let ips = [];
    for (const endpoint of ipMethods) {
        try {
            const response = await callAPI(endpoint);
            const extractedIPs = extractIPAddresses(response);
            if (extractedIPs.length > 0) {
                ips = extractedIPs;
                break;
            }
        } catch (e) {
            continue;
        }
    }
    
    return {
        asset: assetName,
        findings: assetFindings,
        associated_ips: ips,
        in_inventory: false
    };
}
```

### Priority 3: API Version Discovery

#### Implementation Requirements
```javascript
async function discoverAPIVersion(domain) {
    // Test for different API versions
    const versionTests = [
        { version: 'v1', endpoint: `/companies/${domain}` },
        { version: 'v2', endpoint: `/v2/companies/${domain}` },
        { version: 'v3', endpoint: `/v3/companies/${domain}` },
        { version: 'v3-scorecard', endpoint: `/scorecard/v3/companies/${domain}` }
    ];
    
    const results = {};
    
    for (const test of versionTests) {
        try {
            const response = await callAPI(test.endpoint);
            results[test.version] = {
                success: true,
                hasAssetData: !isCompanyInfoOnly(response),
                response: response
            };
        } catch (error) {
            results[test.version] = {
                success: false,
                error: error.message
            };
        }
    }
    
    return results;
}

// Check for V3 issue types
async function checkForV3IssueTypes(domain) {
    const v2IssueTypes = [
        'UNSAFE_SRI_V2',
        'HSTS_INCORRECT_V2',
        'REDIRECT_CHAIN_CONTAINS_HTTP_V2'
    ];
    
    // Check if V3 versions exist
    for (const v2Type of v2IssueTypes) {
        const v3Type = v2Type.replace('_V2', '_V3');
        const endpoint = `/companies/${domain}/issues?issue_type=${v3Type}`;
        
        try {
            const response = await callAPI(endpoint);
            if (response && !isCompanyInfoOnly(response)) {
                console.log(`V3 issue type found: ${v3Type}`);
            }
        } catch (e) {
            // V3 type might not exist
        }
    }
}
```

## Testing Checklist

### Core Functionality Tests
- [x] ~~Retrieve all assets (expect 100+ domains, not 50)~~ **PARTIAL** - Gets 100, needs more
- [ ] Get IP addresses in asset inventory - **FAILED**
- [ ] Find all findings for `neste.ee` - **FAILED** (direct query)
- [x] Find neste.ee in aggregated findings - **PASSED**
- [ ] Get IP addresses associated with `neste.ee` - **FAILED**
- [ ] Retrieve findings for specific IP addresses - **BLOCKED** (no IPs available)
- [x] Query findings by issue type - **PASSED**
- [x] Filter findings by severity - **PASSED** (in detailed findings)

### API Version Tests (NEW)
- [ ] Test for V3 API endpoints
- [ ] Check if V3 issue types exist
- [ ] Compare V2 vs V3 response structures
- [ ] Verify which version returns IP data

### Specific Test Cases
```javascript
// Test Case 1: Get neste.ee data
const nesteEE = await getAssetFindings('neste.com', 'neste.ee');
// CURRENT: Returns 0 findings
// EXPECTED: Should return 4 issue types with findings

// Test Case 2: Get all assets
const allAssets = await getAllAssets('neste.com');
// CURRENT: Returns 100 domains, 0 IPs
// EXPECTED: Should return 350+ domains and associated IPs

// Test Case 3: IP findings
const ipFindings = await getFindings('neste.com', {
    asset_type: 'ip_address',
    asset_name: '192.0.2.1' // Example IP
});
// CURRENT: Cannot test - no IPs available
// EXPECTED: Should return findings for the IP
```

## Progress Summary

| Feature | Initial | After Fix | Target | Status |
|---------|---------|-----------|--------|--------|
| Domain Count | 50 | 100 | 350+ | ⚠️ Partial |
| IP Addresses | 0 | 0 | Many | ❌ Failed |
| Direct Asset Query | No | No | Yes | ❌ Failed |
| Aggregated Findings | Yes | Yes | Yes | ✅ Working |
| Detailed Findings | Basic | Comprehensive | Comprehensive | ✅ Fixed |
| Response Parsing | Company Info Only | Company Info Only | Full Data | ❌ Failed |
| API Version | Unknown (V2?) | Unknown (V2?) | V3 | ❓ To Investigate |

## Next Steps

1. **Investigate API Version**:
   - Test V3 endpoints
   - Check API documentation for version differences
   - Identify correct endpoints for IP data

2. **Fix Response Parsing**:
   - Implement proper response structure detection
   - Parse nested data correctly
   - Handle different response formats

3. **Resolve IP Address Issue**:
   - Find correct endpoint for IP data
   - Test different query parameters
   - Implement IP-to-domain mapping

4. **Complete Asset Discovery**:
   - Implement full pagination (beyond 100)
   - Include unlisted assets like neste.ee
   - Map all domain-IP relationships

## Implementation Notes

### Authentication
- Current API key management works correctly
- No changes needed to authentication headers

### Response Parsing Fix Required
```javascript
// Current issue: All responses return company info
// Need to properly parse the actual response body

async function parseAPIResponse(response) {
    // Check if response is just company info
    if (isCompanyInfoOnly(response)) {
        // The actual data might be in:
        // 1. A different property we haven't found
        // 2. A paginated result that needs different handling
        // 3. Requires different Accept headers
        // 4. Needs API version specification
        
        console.warn('Response contains only company info, data might be nested deeper');
    }
    
    // Implement comprehensive parsing logic
    return extractActualData(response);
}
```

### Debug Mode Enhancement
```javascript
const DEBUG = process.env.SCORECARD_DEBUG === 'true';

function debugLog(message, data) {
    if (DEBUG) {
        console.log(`[DEBUG] ${message}`);
        if (data) {
            // Log full response to understand structure
            console.log('Full Response:', JSON.stringify(data, null, 2));
            
            // Log response keys to identify data location
            console.log('Response Keys:', Object.keys(data));
            
            // Check for nested structures
            if (data.data) console.log('data.data Keys:', Object.keys(data.data));
        }
    }
}
```

## Deliverables

### Required Outputs
1. Enhanced MCP with full asset discovery (350+ domains)
2. IP address retrieval functionality (currently 0)
3. Asset-to-IP mapping capability (including unlisted assets)
4. Complete findings for all assets (including neste.ee)
5. Full pagination support
6. Proper API response parsing

### Documentation Updates
- API version differences (V2 vs V3)
- Correct endpoint mapping
- Response structure documentation
- Query parameter reference
- Workarounds for unlisted assets

## Success Criteria

The enhanced MCP should:
1. Return all assets (350+ domains + IPs) ❌
2. Map domains to their associated IP addresses ❌
3. Retrieve findings for specific assets including neste.ee ❌
4. Support full pagination ⚠️
5. Parse API responses correctly ❌
6. Use appropriate API version (V3 if available) ❓

## Timeline Estimate

- **Phase 1** (2-3 days): API version investigation and correct endpoint discovery
- **Phase 2** (3-4 days): Response parsing fix and IP retrieval
- **Phase 3** (2 days): Full pagination and unlisted asset handling
- **Phase 4** (1 day): Testing and documentation

**Total estimate**: 8-10 days of development

## Appendix: Known Working and Broken Endpoints

```javascript
// Currently functional:
'/companies/{domain}' // Company info only
'/companies/{domain}/score_improvement_roadmap' // Strategic roadmap ✅
'/companies/{domain}/factors/score_impact' // Factor impact analysis ✅
'discover_all_assets' // New tool - gets 100 domains ⚠️
'get_asset_detailed_findings' // New tool - comprehensive findings ✅

// Partially working:
'/companies/{domain}/assets' // Returns 100 domains, no IPs ⚠️
'/companies/{domain}/findings' // Returns some data in aggregated form ⚠️

// Broken - Return company info only:
'/companies/{domain}/history/factors/ip_reputation/issues' ❌
'/companies/{domain}/issues?asset={specific_asset}' ❌
'/companies/{domain}/factors/{factor}/issues/{issue_type}' ❌
'/companies/{domain}/dns_health' ❌
'/companies/{domain}/assets?limit=200&include_ips=true' ❌

// Return 404:
'/esi/entities/{uuid}/*' ❌

// Return 403:
'/companies/neste.ee' ❌

// To investigate:
'/v3/companies/{domain}/*' // Potential V3 endpoints
'/api/v3/*' // Alternative V3 path
'/scorecard/v3/*' // Scorecard-specific V3
```