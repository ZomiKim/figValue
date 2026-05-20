export type PlatformStats = {
  count: number;
  avg_price: number;
};

export type HealthResponse = {
  ok: boolean;
  query_api_enabled: boolean;
};

export type BookmarksResponse = {
  keywords: string[];
};

export type HistoryPoint = {
  date: string;
  total_avg_price: number | null;
  platform_data: Record<string, PlatformStats>;
  created_at?: string | null;
};

export type FigureLatest = {
  doc_id: string;
  keyword: string;
  total_avg_price: number | null;
  platforms: Record<string, PlatformStats>;
  updated_at?: string | null;
};

export type FiguresListResponse = {
  figures: Array<{
    doc_id: string;
    keyword: string;
    total_avg_price: number | null;
  }>;
};
