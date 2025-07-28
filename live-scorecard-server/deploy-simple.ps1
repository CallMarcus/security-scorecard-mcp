# Simple Claude Desktop deployment for Security Scorecard MCP
param(
    [string]$ApiToken = $env:SECURITY_SCORECARD_API_TOKEN
)

if (-not $ApiToken) {
    Write-Host "❌ API Token required. Set SECURITY_SCORECARD_API_TOKEN or pass -ApiToken parameter" -ForegroundColor Red
    exit 1
}

$configPath = "$env:APPDATA\Claude\claude_desktop_config.json"
$serverPath = "$PWD\build\index.js"

Write-Host "🚀 Simple Claude Desktop Deployment" -ForegroundColor Green
Write-Host "Config: $configPath" -ForegroundColor Yellow
Write-Host "Server: $serverPath" -ForegroundColor Yellow

# Create the config directory if it doesn't exist
$configDir = Split-Path $configPath -Parent
if (-not (Test-Path $configDir)) {
    New-Item -ItemType Directory -Path $configDir -Force
}

# Create a fresh config (backup existing if present)
if (Test-Path $configPath) {
    $backupPath = "$configPath.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item $configPath $backupPath
    Write-Host "✅ Backed up existing config to: $backupPath" -ForegroundColor Green
}

# Create new config
$newConfig = @{
    mcpServers = @{
        "security-scorecard-enhanced" = @{
            command = "node"
            args = @($serverPath)
            env = @{
                SECURITY_SCORECARD_API_TOKEN = $ApiToken
                COMPANY_DOMAIN = "neste.com"
                DEBUG_MODE = "true"
            }
        }
    }
}

# Write the config
$newConfig | ConvertTo-Json -Depth 10 | Set-Content $configPath -Encoding UTF8

Write-Host "✅ Claude Desktop config updated!" -ForegroundColor Green
Write-Host "🔄 Please restart Claude Desktop" -ForegroundColor Yellow
Write-Host "🧪 Test with: debug api access for neste.com" -ForegroundColor Cyan
