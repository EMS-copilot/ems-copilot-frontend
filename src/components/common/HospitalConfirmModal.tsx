"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

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

  if (!isOpen) return null;

  const handleConfirm = () => {
    // 병원 정보를 localStorage에 저장 (페이지 간 데이터 전달)
    localStorage.setItem("selectedHospital", JSON.stringify(hospital));
    
    // route 페이지로 이동
    router.push("/hospital-recommendation/route");
  };

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black/40 z-[60]"
        onClick={onClose}
      />

      {/* 모달 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-[360px] bg-white rounded-3xl shadow-2xl z-[65] overflow-hidden"
      >
        <div className="px-6 pt-7 pb-6">
          {/* 제목 */}
          <h3 className="text-[20px] font-bold text-gray-900 mb-6">
            병원 확정하기
          </h3>

          {/* 병원 정보 */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-[16px] font-bold text-gray-900">
                {hospital.name}
              </h4>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  hospital.badgeColor === "green"
                    ? "bg-[#E8F5E9] text-[#27A959]"
                    : "bg-[#F3E5F5] text-[#9C27B0]"
                }`}
              >
                {hospital.badgeText}
              </span>
            </div>
            <p className="text-[12px] text-gray-500 mb-3">{hospital.type}</p>

            {/* 특징 */}
            <p className="text-[13px] text-gray-700 mb-3">
              {hospital.specialties}
            </p>

            {/* 치료 가능 시술 */}
            <div className="mb-3">
              <span className="text-[12px] text-gray-600">
                치료 가능 시술 :{" "}
              </span>
              {hospital.treatments.map((treatment, idx) => (
                <span
                  key={idx}
                  className="text-[12px] font-semibold text-[#1778FF]"
                >
                  {treatment}
                  {idx < hospital.treatments.length - 1 ? " | " : ""}
                </span>
              ))}
            </div>

            {/* 거리/시간 정보 */}
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-[11px] text-gray-500 mb-1">총 거리</p>
                <p className="text-[15px] font-bold text-gray-900">
                  {hospital.distance}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[11px] text-gray-500 mb-1">예상도착시간</p>
                <p className="text-[15px] font-bold text-gray-900">
                  {hospital.waitTime}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[11px] text-gray-500 mb-1">예상대기시간</p>
                <p className="text-[15px] font-bold text-gray-900">
                  {hospital.beds}
                </p>
              </div>
            </div>
          </div>

          {/* 태그 */}
          <div className="flex gap-2 mb-6">
            <span className="px-2 py-1 bg-[#E3F2FD] text-[#1778FF] rounded text-[11px] font-medium">
              최단거리
            </span>
            <span className="px-2 py-1 bg-[#E3F2FD] text-[#1778FF] rounded text-[11px] font-medium">
              수용 확률 높음
            </span>
            <span className="px-2 py-1 bg-[#E3F2FD] text-[#1778FF] rounded text-[11px] font-medium">
              전문의 보유
            </span>
          </div>

          {/* 안내 문구 */}
          <div className="mb-6 text-center">
            <p className="text-[13px] text-gray-600 leading-relaxed">
              위의 병원으로 확정 하시겠어요?
            </p>
          </div>

          {/* 하단 버튼들 */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl border border-gray-300 text-gray-600 font-medium text-[15px] hover:bg-gray-50 transition-all"
            >
              ← 이전
            </button>
            <button
              onClick={handleConfirm}
              className="flex-[1.5] py-3.5 rounded-xl bg-gray-900 text-white font-medium text-[15px] hover:bg-gray-800 transition-all"
            >
              병원 확정하기
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}