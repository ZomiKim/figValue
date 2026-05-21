import { BookmarkSection } from "@/components/BookmarkSection";
import { HealthStatus } from "@/components/HealthStatus";
import { HomeNoticeModal } from "@/components/HomeNoticeModal";

export default function Home() {
  return (
    <>
      <HomeNoticeModal />
      <main className="mx-auto max-w-2xl py-10">
        <header className="mb-8 space-y-2">
          <h1 className="flex justify-center">
            <img
              src="/logo.png"
              alt="figValue"
              className="h-50 w-auto object-contain"
            />
          </h1>
          <p className="text-sm text-gray-500 text-center px-4">
            번개장터 · 중고나라 · 당근마켓
            <br className="md:hidden" />
            피규어 시세를 한번에 조회
          </p>
        </header>

        <div className="mb-8 px-4">
          <HealthStatus />
        </div>

        <BookmarkSection />
      </main>
    </>
  );
}
