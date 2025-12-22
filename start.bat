@echo off
title Agentic AI - Starting Servers
color 0A

echo ========================================
echo   Starting Agentic AI Application
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if backend .env exists
if not exist "backend\.env" (
    echo [WARNING] backend\.env file not found!
    echo Please create a .env file in the backend folder with:
    echo   GEMINI_API_KEY=your_api_key_here
    echo.
    timeout /t 3 /nobreak >nul
)

echo [1/2] Starting Backend Server...
start "Backend Server - Port 3000" cmd /k "title Backend Server && cd /d %~dp0backend && echo ======================================== && echo   Backend Server && echo ======================================== && echo   Running on: http://localhost:3000 && echo   Press Ctrl+C to stop && echo ======================================== && echo. && node server.js"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Server...
start "Frontend Server - Port 4000" cmd /k "title Frontend Server && cd /d %~dp0frontend && echo ======================================== && echo   Frontend Server && echo ======================================== && echo   Running on: http://localhost:3001 && echo   Press Ctrl+C to stop && echo ======================================== && echo. && npm start"

echo.
echo ========================================
echo   Both servers are starting...
echo ========================================
echo   Backend:  http://localhost:3000
echo   Frontend: http://localhost:4000
echo.
echo   Two terminal windows have been opened
echo   Close those windows to stop the servers
echo.
echo   Or run stop.bat to stop all servers
echo ========================================
echo.
timeout /t 2 /nobreak >nul
exit

