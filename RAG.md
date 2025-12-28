# RAG Design for API Reference Retrieval

This document analyzes the current API reference retrieval in the SecurityScorecard MCP server and proposes a more effective, production-hardened RAG (Retrieval-Augmented Generation) approach tailored to this codebase.

## Current State

- Corpus
  - Local, self-contained API reference under `docs/api/` with `index.jsonl` and per-endpoint Markdown docs.
  - Precomputed semantic embeddings stored in `docs/api/index-embeddings.json`.
- Retrieval implementation
  - `src/integration/api-reference-client.ts` provides:
    - Keyword search over `summary`, `path`, `operationId`, `tag`.
    - Semantic search via `@xenova/transformers` (MiniLM all-MiniLM-L6-v2), cosine similarity against precomputed endpoint embeddings.
    - Hybrid search with a weighted mix of keyword and semantic scores and simple normalization.
    - Document access for endpoint Markdown.
  - Embedding builder at `src/integration/api-reference-embeddings.ts` generates embeddings from summary + `METHOD PATH` + tag.
- Tooling usage
  - `api_discovery` tool in both `src/index.ts` and `src/simplified-index.ts` returns top endpoints, relevance scores, params, optional doc snippets/cURL.
  - Direct API tools (`query_security_data`, `call_api_endpoint`) do not leverage retrieval for validation, parameter guidance, or auto-correction yet.

## Identified Gaps

- Runtime fragility
  - Semantic stage depends on loading models at runtime; on restricted machines, semantic may fail without a graceful keyword-only fallback.
- Limited embedding signal
  - Embedding text omits parameter names, request/response schema hints, and examples that are critical for precise matching.
- No reranking stage
  - Hybrid score is a linear mix; ambiguous intents (e.g., "findings by asset") benefit from cross-encoder reranking.
- Outputs not schema-grounded
  - Results lack machine-usable request/response schema details for downstream calls.
- Not integrated into API calling
  - `query_security_data` / `call_api_endpoint` don’t use retrieval to validate paths, surface missing required params, or suggest near-miss endpoints upon failure.
- No guardrails
  - No bias towards stable versions (prefer v2), against deprecated endpoints, or based on observed call success.
- Minimal query understanding
  - No light-weight classification, synonym expansion, or field boosts tuned to the API surface.

## Proposed RAG Design

1) Robust Two-Stage Retrieval
- Stage 1: Keyword scorer with field boosts (BM25/TF‑IDF)
  - Fields and weights: `path` (x3) > `operationId` (x2) > `summary` (x1.5) > `params` (x1) > `tag` (x0.8).
  - Synonym expansion for common terms: e.g., grade→score, issue→finding, asset→company/domain/hostname/ip.
- Stage 2: Semantic scorer
  - Use existing MiniLM embeddings; include enriched text (see “Signal Enrichment”).
- Hybrid scoring and graceful fallback
  - Normalize keyword and semantic scores; combine with tunable weights.
  - If semantic embedding creation fails, automatically return keyword-only with a visible flag.

2) Signal Enrichment for Embeddings
- Expand per-endpoint text to include:
  - Summary + `METHOD PATH` + tag.
  - `requiredPathParams` and `queryParams` names.
  - First lines of description and the minimal example cURL if present.
- Rebuild `docs/api/index-embeddings.json` to reflect enriched signals.

3) Lightweight Reranking
- Apply a cross-encoder or sentence-pair similarity reranker using `@xenova/transformers` over the top 30–50 candidates.
- Score pairs `(query, endpoint_text)` and reorder before final selection.
- If model not available, skip transparently.

4) Schema-Grounded Answers
- Extract structured metadata from `api-docs.json` for each operationId:
  - Method, path, required/query params (with types if available), minimal request body schema presence, response schema sketch, deprecation, version.
- Return a compact JSON block with every retrieval response (in addition to the Markdown summary) to support deterministic downstream tool-calls.

5) End-to-End Tool Integration
- Pre-call validation (in `query_security_data`/`call_api_endpoint`):
  - Verify user-provided path is known; if not, run retrieval and propose likely matches with suggested fixes.
  - Identify missing required params; prompt or suggest defaults (e.g., `{domain}`).
