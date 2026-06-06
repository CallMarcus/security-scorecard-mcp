import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Regression coverage for commit b2fcd58 ("keyword search tiebreakers should
// not promote irrelevant results"). The tiebreaker bonuses in calculateScore
// (short-path bonus, /v2/ version bias) are only applied when an endpoint
// already has keyword relevance (score > 0). Without that guard, an irrelevant
// short /v2/ endpoint would be lifted to a positive score and surface in
// results for a query it has nothing to do with.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixtureRoot = path.resolve(__dirname, 'fixtures/keyword-tiebreaker');
const originalApiReferencePath = process.env.SCORECARD_API_REFERENCE_PATH;
process.env.SCORECARD_API_REFERENCE_PATH = fixtureRoot;

const { ApiReferenceClient } = await import('../build/integration/api-reference-client.js');

test.after(() => {
  if (originalApiReferencePath === undefined) {
    delete process.env.SCORECARD_API_REFERENCE_PATH;
  } else {
    process.env.SCORECARD_API_REFERENCE_PATH = originalApiReferencePath;
  }
});

test('short /v2/ endpoint is NOT promoted for an unrelated query', () => {
  const client = new ApiReferenceClient();
  // "email security" matches the email endpoint; the /v2/health endpoint is a
  // short, versioned path that would have been promoted by tiebreakers alone.
  const results = client.search('email security spf dmarc', { limit: 8 });

  const operationIds = results.map(r => r.endpoint.operationId);
  assert.ok(
    operationIds.includes('getEmailSecurity'),
    'Relevant email-security endpoint should be returned'
  );
  assert.ok(
    !operationIds.includes('getServiceHealth'),
    'Irrelevant /v2/health endpoint must not be promoted by tiebreakers alone'
  );

  const health = results.find(r => r.endpoint.operationId === 'getServiceHealth');
  assert.equal(health, undefined, 'No result row should exist for the unrelated endpoint');
});

test('relevant endpoint still scores positively and ranks first', () => {
  const client = new ApiReferenceClient();
  const results = client.search('email security spf dmarc', { limit: 8 });

  assert.ok(results.length >= 1, 'Expected at least one match');
  assert.equal(results[0].endpoint.operationId, 'getEmailSecurity');
  assert.ok(results[0].score > 0, 'Matching endpoint must have a positive score');
});

test('a query that matches the /v2/health endpoint does return it', () => {
  const client = new ApiReferenceClient();
  // When the query is actually relevant, the endpoint should surface (and the
  // tiebreakers legitimately apply on top of real keyword relevance).
  const results = client.search('service health heartbeat', { limit: 8 });

  const operationIds = results.map(r => r.endpoint.operationId);
  assert.ok(
    operationIds.includes('getServiceHealth'),
    'Health endpoint should surface for a genuinely relevant query'
  );
});
