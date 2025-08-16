# Requires PowerShell 5+
# No parameters needed for simplified single-channel setup
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

# Ensure GitHub CLI is installed and authenticated
$gh = Get-Command gh -ErrorAction SilentlyContinue
if (-not $gh) {
    $winget = Get-Command winget -ErrorAction SilentlyContinue
    if ($winget) {
        Write-Host 'Installing GitHub CLI via winget...'
        winget install --id GitHub.cli -e --source winget --silent --accept-package-agreements --accept-source-agreements 1>$null 2>$null
        $gh = Get-Command gh -ErrorAction SilentlyContinue
    }
    if (-not $gh) {
        Write-Error 'GitHub CLI (gh) is required but was not found. Install it from https://cli.github.com/.'
        exit 1
    }
}
try {
    gh auth status 1>$null 2>$null
} catch {
    gh auth login --web --scopes "repo"
}

$env:GITHUB_TOKEN = (gh auth token).Trim()

# Ensure update script exists; download latest if missing
$updateScript = ".\scripts\update.ps1"
if (-not (Test-Path $updateScript)) {
    New-Item -ItemType Directory -Path ".\scripts" -Force | Out-Null
    $owner = 'CallMarcus'
    $repo  = 'security-scorecard-mcp'
    
    Write-Host "Downloading update script..."
    
    # Try direct download first (more reliable)
    try {
        $rawUrl = "https://raw.githubusercontent.com/$owner/$repo/main/scripts/update.ps1"
        $headers = @{ 'User-Agent' = 'security-scorecard-mcp-setup' }
        if ($env:GITHUB_TOKEN) {
            $headers['Authorization'] = "token $env:GITHUB_TOKEN"
        }
        Invoke-WebRequest -Uri $rawUrl -OutFile $updateScript -Headers $headers
        Write-Host "Update script downloaded successfully"
    } catch {
        Write-Host "Direct download failed, trying GitHub CLI..."
        try {
            # Fallback to GitHub CLI (without --output flag for compatibility)  
            $content = gh api "repos/$owner/$repo/contents/scripts/update.ps1" --jq '.content' | ForEach-Object { [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($_)) }
            $content | Set-Content -Path $updateScript -Encoding UTF8
            Write-Host "Update script downloaded via GitHub CLI"
        } catch {
            Write-Error "Failed to download update script. Please ensure you have internet connectivity and try again."
            exit 1
        }
    }
}

# Update files from latest release
& $updateScript

$COMPANY_DOMAIN = Read-Host 'Enter company domain'
$SECURITY_SCORECARD_API_TOKEN = Read-Host 'Enter SecurityScorecard API token'
$DEFAULT_ISSUE_TYPES = Read-Host 'Default issue types (comma-separated)'

$env:COMPANY_DOMAIN = $COMPANY_DOMAIN
$env:SECURITY_SCORECARD_API_TOKEN = $SECURITY_SCORECARD_API_TOKEN
$env:DEFAULT_ISSUE_TYPES = $DEFAULT_ISSUE_TYPES

$REQUEST_CACHE_TTL_MS = $env:REQUEST_CACHE_TTL_MS
if (-not $REQUEST_CACHE_TTL_MS) { $REQUEST_CACHE_TTL_MS = 300000 }
$REQUESTS_PER_INTERVAL = $env:REQUESTS_PER_INTERVAL
if (-not $REQUESTS_PER_INTERVAL) { $REQUESTS_PER_INTERVAL = 5 }
$REQUEST_INTERVAL_MS = $env:REQUEST_INTERVAL_MS
if (-not $REQUEST_INTERVAL_MS) { $REQUEST_INTERVAL_MS = 1000 }
$REQUEST_BURST_LIMIT = $env:REQUEST_BURST_LIMIT
if (-not $REQUEST_BURST_LIMIT) { $REQUEST_BURST_LIMIT = $REQUESTS_PER_INTERVAL }

$env:REQUEST_CACHE_TTL_MS = $REQUEST_CACHE_TTL_MS
$env:REQUESTS_PER_INTERVAL = $REQUESTS_PER_INTERVAL
$env:REQUEST_INTERVAL_MS = $REQUEST_INTERVAL_MS
$env:REQUEST_BURST_LIMIT = $REQUEST_BURST_LIMIT

@"
COMPANY_DOMAIN="$COMPANY_DOMAIN"
SECURITY_SCORECARD_API_TOKEN="$SECURITY_SCORECARD_API_TOKEN"
DEFAULT_ISSUE_TYPES="$DEFAULT_ISSUE_TYPES"
REQUEST_CACHE_TTL_MS="$REQUEST_CACHE_TTL_MS"
REQUESTS_PER_INTERVAL="$REQUESTS_PER_INTERVAL"
REQUEST_INTERVAL_MS="$REQUEST_INTERVAL_MS"
REQUEST_BURST_LIMIT="$REQUEST_BURST_LIMIT"
"@ | Set-Content -Path .env

node build/index.js
