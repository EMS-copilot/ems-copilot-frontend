import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EMS Copilot Korea',
  description: '응급의료서비스 지원 시스템',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}