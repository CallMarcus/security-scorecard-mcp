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

const output = { metadata: raw.metadata, endpoints: cleanedEndpoints };

// Print the sanitized JSON so callers can redirect it to a file
console.log(JSON.stringify(output, null, 2));
