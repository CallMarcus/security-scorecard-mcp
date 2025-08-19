import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ScoreImpactSecurityScorecardServer } from '../src/index.js';

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

test('benchmarkGradeRequirements shows grade gaps', async () => {
  const server = createServerWithStubs({
    '/companies/example.com': { score: 82 }
  });

  const result = await server.benchmarkGradeRequirements('example.com');
  const text: string = result.content[0].text;
  assert.ok(text.includes('GRADE BENCHMARKING'));
  assert.ok(text.includes('YOU ARE HERE'));
});

test('benchmarkGradeRequirements surfaces API errors', async () => {
  const error = new Error('404 Not Found');
  const server = createServerWithStubs({
    '/companies/missing.com': error
  });

  await assert.rejects(
    () => server.benchmarkGradeRequirements('missing.com'),
    (err: any) => {
      assert.equal(err.message, '404 Not Found');
      return true;
    }
  );
});
