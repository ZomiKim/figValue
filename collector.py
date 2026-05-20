from datetime import datetime, timedelta, timezone

import bunjang
import danggen
import joongna
from firebase_admin import firestore

from firebase_config import db

KST = timezone(timedelta(hours=9))


def keyword_to_doc_id(keyword: str) -> str:
    return keyword.replace(" ", "_")


def today_date_str() -> str:
    return datetime.now(KST).strftime("%Y-%m-%d")


def fmt_won(value) -> str:
    return f"{int(value):,}원"


def summarize_platform(label: str, items: list) -> tuple[int, int]:
    count = len(items)
    if count == 0:
        print(f"{label} 0개 (가격 없음)")
        return 0, 0
    total = sum(item["price"] for item in items)
    print(f"{label} {count}개, 평균가 {fmt_won(total / count)}")
    return count, total


def build_platform_stats(n1, s1, n2, s2, n3, s3) -> dict:
    return {
        "bunjang": {
            "count": n1,
            "avg_price": int(s1 / n1) if n1 else 0,
        },
        "joongna": {
            "count": n2,
            "avg_price": int(s2 / n2) if n2 else 0,
        },
        "carrot": {
            "count": n3,
            "avg_price": int(s3 / n3) if n3 else 0,
        },
    }


def collect_keyword(keyword: str) -> dict | None:
    bun_items = bunjang.search(keyword)
    joo_items = joongna.search(keyword)
    dan_items = danggen.search(keyword)

    print(f"\n검색어: {keyword}")

    n1, s1 = summarize_platform("번개장터", bun_items)
    n2, s2 = summarize_platform("중고나라", joo_items)
    n3, s3 = summarize_platform("당근마켓", dan_items)

    total_count = n1 + n2 + n3
    if total_count == 0:
        print("\n총 평균 가격: 데이터 없음")
        return None

    total_avg = int((s1 + s2 + s3) / total_count)
    print(f"\n총 평균 가격: {fmt_won(total_avg)}")

    return {
        "keyword": keyword,
        "total_avg_price": total_avg,
        "platforms": build_platform_stats(n1, s1, n2, s2, n3, s3),
    }


def save_snapshot(stats: dict, *, date_str: str | None = None) -> None:
    keyword = stats["keyword"]
    doc_id = keyword_to_doc_id(keyword)
    date_str = date_str or today_date_str()

    doc_ref = db.collection("figures").document(doc_id)
    doc_ref.set({
        "keyword": keyword,
        "total_avg_price": stats["total_avg_price"],
        "updated_at": firestore.SERVER_TIMESTAMP,
        "platforms": stats["platforms"],
    })

    doc_ref.collection("history").document(date_str).set({
        "total_avg_price": stats["total_avg_price"],
        "created_at": firestore.SERVER_TIMESTAMP,
        "platform_data": stats["platforms"],
    })

    print(f"Firestore 저장 완료: figures/{doc_id}/history/{date_str}")


def query_and_save(keyword: str) -> bool:
    stats = collect_keyword(keyword.strip())
    if stats is None:
        return False
    save_snapshot(stats)
    return True
