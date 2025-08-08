#!/usr/bin/env pwsh
# Debug script to test GitHub release asset downloads

$url = "https://github.com/CallMarcus/security-scorecard-mcp/releases/download/v0.2.4/mcp-core.zip"

Write-Host "Testing download URL: $url"
Write-Host ""

# Test with WebRequest to get more details
try {
    $response = Invoke-WebRequest -Uri $url -Method Head -UserAgent "security-scorecard-mcp"
    Write-Host "✅ HEAD request successful"
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Content-Length: $($response.Headers['Content-Length'])"
    Write-Host "Content-Type: $($response.Headers['Content-Type'])"
} catch {
    Write-Host "❌ HEAD request failed"
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Error: $($_.Exception.Message)"
    
    # Check if it's a redirect issue
    if ($_.Exception.Response) {
        $headers = $_.Exception.Response.Headers
        if ($headers -and $headers['Location']) {
            Write-Host "Redirect to: $($headers['Location'])"
        }
    }
}

Write-Host ""
Write-Host "Trying alternative approaches..."

# Try the browser download URL directly
$browserUrl = $url -replace '/download/', '/releases/download/'
Write-Host "Browser URL: $browserUrl"

# Try accessing via curl if available
try {
    $curlResult = & curl -I -L -A "security-scorecard-mcp" $url 2>&1
    Write-Host "Curl result:"
    $curlResult | ForEach-Object { Write-Host "  $_" }
} catch {
    Write-Host "Curl not available or failed"
}