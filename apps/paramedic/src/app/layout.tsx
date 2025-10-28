import "../styles/globals.css";
import QueryProvider from "@/providers/query-provider";

export const metadata = {
  title: "응급대원 앱",
  description: "Emergency Worker Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-[#F7F7F7] flex justify-center overflow-x-hidden">
        <div
          className="
            relative
            w-full max-w-[393px]
            min-h-[100dvh]
            bg-[#F7F7F7]
            overflow-y-auto
          "
        >
          <QueryProvider>{children}</QueryProvider>
        </div>
      </body>
    </html>
  );
}
