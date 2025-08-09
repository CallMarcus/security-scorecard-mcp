# Security Scorecard MCP Implementation Tasks

## Project Context
**GitHub Repository**: https://github.com/CallMarcus/security-scorecard-mcp.git  
**Main Implementation File**: `/src/index.ts` (TypeScript source)  
**Built File**: `/build/index.js` (Compiled JavaScript)  
**Strategy Documents**: 
- [OPERATIONAL-REFOCUS-STRATEGY.md](./OPERATIONAL-REFOCUS-STRATEGY.md) - Vision and approach
- [OPERATIONAL-TOOLS-SPEC.md](./OPERATIONAL-TOOLS-SPEC.md) - Detailed specifications
- [CURRENT-TOOL-STATUS.md](./CURRENT-TOOL-STATUS.md) - Tool status report
- [ROADMAP.md](./ROADMAP.md) - Development timeline
**Objective**: Transform MCP from executive reporting to operational security team support with daily remediation workflows.

## Getting Started

```bash
# Clone the repository
git clone https://github.com/CallMarcus/security-scorecard-mcp.git
cd security-scorecard-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# The main source code to modify is in /src/index.ts
# After modifications, rebuild with: npm run build
```

## Current Status
- **Tool Functionality**: 33% (4/12 tools working)
- **Working**: Strategic planning tools
- **Broken**: Operational data processing tools
- **Missing**: Quick wins and simulation tools

## Phase 1: Critical Fixes (Week 1)

### Task 1: Fix get_issues_by_roi 🔴 CRITICAL
**File**: `/src/index.ts`  
**Priority**: HIGHEST  
**Effort**: 4-6 hours

#### Problem
Returns "0 issues" despite 1000+ findings available in API

#### Solution
```typescript
// Add comprehensive logging
console.log('[getIssuesByROI] Raw data:', JSON.stringify(issuesData));

// Fix data extraction
const issues = Array.isArray(issuesData?.entries) ? issuesData.entries : [];

// Fix ROI calculation
const calculateROI = (issue) => {
  const impact = this.estimateImpact(issue) || 0;
  const effort = this.estimateEffort(issue) || 1;
  return impact / effort;
};
```

### Task 2: Implement get_quick_wins 🔴 CRITICAL
**File**: `/src/index.ts`  
**Priority**: HIGHEST  
**Effort**: 6-8 hours

#### Implementation
```typescript
async getQuickWins(domain: string, maxEffort: string = 'medium') {
  const effortLevels = {
    'low': 2,
    'medium': 8,
    'high': 40
  };
  
  // Implementation per OPERATIONAL-TOOLS-SPEC.md
}
```

### Task 3: Fix generate_remediation_report
**File**: `/src/index.ts`  
**Priority**: HIGH  
**Effort**: 4-6 hours

#### Problem
Returns empty array despite rich finding data

#### Solution
- Fix finding aggregation logic
- Add proper error handling
- Format output for operational use

### Task 4: Fix category and asset filtering
**Files**: `/src/index.ts`, `/src/get_findings_by_category.ts`  
**Priority**: HIGH  
**Effort**: 4-6 hours

## Phase 2: Operational Enhancements (Week 2)

### Task 5: Add Fix Procedure Library
**File**: New file `/src/fix_procedures.ts`  
**Priority**: MEDIUM  
**Effort**: 8-10 hours

Create library of fix procedures for common issues:
- SPF record configuration
- DMARC policy updates
- TLS certificate renewal
- Patching procedures

### Task 6: Implement Effort Estimation
**File**: `/src/index.ts`  
**Priority**: MEDIUM  
**Effort**: 4-6 hours

Add effort estimation logic to all findings

### Task 7: Add Progress Tracking
**File**: New file `/src/progress_tracking.ts`  
**Priority**: MEDIUM  
**Effort**: 6-8 hours

## Phase 3: Integration (Weeks 3-4)

### Task 8: JIRA Export
**File**: New file `/src/integrations/jira.ts`  
**Priority**: MEDIUM  
**Effort**: 8-10 hours

### Task 9: ServiceNow Export
**File**: New file `/src/integrations/servicenow.ts`  
**Priority**: MEDIUM  
**Effort**: 8-10 hours

### Task 10: Automation Scripts
**File**: New file `/src/automation/index.ts`  
**Priority**: LOW  
**Effort**: 10-12 hours

## Testing Requirements

### Unit Tests
Update test files in `/tests/` directory:
- Fix broken test assertions
- Add tests for new functionality
- Ensure 100% coverage of critical paths

### Integration Tests
- Test with real SecurityScorecard data
- Validate all API endpoints
- Performance testing with 1000+ findings

### User Acceptance
- Deploy to operational team
- Gather feedback on workflows
- Iterate based on usage patterns

## Success Metrics

### Week 1
- [ ] 7/12 tools functional (58%)
- [ ] Quick wins tool deployed
- [ ] All data processing fixed

### Week 2
- [ ] Operational context added
- [ ] Fix procedures available
- [ ] Progress tracking live

### Week 4
- [ ] 12/12 tools functional (100%)
- [ ] ITSM integration complete
- [ ] 50% faster remediation

## Developer Notes

### Common Pitfalls
1. API returns data in `entries` array, not direct array
2. Some endpoints use `data` wrapper, others don't
3. Pagination uses `has_next` and `next_cursor`
4. Rate limiting: Max 100 requests per minute

### Debugging Tips
1. Add console.log for all API responses
2. Check data structure before processing
3. Validate all calculations return numbers
4. Test with domains having many findings

### Code Style
- Use TypeScript for new code
- Follow existing patterns in codebase
- Add JSDoc comments for new methods
- Keep functions under 50 lines

## Resources
- [SecurityScorecard API Docs](https://securityscorecard.readme.io/)
- [MCP SDK Documentation](https://modelcontextprotocol.io/)
- [Test Domain]: Use neste.com for testing (has 1000+ findings)

## Getting Help
- GitHub Issues: Report bugs and feature requests
- Slack Channel: #security-mcp-dev
- Email: security-mcp@company.com