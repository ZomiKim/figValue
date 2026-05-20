import asyncio
import os

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from collector import query_and_save

router = APIRouter(prefix="/api", tags=["query"])

_query_lock = asyncio.Lock()


def query_api_enabled() -> bool:
    return os.environ.get("ENABLE_QUERY_API", "true").lower() in ("1", "true", "yes")


class QueryRequest(BaseModel):
    keyword: str = Field(..., min_length=1)


@router.post("/query")
async def run_query(body: QueryRequest):
    if not query_api_enabled():
        raise HTTPException(
            status_code=503,
            detail="Query API is disabled on this server. Run locally with ENABLE_QUERY_API=true.",
        )

    keyword = body.keyword.strip()
    if not keyword:
        raise HTTPException(status_code=400, detail="keyword is required")

    if _query_lock.locked():
        raise HTTPException(status_code=409, detail="Another query is already running")

    async with _query_lock:
        ok = await asyncio.to_thread(query_and_save, keyword)

    if not ok:
        raise HTTPException(status_code=404, detail="No listings found for keyword")

    return {"ok": True, "keyword": keyword}
