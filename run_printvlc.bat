@echo off
title PrintVLC — Universal Client-Side Print Studio
cd /d "%~dp0"
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:3000"
npm run dev -- --host 127.0.0.1 --port 3000
pause
