@echo off
cd /d "%~dp0"

call scripts\setup_frontend_run.bat
if errorlevel 1 (
  echo Setup failed.
  pause
  exit /b 1
)

echo.
echo Frontend: http://localhost:3000
echo API:      run_api.bat ^(http://127.0.0.1:8001^)
echo Running from C:\Temp\zomi-fe-run ^(avoids broken frontend\node_modules^)
echo.

cd /d C:\Temp\zomi-fe-run
node node_modules\next\dist\bin\next dev -H 127.0.0.1 -p 3000 --webpack
pause
