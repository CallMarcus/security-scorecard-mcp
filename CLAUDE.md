# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Model Context Protocol (MCP) server that integrates with the SecurityScorecard REST API for **operational security work** - managing findings, analyzing issues, and working with security data.

The project provides **two server implementations**:

1. **Streamlined** (`simplified-index.ts`) - **CURRENT SETUP** - 8 specialized tools for operational workflows with 90% token reduction
2. **Comprehensive** (`index.ts`) - Full-featured with 11+ tools including executive reporting (not currently in use)

Both implementations use the MCP SDK v1.17.4+ with the modern `McpServer` API and MCP 2025-06-18 schema compliance.

## Current Setup

**Active Configuration:** Claude Desktop is configured with the **streamlined version** (`simplified-index.ts`)

**Primary Use Case:** Operational work with SecurityScorecard findings - issue analysis, asset management, email security validation, and security data queries.

**API Reference Integration:** When you need to make complex API calls beyond the 8 specialized tools, use the `query_security_data` tool. This tool integrates with the API discovery system to help find the correct endpoint syntax and parameters for SecurityScorecard API calls.

## Commands

### Building and Running

```bash
# Build TypeScript to JavaScript
npm run build

# Run the streamlined server (recommended)
npm start
# or explicitly:
npm run start:simplified

# Run the comprehensive server
npm run start:original

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

**Important:** The `api:embed` script uses `@xenova/transformers` MiniLM model to generate semantic embeddings. Run this whenever `docs/api/index.jsonl` changes to keep search results accurate.

### Testing Individual Files

```bash
# Run specific test file
node --test tests/basic_validation.test.js

# Run TypeScript tests
npm run test:ts
```

## Architecture

### Dual Server Design

The codebase maintains two complete MCP server implementations that share common utilities but differ in tool registration and response strategies:

**`src/simplified-index.ts` (Streamlined) - CURRENT SETUP**
- 8 specialized MCP tools focused on operational security workflows
- Response modes: minimal (15-50 tokens), standard (200-300 tokens), detailed (800+ tokens)
- Cross-tool data validation and completeness checking
- **API discovery integration** for complex queries via `query_security_data` tool
- Focus: Daily operations, issue analysis, asset management, email security

**Core Operational Tools (8):**
1. `security_dashboard` - Score, grade, and key metrics
2. `analyze_security_risks` - Issue prioritization and risk analysis
3. `create_improvement_plan` - Actionable remediation roadmaps
4. `discover_assets` - Asset inventory with security context
5. `analyze_email_security` - SPF/DMARC/DKIM analysis
6. `analyze_issue_types` - Granular issue type breakdowns
7. `validate_data_completeness` - Cross-tool data verification
8. `query_security_data` - **Direct API access with discovery assistance**

**`src/index.ts` (Comprehensive) - NOT IN CURRENT USE**
- 11+ registered MCP tools with full SecurityScorecard API coverage
- Standard response sizes (200-1000+ tokens)
- Includes ROI calculations, strategic roadmaps, and executive reporting
- Best for: Complete analysis, strategic planning, advanced workflows (when needed)

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

- `api-reference-client.ts` - Hybrid search (semantic + keyword) over API endpoints
  - **Usage:** Automatically invoked by `query_security_data` tool when you ask questions like "How do I get credential rotation policies?"
  - Returns endpoint path, HTTP method, required parameters, and documentation
  - Ranks results by relevance (hybrid score combining semantic understanding + keyword matching)

- `api-reference-embeddings.ts` - Generates and caches embeddings for semantic search
  - Enables natural language queries: "credential rotation" → finds `/v1/credential-policies`
  - Pre-computed for performance (cached in `docs/api/index-embeddings.json`)

**When to rely on API discovery:**
- You need an endpoint that isn't covered by the 8 specialized tools
- You're unsure of the exact parameter names or query syntax
- You want to explore what data is available for a specific security domain
- You need to construct a complex query with multiple filters

**Configurable via environment variables:**
- `API_DISCOVERY_KEYWORD_WEIGHT` (default: 0.35) - Weight for exact text matching
- `API_DISCOVERY_SEMANTIC_WEIGHT` (default: 0.65) - Weight for semantic understanding

**4. MCP Server Implementation Pattern**
Both servers follow this structure:
```typescript
// Initialize MCP server with 2025-06-18 schema
const server = new McpServer({
  name: "security-scorecard-[variant]",
  version: "4.1.0",
  protocolVersion: "2025-06-18"
});

// Register tools with Zod schemas
server.registerTool("tool_name", {
  title: "Display Name",
  description: "Tool description with usage guidance",
  annotations: { category, complexity, dataSource, ... },
  inputSchema: {
    param: z.string().describe("Parameter description")
  }
}, async (args) => {
  // Implementation
  return {
    content: [{ type: "text", text: "..." }]
  };
});

