import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ScoreImpactSecurityScorecardServer } from '../src/index.js';

// Helper to create server with stubbed methods
function createServerWithStubs(data: {
  scorecard: any;
  companyFactors: any;
  factors: any[];
  keyIssues?: (name: any) => any[];
}) {
  const server = new ScoreImpactSecurityScorecardServer();
  // @ts-ignore override
  server.makeRequest = async (endpoint: string) => {
    if (endpoint.endsWith('/companies/example.com')) return data.scorecard;
    if (endpoint.endsWith('/companies/example.com/factors')) return data.companyFactors;
    throw new Error('Unknown endpoint ' + endpoint);
  };
  // @ts-ignore override
  server.getFactors = async () => data.factors;
  if (data.keyIssues) {
    // @ts-ignore override
    server.getKeyIssuesForFactor = data.keyIssues;
  }
  // @ts-ignore silence server
  server.server = { setRequestHandler() {}, connect() {} } as any;
  return server as any;
}

test('getScoreImprovementRoadmap handles normal factor entries', async () => {
  const server = createServerWithStubs({
    scorecard: { score: 60, grade: 'C' },
    companyFactors: { entries: [{ name: 'dns_health', score: 80 }] },
    factors: [{ name: 'dns_health', weight: 10 }],
  });

  const result = await server.getScoreImprovementRoadmap('example.com', 'B');
  const text: string = result.content[0].text;
  assert.ok(text.includes('DNS HEALTH'));
});

test('getScoreImprovementRoadmap logs and handles malformed factor entries', async () => {
  const logs: string[] = [];
  const original = console.error;
  console.error = (msg?: any, ...args: any[]) => {
    logs.push(String(msg));
  };

  const server = createServerWithStubs({
    scorecard: { score: 60, grade: 'C' },
    companyFactors: { entries: [{ name: { bad: true }, score: 50, effort: 'low' }] },
    factors: [{ name: '[object Object]', weight: 10 }],
    keyIssues: () => ['good', 123],
  });

  const result = await server.getScoreImprovementRoadmap('example.com', 'B');
  console.error = original;

  const text: string = result.content[0].text;
  assert.ok(text.includes('[OBJECT OBJECT]'));
  assert.ok(logs.length > 0);
});
