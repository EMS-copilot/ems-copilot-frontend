"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import HandoverModal from "./HandoverModal";

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

interface HospitalConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospital: Hospital;
}

export default function HospitalConfirmModal({
  isOpen,
  onClose,
  hospital,
}: HospitalConfirmModalProps) {
  const router = useRouter();
  const [showHandoverModal, setShowHandoverModal] = useState(false);

  if (!isOpen) return null;

  const handleShowHandover = () => {
    setShowHandoverModal(true);
  };

  const handleHandoverConfirm = () => {
    // 병원 정보를 localStorage에 저장 (페이지 간 데이터 전달)
    localStorage.setItem("selectedHospital", JSON.stringify(hospital));
    
    // route 페이지로 이동
    router.push("/hospital-recommendation/route");
  };

  // 기본값 설정
  const distance = hospital.distance || "3.4km";
  const waitTime = hospital.waitTime || "8분";
  const beds = hospital.beds || "12분";
  const treatments = hospital.treatments || ["PCI", "ECMO", "IABP"];
  const specialties = hospital.specialties || "심혈관센터, 응급실";

  // HandoverModal이 열려있으면 HospitalConfirmModal 숨기기
  if (showHandoverModal) {
    return (
      <HandoverModal
        isOpen={showHandoverModal}
        onClose={() => setShowHandoverModal(false)}
        onConfirm={handleHandoverConfirm}
      />
    );
  }

  return (
    <>
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 bg-black/40 z-[85]" onClick={onClose} />

      {/* 모달 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-[360px] h-[416px] bg-white rounded-2xl z-[90] overflow-hidden"
      >
        <div className="px-4 pt-4 pb-4">
          {/* 제목 */}
          <h3 className="text-[16px] font-semibold text-black mb-2">
            병원 확정하기
          </h3>

          {/* 병원 정보 카드 - HospitalRecommendationModal 스타일 적용 */}
          <div className="bg-[#F7F7F7] rounded-2xl p-4 mb-4">
            {/* 첫 번째 줄: 병원명 + 지역 + 배지 */}
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-1 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-medium text-black">
                    {hospital.name}
                  </h3>
                  <span className="text-[12px] font-light text-gray-400">
                    {hospital.type}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[13px] font-medium flex-shrink-0 ${
                    hospital.badgeColor === "green"
                      ? "bg-[#E8F5E9] text-[#27A959]"
                      : "bg-[#F3E5F5] text-[#9C27B0]"
                  }`}
                  style={{
                    width: "47px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {hospital.badgeText}
                </span>
              </div>
            </div>

            {/* 특성 정보 박스 */}
            <div
              className="bg-[#EDEDED] rounded-lg px-3 py-2.5 mb-2"
              style={{ height: "36px", display: "flex", alignItems: "center" }}
            >
              <p className="text-[13px] font-medium text-gray-700">
                {specialties}
              </p>
            </div>

            {/* 치료 가능 시술 박스 */}
            <div
              className="bg-[#EDEDED] rounded-lg px-3 py-2.5 mb-4 flex items-center"
              style={{ height: "36px" }}
            >
              <span className="text-[13px] font-medium text-gray-600 mr-1.5">
                치료 가능 시술 :
              </span>
              <div className="flex items-center flex-wrap">
                {treatments.map((treatment, idx) => (
                  <span
                    key={idx}
                    className="text-[13px] font-medium text-[#1778FF]"
                  >
                    {treatment}
                    {idx < treatments.length - 1 && (
                      <span className="text-[#1778FF] mx-1">|</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* 거리/시간 정보 */}
            <div className="grid grid-cols-3 mb-4 divide-x divide-gray-200">
              <div className="text-center px-1">
                <p className="text-[12px] font-light text-gray-500">총 거리</p>
                <p className="text-[16px] font-semibold text-black">
                  {distance}
                </p>
              </div>
              <div className="text-center px-1">
                <p className="text-[12px] font-light text-gray-500">
                  예상도착시간
                </p>
                <p className="text-[16px] font-semibold text-black">
                  {waitTime}
                </p>
              </div>
              <div className="text-center px-1">
                <p className="text-[12px] font-light text-gray-500">
                  예상대기시간
                </p>
                <p className="text-[16px] font-semibold text-black">{beds}</p>
              </div>
            </div>

            {/* 특성 태그들 */}
            <div className="flex gap-2">
              <span
                className=" bg-[#E3F2FD] text-[#1778FF] rounded-full text-[13px] font-regular"
                style={{
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 10px",
                }}
              >
                최단거리
              </span>
              <span
                className=" bg-[#E3F2FD] text-[#1778FF] rounded-full text-[13px] font-regular"
                style={{
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 10px",
                }}
              >
                수용 확률 높음
              </span>
              <span
                className=" bg-[#E3F2FD] text-[#1778FF] rounded-full text-[13px] font-regular"
                style={{
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 10px",
                }}
              >
                전문의 보유
              </span>
            </div>
          </div>

          {/* 안내 문구 */}
          <div className="mb-4 text-center">
            <p className="text-[13px] text-gray-600 leading-relaxed">
              위의 병원으로 확정 하시겠어요?
            </p>
          </div>

          {/* 하단 버튼들 */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="w-[85px] h-[40px] rounded-2xl border border-gray-300 text-gray-600 font-medium text-[14px] hover:bg-gray-50 transition-all"
            >
              이전
            </button>
            <button
              onClick={handleShowHandover}
              className="w-[228px] h-[40px] rounded-2xl bg-gray-900 text-white font-medium text-[14px] hover:bg-gray-800 transition-all"
            >
              인수인계 내용 확인하기
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}