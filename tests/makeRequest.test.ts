import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ScoreImpactSecurityScorecardServer } from '../src/index.js';

// This test ensures that makeRequest can parse the documented API response
// structure with data, pagination, and meta fields.
test('makeRequest parses data, pagination, and meta fields', async () => {
  process.env.SECURITY_SCORECARD_API_TOKEN = 'test-token';
  const server = new ScoreImpactSecurityScorecardServer();
  // Disable real network throttling and logging
  (server as any).throttleRequest = async () => {};
  (server as any).log = () => {};

  const mockResponse = {
    data: [{ id: 1 }],
    pagination: { page: 1, size: 50, has_next: false },
    meta: { total: 1 }
  };

  // Mock global fetch to return the mockResponse
  const originalFetch = global.fetch;
  global.fetch = async () => new Response(JSON.stringify(mockResponse), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });

  const result = await (server as any).makeRequest('/test');

  assert.deepEqual(result.entries, [{ id: 1 }]);
  assert.deepEqual(result.pagination, { page: 1, size: 50, has_next: false });
  assert.deepEqual(result.meta, { total: 1 });

  // Restore original fetch
  global.fetch = originalFetch;
});
