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

function cleanEntries(entries = []) {
  return entries.filter(item => {
    const nameOk = isMeaningful(item.name);
    const typeOk = isMeaningful(item.type);
    const descOk = !containsBadPhrase(item.description || '');
    return nameOk && typeOk && descOk;
  }).map(item => ({
    ...item,
    name: item.name.trim(),
    type: item.type.trim(),
  }));
}

const cleanedEndpoints = raw.endpoints.map(ep => {
  const params = ep.parameters || {};
  return {
    ...ep,
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
    title: isMeaningful(a.title) ? a.title : b.title,
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

const output = {
  metadata: {
    ...raw.metadata,
    total_endpoints: mergedEndpoints.length,
  },
  endpoints: mergedEndpoints,
};

// Print the sanitized JSON so callers can redirect it to a file
console.log(JSON.stringify(output, null, 2));
