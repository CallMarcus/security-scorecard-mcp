Param(
    [switch]$Dev
)
$ErrorActionPreference = 'Stop'
$owner = 'CallMarcus'
$repo  = 'security-scorecard-mcp'

$api = if ($Dev) {
    "https://api.github.com/repos/$owner/$repo/releases/tags/dev"
} else {
    "https://api.github.com/repos/$owner/$repo/releases/latest"
}

$release = Invoke-RestMethod -Uri $api
$tag = $release.tag_name
$zipUrl = $release.zipball_url

$temp = New-Item -ItemType Directory -Path ([System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), [System.Guid]::NewGuid().ToString()))
$zipPath = Join-Path $temp 'src.zip'
Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath
Expand-Archive -Path $zipPath -DestinationPath $temp -Force
$dir = Get-ChildItem -Path $temp -Directory | Select-Object -First 1

Remove-Item -Recurse -Force build, build_docs
Copy-Item -Recurse -Force (Join-Path $dir.FullName 'build') .
Copy-Item -Recurse -Force (Join-Path $dir.FullName 'build_docs') .

Write-Host "Updated MCP to $tag"
