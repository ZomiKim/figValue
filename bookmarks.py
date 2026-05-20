import sys

from firebase_admin import firestore

from collector import keyword_to_doc_id
from firebase_config import db


def add_bookmark(keyword: str) -> None:
    keyword = keyword.strip()
    if not keyword:
        print("검색어를 입력하세요.")
        return

    doc_id = keyword_to_doc_id(keyword)
    db.collection("bookmarks").document(doc_id).set({
        "keyword": keyword,
        "created_at": firestore.SERVER_TIMESTAMP,
    })
    print(f"북마크 추가: {keyword}")


def list_bookmarks() -> list[str]:
    docs = db.collection("bookmarks").stream()
    keywords = []
    for doc in docs:
        data = doc.to_dict() or {}
        keyword = data.get("keyword", doc.id)
        keywords.append(keyword)
    return keywords


def remove_bookmark(keyword: str) -> bool:
    keyword = keyword.strip()
    if not keyword:
        print("검색어를 입력하세요.")
        return False

    doc_id = keyword_to_doc_id(keyword)
    ref = db.collection("bookmarks").document(doc_id)
    if not ref.get().exists:
        print(f"북마크에 없습니다: {keyword}")
        return False

    ref.delete()
    print(f"북마크 삭제: {keyword}")
    print("(figures/history 수집 데이터는 유지됩니다.)")
    return True


def main():
    if len(sys.argv) < 2:
        print("사용법:")
        print('  python bookmarks.py add "검색어"')
        print("  python bookmarks.py list")
        print('  python bookmarks.py remove "검색어"')
        return

    command = sys.argv[1].lower()

    if command == "add":
        if len(sys.argv) < 3:
            print('사용법: python bookmarks.py add "검색어"')
            return
        add_bookmark(" ".join(sys.argv[2:]))
    elif command == "list":
        keywords = list_bookmarks()
        if not keywords:
            print("북마크가 없습니다.")
            return
        print("북마크 목록:")
        for kw in keywords:
            print(f"  - {kw}")
    elif command == "remove":
        if len(sys.argv) < 3:
            print('사용법: python bookmarks.py remove "검색어"')
            return
        remove_bookmark(" ".join(sys.argv[2:]))
    else:
        print(f"알 수 없는 명령: {command}")


if __name__ == "__main__":
    main()
