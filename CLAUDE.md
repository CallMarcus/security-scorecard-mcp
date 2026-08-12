# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Model Context Protocol (MCP) server that integrates with the SecurityScorecard REST API for **operational security work** - managing findings, analyzing issues, and working with security data.

The server (`src/index.ts`) provides **9 specialized tools** for operational workflows with 90% token reduction, using the MCP SDK v1.29.0+ with the modern `McpServer` API.

## Current Setup

**Primary Use Case:** Operational work with SecurityScorecard findings - issue analysis, asset management, email security validation, and security data queries.

**API Reference Integration:** When you need to make complex API calls beyond the 9 specialized tools, use the `query_security_data` tool. This tool integrates with the API discovery system to help find the correct endpoint syntax and parameters for SecurityScorecard API calls.

## Commands

### Building and Running

```bash
# Build TypeScript to JavaScript (tsc)
npm run build

# Fast build using esbuild (recommended - low memory, 164ms)
npm run build:fast

# Run the server
npm start

# Run tests
npm test
```

### API Reference Management

The project includes a **self-contained** API reference system with hybrid search (semantic + keyword) for endpoint discovery. All API documentation and embeddings are stored locally in `docs/api/`.

```bash
# Fetch latest Swagger spec from SecurityScorecard (interactive)
npm run api:fetch

# Regenerate docs from api-docs.json
npm run api:generate

# Regenerate semantic embeddings
npm run api:embed

# Full update: regenerate docs + embeddings
npm run api:update

# Complete workflow: fetch + update + build
npm run api:full

# Development workflow (update + build)
npm run dev:api
```

**Important:** The `api:embed` script uses the `@huggingface/transformers` MiniLM model to generate semantic embeddings. Run this whenever `docs/api/index.jsonl` changes to keep search results accurate.

### Validation

```bash
# Validate MCP tool registrations
npm run validate

# Run basic usage validation
npm run api:validate
```

### Testing Individual Files

```bash
# Run specific test file
node --test tests/basic_validation.test.js

# Run TypeScript tests
npm run test:ts
```

## Architecture

### Server: `src/index.ts`

- 9 specialized MCP tools focused on operational security workflows
- Response modes: minimal (15-50 tokens), standard (200-300 tokens), detailed (800+ tokens)
- Cross-tool data validation and completeness checking
- **API discovery integration** for complex queries via `query_security_data` tool
- Focus: Daily operations, issue analysis, asset management, email security

### Key Architectural Components

**1. API Client Layer (`src/api/client.ts`)**
- `SecurityScorecardApiClient` - Typed client wrapping the SecurityScorecard REST API
- Handles authentication, request building, and response parsing
- Organized by API categories: portfolios, companies, factors, issues, history, assets
- Uses `fetch` with Bearer token authentication

**2. Shared Business Logic**
- `src/get_findings_by_category.ts` - Groups security findings by SecurityScorecard factors
- `src/asset_management.ts` - Asset inventory, analysis, and comparison utilities
- `src/api_reference.ts` - API endpoint metadata lookup

**3. API Discovery System (`src/integration/`) - KEY FOR OPERATIONAL WORK**

This system helps find the correct syntax for complex SecurityScorecard API calls when the specialized tools don't cover your needs.

- `api-reference-client.ts` - Hybrid search (semantic + keyword) with synonym expansion, field-boosted scoring, version bias, and confidence scores. Invoked by `query_security_data` and `api_discovery` tools.
- `api-reference-embeddings.ts` - Pre-computed MiniLM embeddings cached in `docs/api/index-embeddings.json`. Run `npm run api:embed` after updating `docs/api/index.jsonl`.
- `api-schema.ts` - Schema extraction from api-docs.json (Swagger 2.0). Key methods: `getSchemaByOperationId()`, `getSchemaByPath()`, `getSchemaDescription()`.

**Use API discovery when** the 9 specialized tools don't cover your needs, or you're unsure of endpoint syntax/parameters.

**4. MCP Server Implementation Pattern**
The server uses `McpServer` + `registerTool()` with Zod input schemas and `StdioServerTransport`. See `src/index.ts` for the canonical pattern.

### Type Definitions

**`src/types/api.ts`** - Shared TypeScript interfaces for API requests/responses
- `RequestOptions`, `ApiResponse` - Generic API communication types
- Use these when extending the client or adding new endpoints

### Response Mode Pattern

Tools implement 3 tiers: **minimal** (15-50 tokens, no headers), **standard** (200-300 tokens, key insights), **detailed** (800+ tokens, full analysis). Claude Desktop escalates as needed during conversations.

## Dependencies

**Runtime:** `@modelcontextprotocol/sdk` ^1.29.0, `@huggingface/transformers` ^4.2.0, `dotenv` ^17.4.1, `zod` ^4.3.6

