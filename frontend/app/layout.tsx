import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "figvalue",
  description: "중고 플랫폼 피규어 시세 조회",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex justify-center items-center bg-pink-50">
        <div className="flex flex-col w-[90%] lg:w-[50%] min-h-[90vh] rounded-[20px] border-2 border-pink-300 bg-white overflow-hidden border-dashed">
          {children}
        </div>
      </body>
    </html>
  );
}
