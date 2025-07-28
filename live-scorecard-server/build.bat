@echo off
echo ====================================
echo Enhanced Security Scorecard MCP Setup
echo ====================================

REM Check if Node.js is available
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found. Please install Node.js 18+
    pause
    exit /b 1
)

echo Node.js version:
node --version

REM Check if npm is available
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm not found
    pause
    exit /b 1
)

echo npm version:
npm --version

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: npm install failed
        pause
        exit /b 1
    )
)

REM Clean and build
if exist "build" (
    echo Cleaning build directory...
    rmdir /s /q build
)

echo Building TypeScript...
npx tsc

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo Build successful!

REM Test syntax
echo Testing built file syntax...
node -c build/index.js
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Built file has syntax errors
    pause
    exit /b 1
)

echo Syntax validation passed!

echo.
echo ====================================
echo Build Complete!
echo ====================================
echo.
echo Next steps:
echo 1. Set environment variable: set SECURITY_SCORECARD_API_TOKEN=your-token
echo 2. Update Claude Desktop config manually
echo 3. Restart Claude Desktop
echo 4. Test with: "debug api access for neste.com"
echo.

pause
