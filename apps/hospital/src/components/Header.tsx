import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // ✅ 추가

export default function Header() {
  return (
    <header className="flex items-center justify-between h-[100px]">
      {/* ✅ 로고 + 텍스트 전체를 클릭 영역으로 감싸기 */}
      <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition">
        <div className="w-14 h-14 flex items-center justify-center">
          <Image 
            src="/Logo.png" 
            alt="EMS Copilot Korea Logo" 
            width={56} 
            height={56}
            priority
          />
        </div>
        <div>
          <h1 className="font-['Pretendard'] font-bold text-[20px] leading-tight text-gray-900 mb-1">
            EMS Copilot Korea
          </h1>
          <p className="font-['Pretendard'] font-medium text-xs text-gray-600">
            응급의료서비스 지원 시스템
          </p>
        </div>
      </Link>

      {/* 프로필 영역 */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-400">
          <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500"></div>
        </div>
      </div>
    </header>
  );
}