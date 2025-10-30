"use client";

import React from "react";
import Image from "next/image";
import PatientCard from "./patient/PatientCard";

export default function PatientList() {
  const patients = [
    {
      id: "P2025-12345",
      status: "emergency" as const,
      tags: ["위급", "외상", "출혈", "화상"],
      vitals: {
        sbp: "120mmHg",
        dbp: "78mmHg",
        hr: "90bpm",
        rr: "20/min",
        spo2: "96%",
        temp: "36.8°C",
      },
    },
    {
      id: "P2024-002",
      status: "emergency" as const,
      tags: ["안정", "통증", "골절"],
      vitals: {
        sbp: "130mmHg",
        dbp: "85mmHg",
        hr: "80bpm",
        rr: "18/min",
        spo2: "96%",
        temp: "36.8°C",
      },
    },
    {
      id: "P2024-003",
      status: "urgent" as const,
      tags: ["저혈압", "두통"],
      vitals: {
        sbp: "98mmHg",
        dbp: "60mmHg",
        hr: "88bpm",
        rr: "20/min",
        spo2: "95%",
        temp: "36.2°C",
      },
    },
    {
      id: "P2024-004",
      status: "urgent" as const,
      tags: ["발열", "피로감", "기침"],
      vitals: {
        sbp: "110mmHg",
        dbp: "70mmHg",
        hr: "85bpm",
        rr: "19/min",
        spo2: "97%",
        temp: "37.1°C",
      },
    },
  ];

  return (
    <div className="w-full h-full min-h-0 bg-white rounded-[20px] shadow-sm border border-gray-100 p-6 font-['Pretendard'] flex flex-col">
      {/* 헤더 (고정 영역) */}
      <div className="flex items-center gap-2 mb-6 flex-shrink-0">
        <Image
          src="/Waiting.png"
          alt="요청받은 환자 목록"
          width={20}
          height={20}
        />
        <h2 className="text-lg font-semibold text-gray-900">
          요청받은 환자 목록
        </h2>
      </div>

      {/* 카드 리스트 (스크롤 영역) */}
      <div
        className="grid grid-cols-2 gap-6 flex-1 min-h-0 h-full overflow-y-auto pr-1
                    scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {patients.map((patient, index) => (
          <PatientCard key={index} patient={patient} />
        ))}
      </div>
    </div>
  );
}
