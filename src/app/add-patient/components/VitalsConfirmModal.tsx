"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import HospitalRecommendationModal from "./HospitalRecommendationModal";

interface VitalSign {
  id: string;
  label: string;
  value: number;
  unit: string;
}

interface GCS {
  eye: number;
  verbal: number;
  motor: number;
}

interface VitalsConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  vitals: VitalSign[];
  gcs: GCS;
  severity?: string;
  symptoms?: string[];
}

export default function VitalsConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  vitals,
  severity = "긴급",
  symptoms = ["흉통", "호흡곤란"],
}: VitalsConfirmModalProps) {
  const [showHospitalModal, setShowHospitalModal] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && !showHospitalModal && (
          <>
            {/* 배경 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 z-40"
            />

            {/* 모달 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-[360px] bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
            >
              {/* 내용 */}
              <div className="px-6 pt-7 pb-6">
                {/* 제목 */}
                <h3 className="text-[20px] font-bold text-gray-900 mb-6">
                  등록할 환자 정보 확인
                </h3>

                {/* 환자 중증도 */}
                <div className="mb-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] text-gray-500">환자 중증도</p>
                    <span
                      className={`px-5 py-2 rounded-xl text-[14px] font-semibold ${
                        severity === "위급"
                          ? "bg-[#FFEBEE] text-[#FF4545]"
                          : severity === "긴급"
                          ? "bg-[#E3F2FD] text-[#1778FF]"
                          : "bg-[#E8F5E9] text-[#27A959]"
                      }`}
                    >
                      {severity}
                    </span>
                  </div>
                </div>

                {/* 주요 증상 */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] text-gray-500">주요 증상</p>
                    <div className="flex gap-2">
                      {symptoms.slice(0, 2).map((symptom, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-[13px] text-gray-700 font-medium"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 초기 활력징후 */}
                <div className="mb-6">
                  <p className="text-[14px] text-gray-500 mb-3">
                    초기 활력징후
                  </p>
                  <div className="bg-gray-50 rounded-2xl p-4 grid grid-cols-2 gap-y-3 gap-x-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] text-gray-600">SBP</span>
                      <span className="text-[16px] font-bold text-gray-900">
                        {vitals.find((v) => v.id === "sbp")?.value}mmHg
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] text-gray-600">RR</span>
                      <span className="text-[16px] font-bold text-gray-900">
                        {vitals.find((v) => v.id === "rr")?.value}/min
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] text-gray-600">DBP</span>
                      <span className="text-[16px] font-bold text-gray-900">
                        {vitals.find((v) => v.id === "dbp")?.value}mmHg
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] text-gray-600">SpO₂</span>
                      <span className="text-[16px] font-bold text-gray-900">
                        {vitals.find((v) => v.id === "spo2")?.value}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] text-gray-600">HR</span>
                      <span className="text-[16px] font-bold text-gray-900">
                        {vitals.find((v) => v.id === "hr")?.value}bpm
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] text-gray-600">Temp</span>
                      <span className="text-[16px] font-bold text-gray-900">
                        {vitals.find((v) => v.id === "temp")?.value}°C
                      </span>
                    </div>
                  </div>
                </div>

                {/* 안내 문구 */}
                <div className="mb-6 text-center">
                  <p className="text-[13px] text-gray-600 leading-relaxed">
                    등록할 환자 정보를 정확히 입력하셨나요?
                    <br />
                    확인 후 AI 병원 추천을 진행해주세요.
                  </p>
                </div>

                {/* 하단 버튼들 */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-[0.7] py-3.5 rounded-xl border border-gray-300 text-gray-600 font-medium text-[15px] hover:bg-gray-50 transition-all"
                  >
                    ← 이전
                  </button>
                  <button
                    onClick={() => {
                      onConfirm();
                      setShowHospitalModal(true);
                    }}
                    className="flex-[1.5] py-3.5 rounded-xl bg-gray-900 text-white font-medium text-[15px] hover:bg-gray-800 transition-all"
                  >
                    확정하기
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 병원 추천 모달 */}
      <HospitalRecommendationModal
        isOpen={showHospitalModal}
        onClose={() => {
          setShowHospitalModal(false);
          onClose();
        }}
      />
    </>
  );
}