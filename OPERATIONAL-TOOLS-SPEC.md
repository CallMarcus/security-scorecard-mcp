# Operational Tools Implementation Specification

## Priority 1: Fix Broken Core Tools

### 1. get_issues_by_roi - Operational Worklist Generator

**Current Problem**: Returns "0 issues" despite 1000+ findings available

**Root Cause Analysis**:
```typescript
// Current broken logic
const rankedIssues = issuesWithImpact
  .filter(issue => issue.roi > 0)  // Likely failing here
  .sort((a, b) => b.roi - a.roi)   // Or here
  .slice(0, topN);
```

**Fixed Implementation**:
```typescript
async getIssuesByROI(domain: string, topN: number = 10, options?: {
  status?: 'active' | 'resolved',
  max_effort?: 'low' | 'medium' | 'high',
  team?: string,
  asset_filter?: string[]
}): Promise<OperationalWorklist> {
  // Get issues with proper error handling
  const issues = await this.getActiveIssuesWithContext(domain);
  
  // Calculate operational ROI (not just score impact)
  const operationalIssues = issues.map(issue => ({
    ...issue,
    operational_roi: this.calculateOperationalROI(issue),
    fix_procedure: this.getFixProcedure(issue.type),
    effort_hours: this.estimateEffortHours(issue),
    required_skills: this.identifyRequiredSkills(issue),
    dependencies: this.checkDependencies(issue),
    business_impact: this.assessBusinessImpact(issue)
  }));
  
  // Smart filtering for operational context
  const filtered = this.applyOperationalFilters(operationalIssues, options);
  
  // Return actionable worklist
  return {
    worklist: filtered.slice(0, topN),
    total_effort_hours: this.sumEffort(filtered),
    skills_needed: this.aggregateSkills(filtered),
    quick_wins: filtered.filter(i => i.effort_hours <= 4),
    blocked_items: filtered.filter(i => i.dependencies.length > 0)
  };
}
```

### 2. get_quick_wins - Daily Task List Generator

**Implementation Specification**:
```typescript
async getQuickWins(domain: string, options?: {
  max_effort: 'low' | 'medium' | 'high',
  timeframe: '1_day' | '1_week' | '1_month',
  team?: string,
  include_scripts?: boolean
}): Promise<QuickWinsList> {
  const quickWins = [];
  
  // Category 1: No-brainer fixes (< 1 hour)
  const noBrainers = await this.findNoBrainerFixes(domain);
  
  // Category 2: Config changes (< 4 hours)
  const configChanges = await this.findConfigurationFixes(domain);
  
  // Category 3: Policy updates (< 1 day)
  const policyUpdates = await this.findPolicyFixes(domain);
  
  // Enhanced output for operators
  return {
    immediate_actions: noBrainers.map(fix => ({
      title: fix.title,
      impact: `+${fix.score_impact} points`,
      effort: fix.effort_description,
      steps: this.generateStepByStep(fix),
      validation: this.generateValidation(fix),
      automation_available: fix.scriptable,
      script: options?.include_scripts ? this.generateScript(fix) : null
    })),
    
    daily_targets: this.optimizeDailyWorkload(quickWins),
    
    weekly_plan: this.generateWeeklyPlan(quickWins, options?.team),
    
    blockers: this.identifyBlockers(quickWins)
  };
}
```

### 3. generate_remediation_report - Work Order Generator

**Implementation Specification**:
```typescript
async generateRemediationReport(domain: string, options?: {
  format: 'markdown' | 'jira' | 'servicenow' | 'csv',
  grouping: 'by_team' | 'by_asset' | 'by_priority' | 'by_effort',
  include_automation?: boolean,
  change_control_required?: boolean
}): Promise<RemediationWorkOrders> {
  // Get comprehensive finding data
  const findings = await this.getAllFindings(domain);
  
  // Enrich with operational context
  const workOrders = findings.map(finding => ({
    // Ticket fields
    ticket: {
      title: this.generateTicketTitle(finding),
      description: this.generateTicketDescription(finding),
      priority: this.calculateOperationalPriority(finding),
      effort_estimate: this.estimateEffort(finding),
      assignee_team: this.suggestTeam(finding),
      labels: this.generateLabels(finding)
    },
    
    // Implementation details
    implementation: {
      prerequisites: this.checkPrerequisites(finding),
      step_by_step: this.generateProcedure(finding),
      validation_steps: this.generateValidation(finding),
      rollback_procedure: this.generateRollback(finding),
      automation_script: options?.include_automation ? 
        this.generateAutomation(finding) : null
    },
    
    // Change management
    change_control: options?.change_control_required ? {
      risk_assessment: this.assessRisk(finding),
      approval_required: this.checkApprovalNeeds(finding),
      maintenance_window: this.suggestMaintenanceWindow(finding),
      communication_plan: this.generateCommPlan(finding)
    } : null
  }));
  
  // Format for target system
  return this.formatForExport(workOrders, options?.format);
}
```

## Priority 2: New Operational Tools

### 4. get_operational_dashboard - Team Command Center

```typescript
async getOperationalDashboard(options?: {
  team?: string,
  timeframe?: string,
  view?: 'summary' | 'detailed'
}): Promise<OperationalDashboard> {
  return {
    // Current status
    current_state: {
      score: 66,
      grade: 'D',
      trending: 'improving',
      weekly_progress: '+2 points'
    },
    
    // Today's priorities
    todays_tasks: {
      critical: [], // Issues needing immediate attention
      scheduled: [], // Planned maintenance items
      quick_wins: [], // Can be done between other tasks
      blocked: [] // Waiting on dependencies
    },
    
    // Team metrics
    team_metrics: {
      findings_closed_this_week: 15,
      average_time_to_fix: '3.2 days',
      success_rate: '94%',
      top_contributors: []
    },
    
    // Actionable insights
    insights: [
      'DNS issues can be batch-fixed this weekend',
      'TLS certificate expiry in 14 days on 3 assets',
      'New CVE affects 7 servers - patch available'
    ]
  };
}
```

