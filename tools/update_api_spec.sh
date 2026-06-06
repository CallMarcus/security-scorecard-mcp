#!/bin/bash
# Update SecurityScorecard API Specification
# Fetches the latest Swagger 2.0 spec from api.securityscorecard.io

set -e

API_URL="https://api.securityscorecard.io/api-docs"
SPEC_FILE="api-docs.json"
BACKUP_DIR=".backups"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "[*] SecurityScorecard API Spec Updater"
echo "======================================"
echo ""

# Get current version if file exists
if [ -f "$SPEC_FILE" ]; then
    CURRENT_VERSION=$(jq -r '.info.version' "$SPEC_FILE" 2>/dev/null || echo "unknown")
    echo "[i] Current version: $CURRENT_VERSION"
else
    CURRENT_VERSION="none"
    echo "[i] No existing api-docs.json found"
fi

# Fetch new version to temporary file
echo "[*] Fetching latest spec from $API_URL..."
if ! curl -f -s -o "api-docs.json.tmp" "$API_URL"; then
    echo -e "${RED}[!] Failed to fetch API spec${NC}"
    echo "   Make sure you have network access to api.securityscorecard.io"
    rm -f "api-docs.json.tmp"
    exit 1
fi

# Validate it's valid JSON
if ! jq empty "api-docs.json.tmp" 2>/dev/null; then
    echo -e "${RED}[!] Downloaded file is not valid JSON${NC}"
    rm -f "api-docs.json.tmp"
    exit 1
fi

# Get new version
NEW_VERSION=$(jq -r '.info.version' "api-docs.json.tmp" 2>/dev/null || echo "unknown")
echo "[i] Latest version:  $NEW_VERSION"
echo ""

# Compare versions
if [ "$CURRENT_VERSION" = "$NEW_VERSION" ]; then
    echo -e "${YELLOW}[i] No update needed - versions match${NC}"
    rm -f "api-docs.json.tmp"
    exit 0
fi

# Backup existing file if it exists
if [ -f "$SPEC_FILE" ]; then
    mkdir -p "$BACKUP_DIR"
    BACKUP_FILE="$BACKUP_DIR/api-docs-$CURRENT_VERSION-$(date +%Y%m%d-%H%M%S).json"
    echo "[*] Backing up current version to $BACKUP_FILE"
    cp "$SPEC_FILE" "$BACKUP_FILE"
fi

# Replace with new version
mv "api-docs.json.tmp" "$SPEC_FILE"
echo -e "${GREEN}[+] Updated api-docs.json from $CURRENT_VERSION -> $NEW_VERSION${NC}"
echo ""

# Ask if user wants to regenerate docs
echo "[?] Regenerate documentation?"
echo "   This will run: npm run api:update"
read -p "   Continue? [y/N] " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "[*] Running npm run api:update..."
    npm run api:update
    echo ""
    echo -e "${GREEN}[+] Documentation regenerated successfully${NC}"
    echo ""
    echo "[i] Next steps:"
    echo "   1. Review the changes: git status"
    echo "   2. Test the updated docs"
    echo "   3. Commit changes: git add . && git commit -m 'chore: Update API spec to v$NEW_VERSION'"
else
    echo ""
    echo -e "${YELLOW}[i] Skipped regeneration${NC}"
    echo "   Run manually when ready: npm run api:update"
fi

echo ""
echo "[+] Done!"
