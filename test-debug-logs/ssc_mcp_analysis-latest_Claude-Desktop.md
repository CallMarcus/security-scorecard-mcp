# SecurityScorecard MCP Tool Analysis & Fix Requirements

## Executive Summary

**Issue**: Multiple SecurityScorecard MCP wrapper functions return empty/invalid results despite the underlying API working correctly.

**Root Cause**: MCP wrapper functions use incorrect API endpoints or have faulty data processing logic.

**Impact**: 7 out of 11 tools are partially or completely broken, severely limiting security assessment capabilities.

## ✅ Working Tools

### 1. `call_api_endpoint` - **PERFECT**
- **Status**: Fully functional
- **Use Case**: Direct API access for any endpoint
- **Tested Endpoints**: 
  - `/companies/neste.com` ✅
  - `/companies/neste.com/factors` ✅
  - `/companies/neste.com/issues/{type}?domain={child}` ✅

### 2. `get_score_improvement_roadmap` - **PERFECT**
- **Status**: Fully functional
- **Output**: Strategic priorities with ROI ranking
- **Sample**: Network Security (ROI 2.2) > DNS Health (ROI 1.7) > Patching (ROI 0.7)

### 3. `calculate_factor_score_impact` - **PERFECT**
- **Status**: Fully functional
- **Output**: Detailed ROI analysis for all security factors
- **Value**: Shows which factors have highest score improvement potential

### 4. `get_findings_by_asset` - **INTERMITTENT**
- **Status**: Works for some domains, fails for others
- **Working**: microsoft.com (1,647 findings), neste.com (209 findings)
- **Issues**: Connection timeouts, inconsistent results

## ❌ Broken Tools

### 5. `get_asset_findings` - **COMPLETELY BROKEN**
- **Error**: `404 on /companies/{domain}/issues/active`
- **Root Cause**: Non-existent API endpoint
- **Fix Required**: Use `/companies/{domain}/factors` pattern instead

### 6. `get_findings_by_category` - **COMPLETELY BROKEN**
- **Error**: Returns empty arrays `[]`
- **Expected**: Issue counts grouped by security factor
- **Root Cause**: Incorrect endpoint or missing data processing

### 7. `generate_remediation_report` - **COMPLETELY BROKEN**
- **Error**: Returns empty arrays `[]`
- **Expected**: Comprehensive remediation recommendations
- **Root Cause**: Likely depends on broken `get_findings_by_category`

### 8. `get_issues_by_roi` - **COMPLETELY BROKEN**
- **Error**: Returns "0 highest ROI security improvements"
- **Expected**: Prioritized list of fixes by ROI
- **Root Cause**: Empty results despite known issues

### 9. `get_asset_inventory` - **DATA CORRUPTION**
- **Error**: Returns "undefined" for all domain names
- **Counts**: Correctly shows 50 domains, 0 IP addresses
- **Root Cause**: Field mapping/parsing issue in response processing

### 10. `compare_assets` - **RETURNS ZERO DATA**
- **Error**: Shows 0 issues for all assets
- **Expected**: Comparative security analysis
- **Root Cause**: Not accessing actual issue data

### 11. `find_high_impact_findings_across_assets` - **RETURNS ZERO DATA**
- **Error**: Shows 0 findings for specified issue types
- **Expected**: Cross-asset vulnerability analysis
- **Root Cause**: Not properly querying issue endpoints

## 🔍 API Patterns That Work

### Parent-Child Domain Pattern
```
✅ /companies/neste.com/issues/{issue_type}?domain=nesteoil.com
❌ /companies/nesteoil.com/issues/active
```

### Working Endpoints
```
✅ /companies/{domain}                    # Company info
✅ /companies/{domain}/factors            # Factor scores + issue counts
✅ /companies/{domain}/issues/{type}      # Specific issue details
✅ /companies/{domain}/issues/{type}?domain={child}  # Child asset issues
```

### Non-existent Endpoints
```
❌ /companies/{domain}/issues/active      # Used by get_asset_findings
❌ /companies/{domain}/issues/all        # Potential broken endpoint
```

## 📊 Real Data Examples

### Neste.com Actual Security Issues (from working API)
- **Overall Grade**: D (68/100)
- **Application Security**: C (74) - 98 insecure redirects, cookie issues
- **Network Security**: C (73) - 42 weak TLS protocols, certificate problems
- **Patching Cadence**: D (64) - 1,700+ vulnerability findings
- **DNS Health**: B (83) - 118 missing SPF records

### Child Asset Pattern (nesteoil.com)
- **Issue**: Insecure HTTPS redirect pattern
- **Evidence**: `http://www.nesteoil.com/ → https://www.neste.com/`
- **Context**: Used as HTTP hop in redirect chains from other domains

