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

# Determine release channel (stable is default)
CHANNEL=""
if [[ "${1:-}" == "--dev" ]]; then
  CHANNEL="--dev"
fi

# Pull latest release files before starting
./scripts/update.sh $CHANNEL

# Prompt for configuration
read -p "Enter company domain: " COMPANY_DOMAIN
read -s -p "Enter SecurityScorecard API token: " SECURITY_SCORECARD_API_TOKEN
echo

export COMPANY_DOMAIN
export SECURITY_SCORECARD_API_TOKEN

# Persist to .env for future runs
cat > .env <<EOV
COMPANY_DOMAIN="$COMPANY_DOMAIN"
SECURITY_SCORECARD_API_TOKEN="$SECURITY_SCORECARD_API_TOKEN"
EOV

# Launch the MCP server
node build/index.js
