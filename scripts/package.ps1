Param(
    [string]$OutputDir = (Resolve-Path (Join-Path $PSScriptRoot '..')),
    [switch]$Dev
)
$ErrorActionPreference = 'Stop'
$root   = Resolve-Path (Join-Path $PSScriptRoot '..') | Select-Object -ExpandProperty Path
$coreZip = Join-Path $OutputDir 'mcp-core.zip'
$docsZip = Join-Path $OutputDir 'mcp-docs.zip'
$docsDir = Join-Path $root 'build_docs'

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

# Fetch API docs if missing
if (-not (Test-Path $docsDir)) {
    Write-Host 'Fetching API reference docs'
    & (Join-Path $PSScriptRoot 'fetch-docs.ps1') @PSBoundParameters
}

# Archive build outputs with dependencies
Remove-Item -Force -ErrorAction SilentlyContinue $coreZip, $docsZip

# Create temporary staging directory for core package
$tempCore = Join-Path ([System.IO.Path]::GetTempPath()) ([System.Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tempCore -Force | Out-Null

try {
    # Copy essential runtime files to staging
    Copy-Item -Recurse -Force (Join-Path $root 'build') $tempCore
    Copy-Item -Force (Join-Path $root 'package.json') $tempCore
    
    # Copy only production node_modules (essential dependencies)
    $nodeModulesSource = Join-Path $root 'node_modules'
    $nodeModulesTarget = Join-Path $tempCore 'node_modules'
    
    if (Test-Path $nodeModulesSource) {
        Write-Host 'Including runtime dependencies...'
        
        # Essential packages for MCP runtime (from package.json dependencies)
        $essentialPackages = @(
            '@modelcontextprotocol/sdk',
            '@xenova/transformers'
        )
        
        New-Item -ItemType Directory -Path $nodeModulesTarget -Force | Out-Null
        
        foreach ($package in $essentialPackages) {
            $packagePath = Join-Path $nodeModulesSource $package
            $targetPath = Join-Path $nodeModulesTarget $package
            
            if (Test-Path $packagePath) {
                Write-Host "  - $package"
                Copy-Item -Recurse -Force $packagePath $targetPath
            } else {
                Write-Warning "  - $package (not found, may cause runtime issues)"
            }
        }
        
        # Copy package-lock for dependency info
        $lockFile = Join-Path $root 'package-lock.json'
        if (Test-Path $lockFile) {
            Copy-Item -Force $lockFile $tempCore
        }
    }
    
    # Create the core archive
    Compress-Archive -Path (Join-Path $tempCore '*') -DestinationPath $coreZip -Force
    
} finally {
    # Clean up staging directory
    if (Test-Path $tempCore) {
        Remove-Item -Recurse -Force $tempCore -ErrorAction SilentlyContinue
    }
}

# Create docs archive
Compress-Archive -Path $docsDir -DestinationPath $docsZip -Force

Write-Host "Created $coreZip and $docsZip"
