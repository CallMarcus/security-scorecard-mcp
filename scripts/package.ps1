Param(
    [string]$OutputDir = (Resolve-Path (Join-Path $PSScriptRoot '..'))
)
$ErrorActionPreference = 'Stop'
$root   = Resolve-Path (Join-Path $PSScriptRoot '..') | Select-Object -ExpandProperty Path
$coreZip = Join-Path $OutputDir 'mcp-core.zip'
$docsZip = Join-Path $OutputDir 'mcp-docs.zip'
$docsDir = Join-Path $root 'build_docs'

# Compile TypeScript sources
Push-Location $root
npm run build
Pop-Location

# Fetch API docs if missing
if (-not (Test-Path $docsDir)) {
    $fetchScript = Join-Path $PSScriptRoot 'fetch-docs.ps1'
    & $fetchScript
}

# Archive build outputs
Remove-Item -Force -ErrorAction SilentlyContinue $coreZip, $docsZip
Compress-Archive -Path (Join-Path $root 'build') -DestinationPath $coreZip -Force
Compress-Archive -Path $docsDir -DestinationPath $docsZip -Force

Write-Host "Created $coreZip and $docsZip"

