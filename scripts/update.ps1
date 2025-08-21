Param(
    [switch]$IncludeDocs,
    [switch]$DocsOnly
)
$ErrorActionPreference = 'Stop'
$owner = 'CallMarcus'
$repo  = 'security-scorecard-mcp'

if ($DocsOnly) { $IncludeDocs = $true }

$api = "https://api.github.com/repos/$owner/$repo/releases/latest"

$token = $env:GITHUB_TOKEN
# Headers for GitHub API requests
$apiHeaders = @{
    'User-Agent' = 'security-scorecard-mcp'
    'Accept'     = 'application/vnd.github+json'
}
# Headers for downloading release assets (no JSON accept header)
$downloadHeaders = @{
    'User-Agent' = 'security-scorecard-mcp'
}
if ($token) {
    $apiHeaders['Authorization'] = "token $token"
    $downloadHeaders['Authorization'] = "token $token"
}

$origTls = [System.Net.ServicePointManager]::SecurityProtocol
try {
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

    $release = $null
    try {
        $release = Invoke-RestMethod -Uri $api -Headers $apiHeaders
    } catch {
        $status = $_.Exception.Response.StatusCode.value__
        
        # For private repos or when /latest fails, try getting all releases and pick the first non-prerelease
        if ($status -eq 404) {
            Write-Warning "Latest release endpoint returned 404 (likely private repo). Trying fallback method..."
            try {
                $allReleasesApi = "https://api.github.com/repos/$owner/$repo/releases"
                $allReleases = Invoke-RestMethod -Uri $allReleasesApi -Headers $apiHeaders
                $release = $allReleases | Where-Object { -not $_.prerelease -and -not $_.draft } | Select-Object -First 1
                
                if (-not $release) {
                    Write-Error "No non-prerelease releases found in the repository." -ErrorAction Continue
                    exit 1
                }
                
                Write-Host "Found latest release: $($release.tag_name)" -ForegroundColor Green
            } catch {
                $message = "Failed to retrieve releases from repository: $($_.Exception.Message)"
                if (-not $token) {
                    $message += "`nThis appears to be a private repository. Please set GITHUB_TOKEN environment variable with a valid GitHub token."
                }
                Write-Error $message -ErrorAction Continue
                exit 1
            }
        } else {
            $message = "Failed to retrieve release info from ${api}: $($_.Exception.Message)"
            $message += "`nCheck your network connection or verify that the repository has published releases."
            Write-Error $message -ErrorAction Continue
            exit 1
        }
    }
    $tag = $release.tag_name

    $coreAsset = $release.assets | Where-Object { $_.name -eq 'mcp-core.zip' } | Select-Object -First 1
    $docsAsset = $release.assets | Where-Object { $_.name -eq 'mcp-docs.zip' } | Select-Object -First 1

    $useZipball = $false
    if (-not $DocsOnly -and -not $coreAsset) {
        Write-Warning "Release does not contain mcp-core.zip asset. Falling back to source archive."
        $useZipball = $true
    }
    if ($IncludeDocs -and -not $docsAsset) {
        Write-Warning "Release does not contain mcp-docs.zip asset. Falling back to source archive."
        $useZipball = $true
    }

    $guid     = [System.Guid]::NewGuid().ToString('N').Substring(0,8)
    $temp     = Join-Path ([System.IO.Path]::GetTempPath()) ("upd-$guid")
    New-Item -ItemType Directory -Path $temp | Out-Null
    # Avoid using the long-path prefix (\\?\) because Expand-Archive doesn't
    # handle those paths and throws "drive is null" errors on Windows. The
    # regular temp path is sufficient here.
    $longTemp = $temp

    $srcRoot = $null
    if ($useZipball) {
        $srcZip = Join-Path $temp 'src.zip'
        try {
            Invoke-WebRequest -Uri $release.zipball_url -Headers $downloadHeaders -OutFile $srcZip
        } catch {
            Write-Error "Failed to download source archive: $($_.Exception.Message)" -ErrorAction Continue
            exit 1
        }
        Expand-Archive -Path $srcZip -DestinationPath $longTemp -Force
        $srcRoot = Get-ChildItem -Path $longTemp -Directory | Select-Object -First 1
    } else {
        if (-not $DocsOnly) {
            $coreZip = Join-Path $temp 'mcp-core.zip'
            try {
                # Use API download URL instead of browser_download_url for authentication
                $downloadHeaders['Accept'] = 'application/octet-stream'
                Invoke-WebRequest -Uri $coreAsset.url -Headers $downloadHeaders -OutFile $coreZip
                Expand-Archive -Path $coreZip -DestinationPath $longTemp -Force
            } catch {
                Write-Warning "Failed to download core archive: $($_.Exception.Message). Falling back to source archive."
                $useZipball = $true
            }
        }
        if ($IncludeDocs -and $docsAsset -and -not $useZipball) {
            $docsZip = Join-Path $temp 'mcp-docs.zip'
            try {
                # Use API download URL instead of browser_download_url for authentication
                $downloadHeaders['Accept'] = 'application/octet-stream'  
                Invoke-WebRequest -Uri $docsAsset.url -Headers $downloadHeaders -OutFile $docsZip
                Expand-Archive -Path $docsZip -DestinationPath $longTemp -Force
            } catch {
                Write-Warning "Failed to download docs archive: $($_.Exception.Message). Falling back to source archive."
                $useZipball = $true
            }
        }
    }

    if ($useZipball -and -not $srcRoot) {
        Remove-Item -Recurse -Force $longTemp -ErrorAction SilentlyContinue
        New-Item -ItemType Directory -Path $temp | Out-Null
        $srcZip = Join-Path $temp 'src.zip'
        try {
            Invoke-WebRequest -Uri $release.zipball_url -Headers $downloadHeaders -OutFile $srcZip
        } catch {
            Write-Error "Failed to download source archive: $($_.Exception.Message)" -ErrorAction Continue
            exit 1
        }
        Expand-Archive -Path $srcZip -DestinationPath $longTemp -Force
        $srcRoot = Get-ChildItem -Path $longTemp -Directory | Select-Object -First 1
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

    $sourceBuild = $null
    $sourceDocs  = $null
    if ($useZipball) {
        if (-not $DocsOnly) { $sourceBuild = Join-Path $srcRoot.FullName 'build' }
        if ($IncludeDocs)  { $sourceDocs  = Join-Path $srcRoot.FullName 'build_docs' }
    } else {
        # For pre-built packages, copy all contents (build, node_modules, package.json, etc.)
        if (-not $DocsOnly) { 
            # Copy all package contents, not just build directory
            Get-ChildItem -Path $temp | ForEach-Object {
                $destPath = Join-Path $root $_.Name
                if ($_.PSIsContainer) {
                    # Remove existing directory first to avoid conflicts
                    if (Test-Path $destPath) {
                        Remove-Item -Recurse -Force $destPath -ErrorAction SilentlyContinue
                    }
                    Copy-Item -Recurse -Force $_.FullName $destPath
                } else {
                    Copy-Item -Force $_.FullName $destPath
                }
            }
        }
        if ($IncludeDocs -and $docsAsset) { $sourceDocs = Join-Path $temp 'build_docs' }
    }

    # Only copy build directory for source packages (zipball)
    if ($useZipball -and -not $DocsOnly -and $sourceBuild) {
        Copy-Item -Recurse -Force $sourceBuild $root
    }
    if ($IncludeDocs -and $sourceDocs) {
        Copy-Item -Recurse -Force $sourceDocs $root
    }

    if ($DocsOnly) {
        Write-Host "Documentation updated to $tag"
    } elseif ($IncludeDocs) {
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
