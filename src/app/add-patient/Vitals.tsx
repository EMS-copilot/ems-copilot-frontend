"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import VitalsConfirmModal from "./components/VitalsConfirmModal";

interface Step4VitalsProps {
  onPrev: () => void;
  onSubmit: (vitalsData: Record<string, number>) => void;
}

export interface VitalSign {
  id: string;
  label: string;
  value: number;
  unit: string;
}

export default function Step4Vitals({ onPrev, onSubmit }: Step4VitalsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vitals, setVitals] = useState<VitalSign[]>([
    { id: "sbp", label: "SBP", value: 121, unit: "mmHg" },
    { id: "dbp", label: "DBP", value: 81, unit: "mmHg" },
    { id: "hr", label: "HR", value: 76, unit: "bpm" },
    { id: "rr", label: "RR", value: 17, unit: "회/분" },
    { id: "spo2", label: "SpO₂", value: 94, unit: "%" },
    { id: "temp", label: "Temp", value: 36.4, unit: "℃" },
  ]);
  const [gcs, setGcs] = useState({ eye: 3, verbal: 8, motor: 4 });

  const handleValueChange = (id: string, newValue: number) => {
    setVitals((prev) =>
      prev.map((v) => (v.id === id ? { ...v, value: newValue } : v))
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center pb-[76px]"
    >
      <div className="mt-10 mb-8 text-center">
        <Image src="/lotties/vitals.png" alt="활력징후 등록" width={120} height={120} />
        <h2 className="text-[18px] font-semibold text-gray-900 mt-4 mb-2">
          환자의 활력징후를 입력해주세요
        </h2>
        <p className="text-[#A3A3A3] text-[14px]">
          SBP, DBP, HR, RR, SpO₂, 체온을 입력하면 AI가 병원을 추천합니다.
        </p>
      </div>

      <div className="w-full grid grid-cols-2 gap-3">
        {vitals.map((vital) => (
          <div
            key={vital.id}
            className="flex flex-col items-center border border-gray-200 rounded-lg py-3 bg-white"
          >
            <span className="text-[14px] font-semibold text-gray-800 mb-1">
              {vital.label}
            </span>
            <input
              type="number"
              value={vital.value}
              onChange={(e) => handleValueChange(vital.id, Number(e.target.value))}
              className="w-[70px] text-center text-[16px] font-bold text-[#1778FF] border-b border-gray-300 focus:outline-none"
            />
            <span className="text-[12px] text-gray-500 mt-1">{vital.unit}</span>
          </div>
        ))}
      </div>

      <div className="w-full mt-6">
        <label className="block text-gray-700 font-medium mb-2 text-[15px]">
          GCS (Eye / Verbal / Motor)
        </label>
        <div className="flex gap-3">
          {Object.keys(gcs).map((key) => (
            <input
              key={key}
              type="number"
              value={gcs[key as keyof typeof gcs]}
              onChange={(e) =>
                setGcs((prev) => ({
                  ...prev,
                  [key]: Number(e.target.value),
                }))
              }
              className="flex-1 py-2 border border-gray-300 rounded-lg text-center text-[14px]"
              placeholder={key.toUpperCase()}
            />
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[393px] mx-auto bg-[#f7f7f7] border-t border-gray-100 px-5 py-4">
        <div className="flex gap-3 w-full">
          <button
            onClick={onPrev}
            className="flex-[0.8] w-[85px] h-[44px] rounded-full border-2 border-gray-200 text-gray-400 font-semibold text-[14px]"
          >
            이전
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-[2] w-[258px] h-[44px] rounded-full bg-[#1778FF] text-white font-semibold text-[14px]"
          >
            AI에게 병원 추천받기
          </button>
        </div>
      </div>

      <VitalsConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false);
          const vitalMap = Object.fromEntries(vitals.map((v) => [v.id, v.value]));
          onSubmit(vitalMap);
        }}
        vitals={vitals}
        gcs={gcs}
        severity="긴급"
        symptoms={["흉통", "호흡곤란"]}
      />
    </motion.div>
  );
}
