/**
 * Response-mode rendering for analysis tools.
 *
 * Pure functions: they take data already fetched by the tool handlers in
 * src/index.ts and render minimal/standard/detailed markdown. Keeping them
 * side-effect free lets tests exercise every mode with fixtures and no API
 * token.
 */

import type { FactorSummary, FindingEntry } from './get_findings_by_category.js';
import type { AssetInventory, AssetScore } from './asset_management.js';

export type ResponseMode = 'minimal' | 'standard' | 'detailed';
export type FocusFactor = 'dns_health' | 'application_security' | 'network_security' | 'endpoint_security' | 'all';

export interface RenderOptions {
  generatedAt?: Date;
}

const EMAIL_ISSUE_PATTERN = /spf|dmarc|dkim|mail|smtp/i;

function footer(options: RenderOptions = {}): string {
  const at = options.generatedAt ?? new Date();
  return `\n---\n*Generated: ${at.toISOString()}*`;
}

function focusFilter(factorBreakdown: FactorSummary[], focusFactor: FocusFactor): FactorSummary[] {
  if (focusFactor === 'all') return factorBreakdown;
  return factorBreakdown.filter(f => f.factor.toLowerCase() === focusFactor);
}

function sortByImpact(issues: FindingEntry[]): FindingEntry[] {
  return [...issues].sort((a, b) =>
    Math.abs(b.total_score_impact ?? 0) - Math.abs(a.total_score_impact ?? 0)
  );
}

function issueLine(issue: FindingEntry, withImpact: boolean): string {
  const impact = withImpact && typeof issue.total_score_impact === 'number' && issue.total_score_impact !== 0
    ? `, score impact ${issue.total_score_impact.toFixed(1)}`
    : '';
  return `- \`${issue.issue_type}\` — ${issue.count ?? 0} finding(s), ${issue.severity ?? 'unknown'} severity${impact}`;
}

const DRILLDOWN_HINT = '**Next step:** pass an issue-type ID above to `query_security_data` (`/companies/{domain}/issues/{issue_type}`) for the individual findings.';

export function renderIssueTypeAnalysis(
  domain: string,
  factorBreakdown: FactorSummary[],
  focusFactor: FocusFactor,
  mode: ResponseMode,
  options: RenderOptions = {}
): string {
  const focused = focusFilter(factorBreakdown, focusFactor);

  if (focused.length === 0) {
    const scope = focusFactor === 'all' ? '' : ` for factor \`${focusFactor}\``;
    return `No open issues found${scope} on ${domain}.`;
  }

  if (mode === 'minimal') {
    return focused.slice(0, 3).map(f => {
      const top = sortByImpact(f.issues)[0];
      const topNote = top?.issue_type ? ` (top: ${top.issue_type})` : '';
      return `${f.factor}: ${f.issue_count} issues, ${f.critical_count + f.high_count} critical/high${topNote}`;
    }).join('; ');
  }

  const perFactorLimit = mode === 'standard' ? 5 : Number.POSITIVE_INFINITY;
  let out = `# 🔍 Issue Type Analysis: ${domain}\n\n**Focus:** ${focusFactor}\n\n`;

  for (const factor of focused) {
    out += `## ${factor.factor}\n`;
    out += `${factor.issue_count} issue(s) — ${factor.critical_count} critical, ${factor.high_count} high\n\n`;
    const issues = sortByImpact(factor.issues).slice(0, perFactorLimit);
    out += issues.map(issue => issueLine(issue, mode === 'detailed')).join('\n');
    if (factor.issues.length > issues.length) {
      out += `\n- …and ${factor.issues.length - issues.length} more issue type(s) (use detailed mode)`;
    }
    out += '\n\n';
  }

  if (mode === 'detailed') {
    const totalImpact = focused
      .flatMap(f => f.issues)
      .reduce((sum, issue) => sum + (issue.total_score_impact ?? 0), 0);
    out += `**Total score impact (focused scope):** ${totalImpact.toFixed(1)}\n\n`;
  }

  out += DRILLDOWN_HINT;
  return out + footer(options);
}

function emailIssues(factorBreakdown: FactorSummary[]): FindingEntry[] {
  return factorBreakdown.flatMap(f => f.issues.filter(issue => EMAIL_ISSUE_PATTERN.test(issue.issue_type ?? '')));
}

function countByPattern(issues: FindingEntry[], pattern: RegExp): number {
  return issues
    .filter(issue => pattern.test(issue.issue_type ?? ''))
    .reduce((sum, issue) => sum + (issue.count ?? 0), 0);
}

