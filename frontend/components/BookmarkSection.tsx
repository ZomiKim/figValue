"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";

import { addBookmark, fetchBookmarks, removeBookmark } from "@/lib/api";
import { keywordToDocId } from "@/lib/keyword";

export function BookmarkSection() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBookmarks();
      setKeywords(data.keywords);
    } catch (e) {
      setError(e instanceof Error ? e.message : "불러오기 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    const kw = newKeyword.trim();
    if (!kw) return;
    setBusy(kw);
    setError(null);
    try {
      await addBookmark(kw);
      setNewKeyword("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "추가 실패");
    } finally {
      setBusy(null);
    }
  }

  async function handleRemove(keyword: string) {
    setBusy(keyword);
    setError(null);
    try {
      await removeBookmark(keyword);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "삭제 실패");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="space-y-4 px-4">
      <h2 className="text-lg font-semibold text-zinc-900">북마크</h2>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          placeholder="검색어 추가"
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={busy !== null}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          추가
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-zinc-500">불러오는 중…</p>
      ) : keywords.length === 0 ? (
        <p className="text-sm text-zinc-500">북마크가 없습니다.</p>
      ) : (
        <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200">
          {keywords.map((kw) => {
            const docId = keywordToDocId(kw);
            return (
              <li
                key={docId}
                className="flex items-center justify-between gap-2 px-4 py-3"
              >
                <Link
                  href={`/figures/${encodeURIComponent(docId)}`}
                  className="font-medium text-zinc-900 hover:underline"
                >
                  {kw}
                </Link>
                <button
                  type="button"
                  onClick={() => handleRemove(kw)}
                  disabled={busy === kw}
                  className="text-sm text-red-600 hover:underline disabled:opacity-50"
                >
                  삭제
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
