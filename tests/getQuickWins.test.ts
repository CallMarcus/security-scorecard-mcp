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

test('getQuickWins lists high-impact low-effort items', async () => {
  const server = createServerWithStubs({
    '/companies/example.com/factors': {
      entries: [
        { 
          name: 'dns_health', 
          score: 85,
          issue_summary: [
            { type: 'spf_record_missing' },
            { type: 'dmarc_contains_none' }
          ]
        }
      ]
    },
    '/companies/example.com/issues/spf_record_missing?size=50': {
      entries: [
        { type: 'spf_record_missing', severity: 'medium' }
      ]
    },
    '/companies/example.com/issues/dmarc_contains_none?size=50': {
      entries: [
        { type: 'dmarc_contains_none', severity: 'medium' }
      ]
    }
  });

  const result = await server.getQuickWins('example.com', 'medium');
  const text: string = result.content[0].text;
  assert.ok(text.includes('COMMON QUICK WINS'));
  assert.ok(text.includes('example.com'));
});

test('getQuickWins rejects invalid maxEffort', async () => {
  const server = createServerWithStubs({});
  await assert.rejects(
    () => server.getQuickWins('example.com', 'invalid'),
    (err: any) => {
      assert.equal(err.constructor.name, 'McpError');
      assert.equal(err.code, ErrorCode.InvalidRequest);
      return true;
    }
  );
});
