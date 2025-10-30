"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HospitalCard() {
  const router = useRouter();

  return (
    <div className="w-[514px] h-[220px] bg-white rounded-[20px] shadow-sm p-6 border border-gray-100">
      {/* 등급 + 상태 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Image
            src="/Level1.png"
            alt="Level 1"
            width={32}
            height={32}
            className="object-contain"
          />
          <h2 className="font-['Pretendard'] font-semibold text-xl text-[#2563EB]">
            A등급
          </h2>
        </div>
        <div className="flex items-center justify-center w-16 h-9 rounded-[40px] bg-[#E3F6EA]">
          <span className="font-['Pretendard'] font-semibold text-[18px] text-[#27A959]">
            여유
          </span>
        </div>
      </div>

      {/* 병원명 + 구분선 + 버튼 */}
      <div>
        <h3 className="font-['Pretendard'] font-bold text-2xl text-[#111827] leading-tight">
          충북대학교병원 응급의료센터
        </h3>

        <div
          className="border-t border-gray-300 w-[466px] my-4"
          style={{ borderWidth: "1px" }}
        ></div>

        <div className="flex items-center gap-2">
          {/* 회원 정보 버튼 */}
          <button
            className="w-[229px] h-11 flex items-center justify-center rounded-[40px] border border-gray-300 px-6 bg-white hover:bg-gray-50 transition-colors"
            onClick={() => router.push("/hospital/info")}
          >
            <span className="font-['Pretendard'] text-[#111827]">회원 정보</span>
          </button>

          {/* 병원 정보 수정 버튼 */}
          <button
            className="w-[229px] h-11 flex items-center justify-center rounded-[40px] border border-gray-300 px-6 bg-white hover:bg-gray-50 transition-colors"
            onClick={() => router.push("/hospital/edit")}
          >
            <span className="font-['Pretendard'] text-[#111827]">
              병원 정보 수정
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
