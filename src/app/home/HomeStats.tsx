"use client";

import Image from "next/image";

export default function HomeStats() {
  return (
    <section className="w-full flex justify-between gap-3">
      {/* 출동건수 */}
      <div className="w-[134.5px] h-[72px] flex items-center bg-white rounded-2xl border border-gray-100 shadow-sm px-3">
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
          <div className="text-[17px] font-semibold text-gray-900 leading-none">11</div>
          <div className="text-[13px] text-gray-500 mt-[4px] leading-none">출동건 수</div>
        </div>
      </div>

      {/* 평균 ETA */}
      <div className="w-[134.5px] h-[72px] flex items-center bg-white rounded-2xl border border-gray-100 shadow-sm px-3">
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
          <div className="text-[17px] font-semibold text-gray-900 leading-none">
            9.5<span className="text-[14px] ml-[1px] text-gray-900">분</span>
          </div>
          <div className="text-[13px] text-gray-500 mt-[4px] leading-none">평균 ETA</div>
        </div>
      </div>

      {/* 거부 건수 */}
      <div className="w-[72px] h-[72px] flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="text-[17px] font-semibold text-[#FF4545] mt-1 leading-none">2</div>
        <div className="text-[13px] text-gray-500 mt-[3px] leading-none">거부</div>
      </div>
    </section>
  );
}
