"use client";

import { useState } from "react";

import { fetchHealth, runQuery } from "@/lib/api";
import { docIdToDisplay } from "@/lib/keyword";

type Props = {
  keyword: string;
  onSuccess?: () => void;
};

export function QueryButton({ keyword, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queryEnabled, setQueryEnabled] = useState<boolean | null>(null);

  async function checkEnabled() {
    try {
      const h = await fetchHealth();
      setQueryEnabled(h.query_api_enabled);
      return h.query_api_enabled;
    } catch {
      setQueryEnabled(false);
      return false;
    }
  }

  async function handleQuery() {
    setError(null);
    setLoading(true);
    try {
      const enabled = queryEnabled ?? (await checkEnabled());
      if (!enabled) {
        setError(
          "조회 API가 비활성입니다. 로컬 PC에서 run_api.bat을 실행하세요.",
        );
        return;
      }
      await runQuery(keyword);
      onSuccess?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "조회 실패");
    } finally {
      setLoading(false);
    }
  }

  const label = docIdToDisplay(keyword);

  return (
    <section className="space-y-2">
      <button
        type="button"
        onClick={handleQuery}
        disabled={loading}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading ? `「${label}」 조회 중… (수 분 소요)` : `「${label}」 조회·저장`}
      </button>
      {queryEnabled === false && !loading && (
        <p className="text-sm text-amber-700">
          Render 배포 API에서는 스크래핑이 꺼져 있습니다. 로컬 FastAPI(8001)를
          켜고 NEXT_PUBLIC_QUERY_API_URL을 설정하세요.
        </p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </section>
  );
}
