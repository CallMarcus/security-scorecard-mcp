# Security Scorecard MCP - Developer Guide

This document provides development guidance and architectural notes for the SecurityScorecard MCP server.

## 🎯 Project Status: Two Production-Ready Versions

**✅ DUAL VERSION STRATEGY COMPLETE** - Both versions are production-ready and serving different needs:

### **Version 1: Streamlined** (`simplified-index.ts`) ⭐ **Recommended**
- ✅ **Token-efficient** - 90% reduction for simple queries (15-50 tokens vs 1000+)
- ✅ **Intelligent responses** - 3-tier system (minimal/standard/detailed) 
- ✅ **Data validation** - Cross-tool verification and completeness checking
- ✅ **Claude Desktop optimized** - Extended chat conversations without hitting limits
- ✅ **8 specialized tools** - Focused on common security operations
- ✅ **Production validated** - Real-world testing confirms multi-step problem solving

### **Version 2: Comprehensive** (`index.ts`) 
- ✅ **Full API coverage** - 11+ tools with complete SecurityScorecard integration
- ✅ **Strategic analysis** - ROI calculations, executive reporting capabilities
- ✅ **Advanced features** - Asset management, comprehensive remediation planning  
- ✅ **Direct API access** - Custom queries and specialized workflows
- ✅ **Executive reporting** - Complete security posture analysis

## 📊 Current Status Summary

### **Both Versions: Production Ready** ✅
The MCP successfully supports:
- **Daily operations teams** - Quick answers and efficient workflows
- **Strategic analysts** - Comprehensive security posture assessment
- **IT teams** - Both quick fixes and strategic planning
- **Executives** - High-level reporting and ROI analysis
- **Claude Desktop users** - Extended conversations with intelligent response scaling

## 🏗️ Architecture Overview

The MCP server is built with:
- **TypeScript/JavaScript** - Compiled to `build/index.js` for runtime
- **Production Dependencies** - Complete `node_modules` packaging (~93 packages)
- **GitHub Releases** - Automated packaging and distribution system
- **MCP SDK v0.6.0** - Model Context Protocol compliance

## 🚀 Quick Development Setup

### For Users (Production)
```powershell
# One-command installation
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/CallMarcus/security-scorecard-mcp/main/setup.ps1" -OutFile "setup.ps1"
.\setup.ps1
```

### For Developers
1. **Clone and setup:**
   ```bash
   git clone https://github.com/CallMarcus/security-scorecard-mcp.git
   cd security-scorecard-mcp
   npm install
   ```

2. **Development build:**
   ```bash
   npm run build  # Compiles TypeScript to JavaScript
   
   # Run Streamlined Version (Recommended)
   node build/simplified-index.js
   
   # OR Run Comprehensive Version  
   node build/index.js
   ```

3. **Version selection in development:**
   - **Streamlined:** Edit `src/simplified-index.ts` for token-efficient operations
   - **Comprehensive:** Edit `src/index.ts` for full-featured analysis
   - Both versions compile to separate JavaScript files in `build/`

4. **Create release packages:**
   ```powershell
   .\scripts\package.ps1  # Creates mcp-core.zip with dependencies for both versions
   ```

## Installation
`setup.*` and `scripts/update.*` download prebuilt files from the latest GitHub release.

## Developing and building
1. Clone the repository and install dependencies:
   ```powershell
   npm install
   ```
2. The server entry point lives in `build/index.js`. New functionality can be added directly or by creating TypeScript files under a `src/` folder and compiling with `npx tsc`.
3. When implementing new MCP tools, mirror the patterns already used in `build/index.js`. Tools should return a short Markdown summary followed by a JSON code block for the LLM.
4. Use `build_docs/api_test_tool.js` to validate API endpoints before adding them to the server.
5. Keep `setup.ps1` in sync with any new environment variables or configuration settings so non-developers have a smooth experience.

## Development Status (Operational Refocus - COMPLETE)

### ✅ Phase 1: Critical Tool Fixes (COMPLETED)
- ✅ **`get_issues_by_roi`** - Now returns properly prioritized issues with operational context
- ✅ **`generate_remediation_report`** - Now generates comprehensive remediation reports
- ✅ **`get_findings_by_category`** - Fixed categorization and filtering
- ✅ **Core data processing** - All registered tools functional

### 🔧 Phase 2: Missing Tool Implementation (IN PROGRESS)
- ❌ **`get_quick_wins`** - Method exists but not registered as MCP tool
- ❌ **`simulate_score_improvement`** - Not implemented
- ❌ **`benchmark_grade_requirements`** - Stub implementation only
- 📋 **Need registration** - Several tools need proper MCP tool registration

### 📋 Phase 3: Operational Enhancements (ROADMAP)
- ❌ **Asset ownership mapping** - Not implemented  
- ❌ **Progress tracking** - Not implemented
- ❌ **ITSM integration** - Not implemented
- ❌ **Team dashboards** - Not implemented
- ❌ **Bulk operations** - Not implemented
- ❌ **Change management workflows** - Not implemented

## 🎉 Completed Achievements