// Connect and run
const transport = new StdioServerTransport();
await server.connect(transport);
```

### Type Definitions

**`src/types/api.ts`** - Shared TypeScript interfaces for API requests/responses
- `RequestOptions`, `ApiResponse` - Generic API communication types
- Use these when extending the client or adding new endpoints

### Response Mode Pattern (Streamlined Only)

Tools in `simplified-index.ts` implement a 3-tier response strategy:

```typescript
if (response_mode === "minimal") {
  // Compact answer: 15-50 tokens, no markdown headers
  return { content: [{ type: "text", text: "domain: Score 78/100, Grade C" }] };
}

if (response_mode === "standard") {
  // Overview: 200-300 tokens, key insights
  return { content: [{ type: "text", text: "## Security Overview\n..." }] };
}

// detailed mode (default for first queries)
// Comprehensive: 800+ tokens, full analysis with recommendations
```

Claude Desktop intelligently escalates from minimal → standard → detailed as needed during conversations.

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

**Default:** Add new operational tools to `simplified-index.ts` (current setup)
**Only if:** The tool is specifically for executive reporting or strategic analysis, add to `index.ts`

1. Open `src/simplified-index.ts` and add tool registration in the `setupTools()` method:
```typescript
this.server.registerTool("tool_name", {
  title: "Display Name",
  description: "Clear description focusing on operational use case",
  annotations: {
    category: "operational-category",  // e.g., "issue-analysis", "asset-management"
    complexity: "low|medium|high",
    dataSource: "SecurityScorecard API"
  },
  inputSchema: {
    // Define parameters with Zod
    domain: z.string().describe("Company domain"),
    response_mode: z.enum(["minimal", "standard", "detailed"])
      .describe("Response detail level")
      .default("minimal"),  // Always start with minimal
    optional_param: z.string().optional().describe("Optional parameter")
  }
}, async (args) => {
  const { domain, response_mode = "minimal", optional_param } = args;

  // Implement all 3 response modes for consistency
  if (response_mode === "minimal") {
    return { content: [{ type: "text", text: "Compact result" }] };
  }

  if (response_mode === "standard") {
    return { content: [{ type: "text", text: "## Standard Overview\n..." }] };
  }

  // Detailed mode
  return { content: [{ type: "text", text: "## Comprehensive Analysis\n..." }] };
});
```
2. Add business logic to shared utilities if reusable across both servers (`src/asset_management.ts`, etc.)
3. Write tests in `tests/` directory
4. Rebuild: `npm run build`
5. Update `README.md` tool documentation if user-facing

### Testing API Endpoints Manually

Use the included API test tool to validate endpoints before integration:

```bash
node build_docs/api_test_tool.js /companies/{domain}/issues?limit=5 \
  --domain example.com --token YOUR_TOKEN
```

The tool auto-fills HTTP method from `build_docs/api_reference.json` and displays endpoint descriptions.

### Extending the API Client

When adding new SecurityScorecard API endpoints:

1. Add method to `src/api/client.ts` in the appropriate category section
2. Follow the pattern of using `makeRequest<T>()` with typed responses
3. Document the method with JSDoc comments
4. Add corresponding test in `tests/api/` directory

Example:
```typescript
/**
 * Get company historical scores
 */
async getCompanyHistory(domain: string, queryParams?: Record<string, any>): Promise<ApiResponse<any>> {
  return this.makeRequest('GET', `/companies/${domain}/history`, { queryParams });
}
```

### Regenerating API Embeddings

After updating the API reference in `docs/api/index.jsonl`:

```bash
npm run api:embed
```

This script:
1. Loads each endpoint definition
2. Derives semantic text (summary + method + path + tag)
3. Generates embeddings using MiniLM model via `@xenova/transformers`
4. Caches results in `docs/api/index-embeddings.json`
5. Reuses existing embeddings when text hasn't changed (fast incremental updates)

## Tool Response Guidelines

When modifying or adding tools to the **streamlined version** (current setup):

1. **Focus on operational utility** - Prioritize actionable security data over strategic analysis
2. **Implement all 3 response modes** (minimal/standard/detailed):
   - Minimal: Direct answers for quick queries (15-50 tokens)
   - Standard: Operational context with key insights (200-300 tokens)
   - Detailed: Comprehensive analysis with remediation guidance (800+ tokens)
3. **Always include metadata footer:** `*Generated: {timestamp} | Schema: 2025-06-18*`
4. **Use structured markdown** for readability (headers, lists, tables)
5. **Return actionable validation errors** with suggestions for alternative approaches
6. **Include data completeness warnings** when cross-tool validation shows inconsistencies
7. **Leverage API discovery** in `query_security_data` to help users find correct endpoint syntax

When modifying the comprehensive version (if needed):
- Prioritize completeness over token efficiency
- Include executive-level strategic context and ROI calculations
- Standard response sizes (200-1000+ tokens)

## Branch Workflow

- `main` - Stable, production-ready code
- `dev` - Active development and feature testing
- Feature branches merge into `dev`, then `dev` merges into `main` after testing

## Project Structure

```
src/
├── index.ts                          # Comprehensive MCP server (11+ tools)
├── simplified-index.ts               # Streamlined MCP server (8 tools, recommended)
├── api/
│   └── client.ts                     # SecurityScorecard API client
├── integration/
│   ├── api-reference-client.ts       # Hybrid search for API discovery
│   └── api-reference-embeddings.ts   # Embedding generation script
├── types/
│   └── api.ts                        # Shared TypeScript types
├── get_findings_by_category.ts       # Factor-based finding organization
├── asset_management.ts               # Asset inventory utilities
└── api_reference.ts                  # Endpoint metadata lookup

