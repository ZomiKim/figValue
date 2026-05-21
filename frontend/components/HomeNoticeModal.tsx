"use client";

import { useEffect, useState } from "react";

const MESSAGE =
  "개인의 포트폴리오입니다. 파이어베이스 용량이 부족하니 너무 많은 검색을 자제해주시면 감사하겠습니다ㅠㅠ";

export function HomeNoticeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
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
        <p className="text-center text-sm leading-relaxed text-gray-600">
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
