"use client";

import Image from "next/image";

export default function HomeStats() {
  return (
    <section className="w-full flex justify-between gap-3">
      {/* 출동건수 */}
      <div className="w-[134.5px] h-[72px] flex items-center bg-white rounded-2xl border border-gray-200 px-3">
        {/* 왼쪽 아이콘 */}
        <div className="w-[40px] h-[40px] relative flex-shrink-0">
          <Image
            src="/lotties/graph-awOHbcRwDL.png"
            alt="출동건수 그래프"
            fill
            className="object-contain"
          />
        </div>

        {/* 오른쪽 텍스트 */}
        <div className="flex flex-col items-start justify-center ml-3">
          <div className="text-[18px] font-semibold text-gray-900 leading-none">11</div>
          <div className="text-[12px] font-regular text-[#A3A3A3] mt-[4px] leading-none">출동건 수</div>
        </div>
      </div>

      {/* 평균 ETA */}
      <div className="w-[134.5px] h-[72px] flex items-center bg-white rounded-2xl border border-gray-200 px-3">
        {/* 왼쪽 아이콘 */}
        <div className="w-[40px] h-[40px] relative flex-shrink-0">
          <Image
            src="/lotties/radar-searsh-9O0wx6hPMY.png"
            alt="평균 ETA"
            fill
            className="object-contain"
          />
        </div>

        {/* 오른쪽 텍스트 */}
        <div className="flex flex-col items-start justify-center ml-3">
          <div className="text-[18px] font-semibold text-gray-900 leading-none">9.5분</div>
          <div className="text-[12px] font-regular text-[#A3A3A3] mt-[4px] leading-none">평균 ETA</div>
        </div>
      </div>

      {/* 거부 건수 */}
      <div className="w-[72px] h-[72px] flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-200 ">
        <div className="text-[18px] font-semibold text-[#FF4545] leading-[18px]">2</div>
        <div className="text-[12px] font-regular text-[#A3A3A3] mt-[4px] leading-[13px]">거부</div>
      </div>
    </section>
  );
}
