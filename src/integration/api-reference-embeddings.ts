import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline as createPipeline } from '@xenova/transformers';

interface ApiIndexEntry {
  operationId: string;
  summary?: string;
  description?: string;
  path: string;
  method: string;
  tag?: string;
  requiredPathParams?: string[];
  queryParams?: string[];
  hasBody?: boolean;
}

interface EmbeddingRecord {
  text: string;
  embedding: number[];
}

interface EmbeddingCache {
  [operationId: string]: EmbeddingRecord;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');
const apiIndexPath = path.resolve(projectRoot, 'docs/api/index.jsonl');
const embeddingsPath = path.resolve(projectRoot, 'docs/api/index-embeddings.json');

function createTextRepresentation(entry: ApiIndexEntry): string {
  const parts: string[] = [];

  // Summary (primary search signal)
  if (entry.summary?.trim()) {
    parts.push(entry.summary.trim());
  }

  // Method and path (critical for matching)
  parts.push(`${entry.method.toUpperCase()} ${entry.path}`);

  // Tag/category
  if (entry.tag) {
    parts.push(`Tag: ${entry.tag}`);
  }

  // Description (first 150 chars for context)
  if (entry.description?.trim()) {
    const desc = entry.description.trim();
    const firstLine = desc.split(/[.\n]/)[0]?.trim();
    if (firstLine && firstLine !== entry.summary?.trim()) {
      parts.push(`Description: ${firstLine.slice(0, 150)}`);
    }
  }

  // Required path parameters (helps match queries like "get company by domain")
  if (entry.requiredPathParams?.length) {
    parts.push(`Required params: ${entry.requiredPathParams.join(', ')}`);
  }

  // Query parameters (helps match filter/pagination queries)
  if (entry.queryParams?.length) {
    const queryList = entry.queryParams.slice(0, 8).join(', ');
    const suffix = entry.queryParams.length > 8 ? '...' : '';
    parts.push(`Query params: ${queryList}${suffix}`);
  }

  // Body indicator
  if (entry.hasBody) {
    parts.push('Accepts request body');
  }

  return parts.join('\n');
}

async function loadApiIndex(): Promise<ApiIndexEntry[]> {
  const raw = await readFile(apiIndexPath, 'utf-8');
  const lines = raw.split(/\r?\n/).filter(Boolean);
  return lines.map((line) => JSON.parse(line) as ApiIndexEntry);
}

async function loadExistingEmbeddings(): Promise<EmbeddingCache> {
  if (!existsSync(embeddingsPath)) {
    return {};
  }

  const raw = await readFile(embeddingsPath, 'utf-8');
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as EmbeddingCache;
    }
  } catch (error) {
    console.warn(`Unable to parse existing embeddings file: ${error}`);
  }

  return {};
}

async function saveEmbeddings(cache: EmbeddingCache): Promise<void> {
  const sorted = Object.keys(cache)
    .sort()
    .reduce<EmbeddingCache>((acc, key) => {
      acc[key] = cache[key];
      return acc;
    }, {});

  const content = `${JSON.stringify(sorted, null, 2)}\n`;
  await writeFile(embeddingsPath, content, 'utf-8');
}

async function buildEmbeddings(): Promise<void> {
  const [apiIndex, existing] = await Promise.all([
    loadApiIndex(),
    loadExistingEmbeddings(),
  ]);

  const extractor = await createPipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

  const updated: EmbeddingCache = { ...existing };
  let updatedCount = 0;

  for (const entry of apiIndex) {
    if (!entry.operationId) {
      console.warn('Skipping entry without operationId:', entry);
      continue;
    }

    const text = createTextRepresentation(entry);
    const cached = existing[entry.operationId];

    if (cached && cached.text === text && Array.isArray(cached.embedding)) {
      updated[entry.operationId] = cached;
      continue;
    }

    const result = await extractor(text, { pooling: 'mean', normalize: true });
    const embeddingArray = Array.from(result.data as Float32Array);

    updated[entry.operationId] = {
      text,
      embedding: embeddingArray,
    };
    updatedCount += 1;
    console.log(`Embedded ${entry.operationId}`);
  }

  if (updatedCount === 0) {
    console.log('Embeddings are already up to date.');
  } else {
    console.log(`Computed embeddings for ${updatedCount} API operations.`);
  }

  await saveEmbeddings(updated);
  console.log(`Saved embeddings to ${path.relative(projectRoot, embeddingsPath)}`);
}

const invokedDirectly =
  typeof process.argv[1] === 'string' &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  buildEmbeddings().catch((error) => {
    console.error('Failed to build API reference embeddings:', error);
    process.exitCode = 1;
  });
}

export { buildEmbeddings };
