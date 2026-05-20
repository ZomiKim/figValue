"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatWon } from "@/lib/api";
import type { HistoryPoint } from "@/lib/types";

type Props = {
  data: HistoryPoint[];
};

export function PriceChart({ data }: Props) {
  const chartData = data
    .filter((d) => d.total_avg_price != null)
    .map((d) => ({
      date: d.date,
      total: d.total_avg_price,
      bunjang: d.platform_data?.bunjang?.avg_price ?? null,
      joongna: d.platform_data?.joongna?.avg_price ?? null,
      carrot: d.platform_data?.carrot?.avg_price ?? null,
    }));

  if (chartData.length === 0) {
    return (
      <p className="text-sm text-zinc-500">표시할 가격 이력이 없습니다.</p>
    );
  }

  return (
    <section className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `${Math.round(v / 10000)}만`}
          />
          <Tooltip
            formatter={(value: number) => formatWon(value)}
            labelFormatter={(label) => `날짜: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="total"
            name="총 평균"
            stroke="#18181b"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="bunjang"
            name="번개장터"
            stroke="#f97316"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="joongna"
            name="중고나라"
            stroke="#3b82f6"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="carrot"
            name="당근"
            stroke="#22c55e"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}
