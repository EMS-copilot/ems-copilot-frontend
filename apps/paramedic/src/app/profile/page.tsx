"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/common/Header";
import { Edit3, Save } from "lucide-react";

/* -----------------------------
 * 진행중인 사건 타입 & 데이터
 * ---------------------------- */
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

/* -----------------------------
 * Profile Page
 * ---------------------------- */
export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  // 프로필 데이터
  const [profile, setProfile] = useState({
    name: "구급대원 A",
    position: "구급대원 (Paramedic)",
    employeeId: "EMT-2407",
    department: "서울소방재난본부 강남119구조대",
    mobile: "010-2345-7890",
    phone: "02-1234-1190",
    email: "medicA@seoul119.go.kr",
  });
  const [editData, setEditData] = useState(profile);

  const handleChange = (key: keyof typeof profile, value: string) => {
    setEditData((prev) => ({ ...prev, [key]: value }));
  };
  const handleSave = () => {
    setProfile(editData);
    setIsEditing(false);
  };

  // 진행중인 사건 데이터
  const cases: CaseItem[] = [
    {
      id: "P2024-001",
      status: "위급",
      symptom: "흉통",
      time: "14시 32분",
      location: "강남구 테헤란로 427",
      hospitalStatus: "이송 중",
      hospital: {
        name: "충북대학교병원",
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
      symptom: "의식저하",
      time: "15시 10분",
      location: "서초구 반포대로 123",
      hospitalStatus: "이송 중",
      hospital: {
        name: "강남세브란스병원",
        type: "서울특별시",
        distance: "5.1km",
        waitTime: "12분",
        beds: "20분",
        treatments: ["CT", "MRI"],
        specialties: "신경외과, 중환자실",
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
    <main className="w-full max-w-[393px] mx-auto min-h-dvh bg-[#F7F7F7] flex flex-col">
      <Header variant="sub" title="내 프로필 정보" />

      {/* 🔹 진행중인 사건 섹션 */}
      <section className="mt-4 px-4">

        <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar">
          {cases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="shrink-0 w-[351px] bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2"
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
              </div>

              <div className="flex items-center gap-1 text-[13px] text-gray-400">
                <span>시작 : {caseItem.time}</span>
                <span>📍 {caseItem.location}</span>
              </div>

              <div className="flex justify-between items-center rounded-xl px-4 py-1.5 text-white bg-linear-to-r from-[#0193FF] to-[#000EE0]">
                <span className="text-[13px] font-semibold">
                  {caseItem.hospital.name}
                </span>
                <span className="bg-[#1778FF] text-white text-[12px] px-3 py-0.5 rounded-full font-regular">
                  {caseItem.hospitalStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🔹 프로필 본문 */}
      <section className="flex flex-col items-center mt-8 px-5">
        {/* 상단 로고 */}
        <Image
          src="/Logo.png"
          alt="EMS Copilot Korea"
          width={90}
          height={90}
          className="mb-4"
        />
        <p className="text-base font-semibold text-gray-900 mb-6">
          EMS Copilot Korea
        </p>

        {/* 프로필 헤더 */}
        <div className="flex items-center justify-between w-full max-w-[360px] mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-300" /> {/* 빈 동그라미 */}
            <span className="text-[15px] font-semibold text-gray-800">
              {profile.name}
            </span>
          </div>

          {isEditing ? (
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 bg-gray-900 text-white text-[13px] font-medium px-3.5 py-1.5 rounded-xl hover:bg-gray-800 transition"
            >
              <Save size={14} />
              수정 내용 저장하기
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 text-gray-400 bg-gray-100 text-[13px] font-medium px-3 py-1.5 rounded-xl hover:bg-gray-200 transition"
            >
              수정하기
              <Edit3 size={13} />
            </button>
          )}
        </div>

        {/* 프로필 정보 카드 */}
        <div className="w-full max-w-[360px] bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          {isEditing ? (
            <div className="flex flex-col gap-4">
              {[
                ["position", "직책"],
                ["employeeId", "사번"],
                ["department", "소속"],
                ["mobile", "연락처"],
                ["phone", "전화"],
                ["email", "이메일"],
              ].map(([key, label]) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-[13px] text-gray-600">{label}</label>
                  <input
                    type="text"
                    value={editData[key as keyof typeof profile] || ""}
                    onChange={(e) =>
                      handleChange(key as keyof typeof profile, e.target.value)
                    }
                    className="w-full h-7 px-3 rounded-lg border border-gray-300 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#1778FF]"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2 text-[12px] text-gray-800">
              <div className="flex justify-between">
                <span className="text-gray-500 w-16">직책</span>
                <span>{profile.position}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 w-16">사번</span>
                <span>{profile.employeeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 w-16">소속</span>
                <span>{profile.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 w-16">연락처</span>
                <span>{profile.mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 w-16">전화</span>
                <span>{profile.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 w-16">이메일</span>
                <span className="break-all">{profile.email}</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
