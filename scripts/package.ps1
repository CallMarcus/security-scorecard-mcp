Param(
    [string]$OutputDir = (Resolve-Path (Join-Path $PSScriptRoot '..'))
)
$ErrorActionPreference = 'Stop'
$root = Resolve-Path (Join-Path $PSScriptRoot '..') | Select-Object -ExpandProperty Path
$coreZip = Join-Path $OutputDir 'mcp-core.zip'
$docsZip = Join-Path $OutputDir 'mcp-docs.zip'

Remove-Item -Force -ErrorAction SilentlyContinue $coreZip, $docsZip
Compress-Archive -Path (Join-Path $root 'build') -DestinationPath $coreZip -Force
Compress-Archive -Path (Join-Path $root 'build_docs') -DestinationPath $docsZip -Force

Write-Host "Created $coreZip and $docsZip"
