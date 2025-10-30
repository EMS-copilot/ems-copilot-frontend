"use client";

export default function HospitalCardDashboard() {
  return (
    <div className="w-[514px] h-[220px] bg-white rounded-[20px] shadow-sm p-6 border border-gray-100">
      {/* 상단 제목 */}
      <p className="text-gray-400 text-[16px] font-medium mb-1 font-['Pretendard']">
        Dashboard
      </p>

      {/* 병원명 */}
      <h2 className="font-['Pretendard'] font-bold text-[32px] text-[#111827] leading-tight mb-4">
        충북대학교병원 응급의료센터
      </h2>

      {/* 구분선 */}
      <div className="border-t border-dashed border-gray-300 mb-4"></div>

      {/* 병원 상태/도착 예정/현재 시간/병원 등급 */}
      <div className="grid grid-cols-4 text-center">
        {/* 병원 상태 */}
        <div className="flex flex-col items-center">
          <p className="text-gray-500 text-[14px] font-medium mb-2">병원 상태</p>
          <div className="flex items-center justify-center w-[60px] h-[32px] rounded-full bg-[#E3F6EA]">
            <span className="text-[#27A959] text-[18px] font-semibold font-['Pretendard']">
              여유
            </span>
          </div>
        </div>

        {/* 도착 예정 */}
        <div className="flex flex-col items-center">
          <p className="text-gray-500 text-[14px] font-medium mb-2">도착 예정</p>
          <p className="text-[24px] font-semibold text-[#111827] font-['Pretendard']">
            3
          </p>
        </div>

        {/* 현재 시간 */}
        <div className="flex flex-col items-center">
          <p className="text-gray-500 text-[14px] font-medium mb-2">현재 시간</p>
          <p className="text-[24px] font-semibold text-[#111827] font-['Pretendard']">
            14:32
          </p>
        </div>

        {/* 병원 등급 */}
        <div className="flex flex-col items-center">
          <p className="text-gray-500 text-[14px] font-medium mb-2">병원 등급</p>
          <p className="text-[24px] font-semibold text-[#2563EB] font-['Pretendard']">
            A등급
          </p>
        </div>
      </div>
    </div>
  );
}
