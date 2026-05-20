@echo off
cd /d "%~dp0"

if not exist "zomienv\Scripts\python.exe" (
  echo Virtual env not found. Create zomienv first.
  pause
  exit /b 1
)

if not exist "firebase_key.json" (
  echo firebase_key.json not found in project root.
  pause
  exit /b 1
)

echo Installing Python packages if needed...
zomienv\Scripts\python.exe -m pip install -q -r requirements.txt

set ENABLE_QUERY_API=true

echo.
echo API:     http://127.0.0.1:8001
echo Swagger: http://127.0.0.1:8001/docs
echo Health:  http://127.0.0.1:8001/api/health
echo.
echo Keep this window open. Press Ctrl+C to stop.
echo.

zomienv\Scripts\python.exe -m uvicorn api.main:app --host 127.0.0.1 --port 8001 --reload
pause
