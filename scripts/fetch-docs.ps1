Param(
    [switch]$Dev
)
$script = Join-Path $PSScriptRoot 'update.ps1'
& $script @PSBoundParameters -DocsOnly
