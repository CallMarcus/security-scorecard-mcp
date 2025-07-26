# Security Scorecard MCP

This repository contains a compiled Model Context Protocol (MCP) server that integrates with the [SecurityScorecard REST API](https://securityscorecard.readme.io/). It exposes a set of MCP tools for retrieving company scorecards, analyzing findings and generating remediation plans.

The `build` directory ships with the compiled JavaScript server (`build/index.js`). Documentation, debugging helpers and architecture references are in `build_docs/`.

## Quick setup

Run the provided setup script to verify your Node.js installation, collect the
required configuration values and launch the server:

```bash
./setup.sh
```

On Windows use `setup.ps1` instead. The script writes the entered values to a
`.env` file so subsequent runs can reuse them.

## Running the server manually

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

## Testing API Endpoints

A small helper script `build_docs/api_test_tool.js` allows testing any SecurityScorecard REST endpoint. Provide the endpoint path and optionally your domain and API token. The `{domain}` placeholder inside the endpoint will be replaced with your domain.

```bash
# Example
node build_docs/api_test_tool.js /companies/{domain}/issues?limit=5 \
  --domain company.com --token YOUR_TOKEN
```

The script prints the HTTP status and a short preview of the response so you can validate what the API returns before integrating a new MCP tool.
