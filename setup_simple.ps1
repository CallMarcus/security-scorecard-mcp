# Streamlined local development setup
$ErrorActionPreference = 'Stop'

Write-Host "Setting up Security Scorecard MCP locally..."

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

# Build locally
Write-Host "Installing dependencies..."
npm install

Write-Host "Building TypeScript..."
npm run build

# Verify build was successful
if (-not (Test-Path ".\build\simplified-index.js")) {
    Write-Error "Build failed - build\simplified-index.js not found"
    exit 1
}

Write-Host "Build successful"
Write-Host "✅ Simplified MCP server (5 tools) ready at: build\simplified-index.js"
Write-Host "🔄 Original MCP server (31 tools) also available at: build\index.js"

# Check if Claude Desktop config exists
$claudeConfigPath = "$env:APPDATA\Claude\claude_desktop_config.json"
if (Test-Path $claudeConfigPath) {
    Write-Host "Claude Desktop config found at: $claudeConfigPath"
    Write-Host "Restart Claude Desktop to load the updated MCP server"
} else {
    Write-Host "Claude Desktop config not found"
    Write-Host "You'll need to configure Claude Desktop with this MCP server"
    $buildPath = Resolve-Path 'build\simplified-index.js'
    Write-Host "Config should point to: $buildPath"
}

Write-Host ""
Write-Host "Setup complete!"