docs/api/                             # Self-contained API reference
├── index.jsonl                       # Searchable endpoint index (628 endpoints)
├── index-embeddings.json             # Semantic embeddings cache
└── {tag}/*.md                        # Per-endpoint documentation

tools/
├── update_api_spec.sh                # Fetch latest Swagger from SecurityScorecard
└── split_swagger.py                  # Generate docs from Swagger spec

tests/                                # Test files (both .js and .ts)
build/                                # Compiled JavaScript output
api-docs.json                         # Source Swagger 2.0 specification
```

## Common Patterns

### Pagination Handling

The SecurityScorecard API uses cursor-based pagination. When implementing paginated endpoints:

```typescript
let allItems = [];
let cursor = null;

do {
  const response = await client.makeRequest('GET', endpoint, {
    queryParams: { cursor, size: 50 }
  });
  allItems.push(...response.data.entries);
  cursor = response.data.next_cursor;
} while (cursor);
```

### Error Handling

Always wrap API calls in try-catch and return user-friendly error messages:

```typescript
try {
  const result = await this.client.getCompanyScore(domain);
  // ... process result
} catch (error) {
  return {
    content: [{
      type: "text",
      text: `❌ Failed to fetch security score: ${error.message}`
    }],
    isError: true
  };
}
```

### Data Validation (Streamlined Only)

Use the `validate_data_completeness` tool to cross-verify results:

```typescript
// After fetching data from multiple sources, validate consistency
const validation = await this.validateDataCompleteness(domain);
if (validation.confidence < 0.8) {
  // Include warning in response
}
```

## Operational Workflows

### Using API Discovery for Complex Queries

The `query_security_data` tool in the streamlined server integrates with API discovery to help you find and use the correct endpoints:

**Example workflow:**
1. User asks: "How do I check credential rotation policies?"
2. Tool invokes `ApiReferenceClient.hybridSearch("credential rotation")`
3. Discovery returns: `GET /v1/credential-policies` with parameters and documentation
4. Tool executes the API call with correct syntax
5. Returns data with explanation of what was found

**The tool handles:**
- Endpoint discovery from natural language descriptions
- Parameter validation and suggestions
- HTTP method detection
- Query parameter construction
- Error messages with alternative endpoint suggestions

**When discovery fails:**
The tool suggests:
- Alternative endpoints that might match
- Using specialized tools if available (`analyze_email_security` for SPF/DMARC queries)
- Checking `docs/api/` for manual reference

### Focus on Findings and Issues

For operational security work, the most frequently used tools are:

1. **`analyze_security_risks`** - Identifies top issues by severity and business impact
   - Use for: Daily security reviews, prioritizing remediation work
   - Returns: Issue counts by type, severity breakdown, risk scoring

2. **`analyze_email_security`** - Direct SPF/DMARC/DKIM breakdown
   - Use for: Email authentication compliance checks
   - Returns: Counts of missing/misconfigured email security controls

3. **`analyze_issue_types`** - Granular counts for specific issue types
   - Use for: Tracking remediation progress, compliance reporting
   - Pass specific issue types to get exact counts

4. **`discover_assets`** - Asset inventory with issue context
   - Use for: Understanding attack surface, identifying high-risk assets
   - Includes data completeness validation warnings

5. **`query_security_data`** - Fallback for anything not covered above
   - Use for: Custom queries, exploring new data, complex filtering
   - Leverages API discovery to find correct syntax

## Quick Reference

**Current production setup:**
- Server: `simplified-index.ts` (streamlined version)
- Entry point: `build/simplified-index.js`
- Focus: Operational security workflows (findings, issues, assets)
- Tools: 8 specialized operational tools

**When you need to find an API endpoint:**
1. Use the `query_security_data` tool with a natural language description
2. API discovery will search for matching endpoints using hybrid search
3. The tool will suggest the correct syntax and execute the call
4. If no match found, check `docs/api/` for manual reference

**When extending functionality:**
1. Add tools to `simplified-index.ts` (not `index.ts`)
2. Implement all 3 response modes (minimal/standard/detailed)
3. Focus on operational utility over executive reporting
4. Use API discovery in `query_security_data` for complex endpoint needs
5. Write tests before submitting PRs

**Key files for operational work:**
- `src/simplified-index.ts` - Main server with 8 tools (CURRENT)
- `src/api/client.ts` - SecurityScorecard API client methods
- `src/integration/api-reference-client.ts` - API discovery (hybrid search)
- `src/get_findings_by_category.ts` - Factor-based finding organization
- `src/asset_management.ts` - Asset inventory utilities
- `docs/api/index-embeddings.json` - Cached semantic embeddings for discovery
