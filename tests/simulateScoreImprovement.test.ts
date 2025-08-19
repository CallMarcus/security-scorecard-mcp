import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ScoreImpactSecurityScorecardServer } from '../src/index.js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

function createServerWithStubs(responses: Record<string, any>) {
  const server = new ScoreImpactSecurityScorecardServer();
  (server as any).makeRequest = async (endpoint: string) => {
    const res = responses[endpoint];
    if (res instanceof Error) throw res;
    if (res !== undefined) return res;
    throw new Error('Unknown endpoint ' + endpoint);
  };
  (server as any).server = { setRequestHandler() {}, connect() {} } as any;
  return server as any;
}

test('simulateScoreImprovement projects score and grade change', async () => {
  const server = createServerWithStubs({
    '/companies/example.com': { score: 75, grade: 'C' },
    '/companies/example.com/factors': {
      entries: [
        { name: 'dns_health', score: 80, weight: 10 },
        { name: 'patching_cadence', score: 60, weight: 15 }
      ]
    }
  });

  const result = await server.simulateScoreImprovement('example.com', ['spf_record_missing', 'patching_cadence_v3_critical']);
  const text: string = result.content[0].text;
  if (!text.includes('Projected Score**: 80.3/100')) {
    throw new Error(`Projected score missing: ${text}`);
  }
  if (!text.includes('Grade Change**: C → B')) {
    throw new Error(`Grade change missing: ${text}`);
  }
});

test('simulateScoreImprovement wraps 404 errors', async () => {
  const error = new Error('404 Not Found');
  const server = createServerWithStubs({
    '/companies/missing.com': error,
    '/companies/missing.com/factors': error
  });

  await assert.rejects(
    () => server.simulateScoreImprovement('missing.com', ['spf_record_missing']),
    (err: any) => {
      assert.equal(err.constructor.name, 'McpError');
      assert.equal(err.code, ErrorCode.InvalidRequest);
      assert.ok(err.message.includes('Cannot access company data for domain: missing.com'));
      return true;
    }
  );
});
