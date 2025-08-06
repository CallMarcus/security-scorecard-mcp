# debug_mcp_setup.ps1
# PowerShell script to help set up debugging for SecurityScorecard MCP

Write-Host "SecurityScorecard MCP Debugging Setup" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "Note: Some operations may require administrator privileges" -ForegroundColor Yellow
}

# Set working directory
$mcpPath = "C:\Claude\security-scorecard-mcp\security-scorecard-mcp"
if (Test-Path $mcpPath) {
    Set-Location $mcpPath
    Write-Host "Working directory set to: $mcpPath" -ForegroundColor Cyan
} else {
    Write-Host "ERROR: MCP directory not found at $mcpPath" -ForegroundColor Red
    exit
}

# Function to backup files
function Backup-File {
    param($FilePath)
    
    if (Test-Path $FilePath) {
        $backupPath = "$FilePath.backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
        Copy-Item $FilePath $backupPath
        Write-Host "Backed up: $FilePath -> $backupPath" -ForegroundColor Green
        return $backupPath
    } else {
        Write-Host "File not found: $FilePath" -ForegroundColor Red
        return $null
    }
}

# Menu function
function Show-Menu {
    Write-Host "`n=== DEBUGGING MENU ===" -ForegroundColor Yellow
    Write-Host "1. Test API endpoints directly"
    Write-Host "2. Backup MCP server files"
    Write-Host "3. Apply debug patches (manual step required)"
    Write-Host "4. View Claude Desktop logs"
    Write-Host "5. Restore from backup"
    Write-Host "6. Set API token environment variable"
    Write-Host "Q. Quit"
    Write-Host ""
}

# Main loop
do {
    Show-Menu
    $choice = Read-Host "Select an option"
    
    switch ($choice) {
        '1' {
            Write-Host "`nTesting API endpoints..." -ForegroundColor Cyan
            
            # Check if API token is set
            if (-not $env:SECURITY_SCORECARD_API_TOKEN) {
                $token = Read-Host "Enter your SecurityScorecard API token" -AsSecureString
                $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
                $env:SECURITY_SCORECARD_API_TOKEN = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
            }
            
            # Run the test script
            if (Test-Path "build_docs\test_api_endpoints.js") {
                $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
                $outputFile = "api_test_results_$timestamp.txt"
                
                Write-Host "Running API tests..." -ForegroundColor Yellow
                node build_docs\test_api_endpoints.js | Tee-Object -FilePath $outputFile
                
                Write-Host "`nResults saved to: $outputFile" -ForegroundColor Green
            } else {
                Write-Host "Test script not found at build_docs\test_api_endpoints.js" -ForegroundColor Red
            }
        }
        
        '2' {
            Write-Host "`nBacking up MCP server files..." -ForegroundColor Cyan
            
            # Backup main files
            $filesToBackup = @(
                "build\index.js",
                "build\index.js.map",
                "build\index.d.ts"
            )
            
            foreach ($file in $filesToBackup) {
                Backup-File $file
            }
        }
        
        '3' {
            Write-Host "`nDebug patches are available in:" -ForegroundColor Cyan
            Write-Host "  build_docs\debug_patch.js" -ForegroundColor Yellow
            Write-Host "  build_docs\quick_fixes.js" -ForegroundColor Yellow
            Write-Host "`nPlease manually apply these patches to build\index.js" -ForegroundColor Magenta
            Write-Host "Refer to DEBUGGING_INSTRUCTIONS.md for detailed steps" -ForegroundColor Magenta
            
            # Open the files in notepad for easy access
            $openFiles = Read-Host "Open files in notepad? (Y/N)"
            if ($openFiles -eq 'Y') {
                Start-Process notepad "build\index.js"
                Start-Process notepad "build_docs\debug_patch.js"
                Start-Process notepad "build_docs\DEBUGGING_INSTRUCTIONS.md"
            }
        }
        
        '4' {
            Write-Host "`nOpening Claude Desktop..." -ForegroundColor Cyan
            Write-Host "Once open, press Ctrl+Shift+I to access Developer Tools" -ForegroundColor Yellow
            Write-Host "Look for [DEBUG] messages in the Console tab" -ForegroundColor Yellow
            
            # Try to find and open Claude Desktop
            $claudePath = "$env:LOCALAPPDATA\Programs\claude\Claude.exe"
            if (Test-Path $claudePath) {
                Start-Process $claudePath
            } else {
                Write-Host "Claude Desktop not found at expected location" -ForegroundColor Red
                Write-Host "Please open Claude Desktop manually" -ForegroundColor Yellow
            }
        }
        
        '5' {
            Write-Host "`nAvailable backups:" -ForegroundColor Cyan
            $backups = Get-ChildItem -Path "build" -Filter "*.backup_*" | Sort-Object LastWriteTime -Descending
            
            if ($backups.Count -eq 0) {
                Write-Host "No backups found" -ForegroundColor Yellow
            } else {
                for ($i = 0; $i -lt $backups.Count; $i++) {
                    Write-Host "$($i + 1). $($backups[$i].Name) - $($backups[$i].LastWriteTime)" -ForegroundColor White
                }
                
                $selection = Read-Host "Select backup to restore (or 0 to cancel)"
                if ($selection -ne '0' -and $selection -le $backups.Count) {
                    $backup = $backups[$selection - 1]
                    $originalName = $backup.Name -replace '\.backup_.*$', ''
                    $originalPath = Join-Path $backup.DirectoryName $originalName
                    
                    Copy-Item $backup.FullName $originalPath -Force
                    Write-Host "Restored: $($backup.Name) -> $originalName" -ForegroundColor Green
                }
            }
        }
        
        '6' {
            Write-Host "`nSetting API token environment variable..." -ForegroundColor Cyan
            $token = Read-Host "Enter your SecurityScorecard API token" -AsSecureString
            $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
            $tokenString = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
            
            # Set for current session
            $env:SECURITY_SCORECARD_API_TOKEN = $tokenString
            
            # Optionally set permanently (user level)
            $setPermanent = Read-Host "Set permanently for user? (Y/N)"
            if ($setPermanent -eq 'Y') {
                [Environment]::SetEnvironmentVariable("SECURITY_SCORECARD_API_TOKEN", $tokenString, "User")
                Write-Host "Token set permanently for current user" -ForegroundColor Green
            }
            
            Write-Host "Token set for current session" -ForegroundColor Green
        }
    }
    
    if ($choice -ne 'Q') {
        Write-Host "`nPress any key to continue..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
    
} while ($choice -ne 'Q')

Write-Host "`nExiting debug setup..." -ForegroundColor Cyan
