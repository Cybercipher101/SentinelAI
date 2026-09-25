@echo off
title AI Cybersecurity Assistance - Unified SOC Platform
color 0b

echo ====================================================================
echo  AI CYBERSECURITY ASSISTANCE - STARTUP LAUNCHER
echo  Graphic Era Hill University (Project Team ID: CSE27-386)
echo  Under the Guidance of Mr. Saksham Mittal, Assistant Professor
echo ====================================================================
echo.

echo [1/3] Checking Node.js and Python environment...
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not installed or not in PATH! Please install Python 3.9+.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js/npm is not installed or not in PATH!
    pause
    exit /b 1
)

echo [2/3] Launching Python AI Backend API Server (Port 8000)...
start "AI Cyber Backend (Python API)" cmd /k "python server.py"

echo [3/3] Launching Frontend SOC Dashboard (Port 3000)...
start "AI Cyber Frontend (Vite/React)" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul
start http://localhost:3000/

echo.
echo ====================================================================
echo  AI Cybersecurity Assistance is now running!
echo  - Frontend Dashboard: http://localhost:3000/
echo  - Backend API:        http://localhost:8000/
echo ====================================================================
echo.
