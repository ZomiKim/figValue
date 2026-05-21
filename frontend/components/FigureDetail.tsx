"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { PriceChart } from "@/components/PriceChart";
import { QueryButton } from "@/components/QueryButton";
import { fetchFigureHistory, fetchFigureLatest, formatWon } from "@/lib/api";
import { docIdToDisplay } from "@/lib/keyword";
import type { FigureLatest, HistoryPoint } from "@/lib/types";

type Props = {
  docId: string;
};

export function FigureDetail({ docId }: Props) {
  const [latest, setLatest] = useState<FigureLatest | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [l, h] = await Promise.all([
        fetchFigureLatest(docId),
        fetchFigureHistory(docId),
      ]);
      setLatest(l);
      setHistory(h);
    } catch (e) {
      setError(e instanceof Error ? e.message : "불러오기 실패");
    } finally {
      setLoading(false);
    }
  }, [docId]);

  useEffect(() => {
    load();
  }, [load]);

  const displayName = latest?.keyword ?? docIdToDisplay(docId);

  return (
    <article className="space-y-8">
      <header className="flex flex-col items-center space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-[20px]  bg-pink-300 px-3 py-2 transition-colors hover:bg-pink-400"
          aria-label="홈으로 가기"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white">
            <img
              src="/homeIcon.png"
              alt=""
              className="h-5 w-5 object-contain"
            />
          </span>
          <span className="text-sm font-semibold text-white">홈으로 가기</span>
        </Link>
        <h1 className="text-2xl font-semibold text-zinc-900">{displayName}</h1>
        {latest && (
          <p className="text-lg text-zinc-700">
            최신 총 평균: {formatWon(latest.total_avg_price)}
          </p>
        )}
        <QueryButton keyword={displayName} onSuccess={load} />
      </header>

      {loading && <p className="text-sm text-zinc-500">데이터 불러오는 중…</p>}
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <section>
            <h2 className="mb-4 text-lg font-semibold">가격 추이</h2>
            <PriceChart data={history} />
          </section>

          {latest?.platforms && (
            <section>
              <h2 className="mb-2 text-lg font-semibold">플랫폼별 (최신)</h2>
              <ul className="grid gap-2 sm:grid-cols-3">
                {Object.entries(latest.platforms).map(([name, stats]) => (
                  <li
                    key={name}
                    className="rounded-lg border border-zinc-200 px-4 py-3 text-sm"
                  >
                    <p className="font-medium capitalize">{name}</p>
                    <p>
                      {stats.count}건 · {formatWon(stats.avg_price)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </article>
  );
}
