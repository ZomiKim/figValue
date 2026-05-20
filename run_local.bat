@echo off
cd /d "%~dp0"
echo Starting API and Frontend in separate windows...
start "Zomi API" cmd /k "%~dp0run_api.bat"
call scripts\setup_frontend_run.bat >nul 2>&1
timeout /t 3 /nobreak >nul
start "Zomi Frontend" cmd /k "%~dp0run_frontend.bat"
echo.
echo Open http://localhost:3000 in your browser.
echo.
