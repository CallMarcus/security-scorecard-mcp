import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidDomain,
  isValidIP,
  getFactorForIssueType,
  extractIssueTypesFromFactors,
  processIssuesIntoFindings,
  getRemediationEffort,
  getBusinessImpact,
  calculatePriorityScore,
  generateComparisonRecommendations,
  findCommonIssues,
  compareAssets,
} from '../build/asset_management.js';

// Offline unit tests for the pure business logic in asset_management.ts plus
// compareAssets (which takes makeRequest as an injected dependency, so it is
// exercised end-to-end with a stub and never touches the network).

test('isValidDomain accepts hostnames and rejects malformed input', () => {
  assert.equal(isValidDomain('example.com'), true);
  assert.equal(isValidDomain('sub.domain.example.co.uk'), true);
  assert.equal(isValidDomain(''), false);
  assert.equal(isValidDomain('has space.com'), false);
  assert.equal(isValidDomain('-leading-hyphen.com'), false);
});

test('isValidIP accepts valid IPv4 and rejects everything else', () => {
  assert.equal(isValidIP('192.168.1.1'), true);
  assert.equal(isValidIP('255.255.255.255'), true);
  assert.equal(isValidIP('256.1.1.1'), false);
  assert.equal(isValidIP('1.2.3'), false);
  assert.equal(isValidIP('not-an-ip'), false);
  assert.equal(isValidIP(''), false);
});

test('getFactorForIssueType maps issue keywords to SecurityScorecard factors', () => {
  assert.equal(getFactorForIssueType('patching_cadence_high'), 'patching_cadence');
  assert.equal(getFactorForIssueType('service_vuln_open'), 'patching_cadence');
  assert.equal(getFactorForIssueType('spf_misconfigured'), 'dns_health');
  assert.equal(getFactorForIssueType('dmarc_missing'), 'dns_health');
  assert.equal(getFactorForIssueType('tls_weak_protocol'), 'network_security');
  assert.equal(getFactorForIssueType('ssl_cert_expired'), 'network_security');
  assert.equal(getFactorForIssueType('csp_missing'), 'application_security');
  assert.equal(getFactorForIssueType('hsts_missing'), 'application_security');
  assert.equal(getFactorForIssueType('leaked_credentials'), 'cubit_score');
  assert.equal(getFactorForIssueType('something_unmapped'), 'endpoint_security');
});

test('getRemediationEffort recognizes quick wins and high-effort patching', () => {
  assert.equal(getRemediationEffort('spf_misconfigured'), 'low');
  assert.equal(getRemediationEffort('hsts_missing'), 'low');
  // v3_critical is checked before the generic "patching" branch
  assert.equal(getRemediationEffort('patching_cadence_v3_critical'), 'high');
  assert.equal(getRemediationEffort('patching_cadence_medium'), 'medium');
  assert.equal(getRemediationEffort('unmapped_issue'), 'medium');
});

test('getBusinessImpact returns severity copy and a fallback for unknowns', () => {
  assert.equal(getBusinessImpact('any', 'critical'), 'High risk of immediate security breach');
  assert.equal(getBusinessImpact('any', 'low'), 'Low security risk');
  assert.equal(getBusinessImpact('any', 'made-up'), 'Unknown risk level');
});

test('calculatePriorityScore multiplies severity x count x effort', () => {
  assert.equal(calculatePriorityScore({ severity: 'critical', count: 2, remediation_effort: 'low' }), 30);
  assert.equal(calculatePriorityScore({ severity: 'high', count: 3, remediation_effort: 'high' }), 12);
  // unknown severity/effort fall back to 1
  assert.equal(calculatePriorityScore({ severity: 'mystery', count: 4, remediation_effort: 'mystery' }), 4);
});

test('extractIssueTypesFromFactors collects unique issue types', () => {
  const factors = {
    entries: [
      { issue_summary: [{ type: 'a' }, { type: 'b' }] },
      { issue_summary: [{ type: 'a' }, { type: 'c' }] },
    ],
  };
  assert.deepEqual(extractIssueTypesFromFactors(factors), ['a', 'b', 'c']);
  assert.deepEqual(extractIssueTypesFromFactors({}), []);
  assert.deepEqual(extractIssueTypesFromFactors({ entries: [{}] }), []);
});

