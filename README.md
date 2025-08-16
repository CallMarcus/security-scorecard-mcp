# Security Scorecard MCP

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![PowerShell](https://img.shields.io/badge/PowerShell-%235391FE.svg?style=for-the-badge&logo=powershell&logoColor=white)
![Claude](https://img.shields.io/badge/Claude%20Desktop-FF6B35?style=for-the-badge&logo=anthropic&logoColor=white)
![Security](https://img.shields.io/badge/SecurityScorecard-FF4B4B?style=for-the-badge&logo=security&logoColor=white)
![MCP](https://img.shields.io/badge/Model%20Context%20Protocol-000000?style=for-the-badge&logo=protocol&logoColor=white)

A Model Context Protocol (MCP) server that integrates with the [SecurityScorecard REST API](https://securityscorecard.readme.io/). Originally designed for executive reporting, this MCP is being refocused to support operational security teams with daily remediation workflows.

**✅ Core Tools Working:** Currently 100% functional (11/11 registered tools working in Claude Desktop). 3 additional tools need registration/completion. See [OPERATIONAL-REFOCUS-STRATEGY.md](./OPERATIONAL-REFOCUS-STRATEGY.md) for remaining roadmap.

## 🎯 Target Use Cases (After Refocus)

### For Operational Security Teams
- **Daily Remediation Workflows** - Get actionable fix procedures for security findings
- **Quick Wins Identification** - Find low-effort, high-impact improvements
- **Asset-Based Tracking** - Monitor security issues by team ownership
- **Progress Monitoring** - Track remediation status and blockers
- **ITSM Integration** - Export findings to Jira, ServiceNow for ticketing

### For IT Implementation Teams  
- **Change Planning** - Assess impact before making security changes
- **Automation Scripts** - Generate fix scripts for common issues
- **Validation Testing** - Verify fixes are properly implemented
- **Rollback Procedures** - Safe recovery if changes cause issues

### Current Working Features (11/11 Registered Tools)
- **Strategic Analysis** - ROI-based security roadmaps with operational context
- **Factor Impact Assessment** - Comprehensive impact analysis with prioritization
- **Issue Prioritization** - ✅ FIXED - ROI-based issue ranking working
- **Asset Management** - Complete asset discovery, analysis, and comparison
- **Remediation Reports** - ✅ FIXED - Comprehensive operational reports
- **Category Analysis** - ✅ FIXED - Findings organized by security factors
- **Direct API Access** - Full SecurityScorecard API integration

## 🏗️ Technology Stack

This MCP server is built with modern, reliable technologies:

- **TypeScript** - Type-safe development with full IntelliSense support
- **Node.js 18+** - High-performance JavaScript runtime
- **Model Context Protocol (MCP)** - Anthropic's protocol for AI tool integration
- **SecurityScorecard API** - Enterprise security posture management
- **PowerShell** - Cross-platform automation and setup scripts
- **GitHub Actions** - Automated testing and deployment pipelines

## Branch workflow

The `main` branch contains the stable, production-ready code. Active development
happens on the `dev` branch where new features and fixes are tested before being
merged back into `main`.

## 🚀 One-Command Installation

The SecurityScorecard MCP features a streamlined installation process that works on any clean Windows machine:

### Prerequisites
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **GitHub CLI** - [Download here](https://cli.github.com/) (or will be auto-installed via winget)
- **SecurityScorecard API Token** - [Get from your SecurityScorecard dashboard](https://platform.securityscorecard.io/)

### Quick Start Options

#### Option 1: Full Production Setup (Recommended for new users)
```powershell
# Download and run the full setup script (Windows)
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/CallMarcus/security-scorecard-mcp/main/setup.ps1" -OutFile "setup.ps1"
.\setup.ps1
```

**That's it!** The setup script will:
1. ✅ Verify Node.js installation
2. ✅ Install/authenticate GitHub CLI if needed  
3. ✅ Download the latest MCP release with all dependencies
4. ✅ Configure your SecurityScorecard API credentials
5. ✅ Launch the MCP server ready for Claude Desktop

#### Option 2: Simple Development Setup (For developers/rebuilds)
```powershell
# Quick local build and setup
.\setup_simple.ps1
```

**Perfect for:** Developers, quick rebuilds, or when you already have the repository cloned. This script will:
1. ✅ Install dependencies locally
2. ✅ Build TypeScript to JavaScript  
3. ✅ Verify build success
4. ✅ Show Claude Desktop config path and instructions

You'll be prompted for:
- **Company domain** - The primary domain for your security analysis
- **SecurityScorecard API token** - Your API credentials
- **Default issue types** - (Optional) Comma-separated list for scanning

### Linux/macOS
```bash
curl -O https://raw.githubusercontent.com/CallMarcus/security-scorecard-mcp/main/setup.sh
chmod +x setup.sh
./setup.sh
```

## Installation

`setup.sh` and `setup.ps1` download the latest release before starting the server.

```bash
./setup.sh
```

On Windows 11 run:

```powershell
.\setup.ps1
```

**Authentication:** The setup script uses GitHub CLI authentication automatically. For private repositories, ensure you have `repo` scope when authenticating with `gh auth login`.

## Updating MCP

### Production Updates
Run the update script to download the latest tagged release and refresh the compiled files:

```bash
scripts/update.sh
```

On Windows 11 run:

```powershell
.\scripts\update.ps1
```

To download the optional documentation bundle, run `scripts/update.ps1 -IncludeDocs` or `scripts/fetch-docs.ps1`.

### Development Updates (Quick Rebuild)
For developers who want to quickly rebuild after code changes:

```powershell
# Quick rebuild after making code changes
.\setup_simple.ps1
```

This is perfect when you've:
- Modified TypeScript source files
- Made local changes to the codebase  
- Want to test changes quickly
- Need to rebuild without re-downloading dependencies

## Running the server manually

1. Install Node.js (v18 or newer).
2. Set your API token in the environment:
   ```bash
   export SECURITY_SCORECARD_API_TOKEN="<your-token>"
   # optional default domain for queries
   export COMPANY_DOMAIN="example.com"
   # optional default issue types used by some tools
   export DEFAULT_ISSUE_TYPES="spf_record_missing,dmarc_contains_none,patching_cadence_v3_critical"
   # optional verbose debugging
   export DEBUG_MODE="true"
   # optional request caching & rate limiting
   export REQUEST_CACHE_TTL_MS="300000"      # cache duration in ms
   export REQUESTS_PER_INTERVAL="5"          # requests added per interval
   export REQUEST_INTERVAL_MS="1000"         # interval length in ms
   export REQUEST_BURST_LIMIT="5"            # max burst size
   export SCORECARD_PAGE_SIZE="50"           # items per page for paginated endpoints (max 50)
   ```
3. Start the MCP server:
   ```bash
   node build/index.js
   ```

The server communicates over stdio and is typically used by clients such as Claude Desktop or other MCP-compatible tools.

Refer to the files in `build_docs/` for API references, debugging instructions and the architecture overview. If this folder is missing, fetch it with `scripts/update.ps1 -IncludeDocs` or `scripts/fetch-docs.ps1`.

## Testing API Endpoints

A small helper script `build_docs/api_test_tool.js` allows testing any SecurityScorecard REST endpoint. Provide the endpoint path and optionally your domain and API token. The `{domain}` placeholder inside the endpoint will be replaced with your domain. The tool now consults the bundled API reference to auto-fill the HTTP method and display endpoint descriptions.

```bash
# Example
node build_docs/api_test_tool.js /companies/{domain}/issues?limit=5 \
  --domain company.com --token YOUR_TOKEN
```

The script prints the HTTP status and a short preview of the response so you can validate what the API returns before integrating a new MCP tool.

### API Reference utilities

Developer-oriented helpers in `src/api_reference.ts` load `build_docs/api_reference.json` and expose lookup functions. For example:

```typescript
import { loadApiReference, getEndpointDetails } from "./build/api_reference.js";

const allEndpoints = await loadApiReference();
const issuesInfo = await getEndpointDetails("/companies/{domain}/issues");
```

These utilities power the endpoint testing script and are used by the remediation report builder to note which API resources were queried.

## ✅ Success Indicators

When the installation completes successfully, you should see:

```
✅ Live SecurityScorecard MCP Server running - Ready for analysis!
```

The server is now ready to integrate with Claude Desktop. If you see module errors or other issues, refer to the troubleshooting section below.

## Claude Desktop Integration

After running the setup script, configure Claude Desktop to connect to your MCP server:

### Configuration Location
- **Windows:** `%APPDATA%/Claude/claude_desktop_config.json`  
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux:** `~/.config/Claude/claude_desktop_config.json`

### Sample Configuration
Replace the placeholder values with your installation path and credentials:

```json
{
  "servers": {
    "security-scorecard-mcp": {
      "command": "node",
      "args": ["C:\\path\\to\\your\\installation\\build\\index.js"],
      "env": {
        "SECURITY_SCORECARD_API_TOKEN": "YOUR_API_TOKEN_HERE",
        "COMPANY_DOMAIN": "example.com",
        "DEFAULT_ISSUE_TYPES": "spf_record_missing,dmarc_contains_none,patching_cadence_v3_critical",
        "DEBUG_MODE": "false"
      },
      "shell": false
    }
  },
  "defaultServer": "security-scorecard-mcp"
}
```

### Quick Configuration Tips
1. **Find your installation path** - The setup script displays the installation directory
2. **Use your actual domain** - Replace `example.com` with your company's primary domain  
3. **Restart Claude Desktop** - After saving the configuration file
4. **Verify connection** - Look for the SecurityScorecard MCP server in Claude's tool list



## 🔧 Troubleshooting

### Common Issues and Solutions

**❌ "Cannot find package '@modelcontextprotocol/sdk'"**
- **Cause:** Incomplete or corrupted installation
- **Solution:** Re-run the setup script to ensure all dependencies are installed

**❌ "Bad credentials (HTTP 401)"**  
- **Cause:** Invalid or expired GitHub token
- **Solution:** Clear the token and re-authenticate:
  ```powershell
  Remove-Item Env:GITHUB_TOKEN -ErrorAction SilentlyContinue
  gh auth login --web --scopes "repo"
  ```

**❌ "No release found"**
- **Cause:** No published releases available
- **Solution:** Ensure the repository has published releases, or clone the repository for development

**❌ Module loading errors**
- **Cause:** Incomplete dependency installation  
- **Solution:** Run setup script again to download complete package

### Getting Help
- Check the [GitHub Issues](https://github.com/CallMarcus/security-scorecard-mcp/issues) for known problems
- Review the installation logs for specific error messages
- Ensure you have the required Node.js version (18+)

## 🛠️ MCP Tools Reference

**✅ Status Update:** All 11 registered tools are working in Claude Desktop. 3 additional tools need registration/completion.

### Registered & Working Tools (11/11) ✅

These tools are fully functional and can be used immediately:

#### 1. get_score_improvement_roadmap
**Description:** Generate a prioritized roadmap to reach a target grade.

**Parameters**
- `domain` (string, required) – Company domain to analyze.
- `target_grade` (string, required; one of `A`, `B`, `C`) – Desired grade.

**Response**
Markdown sections showing points needed, ROI‑ranked factors and quick wins.

**Errors**
- `InvalidRequest` if the domain cannot be accessed or grade is invalid.

**Sample request**
```json
{ "name": "get_score_improvement_roadmap", "arguments": {"domain": "example.com", "target_grade": "A"} }
```

**Sample response**
```text
# 🎯 SCORE IMPROVEMENT ROADMAP: example.com
...
```

**Edge cases**
- Returns a congratulatory message if the current score already meets the target.

#### 2. calculate_factor_score_impact
**Description:** Analyze ROI for each factor contributing to the score.

**Parameters**
- `domain` (string, required)

**Response**
Markdown list ranking factors by ROI.

**Errors**
- `InvalidRequest` for inaccessible domain.

**Sample request**
```json
{ "name": "calculate_factor_score_impact", "arguments": {"domain": "example.com"} }
```

**Sample response**
```text
# 💰 FACTOR SCORE IMPACT ANALYSIS: example.com
...
```

**Edge cases**
- If all factors are already at 100, the list may be empty.

#### 3. get_issues_by_roi
**Description:** Return issue types ranked by ROI.
**Status:** ✅ FIXED - Now returns properly prioritized issues with operational context

#### 4. get_findings_by_category
**Description:** Organize findings by SecurityScorecard factors.
**Status:** ✅ FIXED - Returns categorized findings with operational context

#### 5. find_high_impact_findings_across_assets  
**Description:** Scan for critical vulnerabilities across all assets.
**Status:** ✅ FIXED - Multi-asset high-impact analysis working

#### 6. generate_remediation_report
**Description:** Create comprehensive remediation plans.
**Status:** ✅ FIXED - Generates comprehensive operational reports

#### 7. get_findings_by_asset
**Description:** List all security findings organized by asset (domains and IPs).
**Status:** ✅ Working - Returns comprehensive asset-level security data

#### 8. get_asset_inventory
**Description:** Get comprehensive inventory of all domains and IPs.
**Status:** ✅ Working - Complete asset management capabilities

#### 9. get_asset_findings
**Description:** Get detailed security findings for specific assets.
**Status:** ✅ Working - Asset-specific security analysis

#### 10. compare_assets
**Description:** Compare security posture across multiple assets.
**Status:** ✅ Working - Multi-asset security comparison

#### 11. call_api_endpoint  
**Description:** Direct access to SecurityScorecard API for custom queries.
**Status:** ✅ Working - Full API access available

### Missing Tools (3) - Need Registration/Completion ⚠️

These tools exist but need MCP registration or completion:

#### 12. get_quick_wins ⚠️
**Description:** Find high‑impact, low‑effort improvements.
**Status:** ❌ METHOD EXISTS - Needs MCP tool registration

**Current:** Fully implemented method with effort-based filtering  
**Required:** Add to tools array and switch statement for Claude Desktop access

#### 13. simulate_score_improvement ⚠️
**Description:** Forecast score impact of fixing specific issue types.
**Status:** ❌ STUB EXISTS - Needs full implementation

#### 14. benchmark_grade_requirements ⚠️  
**Description:** Show score requirements and peer comparison for grade levels.
**Status:** ❌ STUB EXISTS - Needs full implementation

---

## Detailed Tool Documentation

### Working Tools Details

#### find_high_impact_findings_across_assets (Currently in broken section)
**Note:** This documentation describes the intended functionality

**Parameters**
- `domain` (string, required)
- `issue_types` (array of strings, optional) – Issue types to search for.
- `status` (string, optional, default `"active"`) – Choose `"active"` or `"historical"` issues.

**Response**
Markdown summary listing assets where each issue type appears.

**Errors**
- Returns `No issue types specified` if the list is empty.
- Partial results may be returned when some asset lookups fail.

**Sample request**
```json
{ "name": "find_high_impact_findings_across_assets", "arguments": {"domain": "example.com", "issue_types": ["spf_record_missing"], "status": "active"} }
```

**Sample response**
```text
# 🔍 TACTICAL FINDINGS ACROSS ALL ASSETS
...
```

**Edge cases**
- Scanning many assets can be slow; missing assets are skipped.

### get_findings_by_asset
**Description:** List issues grouped by each asset.

**Parameters**
- `domain` (string, required)
- `asset_type` (string, optional; `domain` or `ip_address`, default `domain`)

**Response**
Markdown sections for each asset with associated issues.

**Errors**
- `InvalidRequest` if the asset type is unsupported.

**Sample request**
```json
{ "name": "get_findings_by_asset", "arguments": {"domain": "example.com", "asset_type": "domain"} }
```

**Sample response**
```text
# ISSUES BY ASSET: example.com
...
```

**Edge cases**
- If the domain has no assets, the response indicates none were found.

### get_findings_by_category
**Description:** List issues grouped by SecurityScorecard factor.

**Parameters**
- `domain` (string, required)

**Response**
Markdown section per factor with related issues.

**Errors**
- `InvalidRequest` if the domain is invalid.

**Sample request**
```json
{ "name": "get_findings_by_category", "arguments": {"domain": "example.com"} }
```

**Sample response**
```text
# FINDINGS BY CATEGORY: example.com
...
```

**Edge cases**
- Factors with no issues are omitted from the output.

### generate_remediation_report
**Description:** Retrieve all findings and suggest fixes by factor.

**Parameters**
- `domain` (string, required)

**Response**
Markdown report grouped by factor with remediation advice.

**Errors**
- `InvalidRequest` if the domain lookup fails.

**Sample request**
```json
{ "name": "generate_remediation_report", "arguments": {"domain": "example.com"} }
```

**Sample response**
```text
# REMEDIATION REPORT: example.com
...
```

**Edge cases**
- Large reports may be truncated by some clients.

### call_api_endpoint
**Description:** Query any SecurityScorecard REST endpoint.

**Parameters**
- `endpoint` (string, required) – API path such as `/companies/example.com`.
- `method` (string, optional, default `GET`).
- `body` (object, optional) – JSON body for POST/PUT requests.

**Response**
Raw JSON from the API rendered in a code block.

**Errors**
- Mirrors underlying HTTP errors (401 unauthorized, 403 forbidden, 404 not found, 429 rate limit, etc.).

**Sample request**
```json
{ "name": "call_api_endpoint", "arguments": {"endpoint": "/companies/example.com", "method": "GET"} }
```

**Sample response**
```json
{ "name": "Example Corp", "score": 75 }
```

**Edge cases**
- The endpoint must be relative; full URLs are rejected.

## Claude Desktop Test Plan
For end-to-end validation with Claude Desktop, follow `live-scorecard-server/test-plan.md`. Rebuild the server (`npm run build`) and start it (`node build/index.js`) before running the plan. Claude should execute the listed tool calls and return a markdown report noting pass/fail for each.

