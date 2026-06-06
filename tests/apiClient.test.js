import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createSecurityScorecardClient,
  validateApiToken,
} from '../build/api/client.js';

// Offline unit tests for the SecurityScorecard API client. The network layer
// (global fetch) is stubbed so these never touch the live API and stay
// deterministic in CI.

const TOKEN = 'test-token-1234567890';

function stubFetch(handler) {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return handler(url, init);
  };
  return {
    calls,
    restore() {
      globalThis.fetch = original;
    },
  };
}

function okResponse(data, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: 'OK',
    headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => data,
    text: async () => JSON.stringify(data),
  };
}

function errorResponse(status, statusText, bodyText) {
  return {
    ok: false,
    status,
    statusText,
    headers: new Headers(),
    json: async () => ({}),
    text: async () => bodyText,
  };
}

test('validateApiToken accepts plausible tokens and rejects bad input', () => {
  assert.equal(validateApiToken('a-reasonable-token-value'), true);
  assert.equal(validateApiToken('short'), false);
  assert.equal(validateApiToken(''), false);
  assert.equal(validateApiToken(undefined), false);
  assert.equal(validateApiToken(null), false);
  assert.equal(validateApiToken(123456789012), false);
});

test('makeRequest builds the URL and sends the Token auth header', async () => {
  const fetchStub = stubFetch(() => okResponse({ ok: true }));
  try {
    const client = createSecurityScorecardClient(TOKEN);
    const res = await client.getPortfolios();

    assert.equal(fetchStub.calls.length, 1);
    const { url, init } = fetchStub.calls[0];
    assert.equal(url, 'https://api.securityscorecard.io/portfolios');
    assert.equal(init.method, 'GET');
    assert.equal(init.headers['Authorization'], `Token ${TOKEN}`);
    assert.equal(init.headers['Content-Type'], 'application/json');
    assert.deepEqual(res.data, { ok: true });
    assert.equal(res.status, 200);
  } finally {
    fetchStub.restore();
  }
});

test('query params are appended and null/undefined values are skipped', async () => {
  const fetchStub = stubFetch(() => okResponse({}));
  try {
    const client = createSecurityScorecardClient(TOKEN);
    await client.getPortfolios({ page: 2, size: 50, skip: undefined, gone: null });

    const requested = new URL(fetchStub.calls[0].url);
    assert.equal(requested.searchParams.get('page'), '2');
    assert.equal(requested.searchParams.get('size'), '50');
    assert.equal(requested.searchParams.has('skip'), false);
    assert.equal(requested.searchParams.has('gone'), false);
  } finally {
    fetchStub.restore();
  }
});

test('request bodies are JSON-serialized for write methods', async () => {
  const fetchStub = stubFetch(() => okResponse({ id: 'p1' }, 201));
  try {
    const client = createSecurityScorecardClient(TOKEN);
    await client.createPortfolio({ name: 'My Portfolio' });

    const { init } = fetchStub.calls[0];
    assert.equal(init.method, 'POST');
    assert.equal(init.body, JSON.stringify({ name: 'My Portfolio' }));
  } finally {
    fetchStub.restore();
  }
});

test('non-OK responses throw with status and body in the message', async () => {
  const fetchStub = stubFetch(() => errorResponse(403, 'Forbidden', 'invalid token'));
  try {
    const client = createSecurityScorecardClient(TOKEN);
    await assert.rejects(
      () => client.getCompanyScore('example.com'),
      (err) => {
        assert.match(err.message, /403/);
        assert.match(err.message, /Forbidden/);
        assert.match(err.message, /invalid token/);
        return true;
      }
    );
  } finally {
    fetchStub.restore();
  }
});

test('callEndpoint normalizes the path and upper-cases the method', async () => {
  const fetchStub = stubFetch(() => okResponse({}));
  try {
    const client = createSecurityScorecardClient(TOKEN);
    await client.callEndpoint('get', 'portfolios'); // no leading slash, lowercase

    const { url, init } = fetchStub.calls[0];
    assert.equal(url, 'https://api.securityscorecard.io/portfolios');
    assert.equal(init.method, 'GET');
  } finally {
    fetchStub.restore();
  }
});

test('getCompanyActiveIssues applies default status/size and honors overrides', async () => {
  const fetchStub = stubFetch(() => okResponse({ entries: [] }));
  try {
    const client = createSecurityScorecardClient(TOKEN);
    await client.getCompanyActiveIssues('example.com', { status: 'closed', page: 3 });

    const requested = new URL(fetchStub.calls[0].url);
    assert.ok(requested.pathname.endsWith('/companies/example.com/issues'));
    assert.equal(requested.searchParams.get('status'), 'closed'); // override wins
    assert.equal(requested.searchParams.get('size'), '50');        // default preserved
    assert.equal(requested.searchParams.get('page'), '3');
  } finally {
    fetchStub.restore();
  }
});

test('a custom baseUrl is respected', async () => {
  const fetchStub = stubFetch(() => okResponse({}));
  try {
    const client = createSecurityScorecardClient(TOKEN, 'https://example.test/api');
    await client.getPortfolios();
    assert.ok(fetchStub.calls[0].url.startsWith('https://example.test/api/portfolios'));
  } finally {
    fetchStub.restore();
  }
});
