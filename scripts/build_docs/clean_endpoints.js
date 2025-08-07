import fs from 'fs';

// Load the endpoint JSON file relative to this script
const fileUrl = new URL('./securityscorecard_complete_api_endpoints.json', import.meta.url);
const raw = JSON.parse(fs.readFileSync(fileUrl, 'utf-8'));

const BAD_PHRASES = ['did this page help you?', 'curl request'];

function containsBadPhrase(str = '') {
  const lower = str.toLowerCase();
  return BAD_PHRASES.some(p => lower.includes(p));
}

function isMeaningful(str) {
  return typeof str === 'string' && str.trim() !== '' && !containsBadPhrase(str);
}

function isValidName(str = '') {
  return /^[A-Za-z0-9_.-]+$/.test(str);
}

function normalizeParam(item = {}) {
  return {
    name: (item.name || '').trim(),
    type: (item.type || '').trim(),
    required: Boolean(item.required),
    description: (item.description || '').trim(),
  };
}

function cleanEntries(entries = []) {
  return entries
    .filter(item => {
      const nameOk = isMeaningful(item.name) && isValidName(item.name);
      const typeOk = isMeaningful(item.type);
      const descOk = !containsBadPhrase(item.description || '');
      return nameOk && typeOk && descOk;
    })
    .map(normalizeParam);
}

function extractPathTokens(url = '') {
  const matches = url.match(/\{([^}]+)\}/g) || [];
  return matches.map(m => m.slice(1, -1));
}

const cleanedEndpoints = raw.endpoints.map(ep => {
  const params = ep.parameters || {};
  return {
    method: (ep.method || '').toUpperCase(),
    url: (ep.url || '').trim(),
    description: (ep.description || '').trim(),
    parameters: {
      path: cleanEntries(params.path),
      query: cleanEntries(params.query),
      body: cleanEntries(params.body),
    },
  };
});

function paramScore(p = {}) {
  let score = 0;
  if (isMeaningful(p.type)) score += 1;
  if (typeof p.required === 'boolean') score += 1;
  if (isMeaningful(p.description)) score += 1;
  return score;
}

function mergeParamArrays(a = [], b = []) {
  const map = new Map();
  for (const param of [...a, ...b]) {
    const key = param.name;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, param);
    } else {
      map.set(key, paramScore(param) > paramScore(existing) ? param : existing);
    }
  }
  return Array.from(map.values());
}

function mergeEndpoints(a, b) {
  return {
    ...a,
    description: isMeaningful(a.description) ? a.description : b.description,
    parameters: {
      path: mergeParamArrays(a.parameters.path, b.parameters.path),
      query: mergeParamArrays(a.parameters.query, b.parameters.query),
      body: mergeParamArrays(a.parameters.body, b.parameters.body),
    },
  };
}

const mergedEndpoints = Object.values(
  cleanedEndpoints.reduce((acc, ep) => {
    const key = `${ep.method} ${ep.url}`;
    const existing = acc[key];
    acc[key] = existing ? mergeEndpoints(existing, ep) : ep;
    return acc;
  }, {})
);

function validatePathParams(ep) {
  const tokens = extractPathTokens(ep.url);
  const params = ep.parameters.path.filter(p => tokens.includes(p.name));
  const missing = tokens.filter(t => !params.some(p => p.name === t));
  const missingParams = missing.map(name => ({
    name,
    type: 'string',
    required: true,
    description: '',
  }));
  return {
    ...ep,
    parameters: {
      ...ep.parameters,
      path: [...params, ...missingParams],
    },
  };
}

const normalizedEndpoints = mergedEndpoints.map(validatePathParams);

const output = {
  metadata: {
    ...raw.metadata,
    total_endpoints: normalizedEndpoints.length,
  },
  endpoints: normalizedEndpoints,
};

const outFile = new URL('./securityscorecard_api_clean.json', import.meta.url);
fs.writeFileSync(outFile, JSON.stringify(output, null, 2));
console.log(`Wrote ${outFile.pathname}`);
