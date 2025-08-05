# Live Scorecard MCP Test Plan

This plan outlines how Claude Desktop should validate the server and what outputs to produce.

## Human Setup Steps
1. Pull the latest code: `git pull`
2. Install dependencies inside `live-scorecard-server`: `npm install`
3. Build fresh artifacts: `npm run build`
4. Optionally run root unit tests: `npm test` from repository root
5. Start the server: `node build/index.js`

## Claude Desktop Test Steps
1. **List tools**
   - Action: call `list_tools`
   - Expect: tools include `get_score_improvement_roadmap`, `calculate_factor_score_impact`, `get_issues_by_roi`, `find_high_impact_findings_across_assets`, `get_findings_by_asset`, `get_findings_by_category`, `generate_remediation_report`, `call_api_endpoint`
2. **get_score_improvement_roadmap**
   - Input: `{ "domain": "<DOMAIN>", "target_grade": "B" }`
   - Expect: Markdown roadmap plus JSON array of prioritized steps
3. **calculate_factor_score_impact**
   - Input: `{ "domain": "<DOMAIN>" }`
   - Expect: Markdown summary and JSON array with `factor_name`, `current_score`, `improvement_potential`, `roi_score`
4. **get_issues_by_roi**
   - Input: `{ "domain": "<DOMAIN>", "top_n": 5 }`
   - Expect: Markdown summary and JSON array with `issue_type` and `roi_score`
5. **find_high_impact_findings_across_assets**
   - Input: `{ "issue_types": [] }` or rely on defaults
   - Expect: Markdown summary and JSON listing assets and counts
6. **get_findings_by_asset**
   - Input: `{ "domain": "<DOMAIN>", "asset_type": "domain" }`
   - Expect: Markdown grouping per asset plus JSON
7. **get_findings_by_category**
   - Input: `{ "domain": "<DOMAIN>" }`
   - Expect: Markdown per factor plus JSON
8. **generate_remediation_report**
   - Input: `{ "domain": "<DOMAIN>" }`
   - Expect: Markdown remediation plan plus JSON
9. **call_api_endpoint**
   - Input: `{ "endpoint": "/companies/<DOMAIN>", "method": "GET" }`
   - Expect: raw JSON from the API

`<DOMAIN>` should come from the `COMPANY_DOMAIN` environment variable or be provided explicitly.

## Reporting
Claude should return a markdown report containing:
- A table listing each test, status (pass/fail), and notes
- Any error messages encountered
- Overall summary at the end
