# SecurityScorecard MCP - Operational Quick Reference
## Common Security Team Tasks in Claude Desktop

### 🚀 Quick Start Commands

#### 📋 Asset Discovery
```
"Use discover_all_assets to find all assets for [domain]. Show me domains and IP addresses."
```

#### 🎯 Find Critical Issues
```
"Find all assets with critical security issues for [domain]. Prioritize by severity."
```

#### ⚡ Quick Security Wins
```
"Show me the top 10 quick wins for [domain] - high impact, low effort fixes."
```

#### 🔍 Specific Vulnerability Types
```
"Find all domains missing SPF records under [domain]."
"Find all TLS certificate issues for [domain] assets."
"Show me all assets with critical patching issues for [domain]."
```

#### 📊 Risk Comparison
```
"Compare security posture of [domain1], [domain2], [domain3]. Which needs immediate attention?"
```

---

## 🛠️ Tool-Specific Commands

### Enhanced Discovery Tools (NEW)

#### `discover_all_assets`
**Use Case**: Complete asset visibility overcoming 50-asset limit
```
"Use discover_all_assets for [domain]. I need to see all domains and IP addresses, not just the first 50."
```

#### `get_asset_detailed_findings`  
**Use Case**: Deep dive analysis of specific assets
```
"Use get_asset_detailed_findings for domain [specific-domain] under parent [domain]. Give me comprehensive analysis."
```

### Core Operational Tools

#### `get_issues_by_roi`
**Use Case**: Prioritize fixes by return on investment
```
"Get the top 15 ROI issues for [domain]. Show me quick wins vs major projects."
```

#### `get_findings_by_category`
**Use Case**: Understand issues by security factor
```
"Show me all findings by category for [domain]. Focus on email security and network security."
```

#### `generate_remediation_report`
**Use Case**: Create comprehensive fix plans
```
"Generate a remediation report for [domain]. I need ITSM-ready tasks with priorities."
```

#### `find_high_impact_findings_across_assets`
**Use Case**: Find organization-wide security patterns
```
"Find high-impact findings across all [domain] assets. Look for patching_cadence_v3_critical and TLS issues."
```

#### `get_asset_inventory`
**Use Case**: Asset management and scoring
```
"Get asset inventory for [domain]. Show me worst and best performing assets."
```

#### `compare_assets`
**Use Case**: Multi-asset risk assessment
```
"Compare these assets: [asset1], [asset2], [asset3]. Which poses the highest risk?"
```

#### `calculate_factor_score_impact`
**Use Case**: Understand which security factors matter most
```
"Calculate factor score impact for [domain]. Which factors give us the biggest score improvement?"
```

---

## 📋 Common Operational Workflows

### 1. Weekly Security Review
```
"Prepare a weekly security status for [domain]:
1. Use discover_all_assets to get complete inventory
2. Use get_issues_by_roi to find top priorities  
3. Use generate_remediation_report for action plans
4. Show me quick wins available this week"
```

### 2. Incident Response - Asset Assessment
```
"Security incident involving [specific-asset]. I need:
1. Detailed findings using get_asset_detailed_findings
2. All vulnerabilities and risk factors
3. Immediate remediation priorities
4. Related assets that might be affected"
```

### 3. Email Security Audit
```
"Email security audit for [domain]:
1. Find all domains missing SPF records
2. Find DMARC policy issues  
3. Find email-related vulnerabilities
4. Prioritize fixes by impact"
```

### 4. Certificate Management Review
```
"TLS/SSL certificate review for [domain]:
1. Find all certificate-related issues
2. Identify expiring certificates
3. Find weak cipher configurations
4. Create remediation timeline"
```

### 5. Vulnerability Management Planning
```
"Vulnerability management planning for [domain]:
1. Find all critical patching issues
2. Calculate ROI for different fix approaches
3. Identify quick wins vs major projects
4. Create 30/60/90 day remediation plan"
```

---

## 🎯 Advanced Query Patterns

### Multi-Step Analysis
```
"Do a comprehensive security analysis:
1. First, discover all assets for [domain]
2. Then, for any assets with >10 critical issues, get detailed findings
3. Finally, create a prioritized remediation plan"
```

### Comparative Analysis
```
"Compare our security posture:
1. Get current security score and grade for [domain]
2. Find what we need to achieve A grade  
3. Calculate effort and timeline for improvements
4. Show me ROI for different improvement paths"
```

### Asset Relationship Mapping
```
"Map asset relationships for [domain]:
1. Find all domains and their associated IP addresses
2. Identify shared IPs across domains
3. Find any IP addresses with critical issues
4. Show me which domains are affected by IP vulnerabilities"
```

---

## ⚡ Quick Commands for Common Issues

### Missing Email Security
```
"Find domains without SPF/DMARC protection under [domain]."
```

### Certificate Problems  
```
"Find all TLS certificate issues for [domain] - expired, weak, or misconfigured."
```

### Patch Management
```
"Show me all assets needing critical security patches for [domain]."
```

### Network Security
```
"Find network security issues for [domain] - open ports, weak protocols, firewall issues."
```

### Web Application Security
```
"Find web application vulnerabilities for [domain] - missing headers, XSS, CSRF protection."
```

---

## 🔧 Troubleshooting & Advanced Usage

### Enable Debug Mode
Set environment variable: `DEBUG_MODE=true` for detailed API logging

### Large Dataset Queries
```
"Use enhanced discovery for [large-org-domain]. Handle this carefully due to dataset size."
```

### Custom API Queries
```
"Use call_api_endpoint to query /companies/[domain]/factors and interpret the results for operational use."
```

### Rate Limit Management
The MCP automatically handles rate limiting with built-in throttling. For large queries, expect longer processing times.

---

## 📊 Expected Response Formats

### Asset Discovery Results
```
Total Assets Found: 150
Domains: 89
IP Addresses: 61
Worst Performers: domain1.com (45 critical), domain2.com (32 critical)
```

### Vulnerability Findings
```
Critical Issues: 15
- patching_cadence_v3_critical: 8 assets affected
- tls_configuration: 4 assets affected  
- spf_missing: 3 assets affected
```

### ROI Analysis
```
Top ROI Fixes:
1. SPF Record Implementation (Low effort, High impact)
2. HSTS Header Addition (Low effort, Medium impact)
3. Certificate Renewal (Medium effort, High impact)
```

---

## 🎯 Success Indicators

- **Asset Discovery**: Returns >50 assets when available, includes IP addresses
- **Issue Identification**: Finds specific vulnerability types accurately
- **Prioritization**: Provides clear ROI-based recommendations  
- **Actionability**: Gives specific remediation steps
- **Performance**: Handles large datasets efficiently

---

## 📞 Support & Documentation

- **Full Test Plan**: See `CLAUDE-DESKTOP-TEST-PLAN.md`
- **Implementation Details**: See `IMPLEMENTATION_TASKS.md`
- **Agent Documentation**: See `AGENTS.md`
- **API Reference**: See `TEST-OUTPUT-securityscorecard-mcp-enhancement.md`

This quick reference enables security teams to immediately start using the enhanced SecurityScorecard MCP for daily operational tasks.