- Self-healing suggestions on HTTP error:
  - Use status code + original path as a new query to retrieval; present top-3 alternatives with rationale and ready-to-run cURL.

6) Guardrails and Confidence
- Scoring bias:
  - Upweight non-deprecated and v2 endpoints; downweight known problematic tags.
  - Optionally incorporate a local “success score” per operationId based on recent successful calls.
- Confidence score:
  - Based on normalized hybrid score, reranker margin, param availability, and endpoint stability.
- Always include citations: `operationId` and the `docs/api/...md` path.

7) Query Understanding
- Fast, rule-based classifier to infer:
  - Category/tag (assets, findings, portfolios, compliance, audit, etc.).
  - Likely HTTP method for read vs. write intents.
  - Expanded keyword set via small synonym map.
- Feed these as filters/boosts into Stage 1.

## Concrete Implementation Plan

Code touch points and steps:

1) Keyword Stage with Field Boosts
- File: `src/integration/api-reference-client.ts`
  - Add an in-memory inverted index built from `docs/api/index.jsonl` on first load.
  - Implement TF‑IDF/BM25 scoring with per-field boosts.
  - Update `search()` to use the boosted scorer (preserve current method as fallback for simplicity).

2) Semantic Signal Enrichment
- File: `src/integration/api-reference-embeddings.ts`
  - Extend `createTextRepresentation(entry)` to include `requiredPathParams`, `queryParams`, short description, and minimal cURL (if available in doc markdown).
  - Rebuild embeddings and save to `docs/api/index-embeddings.json`.

3) Reranker
- File: `src/integration/api-reference-client.ts`
  - Add `rerank(query, candidates)` using `@xenova/transformers` (cross-encoder or sentence-similarity pipeline).
  - Invoke reranker after hybrid scoring for top N candidates; guarded by try/catch.

4) Schema Extraction
- New util (e.g., `src/integration/api-schema.ts`):
  - Load `api-docs.json` once.
  - Build `Map<operationId, { method, path, requiredParams, queryParams, bodyRequired, deprecated, version, responseSummary }>`.
  - Export helper to fetch metadata by `operationId`.

5) Tool Output and Validation
- Files: `src/index.ts`, `src/simplified-index.ts`
  - `api_discovery`:
    - Append JSON code block per result: `operationId, method, path, required_params, query_params, body_required, deprecated, version, curl_minimal`.
  - `query_security_data` / `call_api_endpoint`:
    - Validate provided `endpoint` against index; if unknown, call retrieval and propose auto-correction.
    - On HTTP errors, run retrieval with error context and present top alternatives + param hints.

6) Guardrails and Confidence
- File: `src/integration/api-reference-client.ts`
  - Add version/deprecation bias into final score composition.
  - Compute a confidence value and include in `ApiSearchResult`.
  - Optional: lightweight persistent success map (JSON in `build/` or in-memory per run) to upweight recent successes.

7) Query Understanding
- File: `src/integration/api-reference-client.ts` or new helper
  - Rule-based classification by keyword heuristics to infer category and method, plus synonym expansion.
  - Feed inferred `tag`/`method` into `search()` and `hybridSearch()` as filters/boosts.

## Phased Rollout

- Quick Wins (low risk)
  - Enrich embedding text and rebuild embeddings.
  - Add keyword-only fallback path and visible “semantic disabled” note in responses.
  - Validate and auto-correct paths in `query_security_data`.
  - Add structured JSON to `api_discovery` outputs.

- Phase 2
  - Implement boosted keyword scorer (TF‑IDF/BM25) and simple synonym map.
  - Add deprecation/version bias and confidence calculation.
  - Wire self-healing suggestions on HTTP errors.

- Phase 3
  - Introduce reranker for top-N candidates.
  - Add schema extraction from `api-docs.json` and include in outputs.
  - Optional: local success scoring and session-aware reranking.

## Data Structures

