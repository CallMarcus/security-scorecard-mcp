Param(
    [switch]$Dev,
    [switch]$IncludeDocs,
    [switch]$DocsOnly
)
$ErrorActionPreference = 'Stop'
$owner = 'CallMarcus'
$repo  = 'security-scorecard-mcp'

if ($DocsOnly) { $IncludeDocs = $true }

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

    $coreAsset = $release.assets | Where-Object { $_.name -eq 'mcp-core.zip' } | Select-Object -First 1
    $docsAsset = $release.assets | Where-Object { $_.name -eq 'mcp-docs.zip' } | Select-Object -First 1

    if (-not $DocsOnly -and -not $coreAsset) {
        Write-Error "Release does not contain mcp-core.zip asset." -ErrorAction Continue
        exit 1
    }
    if ($IncludeDocs -and -not $docsAsset) {
        Write-Warning "Release does not contain mcp-docs.zip asset."
    }

    $guid     = [System.Guid]::NewGuid().ToString('N').Substring(0,8)
    $temp     = Join-Path ([System.IO.Path]::GetTempPath()) ("upd-$guid")
    New-Item -ItemType Directory -Path $temp | Out-Null
    $longTemp = "\\?\$temp"

    if (-not $DocsOnly) {
        $coreZip = Join-Path $temp 'mcp-core.zip'
        try {
            Invoke-WebRequest -Uri $coreAsset.browser_download_url -Headers $headers -OutFile $coreZip
        } catch {
            Write-Error "Failed to download core archive: $($_.Exception.Message)" -ErrorAction Continue
            exit 1
        }
        Expand-Archive -Path $coreZip -DestinationPath $longTemp -Force
    }

    if ($IncludeDocs -and $docsAsset) {
        $docsZip = Join-Path $temp 'mcp-docs.zip'
        try {
            Invoke-WebRequest -Uri $docsAsset.browser_download_url -Headers $headers -OutFile $docsZip
        } catch {
            Write-Error "Failed to download docs archive: $($_.Exception.Message)" -ErrorAction Continue
            exit 1
        }
        Expand-Archive -Path $docsZip -DestinationPath $longTemp -Force
    }

    # Resolve repository root so the script works regardless of invocation directory
    $root       = Resolve-Path (Join-Path $PSScriptRoot '..') | Select-Object -ExpandProperty Path
    $buildPath  = Join-Path $root 'build'
    $docsPath   = Join-Path $root 'build_docs'
    # Clean up any legacy build folders that may have been created under scripts
    $legacyBuild = Join-Path $PSScriptRoot 'build'
    $legacyDocs  = Join-Path $PSScriptRoot 'build_docs'

    if ($DocsOnly) {
        Remove-Item -Recurse -Force $docsPath, $legacyDocs -ErrorAction SilentlyContinue
    } else {
        Remove-Item -Recurse -Force $buildPath, $docsPath, $legacyBuild, $legacyDocs -ErrorAction SilentlyContinue
    }

    if (-not $DocsOnly) {
        Copy-Item -Recurse -Force (Join-Path $temp 'build') $root
    }
    if ($IncludeDocs -and $docsAsset) {
        Copy-Item -Recurse -Force (Join-Path $temp 'build_docs') $root
    }

    if ($DocsOnly) {
        Write-Host "Documentation updated to $tag"
    } elseif ($IncludeDocs -and $docsAsset) {
        Write-Host "Updated MCP and documentation to $tag"
    } else {
        Write-Host "Updated MCP to $tag"
    }
} finally {
    if ($longTemp) {
        Remove-Item -Recurse -Force $longTemp -ErrorAction SilentlyContinue
    }
    [System.Net.ServicePointManager]::SecurityProtocol = $origTls
}
