# SecurityScorecard API Endpoint Discovery - PowerShell Version
# Run this directly in PowerShell - no Node.js required!

param(
    [string]$ApiToken = $env:SECURITY_SCORECARD_API_TOKEN,
    [string]$Domain = "neste.com"
)

$API_BASE_URL = "https://api.securityscorecard.io"

# Check if API token is provided
if (-not $ApiToken) {
    Write-Host "❌ Error: API token not provided!" -ForegroundColor Red
    Write-Host "Set environment variable: `$env:SECURITY_SCORECARD_API_TOKEN = 'your_token'" -ForegroundColor Yellow
    Write-Host "Or run with parameter: .\script.ps1 -ApiToken 'your_token'" -ForegroundColor Yellow
    exit 1
}

# Function to test an API endpoint
function Test-Endpoint {
    param(
        [string]$Endpoint,
        [string]$Description
    )
    
    Write-Host "`n🔍 Testing: $Description" -ForegroundColor Cyan
    Write-Host "   Endpoint: $Endpoint" -ForegroundColor Gray
    
    $headers = @{
        "Authorization" = "Token $ApiToken"
        "Accept" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$API_BASE_URL$Endpoint" -Headers $headers -Method Get -ErrorAction Stop
        
        $keys = $response | Get-Member -MemberType NoteProperty | ForEach-Object { $_.Name }
        $hasEntries = $null -ne $response.entries
        $entriesCount = if ($hasEntries) { $response.entries.Count } else { 0 }
        
        Write-Host "   ✅ Success - Keys: [$($keys -join ', ')]" -ForegroundColor Green
        Write-Host "   📊 Has entries: $hasEntries, Count: $entriesCount" -ForegroundColor Green
        
        if ($hasEntries -and $entriesCount -gt 0) {
            $sampleEntry = $response.entries[0]
            $entryKeys = $sampleEntry | Get-Member -MemberType NoteProperty | ForEach-Object { $_.Name }
            $displayKeys = if ($entryKeys.Count -gt 8) { 
                ($entryKeys[0..7] -join ', ') + "..." 
            } else { 
                $entryKeys -join ', ' 
            }
            Write-Host "   🔬 Sample entry keys: [$displayKeys]" -ForegroundColor Green
        }
        
        return @{
            Success = $true
            Endpoint = $Endpoint
            Description = $Description
            Keys = $keys
            HasEntries = $hasEntries
            EntriesCount = $entriesCount
            SampleData = if ($hasEntries) { $response.entries[0] } else { $response }
        }
        
    } catch {
        $statusCode = $_.Exception.Response.StatusCode
        $errorMessage = $_.Exception.Message
        
        Write-Host "   ❌ Error: $statusCode - $errorMessage" -ForegroundColor Red
        
        return @{
            Success = $false
            Endpoint = $Endpoint
            Description = $Description
            Error = "$statusCode - $errorMessage"
        }
    }
}

# Main discovery process
Write-Host "🚀 SecurityScorecard API Endpoint Discovery (PowerShell)" -ForegroundColor Yellow
Write-Host "   Domain: $Domain" -ForegroundColor Gray
Write-Host "   Base URL: $API_BASE_URL" -ForegroundColor Gray
Write-Host ("=" * 60) -ForegroundColor Gray

# Define endpoints to test
$endpointsToTest = @(
    @{ Endpoint = "/companies/$Domain/issues"; Description = "Current MCP Issues Endpoint" },
    @{ Endpoint = "/companies/$Domain/findings"; Description = "Alternative: findings" },
    @{ Endpoint = "/companies/$Domain/issues/summary"; Description = "Alternative: issues summary" },
    @{ Endpoint = "/companies/$Domain/scorecard/issues"; Description = "Alternative: scorecard/issues" },
    @{ Endpoint = "/companies/$Domain/factors/application_security/issues"; Description = "Factor-specific: application_security" },
    @{ Endpoint = "/companies/$Domain/factors/network_security/issues"; Description = "Factor-specific: network_security" },
    @{ Endpoint = "/companies/$Domain/factors/patching_cadence/issues"; Description = "Factor-specific: patching_cadence" },
    @{ Endpoint = "/companies/$Domain/issues/potentially_vulnerable"; Description = "Issue type: potentially_vulnerable" },
    @{ Endpoint = "/companies/$Domain/issues/ssl_certificate"; Description = "Issue type: ssl_certificate" },
    @{ Endpoint = "/companies/$Domain/issues/missing_spf_record"; Description = "Issue type: missing_spf_record" },
    @{ Endpoint = "/companies/$Domain"; Description = "Reference: Company data (working)" },
    @{ Endpoint = "/companies/$Domain/factors"; Description = "Reference: Factors data (working)" },
    @{ Endpoint = "/portfolios"; Description = "Reference: Portfolios (working)" }
)

$results = @()