test('processIssuesIntoFindings builds a finding from issue entries', () => {
  const findings = {};
  processIssuesIntoFindings(
    [{ severity: 'high' }, { severity: 'low' }],
    findings,
    'tls_weak_protocol'
  );
  assert.equal(findings['tls_weak_protocol'].count, 2);
  assert.equal(findings['tls_weak_protocol'].severity, 'high'); // first severity wins
  assert.equal(findings['tls_weak_protocol'].factor, 'network_security');
  assert.equal(findings['tls_weak_protocol'].remediation_effort, 'medium');
  assert.equal(findings['tls_weak_protocol'].business_impact, 'Significant security vulnerability');
});

test('processIssuesIntoFindings is a no-op for empty input', () => {
  const findings = {};
  processIssuesIntoFindings([], findings, 'tls_weak_protocol');
  assert.deepEqual(findings, {});
});

test('findCommonIssues returns issues shared by at least half the assets', () => {
  const comparisons = [
    { top_issue_types: ['a', 'b'] },
    { top_issue_types: ['a', 'c'] },
    { top_issue_types: ['a', 'd'] },
  ];
  // n=3 -> threshold ceil(1.5)=2; only 'a' appears in >=2 assets
  assert.deepEqual(findCommonIssues(comparisons), ['a']);
});

test('generateComparisonRecommendations flags the riskiest asset and shared issues', () => {
  const comparisons = [
    { asset_name: 'risky.com', security_risk_score: 100, top_issue_types: ['x', 'y'] },
    { asset_name: 'safe.com', security_risk_score: 10, top_issue_types: ['x', 'z'] },
  ];
  const recs = generateComparisonRecommendations(comparisons);
  assert.ok(recs.some(r => r.includes('risky.com')), 'should call out the riskiest asset');
  assert.ok(recs.some(r => r.startsWith('Common issues')), 'should mention shared issues');
});

test('generateComparisonRecommendations returns nothing for a single asset', () => {
  const recs = generateComparisonRecommendations([
    { asset_name: 'only.com', security_risk_score: 50, top_issue_types: ['x'] },
  ]);
  assert.deepEqual(recs, []);
});

test('compareAssets ranks assets by weighted risk using injected makeRequest', async () => {
  const factorsByAsset = {
    'high.com': {
      entries: [{
        name: 'network_security',
        issue_summary: [
          { type: 'tls_weak', severity: 'critical', count: 2 },
          { type: 'spf', severity: 'high', count: 1 },
        ],
      }],
    },
    'low.com': {
      entries: [{
        name: 'application_security',
        issue_summary: [{ type: 'cookie', severity: 'medium', count: 1 }],
      }],
    },
  };

  const calls = [];
  const makeRequest = async (endpoint) => {
    calls.push(endpoint);
    const m = endpoint.match(/^\/footprint\/([^/]+)\/factors$/);
    if (m && factorsByAsset[m[1]]) return factorsByAsset[m[1]];
    throw new Error('404 Not Found');
  };

  const result = await compareAssets(makeRequest, ['low.com', 'high.com']);

  // Sorted by security_risk_score descending: high.com (2*5 + 1*3 = 13) first
  assert.equal(result.comparison[0].asset_name, 'high.com');
  assert.equal(result.comparison[0].critical_issues, 2);
  assert.equal(result.comparison[0].high_issues, 1);
  assert.equal(result.comparison[0].total_issues, 3);
  assert.equal(result.comparison[0].security_risk_score, 13);
  assert.deepEqual(result.comparison[0].top_issue_types, ['tls_weak', 'spf']);

  assert.equal(result.comparison[1].asset_name, 'low.com');
  assert.equal(result.comparison[1].security_risk_score, 1);

  assert.ok(Array.isArray(result.recommendations));
  assert.ok(result.recommendations.some(r => r.includes('high.com')));
  // No network endpoints beyond the footprint factors lookups
  assert.ok(calls.every(c => c.includes('/factors')));
});

test('compareAssets degrades gracefully when lookups fail', async () => {
  const makeRequest = async () => { throw new Error('500 Server Error'); };
  const result = await compareAssets(makeRequest, ['broken.com']);

  assert.equal(result.comparison.length, 1);
  assert.equal(result.comparison[0].asset_name, 'broken.com');
  assert.equal(result.comparison[0].total_issues, 0);
  assert.equal(result.comparison[0].security_risk_score, 0);
});
