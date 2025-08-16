# SecurityScorecard MCP Enhancement Specification

## Executive Summary

The current SecurityScorecard MCP implementation has significant limitations preventing access to the full API data. This specification outlines the required enhancements to unlock complete functionality.

## Current Limitations

### 1. Artificial Data Restrictions
- **50-asset limit**: Only returns 50 domains despite hundreds existing
- **0 IP addresses**: No IP data returned despite IPs being tracked
- **Missing pagination**: No support for large datasets
- **Incomplete findings**: Cannot retrieve asset-specific findings

### 2. API Implementation Gaps
- Most endpoints return only company-level information
- ESI (Enterprise Security Intelligence) endpoints not implemented
- Query parameters not properly supported
- Response parsing limited to top-level data

## Technical Analysis

### Identified Issues

#### Asset Inventory Limitations
```javascript
// Current implementation appears to have:
const ASSET_LIMIT = 50; // Hardcoded limit
const SHOW_IPS = false; // IPs excluded or filtered out

// Actual API capability:
// - Hundreds of domains available
// - IP addresses tracked and available
// - Pagination supported
```

#### Non-Functional Endpoints
```javascript
// These endpoints return company info instead of actual data:
'/companies/{domain}/history/factors/ip_reputation/issues'
'/companies/{domain}/issues?asset={specific_asset}'
'/companies/{domain}/factors/{factor}/issues/{issue_type}'
'/companies/{domain}/dns_health'

// ESI endpoints returning 404:
'/esi/entities/{uuid}/issues'
'/esi/entities/{uuid}/assets'
```

## Required Enhancements

### Priority 1: Full Asset Discovery

#### Implementation Requirements
```javascript
async function getAllAssets(domain) {
    const assets = [];
    let offset = 0;
    const limit = 100;
    
    while (true) {
        const response = await callAPI(
            `/companies/${domain}/assets?limit=${limit}&offset=${offset}`
        );
        
        // Parse actual asset data from response
        const data = response.data || response.entries || response;
        assets.push(...data);
        
        if (data.length < limit) break;
        offset += limit;
    }
    
    return {
        domains: assets.filter(a => a.type === 'domain'),
        ips: assets.filter(a => a.type === 'ip_address'),
        total: assets.length
    };
}
```

#### Expected Output Structure
```json
{
    "domains": [
        {
            "name": "neste.ee",
            "type": "domain",
            "issues_count": 4,
            "associated_ips": ["x.x.x.x", "y.y.y.y"]
        }
    ],
    "ips": [
        {
            "address": "x.x.x.x",
            "type": "ip_address",
            "issues_count": 10,
            "associated_domains": ["neste.ee", "neste.com"]
        }
    ],
    "total": 350
}
```

### Priority 2: Asset-to-IP Mapping

#### Implementation Requirements
```javascript
async function getAssetIPMappings(domain, assetName) {
    // Potential endpoints to test:
    const endpoints = [
        `/companies/${domain}/assets/${assetName}/ips`,
        `/companies/${domain}/dns_history?domain=${assetName}`,
        `/companies/${domain}/issues?asset=${assetName}&include_ips=true`,
        `/companies/${domain}/assets?name=${assetName}&expand=ips`
    ];
    
    // Test each endpoint until successful response found
    for (const endpoint of endpoints) {
        try {
            const response = await callAPI(endpoint);
            if (response.ips || response.ip_addresses) {
                return parseIPMappings(response);
            }
        } catch (e) {
            continue;
        }
    }
}
```

#### Expected Output Structure
```json
{
    "asset": "neste.ee",
    "asset_type": "domain",
    "associated_ips": [
        {
            "ip": "192.0.2.1",
            "last_seen": "2025-01-15T10:00:00Z",
            "findings_count": 5,
            "services": ["HTTP", "HTTPS"]
        }
    ],
    "dns_records": [
        {
            "type": "A",
            "value": "192.0.2.1",
            "ttl": 3600
        }
    ]
}
```

### Priority 3: Detailed Findings with Context

#### Implementation Requirements
```javascript
async function getDetailedFindings(domain, filters = {}) {
    const {
        asset_name,
        asset_type = 'all',
        issue_type,
        severity,
        include_details = true
    } = filters;
    
    // Build query parameters
    const params = new URLSearchParams();
    if (asset_name) params.append('asset', asset_name);
    if (asset_type !== 'all') params.append('type', asset_type);
    if (issue_type) params.append('issue_type', issue_type);
    if (severity) params.append('severity', severity);
    if (include_details) params.append('expand', 'details,assets,ips');
    
    const endpoint = `/companies/${domain}/issues?${params.toString()}`;
    const response = await callAPI(endpoint);
    
    // Parse nested issue data
    return parseDetailedFindings(response);
}
```

#### Expected Output Structure
```json
{
    "findings": [
        {
            "issue_type": "COOKIE_MISSING_HTTP_ONLY",
            "severity": "medium",
            "asset": "neste.ee",
            "asset_type": "domain",
            "associated_ips": ["192.0.2.1"],
            "first_seen": "2024-12-01T00:00:00Z",
            "last_seen": "2025-01-15T00:00:00Z",
            "details": {
                "cookie_name": "session_id",
                "url": "https://neste.ee/login",
                "remediation": "Add HttpOnly flag to cookie"
            }
        }
    ],
    "total_count": 4,
    "page": 1,
    "page_size": 100
}
```

