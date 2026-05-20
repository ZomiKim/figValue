@echo off
set RUN_DIR=C:\Temp\zomi-fe-run
set SRC=%~dp0..\frontend
set DEPS=C:\Temp\zomi-nm

if not exist "%DEPS%\node_modules\next\package.json" (
  call "%~dp0install_frontend_deps.bat"
  if errorlevel 1 exit /b 1
)

if not exist "%RUN_DIR%" mkdir "%RUN_DIR%"

copy /y "%SRC%\package.json" "%RUN_DIR%\package.json" >nul
copy /y "%SRC%\next.config.ts" "%RUN_DIR%\next.config.ts" >nul
copy /y "%SRC%\tsconfig.json" "%RUN_DIR%\tsconfig.json" >nul
copy /y "%SRC%\postcss.config.mjs" "%RUN_DIR%\postcss.config.mjs" >nul
copy /y "%SRC%\next-env.d.ts" "%RUN_DIR%\next-env.d.ts" >nul 2>nul
if exist "%SRC%\.env.local" copy /y "%SRC%\.env.local" "%RUN_DIR%\.env.local" >nul
if exist "%SRC%\.env" copy /y "%SRC%\.env" "%RUN_DIR%\.env" >nul

call :linkdir app
call :linkdir components
call :linkdir lib
call :linkdir public

if exist "%RUN_DIR%\node_modules" rmdir "%RUN_DIR%\node_modules" 2>nul
mklink /J "%RUN_DIR%\node_modules" "%DEPS%\node_modules" >nul
if errorlevel 1 (
  echo Failed to link node_modules
  exit /b 1
)

exit /b 0

:linkdir
if exist "%RUN_DIR%\%~1" rmdir "%RUN_DIR%\%~1" 2>nul
mklink /J "%RUN_DIR%\%~1" "%SRC%\%~1" >nul
exit /b 0
