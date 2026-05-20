@echo off
set DEPS_DIR=C:\Temp\zomi-nm
set SRC=%~dp0..\frontend\package.json

if not exist "%DEPS_DIR%" mkdir "%DEPS_DIR%"
copy /y "%SRC%" "%DEPS_DIR%\package.json" >nul
cd /d "%DEPS_DIR%"
call npm install --no-fund --no-audit
if errorlevel 1 exit /b 1
echo Dependencies installed to %DEPS_DIR%
exit /b 0
