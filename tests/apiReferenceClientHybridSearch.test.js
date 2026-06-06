import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixtureRoot = path.resolve(__dirname, 'fixtures/api-reference');
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

test('semantic search returns highest cosine matches first', async () => {
  const client = new ApiReferenceClient();
  const results = await client.semanticSearch('password recovery workflow', {
    limit: 3,
    queryEmbedding: [0.94, 0.06, 0.0]
  });

  assert.ok(results.length >= 2, 'Expected at least two semantic matches');
  assert.equal(results[0].endpoint.operationId, 'resetUserPassword');
  assert.ok((results[0].semanticScore ?? 0) >= (results[1].semanticScore ?? -1));
});

test('hybrid search elevates semantic matches when keywords diverge', async () => {
  const client = new ApiReferenceClient();
  const results = await client.hybridSearch('credential rotation', {
    limit: 3,
    keywordWeight: 0.25,
    semanticWeight: 0.75,
    queryEmbedding: [0.95, 0.05, 0.0]
  });

  assert.ok(results.length >= 2, 'Expected at least two hybrid matches');
  assert.equal(results[0].endpoint.operationId, 'resetUserPassword');
  assert.equal(results[0].keywordScore, 0);
  assert.equal(results[1].endpoint.operationId, 'listCredentialPolicies');
  assert.ok((results[0].semanticScore ?? 0) > (results[1].semanticScore ?? 0));
  assert.ok((results[1].keywordScore ?? 0) > (results[0].keywordScore ?? 0));
});
