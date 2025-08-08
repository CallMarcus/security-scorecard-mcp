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

test('getIssuesByROI ranks issues with highest ROI', async () => {
  const server = createServerWithStubs({
    '/companies/example.com/issues/active?size=50': {
      entries: [
        { type: 'spf_record_missing', severity: 'medium' },
        { type: 'spf_record_missing', severity: 'medium' },
        { type: 'patching_cadence_v3_critical', severity: 'critical' }
      ]
    },
    '/factors': { entries: [ { name: 'dns_health', weight: 10 }, { name: 'patching_cadence', weight: 15 } ] }
  });

  const result = await server.getIssuesByROI('example.com', 5);
  const text: string = result.content[0].text;
  assert.ok(text.includes('COMMON HIGH-ROI ISSUES'));
  assert.ok(text.includes('SPF RECORD MISSING'));
});

test('getIssuesByROI rejects invalid topN', async () => {
  const server = createServerWithStubs({
    '/companies/example.com/issues/active?size=50': { entries: [] },
    '/factors': { entries: [] }
  });

  await assert.rejects(
    () => server.getIssuesByROI('example.com', 0),
    (err: any) => {
      assert.equal(err.constructor.name, 'McpError');
      assert.equal(err.code, ErrorCode.InvalidRequest);
      return true;
    }
  );
});
