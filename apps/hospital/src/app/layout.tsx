import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";

export const metadata: Metadata = {
  title: "EMS Copilot Korea",
  description: "응급의료서비스 지원 시스템",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* ✅ 카카오맵 SDK */}
        <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`}
          strategy="beforeInteractive"
        />
      </head>
      <body className="bg-gray-50 font-sans">
        {/* ✅ React Query Provider 적용 */}
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
