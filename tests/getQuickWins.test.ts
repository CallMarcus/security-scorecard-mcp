import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ScoreImpactSecurityScorecardServer } from '../live-scorecard-server/src/index.js';
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
    '/companies/example.com/issues': {
      entries: [
        { type: 'spf_record_missing', severity: 'medium' },
        { type: 'dmarc_contains_none', severity: 'medium' },
        { type: 'patching_cadence_v3_critical', severity: 'critical' }
      ]
    }
  });

  const result = await server.getQuickWins('example.com', 'medium');
  const text: string = result.content[0].text;
  assert.ok(text.includes('QUICK WINS FOR'));
  assert.ok(text.includes('SPF RECORD MISSING'));
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
