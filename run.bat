@echo off
title SentinelAI - CyberSecurity Platform
cd /d "%~dp0"

echo =========================================================
echo   SentinelAI - Cybersecurity Threat Detection Platform
echo   Graphic Era Hill University (Team CSE27-386)
echo =========================================================
echo.

python -c "import pymysql, cryptography" 2>nul
if %errorlevel% neq 0 (
    echo [1/3] Installing required Python packages...
    python -m pip install pymysql cryptography
) else (
    echo [1/3] Python dependencies verified.
)

if not exist node_modules (
    echo [2/3] Installing Node packages...
    call npm install
) else (
    echo [2/3] Node dependencies verified.
)

echo [3/3] Launching Backend & Frontend services...

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING 2^>nul') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING 2^>nul') do taskkill /F /PID %%a >nul 2>&1

start "SentinelAI Backend Server" cmd /k "python server.py"
timeout /t 2 /nobreak >nul

start "SentinelAI Frontend Server" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

start http://localhost:3000

echo.
echo =========================================================
echo   SentinelAI is now running!
echo   - Backend API:  http://localhost:8000
echo   - Frontend UI:  http://localhost:3000
echo   - MySQL Database: sentinel_ai
echo =========================================================
echo.
pause
