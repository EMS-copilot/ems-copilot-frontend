import Image from "next/image";

export default function RealtimeStats() {
  return (
    <div className="w-[514px] h-[168px] bg-white rounded-[20px] p-6 font-['Pretendard']">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-6">
        <Image src="/Waiting.png" alt="실시간 현황" width={20} height={20} />
        <h2 className="text-lg font-semibold text-gray-900">실시간 현황</h2>
      </div>

      {/* 통계 구역 */}
      <div className="flex items-center justify-between">
        {/* 수용 건 수 */}
        <div className="w-[217px] h-[76px] flex flex-col items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mt-1">수용 건 수</p>
          <p className="text-[28px] font-semibold text-[#1778FF]">24건</p>
        </div>

        {/* 구분선 */}
        <div className="h-[76px] w-[1px] bg-gray-200"></div>

        {/* 거절 건 수 */}
        <div className="w-[217px] h-[76px] flex flex-col items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mt-1">거절 건 수</p>
          <p className="text-[28px] font-semibold text-[#FF4545]">8건</p>
        </div>
      </div>
    </div>
  );
}

