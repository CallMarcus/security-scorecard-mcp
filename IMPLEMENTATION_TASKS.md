# Security Scorecard MCP Implementation Tasks

## Project Context
**GitHub Repository**: https://github.com/CallMarcus/security-scorecard-mcp.git  
**Main Implementation File**: `/src/index.ts` (TypeScript source)  
**Built File**: `/build/index.js` (Compiled JavaScript)  
**API Documentation**: `/build_docs/Security Scorecard API Reference for Coding Assistants.md`  
**Objective**: Fix API endpoint mismatches and enhance the Security Scorecard MCP server with missing features based on official API documentation.

## Getting Started

```bash
# Clone the repository
git clone https://github.com/CallMarcus/security-scorecard-mcp.git
cd security-scorecard-mcp

# Install dependencies
npm install

# Build the project
npm run build

# The main source code to modify is in /src/index.ts
# After modifications, rebuild with: npm run build
```

## Critical Fixes Required

### Task 1: Fix API Endpoint Paths 🔴 CRITICAL
**Priority**: IMMEDIATE  
**Estimated Effort**: 30 minutes  

#### Current Issue
The implementation uses incorrect API endpoints that don't exist in the Security Scorecard API.

#### Changes Required
Replace all instances of incorrect endpoints:

```javascript
// INCORRECT (Current):
`/companies/${domain}/issues`
`/companies/${domain}/issues/${issue_type}`

// CORRECT (Should be):
`/companies/${scorecard_identifier}/issues/active`
`/companies/${scorecard_identifier}/issues/active/${issue_type}`
`/companies/${scorecard_identifier}/issues/historical`
`/companies/${scorecard_identifier}/issues/historical/${issue_type}`
```

#### Implementation Instructions
1. Update the `getIssuesByROI` method to use `/companies/${domain}/issues/active`
2. Update the `getQuickWins` method to use `/companies/${domain}/issues/active`
3. Add a parameter to specify whether to fetch active or historical issues
4. Update any other methods using the incorrect endpoints

#### Validation
- Test with actual API calls to verify endpoints return data
- Ensure backward compatibility by handling both response formats temporarily

---

### Task 2: Fix API Response Structure Parsing 🔴 CRITICAL
**Priority**: IMMEDIATE  
**Estimated Effort**: 45 minutes

#### Current Issue
The implementation expects `entries` directly in the response, but the API returns a structured response with `data`, `pagination`, and `meta` fields.

#### Changes Required
Update the `makeRequest` method to properly handle the documented response structure:

```javascript
// Expected API Response Structure:
{
  "data": [...],      // Main data array
  "pagination": {     // Pagination info
    "page": 1,
    "size": 50,
    "total": 150,
    "has_next": true
  },
  "meta": {          // Metadata
    "request_id": "uuid",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

#### Implementation Instructions
1. Modify `makeRequest` method to check for `data` field first
2. Handle both paginated and non-paginated responses
3. Update pagination logic to use `pagination.has_next` field
4. Preserve backward compatibility for any legacy response formats

```javascript
async makeRequest(endpoint, method = "GET", body) {
    // ... existing code ...
    
    const jsonResponse = await response.json();
    
    // Handle documented response structure
    if (jsonResponse.data !== undefined) {
        // Handle pagination if present
        if (jsonResponse.pagination?.has_next) {
            // Continue fetching next pages
        }
        return { entries: jsonResponse.data };
    }
    
    // Fallback for direct responses (like summary endpoints)
    return jsonResponse;
}
```

---

### Task 3: Fix Pagination Implementation 🟡 IMPORTANT
**Priority**: HIGH  
**Estimated Effort**: 1 hour

#### Current Issue
Pagination implementation doesn't match the two documented methods: page-based and cursor-based.

#### Changes Required
Implement both pagination methods as documented:

```javascript
// Page-based pagination (default, max 50 items)
?page=1&size=50

