# SSC MCP Server

[![npm version](https://img.shields.io/npm/v/@callmarcus/securityscorecard-mcp.svg)](https://www.npmjs.com/package/@callmarcus/securityscorecard-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A community-built, comprehensive Model Context Protocol (MCP) server that integrates with the [SecurityScorecard API](https://securityscorecard.readme.io/). It runs over stdio, so it works with any MCP-compatible client — Claude Desktop, Claude Code, Cursor, VS Code, and others.

> Published on npm as [`@callmarcus/securityscorecard-mcp`](https://www.npmjs.com/package/@callmarcus/securityscorecard-mcp) and listed in the [MCP Registry](https://registry.modelcontextprotocol.io) as `io.github.CallMarcus/securityscorecard-mcp`.

> **Disclaimer:** This is an independent, community-built open-source project. It is **not affiliated with, endorsed by, sponsored by, or associated with SecurityScorecard, Inc.** in any way. It is built solely against SecurityScorecard's publicly available API documentation. "SecurityScorecard" and all related names, marks, and logos are trademarks of SecurityScorecard, Inc. and are used here for identification purposes only. You must supply your own API credentials and comply with SecurityScorecard's terms of service.

## Quick Start

### Prerequisites

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **SecurityScorecard API Token** - Get from your [SecurityScorecard dashboard](https://platform.securityscorecard.io/)

### Option A — Install from npm (recommended)

No clone or build required. The server runs over stdio via `npx`, so any MCP-compatible client can launch it. `npx -y` always fetches the latest published version.

**Most clients** — Claude Desktop, Cursor, Cline, Windsurf, and others — share the same `mcpServers` JSON. Add this block to the client's MCP config:

```json
{
  "mcpServers": {
    "security-scorecard": {
      "command": "npx",
      "args": ["-y", "@callmarcus/securityscorecard-mcp"],
      "env": {
        "SECURITY_SCORECARD_API_TOKEN": "your-api-token-here",
        "COMPANY_DOMAIN": "example.com"
      }
    }
  }
}
```

Where that config file lives:

| Client | Config file |
|--------|-------------|
| Claude Desktop (Windows) | `%APPDATA%\Claude\claude_desktop_config.json` |
| Claude Desktop (macOS) | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Cursor | `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project) |

Replace the credentials with your own, then restart the client.

**Claude Code** — add it from the CLI instead:

```bash
claude mcp add security-scorecard \
  --env SECURITY_SCORECARD_API_TOKEN=your-api-token-here \
  --env COMPANY_DOMAIN=example.com \
  -- npx -y @callmarcus/securityscorecard-mcp
```

On Windows, wrap the launcher in `cmd /c`: `... -- cmd /c npx -y @callmarcus/securityscorecard-mcp`.

**VS Code** (Copilot) — uses a `servers` key with an explicit `type`, in `.vscode/mcp.json`:

```json
{
  "servers": {
    "security-scorecard": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@callmarcus/securityscorecard-mcp"],
      "env": {
        "SECURITY_SCORECARD_API_TOKEN": "your-api-token-here",
        "COMPANY_DOMAIN": "example.com"
      }
    }
  }
}
```

### Option B — Run from source (for development)

```bash
# Clone the repository
git clone https://github.com/CallMarcus/security-scorecard-mcp.git
cd security-scorecard-mcp

# Install dependencies
npm install

# Build (use build:fast to avoid memory issues)
npm run build:fast
```

Then point your MCP client at the local build. For clients that use the `mcpServers` format (Claude Desktop, Cursor, …):

```json
{
  "mcpServers": {
    "security-scorecard": {
      "command": "node",
      "args": ["/path/to/security-scorecard-mcp/build/index.js"],
      "env": {
        "SECURITY_SCORECARD_API_TOKEN": "your-api-token-here",
        "COMPANY_DOMAIN": "example.com"
      }
    }
  }
}
```

**Important:** Replace the path and credentials with your actual values, then restart your MCP client. (For Claude Code, run `claude mcp add security-scorecard --env SECURITY_SCORECARD_API_TOKEN=your-api-token-here -- node /path/to/security-scorecard-mcp/build/index.js`.)

## Available Tools

The server (`index.js`) provides 9 specialized tools:

| Tool | Purpose |
|------|---------|
| `security_dashboard` | Score, grade, and key security metrics |
| `analyze_security_risks` | Issue prioritization and risk analysis |
| `create_improvement_plan` | Actionable remediation roadmaps |
| `discover_assets` | Asset inventory with security context |
| `analyze_email_security` | SPF/DMARC/DKIM analysis |
| `api_discovery` | Search 507 API endpoints with hybrid semantic/keyword search |
| `analyze_issue_types` | Granular issue type breakdowns |
| `validate_data_completeness` | Cross-tool data verification |
| `query_security_data` | Direct API access with discovery |

### Response Modes

Each tool supports three response modes for token efficiency:
- **minimal** - Quick answers (15-50 tokens)
- **standard** - Overview with context (200-300 tokens)
- **detailed** - Comprehensive analysis (800+ tokens)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SECURITY_SCORECARD_API_TOKEN` | Yes | Your API token |
| `COMPANY_DOMAIN` | No | Default domain for queries |
| `DEBUG_MODE` | No | Set `true` for verbose logging |

Optional rate limiting and caching:

```
REQUEST_CACHE_TTL_MS=300000
REQUESTS_PER_INTERVAL=5
REQUEST_INTERVAL_MS=1000
```

## API Discovery

The server includes hybrid search (semantic + keyword) for finding SecurityScorecard API endpoints:

```
Use api_discovery to search for "email security"
```

This searches 507 indexed endpoints and returns matching paths with confidence scores, required parameters, and curl examples.

To update the API reference after changes:

```bash
npm run api:embed    # Regenerate semantic embeddings
npm run api:update   # Regenerate docs + embeddings
```

## Development

### Build Commands

```bash
npm run build:fast   # Recommended - uses esbuild (~130ms)
npm run build        # TypeScript compiler (may OOM on some systems)
npm test             # Run tests
```

### Project Structure

```
src/
  index.ts               # MCP server (9 tools)
  api/client.ts          # SecurityScorecard API client
  integration/           # API discovery system
docs/api/                # Self-contained API reference
  index.jsonl            # Endpoint index (507 endpoints)
  index-embeddings.json  # Semantic search embeddings
build/                   # Compiled JavaScript
```

### Testing

```bash
npm test             # Run test suite
```

## Troubleshooting

### Build fails with out of memory

Use the fast build instead:
```bash
npm run build:fast
```

### "Cannot find module" errors

Reinstall dependencies:
```bash
rm -rf node_modules
npm install
npm run build:fast
```

### Your client doesn't see the server

1. Double-check the config file location for your client (see [Quick Start](#quick-start))
2. For a from-source install, verify the path to `build/index.js` is correct
3. Restart the client completely
4. Sanity-check that the server starts on its own: `npx -y @callmarcus/securityscorecard-mcp` (it should launch and wait silently on stdio)

### API returns 401 Unauthorized

Your API token is invalid or expired. Get a new one from SecurityScorecard dashboard.

## License

MIT

## Links

- [SecurityScorecard API Docs](https://securityscorecard.readme.io/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Report Issues](https://github.com/CallMarcus/security-scorecard-mcp/issues)
