#!/usr/bin/env pwsh
# Script to verify what's in the mcp-core.zip package

$tempDir = Join-Path ([System.IO.Path]::GetTempPath()) ([System.Guid]::NewGuid().ToString())
$coreZip = "mcp-core.zip"

if (-not (Test-Path $coreZip)) {
    Write-Host "ERROR: mcp-core.zip not found. Run .\scripts\package.ps1 first."
    exit 1
}

Write-Host "Analyzing mcp-core.zip contents..."
Write-Host ""

try {
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
    Expand-Archive -Path $coreZip -DestinationPath $tempDir -Force
    
    Write-Host "Top-level contents:"
    Get-ChildItem -Path $tempDir | ForEach-Object {
        $type = if ($_.PSIsContainer) { "DIR " } else { "FILE" }
        $size = if ($_.PSIsContainer) { "" } else { " ($([math]::Round($_.Length/1KB, 1)) KB)" }
        Write-Host "  $type $($_.Name)$size"
    }
    
    Write-Host ""
    Write-Host "Checking for essential files:"
    
    $essentialPaths = @(
        "build/index.js",
        "package.json", 
        "node_modules/@modelcontextprotocol/sdk/package.json",
        "node_modules/@xenova/transformers/package.json"
    )
    
    foreach ($path in $essentialPaths) {
        $fullPath = Join-Path $tempDir $path
        if (Test-Path $fullPath) {
            Write-Host "  OK   $path"
        } else {
            Write-Host "  MISS $path"
        }
    }
    
    # Check if node_modules exists and what is in it
    $nodeModulesPath = Join-Path $tempDir "node_modules"
    if (Test-Path $nodeModulesPath) {
        Write-Host ""
        Write-Host "node_modules contents:"
        Get-ChildItem -Path $nodeModulesPath | ForEach-Object {
            Write-Host "  DIR  $($_.Name)"
        }
        
        # Check @modelcontextprotocol specifically
        $mcpPath = Join-Path $nodeModulesPath "@modelcontextprotocol"
        if (Test-Path $mcpPath) {
            Write-Host ""
            Write-Host "@modelcontextprotocol contents:"
            Get-ChildItem -Path $mcpPath | ForEach-Object {
                Write-Host "    DIR  $($_.Name)"
            }
        }
    } else {
        Write-Host ""
        Write-Host "ERROR: node_modules directory is missing!"
    }
    
} finally {
    if (Test-Path $tempDir) {
        Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
    }
}

Write-Host ""
Write-Host "Package size: $([math]::Round((Get-Item $coreZip).Length/1MB, 2)) MB"