import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { getAssetInventory } from '../build/asset_management.js';

// Scripted client: handlers keyed by path substring. Records every call so
// tests can assert which endpoints were (not) hit.
function stubClient(handlers, { truncated = false } = {}) {
  const calls = [];
  return {
    calls,
    fetchAllPages: async (method, path, options) => {
      calls.push({ kind: 'fetchAllPages', method, path, options });
      for (const [needle, result] of Object.entries(handlers)) {
        if (path.includes(needle)) {
          if (result instanceof Error) throw result;
          return { entries: result, pages: 1, truncated };
        }
      }
      return { entries: [], pages: 1, truncated: false };
    },
    callEndpoint: async (method, path, body) => {
      calls.push({ kind: 'callEndpoint', method, path, body });
      return { data: { entries: [] } };
    },
    makeRequest: async (method, path, options) => {
      calls.push({ kind: 'makeRequest', method, path, options });
      return { data: { entries: [] } };
    }
  };
}

const DOMAIN_ENTRIES = [
  { domain: 'www.example.com', status: 'ATTRIBUTED', issues: 3, findings: 12, score_impact: -1.3 },
  { domain: 'mail.example.com', status: 'CLAIMED', issues: 1, findings: 2, score_impact: -0.2 },
  { domain: 'old.example.com', status: 'ATTRIBUTED', issues: 0, findings: 0, score_impact: 0 }
];

const IP_ENTRIES = [
  { ip: '203.0.113.10', status: 'ATTRIBUTED', issues: 2, findings: 5, score_impact: -0.8 }
];

describe('getAssetInventory (footprint-backed rewrite)', () => {
  test('maps per-asset issues, findings and score impact from the footprint response', async () => {
    const client = stubClient({ '/assets/domains': DOMAIN_ENTRIES, '/assets/ips': IP_ENTRIES });
    const inv = await getAssetInventory('example.com', 'token', client);

    assert.equal(inv.domains.length, 3);
    assert.equal(inv.ip_addresses.length, 1);
    const www = inv.domains.find(d => d.asset_name === 'www.example.com');
    assert.equal(www.issues_count, 12, 'issues_count should be the findings count');
    assert.equal(www.issue_types_count, 3);
    assert.equal(www.score_impact, -1.3);
    assert.equal(www.status, 'ATTRIBUTED');
    const ip = inv.ip_addresses[0];
    assert.equal(ip.asset_name, '203.0.113.10');
    assert.equal(ip.asset_type, 'ip_address');
    assert.equal(ip.score_impact, -0.8);
  });

  test('uses paginated fetch, not single-page GETs', async () => {
    const client = stubClient({ '/assets/domains': DOMAIN_ENTRIES, '/assets/ips': IP_ENTRIES });
    await getAssetInventory('example.com', 'token', client);
    const paged = client.calls.filter(c => c.kind === 'fetchAllPages');
    assert.equal(paged.length, 2, 'both asset lists should go through fetchAllPages');
    assert.ok(paged.every(c => c.options.style === 'page'));
  });

  test('makes no per-subdomain company/factor calls', async () => {
    const client = stubClient({ '/assets/domains': DOMAIN_ENTRIES, '/assets/ips': IP_ENTRIES });
    await getAssetInventory('example.com', 'token', client);
    const enrichment = client.calls.filter(c =>
      c.path?.includes('/factors') || /\/companies\/(www|mail|old)\./.test(c.path ?? '')
    );
    assert.equal(enrichment.length, 0, `per-subdomain enrichment calls made: ${JSON.stringify(enrichment.map(c => c.path))}`);
  });

  test('IP discovery failure is surfaced as a warning, not swallowed', async () => {
    const client = stubClient({
      '/assets/domains': DOMAIN_ENTRIES,
      '/assets/ips': new Error('403 Forbidden')
    });
    const inv = await getAssetInventory('example.com', 'token', client);
    assert.equal(inv.domains.length, 3, 'domain discovery should survive IP failure');
    assert.equal(inv.ip_addresses.length, 0);
    assert.ok(inv.warnings.some(w => /IP asset discovery failed/i.test(w)), `warnings: ${JSON.stringify(inv.warnings)}`);
    assert.ok(inv.warnings.some(w => /403/.test(w)), 'underlying error detail missing from warning');
  });

  test('truncated pagination is surfaced as a warning', async () => {
    const client = stubClient({ '/assets/domains': DOMAIN_ENTRIES, '/assets/ips': IP_ENTRIES }, { truncated: true });
    const inv = await getAssetInventory('example.com', 'token', client);
    assert.ok(inv.warnings.some(w => /truncat/i.test(w)), `warnings: ${JSON.stringify(inv.warnings)}`);
  });

  test('summary aggregates score impact and ranks performers by it', async () => {
    const client = stubClient({ '/assets/domains': DOMAIN_ENTRIES, '/assets/ips': IP_ENTRIES });
    const inv = await getAssetInventory('example.com', 'token', client);
    assert.equal(inv.summary.total_issues, 19, 'total findings across all assets');
    assert.ok(Math.abs(inv.summary.total_score_impact - -2.3) < 1e-9);
    assert.equal(inv.summary.worst_performers[0].asset_name, 'www.example.com', 'worst performer should have largest |score_impact|');
    assert.equal(inv.summary.best_performers[0].asset_name, 'old.example.com');
  });
});