// Cursor-based pagination (for large collections)  
?cursor={cursor_value}&limit=100
```

#### Implementation Instructions
1. Detect which pagination method is used based on response
2. Handle `pagination.has_next` for page-based pagination
3. Handle `next_cursor` for cursor-based pagination
4. Implement proper page increment for page-based method
5. Add configuration for page size (default 50, max 50)

---

## Feature Enhancements

### Task 4: Add Summary-Factors Endpoint Integration 🟢 ENHANCEMENT
**Priority**: MEDIUM  
**Estimated Effort**: 1 hour

#### Description
Use the more efficient `/companies/{scorecard_identifier}/summary-factors` endpoint to get comprehensive data in a single call.

#### Implementation Instructions
1. Add new method `getCompanySummaryFactors(domain)`
2. Use this endpoint in place of multiple separate calls in:
   - `getScoreImprovementRoadmap`
   - `calculateFactorScoreImpact`
   - `simulateScoreImprovement`
3. Parse the response to extract:
   - Overall score and grade
   - Factor scores with actual weights
   - Issue counts by severity

#### Benefits
- Reduces API calls from 2-3 to 1 for most operations
- Gets actual factor weights from API instead of using defaults
- More accurate score calculations

---

### Task 5: Add Issue Filtering Parameters 🟢 ENHANCEMENT
**Priority**: MEDIUM  
**Estimated Effort**: 2 hours

#### Description
Implement the powerful filtering parameters available in the API for more precise issue queries.

#### New Parameters to Support
```javascript
const filterParams = {
    issue_id: "uuid",                    // Specific issue
    issue_id_in: "uuid1,uuid2",         // Multiple issues
    first_seen_time_from: "2024-01-01", // Time range start
    first_seen_time_to: "2024-12-31",   // Time range end
    last_seen_time_from: "2024-01-01",  // Last seen start
    last_seen_time_to: "2024-12-31",    // Last seen end
    ip_range: "192.168.1.0/24",         // IP filtering
    severity: "high",                    // Single severity
    severity_in: "high,medium"          // Multiple severities
};
```

#### Implementation Instructions
1. Add optional filter parameter to issue-related methods
2. Build query string dynamically based on provided filters
3. Create helper method `buildFilterQuery(filters)`
4. Update existing tools to accept filter options
5. Add new tool specifically for filtered issue searches

---

### Task 6: Implement Historical Data Analysis 🟢 ENHANCEMENT
**Priority**: LOW  
**Estimated Effort**: 2 hours

#### Description
Add capability to analyze historical trends using the history endpoints.

#### New Endpoints to Integrate
- `/companies/{scorecard_identifier}/history` - Historical scores
- `/companies/{scorecard_identifier}/history/events` - Historical events
- `/companies/{scorecard_identifier}/history/breaches` - Breach events

#### New Tool to Create
```javascript
{
    name: "analyze_score_trends",
    description: "📈 TRENDS: Analyze historical score changes and identify patterns",
    parameters: {
        domain: "string",
        period: "enum: [30days, 90days, 1year]",
        include_events: "boolean"
    }
}
```

---

### Task 7: Add Vendor Risk Assessment 🟢 NEW FEATURE
**Priority**: LOW  
**Estimated Effort**: 3 hours

#### Description
Implement vendor detection and risk assessment capabilities.

#### New Endpoints to Integrate
- `/vendor-detection/{domain}/risk` - Risk scores
- `/vendor-detection/{domain}/third-party` - Third-party vendors
- `/vendor-detection/{domain}/fourth-party` - Fourth-party vendors

#### New Tool to Create
```javascript
{
    name: "assess_vendor_risk",
    description: "🔍 VENDOR RISK: Analyze third and fourth-party vendor security risks",
    parameters: {
        domain: "string",
        include_fourth_party: "boolean",
        risk_threshold: "enum: [high, medium, low]"
    }
}
```

---

## Implementation Order

### Phase 1: Critical Fixes (Day 1)
1. ✅ Task 1: Fix API endpoint paths
2. ✅ Task 2: Fix response structure parsing
3. ✅ Task 3: Fix pagination implementation

### Phase 2: Core Enhancements (Day 2-3)
4. ✅ Task 4: Add summary-factors endpoint
5. ✅ Task 5: Add issue filtering parameters

### Phase 3: Advanced Features (Day 4-5)
6. ✅ Task 6: Implement historical data analysis
7. ✅ Task 7: Add vendor risk assessment

---

## Testing Requirements

### Unit Tests
- Test each endpoint with mock responses
- Verify pagination works for both methods
- Ensure filtering parameters are properly encoded
- Validate error handling for all status codes

### Integration Tests
- Test with real API token (use environment variable)
- Verify response parsing for all endpoint types
- Test rate limiting behavior (5000 req/hour limit)
- Validate data aggregation across paginated responses

### Manual Testing Checklist
- [ ] All existing tools still work after changes
- [ ] New endpoints return expected data
- [ ] Pagination correctly fetches all pages
- [ ] Filters properly limit returned results
- [ ] Error messages are helpful and accurate
- [ ] Performance is acceptable for large datasets

---

## Code Quality Requirements

### Error Handling
- Implement specific error messages for each failure type
- Add retry logic for rate limit errors (429)
- Log detailed error information in debug mode
- Provide fallback behavior where appropriate

### Documentation
- Update JSDoc comments for all modified methods
- Add examples for new filtering parameters
- Document response structure changes
- Update README with new tools and features

### Performance
- Cache frequently accessed metadata endpoints
- Minimize API calls through efficient endpoint usage
- Implement request batching where possible
- Add request timing in debug mode

---

## Configuration Updates

### Environment Variables
```bash
# Existing
SECURITY_SCORECARD_API_TOKEN=your_token
COMPANY_DOMAIN=neste.com
DEBUG_MODE=true

