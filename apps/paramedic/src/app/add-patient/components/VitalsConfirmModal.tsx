"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import HospitalRecommendationModal from "./HospitalRecommendationModal";

export interface VitalSign {
  id: string;
  label: string;
  value: number;
  unit: string;
  touched: boolean;
}

export interface GCS {
  eye: number;
  verbal: number;
  motor: number;
}

interface VitalsConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (() => Promise<any>) | null;
  vitals: VitalSign[];
  gcs: GCS;
  severity: string;
  symptoms: string[];
}

type RecommendedHospital = {
  hospitalId: string;
  hospitalName: string;
  aiScore: number;
  priority: number;
  aiExplanations: Record<string, any>;
  distance: number;
  eta: number;
};

/* ---------------------------
 * 색상/라벨 매핑 (업데이트 반영)
 * --------------------------- */
const SEVERITY_MAP = {
  normal:   { label: "일반",   cls: "bg-[#E3F6EA] text-[#27A959]" },
  urgent:   { label: "긴급",   cls: "bg-[#FFF3E6] text-[#FFA034]" },
  critical: { label: "위급",   cls: "bg-[#FEE4E2] text-[#FB4D40]" },
} as const;

const SYMPTOM_LABELS: Record<string, string> = {
  "abdominal-pain": "복통",
  unconscious: "의식저하",
  fever: "발열",
  bleeding: "출혈",
  headache: "두통",
  breathing: "호흡곤란",
  injury: "외상",
  "chest-pain": "흉통",
  stroke: "뇌졸중",
};

// 활력징후 표시용
const VITAL_DISPLAY = [
  { id: "sbp",  label: "SBP",  unit: "mmHg" },
  { id: "dbp",  label: "DBP",  unit: "mmHg" },
  { id: "hr",   label: "HR",   unit: "bpm" },
  { id: "rr",   label: "RR",   unit: "/min" },
  { id: "spo2", label: "SpO₂", unit: "%" },
  { id: "temp", label: "Temp", unit: "°C" },
];

export default function VitalsConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  vitals,
  severity,
  symptoms,
}: VitalsConfirmModalProps) {
  const [showHospitalModal, setShowHospitalModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiHospitals, setAiHospitals] = useState<RecommendedHospital[] | null>(null);

  const handleConfirm = async () => {
    if (!onConfirm) return;
    setIsLoading(true);
    try {
      const hospitals = (await onConfirm()) as RecommendedHospital[];
      setAiHospitals(hospitals || []);
      setIsLoading(false);
      setShowHospitalModal(true);
    } catch (error) {
      console.error("병원 추천 실패:", error);
      setIsLoading(false);
      alert("병원 추천 중 오류가 발생했습니다.");
    }
  };

  const severityBadge = (() => {
    const s = SEVERITY_MAP[severity as keyof typeof SEVERITY_MAP];
    return {
      text: s?.label ?? severity,
      cls: s?.cls ?? "bg-[#27A959] text-white",
    };
  })();

  return (
    <>
      <AnimatePresence>
        {isOpen && !showHospitalModal && (
          <>
            {!isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/40 z-40"
              />
            )}

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
                        className={`px-3 h-7 flex items-center justify-center rounded-xl text-[13px] font-medium ${severityBadge.cls}`}
                      >
                        {severityBadge.text}
                      </span>
                    </div>
                  </div>

                  {/* 주요 증상 */}
                  <div className="mb-2.5">
                    <div className="flex items-center justify-between">
                      <p className="text-[12px] font-light text-gray-500">주요 증상</p>
                      <div className="flex gap-2">
                        {symptoms.slice(0, 2).map((id, idx) => (
                          <span
                            key={idx}
                            className="h-7 px-3 flex items-center justify-center rounded-xl text-[13px] font-medium bg-[#E3F2FD] text-[#1778FF]"
                          >
                            {SYMPTOM_LABELS[id] ?? id}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 초기 활력징후 */}
                  <div className="mb-2.5">
                    <p className="text-[12px] font-light text-gray-500 mb-3">초기 활력징후</p>
                    <div className="bg-gray-50 rounded-2xl p-4 grid grid-cols-2 gap-y-1 gap-x-6">
                      {VITAL_DISPLAY.map(({ id, label, unit }) => {
                        const value = vitals.find((v) => v.id === id)?.value;
                        return (
                          <div key={id} className="flex items-center justify-between">
                            <span className="text-[13px] text-gray-500">{label}</span>
                            <span className="text-[13px] font-medium text-black">
                              {value ?? "-"}
                              {unit}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 안내 */}
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
                      className="h-10 flex-[0.7] rounded-3xl border border-gray-300 text-gray-600 font-medium text-[15px] hover:bg-gray-50 transition-all"
                    >
                      ← 이전
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="h-10 flex-[1.5] rounded-3xl bg-gray-900 text-white font-medium text-[15px] hover:bg-gray-800 transition-all"
                    >
                      확정하기
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 로딩 상태 */}
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
                  className="bg-white rounded-3xl w-[85%] max-w-[320px] h-40 flex flex-col items-center justify-center text-center shadow-2xl"
                >
                  <div className="flex gap-2 mb-4">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-3 h-3 rounded-full bg-[#1778FF]"
                        animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
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
                    AI가 최적의 병원을 찾고 있어요...
                  </p>
                </motion.div>
              </motion.div>
            )}
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
          aiHospitals={aiHospitals ?? []}
        />
    </>
  );
}
