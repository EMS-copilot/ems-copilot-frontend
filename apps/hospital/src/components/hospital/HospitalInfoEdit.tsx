"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function HospitalInfoDetail() {
  const [isEditing, setIsEditing] = useState(false);

  // ✅ 원래 UI 그대로, 데이터만 반영
  const [hospitalInfo, setHospitalInfo] = useState({
    name: "경기도 의료원 이천병원 응급실",
    address: "경기도 이천시 증일로 249",
    phone: "031-630-4200",
    fax: "031-632-5456",
    surgeryRooms: "가용 1 / 6 (준비 25분)",
    emergencyBeds: "가용 3 / 24, 대기 7명",
    doctors: "내과 1, 외과 1, 신경외과 0, 심장내과 1, 마취 1, 응급의학 2 (응답예상 10분 내)",
    icuRooms: "가용 0 / 12",
    emergencyPatients: "수용 24건 / 거절 10건",
  });

  const [tempInfo, setTempInfo] = useState(hospitalInfo);

  const removeUnits = (value: string) => value.replace(/[개명\s]+$/g, "");

  const handleChange = (key: string, value: string) => {
    setTempInfo({ ...tempInfo, [key]: value });
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setHospitalInfo(tempInfo);
    } else {
      const stripped = Object.fromEntries(
        Object.entries(hospitalInfo).map(([key, value]) => [
          key,
          removeUnits(value),
        ])
      );
      setTempInfo(stripped as typeof hospitalInfo);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div
      className="
        w-full bg-white rounded-[20px] shadow-sm border border-gray-100 p-8 font-['Pretendard']
        overflow-y-auto scrollbar-hide
      "
    >
      {/* 🏥 병원 이름 및 설명 */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Image src="/medal.png" alt="병원 로고" width={46} height={56} />
          <h2 className="text-[32px] font-bold text-gray-900">
            {hospitalInfo.name}
          </h2>
        </div>

        <div className="flex items-stretch gap-3 mt-4">
          <div className="w-[5px] bg-gray-800 rounded-full" />
          <p className="text-gray-800 font-medium text-[14px] leading-relaxed">
            이천 지역의 응급의료 거점 병원으로, 중증 응급환자 대응과
            수술·중환자 치료를 담당하고 있습니다. <br />
            실시간 수용 현황을 통해 병상, 수술실, 당직 전문의 상태를 즉시
            확인할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 my-4"></div>

      {/* ✏️ 수정 버튼 */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleEditToggle}
          className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition
            ${
              isEditing
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          {isEditing ? "수정 내용 저장하기" : "수정하기"}
        </button>
      </div>

      {/* 🩺 병원 상세 정보 */}
      <div>
        <div className="flex justify-between text-[15px] leading-relaxed">
          <div
            className={`text-gray-500 ${
              isEditing ? "space-y-3.5" : "space-y-3.5"
            }`}
          >
            <p>병원 이름</p>
            <p>병원 주소</p>
            <p>병원 전화번호</p>
            <p>병원 팩스</p>
            <p>수술실 수</p>
            <p>응급실 병상 수</p>
            <p>당직 전문의</p>
            <p>중환자실 수</p>
            <p>응급환자 현황</p>
          </div>

          <div className="text-right font-medium text-gray-900 space-y-3 w-[250px]">
            {Object.entries(hospitalInfo).map(([key, value]) => (
              <div key={key}>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempInfo[key as keyof typeof tempInfo]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={removeUnits(value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-0.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                ) : (
                  <p
                    className={
                      key === "emergencyBeds" && value.includes("혼잡")
                        ? "text-[#FF4545]"
                        : ""
                    }
                  >
                    {value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
