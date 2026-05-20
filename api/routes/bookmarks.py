from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

import bookmarks as bookmarks_service
from api.deps import decode_keyword

router = APIRouter(prefix="/api/bookmarks", tags=["bookmarks"])


class BookmarkCreate(BaseModel):
    keyword: str = Field(..., min_length=1)


@router.get("")
def get_bookmarks():
    return {"keywords": bookmarks_service.list_bookmarks()}


@router.post("", status_code=201)
def create_bookmark(body: BookmarkCreate):
    keyword = body.keyword.strip()
    if not keyword:
        raise HTTPException(status_code=400, detail="keyword is required")
    bookmarks_service.add_bookmark(keyword)
    return {"ok": True, "keyword": keyword}


@router.delete("/{keyword}")
def delete_bookmark(keyword: str):
    decoded = decode_keyword(keyword)
    if not bookmarks_service.remove_bookmark(decoded):
        raise HTTPException(status_code=404, detail="bookmark not found")
    return {"ok": True, "keyword": decoded}