# Test each endpoint
foreach ($test in $endpointsToTest) {
    $result = Test-Endpoint -Endpoint $test.Endpoint -Description $test.Description
    $results += $result
    
    # Small delay to avoid rate limiting
    Start-Sleep -Milliseconds 500
}

# Summary analysis
Write-Host "`n$('=' * 60)" -ForegroundColor Gray
Write-Host "📊 SUMMARY ANALYSIS" -ForegroundColor Yellow  
Write-Host ("=" * 60) -ForegroundColor Gray

$successful = $results | Where-Object { $_.Success }
$withEntries = $successful | Where-Object { $_.HasEntries -and $_.EntriesCount -gt 0 }

# Look for endpoints with potential issues data
$withIssuesData = $withEntries | Where-Object {
    if ($_.SampleData) {
        $sampleKeys = $_.SampleData | Get-Member -MemberType NoteProperty | ForEach-Object { $_.Name }
        return $sampleKeys | Where-Object { 
            $_ -like "*severity*" -or 
            $_ -like "*issue*" -or 
            $_ -like "*finding*" -or 
            $_ -like "*vulnerability*" -or
            $_ -like "*subject*" -or
            $_ -like "*description*"
        }
    }
    return $false
}

Write-Host "✅ Total successful requests: $($successful.Count)/$($results.Count)" -ForegroundColor Green
Write-Host "📝 Endpoints with entries: $($withEntries.Count)" -ForegroundColor Cyan
Write-Host "🎯 Endpoints with potential issues data: $($withIssuesData.Count)" -ForegroundColor Magenta

if ($withIssuesData.Count -gt 0) {
    Write-Host "`n🏆 RECOMMENDED ENDPOINTS FOR MCP:" -ForegroundColor Green
    for ($i = 0; $i -lt $withIssuesData.Count; $i++) {
        $result = $withIssuesData[$i]
        $sampleKeys = $result.SampleData | Get-Member -MemberType NoteProperty | ForEach-Object { $_.Name }
        Write-Host "$($i + 1). $($result.Endpoint)" -ForegroundColor Green
        Write-Host "   Entries: $($result.EntriesCount)" -ForegroundColor Gray
        Write-Host "   Sample keys: $($sampleKeys -join ', ')" -ForegroundColor Gray
    }
} elseif ($withEntries.Count -gt 0) {
    Write-Host "`n⚠️  ENDPOINTS WITH DATA (but may not be issues):" -ForegroundColor Yellow
    for ($i = 0; $i -lt $withEntries.Count; $i++) {
        $result = $withEntries[$i]
        Write-Host "$($i + 1). $($result.Endpoint) ($($result.EntriesCount) entries)" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n❌ NO ENDPOINTS FOUND WITH ISSUES DATA" -ForegroundColor Red
    Write-Host "   This suggests the SecurityScorecard API may require:" -ForegroundColor Yellow
    Write-Host "   1. Different authentication scopes" -ForegroundColor Yellow
    Write-Host "   2. Bulk Data API for issues access" -ForegroundColor Yellow
    Write-Host "   3. Portfolio-based access patterns" -ForegroundColor Yellow
    Write-Host "   4. Different base URL or API version" -ForegroundColor Yellow
}

Write-Host "`n🔧 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Update MCP server to use working endpoints found above" -ForegroundColor White
Write-Host "2. Contact SecurityScorecard support about issues endpoint access" -ForegroundColor White
Write-Host "3. Check API token permissions and scopes" -ForegroundColor White
Write-Host "4. Consider using Bulk Data API for comprehensive issues data" -ForegroundColor White

# Save results to JSON file
$outputFile = "ssc_api_discovery_results.json"
$summaryData = @{
    timestamp = (Get-Date).ToString("o")
    domain = $Domain
    summary = @{
        total_tests = $results.Count
        successful = $successful.Count
        with_entries = $withEntries.Count
        with_issues_data = $withIssuesData.Count
    }
    results = $results
}

$summaryData | ConvertTo-Json -Depth 10 | Out-File -FilePath $outputFile -Encoding UTF8
Write-Host "`n📋 Full results saved to: $outputFile" -ForegroundColor Green

# Show the most important findings
Write-Host "`n🎯 KEY FINDINGS:" -ForegroundColor Magenta
$brokenIssuesEndpoints = $results | Where-Object { $_.Endpoint -like "*/issues*" -and (-not $_.Success -or $_.EntriesCount -eq 0) }
if ($brokenIssuesEndpoints.Count -gt 0) {
    Write-Host "❌ Confirmed: /issues endpoints are broken/empty" -ForegroundColor Red
    Write-Host "   This validates your MCP analysis document findings!" -ForegroundColor Yellow
}

$workingEndpoints = $results | Where-Object { $_.Success -and $_.HasEntries -and $_.EntriesCount -gt 0 }
if ($workingEndpoints.Count -gt 0) {
    Write-Host "✅ Working endpoints found - MCP can be fixed!" -ForegroundColor Green
} else {
    Write-Host "⚠️  No data endpoints working - contact SecurityScorecard support" -ForegroundColor Yellow
}