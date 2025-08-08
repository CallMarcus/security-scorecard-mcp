#!/usr/bin/env pwsh
# Check for specific missing dependencies like zod

$tempDir = Join-Path ([System.IO.Path]::GetTempPath()) ([System.Guid]::NewGuid().ToString())
$coreZip = "mcp-core.zip"

if (-not (Test-Path $coreZip)) {
    Write-Host "ERROR: mcp-core.zip not found. Run .\scripts\package.ps1 first."
    exit 1
}

Write-Host "Checking for specific missing dependencies..."
Write-Host ""

try {
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
    Expand-Archive -Path $coreZip -DestinationPath $tempDir -Force
    
    $nodeModulesPath = Join-Path $tempDir "node_modules"
    
    # Check for zod specifically
    $zodPath = Join-Path $nodeModulesPath "zod"
    Write-Host "Checking for zod dependency:"
    if (Test-Path $zodPath) {
        Write-Host "  OK   zod found"
    } else {
        Write-Host "  MISS zod (CRITICAL - causes runtime error)"
    }
    
    # Check what's actually in @modelcontextprotocol/sdk
    $sdkPath = Join-Path $nodeModulesPath "@modelcontextprotocol/sdk"
    if (Test-Path $sdkPath) {
        Write-Host ""
        Write-Host "@modelcontextprotocol/sdk contents:"
        Get-ChildItem -Path $sdkPath | ForEach-Object {
            $type = if ($_.PSIsContainer) { "DIR " } else { "FILE" }
            Write-Host "  $type $($_.Name)"
        }
        
        # Check package.json dependencies
        $packageJsonPath = Join-Path $sdkPath "package.json"
        if (Test-Path $packageJsonPath) {
            Write-Host ""
            Write-Host "SDK package.json dependencies:"
            try {
                $packageJson = Get-Content $packageJsonPath | ConvertFrom-Json
                if ($packageJson.dependencies) {
                    $packageJson.dependencies.PSObject.Properties | ForEach-Object {
                        $depPath = Join-Path $nodeModulesPath $_.Name
                        $status = if (Test-Path $depPath) { "OK  " } else { "MISS" }
                        Write-Host "  $status $($_.Name) ($($_.Value))"
                    }
                }
            } catch {
                Write-Host "  Could not parse package.json"
            }
        }
    }
    
    # List all top-level packages in node_modules
    Write-Host ""
    Write-Host "All packages in node_modules:"
    Get-ChildItem -Path $nodeModulesPath | ForEach-Object {
        if ($_.PSIsContainer) {
            Write-Host "  DIR  $($_.Name)"
        }
    }
    
} finally {
    if (Test-Path $tempDir) {
        Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
    }
}

Write-Host ""
Write-Host "Local node_modules comparison:"
if (Test-Path "node_modules") {
    $localCount = (Get-ChildItem -Path "node_modules" -Directory).Count
    Write-Host "Local node_modules has $localCount directories"
} else {
    Write-Host "No local node_modules found"
}