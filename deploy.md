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

## 한 번에 점검 (체크리스트)

1. [ ] GitHub에 모노레포가 최신 상태로 push되어 있음
2. [ ] Vercel에서 **동일 저장소** Import → **Root Directory**만 `frontend`로 지정
3. [ ] **Environment Variables**에 아래 변수 등록 후 **재배포** (`NEXT_*`는 빌드 때 박히므로 값 바꾸면 Redeploy 필요)
4. [ ] Render 서비스의 **`CORS_ORIGINS`**에 Vercel 프로덕션 URL(예: `https://xxx.vercel.app`) 포함 후 Render 재배포·재시작
5. [ ] 브라우저에서 사이트 열어 목록·북마크 등 API 연동 확인 (개발자 도구 Network에서 `figvalue.onrender.com` 또는 본인 API 호출 확인)

## 프로젝트 설정

| 항목 | 값 |
|------|-----|
| Root Directory | `frontend` |
| Framework Preset | Next.js |
| Build Command | (기본) `next build` |
| Install Command | (기본) `npm install` |

Node 버전 문제 시 Vercel **Project Settings → Environment → Node.js Version**을 Next 16과 호환되는 버전(예: 20 LTS)으로 맞춤.

## 환경 변수

Vercel 대시보드: **프로젝트 → Settings → Environment Variables**. **Production**(필요 시 Preview)에만 넣어도 됩니다.

| 변수 | Production 값 예시 | 설명 |
|------|-------------------|------|
| `NEXT_PUBLIC_API_URL` | `https://figvalue.onrender.com` | 브라우저가 불러오는 FastAPI 베이스 URL. 끝 `/` 유무 무관 |
| `NEXT_PUBLIC_QUERY_API_URL` | 비우거나 `NEXT_PUBLIC_API_URL`와 동일 | 검색 조회 전용 베이스. Render에서 조회가 꺼져 있으면 503 가능. 로컬 API만 쓸 때만 별도 URL(로컬·ngrok 등) 검토 |

`NEXT_PUBLIC_*` 이름은 브라우저에 포함되므로 **비밀 키는 넣지 말 것**.

로컬 예시 변수는 **[LOCAL.md](./LOCAL.md)** 의 `frontend/.env.local` 절 참고.

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
