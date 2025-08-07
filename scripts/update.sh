#!/usr/bin/env bash
set -euo pipefail

OWNER="CallMarcus"
REPO="security-scorecard-mcp"

STABLE_API="https://api.github.com/repos/$OWNER/$REPO/releases/latest"
DEV_API="https://api.github.com/repos/$OWNER/$REPO/releases/tags/dev"
API="$STABLE_API"
if [[ "${1:-}" == "--dev" ]]; then
  API="$DEV_API"
fi

TOKEN=${GITHUB_TOKEN:-}
CURL_ARGS=("-fsSL")
if [[ -n "$TOKEN" ]]; then
  CURL_ARGS+=("-H" "Authorization: token $TOKEN")
fi

if ! info=$(curl "${CURL_ARGS[@]}" "$API"); then
  if [[ "$API" == "$STABLE_API" ]]; then
    echo "No stable release found. Falling back to development build." >&2
    if ! info=$(curl "${CURL_ARGS[@]}" "$DEV_API"); then
      echo "Failed to retrieve release info from $DEV_API" >&2
      echo "Check your network connection or verify that the repository has published releases." >&2
      exit 1
    fi
  else
    echo "Failed to retrieve release info from $API" >&2
    echo "Check your network connection or verify that the repository has published releases." >&2
    exit 1
  fi
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
