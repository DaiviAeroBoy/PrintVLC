@echo off
title PrintVLC — Universal Client-Side Print Studio
color 0B

echo =====================================================================
echo           PrintVLC -- Universal Client-Side Print Studio
echo           "The VLC Media Player of Printing"
echo =====================================================================
echo.
echo [1/3] Changing directory to application root...
cd /d "%~dp0"

echo [2/3] Verifying runtime dependencies...
if not exist "node_modules\" (
    echo [INFO] First-time setup detected. Auto-installing dependencies...
    call npm install
)

echo [3/3] Launching PrintVLC Local Server on Port 3000...
echo.
echo ---------------------------------------------------------------------
echo URL: http://localhost:3000
echo Privacy: 100%% Client-Side, Zero Server Uploads, Sandboxed
echo ---------------------------------------------------------------------
echo.

:: Automatically open default browser after 2 seconds in background
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:3000"

:: Start the Vite server
npm run dev -- --host 127.0.0.1 --port 3000

pause
