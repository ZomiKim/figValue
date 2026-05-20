import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import bookmarks, figures, query

app = FastAPI(title="Zomi API", version="1.0.0")

_default_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
_extra_origins = os.environ.get("CORS_ORIGINS", "")
_origins = _default_origins + [
    o.strip() for o in _extra_origins.split(",") if o.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bookmarks.router)
app.include_router(figures.router)
app.include_router(query.router)


@app.get("/api/health")
def health():
    return {
        "ok": True,
        "query_api_enabled": query.query_api_enabled(),
    }
