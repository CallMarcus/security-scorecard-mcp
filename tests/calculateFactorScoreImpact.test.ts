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

test('calculateFactorScoreImpact ranks factors by ROI', async () => {
  const server = createServerWithStubs({
    '/companies/example.com': { score: 70, grade: 'C' },
    '/companies/example.com/factors': {
      entries: [
        { name: 'dns_health', score: 60, grade: 'D' },
        { name: 'patching_cadence', score: 80, grade: 'B' }
      ]
    },
    '/factors': { entries: [ { name: 'dns_health', weight: 10 }, { name: 'patching_cadence', weight: 15 } ] }
  });

  const result = await server.calculateFactorScoreImpact('example.com');
  const text: string = result.content[0].text;
  assert.ok(text.includes('FACTOR SCORE IMPACT ANALYSIS'));
  assert.ok(text.includes('DNS HEALTH'));
});

test('calculateFactorScoreImpact wraps 404 errors', async () => {
  const error = new Error('404 Not Found');
  const server = createServerWithStubs({
    '/companies/missing.com': error,
    '/companies/missing.com/factors': error,
    '/factors': { entries: [] }
  });

  await assert.rejects(
    () => server.calculateFactorScoreImpact('missing.com'),
    (err: any) => {
      assert.equal(err.constructor.name, 'McpError');
      assert.equal(err.code, ErrorCode.InvalidRequest);
      return true;
    }
  );
});
