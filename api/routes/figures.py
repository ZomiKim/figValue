from fastapi import APIRouter, HTTPException

from api.deps import decode_keyword, keyword_path_to_doc_id
from firebase_config import db

router = APIRouter(prefix="/api/figures", tags=["figures"])


def _serialize_timestamp(value):
    if value is None:
        return None
    if hasattr(value, "isoformat"):
        return value.isoformat()
    return str(value)


@router.get("")
def list_figures():
    items = []
    for doc in db.collection("figures").stream():
        data = doc.to_dict() or {}
        items.append({
            "doc_id": doc.id,
            "keyword": data.get("keyword", doc.id),
            "total_avg_price": data.get("total_avg_price"),
        })
    items.sort(key=lambda x: x["keyword"])
    return {"figures": items}


@router.get("/{keyword}/latest")
def get_latest(keyword: str):
    doc_id = keyword_path_to_doc_id(keyword)
    doc = db.collection("figures").document(doc_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="figure not found")

    data = doc.to_dict() or {}
    return {
        "doc_id": doc.id,
        "keyword": data.get("keyword", decode_keyword(keyword)),
        "total_avg_price": data.get("total_avg_price"),
        "platforms": data.get("platforms", {}),
        "updated_at": _serialize_timestamp(data.get("updated_at")),
    }


@router.get("/{keyword}/history")
def get_history(keyword: str):
    doc_id = keyword_path_to_doc_id(keyword)
    parent = db.collection("figures").document(doc_id).get()
    if not parent.exists:
        raise HTTPException(status_code=404, detail="figure not found")

    rows = []
    for doc in db.collection("figures").document(doc_id).collection("history").stream():
        data = doc.to_dict() or {}
        rows.append({
            "date": doc.id,
            "total_avg_price": data.get("total_avg_price"),
            "platform_data": data.get("platform_data", {}),
            "created_at": _serialize_timestamp(data.get("created_at")),
        })

    rows.sort(key=lambda x: x["date"])
    return rows