## API Discovery Tasks

### 1. Pagination Testing
```javascript
const paginationTests = [
    '/companies/{domain}/assets?limit=100&offset=0',
    '/companies/{domain}/assets?page=1&per_page=100',
    '/companies/{domain}/assets?size=100&from=0',
    '/companies/{domain}/issues?limit=100&offset=0'
];
```

### 2. Response Structure Analysis
```javascript
function analyseResponse(response) {
    // Check for nested data structures
    const possibleDataPaths = [
        'data.entries',
        'data.issues',
        'data.assets',
        'entries',
        'issues',
        'assets',
        'results',
        'items'
    ];
    
    for (const path of possibleDataPaths) {
        const data = getNestedProperty(response, path);
        if (Array.isArray(data) && data.length > 0) {
            console.log(`Found data at: ${path}`);
            console.log(`Sample:`, data[0]);
            return data;
        }
    }
}
```

### 3. Query Parameter Discovery
```javascript
const parameterTests = {
    asset_filters: [
        'asset={name}',
        'asset_name={name}',
        'domain={name}',
        'hostname={name}'
    ],
    ip_inclusion: [
        'include_ips=true',
        'expand=ips',
        'with_ips=1',
        'show_ips=true'
    ],
    detail_levels: [
        'details=full',
        'expand=all',
        'include=details,assets,ips',
        'verbose=true'
    ]
};
```

## Testing Checklist

### Core Functionality Tests
- [ ] Retrieve all assets (expect 100+ domains, not 50)
- [ ] Get IP addresses in asset inventory
- [ ] Find all findings for `neste.ee`
- [ ] Get IP addresses associated with `neste.ee`
- [ ] Retrieve findings for specific IP addresses
- [ ] Query findings by issue type
- [ ] Filter findings by severity

### Specific Test Cases
```javascript
// Test Case 1: Get neste.ee data
const nesteEE = await getAssetFindings('neste.com', 'neste.ee');
assert(nesteEE.findings.length > 0, 'Should have findings');
assert(nesteEE.ips.length > 0, 'Should have associated IPs');

// Test Case 2: Get all assets
const allAssets = await getAllAssets('neste.com');
assert(allAssets.domains.length > 50, 'Should have more than 50 domains');
assert(allAssets.ips.length > 0, 'Should have IP addresses');

// Test Case 3: IP findings
const ipFindings = await getFindings('neste.com', {
    asset_type: 'ip_address',
    asset_name: nesteEE.ips[0]
});
assert(ipFindings.findings.length > 0, 'Should have IP findings');
```

## Implementation Notes

### Authentication
- Current API key management works correctly
- No changes needed to authentication headers

### Error Handling
```javascript
class APIError extends Error {
    constructor(endpoint, status, message) {
        super(`API Error at ${endpoint}: ${status} - ${message}`);
        this.endpoint = endpoint;
        this.status = status;
    }
}

async function callAPIWithRetry(endpoint, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await callAPI(endpoint);
            if (response && !isCompanyInfoOnly(response)) {
                return response;
            }
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await sleep(1000 * Math.pow(2, i)); // Exponential backoff
        }
    }
}
```

### Debug Mode
```javascript
const DEBUG = process.env.SCORECARD_DEBUG === 'true';

function debugLog(message, data) {
    if (DEBUG) {
        console.log(`[DEBUG] ${message}`);
        if (data) {
            console.log(JSON.stringify(data, null, 2));
        }
    }
}
```

## Deliverables

### Required Outputs
1. Enhanced MCP with full asset discovery
2. IP address retrieval functionality
3. Asset-to-IP mapping capability
4. Detailed findings with context
5. Pagination support for large datasets

### Documentation Updates
- API endpoint mapping document
- Query parameter reference
- Response structure documentation
- Example usage patterns

## Success Criteria

The enhanced MCP should:
1. Return all assets (hundreds of domains + IPs)
2. Map domains to their associated IP addresses
3. Retrieve findings for specific assets (domains and IPs)
4. Support pagination for large result sets
5. Provide detailed finding context including remediation

## Timeline Estimate

- **Phase 1** (2-3 days): API discovery and endpoint mapping
- **Phase 2** (3-4 days): Core functionality implementation
- **Phase 3** (2 days): Testing and refinement
- **Phase 4** (1 day): Documentation

**Total estimate**: 8-10 days of development

## Appendix: Known Working Endpoints

```javascript
// Currently functional (but limited):
'/companies/{domain}' // Company info
'/companies/{domain}/score_improvement_roadmap' // Strategic roadmap
'/companies/{domain}/factors/score_impact' // Factor impact analysis

// Needs enhancement:
'/companies/{domain}/assets' // Remove 50-limit, add IPs
'/companies/{domain}/issues' // Add proper filtering
'/companies/{domain}/findings' // Parse nested data

// To investigate:
'/esi/entities/{uuid}/*' // Enterprise endpoints
'/companies/{domain}/dns_history' // DNS/IP mappings
'/companies/{domain}/assets/{asset}/details' // Asset-specific data
```