import { BookmarkSection } from "@/components/BookmarkSection";
import { HealthStatus } from "@/components/HealthStatus";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-10">
      <header className="mb-8 space-y-2">
        <h1 className="text-2xl font-bold text-zinc-900">Zomi</h1>
        <p className="text-sm text-zinc-600">
          중고 플랫폼 가격 추적 · 북마크 · 그래프
        </p>
      </header>

      <div className="mb-8">
        <HealthStatus />
      </div>

      <BookmarkSection />
    </main>
  );
}