export function renderEmailSecurityAnalysis(
  domain: string,
  factorBreakdown: FactorSummary[],
  mode: ResponseMode,
  options: RenderOptions = {}
): string {
  const issues = emailIssues(factorBreakdown);
  const spfCount = countByPattern(issues, /spf/i);
  const dmarcCount = countByPattern(issues, /dmarc/i);
  const totalCount = issues.reduce((sum, issue) => sum + (issue.count ?? 0), 0);

  if (mode === 'minimal') {
    return `SPF issues: ${spfCount}, DMARC issues: ${dmarcCount}, email findings total: ${totalCount}`;
  }

  if (issues.length === 0) {
    return `# 📧 Email Security Analysis: ${domain}\n\nNo email-related issues found (SPF/DMARC/DKIM/mail services all clear).` + footer(options);
  }

  let out = `# 📧 Email Security Analysis: ${domain}\n\n`;
  out += `**SPF issues:** ${spfCount} | **DMARC issues:** ${dmarcCount} | **Total email findings:** ${totalCount}\n\n`;
  out += `## Findings by issue type\n`;
  out += sortByImpact(issues)
    .map(issue => `${issueLine(issue, mode === 'detailed')} (factor: ${issue.factor})`)
    .join('\n');
  out += '\n\n';

  if (mode === 'detailed') {
    out += `## Recommendations\n`;
    if (spfCount > 0) out += `- Publish/repair SPF records for the affected domains; missing SPF enables spoofing of your sending domains.\n`;
    if (dmarcCount > 0) out += `- Deploy DMARC (start with \`p=none\` and monitoring, then tighten to \`quarantine\`/\`reject\`).\n`;
    if (countByPattern(issues, /dkim/i) > 0) out += `- Enable DKIM signing on all outbound mail paths.\n`;
    if (countByPattern(issues, /smtp|mail/i) > 0) out += `- Review exposed mail services: confirm they are intended, patched, and TLS-enforcing.\n`;
    out += '\n';
  }

  out += DRILLDOWN_HINT;
  return out + footer(options);
}

export type TargetGrade = 'A' | 'B' | 'C';
export type Timeline = '30-days' | '90-days' | '6-months';

// SecurityScorecard letter-grade floors (verified against platform reports:
// a score of 93 grades as A, so A starts at 90, not 80).
export const GRADE_THRESHOLDS: Record<TargetGrade, number> = { A: 90, B: 80, C: 70 };

/** Resolves an issue-type ID to a dispute/compensating-control playbook, if one covers it. */
export type PlaybookLookup = (issueType: string) => { slug: string; title?: string } | null;

export interface ImprovementPlanOptions extends RenderOptions {
  playbookLookup?: PlaybookLookup;
}

interface RankedIssue extends FindingEntry {
  route: string;
}

function rankIssuesByImpact(factorBreakdown: FactorSummary[], lookup?: PlaybookLookup): RankedIssue[] {
  return sortByImpact(factorBreakdown.flatMap(f => f.issues)).map(issue => {
    const playbook = lookup?.(issue.issue_type ?? '') ?? null;
    return {
      ...issue,
      route: playbook
        ? `dispute/compensating-control (playbook: \`${playbook.slug}\`)`
        : 'remediate'
    };
  });
}

const CURVED_SCORING_CAVEAT =
  '> ⚠️ SSC scoring is curved/normalised — summed impacts are directional approximations, not a guaranteed score change. Re-check the score after each remediation lands.';