### Fixed All Critical Issues ✅
- **API endpoint paths** - All tools now use proper API routes with workarounds for 404 endpoints
- **API response parsing** - Robust handling of both `data`/`pagination` and legacy `entries` structures  
- **Pagination implementation** - Complete support for `has_next` and `next_cursor` pagination
- **Dependency resolution** - Full transitive dependency packaging (zod, content-type, raw-body, etc.)
- **Authentication flow** - GitHub CLI integration with token fallback
- **Error handling** - Comprehensive error recovery and user feedback

### Release Pipeline ✅
- **Automated packaging** - Production-only dependency bundling
- **GitHub releases** - Asset-based distribution with API authentication
- **Update mechanism** - Self-updating scripts with fallback strategies
- **Documentation** - Complete user and developer guides

## MCP Tool Suite Status

### **Streamlined Version Tools** (8/8 Working) ⭐ **Primary Focus**

**✅ Production Ready - All tools working with intelligent response system**

#### Core Intelligence Features
- **3-tier response modes** - Minimal (15 tokens) → Standard (300 tokens) → Detailed (800+ tokens)
- **Cross-tool data validation** - Automatic verification and completeness checking
- **Progressive disclosure** - Claude Desktop intelligently escalates detail as needed
- **Token efficiency** - 90% reduction for simple queries

#### Available Tools
1. **`security_dashboard`** - Core security metrics with intelligent response scaling
2. **`analyze_security_risks`** - Risk analysis and issue prioritization  
3. **`create_improvement_plan`** - Actionable security improvement roadmaps
4. **`discover_assets`** - Asset inventory with security context and validation
5. **`analyze_email_security`** - SPF/DMARC/DKIM analysis for email security
6. **`analyze_issue_types`** - Granular breakdown by specific security issue types
7. **`validate_data_completeness`** - Cross-validate tool results for accuracy
8. **`query_security_data`** - Direct API access with enhanced validation

### **Comprehensive Version Tools** (11/11 Working)

**✅ All Registered & Working - Full Strategic Analysis Suite**
- `get_score_improvement_roadmap` - Strategic roadmap generation
- `calculate_factor_score_impact` - ROI analysis for security factors
- `get_findings_by_asset` - Asset-specific issue tracking
- `call_api_endpoint` - Direct API access for custom queries
- `get_issues_by_roi` - Returns properly prioritized issues with ROI context
- `get_findings_by_category` - Returns categorized findings by security factors
- `find_high_impact_findings_across_assets` - Multi-asset vulnerability analysis
- `generate_remediation_report` - Comprehensive operational reports
- `get_asset_inventory` - Complete asset discovery and management
- `get_asset_findings` - Asset-specific security findings
- `compare_assets` - Multi-asset security posture comparison

## 🧪 Testing and Validation

### Production Testing  

**✅ Both Versions Fully Tested and Validated**

#### **Streamlined Version Testing Results**
- **Token efficiency validated** - 90% reduction confirmed (15 tokens vs 1000+ tokens)
- **Claude Desktop integration** - Extended conversations without context limits
- **Multi-step problem solving** - Proven working in real-world testing
- **Data validation system** - Cross-tool verification working correctly
- **Intelligence response modes** - Minimal/standard/detailed scaling functioning
- **Comprehensive testing status** - See [MCP_STATUS_REPORT.md](./MCP_STATUS_REPORT.md)

#### **Comprehensive Version Testing Results**  
- **Clean machine installation** - Working perfectly
- **Tool functionality** - 100% success rate (11/11 registered tools working)  
- **Claude Desktop integration** - Fully compatible with all registered tools
- **Dependency resolution** - Complete and working
- **Strategic analysis features** - ROI calculations and executive reporting working
- **Asset management** - Complete discovery and analysis capabilities
- **Test Report**: See [TEST-OUTPUT-securityscorecard-mcp-enhancement.md](./TEST-OUTPUT-securityscorecard-mcp-enhancement.md)

### Development Testing
```bash
# Build and test both versions locally
npm run build

# Test Streamlined Version (Recommended)
node build/simplified-index.js

# Test Comprehensive Version
node build/index.js

# Package testing  
.\scripts\package.ps1
.\verify-deps.ps1  # Verify all dependencies included for both versions
```

### Integration Testing
- Follow test plan at `live-scorecard-server/test-plan.md`
- Claude Desktop should execute all tool calls successfully
- Expected result: `✅ Live SecurityScorecard MCP Server running - Ready for analysis!`

## 📦 Deployment Architecture

### Release Process
1. **Package Creation**: `scripts/package.ps1` creates production-ready packages
2. **GitHub Releases**: Upload `mcp-core.zip` as release assets  
3. **User Installation**: `setup.ps1` downloads and deploys packages
4. **Automatic Updates**: `scripts/update.ps1` handles version updates

### Package Contents
- **Build artifacts**: Compiled JavaScript (`build/index.js`)
- **Runtime dependencies**: Complete `node_modules` (~93 packages)
- **Configuration**: `package.json`, `package-lock.json`
- **Self-contained**: No compilation required on target machines

### Authentication Flow
- **GitHub CLI**: Primary authentication method (`gh auth login`)
- **API Downloads**: Uses GitHub API for authenticated asset downloads
- **Token Fallback**: Environment variable support for automation
- **Error Recovery**: Graceful fallback to alternative download methods
