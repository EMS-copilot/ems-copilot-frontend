"use client";

import { useState } from "react";
import HospitalConfirmModal from "@/components/common/HospitalConfirmModal";

interface Hospital {
  name: string;
  type: string;
  distance: string;
  waitTime: string;
  beds: string;
  treatments: string[];
  specialties: string;
  badgeColor: "green" | "purple";
  badgeText: string;
}

interface CaseItem {
  id: string;
  status: string;
  symptom: string;
  time: string;
  location: string;
  hospital: Hospital;
  hospitalStatus?: string;
}

export default function OngoingCases() {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  // 임시 데이터
  const cases: CaseItem[] = [
    {
      id: "P2025-12345",
      status: "위급",
      symptom: "흉통",
      time: "14시 32분",
      location: "경기도 이천시 경충대로 2742",
      hospitalStatus: "이송 중",
      hospital: {
        name: "경기도의료원이천병원",
        type: "서울특별시",
        distance: "3.4km",
        waitTime: "8분",
        beds: "12분",
        treatments: ["PCI", "ECMO", "IABP"],
        specialties: "심혈관센터, 응급실",
        badgeColor: "green",
        badgeText: "여유",
      },
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "위급":
        return "bg-[#FF4545]";
      case "긴급":
        return "bg-[#FFB020]";
      default:
        return "bg-[#27A959]";
    }
  };

  return (
    <>
      <section className="px-2">
        {/* 섹션 제목 */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-medium text-gray-900">진행중인 사건</h2>
          <span className="text-gray-400 font-light text-[12px]">총 {cases.length}건</span>
        </div>

        <div className="flex flex-col gap-3">
          {cases.map((caseItem) => (
            <div
              key={caseItem.id}
              onClick={() => setSelectedHospital(caseItem.hospital)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span
                    className={`${getStatusColor(
                      caseItem.status
                    )} text-white text-[12px] px-2 py-0.5 rounded-md font-medium w-fit`}
                  >
                    {caseItem.status}
                  </span>
                  <span className="text-[15px] font-semibold text-gray-900">
                    {caseItem.id} | {caseItem.symptom}
                  </span>
                </div>
                <button className="text-gray-400 text-[18px]">›</button>
              </div>

              <div className="flex items-center gap-1 text-[13px] text-gray-400">
                <span>시작 : {caseItem.time}</span>
                <span>📍 {caseItem.location}</span>
              </div>

              {/* 병원명 + 상태 */}
              <div className="flex justify-between items-center rounded-xl px-4 py-1.5 text-white bg-linear-to-r from-[#0193FF] to-[#000EE0]">
                <span className="text-[13px] font-semibold">{caseItem.hospital.name}</span>
                <span className="bg-[#1778FF] text-white text-[12px] px-3 py-0.5 rounded-full font-regular">
                  {caseItem.hospitalStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 병원 확정 모달 */}
      {selectedHospital && (
        <HospitalConfirmModal
          isOpen={!!selectedHospital}
          onClose={() => setSelectedHospital(null)}
          hospital={selectedHospital}
        />
      )}
    </>
  );
}
