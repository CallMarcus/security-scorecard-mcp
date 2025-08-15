**SecurityScorecard MCP Tool Fix Task**

**Problem Summary**

get_asset_findings tool fails with 404 because it uses non-existent
endpoint /companies/{domain}/issues/active. SecurityScorecard API
doesn\'t provide aggregated issue endpoints.

**Correct API Patterns (Working)**

- **Company info**: /companies/neste.com

- **Factor overview**: /companies/neste.com/factors (has issue counts
  per factor)

- **Specific issue type**: /companies/neste.com/issues/{issue_type}

- **Child asset issues**:
  /companies/neste.com/issues/{issue_type}?domain=nesteoil.com

**Hierarchy Structure**

- neste.com = Parent (API access)

- nesteoil.com = Child asset (403 if queried directly)

- Must query child assets **through parent** using domain parameter

**Fix Required**

Rewrite get_asset_findings to:

1.  **For parent domain queries**: Use /companies/{domain}/factors to
    get issue summary, then optionally fetch specific issue types via
    /companies/{domain}/issues/{issue_type}

2.  **For child asset queries**: Use
    /companies/{parent_domain}/issues/{issue_type}?domain={child_domain}
    pattern

3.  **Remove dependency** on non-existent
    /companies/{domain}/issues/active endpoint

**Working Tools Reference**

- get_findings_by_asset works (likely uses /factors approach)

- call_api_endpoint works for direct API calls

- get_score_improvement_roadmap works (uses different endpoints)

**Test Cases**

- Parent: neste.com/factors ✅

- Child via parent:
  neste.com/issues/insecure_https_redirect_pattern_v2?domain=nesteoil.com
  ✅

- Direct child: nesteoil.com/issues/active ❌ (403/404)

**Goal**: Make get_asset_findings work like get_findings_by_asset by
using correct API structure.
