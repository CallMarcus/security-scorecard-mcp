# Requires PowerShell 5+
Param(
    [switch]$Dev
)
$ErrorActionPreference = 'Stop'

# Verify Node.js 18+ is installed
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Error 'Node.js 18+ is required but was not found.'
    exit 1
}
$version = (node --version) -replace 'v'
$major = [int]$version.Split('.')[0]
if ($major -lt 18) {
    Write-Error "Node.js 18+ is required. Found $(node --version)."
    exit 1
}

# Determine release channel and update files
if ($Dev) {
    .\scripts\update.ps1 -Dev
} else {
    .\scripts\update.ps1
}

$COMPANY_DOMAIN = Read-Host 'Enter company domain'
$SECURITY_SCORECARD_API_TOKEN = Read-Host 'Enter SecurityScorecard API token'
$DEFAULT_ISSUE_TYPES = Read-Host 'Default issue types (comma-separated)'

$env:COMPANY_DOMAIN = $COMPANY_DOMAIN
$env:SECURITY_SCORECARD_API_TOKEN = $SECURITY_SCORECARD_API_TOKEN
$env:DEFAULT_ISSUE_TYPES = $DEFAULT_ISSUE_TYPES

@"
COMPANY_DOMAIN="$COMPANY_DOMAIN"
SECURITY_SCORECARD_API_TOKEN="$SECURITY_SCORECARD_API_TOKEN"
DEFAULT_ISSUE_TYPES="$DEFAULT_ISSUE_TYPES"
"@ | Set-Content -Path .env

node build/index.js
