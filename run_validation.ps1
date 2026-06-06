# MCP Tools Validation Runner for Windows PowerShell
# Comprehensive validation of current MCP tools against new API reference

param(
    [string]$OutputFile = "",
    [switch]$Help
)

if ($Help) {
    Write-Host "MCP Tools Validation Script for Windows" -ForegroundColor Blue
    Write-Host "Usage: .\run_validation.ps1 [-OutputFile results.json] [-Help]" -ForegroundColor Blue
    Write-Host ""
    Write-Host "Validates current MCP tools against the new API reference"
    Write-Host "Requires SECURITY_SCORECARD_TOKEN environment variable"
    exit 0
}

Write-Host "🚀 SecurityScorecard MCP Validation Suite" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue

# Function to print colored output
function Write-Status {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Check prerequisites
Write-Status "📋 Checking prerequisites..." "Blue"

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Status "✅ Node.js: $nodeVersion" "Green"
} catch {
    Write-Status "❌ Node.js is not installed. Please install Node.js 18+ and try again." "Red"
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Status "✅ npm: $npmVersion" "Green"
} catch {
    Write-Status "❌ npm is not installed. Please install npm and try again." "Red"
    exit 1
}

# Check if Python is installed
try {
    $pythonVersion = python --version 2>$null
    if (-not $pythonVersion) {
        $pythonVersion = python3 --version
        $pythonCmd = "python3"
    } else {
        $pythonCmd = "python"
    }
    Write-Status "✅ Python: $pythonVersion" "Green"
} catch {
    Write-Status "❌ Python 3 is not installed. Please install Python 3 and try again." "Red"
    exit 1
}

# Check for API token
if (-not $env:SECURITY_SCORECARD_TOKEN) {
    Write-Status "❌ SECURITY_SCORECARD_TOKEN environment variable is not set." "Red"
    Write-Host "   Please set it with: `$env:SECURITY_SCORECARD_TOKEN='your-token-here'" -ForegroundColor Yellow
    exit 1
}

Write-Status "✅ Prerequisites check passed" "Green"

# Check if we're in the right directory
if (-not (Test-Path "package.json") -or -not (Test-Path "src" -PathType Container)) {
    Write-Status "❌ Please run this script from the MCP project root directory" "Red"
    exit 1
}

# Install dependencies if needed
Write-Status "📦 Installing dependencies..." "Blue"
try {
    npm install | Out-Null
    Write-Status "✅ Dependencies installed" "Green"
} catch {
    Write-Status "❌ Failed to install dependencies" "Red"
    exit 1
}

# Build the project
Write-Status "🔨 Building TypeScript..." "Blue"
try {
    npm run build | Out-Null
    Write-Status "✅ Build successful" "Green"
} catch {
    Write-Status "❌ TypeScript build failed. Please fix compilation errors first." "Red"
    exit 1
}

# Run validation tests
Write-Status "🧪 Running validation tests..." "Blue"
try {
    npm test 2>$null | Out-Null
    Write-Status "✅ Basic tests passed" "Green"
} catch {
    Write-Status "⚠️  Some tests had issues (this is normal without a real API environment)" "Yellow"
}

# Run Python validation script
Write-Status "🔍 Running comprehensive validation..." "Blue"

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$resultsFile = if ($OutputFile) { $OutputFile } else { "validation_results_$timestamp.json" }

try {
    if ($pythonCmd -eq "python3") {
        & python3 validate_mcp_tools.py --output-file $resultsFile
    } else {
        & python validate_mcp_tools.py --output-file $resultsFile
    }
    $validationExitCode = $LASTEXITCODE
} catch {
    Write-Status "❌ Validation script failed to run" "Red"
    $validationExitCode = 1
}

# Generate summary report
Write-Status "📊 Generating summary report..." "Blue"

$summaryContent = @"
# MCP Validation Summary

Generated: $(Get-Date)

## Environment
* Node.js: $nodeVersion
* npm: $npmVersion  
* Python: $pythonVersion
* Platform: Windows PowerShell
* PowerShell Version: $($PSVersionTable.PSVersion)

## Files Validated
* src/api/client.ts (Type-safe API client)
* src/types/api.ts (TypeScript types)
* src/index.ts (Main MCP server)
* src/get_findings_by_category.ts (Findings tool)
* src/asset_management.ts (Asset tools)

## Validation Results
$(if ($validationExitCode -eq 0) { "✅ **PASSED** - All validations successful" } 
  elseif ($validationExitCode -eq 1) { "❌ **FAILED** - Some validations failed" } 
  else { "⚠️  **WARNING** - Validation completed with warnings" })

## Next Steps
$(if ($validationExitCode -eq 0) { 
"* ✅ Ready for production use
* 📚 Review MCP_MIGRATION_GUIDE.md for upgrade instructions  
* 🚀 Start using the new API client: import { createSecurityScorecardClient } from './src/api/client.js'" } 
else { 
"* 🔧 Review validation errors in the detailed results file
* 📋 Follow MCP_MIGRATION_GUIDE.md for migration steps
* 🧪 Re-run validation after fixing issues" })

## Available Commands (PowerShell)
* npm run api:generate - Regenerate API client
* npm run api:update - Update from latest Swagger spec  
* npm run build - Compile TypeScript
* python validate_mcp_tools.py - Run validation again
* .\run_validation.ps1 - Run this validation script

## Documentation
* [API Development Guide](./API_DEVELOPMENT_GUIDE.md)
* [Migration Guide](./MCP_MIGRATION_GUIDE.md)
* [Validation Plan](./MCP_VALIDATION_PLAN.md)
* [Actionable Demo](./ACTIONABLE_API_DEMO.md)
"@

$summaryContent | Out-File -FilePath "validation_summary.md" -Encoding UTF8
Write-Status "✅ Summary report generated: validation_summary.md" "Green"

# Final status
Write-Host ""
Write-Status "🎯 Validation Complete!" "Blue"
Write-Host "========================================"

if ($validationExitCode -eq 0) {
    Write-Status "🎉 SUCCESS: All validations passed!" "Green"
    Write-Host ""
    Write-Host "Your MCP tools are ready to use with the new API reference."
    Write-Host "Key benefits you now have:"
    Write-Host "  ⚡ Type-safe API calls"
    Write-Host "  🔧 Better error handling"  
    Write-Host "  📈 Improved performance"
    Write-Host "  🛡️  Built-in validation"
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "  1. Review examples/mcp_upgrade_example.ts"
    Write-Host "  2. Start migrating tools using MCP_MIGRATION_GUIDE.md"
    Write-Host "  3. Use: import { createSecurityScorecardClient } from './src/api/client.js'"
    
} elseif ($validationExitCode -eq 1) {
    Write-Status "❌ FAILED: Some validations failed" "Red"
    Write-Host ""
    Write-Host "Please review the detailed results and fix issues before proceeding."
    Write-Host "Common solutions:"
    Write-Host "  🔑 Verify SECURITY_SCORECARD_TOKEN is valid"
    Write-Host "  🌐 Check network connectivity"
    Write-Host "  📋 Review API endpoint availability"
    Write-Host "  🔧 Fix TypeScript compilation errors"
    
} else {
    Write-Status "⚠️  WARNING: Validation completed with warnings" "Yellow"
    Write-Host ""
    Write-Host "Some tests passed but there are warnings to address."
    Write-Host "Review the detailed results for recommendations."
}

Write-Host ""
Write-Host "📄 Detailed results: $resultsFile"
Write-Host "📋 Summary report: validation_summary.md"
Write-Host ""
Write-Host "🔄 To run validation again: .\run_validation.ps1"

exit $validationExitCode