"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import VitalsConfirmModal from "./components/VitalsConfirmModal";

interface Step3VitalsProps {
  onPrev: () => void;
}

interface VitalSign {
  id: string;
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
}

export default function Step3Vitals({ onPrev }: Step3VitalsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [vitals, setVitals] = useState<VitalSign[]>([
    { id: "sbp", label: "SBP", value: 121, unit: "mmHg", min: 50, max: 250, step: 1 },
    { id: "dbp", label: "DBP", value: 81, unit: "mmHg", min: 30, max: 150, step: 1 },
    { id: "hr", label: "HR", value: 76, unit: "bpm", min: 30, max: 200, step: 1 },
    { id: "rr", label: "RR", value: 17, unit: "/min", min: 5, max: 60, step: 1 },
    { id: "spo2", label: "SpO₂", value: 94, unit: "%", min: 50, max: 100, step: 1 },
    { id: "temp", label: "Temp", value: 36.4, unit: "℃", min: 30, max: 45, step: 0.1 },
  ]);

  const [gcs, setGcs] = useState({
    eye: 3,
    verbal: 8,
    motor: 4,
  });

  const updateVital = (id: string, change: number) => {
    setVitals((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const newValue = Number((v.value + change * v.step).toFixed(1));
          return {
            ...v,
            value: Math.max(v.min, Math.min(v.max, newValue)),
          };
        }
        return v;
      })
    );
  };

  const updateGcs = (type: "eye" | "verbal" | "motor", change: number) => {
    setGcs((prev) => {
      const limits = { eye: [1, 4], verbal: [1, 5], motor: [1, 6] };
      const [min, max] = limits[type];
      return {
        ...prev,
        [type]: Math.max(min, Math.min(max, prev[type] + change)),
      };
    });
  };

  const gcsTotal = gcs.eye + gcs.verbal + gcs.motor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col"
    >
      {/* 중앙 이미지 */}
      <div className="flex justify-center mb-8 mt-6">
        <Image
          src="/lotties/severity-middle.png"
          alt="활력징후 입력"
          width={100}
          height={100}
          className="object-contain"
        />
      </div>

      {/* 제목 */}
      <h2 className="text-[22px] font-bold text-gray-900 mb-2 text-center">
        초기 활력징후를 입력해주세요
      </h2>

      {/* 설명 */}
      <p className="text-[#9E9E9E] text-[14px] mb-8 text-center">
        측정한 값을 정확히 입력해주세요
      </p>

      {/* 활력징후 그리드 */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {vitals.map((vital) => (
          <div
            key={vital.id}
            className="bg-white rounded-2xl p-4 border border-gray-200"
          >
            <p className="text-[13px] font-semibold text-gray-900 mb-2 text-center">
              {vital.label}
            </p>
            <div className="flex items-center justify-center gap-3 mb-2">
              <button
                onClick={() => updateVital(vital.id, -1)}
                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
              >
                −
              </button>
              <span className="text-[28px] font-bold text-[#1778FF] min-w-[70px] text-center">
                {vital.value}
              </span>
              <button
                onClick={() => updateVital(vital.id, 1)}
                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
              >
                +
              </button>
            </div>
            <p className="text-[12px] text-gray-400 text-center">{vital.unit}</p>
          </div>
        ))}
      </div>

      {/* GCS 섹션 */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 mb-8">
        <h3 className="text-[16px] font-bold text-gray-900 mb-4 text-center">
          Glasgow Coma Scale (GCS)
        </h3>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { key: "eye" as const, label: "Eye (E)", value: gcs.eye },
            { key: "verbal" as const, label: "Verbal (V)", value: gcs.verbal },
            { key: "motor" as const, label: "Motor (M)", value: gcs.motor },
          ].map((item) => (
            <div key={item.key} className="text-center">
              <p className="text-[12px] text-gray-600 mb-2">{item.label}</p>
              <p className="text-[32px] font-bold text-[#1778FF] mb-2">
                {item.value}
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => updateGcs(item.key, -1)}
                  className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-[18px]"
                >
                  −
                </button>
                <button
                  onClick={() => updateGcs(item.key, 1)}
                  className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-[18px]"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* GCS 총점 */}
        <div className="bg-[#EFF6FF] rounded-xl py-3 text-center">
          <span className="text-[14px] text-[#1778FF] font-semibold">
            총점 : {gcsTotal}/15
          </span>
        </div>
      </div>

      {/* 하단 버튼들 */}
      <div className="flex gap-3 w-full">
        <button
          onClick={onPrev}
          className="flex-[0.8] py-4 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-[15px] hover:bg-gray-50 transition-all"
        >
          이전
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex-[2] py-4 rounded-xl bg-[#1778FF] text-white font-semibold text-[15px] hover:bg-[#0D66E8] transition-all"
        >
          AI에게 병원 추천받기
        </button>
      </div>

      {/* 확인 모달 */}
      <VitalsConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false);
          alert("AI 분석 시작! 🚑");
          // 여기서 실제 API 호출하면 됩니다
        }}
        vitals={vitals}
        gcs={gcs}
        severity="긴급"
        symptoms={["흉통", "호흡곤란"]}
      />
    </motion.div>
  );
}