import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
let cache = null;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
/**
 * Load and cache the API reference file.
 */
export async function loadApiReference() {
    if (cache)
        return cache;
    const refPath = path.resolve(__dirname, '../build_docs/api_reference.json');
    const raw = await fs.readFile(refPath, 'utf-8');
    cache = JSON.parse(raw);
    return cache;
}
function normalizeEndpoint(ep) {
    const noQuery = ep.split('?')[0];
    // Replace any company domain with placeholder
    return noQuery.replace(/\/companies\/[^/]+/, '/companies/{domain}');
}
/**
 * Look up endpoint details by path and optional method.
 */
export async function getEndpointDetails(endpoint, method) {
    const ref = await loadApiReference();
    const targetPath = normalizeEndpoint(endpoint);
    return ref.find(e => {
        if (!e.url)
            return false;
        const refPath = new URL(e.url).pathname;
        return refPath === targetPath && (!method || e.method.toUpperCase() === method.toUpperCase());
    });
}
