"use client";

import { useEffect, useState } from "react";

const MESSAGE = `
개인의 포트폴리오입니다.
파이어베이스 용량이 부족하니 너무 많은 검색을 자제해주시면 감사하겠습니다ㅠㅠ


🛠️  아직 공사중입니다  🛠️
`;

/** 새로고침 시 모듈이 다시 로드되어 초기화됨. 클라이언트 라우팅으로 홈 복귀 시에는 유지됨. */
let homeNoticeShownThisPageLoad = false;

export function HomeNoticeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (homeNoticeShownThisPageLoad) return;
    homeNoticeShownThisPageLoad = true;
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-pink-200/70 p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="home-notice-title"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-sm rounded-[20px] border-2 border-dashed border-pink-300 bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="home-notice-title"
          className="mb-3 text-center text-lg font-semibold text-pink-400"
        >
          안내
        </h2>
        <p className="whitespace-pre-line text-center text-sm leading-relaxed text-gray-600">
          {MESSAGE}
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-6 w-full rounded-[12px] border-2 border-dashed border-pink-300 bg-pink-50 px-4 py-2.5 text-sm font-medium text-pink-500 transition-colors hover:bg-pink-100"
        >
          확인
        </button>
      </div>
    </div>
  );
}
