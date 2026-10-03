#!/usr/bin/env bash
set -e

# Verify Node.js 18+ is installed
if ! command -v node >/dev/null 2>&1; then
  echo "Error: Node.js 18+ is required but not found." >&2
  exit 1
fi

NODE_VERSION=$(node --version | sed 's/v//')
NODE_MAJOR=${NODE_VERSION%%.*}
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "Error: Node.js 18+ is required. Found $(node --version)." >&2
  exit 1
fi

# Pull latest release files before starting
./scripts/update.sh

# Prompt for configuration
read -p "Enter company domain: " COMPANY_DOMAIN
read -s -p "Enter SecurityScorecard API token: " SECURITY_SCORECARD_API_TOKEN
echo
read -p "Default issue types (comma-separated): " DEFAULT_ISSUE_TYPES

REQUEST_CACHE_TTL_MS="${REQUEST_CACHE_TTL_MS:-300000}"
REQUESTS_PER_INTERVAL="${REQUESTS_PER_INTERVAL:-5}"
REQUEST_INTERVAL_MS="${REQUEST_INTERVAL_MS:-1000}"
REQUEST_BURST_LIMIT="${REQUEST_BURST_LIMIT:-$REQUESTS_PER_INTERVAL}"

export COMPANY_DOMAIN
export SECURITY_SCORECARD_API_TOKEN
export DEFAULT_ISSUE_TYPES
export REQUEST_CACHE_TTL_MS
export REQUESTS_PER_INTERVAL
export REQUEST_INTERVAL_MS
export REQUEST_BURST_LIMIT

# Persist to .env for future runs
cat > .env <<EOV
COMPANY_DOMAIN="$COMPANY_DOMAIN"
SECURITY_SCORECARD_API_TOKEN="$SECURITY_SCORECARD_API_TOKEN"
DEFAULT_ISSUE_TYPES="$DEFAULT_ISSUE_TYPES"
REQUEST_CACHE_TTL_MS="$REQUEST_CACHE_TTL_MS"
REQUESTS_PER_INTERVAL="$REQUESTS_PER_INTERVAL"
REQUEST_INTERVAL_MS="$REQUEST_INTERVAL_MS"
REQUEST_BURST_LIMIT="$REQUEST_BURST_LIMIT"
EOV

# Launch the MCP server
node build/index.js
