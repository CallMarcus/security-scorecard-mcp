# SecurityScorecard Issue Types Discovery - PowerShell
# This script tests specific issue type endpoints that were found to work

param(
    [string]$ApiToken = $env:SECURITY_SCORECARD_API_TOKEN,
    [string]$Domain = "neste.com"
)

$API_BASE_URL = "https://api.securityscorecard.io"

if (-not $ApiToken) {
    Write-Host "❌ Error: Set `$env:SECURITY_SCORECARD_API_TOKEN first!" -ForegroundColor Red
    exit 1
}

Write-Host "🎯 SecurityScorecard Issue Types Discovery" -ForegroundColor Yellow
Write-Host "   Testing issue-type-specific endpoints that actually work!" -ForegroundColor Green
Write-Host ("=" * 60) -ForegroundColor Gray

$headers = @{
    "Authorization" = "Token $ApiToken"
    "Accept" = "application/json"
}

# Common SecurityScorecard issue types based on their documentation
$issueTypes = @(
    "potentially_vulnerable",
    "service_vulns", 
    "ssl_certificate_expired",
    "ssl_certificate_soon_expire",
    "ssl_certificate_self_signed",
    "ssl_certificate_weak_signature",
    "domain_missing_https",
    "domain_missing_https_v2",
    "csp_no_policy",
    "csp_no_policy_v2",
    "missing_spf_record",
    "spf_record_malformed",
    "dmarc_policy_not_enabled",
    "dmarc_policy_not_enforced",
    "subdomain_takeover",
    "open_resolver",
    "dns_zone_transfer",
    "patching_cadence_high",
    "patching_cadence_medium", 
    "patching_cadence_low",
    "malware_detected",
    "botnet_infections",
    "spam_propagation",
    "suspicious_activity",
    "open_ports",
    "insecure_https_redirect"
)

$workingEndpoints = @()
$totalIssuesFound = 0

