# Enhanced Security Scorecard MCP Server

## 🎯 Overview

This enhanced MCP server addresses the core issues identified in your analysis document where functions like `get_current_findings` were returning empty data despite your D-grade security rating. The enhanced version includes comprehensive debugging, better API handling, and multiple new tools for detailed security analysis.

## 🚀 Quick Start

### 1. Set Environment Variables
```powershell
# Required
$env:SECURITY_SCORECARD_API_TOKEN = "your-actual-token-here"

# Optional  
$env:COMPANY_DOMAIN = "neste.com"
$env:DEBUG_MODE = "true"  # For detailed logging
```

### 2. Build and Deploy
```powershell
cd C:\Temp\scorecard
.\setup.ps1 -All
```

### 3. Restart Claude Desktop and Test
```
debug api access for neste.com
get detailed findings for neste.com
analyze findings priority for neste.com
```

## 🧪 Testing with Claude Desktop

Use `test-plan.md` to coordinate debugging and validation. Rebuild the server with `npm run build` and start it with `node build/index.js` before running tests. Claude Desktop should execute the steps in the plan and return a markdown report summarizing each tool's results.

## 🛠️ New Enhanced Tools

### **1. `debug_api_access`** - Troubleshoot API Issues
```
debug api access for neste.com
```
- Tests multiple API endpoints
- Identifies working vs broken patterns
- Provides specific recommendations
- **Use this first if you have issues**

### **2. `get_detailed_findings`** - Enhanced Findings Access
```
get detailed findings for neste.com with severity high
get detailed findings for neste.com with factor application_security limit 200
```
- Supports pagination for large datasets
- Better filtering by severity/factor
- Comprehensive analysis of findings
- Shows sample data structures

### **3. `analyze_findings_priority`** - Smart Risk Prioritization  
```
analyze findings priority for neste.com top 15
```
- Multi-factor risk scoring algorithm
- Asset criticality bonuses (www, api, admin interfaces)
- Issue type priority adjustments
- Business impact consideration

### **4. `get_findings_by_asset`** - Asset-Centric Analysis
```
get findings by asset for neste.com with asset_type ip
get findings by asset for neste.com with min_severity high
```
- Groups findings by IP/domain/subdomain
- Risk-weighted asset prioritization
- Targeted remediation by infrastructure team

### **5. `get_findings_by_factor`** - Factor-Based Grouping
```
get findings by factor for neste.com
```
- Groups findings by security factor
- Shows factor scores and percentiles
- Sample issues per factor

## 🔍 Debugging & Testing

### **Standalone API Testing**
```powershell
# Test different API endpoint patterns
node test_endpoints.js

# Comprehensive API access testing  
node debug_enhanced.js

# Build the MCP server
.\build.ps1
```

### **Debug Mode**
Enable verbose logging in MCP responses:
```powershell
$env:DEBUG_MODE = "true"
.\setup.ps1 -Deploy
```

## 🎯 Addressing Analysis Document Issues

### **Issue 1: Empty Findings Data**
- **Problem**: `get_current_findings` returned "Total Issues: 0"
- **Solution**: Enhanced `get_detailed_findings` with multiple API access patterns and debugging

### **Issue 2: Missing Industry Percentiles**
- **Problem**: Percentiles showing as "undefined"  
- **Solution**: Better data mapping with fallback handling

### **Issue 3: Broken Asset Analysis**
- **Problem**: `get_findings_by_asset` returned empty array
- **Solution**: Enhanced asset classification and risk scoring

### **Issue 4: No Priority Analysis**
- **Problem**: `analyze_findings_by_priority` returned empty top issues
- **Solution**: Advanced risk scoring with multiple factors

## 🔧 Manual Troubleshooting

### **If Functions Still Return Empty Data:**

1. **Test API Access Directly**
   ```powershell
   node test_endpoints.js
   ```

2. **Check API Token Permissions**
   - Verify token has full read access
   - Test with SecurityScorecard web interface

3. **Verify Domain Configuration**
   - Ensure "neste.com" is in your monitored portfolio
   - Check spelling and format

4. **Enable Debug Mode**
   ```powershell
   $env:DEBUG_MODE = "true"
   .\setup.ps1 -Deploy
   ```

5. **Try Alternative Domains**
   ```
   debug api access for www.neste.com
   debug api access for neste.fi
   ```

### **Expected vs Actual Behavior**

✅ **What Should Work Now:**
- Detailed findings with specific assets
- Asset-level security breakdown  
- Risk-prioritized remediation guidance
- Industry percentile data
- Comprehensive debugging information

❌ **If Still Not Working:**
- API endpoint structure may have changed
- Authentication scope insufficient
- Domain not properly configured in SecurityScorecard
- Need alternative API access pattern

## 📊 Success Metrics

The enhanced MCP should deliver:

✅ **Specific asset lists** (e.g., domains missing SPF records)  
✅ **Detailed vulnerability data** with remediation steps  
✅ **Proper industry percentiles** instead of "undefined"  
✅ **Consistent data flow** across all security factors  
✅ **Operational intelligence** for hands-on security work  

## 🆘 Support

### **If Problems Persist:**

1. **Check API Documentation**
   - SecurityScorecard may have updated endpoints
   - Review latest API documentation

2. **Contact SecurityScorecard Support**
   - Ask about issues endpoint access
   - Verify API token permissions  
   - Confirm domain monitoring status

3. **Review Debug Output**
   - Run with `DEBUG_MODE=true`
   - Check console errors in Claude Desktop
   - Analyze `debug_api_access` results

### **Files Created:**
- `src/index.ts` - Enhanced MCP server
- `setup.ps1` - Automated build/deploy script
- `test_endpoints.js` - API endpoint testing
- `debug_enhanced.js` - Comprehensive API debugging
- `build.ps1` - TypeScript build script

## 🎉 Next Steps

1. **Build and deploy** the enhanced server
2. **Test with** `debug api access` first
3. **Use new tools** for detailed security analysis
4. **Enable debug mode** if issues persist
5. **Contact support** if API access problems continue

The enhanced implementation should resolve the core MCP issues and provide the operational security intelligence you need!
