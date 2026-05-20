from urllib.parse import unquote

from collector import keyword_to_doc_id


def decode_keyword(keyword: str) -> str:
    return unquote(keyword).strip()


def keyword_path_to_doc_id(keyword: str) -> str:
    return keyword_to_doc_id(decode_keyword(keyword))
