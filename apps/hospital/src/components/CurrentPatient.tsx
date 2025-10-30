"use client";

import Image from "next/image";

export default function CurrentPatient() {
  const patients = [
    {
      id: "P2024-001",
      gender: "남성",
      risk: "고위험",
      emergency: "응급",
      condition: "위급",
      symptoms: ["외상", "출혈", "화상"],
      vitals: [
        { label: "SBP", value: "121mmHg" },
        { label: "DBP", value: "81mmHg" },
        { label: "HR", value: "76bpm" },
        { label: "RR", value: "17min" },
        { label: "SpO₂", value: "94%" },
        { label: "Temp", value: "36.4°C" },
      ],
    },
    {
      id: "P2024-002",
      gender: "남성",
      risk: "고위험",
      emergency: "응급",
      condition: "위급",
      symptoms: ["두통", "구토", "호흡곤란"],
      vitals: [
        { label: "SBP", value: "118mmHg" },
        { label: "DBP", value: "79mmHg" },
        { label: "HR", value: "84bpm" },
        { label: "RR", value: "19min" },
        { label: "SpO₂", value: "95%" },
        { label: "Temp", value: "36.7°C" },
      ],
    },
  ];

  return (
    <div className="w-full h-[240px] bg-[#262626] rounded-[20px] p-6 shadow-sm font-['Pretendard'] text-white flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Image
            src="/Waiting-white.png"
            alt="현재 이송 중인 환자 세부사항"
            width={20}
            height={20}
          />
          <h2 className="text-lg font-semibold text-white">
            현재 이송 중인 환자 세부사항
          </h2>
        </div>
        <span className="text-[#A3A3A3] text-[12px] leading-[16px] font-normal">
          총 {patients.length}건
        </span>
      </div>

      {/* 카드 리스트 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-3 pr-1 scrollbar-none">
        {patients.map((p, index) => (
          <div
            key={index}
            className="w-full h-[124px] bg-[#2F2F2F] border border-[#404040] rounded-[16px] p-5 flex items-center justify-between"
          >
            {/* 왼쪽 */}
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-1">
                <span className="bg-[#FB4D40] text-[#FEE4E2] font-semibold text-[14px] rounded-full px-3 py-1">
                  {p.risk}
                </span>
                <span className="bg-[#FEE4E2] text-[#FB4D40] font-semibold text-[14px] rounded-full px-3 py-1">
                  {p.emergency}
                </span>
              </div>

              <p className="text-[24px] font-semibold flex items-baseline text-white">
                {p.id}
                <span className="font-light text-[12px] text-[#FFFFFF33] mx-2">|</span>
                <span className="text-[14px]">{p.gender}</span>
              </p>
            </div>

            {/* 오른쪽 */}
            <div className="flex items-center gap-4">
              {/* 환자 중증도 */}
              <div className="flex flex-col items-start">
                <p className="text-[#A3A3A3] text-[12px] mb-1">환자 중증도</p>
                <div className="bg-[#404040] rounded-2xl px-5 py-4">
                  <span className="bg-[#FDEAEA] text-[#D0312D] text-[14px] font-medium px-3 py-1 rounded-full">
                    {p.condition}
                  </span>
                </div>
              </div>

              {/* 주요 증상 */}
              <div className="flex flex-col items-start">
                <p className="text-[#A3A3A3] text-[12px] mb-1">주요 증상</p>
                <div className="bg-[#404040] rounded-2xl px-5 py-4 flex gap-1.5">
                  {p.symptoms.map((sym, idx) => (
                    <span
                      key={idx}
                      className="bg-[#E6EEFF] text-[#2D63EA] text-[14px] font-medium px-3 py-1 rounded-full"
                    >
                      {sym}
                    </span>
                  ))}
                </div>
              </div>

              {/* 활력징후 */}
              <div className="flex flex-col items-start">
                <p className="text-[#A3A3A3] text-[12px] mb-1">초기 활력징후</p>
                <div className="bg-[#404040] rounded-2xl px-5 py-[11px] flex items-center gap-6">
                  {p.vitals.map((v, idx) => (
                    <div key={idx} className="flex flex-col items-center relative">
                      <p className="text-[12px] text-[#A3A3A3]">{v.label}</p>
                      <p className="text-[14px] font-medium text-white">{v.value}</p>
                      {idx < p.vitals.length - 1 && (
                        <div className="absolute right-[-12px] top-0 bottom-0 w-[1px] bg-[#4A4A4A]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
