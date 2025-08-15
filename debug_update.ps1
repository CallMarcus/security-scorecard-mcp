$ErrorActionPreference = 'Stop'
$owner = 'CallMarcus'
$repo  = 'security-scorecard-mcp'

$token = (gh auth token).Trim()
Write-Host "Token starts with: $($token.Substring(0,8))"

$apiHeaders = @{
    'User-Agent' = 'security-scorecard-mcp'
    'Accept'     = 'application/vnd.github+json'
    'Authorization' = "token $token"
}

$stableApi = "https://api.github.com/repos/$owner/$repo/releases/latest"

Write-Host "Testing repository access..."
try {
    $repoInfo = Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo" -Headers $apiHeaders
    Write-Host "✓ Repository accessible: $($repoInfo.full_name)"
    Write-Host "  Private: $($repoInfo.private)"
} catch {
    Write-Host "✗ Repository access failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "  Status Code: $($_.Exception.Response.StatusCode.value__)"
    }
    exit 1
}

Write-Host "Testing releases access..."
try {
    $release = Invoke-RestMethod -Uri $stableApi -Headers $apiHeaders
    Write-Host "✓ Latest release accessible: $($release.tag_name)"
    Write-Host "  Assets count: $($release.assets.Count)"
    
    foreach ($asset in $release.assets) {
        Write-Host "  Asset: $($asset.name) - Size: $($asset.size) bytes"
    }
} catch {
    Write-Host "✗ Release access failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "  Status Code: $($_.Exception.Response.StatusCode.value__)"
    }
    
    # Try dev release
    Write-Host "Trying dev release..."
    try {
        $devApi = "https://api.github.com/repos/$owner/$repo/releases/tags/dev"
        $devRelease = Invoke-RestMethod -Uri $devApi -Headers $apiHeaders
        Write-Host "✓ Dev release accessible: $($devRelease.tag_name)"
    } catch {
        Write-Host "✗ Dev release also failed: $($_.Exception.Message)"
    }
}

Write-Host "Debug complete."
