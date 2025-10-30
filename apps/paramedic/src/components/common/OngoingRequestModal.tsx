"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import HospitalConfirmModal from "./HospitalConfirmModal";

interface Hospital {
  name: string;
  type: string;
  distance?: string;
  waitTime?: string;
  beds?: string;
  treatments?: string[];
  specialties?: string;
  badgeColor: "green" | "purple";
  badgeText: string;
}

export interface OngoingRequestModalProps {
  hospitals: Hospital[];
  onClose?: () => void; // 있지만 지금은 비활성화 (닫히지 않게)
}

export default function OngoingRequestModal({
  hospitals,
}: OngoingRequestModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    setCurrentIndex(newIndex);
  };

  const handleCardClick = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      {/* ✅ 오버레이 제거 — 이제 클릭해도 닫히지 않음 */}
      {/* (이전엔 <div className="fixed inset-0 z-[59]" onClick={onClose}/> 였음) */}

      {/* 본체 */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-white rounded-t-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-[60] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="진행 중 요청"
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
          {/* 왼쪽: 텍스트 */}
          <div className="flex items-center gap-1">
            <Image
              src="/lotties/requestmodal-icon.png"
              alt="AI"
              width={18}
              height={18}
              className="object-contain"
            />
            <span className="text-[14px] font-medium text-gray-900">
              총{" "}
              <span className="text-[#1778FF] font-semibold">
                {hospitals.length}개의 요청
              </span>{" "}
              이 진행 중입니다
            </span>
          </div>

          {/* 오른쪽: 닫기 버튼 제거 (고정 상태로 유지) */}
          <div className="flex items-center gap-2">
            <button
              disabled
              className="w-8 h-8 grid place-items-center rounded-full opacity-40 cursor-not-allowed"
              aria-label="닫기 비활성화"
              type="button"
            >
              <span className="text-xl leading-none text-gray-300">×</span>
            </button>
          </div>
        </div>

        {/* 병원 카드 리스트 */}
        <div
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-5 py-4 space-x-3"
          onScroll={handleScroll}
        >
          {hospitals.map((hospital, idx) => (
            <div
              key={idx}
              onClick={() => handleCardClick(hospital)}
              className="shrink-0 snap-center bg-white border border-gray-200 rounded-2xl px-4 pt-4 pb-3 w-[280px] cursor-pointer hover:border-gray-300 transition-colors"
            >
              {/* 병원 이름 + 위치 + 상태 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-[16px] font-semibold text-gray-900">
                    {hospital.name}
                  </h3>
                  <p className="text-[13px] text-gray-500">{hospital.type}</p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-[12px] font-medium ${
                    hospital.badgeColor === "green"
                      ? "bg-[#E8F5E9] text-[#27A959]"
                      : "bg-[#F3E5F5] text-[#9C27B0]"
                  }`}
                >
                  {hospital.badgeText}
                </span>
              </div>

              {/* 거리/시간 정보 */}
              <div className="grid grid-cols-3 text-center divide-x divide-gray-200">
                <div>
                  <p className="text-[12px] font-light text-gray-500">총 거리</p>
                  <p className="text-[16px] font-semibold text-black">
                    {hospital.distance || "3.4km"}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] font-light text-gray-500">
                    예상도착시간
                  </p>
                  <p className="text-[16px] font-semibold text-black">
                    {hospital.waitTime || "8분"}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] font-light text-gray-500">
                    예상치료시작
                  </p>
                  <p className="text-[16px] font-semibold text-black">
                    {hospital.beds || "12분"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 점 */}
        <div className="flex justify-center gap-1 pb-3">
          {hospitals.map((_, idx) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                currentIndex === idx ? "bg-black" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* 병원 확정 모달 */}
      {selectedHospital && (
        <HospitalConfirmModal
          isOpen={showConfirmModal}
          onClose={handleCloseConfirmModal}
          hospital={selectedHospital}
        />
      )}
    </>
  );
}