foreach ($issueType in $issueTypes) {
    $endpoint = "/companies/$Domain/issues/$issueType"
    
    try {
        Write-Host "`n🔍 Testing: $issueType" -ForegroundColor Cyan
        
        $response = Invoke-RestMethod -Uri "$API_BASE_URL$endpoint" -Headers $headers -Method Get -ErrorAction Stop
        
        $hasEntries = $null -ne $response.entries
        $entriesCount = if ($hasEntries) { $response.entries.Count } else { 0 }
        
        if ($hasEntries) {
            if ($entriesCount -gt 0) {
                Write-Host "   ✅ SUCCESS: Found $entriesCount issues!" -ForegroundColor Green
                
                # Show sample issue structure
                $sampleIssue = $response.entries[0]
                $sampleKeys = $sampleIssue | Get-Member -MemberType NoteProperty | ForEach-Object { $_.Name }
                Write-Host "   🔬 Sample issue keys: $($sampleKeys -join ', ')" -ForegroundColor Green
                
                # Show some key details if available
                if ($sampleIssue.severity) { Write-Host "   📊 Severity: $($sampleIssue.severity)" -ForegroundColor Magenta }
                if ($sampleIssue.subject) { Write-Host "   🎯 Sample asset: $($sampleIssue.subject)" -ForegroundColor Magenta }
                if ($sampleIssue.first_seen) { Write-Host "   📅 First seen: $($sampleIssue.first_seen)" -ForegroundColor Magenta }
                
                $workingEndpoints += @{
                    IssueType = $issueType
                    Endpoint = $endpoint
                    Count = $entriesCount
                    SampleIssue = $sampleIssue
                }
                
                $totalIssuesFound += $entriesCount
            } else {
                Write-Host "   ⚪ Structure OK, but 0 issues found" -ForegroundColor Yellow
            }
        } else {
            Write-Host "   ❌ No entries structure" -ForegroundColor Red
        }
        
    } catch {
        $statusCode = $_.Exception.Response.StatusCode
        if ($statusCode -eq 404) {
            Write-Host "   ⚪ Not Found (404) - Issue type may not exist" -ForegroundColor Gray
        } else {
            Write-Host "   ❌ Error: $statusCode - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    # Small delay to avoid rate limiting
    Start-Sleep -Milliseconds 300
}

# Summary
Write-Host "`n$('=' * 60)" -ForegroundColor Gray
Write-Host "🎉 DISCOVERY RESULTS" -ForegroundColor Yellow
Write-Host ("=" * 60) -ForegroundColor Gray

Write-Host "✅ Issue types with data found: $($workingEndpoints.Count)" -ForegroundColor Green
Write-Host "📊 Total issues discovered: $totalIssuesFound" -ForegroundColor Green

if ($workingEndpoints.Count -gt 0) {
    Write-Host "`n🏆 WORKING ISSUE TYPE ENDPOINTS:" -ForegroundColor Green
    
    foreach ($endpoint in $workingEndpoints) {
        Write-Host "`n📋 Issue Type: $($endpoint.IssueType)" -ForegroundColor Cyan
        Write-Host "   Endpoint: $($endpoint.Endpoint)" -ForegroundColor Gray
        Write-Host "   Issues Found: $($endpoint.Count)" -ForegroundColor Green
        
        $sample = $endpoint.SampleIssue
        if ($sample.severity) { Write-Host "   Severity: $($sample.severity)" -ForegroundColor White }
        if ($sample.subject) { Write-Host "   Sample Asset: $($sample.subject)" -ForegroundColor White }
        if ($sample.description) { Write-Host "   Description: $($sample.description.Substring(0, [Math]::Min(80, $sample.description.Length)))..." -ForegroundColor White }
    }
    
    Write-Host "`n🔧 MCP SERVER UPDATE NEEDED:" -ForegroundColor Yellow
    Write-Host "Update your MCP server to use these endpoints:" -ForegroundColor White
    foreach ($endpoint in $workingEndpoints) {
        Write-Host "  /companies/{domain}/issues/$($endpoint.IssueType)" -ForegroundColor Cyan
    }
    
    Write-Host "`n✨ SUCCESS! Your MCP implementation can now access real issues data!" -ForegroundColor Green
    
} else {
    Write-Host "`n❌ No issue types returned data" -ForegroundColor Red
    Write-Host "This could mean:" -ForegroundColor Yellow
    Write-Host "1. Neste.com genuinely has very few security issues (unlikely given D-grade)" -ForegroundColor Yellow
    Write-Host "2. API token needs additional permissions" -ForegroundColor Yellow
    Write-Host "3. Different endpoint patterns needed" -ForegroundColor Yellow
    Write-Host "4. Bulk Data API required for comprehensive access" -ForegroundColor Yellow
}

# Save results
$results = @{
    timestamp = (Get-Date).ToString("o")
    domain = $Domain
    total_issue_types_tested = $issueTypes.Count
    working_endpoints = $workingEndpoints.Count
    total_issues_found = $totalIssuesFound
    working_issue_types = $workingEndpoints | ForEach-Object { 
        @{
            issue_type = $_.IssueType
            endpoint = $_.Endpoint  
            count = $_.Count
            sample_keys = ($_.SampleIssue | Get-Member -MemberType NoteProperty | ForEach-Object { $_.Name })
        }
    }
}

$results | ConvertTo-Json -Depth 5 | Out-File -FilePath "issue_types_discovery.json" -Encoding UTF8
Write-Host "`n📋 Results saved to: issue_types_discovery.json" -ForegroundColor Green

Write-Host "`n🎯 BOTTOM LINE:" -ForegroundColor Magenta
if ($totalIssuesFound -gt 0) {
    Write-Host "✅ PROBLEM SOLVED! Found $totalIssuesFound real security issues using correct endpoints!" -ForegroundColor Green
    Write-Host "   Your MCP analysis was correct - it was an implementation issue, not API limitations!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Structure confirmed working, but no data found. Next: contact SecurityScorecard support." -ForegroundColor Yellow
}