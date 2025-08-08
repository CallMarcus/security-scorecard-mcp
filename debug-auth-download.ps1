#!/usr/bin/env pwsh
# Test different authentication methods for GitHub release downloads

$url = "https://github.com/CallMarcus/security-scorecard-mcp/releases/download/v0.2.4/mcp-core.zip"
$token = $env:GITHUB_TOKEN

Write-Host "Testing GitHub release asset download authentication..."
Write-Host "URL: $url"
Write-Host "Token available: $($token -ne $null)"
Write-Host ""

if (-not $token) {
    Write-Host "❌ No GITHUB_TOKEN found. Set with: `$env:GITHUB_TOKEN = 'your_token'"
    exit 1
}

# Method 1: Standard Authorization header
Write-Host "Method 1: Authorization Bearer header"
try {
    $headers1 = @{
        'Authorization' = "Bearer $token"
        'User-Agent' = 'security-scorecard-mcp'
    }
    Invoke-WebRequest -Uri $url -Headers $headers1 -OutFile "test1.zip" -ErrorAction Stop
    Write-Host "✅ Success with Bearer token"
    Remove-Item "test1.zip" -ErrorAction SilentlyContinue
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)"
}

# Method 2: token prefix (original method)
Write-Host "`nMethod 2: Authorization token header"
try {
    $headers2 = @{
        'Authorization' = "token $token"
        'User-Agent' = 'security-scorecard-mcp'
    }
    Invoke-WebRequest -Uri $url -Headers $headers2 -OutFile "test2.zip" -ErrorAction Stop
    Write-Host "✅ Success with token prefix"
    Remove-Item "test2.zip" -ErrorAction SilentlyContinue
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)"
}

# Method 3: Use API endpoint for asset download
Write-Host "`nMethod 3: GitHub API asset download"
try {
    $apiUrl = "https://api.github.com/repos/CallMarcus/security-scorecard-mcp/releases/latest"
    $headers3 = @{
        'Authorization' = "token $token"
        'User-Agent' = 'security-scorecard-mcp'
        'Accept' = 'application/vnd.github+json'
    }
    
    $release = Invoke-RestMethod -Uri $apiUrl -Headers $headers3
    $coreAsset = $release.assets | Where-Object { $_.name -eq 'mcp-core.zip' }
    
    if ($coreAsset) {
        # Use the API download URL
        $downloadHeaders = @{
            'Authorization' = "token $token"
            'User-Agent' = 'security-scorecard-mcp'
            'Accept' = 'application/octet-stream'
        }
        $apiDownloadUrl = $coreAsset.url
        Write-Host "API Download URL: $apiDownloadUrl"
        
        Invoke-WebRequest -Uri $apiDownloadUrl -Headers $downloadHeaders -OutFile "test3.zip" -ErrorAction Stop
        Write-Host "✅ Success with API download"
        Remove-Item "test3.zip" -ErrorAction SilentlyContinue
    }
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)"
}

Write-Host "`nDone testing authentication methods."