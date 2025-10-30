"use client";

import { useState, MouseEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PatientAcceptModal from "./PatientAcceptModal";

interface PatientCardProps {
  patient: {
    id: string;
    status: "emergency" | "urgent";
    tags: string[];
    vitals: {
      sbp: string;
      dbp: string;
      hr: string;
      rr: string;
      spo2: string;
      temp: string;
    };
  };
}

export default function PatientCard({ patient }: PatientCardProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCallAmbulance = (e: MouseEvent) => {
    e.stopPropagation();
    alert("🚑 구급차에 연락합니다.");
  };

  const handlePreview = (e: MouseEvent) => {
    e.stopPropagation();
    router.push("/hospital/preview");
  };

  const handleAccept = (e: MouseEvent) => {
    e.stopPropagation();
    openModal();
  };

  return (
    <>
      {/* 카드 */}
      <div className="w-[625px] h-[292px] bg-white border border-gray-200 rounded-[20px] p-6 font-['Pretendard'] shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
        {/* 상단 상태 및 버튼 */}
        <div className="flex items-center justify-between mb-1">
          {/* 왼쪽: 상태 뱃지 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold rounded-full w-[58px] h-[32px] bg-[#FB4D40] text-[#FEE4E2] flex items-center justify-center">
              고위험
            </span>
            <span className="text-sm font-semibold rounded-full w-[58px] h-[32px] bg-[#FEE4E2] text-[#FB4D40] flex items-center justify-center">
              응급
            </span>
          </div>

          {/* 오른쪽: 구급차 연락 + 수용 */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCallAmbulance}
              className="flex items-center justify-center gap-2 px-5 py-2 border border-gray-300 rounded-full font-medium text-[14px] text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Image src="/Call.png" alt="구급차 연락" width={16} height={16} />
              <span>구급차 연락</span>
            </button>

            <button
              onClick={handleAccept}
              className="flex items-center justify-center gap-2 px-5 py-2 rounded-full text-[14px] font-medium bg-black text-white hover:bg-gray-800 transition"
            >
              <span>⊕</span> 수용
            </button>
          </div>
        </div>

        {/* 본문 */}
        <div>
          {/* 환자 ID + 프리뷰 버튼 */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <p className="text-[24px] font-semibold text-gray-900">
                {patient.id}
              </p>
              <button
                onClick={handlePreview}
                className="flex items-center gap-1 border border-black px-3 py-1 rounded-full text-sm hover:bg-gray-50 transition-colors font-medium"
              >
                프리뷰
                <Image src="/preview.png" alt="프리뷰" width={13} height={13} />
              </button>
            </div>
          </div>

          {/* 중증도 + 주요 증상 */}
          <div className="flex mb-3">
            <div className="flex flex-col items-start">
              <p className="text-[#A3A3A3] text-[12px] mb-2">환자 중증도</p>
              <span className="text-[14px] font-medium text-[#D0312D] bg-[#FEE4E2] px-4 py-1.5 rounded-full">
                위급
              </span>
            </div>

            <div className="flex flex-col items-start w-1/2 pl-4">
              <p className="text-[#A3A3A3] text-[12px] mb-2">주요 증상</p>
              <div className="flex flex-wrap gap-2">
                {patient.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[#1778FF] text-[14px] font-medium px-4 py-1.5 rounded-full bg-[#EEF5FF]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 초기 활력징후 */}
          <div>
            <p className="text-[#A3A3A3] text-[12px] mb-2">초기 활력징후</p>
            <div className="bg-[#F9FAFB] rounded-lg px-5 py-3 flex text-center">
              {[
                { label: "SBP", value: patient.vitals.sbp },
                { label: "DBP", value: patient.vitals.dbp },
                { label: "HR", value: patient.vitals.hr },
                { label: "RR", value: patient.vitals.rr },
                { label: "SpO₂", value: patient.vitals.spo2 },
                { label: "Temp", value: patient.vitals.temp },
              ].map((v, idx, arr) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center flex-1 ${
                    idx < arr.length - 1 ? "border-r border-gray-200" : ""
                  }`}
                >
                  <p className="text-xs text-gray-500 mb-1">{v.label}</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {v.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 모달 */}
      <PatientAcceptModal
        isOpen={isModalOpen}
        onClose={closeModal}
        patient={{
          id: patient.id,
          risk: "고위험",
          emergency: "응급",
          condition: "위급",
          symptoms: patient.tags,
          vitals: patient.vitals,
        }}
      />
    </>
  );
}
