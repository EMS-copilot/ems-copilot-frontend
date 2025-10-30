"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function PatientCardDetail() {
  const router = useRouter();

  return (
    <div className="w-full bg-white rounded-[20px] p-8 border border-gray-200 shadow-sm font-['Pretendard']">
      {/* 1️⃣ 상단 헤더 */}
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Image
            src="/back-arrow.png"
            alt="뒤로가기"
            width={20}
            height={20}
          />
        </button>
        <h1 className="text-[20px] font-semibold text-gray-900 leading-[28px] tracking-[-0.02em]">
          환자 세부사항
        </h1>
      </div>

      {/* 2️⃣ 고위험 · 응급 뱃지 */}
      <div className="flex gap-2 mb-6">
        <span className="px-5 py-2 text-[15px] font-semibold rounded-full bg-[#FB4D40] text-[#FEE4E2]">
          고위험
        </span>
        <span className="px-5 py-2 text-[15px] font-semibold rounded-full bg-[#FEE4E2] text-[#FB4D40]">
          응급
        </span>
      </div>

      {/* 3️⃣ 환자 ID */}
      <h2 className="text-[36px] font-bold text-gray-900 mb-10 leading-tight">
        P2024-001
      </h2>

      {/* 4️⃣ 환자 중증도 / 주요 증상 / 초기 활력징후 */}
      <div className="flex items-start justify-between gap-6 mb-10">
        {/* 환자 중증도 */}
        <div className="flex flex-col items-start w-[180px]">
          <p className="text-[#A3A3A3] text-[13px] mb-2">환자 중증도</p>
          <div className="bg-[#F9FAFB] rounded-[12px] px-5 py-4">
            <span className="bg-[#FDEAEA] text-[#D0312D] text-[15px] font-medium px-4 py-1.5 rounded-full">
              위급
            </span>
          </div>
        </div>

        {/* 주요 증상 */}
        <div className="flex flex-col items-start flex-1">
          <p className="text-[#A3A3A3] text-[13px] mb-2">주요 증상</p>
          <div className="bg-[#F9FAFB] rounded-[12px] px-6 py-4 flex gap-2 flex-wrap">
            {["외상", "출혈", "화상"].map((sym, idx) => (
              <span
                key={idx}
                className="bg-[#EEF5FF] text-[#1778FF] text-[15px] font-medium px-4 py-1.5 rounded-full"
              >
                {sym}
              </span>
            ))}
          </div>
        </div>

        {/* 초기 활력징후 */}
        <div className="flex flex-col items-start flex-[1.2]">
          <p className="text-[#A3A3A3] text-[13px] mb-2">초기 활력징후</p>
          <div className="bg-[#F9FAFB] rounded-[12px] px-6 py-4 flex gap-6">
            {[
              { label: "SBP", value: "121mmHg" },
              { label: "DBP", value: "81mmHg" },
              { label: "HR", value: "76bpm" },
              { label: "RR", value: "17min" },
              { label: "SpO₂", value: "94%" },
              { label: "Temp", value: "36.4°C" },
            ].map((v, idx) => (
              <div key={idx} className="flex flex-col items-center relative">
                <p className="text-[12px] text-[#A3A3A3] mb-1">{v.label}</p>
                <p className="text-[15px] font-semibold text-gray-900">
                  {v.value}
                </p>
                {idx < 5 && (
                  <div className="absolute right-[-12px] top-0 bottom-0 w-[1px] bg-[#E5E5E5]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5️⃣ 메모 */}
      <div className="mt-8">
        <p className="text-[#A3A3A3] text-[13px] mb-3">메모</p>
        <div className="bg-white border border-gray-200 rounded-[12px] p-5 min-h-[100px] text-[15px] leading-relaxed text-gray-800">
          환자 상태 업데이트. 환자 상태 업데이트. 환자 상태 업데이트. 환자 상태
          업데이트. 환자 상태 업데이트. 환자 상태 업데이트.
        </div>
      </div>
    </div>
  );
}
