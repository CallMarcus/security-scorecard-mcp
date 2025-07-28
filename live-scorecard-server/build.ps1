# Enhanced Security Scorecard MCP Build Script
Write-Host "=== Enhanced Security Scorecard MCP Server Build ===" -ForegroundColor Green
Write-Host "Directory: $PWD" -ForegroundColor Yellow

# Check if Node.js is available
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check if npm packages are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ npm install failed" -ForegroundColor Red
        exit 1
    }
}

# Clean build directory
if (Test-Path "build") {
    Write-Host "Cleaning build directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force build
}

# Build TypeScript
Write-Host "Building TypeScript..." -ForegroundColor Yellow
npx tsc

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
    
    # Check build output
    if (Test-Path "build\index.js") {
        $buildSize = (Get-Item "build\index.js").Length
        Write-Host "Built file size: $buildSize bytes" -ForegroundColor Green
        
        # Test the built file for syntax errors
        Write-Host "Testing built file..." -ForegroundColor Yellow
        try {
            node -c build/index.js
            Write-Host "✅ Built file syntax is valid" -ForegroundColor Green
        } catch {
            Write-Host "❌ Built file has syntax errors" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Build output file not found" -ForegroundColor Red
    }
    
    # List build contents
    Write-Host "`nBuild directory contents:" -ForegroundColor Yellow
    if (Test-Path "build") {
        Get-ChildItem build | Format-Table Name, Length, LastWriteTime
    }
    
} else {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Build Summary ===" -ForegroundColor Green
Write-Host "✅ Enhanced MCP server built successfully" -ForegroundColor Green
Write-Host "📁 Location: $PWD\build\index.js" -ForegroundColor Yellow
Write-Host "🔧 To test: Set DEBUG_MODE=true environment variable for verbose logging" -ForegroundColor Yellow
Write-Host "🚀 Ready for Claude Desktop integration" -ForegroundColor Green
