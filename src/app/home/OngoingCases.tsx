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
  time: string;
  location: string;
  hospital: Hospital;
}

export default function OngoingCases() {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  // 임시 데이터
  const cases: CaseItem[] = [
    {
      id: "P2024-001",
      status: "위급",
      time: "14시 32분",
      location: "강남구 테헤란로 427",
      hospital: {
        name: "중복대학교 병원",
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
    {
      id: "P2024-002",
      status: "긴급",
      time: "14시 45분",
      location: "서초구 반포대로 123",
      hospital: {
        name: "강남세브란스병원",
        type: "서울특별시",
        distance: "3.4km",
        waitTime: "8분",
        beds: "12분",
        treatments: ["PCI", "ECMO", "IABP"],
        specialties: "뇌출혈센터 운영, 신경외과 전문의 대기",
        badgeColor: "purple",
        badgeText: "보통",
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
      <section>
        <h2 className="text-[16px] font-bold text-gray-900 mb-3">
          진행중인 사건
          <span className="ml-2 text-[14px] text-gray-500">총 {cases.length}건</span>
        </h2>

        <div className="space-y-3">
          {cases.map((caseItem) => (
            <div
              key={caseItem.id}
              onClick={() => setSelectedHospital(caseItem.hospital)}
              className="bg-white rounded-2xl p-4 border border-gray-200 cursor-pointer hover:border-[#1778FF] transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`${getStatusColor(
                      caseItem.status
                    )} text-white px-3 py-1 rounded-lg text-[13px] font-semibold`}
                  >
                    {caseItem.status}
                  </span>
                  <span className="text-[16px] font-bold text-gray-900">
                    {caseItem.id}
                  </span>
                </div>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5 15L12.5 10L7.5 5"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="flex items-center gap-4 text-[13px] text-gray-500">
                <div className="flex items-center gap-1">
                  <span>🕐</span>
                  <span>시작 : {caseItem.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📍</span>
                  <span>{caseItem.location}</span>
                </div>
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