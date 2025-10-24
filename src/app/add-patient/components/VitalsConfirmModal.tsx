"use client";

import { motion, AnimatePresence } from "framer-motion";

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
  gcs,
  severity = "긴급",
  symptoms = ["흉통", "호흡곤란"],
}: VitalsConfirmModalProps) {
  const gcsTotal = gcs.eye + gcs.verbal + gcs.motor;

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="fixed inset-x-0 top-1/2 -translate-y-1/2 max-w-[370px] left-1/2 -translate-x-1/2 bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            {/* 내용 */}
            <div className="px-5 pt-6 pb-5">
              {/* 제목 */}
              <h3 className="text-[18px] font-bold text-gray-900 mb-4">
                등록할 환자 정보 확인
              </h3>

              {/* 환자 중증도 */}
              <div className="mb-4">
                <p className="text-[13px] text-gray-500 mb-2">환자 중증도</p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-lg bg-[#FFEBEE] text-[#FF4545] text-[13px] font-medium">
                    위급
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-[#E3F2FD] text-[#1778FF] text-[13px] font-medium">
                    긴급
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-[#E8F5E9] text-[#27A959] text-[13px] font-medium">
                    일반
                  </button>
                </div>
              </div>

              {/* 주요 증상 */}
              <div className="mb-4">
                <p className="text-[13px] text-gray-500 mb-2">주요 증상</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[13px] text-gray-700">
                    외상
                  </span>
                  <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[13px] text-gray-700">
                    출혈
                  </span>
                  <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[13px] text-gray-700">
                    화상
                  </span>
                </div>
              </div>

              {/* 초기 활력징후 */}
              <div className="mb-5">
                <p className="text-[13px] text-gray-500 mb-3">초기 활력징후</p>
                <div className="grid grid-cols-2 gap-3">
                  {/* SBP */}
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-gray-700">SBP</span>
                    <span className="text-[14px] font-semibold text-gray-900">
                      121mmHg
                    </span>
                  </div>
                  {/* RR */}
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-gray-700">RR</span>
                    <span className="text-[14px] font-semibold text-gray-900">
                      17/min
                    </span>
                  </div>
                  {/* DBP */}
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-gray-700">DBP</span>
                    <span className="text-[14px] font-semibold text-gray-900">
                      81mmHg
                    </span>
                  </div>
                  {/* SpO2 */}
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-gray-700">SpO₂</span>
                    <span className="text-[14px] font-semibold text-gray-900">
                      94%
                    </span>
                  </div>
                  {/* HR */}
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-gray-700">HR</span>
                    <span className="text-[14px] font-semibold text-gray-900">
                      76bpm
                    </span>
                  </div>
                  {/* Temp */}
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-gray-700">Temp</span>
                    <span className="text-[14px] font-semibold text-gray-900">
                      36.4°C
                    </span>
                  </div>
                </div>
              </div>

              {/* 안내 문구 */}
              <div className="mb-5 text-center">
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  등록될 환자 정보를 정확히 입력하셨나요?
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
                  이전
                </button>
                <button
                  onClick={onConfirm}
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
  );
}