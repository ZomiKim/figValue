# 로컬 실행 가이드

## 한 번에 실행 (권장)

1. **`run_local.bat`** 더블클릭  
   - API 창 + 프론트 창이 각각 열립니다.

## 따로 실행

| 순서 | 파일 | 주소 |
|------|------|------|
| 1 | `run_api.bat` | http://127.0.0.1:8001/docs |
| 2 | `run_frontend.bat` | http://localhost:3000 |

**API 창은 닫지 마세요.** `Uvicorn running on http://127.0.0.1:8001` 이 보여야 합니다.

## 프론트 `npm install` 오류 시

`frontend\node_modules` 가 깨졌을 때:

1. Cursor·터미널에서 `node` 프로세스 모두 종료
2. 탐색기에서 `frontend\node_modules` 폴더 **삭제**
3. `run_frontend.bat` 다시 실행 (의존성은 `C:\Temp\zomi-nm` 에 설치됨)

또는 관리자 cmd:

```bat
rmdir /s /q "\\?\C:\Users\좀비\Desktop\zomi-python\frontend\node_modules"
run_frontend.bat
```

## 환경 변수

`frontend\.env.local`:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8001
NEXT_PUBLIC_QUERY_API_URL=http://127.0.0.1:8001
```
