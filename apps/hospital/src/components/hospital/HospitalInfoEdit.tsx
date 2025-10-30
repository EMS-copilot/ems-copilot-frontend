"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function HospitalInfoDetail() {
  // 병원 정보 상태
  const [hospitalInfo, setHospitalInfo] = useState({
    name: "충북대학교병원",
    address: "청주시 서원구 흥덕로 123",
    phone: "010-1234-5678",
    fax: "010-1234-5678",
    surgeryRooms: "42개",
    emergencyBeds: "241개",
    doctors: "123명",
    icuRooms: "123123개",
    emergencyPatients: "12명",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempInfo, setTempInfo] = useState(hospitalInfo);

  const removeUnits = (value: string) => value.replace(/[개명\s]+$/g, "");

  const handleChange = (key: string, value: string) => {
    setTempInfo({ ...tempInfo, [key]: value });
  };

  const handleEditToggle = () => {
    if (isEditing) {
      const updated = {
        ...tempInfo,
        surgeryRooms: tempInfo.surgeryRooms + "개",
        emergencyBeds: tempInfo.emergencyBeds + "개",
        doctors: tempInfo.doctors + "명",
        icuRooms: tempInfo.icuRooms + "개",
        emergencyPatients: tempInfo.emergencyPatients + "명",
      };
      setHospitalInfo(updated);
      setTempInfo(updated);
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
        overflow-y-auto scrollbar-hide  /* ✅ 스크롤 가능하되 스크롤바 숨김 */
      "
    >
      {/* 병원 이름 및 설명 */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Image src="/medal.png" alt="병원 로고" width={46} height={56} />
          <h2 className="text-[32px] font-bold text-gray-900">
            충북대학교병원 응급의료센터
          </h2>
        </div>

        <div className="flex items-stretch gap-3 mt-4">
          <div className="w-[5px] bg-gray-800 rounded-full" />
          <p className="text-gray-800 font-medium text-[14px] leading-relaxed">
            충북 유일의 상급종합병원인 충북대학교병원을 찾아주신 모든 분들을 진심으로 환영합니다. <br />
            우리 충북대학교병원은 지난 33여 년 동안 지역사회의 건강을 책임지며 충북 지역 공공의료의 한 축을
            견인해 온 권역응급의료기관입니다. <br />
            특히, 충북 도민의 건강을 위협하는 중증질환 치료에 있어 최고의 전문성을 갖춘
            상급종합병원으로서의 역할을 수행하고 있습니다.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 my-4"></div>

      {/* 병원 상세 정보 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-semibold text-gray-900">
            병원 상세 정보
          </h3>

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

        <div className="flex justify-between text-[15px] leading-relaxed">
          <div
            className={`text-gray-500 ${
              isEditing ? "space-y-3.5" : "space-y-3"
            }`}
          >
            <p>병원 이름</p>
            <p>병원 주소</p>
            <p>병원 전화번호</p>
            <p>병원 팩스</p>
            <p>수술실 수</p>
            <p>응급실 병상 수</p>
            <p>당직 전문의 수</p>
            <p>중환자실 수</p>
            <p>응급환자 수</p>
          </div>

          <div className="text-right font-medium text-gray-900 space-y-3 w-[250px]">
            {Object.entries(hospitalInfo).map(([key, value]) => (
              <div key={key}>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempInfo[key as keyof typeof tempInfo]}
                    onChange={(e) =>
                      handleChange(key, e.target.value)
                    }
                    placeholder={removeUnits(value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-0.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                ) : (
                  <p>{value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
