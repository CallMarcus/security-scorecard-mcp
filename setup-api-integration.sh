#!/bin/bash

# SecurityScorecard MCP API Integration Setup
echo "🔧 Setting up SecurityScorecard API integration..."

# Check if scorecard-api-reference is available
API_REF_PATH="${SCORECARD_API_REFERENCE_PATH:-../scorecard-api-reference}"

if [ ! -d "$API_REF_PATH" ]; then
    echo "❌ scorecard-api-reference not found at: $API_REF_PATH"
    echo ""
    echo "🎯 Setup Options:"
    echo "1. Set environment variable: export SCORECARD_API_REFERENCE_PATH=/path/to/scorecard-api-reference"
    echo "2. Clone as sibling directory: git clone https://github.com/CallMarcus/scorecard-api-reference.git ../scorecard-api-reference"
    echo "3. Use git submodule: git submodule add https://github.com/CallMarcus/scorecard-api-reference.git api-reference"
    exit 1
fi

# Check if API index exists
INDEX_PATH="$API_REF_PATH/docs/api/index.jsonl"
if [ ! -f "$INDEX_PATH" ]; then
    echo "⚠️  API index not found. Generating documentation..."
    cd "$API_REF_PATH"
    npm install
    npm run spec:split
    cd - > /dev/null
fi

# Test integration
echo "🧪 Testing API integration..."
export SCORECARD_API_REFERENCE_PATH="$API_REF_PATH"

node -e "
const { ApiReferenceClient } = require('./build/integration/api-reference-client.js');

try {
  const client = new ApiReferenceClient();
  const results = client.search('security');
  console.log('✅ Integration successful!');
  console.log('🔍 Available endpoints:', results.length);
  console.log('📊 API coverage: 591 SecurityScorecard endpoints discoverable');
} catch (error) {
  console.log('❌ Integration failed:', error.message);
  process.exit(1);
}
"

echo ""
echo "🎉 Setup complete! Your SecurityScorecard MCP server now has access to 591 API endpoints."
echo ""
echo "🚀 Start the enhanced MCP server:"
echo "   export SCORECARD_API_REFERENCE_PATH=\"$API_REF_PATH\""
echo "   npm run start"
echo ""
echo "🔍 New tool available: api_discovery"
echo "   - Search 591 endpoints with natural language"
echo "   - Filter by method, category, and more"
echo "   - Get cURL examples and documentation"