# SecurityScorecard MCP Debug Package

This package contains debugging tools and instructions for fixing the SecurityScorecard MCP server issues.

## 📁 Files Included

### 1. **DEBUGGING_INSTRUCTIONS.md**
- Comprehensive step-by-step debugging guide
- Issue summary and root cause analysis
- Troubleshooting tips

### 2. **test_api_endpoints.js**
- Direct API testing script
- Tests all SecurityScorecard endpoints
- Helps identify API response structure and issues

### 3. **debug_patch.js**
- Debug versions of MCP methods with extensive logging
- Instructions for applying patches to the compiled MCP server

### 4. **quick_fixes.js**
- Ready-to-use fixes for common issues:
  - Fix 1: Handle different API response formats
  - Fix 2: Fix undefined percentiles in industry comparison
  - Fix 3: Fallback to factor data when issues endpoint fails
  - Fix 4: Alternative implementation for priority analysis

### 5. **debug_mcp_setup.ps1**
- PowerShell automation script
- Interactive menu for debugging tasks
- Backup and restore functionality

## 🚀 Quick Start

1. **On your job computer (with API token)**:
   ```powershell
   # Set your API token
   $env:SECURITY_SCORECARD_API_TOKEN = "your-token-here"
   
   # Run API tests
   node test_api_endpoints.js
   
   # Or use the PowerShell helper
   .\debug_mcp_setup.ps1
   ```

2. **Review test results** to understand what the API returns

3. **Apply appropriate fixes** based on findings

4. **Test in Claude Desktop** to verify fixes work

## 🔍 Key Issues to Investigate

- `/companies/{domain}/issues` endpoint returning empty data
- Percentiles showing as "undefined" in factor data
- Alternative endpoints or response formats

## 📞 Support Resources

- SecurityScorecard API Docs: https://securityscorecard.readme.io/reference/introduction
- MCP SDK Documentation: https://github.com/modelcontextprotocol/sdk
- Original Implementation: See `security_scorecard_mcp_architecture.json`

## 🔄 Sync Instructions

1. Commit these files to GitHub:
   ```bash
   git add build_docs/*
   git commit -m "Add debugging tools for SecurityScorecard MCP"
   git push
   ```

2. On your job computer:
   ```bash
   git pull
   cd build_docs
   # Run debugging tools with your API token
   ```

---
*Created: January 2025 | For SecurityScorecard MCP v0.1.0*
