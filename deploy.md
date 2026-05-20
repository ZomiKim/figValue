# Render 배포 (FastAPI)

## Web Service 설정

| 항목 | 값 |
|------|-----|
| Root Directory | (repo 루트) |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn api.main:app --host 0.0.0.0 --port $PORT` |
| Runtime | Python 3 |

## 환경 변수

| 변수 | 값 | 설명 |
|------|-----|------|
| `FIREBASE_CREDENTIALS_JSON` | Firebase 서비스 계정 JSON 전체 | Secret으로 등록 |
| `ENABLE_QUERY_API` | `false` | Render에서는 스크래핑 비활성 |
| `CORS_ORIGINS` | `https://your-app.vercel.app` | Next.js 프로덕션 URL (쉼표 구분) |

로컬 개발 (프로젝트 루트에서):

```bat
zomienv\Scripts\python.exe -m uvicorn api.main:app --reload --host 127.0.0.1 --port 8001
```

또는 `run_api.bat` 더블클릭.

8000 포트가 이미 쓰이면 `WinError 10013`이 납니다. 다른 포트(8001)를 쓰거나 기존 프로세스를 종료하세요.

조회(스크래핑)는 로컬에서만:

```bat
set ENABLE_QUERY_API=true
zomienv\Scripts\python.exe -m uvicorn api.main:app --reload --host 127.0.0.1 --port 8001
```

## 확인 URL

- 로컬 Swagger: http://127.0.0.1:8001/docs
- Render Swagger: `https://<service>.onrender.com/docs`
- 헬스체크: `/api/health` (로컬 예: http://127.0.0.1:8001/api/health)

`POST /api/query`는 Render에서 503이 정상입니다.

---

# Vercel 배포 (Next.js)

## 프로젝트 설정

| 항목 | 값 |
|------|-----|
| Root Directory | `frontend` |
| Framework Preset | Next.js |
| Build Command | (기본) `next build` |
| Install Command | (기본) `npm install` |

## 환경 변수

| 변수 | 프로덕션 예시 |
|------|----------------|
| `NEXT_PUBLIC_API_URL` | `https://<render-service>.onrender.com` |
| `NEXT_PUBLIC_QUERY_API_URL` | `http://127.0.0.1:8001` (로컬 조회용) 또는 ngrok URL |

로컬: [`frontend/.env.example`](frontend/.env.example)를 복사해 `frontend/.env.local` 생성.

## 로컬 프론트 실행

```bat
cd frontend
npm install
npm run dev
```

→ http://localhost:3000

터미널 2개: API(`run_api.bat`) + 프론트(`npm run dev`).

## 배포 순서

1. GitHub에 모노레포 push
2. Render: FastAPI Web Service (위 섹션)
3. Vercel: Import repo, Root Directory = `frontend`
4. Render `CORS_ORIGINS`에 Vercel URL 추가
5. Vercel `NEXT_PUBLIC_API_URL` = Render URL
