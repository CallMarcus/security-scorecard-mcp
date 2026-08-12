import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  renderIssueTypeAnalysis,
  renderEmailSecurityAnalysis,
  renderDataCompletenessReport
} from '../build/analysis_modes.js';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..');

const GENERATED_AT = new Date('2026-08-11T12:00:00Z');

// Mirrors the shape produced by getFindingsByCategory().factor_breakdown
const FACTOR_BREAKDOWN = [
  {
    factor: 'dns_health',
    issue_count: 12,
    critical_count: 2,
    high_count: 3,
    issues: [
      { factor: 'dns_health', severity: 'critical', issue_type: 'dmarc_record_missing', count: 2, total_score_impact: -3.4 },
      { factor: 'dns_health', severity: 'high', issue_type: 'spf_record_missing', count: 3, total_score_impact: -2.1 },
      { factor: 'dns_health', severity: 'medium', issue_type: 'open_resolver', count: 7, total_score_impact: -0.8 }
    ]
  },
  {
    factor: 'network_security',
    issue_count: 5,
    critical_count: 1,
    high_count: 1,
    issues: [
      { factor: 'network_security', severity: 'critical', issue_type: 'service_rdp', count: 1, total_score_impact: -4.0 },
      { factor: 'network_security', severity: 'high', issue_type: 'tlscert_expired', count: 1, total_score_impact: -1.2 },
      { factor: 'network_security', severity: 'low', issue_type: 'service_smtp', count: 3, total_score_impact: -0.1 }
    ]
  }
];

const INVENTORY = {
  parent_domain: 'example.com',
  total_assets: 4,
  domains: [
    { asset_name: 'www.example.com', asset_type: 'domain', score: 82, issues_count: 3, critical_issues: 0, high_issues: 1 },
    { asset_name: 'mail.example.com', asset_type: 'domain', score: 71, issues_count: 4, critical_issues: 1, high_issues: 1 }
  ],
  ip_addresses: [
    { asset_name: '203.0.113.10', asset_type: 'ip_address', score: 90, issues_count: 1, critical_issues: 0, high_issues: 0 },
    { asset_name: '203.0.113.11', asset_type: 'ip_address', score: 65, issues_count: 1, critical_issues: 1, high_issues: 0 }
  ],
  summary: {
    avg_score: 77,
    worst_performers: [{ asset_name: '203.0.113.11', asset_type: 'ip_address', score: 65, issues_count: 1, critical_issues: 1, high_issues: 0 }],
    best_performers: [{ asset_name: '203.0.113.10', asset_type: 'ip_address', score: 90, issues_count: 1, critical_issues: 0, high_issues: 0 }],
    total_issues: 9
  }
};

describe('renderIssueTypeAnalysis', () => {
  test('minimal mode respects focus_factor', () => {
    const out = renderIssueTypeAnalysis('example.com', FACTOR_BREAKDOWN, 'dns_health', 'minimal', { generatedAt: GENERATED_AT });
    assert.ok(out.includes('dns_health'), 'focused factor missing');
    assert.ok(!out.includes('network_security'), 'unfocused factor leaked into minimal output');
  });

  test('minimal mode surfaces issue-type IDs', () => {
    const out = renderIssueTypeAnalysis('example.com', FACTOR_BREAKDOWN, 'all', 'minimal', { generatedAt: GENERATED_AT });
    assert.ok(out.includes('dmarc_record_missing') || out.includes('service_rdp'),
      'minimal output surfaces no issue-type ID for the playbook chain');
  });

  test('standard mode lists issue types with counts, no placeholder', () => {
    const out = renderIssueTypeAnalysis('example.com', FACTOR_BREAKDOWN, 'all', 'standard', { generatedAt: GENERATED_AT });
    assert.ok(!out.includes('would be provided here'), 'placeholder text still present');
    for (const id of ['dmarc_record_missing', 'spf_record_missing', 'service_rdp']) {
      assert.ok(out.includes(id), `standard output missing issue type ${id}`);
    }
    assert.match(out, /dmarc_record_missing.*2/, 'count missing for dmarc_record_missing');
  });

  test('standard mode respects focus_factor', () => {
    const out = renderIssueTypeAnalysis('example.com', FACTOR_BREAKDOWN, 'network_security', 'standard', { generatedAt: GENERATED_AT });
    assert.ok(out.includes('service_rdp'));
    assert.ok(!out.includes('spf_record_missing'), 'unfocused factor issues leaked');
  });

  test('detailed mode includes score impact, playbook chaining hint, and footer', () => {
    const out = renderIssueTypeAnalysis('example.com', FACTOR_BREAKDOWN, 'all', 'detailed', { generatedAt: GENERATED_AT });
    assert.ok(!out.includes('would be provided here'));
    assert.ok(out.includes('-4') || out.includes('4.0'), 'score impact missing');
    assert.ok(out.includes('query_security_data'), 'drill-down chaining hint missing');
    assert.match(out, /\*Generated: .*2026/, 'metadata footer missing');
  });

  test('focus with no matching factor degrades gracefully', () => {
    const out = renderIssueTypeAnalysis('example.com', FACTOR_BREAKDOWN, 'endpoint_security', 'standard', { generatedAt: GENERATED_AT });
    assert.match(out, /no open issues/i);
    assert.ok(!out.includes('undefined'), 'undefined leaked into output');
  });
});

