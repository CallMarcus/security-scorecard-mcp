# SecurityScorecard MCP Debugging Instructions

## Overview
This document provides step-by-step instructions for debugging and fixing the SecurityScorecard MCP server issues where certain functions return empty data despite the API having the information available.

## Issue Summary
- ✅ **Working**: `get_company_overview`, `get_factor_breakdown`, `get_historical_trend`
- ⚠️ **Partial**: `compare_with_industry` (missing percentiles)
- ❌ **Broken**: `get_current_findings`, `analyze_findings_by_priority`, `get_findings_by_asset`
- ❓ **Untested**: `get_security_events`, `get_remediation_plan`, `create_improvement_alert`

## Step-by-Step Debugging Process

### Step 1: Test API Endpoints Directly
First, we need to understand what the SecurityScorecard API is actually returning.

1. Copy `test_api_endpoints.js` to your job computer
2. Set your API token:
   ```powershell
   $env:SECURITY_SCORECARD_API_TOKEN = "your-actual-token-here"
   ```
3. Run the test:
   ```powershell
   node test_api_endpoints.js > api_test_results.txt
   ```
4. Review the output to see:
   - Which endpoints return data
   - The structure of the returned data
   - Any error messages

### Step 2: Apply Debug Patches
If the API test shows data is available but MCP isn't getting it:

1. **Backup your MCP server**:
   ```powershell
   copy C:\Claude\security-scorecard-mcp\security-scorecard-mcp\build\index.js index.js.backup
   ```

2. **Apply debug patches**:
   - Open `C:\Claude\security-scorecard-mcp\security-scorecard-mcp\build\index.js`
   - Find the `makeRequest` method and replace it with the debug version from `debug_patch.js`
   - Find the `getCurrentFindings` method and replace it with the debug version

3. **View debug output**:
   - Restart Claude Desktop
   - Open Developer Tools (Ctrl+Shift+I)
   - Go to Console tab
   - Run MCP functions and look for `[DEBUG]` messages

### Step 3: Apply Quick Fixes
Based on what you discover, apply the appropriate fixes from `quick_fixes.js`:

#### Fix 1: Handle Different Response Formats
If the API returns data in a different structure (e.g., `data` instead of `entries`):
- Replace the `getCurrentFindings` method with Fix 1 from `quick_fixes.js`

#### Fix 2: Handle Undefined Percentiles
To fix the industry comparison percentiles:
- Replace the `compareWithIndustry` method with Fix 2 from `quick_fixes.js`

#### Fix 3: Fallback to Factor Data
If the issues endpoint is completely broken:
- Add the `getIssuesFromFactors` helper method
- Update `analyzeFindingsByPriority` with Fix 4 that uses factor data as fallback

### Step 4: Test Fixes
After applying fixes:

1. Restart Claude Desktop
2. Test each function:
   ```
   "Get current findings for neste.com"
   "Analyze security priorities for neste.com"
   "Get findings by asset for neste.com"
   ```

### Step 5: Permanent Solution Options

#### Option A: Rebuild from Source
If fixes don't work, rebuild using the template:
1. Create new TypeScript project using `MCP API Integration Template & Guide.docx`
2. Implement the working API endpoints discovered in testing
3. Add better error handling and fallback mechanisms

#### Option B: Contact SecurityScorecard
If API has fundamentally changed:
1. Check latest documentation at https://securityscorecard.readme.io/reference/introduction
2. Contact their support about the `/companies/{domain}/issues` endpoint
3. Ask about API token permission levels

## Troubleshooting Tips

### Common Issues
1. **Empty responses but no errors**: API structure changed
2. **401/403 errors**: Token permissions insufficient
3. **404 errors**: Endpoint deprecated or changed
4. **Rate limiting**: Add delays between requests

### Debug Output Locations
- **Claude Desktop Console**: Ctrl+Shift+I → Console tab
- **MCP Server Logs**: Look for `[DEBUG]` prefixed messages
- **API Test Results**: Saved to `api_test_results.txt`

## Files in This Package
- `test_api_endpoints.js` - Direct API testing script
- `debug_patch.js` - Debug versions of MCP methods
- `quick_fixes.js` - Potential fixes for common issues
- `DEBUGGING_INSTRUCTIONS.md` - This file

## Next Steps
1. Run API tests on your job computer where you have the token
2. Apply debug patches to see what MCP is receiving
3. Implement appropriate fixes based on findings
4. Consider rebuilding if API has changed significantly

## Support
- SecurityScorecard API Docs: https://securityscorecard.readme.io/reference/introduction
- MCP SDK Issues: https://github.com/modelcontextprotocol/sdk/issues
- Original Implementation Reference: `security_scorecard_mcp_architecture.json`
