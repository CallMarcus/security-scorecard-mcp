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
    try {
        & (Join-Path $PSScriptRoot 'fetch-docs.ps1') @PSBoundParameters
    } catch {
        Write-Warning "Failed to fetch API docs: $($_.Exception.Message)"
        Write-Host "Creating empty docs directory for packaging"
        New-Item -ItemType Directory -Path $docsDir -Force | Out-Null
        "API documentation not available" | Set-Content -Path (Join-Path $docsDir "README.txt")
    }
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
        
        # Use npm to create a production-only node_modules in a temp location
        Write-Host "  - Creating production-only dependency package..."
        
        $tempProd = Join-Path ([System.IO.Path]::GetTempPath()) "npm-prod-$(Get-Random)"
        New-Item -ItemType Directory -Path $tempProd -Force | Out-Null
        
        try {
            # Copy package files to temp location
            Copy-Item -Force (Join-Path $root 'package.json') $tempProd
            if (Test-Path (Join-Path $root 'package-lock.json')) {
                Copy-Item -Force (Join-Path $root 'package-lock.json') $tempProd
            }
            
            # Install only production dependencies in temp location
            Push-Location $tempProd
            Write-Host "  - Installing production dependencies..."
            npm ci --only=production --silent 2>$null
            Pop-Location
            
            # Copy the resulting node_modules
            $tempNodeModules = Join-Path $tempProd 'node_modules'
            if (Test-Path $tempNodeModules) {
                Copy-Item -Recurse -Force $tempNodeModules $nodeModulesTarget
                Write-Host "  - Included production dependencies only"
            } else {
                Write-Warning "Failed to create production dependencies, falling back to full copy"
                Copy-Item -Recurse -Force $nodeModulesSource $nodeModulesTarget
            }
            
        } catch {
            Write-Warning "Production dependency creation failed: $($_.Exception.Message)"
            Write-Host "  - Falling back to full node_modules copy"
            Copy-Item -Recurse -Force $nodeModulesSource $nodeModulesTarget
        } finally {
            # Clean up temp directory
            if (Test-Path $tempProd) {
                Remove-Item -Recurse -Force $tempProd -ErrorAction SilentlyContinue
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
if (Test-Path $docsDir) {
    Compress-Archive -Path $docsDir -DestinationPath $docsZip -Force
    Write-Host "Created $coreZip and $docsZip"
} else {
    Write-Warning "Docs directory not found, creating core package only"
    Write-Host "Created $coreZip (docs package skipped)"
}
