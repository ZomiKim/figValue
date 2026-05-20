# 📊 figValue

**figValue**는 피규어 중고 시세를 한 번에 모아 볼 수 있는 도구입니다. **중고나라**, **당근마켓**, **번개장터**에서 같은 검색어로 매물을 모은 뒤, 플랫폼별 **평균 가격·매물 수**를 보여 주고, 세 곳을 합친 **총 평균 시세**도 함께 확인할 수 있습니다.

## 💡 왜 쓰나요?

세 사이트를 일일이 열어 가며 가격을 비교하는 대신, **검색 한 번**으로 세 채널 데이터를 묶어 평균을 내 주는 것이 핵심입니다. 시세 감을 잡거나 가격대를 비교할 때 시간을 줄여 줍니다.

## ✨ 주요 기능

- 키워드 검색 시 **번개장터 / 중고나라 / 당근** 각각의 매물 수·평균가 집계
- 세 플랫폼 전체를 합산한 **총 평균 가격** 계산
- 결과를 **Firebase Firestore**에 저장하고, 날짜별 **히스토리**로 쌓아 두어 추이 확인 가능 (API·프론트 연동)
- **FastAPI** REST API, **Next.js** 웹 UI

## 🛠️ 기술 스택

**백엔드**  
<img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python"/> <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI"/> <img src="https://img.shields.io/badge/Uvicorn-2094ff?style=flat-square" alt="Uvicorn"/>

**프론트엔드**  
<img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js"/> <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React"/> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/> <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js"/>

**스타일 · UI**  
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/> <img src="https://img.shields.io/badge/Recharts-8884d8?style=flat-square" alt="Recharts"/>

**데이터 수집**  
<img src="https://img.shields.io/badge/Selenium-43B02A?style=flat-square&logo=selenium&logoColor=white" alt="Selenium"/> <img src="https://img.shields.io/badge/webdriver--manager-333333?style=flat-square" alt="webdriver-manager"/>

**DB · 인증**  
<img src="https://img.shields.io/badge/Firebase-039BE5?style=flat-square&logo=firebase&logoColor=white" alt="Firebase"/> <img src="https://img.shields.io/badge/Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black" alt="Firestore"/>

**품질 도구**  
<img src="https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white" alt="ESLint"/>

## 📋 사전 준비

1. **Python** 가상환경 (예: 프로젝트 관례상 `zomienv`)  
2. **Node.js** (프론트 빌드·개발용)  
3. **Firebase 서비스 계정**  
   - 로컬: 프로젝트 루트에 `firebase_key.json` 배치  
   - 또는 환경 변수 `FIREBASE_CREDENTIALS_JSON`에 JSON 문자열 설정 (`firebase_config.py` 참고)  
4. **Chrome** 등 Selenium이 사용할 브라우저 환경 (수집 스크립트 기준)

## 🚀 로컬 실행

가장 간단한 방법은 루트의 **`run_local.bat`** 을 실행하는 것입니다. API와 프론트가 각각 뜹니다.

- **API (Swagger):** http://127.0.0.1:8001/docs  
- **프론트:** http://localhost:3000  
- **헬스체크:** http://127.0.0.1:8001/api/health  

자세한 분리 실행, `frontend/.env.local` 예시, `node_modules` 문제 시 대응은 **[LOCAL.md](./LOCAL.md)** 를 참고하세요.

### ⚙️ 환경 변수 (요약)

| 변수 | 설명 |
|------|------|
| `ENABLE_QUERY_API` | 원격에서 검색 API 끄기 등에 사용 (기본 `true`) |
| `CORS_ORIGINS` | API CORS에 추가할 오리진 (쉼표 구분) |
| `NEXT_PUBLIC_API_URL` | 프론트 → API 기본 URL (로컬: `http://127.0.0.1:8001`) |
| `NEXT_PUBLIC_QUERY_API_URL` | 검색 API 베이스 URL (통상 API와 동일) |

배포·시크릿 구성은 **[deploy.md](./deploy.md)** 를 참고하세요.

## 📁 저장소 구조 (개략)

```
api/              # FastAPI 앱 (routes: figures, query, bookmarks …)
frontend/         # Next.js UI
*.py              # 플랫폼별 수집·collector·검색 진입 등
firebase_config.py
requirements.txt
```

## 📄 라이선스

저장소에 라이선스 파일이 없다면, 배포 전에 라이선스를 명시하는 것을 권장합니다.