export function renderImprovementPlan(
  domain: string,
  currentScore: number,
  targetGrade: TargetGrade,
  timeline: Timeline,
  factorBreakdown: FactorSummary[],
  mode: ResponseMode,
  options: ImprovementPlanOptions = {}
): string {
  const threshold = GRADE_THRESHOLDS[targetGrade];
  const gap = Math.max(0, threshold - currentScore);
  const ranked = rankIssuesByImpact(factorBreakdown, options.playbookLookup);

  if (mode === 'minimal') {
    const top = ranked.slice(0, 3)
      .map(issue => `${issue.issue_type} (${(issue.total_score_impact ?? 0).toFixed(1)})`)
      .join(', ');
    const gapNote = gap > 0
      ? `Gap to grade ${targetGrade} (${threshold}+): ${gap} point(s) from ${currentScore}.`
      : `Grade ${targetGrade} threshold (${threshold}+) already met at ${currentScore}.`;
    return `${gapNote} Top score impact: ${top || 'no open issues'}`;
  }

  let out = `# 🎯 Security Improvement Plan: ${domain}\n\n`;
  out += `**Current score:** ${currentScore}/100 | **Target:** grade ${targetGrade} (${threshold}+) | **Timeline:** ${timeline}\n`;
  out += gap > 0
    ? `**Gap:** ${gap} point(s)\n\n`
    : `**Gap:** none — target grade already met (focus below on protecting the score)\n\n`;

  if (ranked.length === 0) {
    out += 'No open issues found — nothing to remediate.\n';
    return out + footer(options);
  }

  const limit = mode === 'standard' ? 8 : Number.POSITIVE_INFINITY;
  const shown = ranked.slice(0, limit);

  out += `## Issue types ranked by score impact\n`;
  out += shown
    .map(issue => `${issueLine(issue, true)} (factor: ${issue.factor}) — route: ${issue.route}`)
    .join('\n');
  if (ranked.length > shown.length) {
    out += `\n- …and ${ranked.length - shown.length} more issue type(s) (use detailed mode)`;
  }
  out += '\n\n';

  const cumulative = shown.reduce((sum, issue) => sum + (issue.total_score_impact ?? 0), 0);
  out += `**Cumulative recoverable impact (top ${shown.length}):** ${Math.abs(cumulative).toFixed(1)} point(s)\n\n`;
  out += `${CURVED_SCORING_CAVEAT}\n\n`;

  if (mode === 'detailed') {
    const phaseSize = Math.max(1, Math.ceil(ranked.length / 3));
    const phases: Array<[string, RankedIssue[]]> = [
      ['Phase 1 — immediate (highest impact)', ranked.slice(0, phaseSize)],
      ['Phase 2 — near-term', ranked.slice(phaseSize, phaseSize * 2)],
      ['Phase 3 — ongoing hygiene', ranked.slice(phaseSize * 2)]
    ];
    out += `## Phased roadmap (${timeline})\n`;
    for (const [title, issues] of phases) {
      if (issues.length === 0) continue;
      out += `### ${title}\n`;
      out += issues.map(issue => `- \`${issue.issue_type}\` — ${issue.route}`).join('\n');
      out += '\n';
    }
    out += '\n';
  }

  out += DRILLDOWN_HINT;
  return out + footer(options);
}

function assetLine(asset: AssetScore, withRisk: boolean): string {
  if (!withRisk) return `- ${asset.asset_name}`;
  if (typeof asset.score_impact === 'number') {
    const impact = asset.score_impact !== 0 ? `score impact ${asset.score_impact.toFixed(1)}, ` : '';
    const status = asset.status ? ` [${asset.status}]` : '';
    return `- ${asset.asset_name} — ${impact}${asset.issue_types_count ?? 0} issue type(s), ${asset.issues_count} finding(s)${status}`;
  }
  return `- ${asset.asset_name} — score ${asset.score ?? 'n/a'}, ${asset.issues_count} issue(s) (${asset.critical_issues ?? 0} critical, ${asset.high_issues ?? 0} high)`;
}

function renderInventoryWarnings(inventory: AssetInventory): string {
  if (!inventory.warnings?.length) return '';
  return inventory.warnings.map(w => `⚠️ ${w}`).join('\n') + '\n\n';
}

export function renderAssetInventory(
  domain: string,
  inventory: AssetInventory,
  includeRiskDetails: boolean,
  mode: ResponseMode,
  options: RenderOptions = {}
): string {
  const domainCount = inventory.domains.length;
  const ipCount = inventory.ip_addresses.length;
  const totalAssets = domainCount + ipCount;
  const totalIssues = inventory.domains.reduce((sum, d) => sum + d.issues_count, 0)
    + inventory.ip_addresses.reduce((sum, ip) => sum + ip.issues_count, 0);

  if (mode === 'minimal') {
    return `${totalAssets} assets: ${domainCount} domains, ${ipCount} IPs (${totalIssues} issues)${totalAssets > 50 ? ' ⚠️ Possible incomplete data' : ''}`;
  }

  let out = `# 🔍 Asset Inventory: ${domain}\n\n`;
  out += `**Domains:** ${domainCount} | **IP addresses:** ${ipCount} | **Total issues:** ${totalIssues}\n`;
  if (includeRiskDetails) {
    if (typeof inventory.summary.total_score_impact === 'number') {
      out += `**Total score impact across assets:** ${inventory.summary.total_score_impact.toFixed(1)}\n`;
    }
    if (typeof inventory.summary.avg_score === 'number') {
      out += `**Average asset score:** ${inventory.summary.avg_score}\n`;
    }
  }
  out += '\n';
  out += renderInventoryWarnings(inventory);

  if (includeRiskDetails) {
    const worst = inventory.summary.worst_performers[0];
    const best = inventory.summary.best_performers[0];
    const riskNote = (a: AssetScore) => typeof a.score_impact === 'number'
      ? `score impact ${a.score_impact.toFixed(1)}, ${a.issues_count} finding(s)`
      : `score ${a.score ?? 'n/a'}, ${a.critical_issues ?? 0} critical`;
    if (worst) out += `**Worst performer:** ${worst.asset_name} (${riskNote(worst)})\n`;
    if (best) out += `**Best performer:** ${best.asset_name} (${riskNote(best)})\n`;
    out += '\n';
  }

  if (mode === 'detailed') {
    out += `## Domains (${domainCount})\n`;
    out += inventory.domains.map(a => assetLine(a, includeRiskDetails)).join('\n') || '- none found';
    out += `\n\n## IP addresses (${ipCount})\n`;
    out += inventory.ip_addresses.map(a => assetLine(a, includeRiskDetails)).join('\n') || '- none found';
    out += '\n\n';
    out += '**Cross-check:** run `validate_data_completeness` with an expected asset count to verify this inventory is complete.\n';
  }

  return out + footer(options);
}

