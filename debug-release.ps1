#!/usr/bin/env pwsh
# Debug script to check release API response

$owner = 'CallMarcus'
$repo = 'security-scorecard-mcp'
$api = "https://api.github.com/repos/$owner/$repo/releases/latest"

$token = $env:GITHUB_TOKEN
$headers = @{
    'User-Agent' = 'security-scorecard-mcp'
    'Accept' = 'application/vnd.github+json'
}
if ($token) { $headers['Authorization'] = "token $token" }

try {
    Write-Host "Calling API: $api"
    $release = Invoke-RestMethod -Uri $api -Headers $headers
    Write-Host "Release found: $($release.tag_name)"
    Write-Host "Assets:"
    foreach ($asset in $release.assets) {
        Write-Host "  - Name: $($asset.name)"
        Write-Host "    URL: $($asset.browser_download_url)"
        Write-Host "    Size: $($asset.size) bytes"
        Write-Host ""
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
}