import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { SecurityScorecardApiClient, paginationStyleFor } from '../build/api/client.js';

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

// Live-verified footprint behaviour (2026-08-12, production scorecard): pages are
// 0-based, the server returns a FIXED 50 entries per page regardless of the
// page-size parameter, `total` is authoritative, and past-the-end pages
// return empty entries.
describe('fetchAllPages — page style (footprint endpoints)', () => {
  test('fetches to the advertised total even when the server ignores page-size', async () => {
    const TOTAL = 597;
    const { client, calls } = stubClient((i, qp) => {
      const page = Number(qp.page);
      const start = page * 50;
      return { entries: entries(Math.max(0, Math.min(50, TOTAL - start)), start), total: TOTAL, page, size: 0 };
    });
    const result = await client.fetchAllPages('GET', '/footprint/example.com/assets/domains', { style: 'page' });
    assert.equal(result.entries.length, 597);
    assert.equal(result.pages, 12, '597 assets at a server-fixed 50/page needs 12 pages');
    assert.equal(result.truncated, false);
    assert.equal(result.total, 597);
    assert.equal(calls[0].queryParams.page, 0, 'footprint pages are 0-based');
  });

  test('without a total, stops on an empty page', async () => {
    const { client, calls } = stubClient((i, qp) => {
      const page = Number(qp.page);
      return { entries: page < 2 ? entries(50, page * 50) : [] };
    });
    const result = await client.fetchAllPages('GET', '/footprint/example.com/assets/domains', { style: 'page', pageSize: 50 });
    assert.equal(result.entries.length, 100);
    assert.equal(result.truncated, false);
    assert.equal(calls.length, 3, 'needs the empty page to know the list ended');
  });

  test('without a total, a short page ends the list', async () => {
    const { client, calls } = stubClient((i, qp) => {
      const page = Number(qp.page);
      return { entries: page === 0 ? entries(100) : entries(20, 100) };
    });
    const result = await client.fetchAllPages('GET', '/footprint/example.com/assets/domains', { style: 'page', pageSize: 100 });
    assert.equal(result.entries.length, 120);
    assert.equal(calls.length, 2);
  });

  test('stops at maxPages and reports truncation against the total', async () => {
    const { client } = stubClient((i, qp) => ({ entries: entries(50, Number(qp.page) * 50), total: 1000 }));
    const result = await client.fetchAllPages('GET', '/footprint/example.com/assets/domains', { style: 'page', maxPages: 2 });
    assert.equal(result.entries.length, 100);
    assert.equal(result.truncated, true);
  });

  test('empty first page returns cleanly', async () => {
    const { client, calls } = stubClient(() => ({ entries: [], total: 0 }));
    const result = await client.fetchAllPages('GET', '/footprint/example.com/assets/ips', { style: 'page' });
    assert.equal(result.entries.length, 0);
    assert.equal(result.truncated, false);
    assert.equal(calls.length, 1);
  });

  test('merges caller query params into every page request', async () => {
    const { client, calls } = stubClient(() => ({ entries: entries(3), total: 3 }));
    await client.fetchAllPages('GET', '/footprint/example.com/assets/domains', {
      style: 'page',
      queryParams: { sort: 'issues' }
    });
    assert.equal(calls[0].queryParams.sort, 'issues');
  });
});

// Live-verified issues behaviour (2026-08-12, production scorecard): pages are 1-BASED
// (page=0 is clamped to 1), `size` is respected, `total` is authoritative.
describe('fetchAllPages — size-page style (issues endpoints)', () => {
  test('uses 1-based pages with a size param and fetches to the total', async () => {
    const TOTAL = 446;
    const { client, calls } = stubClient((i, qp) => {
      const page = Number(qp.page);
      const start = (page - 1) * Number(qp.size);
      return { entries: entries(Math.max(0, Math.min(Number(qp.size), TOTAL - start)), start), total: TOTAL, page };
    });
    const result = await client.fetchAllPages('GET', '/companies/example.com/issues/typosquat', { style: 'size-page', pageSize: 100 });
    assert.equal(result.entries.length, 446);
    assert.equal(result.pages, 5);
    assert.equal(calls[0].queryParams.page, 1, 'issues pages are 1-based');
    assert.equal(calls[0].queryParams.size, 100);
    assert.equal(result.truncated, false);
  });

  test('size-page loop respects maxPages and flags truncation', async () => {
    const { client } = stubClient((i, qp) => ({ entries: entries(100), total: 10000 }));
    const result = await client.fetchAllPages('GET', '/companies/example.com/issues/x', { style: 'size-page', pageSize: 100, maxPages: 3 });
    assert.equal(result.entries.length, 300);
    assert.equal(result.truncated, true);
  });
});

describe('fetchAllPages — cursor affordance', () => {
  test('follows next_cursor when a response provides one', async () => {
    const { client, calls } = stubClient((i, qp) => {
      if (i === 0) return { entries: entries(50, 0), next_cursor: 'abc' };
      return { entries: entries(10, 50) };
    });
    const result = await client.fetchAllPages('GET', '/companies/example.com/issues/x', { style: 'size-page', pageSize: 50 });
    assert.equal(result.entries.length, 60);
    assert.equal(calls[1].queryParams.cursor, 'abc');
  });

  test('follows a full next URL by re-requesting its path', async () => {
    const { client, calls } = stubClient((i) => {
      if (i === 0) return {
        entries: entries(50, 0),
        next: 'https://api.securityscorecard.io/companies/example.com/issues/x?cursor=zzz&size=50'
      };
      return { entries: entries(5, 50) };
    });
    const result = await client.fetchAllPages('GET', '/companies/example.com/issues/x', { style: 'size-page', pageSize: 50 });
    assert.equal(result.entries.length, 55);
    assert.ok(calls[1].path.includes('cursor=zzz'), `next URL not followed: ${calls[1].path}`);
  });
});

describe('getCompanyActiveIssues pagination', () => {
  test('aggregates all pages instead of returning the first', async () => {
    const { client } = stubClient((i, qp) => {
      const page = Number(qp.page);
      if (page === 1) return { entries: entries(50, 0), total: 80 };
      return { entries: entries(30, 50), total: 80 };
    });
    const response = await client.getCompanyActiveIssues('example.com', { size: 50 });
    assert.equal(response.data.entries.length, 80);
  });
});

describe('paginationStyleFor', () => {
  test('footprint endpoints use page style, issues endpoints use size-page style', () => {
    assert.equal(paginationStyleFor('/footprint/example.com/assets/domains'), 'page');
    assert.equal(paginationStyleFor('/companies/example.com/issues/spf_record_missing'), 'size-page');
  });
});
