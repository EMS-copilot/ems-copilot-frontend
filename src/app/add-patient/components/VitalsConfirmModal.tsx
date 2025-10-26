"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(false);

  // ✅ 로딩 후 병원 추천 모달로 전환
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setShowHospitalModal(true);
      }, 3000); // ← 3초로 늘림
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <>
      <AnimatePresence>
        {/* ✅ 환자 정보 확인 모달 */}
        {isOpen && !showHospitalModal && (
          <>
            {/* 배경 */}
            {!isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/40 z-40"
              />
            )}

            {/* 본문 */}
            {!isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[364px] h-[382px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
              >
                <div className="px-4 pt-4 pb-6">
                  <h3 className="text-[16px] font-semibold text-gray-900 mb-6">
                    등록할 환자 정보 확인
                  </h3>

                  {/* 환자 중증도 */}
                  <div className="mb-2.5">
                    <div className="flex items-center justify-between">
                      <p className="text-[12px] font-light text-gray-500">환자 중증도</p>
                      <span
                        className={`px-3 h-[28px] flex items-center justify-center rounded-xl text-[13px] font-medium ${
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
                  <div className="mb-2.5">
                    <div className="flex items-center justify-between">
                      <p className="text-[12px] font-light text-gray-500">주요 증상</p>
                      <div className="flex gap-2">
                        {symptoms.slice(0, 2).map((symptom, idx) => (
                          <span
                            key={idx}
                            className="h-[28px] px-3 flex items-center justify-center rounded-xl text-[13px] font-medium bg-[#E3F2FD] text-[#1778FF]"
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 초기 활력징후 */}
                  <div className="mb-2.5">
                    <p className="text-[12px] font-light text-gray-500 mb-3">
                      초기 활력징후
                    </p>
                    <div className="bg-gray-50 rounded-2xl p-4 grid grid-cols-2 gap-y-0.5 gap-x-6">
                      {[
                        ["SBP", "mmHg"],
                        ["DBP", "mmHg"],
                        ["HR", "bpm"],
                        ["RR", "/min"],
                        ["SpO₂", "%"],
                        ["Temp", "°C"],
                      ].map(([key, unit]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <span className="text-[13px] font-regular text-gray-500">{key}</span>
                          <span className="text-[13px] font-medium text-black">
                            {
                              vitals.find(
                                (v) => v.id.toLowerCase() === key.toLowerCase()
                              )?.value
                            }
                            {unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 안내 문구 */}
                  <div className="mb-2.5 text-center">
                    <p className="text-[13px] text-gray-600 leading-relaxed">
                      등록할 환자 정보를 정확히 입력하셨나요?
                      <br />
                      확인 후 AI 병원 추천을 진행해주세요.
                    </p>
                  </div>

                  {/* 버튼 */}
                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="h-[40px] flex-[0.7] rounded-3xl border border-gray-300 text-gray-600 font-medium text-[15px] hover:bg-gray-50 transition-all"
                    >
                      ← 이전
                    </button>
                    <button
                      onClick={() => {
                        onConfirm();
                        setIsLoading(true);
                      }}
                      className="h-[40px] flex-[1.5] rounded-3xl bg-gray-900 text-white font-medium text-[15px] hover:bg-gray-800 transition-all"
                    >
                      확정하기
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ✅ 로딩 애니메이션 화면 */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl w-[85%] max-w-[320px] h-[160px] flex flex-col items-center justify-center text-center shadow-2xl"
                >
                  {/* 파란 점 애니메이션 */}
                  <div className="flex gap-2 mb-4">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-3 h-3 rounded-full bg-[#1778FF]"
                        animate={{
                          y: [0, -6, 0],
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.25,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>

                  <p className="text-[15px] font-medium text-[#1778FF]">
                    입력하신 정보를 정리 중이에요...
                  </p>
                </motion.div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

      {/* ✅ 병원 추천 모달 */}
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
