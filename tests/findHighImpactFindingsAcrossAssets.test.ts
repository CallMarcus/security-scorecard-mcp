import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ScoreImpactSecurityScorecardServer } from '../live-scorecard-server/src/index.js';

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

test('findHighImpactFindingsAcrossAssets summarizes results', async () => {
  const server = createServerWithStubs({
    '/companies/example.com/issues/active/spf_record_missing?size=50': {
      entries: [{ severity: 'medium' }, { severity: 'medium' }]
    },
    '/companies/example.com/issues/active/patching_cadence_v3_critical?size=50': new Error('404 Not Found')
  });

  const result = await server.findHighImpactFindingsAcrossAssets('example.com', ['spf_record_missing', 'patching_cadence_v3_critical']);
  const text: string = result.content[0].text;
  assert.ok(text.includes('FINDINGS SUMMARY'));
  assert.ok(text.includes('SPF RECORD MISSING'));
  assert.ok(text.includes('PATCHING CADENCE V3 CRITICAL'));
});

test('findHighImpactFindingsAcrossAssets handles domains with no issues', async () => {
  const server = createServerWithStubs({
    '/companies/empty.com/issues/active/spf_record_missing?size=50': new Error('404 Not Found')
  });

  const result = await server.findHighImpactFindingsAcrossAssets('empty.com', ['spf_record_missing']);
  const text: string = result.content[0].text;
  assert.ok(text.includes('**Active Issue Types**: 0 / 1'));
});