export function renderDataCompletenessReport(
  domain: string,
  inventory: AssetInventory,
  expectedAssetCount: number | undefined,
  mode: ResponseMode,
  options: RenderOptions = {}
): string {
  const domainCount = inventory.domains.length;
  const ipCount = inventory.ip_addresses.length;
  const totalAssets = domainCount + ipCount;

  let confidence: number;
  let rationale: string;
  if (typeof expectedAssetCount === 'number' && expectedAssetCount > 0) {
    const coverage = Math.min(1, totalAssets / expectedAssetCount);
    confidence = Math.round(coverage * 100);
    rationale = `found ${totalAssets} of ${expectedAssetCount} expected assets`;
  } else {
    confidence = totalAssets > 50 ? 85 : 95;
    rationale = 'no expected count supplied; heuristic based on inventory size';
  }
  const complete = confidence >= 80;
  const status = complete ? '✅ Data Complete' : '⚠️ Incomplete';

  if (mode === 'minimal') {
    return `${status} (${confidence}% confidence) - ${totalAssets} assets found`;
  }

  let out = `# ✅ Data Validation: ${domain}\n\n`;
  out += `**Status:** ${complete ? 'Complete' : 'Incomplete — coverage below expectation'}\n`;
  out += `**Confidence:** ${confidence}% (${rationale})\n\n`;
  out += `## Asset breakdown\n`;
  out += `- Domains: ${domainCount}\n`;
  out += `- IP addresses: ${ipCount}\n`;
  out += `- Total: ${totalAssets}`;
  if (typeof expectedAssetCount === 'number') {
    const delta = totalAssets - expectedAssetCount;
    out += ` (expected ${expectedAssetCount}, delta ${delta >= 0 ? '+' : ''}${delta})`;
    if (delta < 0) {
      out += `\n\n⚠️ Inventory is ${-delta} asset(s) below the expected count — a mismatch this size usually means footprint discovery is still indexing or the expectation includes assets SecurityScorecard does not attribute to ${domain}.`;
    }
  }
  out += '\n\n';

  if (mode === 'detailed') {
    out += `## Audit checks\n`;
    out += `- Domain discovery returned data: ${domainCount > 0 ? 'yes' : 'NO — verify footprint endpoints'}\n`;
    out += `- IP discovery returned data: ${ipCount > 0 ? 'yes' : 'NO — verify footprint endpoints'}\n`;
    if (typeof inventory.summary.avg_score === 'number') {
      out += `- Average asset score: ${inventory.summary.avg_score}\n`;
    }
    if (typeof inventory.summary.total_score_impact === 'number') {
      out += `- Total score impact across assets: ${inventory.summary.total_score_impact.toFixed(1)}\n`;
    }
    out += `- Total issues across assets: ${inventory.summary.total_issues}\n`;
    for (const warning of inventory.warnings ?? []) {
      out += `- ⚠️ ${warning}\n`;
    }
    const worst = inventory.summary.worst_performers[0];
    if (worst) {
      const note = typeof worst.score_impact === 'number'
        ? `score impact ${worst.score_impact.toFixed(1)}, ${worst.issues_count} finding(s)`
        : `score ${worst.score ?? 'n/a'}, ${worst.critical_issues ?? 0} critical`;
      out += `- Worst performer: ${worst.asset_name} (${note})\n`;
    }
    const best = inventory.summary.best_performers[0];
    if (best) {
      out += `- Best performer: ${best.asset_name} (score ${best.score ?? 'n/a'})\n`;
    }
    out += '\n**Cross-check:** compare these totals against \`discover_assets\` and factor-level counts from \`analyze_issue_types\`; investigate if they diverge.\n';
  }

  return out + footer(options);
}
