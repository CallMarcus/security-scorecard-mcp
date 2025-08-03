# Security Scorecard MCP

This repository contains a compiled Model Context Protocol (MCP) server that integrates with the [SecurityScorecard REST API](https://securityscorecard.readme.io/). It exposes a set of MCP tools for retrieving company scorecards, analyzing findings and generating remediation plans.

The `build` directory ships with the compiled JavaScript server (`build/index.js`). Documentation, debugging helpers and architecture references are in `build_docs/`.

## Branch workflow

The `main` branch contains the stable, production-ready code. Active development
happens on the `dev` branch where new features and fixes are tested before being
merged back into `main`.

## Quick setup

Run the provided setup script to verify your Node.js installation, collect the
required configuration values and launch the server. The script now also allows
setting a comma-separated list of default issue types used by some tools:

```bash
./setup.sh
```

On Windows use `setup.ps1` instead. The script writes the entered values to a
`.env` file so subsequent runs can reuse them. You'll be prompted for:

1. The company domain used in most queries
2. Your SecurityScorecard API token
3. (Optional) default issue types to scan across assets

## Release Channels

`setup.sh` and `setup.ps1` download the latest build before starting the server.
By default they fetch the stable release. Pass `--dev` to switch to the
development channel.

```bash
# stable release
./setup.sh

# development build
./setup.sh --dev
```

On Windows 11 run:

```powershell
# stable release
.\setup.ps1

# development build
.\setup.ps1 --dev
```

You can change channels later by running the update script with the same flag.

If this repository is private, set a `GITHUB_TOKEN` environment variable with a
personal access token before running the setup or update scripts. The token
needs `repo` scope so the scripts can fetch release assets.

## Updating MCP

Run the update script to download the latest tagged release and refresh the
compiled files:

```bash
scripts/update.sh
```

On Windows 11 run:

```powershell
.\scripts\update.ps1
```

Add `--dev`/`-Dev` to either command to pull the most recent development build.

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
   ```
3. Start the MCP server:
   ```bash
   node build/index.js
   ```

The server communicates over stdio and is typically used by clients such as Claude Desktop or other MCP-compatible tools.

Refer to the files in `build_docs/` for API references, debugging instructions and the architecture overview.

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

## Sample Claude Desktop configuration

Claude Desktop looks for its configuration file at `%APPDATA%/Claude/claude_desktop_config.json` on Windows. Below is a minimal example that references this MCP server. Replace the placeholder values with your own token and default domain.

```json
{
  "servers": {
    "security-scorecard-enterprise": {
      "command": "node",
      "args": ["C:\\Temp\\scorecard\\build\\index.js"],
      "env": {
        "SECURITY_SCORECARD_API_TOKEN": "YOUR_TOKEN_HERE",
        "COMPANY_DOMAIN": "example.com",
        "DEFAULT_ISSUE_TYPES": "spf_record_missing,dmarc_contains_none,patching_cadence_v3_critical"
          "DEBUG_MODE": "false"
      },
      "shell": false
    }
  },
  "defaultServer": "security-scorecard-enterprise"
}
```

You can also find this example at `build_docs/claude_desktop_config.sample.json`.



## MCP tools

Each tool is invoked with the MCP `call_tool` request. Responses are returned in
`content[0].text` as Markdown. Errors use the same structure and are prefixed
with `Error running <tool>:` or return an MCP error code such as
`InvalidRequest`. Examples below omit the outer MCP envelope for brevity.

### get_score_improvement_roadmap
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

### calculate_factor_score_impact
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

### get_issues_by_roi
**Description:** Return active issue types ranked by ROI.

**Parameters**
- `domain` (string, required)
- `top_n` (number, optional, default 10) – Number of issues to return.

**Response**
Markdown list of issues with ROI scores and estimated impact.

**Errors**
- `InvalidRequest` if the domain is not found.
- Returns `No active issues found` when the domain has zero findings.

**Sample request**
```json
{ "name": "get_issues_by_roi", "arguments": {"domain": "example.com", "top_n": 5} }
```

**Sample response**
```text
# 🚀 ISSUES RANKED BY ROI: example.com
...
```

**Edge cases**
- Large `top_n` values are capped at the number of available issues.

### simulate_score_improvement
**Description:** Forecast score impact of fixing specific issue types.

**Parameters**
- `domain` (string, required)
- `issue_types` (array of strings, optional) – Issue types to simulate fixing.

**Response**
Markdown summary with projected overall score and factor‑level improvements.

**Errors**
- `InvalidRequest` if the domain cannot be accessed.

**Sample request**
```json
{ "name": "simulate_score_improvement", "arguments": {"domain": "example.com", "issue_types": ["spf_record_missing"]} }
```

**Sample response**
```text
# 🔮 SCORE IMPROVEMENT SIMULATION: example.com
...
```

**Edge cases**
- Unknown issue types are ignored, resulting in little or no improvement.

### get_quick_wins
**Description:** Find high‑impact, low‑effort improvements.

**Parameters**
- `domain` (string, required)
- `max_effort` (string, optional; `low` or `medium`, default `medium`) – Maximum effort level.

**Response**
Markdown list of quick wins with estimated score impact and timelines.

**Errors**
- Falls back to a predefined list if API calls fail.

**Sample request**
```json
{ "name": "get_quick_wins", "arguments": {"domain": "example.com", "max_effort": "low"} }
```

**Sample response**
```text
# ⚡ QUICK WINS FOR example.com
...
```

**Edge cases**
- Using `low` filters out medium‑effort items.

### benchmark_grade_requirements
**Description:** Show score requirements and peer comparison for grade levels.

**Parameters**
- `domain` (string, required)

**Response**
Markdown summary of current score, grade requirements and next milestone.

**Errors**
- `InvalidRequest` if the domain cannot be retrieved.

**Sample request**
```json
{ "name": "benchmark_grade_requirements", "arguments": {"domain": "example.com"} }
```

**Sample response**
```text
# 📊 GRADE BENCHMARKING: example.com
...
```

**Edge cases**
- If already at the highest grade, the "Next milestone" section notes this.

### find_high_impact_findings_across_assets
**Description:** Scan assets for common high‑impact issues.

**Parameters**
- `domain` (string, required)
- `issue_types` (array of strings, optional) – Issue types to search for.

**Response**
Markdown summary listing assets where each issue type appears.

**Errors**
- Returns `No issue types specified` if the list is empty.
- Partial results may be returned when some asset lookups fail.

**Sample request**
```json
{ "name": "find_high_impact_findings_across_assets", "arguments": {"domain": "example.com", "issue_types": ["spf_record_missing"]} }
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