Candidate (returned in JSON code block):
```json
{
  "operationId": "get_companies-domain-factors",
  "method": "GET",
  "path": "/companies/{domain}/factors",
  "required_params": ["domain"],
  "query_params": ["limit", "cursor"],
  "body_required": false,
  "deprecated": false,
  "version": "v2",
  "scores": { "keyword": 0.71, "semantic": 0.83, "hybrid": 0.79, "confidence": 0.82 },
  "doc": "docs/api/company/GET-companies-domain-factors.md",
  "curl_minimal": "curl -H 'Authorization: Token $TOKEN' https://api.securityscorecard.io/companies/example.com/factors"
}
```

## Evaluation & QA

- Metrics
  - Top‑k accuracy (does the expected operationId appear in top-3/5?).
  - MRR@k for candidate ranking.
  - Pre-call failure rate reduction for `query_security_data`/`call_api_endpoint`.
  - Latency impact of reranker (p95).
- Calibration
  - A small suite (20–30 natural-language queries) mapped to expected operationIds for tuning boosts/weights.

## Risks & Mitigations

- Model availability offline
  - Mitigation: Always run keyword stage; package models in release artifacts where feasible; degrade gracefully.
- Performance
  - Mitigation: Limit reranker to top 30–50; cache model; reuse embeddings; keep inverted index in memory.
- Drift / docs changes
  - Mitigation: Rebuild embeddings when `docs/api/index.jsonl` changes; add a checksum and update on mismatch.

## Quick Action Items

- [x] Enrich embedding text and rebuild (`src/integration/api-reference-embeddings.ts`).
- [x] Add keyword-only fallback and explicit flag in `hybridSearch`.
- [x] Validate endpoints in `query_security_data`; propose nearest matches if unknown.
- [x] Add structured JSON section to `api_discovery` responses.
- [x] Implement field-boosted keyword scorer; add synonym map (30+ term mappings).
- [x] Add deprecation/version bias and confidence scores.
- [x] Add schema extraction utility (`src/integration/api-schema.ts`).
- [ ] Optional: add cross-encoder reranker (deferred - adds complexity).

---
Last updated: ${new Date().toISOString()}

## CLAUDE.md Review Notes

Date: 2025-12-27

What’s working well
- Operational focus is clear: streamlined server default, 3-tier response modes, practical build guidance (esbuild to avoid OOM).
- API reference lifecycle is self-contained with scripts to fetch/generate/embed/update and local storage in `docs/api/`.
- Discovery knobs (`API_DISCOVERY_KEYWORD_WEIGHT`, `API_DISCOVERY_SEMANTIC_WEIGHT`) are documented and used in code.
- Streamlined bug fix validated: `security_dashboard` and `create_improvement_plan` now use `getCompanyFactorSummary()`.

Gaps compared to current code
- `query_security_data` does not yet integrate the discovery client for pre-call validation, parameter checks, or auto-correction; it directly calls the endpoint.
- Hard-coded endpoint counts (“591”) appear in discovery tool descriptions; actual index currently has 628 entries and can change.
- Discovery behavior described (method detection, param construction, alternative suggestions on error) isn’t fully wired into tool implementations.
- No explicit UX for semantic-fallback; if semantic initialization fails, results don’t indicate keyword-only mode.

Suggestions aligned with the RAG plan
- Wire discovery into `query_security_data` and `call_api_endpoint`:
  - Pre-call: validate/normalize path via `hybridSearch`; if unknown, propose top-3 with required params and ready cURL.
  - On error: re-query using failing path + status to suggest near-miss endpoints and missing params.
  - Return a compact JSON block for deterministic next actions (operationId, method, path, params, curl).
- Avoid hard-coded counts in descriptions; compute via `getEndpointCount()` or omit.
- Add graceful semantic fallback with a visible note (“semantic disabled; keyword-only retrieval used”).
- Optional: enrich embeddings with params/description/cURL lines; add light reranking for top candidates; add version/deprecation bias and confidence score.

Quick fixes to implement next
- Replace hard-coded endpoint counts in both discovery tools with dynamic counts or remove fixed numbers.
- Add pre-call validation and suggestion flow to `query_security_data` using `ApiReferenceClient`.
- Add keyword-only fallback (with UX flag) when semantic model is unavailable.
