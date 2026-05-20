"use client";

import { useEffect, useState } from "react";

import { fetchHealth } from "@/lib/api";
import type { HealthResponse } from "@/lib/types";

export function HealthStatus() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHealth()
      .then(setHealth)
      .catch((e: Error) => setError(e.message));
  }, []);

  if (error) {
    return (
      <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        API 연결 실패: {error}
        <br />
        <span className="text-red-600">
          FastAPI를 실행했는지 확인하세요 (run_api.bat, 포트 8001).
        </span>
      </p>
    );
  }

  if (!health) {
    return <p className="text-sm text-zinc-500">API 상태 확인 중…</p>;
  }

  const dotClass = health.ok ? "bg-green-500" : "bg-red-500";
  const queryLabel = health.query_api_enabled
    ? "사용 가능 (로컬)"
    : "비활성 (Render)";

  return (
    <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm">
      <span className={`mr-2 inline-block h-2 w-2 rounded-full ${dotClass}`} />
      {`API 정상 · 조회(스크래핑) ${queryLabel}`}
    </p>
  );
}
