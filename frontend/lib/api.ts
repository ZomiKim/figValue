import { keywordToDocId } from "@/lib/keyword";
import type {
  BookmarksResponse,
  FigureLatest,
  FiguresListResponse,
  HealthResponse,
  HistoryPoint,
} from "@/lib/types";

const DEFAULT_API = "http://127.0.0.1:8001";

export function getApiBase(): string {
  return (process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API).replace(/\/$/, "");
}

export function getQueryApiBase(): string {
  return (process.env.NEXT_PUBLIC_QUERY_API_URL ?? getApiBase()).replace(
    /\/$/,
    "",
  );
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail ?? body.message ?? detail;
    } catch {
      /* ignore */
    }
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export function fetchHealth(): Promise<HealthResponse> {
  return request(`${getApiBase()}/api/health`);
}

export function fetchBookmarks(): Promise<BookmarksResponse> {
  return request(`${getApiBase()}/api/bookmarks`);
}

export function addBookmark(keyword: string): Promise<{ ok: boolean; keyword: string }> {
  return request(`${getApiBase()}/api/bookmarks`, {
    method: "POST",
    body: JSON.stringify({ keyword }),
  });
}

export function removeBookmark(keyword: string): Promise<{ ok: boolean; keyword: string }> {
  const docId = keywordToDocId(keyword);
  return request(`${getApiBase()}/api/bookmarks/${encodeURIComponent(docId)}`, {
    method: "DELETE",
  });
}

export function fetchFigures(): Promise<FiguresListResponse> {
  return request(`${getApiBase()}/api/figures`);
}

export function fetchFigureLatest(docId: string): Promise<FigureLatest> {
  return request(
    `${getApiBase()}/api/figures/${encodeURIComponent(docId)}/latest`,
  );
}

export function fetchFigureHistory(docId: string): Promise<HistoryPoint[]> {
  return request(
    `${getApiBase()}/api/figures/${encodeURIComponent(docId)}/history`,
  );
}

export function runQuery(keyword: string): Promise<{ ok: boolean; keyword: string }> {
  return request(`${getQueryApiBase()}/api/query`, {
    method: "POST",
    body: JSON.stringify({ keyword }),
  });
}

export function formatWon(value: number | null | undefined): string {
  if (value == null) return "—";
  return `${value.toLocaleString("ko-KR")}원`;
}
