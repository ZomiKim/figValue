"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { formatWon } from "@/lib/api";
import type { HistoryPoint } from "@/lib/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Legend,
  Tooltip,
);

const COLORS = {
  total: { stroke: "#18181b", fill: "rgba(24, 24, 27, 0.08)" },
  bunjang: { stroke: "#ea580c", fill: "rgba(234, 88, 12, 0.06)" },
  joongna: { stroke: "#2563eb", fill: "rgba(37, 99, 235, 0.06)" },
  carrot: { stroke: "#16a34a", fill: "rgba(22, 163, 74, 0.06)" },
};

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

  const labels = chartData.map((d) => d.date);

  const lineChartData = {
    labels,
    datasets: [
      {
        label: "총 평균",
        data: chartData.map((d) => d.total),
        borderColor: COLORS.total.stroke,
        backgroundColor: COLORS.total.fill,
        borderWidth: 2.5,
        tension: 0.35,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 2,
        pointHoverBackgroundColor: "#fff",
        spanGaps: true,
      },
      {
        label: "번개장터",
        data: chartData.map((d) => d.bunjang),
        borderColor: COLORS.bunjang.stroke,
        backgroundColor: "transparent",
        borderWidth: 2,
        tension: 0.35,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "#fff",
        spanGaps: true,
      },
      {
        label: "중고나라",
        data: chartData.map((d) => d.joongna),
        borderColor: COLORS.joongna.stroke,
        backgroundColor: "transparent",
        borderWidth: 2,
        tension: 0.35,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "#fff",
        spanGaps: true,
      },
      {
        label: "당근",
        data: chartData.map((d) => d.carrot),
        borderColor: COLORS.carrot.stroke,
        backgroundColor: "transparent",
        borderWidth: 2,
        tension: 0.35,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "#fff",
        spanGaps: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          pointStyle: "line",
          padding: 16,
          font: {
            size: 12,
            family: "var(--font-geist-sans), system-ui, sans-serif",
          },
          color: "#52525b",
        },
      },
      tooltip: {
        backgroundColor: "rgba(24, 24, 27, 0.92)",
        titleColor: "#fafafa",
        bodyColor: "#e4e4e7",
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 4,
        callbacks: {
          title: (items) => (items[0] ? `날짜: ${items[0].label}` : ""),
          label: (item) => {
            if (item.parsed.y == null || Number.isNaN(item.parsed.y)) {
              return `${item.dataset.label}: —`;
            }
            return `${item.dataset.label}: ${formatWon(item.parsed.y)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
          color: "#71717a",
          font: { size: 11 },
        },
        border: { display: false },
      },
      y: {
        ticks: {
          color: "#71717a",
          font: { size: 11 },
          callback: (value) =>
            typeof value === "number"
              ? `${Math.round(value / 10000)}만`
              : value,
        },
        grid: {
          color: "rgba(228, 228, 231, 0.9)",
          lineWidth: 1,
        },
        border: { display: false },
      },
    },
  };

  return (
    <section className="h-80 w-full max-w-full rounded-xl border border-zinc-200/80 bg-gradient-to-b from-zinc-50/80 to-white p-4 shadow-sm">
      <Line data={lineChartData} options={options} />
    </section>
  );
}
