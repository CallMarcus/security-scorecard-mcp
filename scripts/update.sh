#!/usr/bin/env bash
set -euo pipefail

OWNER="CallMarcus"
REPO="security-scorecard-mcp"

API="https://api.github.com/repos/$OWNER/$REPO/releases/latest"
if [[ "${1:-}" == "--dev" ]]; then
  API="https://api.github.com/repos/$OWNER/$REPO/releases/tags/dev"
fi

TOKEN=${GITHUB_TOKEN:-}
CURL_ARGS=("-fsSL")
if [[ -n "$TOKEN" ]]; then
  CURL_ARGS+=("-H" "Authorization: token $TOKEN")
fi

if ! info=$(curl "${CURL_ARGS[@]}" "$API"); then
  echo "Failed to retrieve release info from $API" >&2
  echo "Check your network connection or verify that the repository has published releases." >&2
  exit 1
fi
TAG=$(echo "$info" | jq -r .tag_name)
ZIP=$(echo "$info" | jq -r .zipball_url)

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
curl "${CURL_ARGS[@]}" "$ZIP" -o "$TMP/src.zip"
unzip -q "$TMP/src.zip" -d "$TMP"
DIR=$(find "$TMP" -maxdepth 1 -mindepth 1 -type d | head -n 1)

rm -rf build build_docs
cp -r "$DIR/build" .
cp -r "$DIR/build_docs" .

echo "Updated MCP to $TAG"