**Dev:** `esbuild` ^0.28.0, `typescript` ^7.0.2, `@types/node` ^26.1.1

**Node.js:** >=20 required

## Environment Variables

Required:
- `SECURITY_SCORECARD_API_TOKEN` - Your SecurityScorecard API token (get from dashboard)

Optional:
- `COMPANY_DOMAIN` - Default domain for queries (e.g., "example.com")
- `DEFAULT_ISSUE_TYPES` - Comma-separated issue types for default scanning
- `DEBUG_MODE` - Set to "true" for verbose logging
- `API_DISCOVERY_KEYWORD_WEIGHT` - Weight for keyword search (default: 0.35)
- `API_DISCOVERY_SEMANTIC_WEIGHT` - Weight for semantic search (default: 0.65)
- `SCORECARD_API_REFERENCE_PATH` - Override path to API docs (default: uses local `docs/api/`)
- `REQUEST_CACHE_TTL_MS` - Cache duration in milliseconds (default: 300000)
- `REQUESTS_PER_INTERVAL` - Rate limit: requests per interval (default: 5)
- `REQUEST_INTERVAL_MS` - Rate limit: interval length in ms (default: 1000)
- `REQUEST_BURST_LIMIT` - Rate limit: max burst size (default: 5)
- `SCORECARD_PAGE_SIZE` - Items per API page (max 50, default: 50)

## Development Workflow

### Adding a New Tool

1. Add tool registration in `src/index.ts` `setupTools()` method (follow existing tools as pattern)
2. Include all 3 response modes (minimal/standard/detailed) and `annotations` metadata
3. Add reusable business logic to shared utilities (`src/asset_management.ts`, etc.)
4. Write tests in `tests/` directory
5. Rebuild: `npm run build:fast`

### Extending the API Client

Add methods to `src/api/client.ts` using the `makeRequest<T>()` pattern with typed responses. Add corresponding tests in `tests/api/`.

### Regenerating API Embeddings

Run `npm run api:embed` after updating `docs/api/index.jsonl`. Uses MiniLM via `@huggingface/transformers`, caches to `docs/api/index-embeddings.json`, and does fast incremental updates for unchanged entries.

## Tool Response Guidelines

- Implement all 3 response modes (see Response Mode Pattern above)
- Include metadata footer: `*Generated: {timestamp}*`
- Use structured markdown; return actionable validation errors
- Include data completeness warnings when cross-tool validation shows inconsistencies

## CI/CD

GitHub Actions workflow (`.github/workflows/node.js.yml`) runs on pushes and PRs to `main`:
- Tests against Node.js 20.x, 22.x, and 24.x
- Runs `npm ci`, `npm run build`, and `npm test`
- 10-minute timeout per job

## Branch Workflow

- `main` - Stable, production-ready code
- `dev` - Active development and feature testing
- Feature branches merge into `dev`, then `dev` merges into `main` after testing

## Project Structure

```
src/
├── index.ts                   # MCP server (9 tools)
├── api/client.ts              # SecurityScorecard API client
├── integration/               # API discovery: hybrid search, embeddings, schema
├── types/api.ts               # Shared TypeScript types
├── get_findings_by_category.ts
├── asset_management.ts
└── api_reference.ts
docs/api/                      # Self-contained API reference (517 endpoints)
tools/                         # update_api_spec.sh - fetch Swagger spec
scripts/                       # Maintenance scripts (PS1/Bash)
tests/                         # Test files (.js and .ts)
build/                         # Compiled output (generated)
```

## Common Patterns

- **Pagination**: Use `client.fetchAllPages()` — handles both SSC styles (footprint: 0-based `page`+`page-size`, which the server ignores and fixes at 50/page; issues: 1-based `page`+`size`, respected). Both return an authoritative `total` that drives the stop condition. `maxPages` cap with `truncated` flag; `paginationStyleFor(path)` picks the style. Cursor responses (`next_cursor`/`next` URL) are followed automatically if an endpoint returns them.
- **Error handling**: Wrap API calls in try-catch, return `{ isError: true }` with user-friendly messages.
- **Data validation**: Use `validate_data_completeness` to cross-verify results; warn when confidence < 0.8.

## Gotchas

- Since TypeScript 7 (native compiler), `npm run build` (tsc) is fast (~3s); `npm run build:fast` (esbuild) remains the default build path
- Run `npm run api:embed` after any changes to `docs/api/index.jsonl`
- `api_discovery` returns structured JSON with confidence scores; use `include_schema: true` for request/response schema details
- `query_security_data` supports `validate_only: true` to verify endpoint syntax without executing, and `fetch_all: true` to follow pagination on GET list endpoints (20-page cap with truncation notice)