### 5. track_remediation_progress - Change Tracker

```typescript
async trackRemediationProgress(params: {
  finding_id: string,
  status: RemediationStatus,
  notes?: string,
  evidence?: Evidence
}): Promise<ProgressUpdate> {
  // Record progress
  const update = await this.recordProgress(params);
  
  // Check if this unblocks other work
  const unblocked = await this.checkUnblockedWork(params.finding_id);
  
  // Update team metrics
  await this.updateTeamMetrics(update);
  
  // Return comprehensive update
  return {
    finding: update,
    score_impact: this.projectScoreChange(update),
    unblocked_work: unblocked,
    next_steps: this.suggestNextSteps(update)
  };
}
```

### 6. export_findings_for_automation - DevOps Integration

```typescript
async exportFindingsForAutomation(params: {
  issue_types: string[],
  format: 'ansible' | 'terraform' | 'puppet' | 'bash',
  environment?: string
}): Promise<AutomationPackage> {
  const findings = await this.getAutomatableFindings(params.issue_types);
  
  return {
    playbooks: this.generatePlaybooks(findings, params.format),
    inventory: this.generateInventory(findings),
    variables: this.generateVariables(findings),
    pre_checks: this.generatePreChecks(findings),
    post_validation: this.generateValidation(findings),
    documentation: this.generateRunbook(findings)
  };
}
```

## Data Models for Operational Context

### Enhanced Finding Model
```typescript
interface OperationalFinding {
  // Original SecurityScorecard data
  id: string;
  type: string;
  severity: string;
  asset: string;
  
  // Operational enrichment
  owner_team?: string;
  fix_procedure?: FixProcedure;
  effort_estimate?: EffortEstimate;
  dependencies?: Dependency[];
  business_impact?: BusinessImpact;
  automation_available?: boolean;
  last_attempted?: Date;
  blocker_reason?: string;
}

interface FixProcedure {
  summary: string;
  prerequisites: string[];
  steps: Step[];
  validation: ValidationStep[];
  rollback?: RollbackProcedure;
  common_issues?: CommonIssue[];
}

interface EffortEstimate {
  hours: number;
  skill_level: 'junior' | 'mid' | 'senior';
  team_type: 'network' | 'application' | 'infrastructure' | 'security';
  complexity: 'low' | 'medium' | 'high';
}
```

### Fix Procedure Library

Common fix procedures for operational teams:

```typescript
const FIX_PROCEDURES = {
  'spf_record_missing': {
    summary: 'Add SPF record to DNS',
    prerequisites: ['DNS admin access', 'List of authorized mail servers'],
    steps: [
      'Log into DNS management console',
      'Navigate to domain zone file',
      'Add TXT record: "v=spf1 include:_spf.company.com ~all"',
      'Save and propagate changes'
    ],
    validation: ['dig TXT domain.com', 'Check SPF validator'],
    effort_hours: 0.5,
    automation: 'ansible-playbook dns-spf.yml'
  },
  
  'tlscert_expired': {
    summary: 'Renew TLS certificate',
    prerequisites: ['Certificate authority account', 'Server access'],
    steps: [
      'Generate new CSR if needed',
      'Submit renewal request to CA',
      'Download new certificate',
      'Install on web server',
      'Restart web service'
    ],
    validation: ['openssl s_client -connect domain:443', 'SSL Labs test'],
    effort_hours: 2,
    automation: 'certbot renew --domain'
  }
  // ... hundreds more procedures
};
```

## Integration Specifications

### JIRA Integration
```typescript
interface JiraExport {
  project: string;
  issue_type: 'Task' | 'Bug' | 'Security';
  fields: {
    summary: string;
    description: string;
    priority: 'Highest' | 'High' | 'Medium' | 'Low';
    labels: string[];
    custom_fields: {
      security_score_impact: number;
      remediation_effort: string;
      affected_assets: string[];
    };
  };
}
```

### ServiceNow Integration
```typescript
interface ServiceNowExport {
  table: 'incident' | 'change_request' | 'problem';
  fields: {
    short_description: string;
    description: string;
    urgency: 1 | 2 | 3;
    impact: 1 | 2 | 3;
    assignment_group: string;
    work_notes: string;
  };
}
```

## Success Metrics

Track operational effectiveness:

```typescript
interface OperationalMetrics {
  // Efficiency metrics
  findings_per_engineer_day: number;
  mean_time_to_remediation: number;
  first_attempt_success_rate: number;
  
  // Progress metrics
  score_improvement_rate: number;
  findings_closed_per_week: number;
  automation_usage_rate: number;
  
  // Quality metrics
  rollback_rate: number;
  reopen_rate: number;
  validation_pass_rate: number;
}
```

## Implementation Timeline

### Week 1: Core Fixes
- Fix get_issues_by_roi data extraction
- Implement get_quick_wins
- Fix generate_remediation_report

### Week 2: Operational Enhancement  
- Add fix procedure library
- Implement effort estimation
- Build team assignment logic

### Week 3: Integration Layer
- JIRA connector
- ServiceNow connector
- Automation export

### Week 4: Testing & Deployment
- Operational team pilot
- Performance optimization
- Documentation

This specification provides the blueprint for transforming the SecurityScorecard MCP from a strategic planning tool into an operational powerhouse that helps security teams systematically improve their security posture.