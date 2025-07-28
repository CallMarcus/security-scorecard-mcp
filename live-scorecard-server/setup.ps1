# Enhanced Security Scorecard MCP Server Setup & Testing Script
param(
    [switch]$Build = $false,
    [switch]$Test = $false,
    [switch]$Deploy = $false,
    [switch]$Debug = $false,
    [switch]$All = $false
)

$ErrorActionPreference = "Stop"

Write-Host "🔧 Enhanced Security Scorecard MCP Server Setup" -ForegroundColor Green
Write-Host ("=" * 60) -ForegroundColor Yellow

# Check prerequisites
function Test-Prerequisites {
    Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow
    
    # Check Node.js
    try {
        $nodeVersion = node --version
        Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
        exit 1
    }
    
    # Check npm
    try {
        $npmVersion = npm --version
        Write-Host "✅ npm: v$npmVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ npm not found" -ForegroundColor Red
        exit 1
    }
    
    # Check API token
    $apiToken = $env:SECURITY_SCORECARD_API_TOKEN
    if ($apiToken) {
        Write-Host "✅ API Token: Configured (length: $($apiToken.Length))" -ForegroundColor Green
    } else {
        Write-Host "⚠️  API Token: Not set (set SECURITY_SCORECARD_API_TOKEN environment variable)" -ForegroundColor Yellow
    }
    
    Write-Host ""
}

# Build function
function Build-MCP {
    Write-Host "🏗️  Building MCP Server..." -ForegroundColor Yellow
    
    # Install dependencies if needed
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ npm install failed" -ForegroundColor Red
            exit 1
        }
    }
    
    # Clean and build
    if (Test-Path "build") {
        Remove-Item -Recurse -Force build
    }
    
    Write-Host "🔨 Compiling TypeScript..." -ForegroundColor Yellow
    npx tsc
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build successful!" -ForegroundColor Green
        
        # Verify build
        if (Test-Path "build\index.js") {
            $size = (Get-Item "build\index.js").Length
            Write-Host "📄 Built file: $size bytes" -ForegroundColor Green
            
            # Test syntax
            try {
                node -c build/index.js
                Write-Host "✅ Syntax validation passed" -ForegroundColor Green
            } catch {
                Write-Host "❌ Syntax validation failed" -ForegroundColor Red
                exit 1
            }
        }
    } else {
        Write-Host "❌ Build failed" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
}

# Test API access
function Test-API {
    Write-Host "🧪 Testing API Access..." -ForegroundColor Yellow
    
    if (-not $env:SECURITY_SCORECARD_API_TOKEN) {
        Write-Host "⚠️  Skipping API tests - no token configured" -ForegroundColor Yellow
        return
    }
    
    Write-Host "🌐 Running endpoint tests..." -ForegroundColor Yellow
    node test_endpoints.js
    
    Write-Host "🔍 Running enhanced debug..." -ForegroundColor Yellow
    node debug_enhanced.js
    
    Write-Host ""
}

# Deploy to Claude Desktop
function Deploy-ToClaudeDesktop {
    Write-Host "🚀 Deploying to Claude Desktop..." -ForegroundColor Yellow
    
    if (-not (Test-Path "build\index.js")) {
        Write-Host "❌ Built file not found. Run build first." -ForegroundColor Red
        return
    }
    
    # Claude Desktop config path
    $configPath = "$env:APPDATA\Claude\claude_desktop_config.json"
    $serverPath = "$PWD\build\index.js"
    
    Write-Host "📁 Config path: $configPath" -ForegroundColor Yellow
    Write-Host "📁 Server path: $serverPath" -ForegroundColor Yellow
    
    # Create config directory if needed
    $configDir = Split-Path $configPath -Parent
    if (-not (Test-Path $configDir)) {
        New-Item -ItemType Directory -Path $configDir -Force
        Write-Host "📁 Created config directory" -ForegroundColor Green
    }
    
    # Read existing config or create new
    $config = @{
        mcpServers = @{}
    }
    
    if (Test-Path $configPath) {
        try {
            $existingConfig = Get-Content $configPath | ConvertFrom-Json
            if ($existingConfig.mcpServers) {
                # Convert PSObject to hashtable
                $existingServers = @{}
                $existingConfig.mcpServers.PSObject.Properties | ForEach-Object {
                    $existingServers[$_.Name] = $_.Value
                }
                $config.mcpServers = $existingServers
            }
        } catch {
            Write-Host "⚠️  Could not parse existing config, creating new" -ForegroundColor Yellow
        }
    }
    
    # Add or update our server
    $config.mcpServers["security-scorecard-enhanced"] = @{
        command = "node"
        args = @($serverPath)
        env = @{
            SECURITY_SCORECARD_API_TOKEN = $env:SECURITY_SCORECARD_API_TOKEN
            COMPANY_DOMAIN = "neste.com"
            DEBUG_MODE = "false"
        }
    }
    
    # Write config
    try {
        $config | ConvertTo-Json -Depth 10 | Set-Content $configPath -Encoding UTF8
        Write-Host "✅ Claude Desktop config updated" -ForegroundColor Green
        Write-Host "🔄 Please restart Claude Desktop to load the new server" -ForegroundColor Yellow
    } catch {
        Write-Host "❌ Failed to write config: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Debug mode setup
function Enable-DebugMode {
    Write-Host "🐛 Setting up debug mode..." -ForegroundColor Yellow
    
    # Set debug environment variable
    [Environment]::SetEnvironmentVariable("DEBUG_MODE", "true", "User")
    $env:DEBUG_MODE = "true"
    
    Write-Host "✅ Debug mode enabled for current session" -ForegroundColor Green
    Write-Host "📝 Set permanently in user environment variables" -ForegroundColor Green
    Write-Host "🔍 MCP server will now provide verbose logging" -ForegroundColor Yellow
    
    Write-Host ""
}

# Print usage information
function Show-Usage {
    Write-Host "📖 Usage Examples:" -ForegroundColor Cyan
    Write-Host "  .\setup.ps1 -Build                # Build the MCP server" -ForegroundColor White
    Write-Host "  .\setup.ps1 -Test                 # Test API access" -ForegroundColor White
    Write-Host "  .\setup.ps1 -Deploy               # Deploy to Claude Desktop" -ForegroundColor White
    Write-Host "  .\setup.ps1 -Debug                # Enable debug mode" -ForegroundColor White
    Write-Host "  .\setup.ps1 -All                  # Do everything" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 Manual Setup Steps:" -ForegroundColor Cyan
    Write-Host "  1. Set environment variable: SECURITY_SCORECARD_API_TOKEN" -ForegroundColor White
    Write-Host "  2. Run: .\setup.ps1 -All" -ForegroundColor White
    Write-Host "  3. Restart Claude Desktop" -ForegroundColor White
    Write-Host "  4. Test with: debug api access for neste.com" -ForegroundColor White
    Write-Host ""
}

# Main execution
Test-Prerequisites

if ($All) {
    $Build = $true
    $Test = $true  
    $Deploy = $true
    $Debug = $true
}

if ($Build) {
    Build-MCP
}

if ($Test) {
    Test-API
}

if ($Debug) {
    Enable-DebugMode
}

if ($Deploy) {
    Deploy-ToClaudeDesktop
}

if (-not ($Build -or $Test -or $Deploy -or $Debug)) {
    Show-Usage
}

Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Restart Claude Desktop if you deployed" -ForegroundColor White
Write-Host "  2. Try: get detailed findings for neste.com" -ForegroundColor White
Write-Host "  3. Use: debug api access to troubleshoot issues" -ForegroundColor White