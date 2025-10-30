"use client";

import React from "react";
import Image from "next/image";

export default function HospitalInfo() {
  return (
    <div className="w-full bg-white rounded-[20px] shadow-sm border border-gray-100 p-8 font-['Pretendard'] overflow-y-auto scrollbar-hide">
      {/* 병원 이름 */}
      <div className="flex items-center gap-3 mb-8">
        <Image src="/medal.png" alt="병원 로고" width={46} height={56} />
        <h2 className="text-[32px] font-bold text-gray-900">
          충북대학교병원 응급의료센터
        </h2>
      </div>

      {/* ✅ 하나의 세로선으로 랭킹 안내 + FAQ 묶기 */}
      <div className="flex items-stretch gap-4 mb-10">
        {/* 세로선 하나 */}
        <div className="w-[5px] bg-gray-800 rounded-full" />

        {/* 오른쪽 텍스트 묶음 */}
        <div className="flex flex-col gap-5">
          {/* 랭킹 안내 */}
          <div>
            <h3 className="text-[16px] font-semibold text-gray-900 mb-3">
              랭킹 산정 안내
            </h3>
            <p className="text-gray-500 text-[13px] leading-relaxed">
              이번 주 실제 수용 환자 수를 기준으로 합니다. <br />
              거부 50건마다 -10점이 감점되며, 최종 수치는 최저 0으로 보충됩니다. <br />
              등급 기준: A(≥500) / B(400~499) / C(300~399) / D(200~299) / E(100~199) / F(0)
            </p>
          </div>

          {/* FAQ */}
          <div>
            <h3 className="text-[16px] font-semibold text-gray-900 mb-3">
              자주 묻는 질문 (FAQ)
            </h3>
            <p className="text-gray-500 text-[13px] leading-relaxed">
              이번 주 실제 수용 환자 수를 기준으로 합니다. <br />
              거부 50건마다 -10점이 감점되며, 최종 수치는 최저 0으로 보충됩니다. <br />
              등급 기준: A(≥500) / B(400~499) / C(300~399) / D(200~299) / E(100~199) / F(0)
            </p>
          </div>
        </div>
      </div>

      {/* ✅ 통일된 통계 카드 영역 */}
      <div className="grid grid-cols-4 gap-5">
        {/* 카드 1 */}
        <div className="bg-gray-50 rounded-[16px] p-6 flex flex-col justify-start text-left shadow-sm">
          <div className="text-xs font-semibold text-white bg-black px-3 py-1.5 rounded-full w-fit mb-2">
            2025.10
          </div>
          <p className="text-[18px] font-semibold text-black mb-2 leading-relaxed">
            환자 수용 수 <br />(월간)
          </p>
          <p className="text-right text-[36px] font-semibold text-[#2563EB]">
            <span className="text-bold text-[24px]">총 </span>620건
          </p>
        </div>

        {/* 카드 2 */}
        <div className="bg-gray-50 rounded-[16px] p-6 flex flex-col justify-start text-left shadow-sm">
          <div className="text-xs font-semibold text-white bg-black px-3 py-1.5 rounded-full w-fit mb-2">
            2025.10 2주차
          </div>
          <p className="text-[18px] font-semibold text-black mb-2 leading-relaxed">
            환자 수용 수 <br />(주간)
          </p>
          <p className="text-right text-[36px] font-semibold text-[#2563EB]">
            <span className="text-bold text-[24px]">총 </span>420건
          </p>
        </div>

        {/* 카드 3 */}
        <div className="bg-gray-50 rounded-[16px] p-6 flex flex-col justify-start text-left shadow-sm">
          <div className="text-xs font-semibold text-white bg-black px-3 py-1.5 rounded-full w-fit mb-2">
            2025.10
          </div>
          <p className="text-[18px] font-semibold text-black mb-2 leading-relaxed">
            환자 거부 수 <br />(월간)
          </p>
          <p className="text-right text-[36px] font-semibold text-[#EF4444]">
            <span className="text-bold text-[24px]">총 </span>32건
          </p>
        </div>

        {/* 카드 4 */}
        <div className="bg-gray-50 rounded-[16px] p-6 flex flex-col justify-start text-left shadow-sm">
          <div className="text-xs font-semibold text-white bg-black px-3 py-1.5 rounded-full w-fit mb-2">
            2025.10 2주차
          </div>
          <p className="text-[18px] font-semibold text-black mb-2 leading-relaxed">
            환자 거부 수 <br />(주간)
          </p>
          <p className="text-right text-[36px] font-semibold text-[#EF4444]">
            <span className="text-bold text-[24px]">총 </span>32건
          </p>
        </div>
      </div>
    </div>
  );
}
