# Security Scorecard MCP

This repository contains a compiled Model Context Protocol (MCP) server that integrates with the [SecurityScorecard REST API](https://securityscorecard.readme.io/). It exposes a set of MCP tools for retrieving company scorecards, analyzing findings and generating remediation plans.

The `build` directory ships with the compiled JavaScript server (`build/index.js`). Documentation, debugging helpers and architecture references are in `build_docs/`.

## Running the server

1. Install Node.js (v18 or newer).
2. Set your API token in the environment:
   ```bash
   export SECURITY_SCORECARD_API_TOKEN="<your-token>"
   # optional default domain for queries
   export COMPANY_DOMAIN="example.com"
   ```
3. Start the MCP server:
   ```bash
   node build/index.js
   ```

The server communicates over stdio and is typically used by clients such as Claude Desktop or other MCP-compatible tools.

Refer to the files in `build_docs/` for API references, debugging instructions and the architecture overview.
