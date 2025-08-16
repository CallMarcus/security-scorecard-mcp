# Security Scorecard MCP - Developer Guide

This document provides development guidance and architectural notes for the SecurityScorecard MCP server.

## 🎯 Project Status & Strategic Refocus

**🔧 OPERATIONAL REFOCUS IN PROGRESS** - Core tools working, roadmap items remain:
- ✅ **Core infrastructure stable** - One-command installation with complete dependency packaging
- ✅ **Registered tools functional** - 100% working (11/11 registered tools), all working in Claude Desktop
- ⚠️ **Roadmap items pending** - Some operational enhancements still need implementation
- 📋 **See strategy documents**: 
  - [OPERATIONAL-REFOCUS-STRATEGY.md](./OPERATIONAL-REFOCUS-STRATEGY.md) - Strategic vision
  - [OPERATIONAL-TOOLS-SPEC.md](./OPERATIONAL-TOOLS-SPEC.md) - Implementation specifications
  - [CURRENT-TOOL-STATUS.md](./CURRENT-TOOL-STATUS.md) - Detailed tool status

### Current Focus: Supporting Operational Security Teams
The MCP successfully supports:
- **Subject matter experts** doing daily monitoring and remediation
- **IT teams** planning and implementing security changes
- **Operations managers** tracking remediation progress
- **DevOps teams** automating security fixes

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
   npm run build  # Compiles TypeScript to build/index.js
   node build/index.js  # Start server
   ```

3. **Create release packages:**
   ```powershell
   .\scripts\package.ps1  # Creates mcp-core.zip with dependencies
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

### MCP Tool Suite Status (13/13 Registered Tools Working)

**✅ Registered & Working Tools (13/13) - Claude Desktop Compatible**
- `get_score_improvement_roadmap` - Strategic roadmap generation
- `calculate_factor_score_impact` - ROI analysis for security factors
- `get_findings_by_asset` - Asset-specific issue tracking
- `call_api_endpoint` - Direct API access for custom queries
- `get_issues_by_roi` - ✅ FIXED - Returns properly prioritized issues
- `get_findings_by_category` - ✅ FIXED - Returns categorized findings
- `find_high_impact_findings_across_assets` - ✅ FIXED - Multi-asset analysis
- `generate_remediation_report` - ✅ FIXED - Comprehensive reports
- `get_asset_inventory` - Complete asset management
- `get_asset_findings` - Asset-specific security findings
- `compare_assets` - Security posture comparison
- `discover_all_assets` - 🆕 **ENHANCED DISCOVERY** - Overcomes 50-asset limit with comprehensive pagination
- `get_asset_detailed_findings` - 🆕 **DETAILED ANALYSIS** - Full context asset analysis with remediation details

**❌ Implemented But Not Registered (1)**
- `get_quick_wins` - Method exists, needs MCP tool registration
- `simulate_score_improvement` - Stub exists, needs completion
- `benchmark_grade_requirements` - Stub exists, needs completion

## 🧪 Testing and Validation

### Production Testing
Recent comprehensive testing reveals:
- **Clean machine installation** - Working perfectly
- **Tool functionality** - 100% success rate (13/13 registered tools working)  
- **Claude Desktop integration** - Fully compatible with all registered tools
- **Dependency resolution** - Complete and working
- **Enhanced discovery** - ✅ NEW - Addresses test report API limitations
- **Asset discovery** - Overcomes 50-asset limit, discovers IP addresses
- **Missing tools** - 1 tool needs registration/completion for full operational support
- **Test Report**: See [TEST-OUTPUT-securityscorecard-mcp-enhancement.md](./TEST-OUTPUT-securityscorecard-mcp-enhancement.md)

### Development Testing
```bash
# Build and test locally
npm run build
node build/index.js

# Package testing  
.\scripts\package.ps1
.\verify-deps.ps1  # Verify all dependencies included
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
