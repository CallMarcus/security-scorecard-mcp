# Security Scorecard MCP - Developer Guide

This document provides development guidance and architectural notes for the SecurityScorecard MCP server.

## 🎯 Project Status & Strategic Refocus

**⚠️ OPERATIONAL REFOCUS IN PROGRESS** - Shifting from executive to operational focus:
- ✅ **Core infrastructure stable** - One-command installation with complete dependency packaging
- ⚠️ **Tool functionality mixed** - 33% working (4/12 tools), critical operational tools need fixes
- 🔧 **Refocusing for operations** - Moving from executive reporting to daily remediation support
- 📋 **See strategy documents**: 
  - [OPERATIONAL-REFOCUS-STRATEGY.md](./OPERATIONAL-REFOCUS-STRATEGY.md) - Strategic vision
  - [OPERATIONAL-TOOLS-SPEC.md](./OPERATIONAL-TOOLS-SPEC.md) - Implementation specifications
  - [CURRENT-TOOL-STATUS.md](./CURRENT-TOOL-STATUS.md) - Detailed tool status

### Current Focus: Supporting Operational Security Teams
The MCP is being refocused to support:
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

## Release channels
`setup.*` and `scripts/update.*` download prebuilt files from GitHub releases.
They default to the latest stable release. Supply `--dev` (or `-Dev` on Windows)
to fetch the most recent development build instead.

## Developing and building
1. Clone the repository and install dependencies:
   ```powershell
   npm install
   ```
2. The server entry point lives in `build/index.js`. New functionality can be added directly or by creating TypeScript files under a `src/` folder and compiling with `npx tsc`.
3. When implementing new MCP tools, mirror the patterns already used in `build/index.js`. Tools should return a short Markdown summary followed by a JSON code block for the LLM.
4. Use `build_docs/api_test_tool.js` to validate API endpoints before adding them to the server.
5. Keep `setup.ps1` in sync with any new environment variables or configuration settings so non-developers have a smooth experience.

## Development Priorities (Operational Refocus)

### Phase 1: Fix Critical Operational Tools (Week 1)
- **Fix `get_issues_by_roi`** - Currently returns 0 issues despite 1000+ findings
- **Fix `generate_remediation_report`** - Returns empty results, critical for operations
- **Implement `get_quick_wins`** - Most requested feature by operational teams
- See [OPERATIONAL-TOOLS-SPEC.md](./OPERATIONAL-TOOLS-SPEC.md) for implementation details

### Phase 2: Build Operational Workflows (Week 2)
- **Asset ownership mapping** - Track which team owns which assets
- **Progress tracking** - Monitor remediation status and blockers
- **ITSM integration** - Export to Jira, ServiceNow, etc.
- **Automation support** - Generate scripts for common fixes

### Phase 3: Enterprise Features (Week 3-4)
- **Team dashboards** - Operational command center views
- **Bulk operations** - Handle multiple findings efficiently
- **Change management** - Track approvals and maintenance windows
- **Performance metrics** - Track team efficiency and progress

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

### MCP Tool Suite Status (33% Functional)

**✅ Working Tools (4/12)**
- `get_score_improvement_roadmap` - Strategic roadmap generation
- `calculate_factor_score_impact` - ROI analysis for security factors
- `get_findings_by_asset` - Asset-specific issue tracking (181 findings found)
- `call_api_endpoint` - Direct API access for custom queries

**❌ Broken Tools (3/12) - PRIORITY FIXES**
- `get_issues_by_roi` - Returns 0 issues (data extraction broken)
- `get_findings_by_category` - Returns empty array (aggregation broken)
- `find_high_impact_findings_across_assets` - Returns 0 findings (filtering broken)
- `generate_remediation_report` - Returns empty results (generation broken)

**🚫 Not Implemented (5/12)**
- `get_quick_wins` - Most requested by operations teams
- `simulate_score_improvement` - Score projection needed
- `benchmark_grade_requirements` - Peer comparison
- Plus 2 others referenced in test suite

## 🧪 Testing and Validation

### Production Testing
Recent comprehensive testing reveals:
- **Clean machine installation** - Working perfectly
- **Tool functionality** - 33% success rate (4/12 tools working)
- **Claude Desktop integration** - Compatible but limited by broken tools
- **Dependency resolution** - Complete and working
- **Test Report**: See [comprehensive-test-execution-report.md](./test-debug-logs/comprehensive-test-execution-report.md)

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