describe('renderEmailSecurityAnalysis', () => {
  test('minimal mode counts SPF and DMARC from issue types', () => {
    const out = renderEmailSecurityAnalysis('example.com', FACTOR_BREAKDOWN, 'minimal', { generatedAt: GENERATED_AT });
    assert.match(out, /SPF[^,]*3/, 'SPF count wrong (should come from spf_record_missing count)');
    assert.match(out, /DMARC[^,]*2/, 'DMARC count wrong (should come from dmarc_record_missing count)');
  });

  test('standard mode lists email issue types across factors, no placeholder', () => {
    const out = renderEmailSecurityAnalysis('example.com', FACTOR_BREAKDOWN, 'standard', { generatedAt: GENERATED_AT });
    assert.ok(!out.includes('would be provided here'));
    assert.ok(out.includes('spf_record_missing'));
    assert.ok(out.includes('dmarc_record_missing'));
    assert.ok(out.includes('service_smtp'), 'email-relevant issue outside dns_health factor missed');
    assert.ok(!out.includes('service_rdp'), 'non-email issue leaked into email analysis');
  });

  test('detailed mode includes severity, recommendations, and footer', () => {
    const out = renderEmailSecurityAnalysis('example.com', FACTOR_BREAKDOWN, 'detailed', { generatedAt: GENERATED_AT });
    assert.ok(!out.includes('would be provided here'));
    assert.match(out, /critical/i);
    assert.ok(out.includes('query_security_data'), 'drill-down chaining hint missing');
    assert.match(out, /\*Generated: .*2026/, 'metadata footer missing');
  });

  test('no email findings degrades gracefully', () => {
    const noEmail = [FACTOR_BREAKDOWN[1]].map(f => ({
      ...f,
      issues: f.issues.filter(i => i.issue_type !== 'service_smtp')
    }));
    const out = renderEmailSecurityAnalysis('example.com', noEmail, 'standard', { generatedAt: GENERATED_AT });
    assert.match(out, /no email-related issues/i);
  });
});

describe('renderDataCompletenessReport', () => {
  test('minimal mode keeps terse status format', () => {
    const out = renderDataCompletenessReport('example.com', INVENTORY, undefined, 'minimal', { generatedAt: GENERATED_AT });
    assert.match(out, /4 assets/);
    assert.match(out, /\d+% confidence/);
  });

  test('standard mode shows breakdown and flags expected-count mismatch', () => {
    const out = renderDataCompletenessReport('example.com', INVENTORY, 10, 'standard', { generatedAt: GENERATED_AT });
    assert.ok(!out.includes('would be provided here'));
    assert.match(out, /Domains[^\d]*2/, 'domain count missing');
    assert.match(out, /IP[^\d]*2/i, 'IP count missing');
    assert.match(out, /10/, 'expected count not shown');
    assert.match(out, /incomplete|mismatch|below/i, 'large shortfall not flagged');
  });

  test('standard mode reports complete when found matches expected', () => {
    const out = renderDataCompletenessReport('example.com', INVENTORY, 4, 'standard', { generatedAt: GENERATED_AT });
    assert.match(out, /complete/i);
    assert.ok(!/incomplete/i.test(out.replace(/may be incomplete/i, '')), 'false incomplete flag');
  });

  test('detailed mode includes audit checks and footer, no placeholder', () => {
    const out = renderDataCompletenessReport('example.com', INVENTORY, 10, 'detailed', { generatedAt: GENERATED_AT });
    assert.ok(!out.includes('would be provided here'));
    assert.match(out, /avg|average/i, 'summary stats missing');
    assert.match(out, /203\.0\.113\.11|worst/i, 'worst performer audit missing');
    assert.match(out, /\*Generated: .*2026/, 'metadata footer missing');
  });
});

describe('placeholder regression guard', () => {
  test('src/index.ts contains no placeholder response text', () => {
    const src = readFileSync(path.join(repoRoot, 'src/index.ts'), 'utf8');
    assert.ok(!src.includes('would be provided here'), 'placeholder stub text still in src/index.ts');
  });
});
