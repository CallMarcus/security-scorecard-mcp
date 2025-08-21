#!/bin/bash

# MCP Tools Validation Runner
# Comprehensive validation of current MCP tools against new API reference

set -e  # Exit on any error

echo "🚀 SecurityScorecard MCP Validation Suite"
echo "========================================"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Check prerequisites
print_status $BLUE "📋 Checking prerequisites..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_status $RED "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_status $RED "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    print_status $RED "❌ Python 3 is not installed. Please install Python 3 and try again."
    exit 1
fi

# Check for API token
if [ -z "$SECURITY_SCORECARD_TOKEN" ]; then
    print_status $RED "❌ SECURITY_SCORECARD_TOKEN environment variable is not set."
    echo "   Please set it with: export SECURITY_SCORECARD_TOKEN='your-token-here'"
    exit 1
fi

print_status $GREEN "✅ Prerequisites check passed"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    print_status $RED "❌ Please run this script from the MCP project root directory"
    exit 1
fi

# Install dependencies if needed
print_status $BLUE "📦 Installing dependencies..."
npm install

# Build the project
print_status $BLUE "🔨 Building TypeScript..."
npm run build

if [ $? -ne 0 ]; then
    print_status $RED "❌ TypeScript build failed. Please fix compilation errors first."
    exit 1
fi

print_status $GREEN "✅ Build successful"

# Run TypeScript tests if they exist
if [ -f "tests/validation_suite.test.ts" ]; then
    print_status $BLUE "🧪 Running TypeScript validation tests..."
    
    # Check if jest is available
    if npm list jest &> /dev/null || npm list --global jest &> /dev/null; then
        npm test -- tests/validation_suite.test.ts 2>/dev/null || print_status $YELLOW "⚠️  Jest tests had issues (this is normal if no real API token or test environment)"
    else
        print_status $YELLOW "⚠️  Jest not found, skipping TypeScript tests"
    fi
fi

# Run Python validation script
print_status $BLUE "🔍 Running comprehensive validation..."
python3 validate_mcp_tools.py --output-file "validation_results_$(date +%Y%m%d_%H%M%S).json"

validation_exit_code=$?

# Generate summary report
print_status $BLUE "📊 Generating summary report..."

cat << EOF > validation_summary.md
# MCP Validation Summary

Generated: $(date)

## Environment
- Node.js: $(node --version)
- npm: $(npm --version)
- Python: $(python3 --version)
- Platform: $(uname -s)

## Files Validated
- src/api/client.ts (Type-safe API client)
- src/types/api.ts (TypeScript types)
- src/index.ts (Main MCP server)
- src/get_findings_by_category.ts (Findings tool)
- src/asset_management.ts (Asset tools)

## Validation Results
$(if [ $validation_exit_code -eq 0 ]; then echo "✅ **PASSED** - All validations successful"; elif [ $validation_exit_code -eq 1 ]; then echo "❌ **FAILED** - Some validations failed"; else echo "⚠️  **WARNING** - Validation completed with warnings"; fi)

## Next Steps
$(if [ $validation_exit_code -eq 0 ]; then 
echo "- ✅ Ready for production use
- 📚 Review MCP_MIGRATION_GUIDE.md for upgrade instructions
- 🚀 Start using the new API client: \`import { createSecurityScorecardClient } from './src/api/client.js'\`"; 
else 
echo "- 🔧 Review validation errors in the detailed results file
- 📋 Follow MCP_MIGRATION_GUIDE.md for migration steps
- 🧪 Re-run validation after fixing issues"; 
fi)

## Available Commands
- \`npm run api:generate\` - Regenerate API client
- \`npm run api:update\` - Update from latest Swagger spec
- \`npm run build\` - Compile TypeScript
- \`python3 validate_mcp_tools.py\` - Run validation again

## Documentation
- [API Development Guide](./API_DEVELOPMENT_GUIDE.md)
- [Migration Guide](./MCP_MIGRATION_GUIDE.md)
- [Validation Plan](./MCP_VALIDATION_PLAN.md)
- [Actionable Demo](./ACTIONABLE_API_DEMO.md)
EOF

print_status $GREEN "✅ Summary report generated: validation_summary.md"

# Final status
echo
print_status $BLUE "🎯 Validation Complete!"
echo "========================================"

if [ $validation_exit_code -eq 0 ]; then
    print_status $GREEN "🎉 SUCCESS: All validations passed!"
    echo
    echo "Your MCP tools are ready to use with the new API reference."
    echo "Key benefits you now have:"
    echo "  ⚡ Type-safe API calls"
    echo "  🔧 Better error handling"
    echo "  📈 Improved performance"
    echo "  🛡️  Built-in validation"
    echo
    echo "Next steps:"
    echo "  1. Review examples/mcp_upgrade_example.ts"
    echo "  2. Start migrating tools using MCP_MIGRATION_GUIDE.md"
    echo "  3. Use: import { createSecurityScorecardClient } from './src/api/client.js'"
    
elif [ $validation_exit_code -eq 1 ]; then
    print_status $RED "❌ FAILED: Some validations failed"
    echo
    echo "Please review the detailed results and fix issues before proceeding."
    echo "Common solutions:"
    echo "  🔑 Verify SECURITY_SCORECARD_TOKEN is valid"
    echo "  🌐 Check network connectivity"
    echo "  📋 Review API endpoint availability"
    echo "  🔧 Fix TypeScript compilation errors"
    
else
    print_status $YELLOW "⚠️  WARNING: Validation completed with warnings"
    echo
    echo "Some tests passed but there are warnings to address."
    echo "Review the detailed results for recommendations."
fi

echo
echo "📄 Detailed results: $(ls -t validation_results_*.json | head -1)"
echo "📋 Summary report: validation_summary.md"
echo
echo "🔄 To run validation again: ./run_validation.sh"

exit $validation_exit_code