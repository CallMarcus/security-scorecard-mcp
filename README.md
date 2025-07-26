# Security Scorecard MCP

This repository contains a compiled Model Context Protocol (MCP) server that integrates with the [SecurityScorecard REST API](https://securityscorecard.readme.io/). It exposes a set of MCP tools for retrieving company scorecards, analyzing findings and generating remediation plans.

The `build` directory ships with the compiled JavaScript server (`build/index.js`). Documentation, debugging helpers and architecture references are in `build_docs/`.

## Branch workflow

The `main` branch contains the stable, production-ready code. Active development
happens on the `dev` branch where new features and fixes are tested before being
merged back into `main`.

## Quick setup

Run the provided setup script to verify your Node.js installation, collect the
required configuration values and launch the server:

```bash
./setup.sh
```

On Windows use `setup.ps1` instead. The script writes the entered values to a
`.env` file so subsequent runs can reuse them.

## Release Channels

`setup.sh` and `setup.ps1` download the latest build before starting the server.
By default they fetch the stable release. Pass `--dev` to switch to the
development channel.

```bash
# stable release
./setup.sh

# development build
./setup.sh --dev
```

On Windows 11 run:

```powershell
# stable release
.\setup.ps1

# development build
.\setup.ps1 --dev
```

You can change channels later by running the update script with the same flag.

## Updating MCP

Run the update script to download the latest tagged release and refresh the
compiled files:

```bash
scripts/update.sh
```

On Windows 11 run:

```powershell
.\scripts\update.ps1
```

Add `--dev`/`-Dev` to either command to pull the most recent development build.

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

## Sample Claude Desktop configuration

Claude Desktop looks for its configuration file at `%APPDATA%/Claude/claude_desktop_config.json` on Windows. Below is a minimal example that references this MCP server. Replace the placeholder values with your own token and default domain.

```json
{
  "servers": {
    "security-scorecard-enterprise": {
      "command": "node",
      "args": ["C:\\Temp\\scorecard\\build\\index.js"],
      "env": {
        "SECURITY_SCORECARD_API_TOKEN": "YOUR_TOKEN_HERE",
        "COMPANY_DOMAIN": "example.com"
      },
      "shell": false
    }
  },
  "defaultServer": "security-scorecard-enterprise"
}
```

You can also find this example at `build_docs/claude_desktop_config.sample.json`.

## MCP tools

The MCP server exposes several tools that map to SecurityScorecard API queries.
Invoke them using the MCP `call_tool` request type.

- **get_findings_by_category** - Fetch current findings and group them by
  SecurityScorecard factor to pinpoint weak areas.

Example request:

```json
{
  "name": "get_findings_by_category",
  "arguments": {"domain": "example.com"}
}
```