## 🛠️ Fix Requirements by Tool

### High Priority Fixes

#### 1. Fix `get_asset_findings`
```python
# BROKEN: Uses non-existent endpoint
url = f"/companies/{domain}/issues/active"

# FIX: Use factors endpoint instead
url = f"/companies/{domain}/factors"
# Process issue_summary field for each factor
```

#### 2. Fix `get_asset_inventory`
```python
# BROKEN: Domain names show as "undefined"
# FIX: Check field mapping in asset response processing
# Likely issue with accessing 'name' or 'domain' field in JSON response
```

#### 3. Fix `get_findings_by_category`
```python
# BROKEN: Returns empty arrays
# FIX: Use /companies/{domain}/factors endpoint
# Group issue_summary by factor name
```

### Medium Priority Fixes

#### 4. Fix `get_issues_by_roi`
```python
# BROKEN: No issues returned despite real issues existing
# FIX: Combine factors endpoint data with issue type endpoints
# Calculate ROI based on score_impact vs. typical fix effort
```

#### 5. Fix `generate_remediation_report`
```python
# BROKEN: Depends on fixed get_findings_by_category
# FIX: Use factor data to generate prioritized remediation steps
```

### Low Priority Fixes

#### 6. Fix `compare_assets`
```python
# BROKEN: Shows 0 issues for all assets
# FIX: Use factors endpoint for each asset to get real issue counts
```

#### 7. Fix `find_high_impact_findings_across_assets`
```python
# BROKEN: Returns 0 findings
# FIX: Query specific issue type endpoints across asset inventory
```

#### 8. Fix `get_findings_by_asset` reliability
```python
# INTERMITTENT: Works sometimes, connection timeouts other times
# FIX: Add retry logic, error handling, timeout configuration
```

## 📋 Implementation Strategy

### Phase 1: Critical API Fixes (Week 1)
1. **Fix `get_asset_findings`** - Switch to `/factors` endpoint
2. **Fix `get_asset_inventory`** - Fix domain name field mapping
3. **Test child domain querying** - Ensure `?domain=` parameter works

### Phase 2: Data Processing Fixes (Week 2)
1. **Fix `get_findings_by_category`** - Process factors data correctly
2. **Fix `get_issues_by_roi`** - Implement ROI calculation logic
3. **Add error handling** - Proper error messages for failed calls

### Phase 3: Advanced Features (Week 3)
1. **Fix `generate_remediation_report`** - Build comprehensive reports
2. **Fix comparison tools** - Enable multi-asset analysis
3. **Performance optimization** - Reduce API calls, add caching

## 🧪 Test Cases Required

### Unit Tests
```python
def test_get_asset_findings_neste():
    result = get_asset_findings("neste.com")
    assert "application_security" in result
    assert len(result["application_security"]["issues"]) > 0

def test_get_asset_inventory_neste():
    result = get_asset_inventory("neste.com")
    assert result["total_assets"] > 0
    assert "undefined" not in [asset["name"] for asset in result["assets"]]

def test_child_domain_query():
    result = get_asset_findings("nesteoil.com")
    assert result is not None
    assert "insecure_https_redirect_pattern_v2" in str(result)
```

### Integration Tests
```python
def test_full_security_assessment():
    # Test complete workflow
    inventory = get_asset_inventory("neste.com")
    findings = get_findings_by_category("neste.com")
    report = generate_remediation_report("neste.com")
    
    assert all(tool_works for tool_works in [inventory, findings, report])
```

## 📈 Success Metrics

### Before Fix
- 4/11 tools fully working (36%)
- 0 comprehensive security reports possible
- Manual API calls required for real data

### After Fix Target
- 11/11 tools fully working (100%)
- Complete automated security assessments
- Reliable multi-asset comparisons
- ROI-driven remediation prioritization

## 🔧 Development Notes

### Key Files to Modify
- `tools/get_asset_findings.py` - Switch to factors endpoint
- `tools/get_asset_inventory.py` - Fix field mapping issue
- `tools/get_findings_by_category.py` - Process factors correctly
- `utils/api_client.py` - Add error handling, retries

### API Authentication
- Current authentication works correctly
- No changes needed to auth mechanisms
- Focus on endpoint URLs and data processing

### Parent-Child Domain Logic
```python
def get_child_findings(parent_domain, child_domain, issue_type):
    endpoint = f"/companies/{parent_domain}/issues/{issue_type}?domain={child_domain}"
    return call_api(endpoint)
```

This approach is proven to work and should be used by all child asset functions.

---

**Next Steps**: Begin Phase 1 implementation focusing on the critical API endpoint fixes for `get_asset_findings` and `get_asset_inventory`.