# SecurityScorecard MCP Server

**SecurityScorecard MCP Server** brings the [SecurityScorecard](https://securityscorecard.readme.io/) platform into Claude Desktop (and any MCP-compatible client) as a conversational interface for day-to-day security operations. It exposes 9 purpose-built tools for issue analysis, asset inventory, email-security validation, and risk prioritization, with token-efficient response modes (minimal / standard / detailed) so an LLM can drill from a 50-token snapshot down to a full report. For anything the specialized tools don't cover, a hybrid semantic + keyword search over 628 indexed API endpoints lets the model discover and call the right endpoint on the fly.

## Quick Start (Windows 11)

### Prerequisites

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **SecurityScorecard API Token** - Get from your [SecurityScorecard dashboard](https://platform.securityscorecard.io/)

### Installation

```powershell
# Clone the repository
git clone https://github.com/CallMarcus/security-scorecard-mcp.git
cd security-scorecard-mcp

# Install dependencies
npm install

# Build (use build:fast to avoid memory issues)
npm run build:fast
```

### Configure Claude Desktop

Edit `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "security-scorecard": {
      "command": "node",
      "args": ["C:\\path\\to\\security-scorecard-mcp\\build\\index.js"],
      "env": {
        "SECURITY_SCORECARD_API_TOKEN": "your-api-token-here",
        "COMPANY_DOMAIN": "example.com"
      }
    }
  }
}
```

**Important:** Replace the path and credentials with your actual values, then restart Claude Desktop.

## Available Tools

The server (`index.js`) provides 9 specialized tools optimized for Claude Desktop:

| Tool | Purpose |
|------|---------|
| `security_dashboard` | Score, grade, and key security metrics |
| `analyze_security_risks` | Issue prioritization and risk analysis |
| `create_improvement_plan` | Actionable remediation roadmaps |
| `discover_assets` | Asset inventory with security context |
| `analyze_email_security` | SPF/DMARC/DKIM analysis |
| `api_discovery` | Search 628+ API endpoints with hybrid semantic/keyword search |
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

This searches 628 indexed endpoints and returns matching paths with confidence scores, required parameters, and curl examples.

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
  index.jsonl            # Endpoint index (628 endpoints)
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

### Claude Desktop doesn't see the MCP

1. Check the config path: `%APPDATA%\Claude\claude_desktop_config.json`
2. Verify the path to `index.js` is correct
3. Restart Claude Desktop completely

### API returns 401 Unauthorized

Your API token is invalid or expired. Get a new one from SecurityScorecard dashboard.

## License

MIT

## Links

- [SecurityScorecard API Docs](https://securityscorecard.readme.io/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Report Issues](https://github.com/CallMarcus/security-scorecard-mcp/issues)
