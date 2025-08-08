Param(
    [switch]$Dev
)
$ErrorActionPreference = 'Stop'
$owner = 'CallMarcus'
$repo  = 'security-scorecard-mcp'

$stableApi = "https://api.github.com/repos/$owner/$repo/releases/latest"
$devApi    = "https://api.github.com/repos/$owner/$repo/releases/tags/dev"
$api       = if ($Dev) { $devApi } else { $stableApi }

$token = $env:GITHUB_TOKEN
$headers = @{
    'User-Agent' = 'security-scorecard-mcp'
    'Accept'     = 'application/vnd.github+json'
}
if ($token) { $headers['Authorization'] = "token $token" }

$origTls = [System.Net.ServicePointManager]::SecurityProtocol
try {
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

    $release = $null
    try {
        $release = Invoke-RestMethod -Uri $api -Headers $headers
    } catch {
        $status = $_.Exception.Response.StatusCode.value__
        if (-not $Dev -and $status -eq 404) {
            Write-Warning "No stable release found. Falling back to development build."
            try {
                $release = Invoke-RestMethod -Uri $devApi -Headers $headers
            } catch {
                $message = "Failed to retrieve release info from ${devApi}: $($_.Exception.Message)"
                if ($_.Exception.Response -and $_.Exception.Response.StatusCode.value__ -eq 404) {
                    $message += "`nNo release was found. Publish a release or run with -Dev for development builds."
                } else {
                    $message += "`nCheck your network connection or verify that the repository has published releases."
                }
                Write-Error $message -ErrorAction Continue
                exit 1
            }
        } else {
            $message = "Failed to retrieve release info from ${api}: $($_.Exception.Message)"
            if ($_.Exception.Response -and $status -eq 404) {
                $message += "`nNo release was found. Publish a release or run with -Dev for development builds."
            } else {
                $message += "`nCheck your network connection or verify that the repository has published releases."
            }
            Write-Error $message -ErrorAction Continue
            exit 1
        }
    }
    $tag = $release.tag_name
    $zipUrl = $release.zipball_url

    $guid     = [System.Guid]::NewGuid().ToString('N').Substring(0,8)
    $temp     = Join-Path ([System.IO.Path]::GetTempPath()) ("upd-$guid")
    New-Item -ItemType Directory -Path $temp | Out-Null
    $longTemp = "\\?\$temp"
    $zipPath  = Join-Path $temp 'src.zip'
    try {
        Invoke-WebRequest -Uri $zipUrl -Headers $headers -OutFile $zipPath
    } catch {
        Write-Error "Failed to download release archive from ${zipUrl}: $($_.Exception.Message)" -ErrorAction Continue
        exit 1
    }
    Expand-Archive -Path $zipPath -DestinationPath $longTemp -Force
    $dir = Get-ChildItem -Path $temp -Directory | Select-Object -First 1

    # Resolve repository root so the script works regardless of invocation directory
    $root       = Resolve-Path (Join-Path $PSScriptRoot '..') | Select-Object -ExpandProperty Path
    $buildPath  = Join-Path $root 'build'
    $docsPath   = Join-Path $root 'build_docs'
    # Clean up any legacy build folders that may have been created under scripts
    $legacyBuild = Join-Path $PSScriptRoot 'build'
    $legacyDocs  = Join-Path $PSScriptRoot 'build_docs'

    Remove-Item -Recurse -Force $buildPath, $docsPath, $legacyBuild, $legacyDocs -ErrorAction SilentlyContinue
    Copy-Item -Recurse -Force (Join-Path $dir.FullName 'build') $root
    Copy-Item -Recurse -Force (Join-Path $dir.FullName 'build_docs') $root

    Write-Host "Updated MCP to $tag"
} finally {
    if ($longTemp) {
        Remove-Item -Recurse -Force $longTemp -ErrorAction SilentlyContinue
    }
    [System.Net.ServicePointManager]::SecurityProtocol = $origTls
}
