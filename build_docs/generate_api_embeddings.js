import fs from 'fs';
import path from 'path';

async function main() {
  const apiRefPath = path.join('build_docs', 'api_reference.json');
  const raw = fs.readFileSync(apiRefPath, 'utf-8');
  const apiRef = JSON.parse(raw);

  // Build dictionary keyed by "METHOD URL"
  const endpoints = {};
  for (const ep of apiRef) {
    const key = `${ep.method} ${ep.url}`;
    endpoints[key] = {
      file: ep.file,
      description: ep.description,
      parameters: ep.parameters,
      responses: ep.responses,
    };
  }

  // Try to compute embeddings with @xenova/transformers. If that fails,
  // fall back to a simple character-code based embedding so the output
  // still contains numeric vectors.
  let embedder = null;
  try {
    const { pipeline } = await import('@xenova/transformers');
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  } catch (err) {
    console.warn('Embedding model unavailable, using fallback embeddings:', err.message);
  }

  function fallbackEmbedding(text) {
    const vec = [0, 0, 0];
    for (let i = 0; i < text.length; i++) {
      vec[i % vec.length] += text.charCodeAt(i);
    }
    const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
    return vec.map((v) => v / norm);
  }

  for (const details of Object.values(endpoints)) {
    if (embedder) {
      const result = await embedder(details.description || '', {
        pooling: 'mean',
        normalize: true,
      });
      details.embedding = Array.from(result.data);
    } else {
      details.embedding = fallbackEmbedding(details.description || '');
    }
  }

  const outPath = path.join('build_docs', 'api_embeddings.json');
  fs.writeFileSync(outPath, JSON.stringify(endpoints, null, 2));
  console.log(`Wrote ${Object.keys(endpoints).length} entries to ${outPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
