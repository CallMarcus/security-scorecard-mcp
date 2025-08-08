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
    npm run build | Out-Null
    Pop-Location
}

# Fetch API docs if missing
if (-not (Test-Path $docsDir)) {
    Write-Host 'Fetching API reference docs'
    & (Join-Path $PSScriptRoot 'fetch-docs.ps1') @PSBoundParameters
}

# Archive build outputs
Remove-Item -Force -ErrorAction SilentlyContinue $coreZip, $docsZip
Compress-Archive -Path (Join-Path $root 'build') -DestinationPath $coreZip -Force
Compress-Archive -Path $docsDir -DestinationPath $docsZip -Force

Write-Host "Created $coreZip and $docsZip"
