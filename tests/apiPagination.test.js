import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { SecurityScorecardApiClient } from '../build/api/client.js';

// Replaces the network layer with a scripted handler so pagination logic can
// be exercised without a token. handler(callIndex, queryParams, path) -> data
function stubClient(handler) {
  const client = new SecurityScorecardApiClient({ apiToken: 'test-token' });
  const calls = [];
  client.makeRequest = async (method, path, options = {}) => {
    const call = { method, path, queryParams: options.queryParams ?? {} };
    calls.push(call);
    return { data: handler(calls.length - 1, call.queryParams, path), status: 200, headers: new Map() };
  };
  return { client, calls };
}

function entries(n, offset = 0) {
  return Array.from({ length: n }, (_, i) => ({ id: offset + i }));
}

describe('fetchAllPages — page style (footprint endpoints)', () => {
  test('follows page parameter until a short page', async () => {
    const { client, calls } = stubClient((i, qp) => {
      const page = Number(qp.page);
      if (page === 0) return { entries: entries(100, 0), size: 100 };
      if (page === 1) return { entries: entries(100, 100), size: 100 };
      return { entries: entries(20, 200), size: 20 };
    });
    const result = await client.fetchAllPages('GET', '/footprint/example.com/assets/domains', { style: 'page' });
    assert.equal(result.entries.length, 220);
    assert.equal(result.pages, 3);
    assert.equal(result.truncated, false);
    assert.equal(calls[0].queryParams['page-size'], 100);
    assert.equal(calls[2].queryParams.page, 2);
  });

  test('stops at maxPages and reports truncation', async () => {
    const { client } = stubClient(() => ({ entries: entries(100) }));
    const result = await client.fetchAllPages('GET', '/footprint/example.com/assets/domains', { style: 'page', maxPages: 2 });
    assert.equal(result.entries.length, 200);
    assert.equal(result.pages, 2);
    assert.equal(result.truncated, true);
  });

  test('empty first page returns cleanly', async () => {
    const { client, calls } = stubClient(() => ({ entries: [] }));
    const result = await client.fetchAllPages('GET', '/footprint/example.com/assets/ips', { style: 'page' });
    assert.equal(result.entries.length, 0);
    assert.equal(result.truncated, false);
    assert.equal(calls.length, 1);
  });

  test('merges caller query params into every page request', async () => {
    const { client, calls } = stubClient(() => ({ entries: entries(3) }));
    await client.fetchAllPages('GET', '/footprint/example.com/assets/domains', {
      style: 'page',
      queryParams: { sort: 'issues' }
    });
    assert.equal(calls[0].queryParams.sort, 'issues');
  });
});

describe('fetchAllPages — cursor style (issues endpoints)', () => {
  test('follows next_cursor until absent', async () => {
    const { client, calls } = stubClient((i) => {
      if (i === 0) return { entries: entries(50, 0), next_cursor: 'abc' };
      return { entries: entries(10, 50) };
    });
    const result = await client.fetchAllPages('GET', '/companies/example.com/issues/spf_record_missing', { style: 'cursor', pageSize: 50 });
    assert.equal(result.entries.length, 60);
    assert.equal(calls[0].queryParams.size, 50);
    assert.equal(calls[1].queryParams.cursor, 'abc');
    assert.equal(result.truncated, false);
  });

  test('follows a full next URL by re-requesting its path', async () => {
    const { client, calls } = stubClient((i) => {
      if (i === 0) return {
        entries: entries(50, 0),
        next: 'https://api.securityscorecard.io/companies/example.com/issues/spf_record_missing?cursor=zzz&size=50'
      };
      return { entries: entries(5, 50) };
    });
    const result = await client.fetchAllPages('GET', '/companies/example.com/issues/spf_record_missing', { style: 'cursor', pageSize: 50 });
    assert.equal(result.entries.length, 55);
    assert.ok(calls[1].path.includes('cursor=zzz'), `next URL not followed: ${calls[1].path}`);
  });

  test('stops when a page has no pagination marker even if full', async () => {
    const { client, calls } = stubClient(() => ({ entries: entries(50) }));
    const result = await client.fetchAllPages('GET', '/companies/example.com/issues/x', { style: 'cursor', pageSize: 50 });
    assert.equal(result.entries.length, 50);
    assert.equal(calls.length, 1);
  });

  test('cursor loop respects maxPages', async () => {
    const { client } = stubClient((i) => ({ entries: entries(50), next_cursor: `c${i}` }));
    const result = await client.fetchAllPages('GET', '/companies/example.com/issues/x', { style: 'cursor', pageSize: 50, maxPages: 3 });
    assert.equal(result.entries.length, 150);
    assert.equal(result.truncated, true);
  });
});

describe('getCompanyActiveIssues pagination', () => {
  test('aggregates all pages instead of returning the first', async () => {
    const { client } = stubClient((i) => {
      if (i === 0) return { entries: entries(50, 0), next_cursor: 'more' };
      return { entries: entries(30, 50) };
    });
    const response = await client.getCompanyActiveIssues('example.com');
    assert.equal(response.data.entries.length, 80);
  });
});

describe('paginationStyleFor', () => {
  test('footprint endpoints use page style, issues endpoints use cursor style', async () => {
    const { paginationStyleFor } = await import('../build/api/client.js');
    assert.equal(paginationStyleFor('/footprint/example.com/assets/domains'), 'page');
    assert.equal(paginationStyleFor('/companies/example.com/issues/spf_record_missing'), 'cursor');
  });
});
