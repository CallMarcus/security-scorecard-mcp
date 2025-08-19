# Claude Desktop Operational Test Plan
## SecurityScorecard MCP - Scorecard-Focused Operational Remediation

### 🎯 Purpose
This test plan validates the SecurityScorecard MCP's scorecard-focused operational capabilities for your own organization's security remediation workflows. The MCP has been architecturally transformed to use `/scorecard/{domain}/` endpoints instead of `/companies/{domain}/` to access your complete organizational asset inventory and operational remediation features.

### 🚨 CRITICAL CHANGES TESTED
- **Scorecard API Architecture**: Tests the new `/scorecard/{domain}/` endpoints for own organization analysis
- **Complete Asset Discovery**: Validates resolution of 100 vs 200+ domain under-reporting issue  
- **Operational Status Filtering**: Tests OPEN/UNDER_REVIEW/ALL issue status filtering
- **Own Organization Focus**: Confirms operational remediation capabilities vs. external monitoring

### 📋 Prerequisites
- Claude Desktop installed and configured
- SecurityScorecard MCP server running (13/13 tools registered)
- Valid SecurityScorecard API token configured
- Test domain with sufficient data (recommended: use your organization's domain)

---

## 🧪 Test Suite 1: Scorecard-Focused Asset Discovery
**Objective**: Validate complete organizational asset discovery using scorecard endpoints

### Test 1.1: Complete Organizational Asset Inventory
**Scenario**: Security team needs complete visibility of own organization's assets using scorecard APIs

**Test Steps**:
1. In Claude Desktop, ask: *"Use get_asset_inventory to find all assets for [your-domain]. With the new scorecard endpoints, I expect to see our complete asset portfolio, not the limited external view."*

**Expected Results**:
- ✅ **CRITICAL**: Returns 150-200+ assets (vs. previous 100-asset limit)
- ✅ Uses `/scorecard/{domain}/footprint/domains/current` endpoint priority
- ✅ Includes both domains and IP addresses from own organization monitoring
- ✅ Shows complete asset count breakdown with internal visibility
- ✅ Lists worst/best performers from own organization's scorecard

**Validation Criteria**:
```
CRITICAL TEST: Assets Found should be 150-200+ domains (not 100)
Domains: [number] significantly > previous 100-domain limit
IP Addresses: [number] > 0 (if org has IP monitoring)
API Evidence: Should see scorecard endpoints mentioned, not companies endpoints
```

### Test 1.2: Scorecard vs Companies Endpoint Comparison  
**Scenario**: Validate that scorecard endpoints provide complete organizational view vs. limited external view

**Test Steps**:
1. Ask: *"Use call_api_endpoint to test both `/scorecard/[domain]/footprint/domains/current` and `/companies/[domain]/assets`. Compare the results - scorecard should show our complete internal asset inventory."*

**Expected Results**:
- ✅ **CRITICAL**: Scorecard endpoint returns significantly more assets than companies endpoint
- ✅ Scorecard provides internal organizational view (200+ domains)
- ✅ Companies endpoint shows limited external monitoring view (~100 domains)  
- ✅ Clear architectural distinction demonstrated

---

## 🧪 Test Suite 2: IP Address Analysis
**Objective**: Find and analyze IP addresses with security issues

### Test 2.1: Find All IPs with Critical Issues
**Scenario**: Security team needs to identify IP addresses with critical vulnerabilities

**Test Steps**:
1. Ask: *"Find all IP addresses associated with [domain] that have critical security issues. I need the IP addresses, issue counts, and types of critical issues found."*
2. Follow up: *"For the IP with the most critical issues, give me detailed findings using get_asset_detailed_findings."*

**Expected Results**:
- ✅ Lists IP addresses with critical issue counts
- ✅ Shows specific critical issue types per IP
- ✅ Provides detailed analysis for highest-risk IP
- ✅ Includes remediation recommendations

**Validation Criteria**:
```
Format: IP addresses listed with critical issue counts
Detail: Specific issue types identified
Action: Remediation priorities provided
```

### Test 2.2: IP-to-Domain Mapping
**Scenario**: Understanding which domains resolve to which IPs for incident response

**Test Steps**:
1. Ask: *"Show me the relationship between domains and IP addresses for [domain]. Which IPs are associated with which domains?"*

**Expected Results**:
- ✅ Clear domain-to-IP mappings
- ✅ Identifies shared IPs across domains
- ✅ Shows IP addresses not directly associated with domains

---

## 🧪 Test Suite 3: Specific Vulnerability Hunting
**Objective**: Find specific security issues across the organization

### Test 3.1: Missing SPF Records with Status Filtering
**Scenario**: Operational remediation - find OPEN SPF issues ready for immediate action

**Test Steps**:
1. Ask: *"Use get_findings_by_category with status='OPEN' to find all OPEN SPF record issues for [domain]. This should use the new scorecard endpoints to show issues needing immediate remediation."*
2. Follow up: *"Now show me UNDER_REVIEW SPF issues - these should be issues already being worked on by the team."*

**Expected Results**:
- ✅ **NEW**: Separates OPEN issues (need action) from UNDER_REVIEW (being worked on)
- ✅ Uses `/scorecard/{domain}/issues/OPEN` endpoint with type filtering
- ✅ Shows significantly more SPF issues than previous 118+ domains discovered
- ✅ Provides operational status context for daily workflows

**Validation Criteria**:
```
CRITICAL: Should find 150-200+ domains with SPF issues (vs. previous 118)
Status Separation: OPEN vs UNDER_REVIEW clearly distinguished
API Evidence: Uses scorecard endpoints with status filtering
Operational Context: Ready-to-action vs in-progress issues identified
```

### Test 3.2: TLS/SSL Certificate Issues
**Scenario**: Certificate management - identify expiring or misconfigured certificates

**Test Steps**:
1. Ask: *"Find all TLS/SSL certificate issues across [domain] assets. Look for expired certificates, weak ciphers, or certificate configuration problems."*

**Expected Results**:
- ✅ Identifies certificate-related issues
- ✅ Shows expiration dates where applicable
- ✅ Lists affected domains/IPs
- ✅ Prioritizes by severity

### Test 3.3: Patch Management Issues
**Scenario**: Vulnerability management - find systems needing critical patches

**Test Steps**:
1. Ask: *"Find all assets with critical patching issues. I need to understand which systems need immediate patching attention."*

**Expected Results**:
- ✅ Lists assets with critical patch issues
- ✅ Shows specific vulnerability types
- ✅ Provides patching priority order
- ✅ Indicates quick wins vs. major projects

---

## 🧪 Test Suite 4: ROI-Based Prioritization
**Objective**: Operational decision-making based on effort vs. impact

### Test 4.1: Quick Security Wins
**Scenario**: Security team has limited time - what can be fixed quickly for maximum impact?

**Test Steps**:
1. Ask: *"Give me the top 10 quick security wins for [domain]. I need issues that are high impact but low effort to fix."*
2. Follow up: *"For each quick win, explain exactly what needs to be done to fix it."*

**Expected Results**:
- ✅ Lists high-impact, low-effort issues
- ✅ Provides specific implementation steps
- ✅ Shows expected score improvement
- ✅ Includes timeline estimates

### Test 4.2: ROI Analysis for Security Investments
**Scenario**: Security budget planning - justify security investments with data

**Test Steps**:
1. Ask: *"Calculate the ROI of fixing different types of security issues for [domain]. Which security factors give us the biggest score improvement for our effort?"*

**Expected Results**:
- ✅ Shows score impact per security factor
- ✅ Estimates effort levels (low/medium/high)
- ✅ Calculates ROI scores
- ✅ Provides investment recommendations

---

## 🧪 Test Suite 5: Asset Comparison & Risk Assessment
**Objective**: Compare security posture across multiple assets

### Test 5.1: Multi-Domain Risk Comparison
**Scenario**: Organization has multiple domains - which need immediate attention?

**Test Steps**:
1. Ask: *"Compare the security posture of these domains: [domain1], [domain2], [domain3]. Which one poses the highest risk and should be prioritized?"*

**Expected Results**:
- ✅ Side-by-side security comparison
- ✅ Risk scoring for each domain
- ✅ Identifies highest-risk domain
- ✅ Shows common issues across domains
- ✅ Provides prioritization recommendations

### Test 5.2: Asset Inventory Risk Profiling
**Scenario**: Understanding the overall risk profile of all organizational assets

**Test Steps**:
1. Ask: *"Give me a risk profile of all assets under [domain]. Categorize them by risk level and show me the distribution of security issues."*

**Expected Results**:
- ✅ Risk categorization (high/medium/low)
- ✅ Asset distribution across risk levels
- ✅ Common vulnerability patterns
- ✅ Risk mitigation priorities

---

## 🧪 Test Suite 6: Detailed Asset Analysis
**Objective**: Deep-dive analysis of specific assets

### Test 6.1: Comprehensive Asset Security Review
**Scenario**: Incident response - need complete security assessment of a specific asset

**Test Steps**:
1. Ask: *"Give me a comprehensive security analysis of [specific domain/IP]. Include all findings, remediation priorities, and risk factors."*
2. Follow up: *"What are the top 3 most critical issues for this asset and how do I fix them?"*

**Expected Results**:
- ✅ Complete security findings list
- ✅ Categorized by severity and factor
- ✅ Remediation effort estimates
- ✅ Priority ranking of fixes
- ✅ Specific implementation guidance

### Test 6.2: Historical Issue Tracking
**Scenario**: Understanding if security issues are being resolved over time

**Test Steps**:
1. Ask: *"Get the current findings for [domain] and analyze the improvement roadmap. What's our path to achieving an A grade?"*

**Expected Results**:
- ✅ Current security grade and score
- ✅ Specific improvements needed for target grade
- ✅ Effort estimates for each improvement
- ✅ Timeline for achieving target grade

---

## 🧪 Test Suite 7: Operational Remediation Workflows  
**Objective**: Test new scorecard-focused operational remediation capabilities

### Test 7.1: Daily Remediation Status Review
**Scenario**: Daily standup - security team needs to see OPEN vs UNDER_REVIEW issue status

**Test Steps**:
1. Ask: *"Give me a daily remediation dashboard for [domain]. Show me OPEN issues that need immediate attention and UNDER_REVIEW issues that are being worked on. Use the new status filtering capabilities."*

**Expected Results**:
- ✅ **NEW**: Clear separation of OPEN (actionable) vs UNDER_REVIEW (in progress) issues
- ✅ Uses scorecard endpoints with status filtering for operational context
- ✅ Shows significantly more issues than previous limited external view
- ✅ Provides ready-to-action prioritization for daily workflows

### Test 7.2: Team Assignment and Progress Tracking
**Scenario**: Security team lead needs to track remediation progress and assign work

**Test Steps**:
1. Ask: *"Show me all OPEN high-severity issues for [domain] that can be assigned to team members today. Then show me what's UNDER_REVIEW to track our progress."*

**Expected Results**:
- ✅ **NEW**: Operational status awareness for team management
- ✅ High-priority OPEN issues ready for assignment
- ✅ UNDER_REVIEW issues showing work in progress
- ✅ Complete organizational visibility for team coordination

### Test 7.3: Remediation Workflow State Transitions
**Scenario**: Understanding how issues move through operational states

**Test Steps**:
1. Ask: *"Use get_findings_by_category to show me ALL status issues for [domain], then help me understand the difference between OPEN, UNDER_REVIEW, and resolved issues for operational planning."*

**Expected Results**:
- ✅ **NEW**: Shows complete issue lifecycle states
- ✅ Demonstrates operational remediation workflow support
- ✅ Provides context for team planning and resource allocation

---

## 🧪 Test Suite 8: Operational Workflow Integration
**Objective**: Test real security team workflows with scorecard focus

### Test 8.1: Weekly Security Review with Scorecard Focus
**Scenario**: Weekly security team meeting - need comprehensive organizational status update

**Test Steps**:
1. Ask: *"Prepare a weekly security review for [domain] using our complete scorecard data. Include: OPEN critical issues, UNDER_REVIEW progress, quick wins available, and actions for this week using the new scorecard endpoints."*

**Expected Results**:
- ✅ **ENHANCED**: Executive summary using complete organizational data (200+ assets)
- ✅ **NEW**: OPEN vs UNDER_REVIEW status distinction for progress tracking
- ✅ Complete organizational view vs. previous limited external monitoring
- ✅ Operational workflow integration with status-aware recommendations

### Test 8.2: Incident Response with Complete Asset Visibility
**Scenario**: Security incident - need rapid assessment with complete organizational asset visibility

**Test Steps**:
1. Ask: *"We have a security incident involving [specific domain/IP]. Use the new scorecard endpoints to give me complete organizational intel: what vulnerabilities exist across our full asset portfolio, risk profile, and immediate remediation priorities."*

**Expected Results**:
- ✅ **ENHANCED**: Rapid assessment using complete 200+ asset inventory
- ✅ **NEW**: Full organizational context instead of limited external view
- ✅ OPEN issue prioritization for immediate incident response
- ✅ Complete vulnerability inventory for organizational impact assessment

---

## 🧪 Test Suite 9: Advanced Scorecard API Functionality
**Objective**: Test scorecard-focused API features and endpoint architecture

### Test 9.1: Scorecard vs Companies Endpoint Testing
**Scenario**: Validate architectural transformation - scorecard endpoints for own org vs companies for third-party

**Test Steps**:
1. Ask: *"Use call_api_endpoint to test `/scorecard/[domain]/factors` vs `/companies/[domain]/factors`. Compare the data - scorecard should show complete organizational factors while companies shows limited external view."*

**Expected Results**:
- ✅ **NEW**: Scorecard endpoints provide complete organizational factor data
- ✅ **NEW**: Companies endpoints provide limited third-party monitoring view
- ✅ Clear architectural distinction for operational vs external monitoring
- ✅ Enhanced data depth for own organization analysis

### Test 9.2: Large Organizational Dataset with Scorecard APIs
**Scenario**: Large organization - test complete asset portfolio handling with scorecard endpoints

**Test Steps**:
1. Ask: *"Use the scorecard endpoints to find all assets and issues for [large organization domain]. This should now handle our complete 200+ domain portfolio efficiently."*

**Expected Results**:
- ✅ **ENHANCED**: Handles 200+ organizational assets efficiently (vs. previous 100-asset limit)
- ✅ **NEW**: Uses scorecard endpoint pagination for complete data retrieval
- ✅ Performance acceptable for large organizational datasets
- ✅ Complete remediation data access for operational planning

---

## 📊 Success Criteria

### ✅ Tool Registration Validation
- All 13 tools respond correctly in Claude Desktop
- No tool registration errors  
- Proper parameter validation including new status filtering

### 🚨 CRITICAL: Scorecard Architecture Validation
- **Asset Discovery**: Finds 150-200+ domains (vs. previous 100-asset limit)
- **API Architecture**: Uses `/scorecard/{domain}/` endpoints for own organization
- **Status Filtering**: OPEN/UNDER_REVIEW/ALL operational status filtering works
- **Complete Visibility**: Accesses full organizational asset portfolio vs. limited external view

### ✅ Enhanced Organizational Discovery
- **CRITICAL**: Discovers complete organizational asset portfolio (200+ domains expected)
- Finds IP addresses using scorecard endpoint priority
- Demonstrates clear improvement over previous companies-based limitations
- Shows internal organizational visibility vs. external monitoring

### ✅ Operational Remediation Workflow Support  
- **NEW**: OPEN vs UNDER_REVIEW status separation for daily workflows
- **NEW**: Team assignment and progress tracking capabilities
- **ENHANCED**: Operational context for security team management
- Delivers results in operational timeframes with status awareness

### ✅ Data Quality & Accuracy with Complete Context
- **ENHANCED**: Returns accurate findings from complete organizational asset base
- **NEW**: Proper operational status categorization (OPEN/UNDER_REVIEW)
- **ENHANCED**: Priority assignments with full organizational context
- Significantly more comprehensive data than previous external monitoring approach

### ✅ Performance & Reliability at Organizational Scale
- **NEW**: Handles complete organizational datasets (200+ assets) efficiently  
- **ENHANCED**: Scorecard endpoint performance for large asset portfolios
- Graceful error handling with fallback to companies endpoints
- Consistent response times despite increased data volume

---

## 🚨 Known Issues & Limitations

### API Rate Limiting
- SecurityScorecard API has rate limits
- Large organizations may hit limits during comprehensive scans
- Built-in throttling should handle this gracefully

### Data Availability
- Some domains may have limited SecurityScorecard data
- IP address availability depends on SecurityScorecard's scanning coverage
- Historical data may be limited for newer domains

### Asset Discovery Scope
- Discovery limited to assets monitored by SecurityScorecard
- Internal/private assets may not be visible
- Asset-to-IP mappings depend on DNS resolution and scanning

---

## 📝 Test Execution Notes

### Test Environment Setup
1. Ensure Claude Desktop is connected to SecurityScorecard MCP
2. Verify API token has appropriate permissions
3. Use a domain with sufficient SecurityScorecard data
4. Document any errors or unexpected behaviors

### Test Data Requirements
- **Small Organization**: < 10 assets (basic functionality testing)
- **Medium Organization**: 10-50 assets (standard workflow testing)  
- **Large Organization**: > 50 assets (enhanced discovery testing)

### Documentation
- Record all test results
- Note any performance issues
- Document workarounds for limitations
- Capture screenshots of successful operations

---

## 🎯 Test Completion Checklist

- [ ] **Suite 1**: Scorecard-Focused Asset Discovery (2 tests) 🚨 CRITICAL
- [ ] **Suite 2**: IP Address Analysis (2 tests)  
- [ ] **Suite 3**: Specific Vulnerability Hunting with Status Filtering (3 tests) 🚨 CRITICAL
- [ ] **Suite 4**: ROI-Based Prioritization (2 tests)
- [ ] **Suite 5**: Asset Comparison & Risk Assessment (2 tests)
- [ ] **Suite 6**: Detailed Asset Analysis (2 tests)
- [ ] **Suite 7**: Operational Remediation Workflows (3 tests) 🚨 NEW
- [ ] **Suite 8**: Operational Workflow Integration (2 tests)
- [ ] **Suite 9**: Advanced Scorecard API Functionality (2 tests) 🚨 NEW

**Total**: 20 operational test scenarios covering scorecard-focused remediation capabilities

### 🚨 CRITICAL TESTS (Must Pass)
- **Suite 1.1**: Complete Organizational Asset Inventory (200+ domains expected)
- **Suite 1.2**: Scorecard vs Companies Endpoint Comparison  
- **Suite 3.1**: SPF Records with OPEN/UNDER_REVIEW Status Filtering
- **Suite 7.1-7.3**: Operational Remediation Workflow Tests

---

## 📈 Expected Outcomes

Upon successful completion of this test plan:

1. **🚨 CRITICAL VALIDATION**: Complete organizational asset discovery (150-200+ domains vs. previous 100-asset limit)
2. **🚨 ARCHITECTURAL CONFIRMATION**: Scorecard endpoints provide complete organizational view vs. limited external monitoring
3. **🚨 OPERATIONAL ENHANCEMENT**: OPEN/UNDER_REVIEW status filtering enables true remediation workflows
4. **ENHANCED CAPABILITY**: IP address discovery with complete organizational context  
5. **WORKFLOW INTEGRATION**: Operational security team workflows with status-aware prioritization
6. **PERFORMANCE VALIDATION**: Large organizational dataset handling (200+ assets)
7. **DOCUMENTATION**: Real-world usage patterns for operational remediation
8. **ISSUE RESOLUTION**: Confirmation that critical asset under-reporting issue is resolved

### 🎯 SUCCESS INDICATORS
- **Asset Discovery**: 2x+ improvement in discovered assets (100 → 200+ domains)
- **Operational Status**: Clear OPEN/UNDER_REVIEW separation for team workflows  
- **API Architecture**: Successful scorecard-first approach vs. companies fallback
- **Remediation Focus**: Own organization operational capabilities vs. external monitoring
- **Team Integration**: Ready-to-use workflows for daily security operations

This updated test plan validates the MCP's transformation from external company monitoring to **scorecard-focused operational remediation** for your own organization's security team workflows.