# New (optional)
SCORECARD_PAGE_SIZE=50           # Items per page (max 50)
SCORECARD_CACHE_TTL=3600         # Cache TTL in seconds
SCORECARD_RETRY_ATTEMPTS=3       # Retry attempts for failed requests
SCORECARD_RETRY_DELAY=1000       # Retry delay in milliseconds
```

---

## Validation Criteria

### Success Metrics
- All API calls use correct endpoints from documentation
- Response parsing handles all documented formats
- Pagination retrieves 100% of available data
- Filtering reduces API calls by 30-50%
- New tools provide unique value to users
- Error rate < 1% for valid requests
- Average response time < 2 seconds

### Acceptance Criteria
- [ ] All critical fixes implemented and tested
- [ ] At least 3 enhancement tasks completed
- [ ] Documentation updated for all changes
- [ ] Code passes linting and formatting checks
- [ ] Manual testing completed successfully
- [ ] No regression in existing functionality

---

## Notes for Implementation

### Important Reminders
1. **API Token**: Never commit API tokens to version control
2. **Rate Limiting**: Respect the 5000 requests/hour limit
3. **Backward Compatibility**: Maintain support for existing tool interfaces
4. **Error Messages**: Make them actionable for end users
5. **Debug Mode**: Add comprehensive logging when DEBUG_MODE=true

### Useful Code Patterns

#### Dynamic Query Building
```javascript
function buildQueryString(params) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            query.append(key, value);
        }
    });
    return query.toString() ? `?${query.toString()}` : '';
}
```

#### Retry Logic Pattern
```javascript
async function retryRequest(fn, attempts = 3, delay = 1000) {
    for (let i = 0; i < attempts; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === attempts - 1) throw error;
            if (error.message.includes('429')) {
                const retryAfter = parseInt(error.retryAfter) || delay;
                await new Promise(resolve => setTimeout(resolve, retryAfter));
            }
        }
    }
}
```

---

## Questions for Clarification

Before starting implementation, verify:
1. Should we maintain backward compatibility with existing response formats?
2. Is there a preference for page-based vs cursor-based pagination?
3. Should we implement caching for metadata endpoints?
4. Are there specific issue types that should be prioritized?
5. Should vendor risk assessment be a separate tool or integrated?

---

## Resources

- **GitHub Repository**: https://github.com/CallMarcus/security-scorecard-mcp.git
- **API Documentation**: `/build_docs/Security Scorecard API Reference for Coding Assistants.md`
- **Source Implementation**: `/src/index.ts` (TypeScript)
- **Built Implementation**: `/build/index.js` (Compiled JavaScript)
- **Package.json**: `/package.json`
- **API Base URL**: `https://api.securityscorecard.io`
- **Auth Header Format**: `Authorization: Token YOUR_API_KEY`
- **Rate Limit**: 5000 requests per hour

---

*Last Updated: 2025-08-06*  
*Version: 1.0*  
*Status: Ready for Implementation*