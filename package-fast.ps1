#!/usr/bin/env pwsh
# Fast packaging script that skips docs and uses efficient compression

Param(
    [string]$OutputDir = (Resolve-Path (Join-Path $PSScriptRoot '..')),
    [switch]$Dev
)
$ErrorActionPreference = 'Stop'
$root   = Resolve-Path (Join-Path $PSScriptRoot '..') | Select-Object -ExpandProperty Path
$coreZip = Join-Path $OutputDir 'mcp-core.zip'

Write-Host "Fast packaging (core only)..."

# Build server code if the build directory is missing
if (-not (Test-Path (Join-Path $root 'build'))) {
    Write-Host 'Compiling TypeScript sources'
    Push-Location $root
    if (-not (Test-Path (Join-Path $root 'node_modules/.bin/tsc'))) {
        Write-Host 'Installing npm dependencies'
        npm install | Out-Null
    }
    npx tsc | Out-Null
    Pop-Location
}

# Remove existing package
Remove-Item -Force -ErrorAction SilentlyContinue $coreZip

# Create temporary staging directory for core package
$tempCore = Join-Path ([System.IO.Path]::GetTempPath()) "mcp-fast-$(Get-Random)"
New-Item -ItemType Directory -Path $tempCore -Force | Out-Null

try {
    Write-Host "Staging files..."
    
    # Copy essential runtime files to staging
    Copy-Item -Recurse -Force (Join-Path $root 'build') $tempCore
    Copy-Item -Force (Join-Path $root 'package.json') $tempCore
    
    # Copy package-lock if exists
    $lockFile = Join-Path $root 'package-lock.json'
    if (Test-Path $lockFile) {
        Copy-Item -Force $lockFile $tempCore
    }
    
    # Create production node_modules in staging
    $nodeModulesSource = Join-Path $root 'node_modules'
    $nodeModulesTarget = Join-Path $tempCore 'node_modules'
    
    if (Test-Path $nodeModulesSource) {
        Write-Host 'Creating production dependencies...'
        
        # Create minimal production install
        Push-Location $tempCore
        try {
            npm ci --only=production --silent --no-audit --no-fund 2>$null
            if (Test-Path (Join-Path $tempCore 'node_modules')) {
                Write-Host "Production dependencies created successfully"
            } else {
                Write-Warning "Production install failed, copying essential packages only"
                # Copy just the essential packages we know we need
                New-Item -ItemType Directory -Path $nodeModulesTarget -Force | Out-Null
                $essential = @('@modelcontextprotocol', '@xenova')
                foreach ($pkg in $essential) {
                    $srcPath = Join-Path $nodeModulesSource $pkg
                    if (Test-Path $srcPath) {
                        Copy-Item -Recurse -Force $srcPath (Join-Path $nodeModulesTarget $pkg)
                    }
                }
            }
        } finally {
            Pop-Location
        }
    }
    
    Write-Host "Creating archive (this may take a moment)..."
    
    # Use 7-zip if available (much faster), otherwise use PowerShell
    $sevenZip = Get-Command 7z -ErrorAction SilentlyContinue
    if ($sevenZip) {
        & 7z a -tzip "$coreZip" "$tempCore\*" -mx1 >$null 2>&1
        Write-Host "Archive created with 7-zip"
    } else {
        # Use PowerShell compress but with faster settings
        $files = Get-ChildItem -Path $tempCore -Recurse | Where-Object { -not $_.PSIsContainer }
        if ($files.Count -gt 0) {
            Compress-Archive -Path (Join-Path $tempCore '*') -DestinationPath $coreZip -CompressionLevel Fastest -Force
        }
        Write-Host "Archive created with PowerShell"
    }
    
} finally {
    # Clean up staging directory
    if (Test-Path $tempCore) {
        Remove-Item -Recurse -Force $tempCore -ErrorAction SilentlyContinue
    }
}

if (Test-Path $coreZip) {
    $size = [math]::Round((Get-Item $coreZip).Length / 1MB, 2)
    Write-Host "Created $coreZip ($size MB)"
} else {
    Write-Error "Failed to create package"
}