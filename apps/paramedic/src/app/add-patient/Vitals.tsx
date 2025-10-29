"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import VitalsConfirmModal from "./components/VitalsConfirmModal";

interface Step4VitalsProps {
  onSubmit: (vitalsData: Record<string, number>) => Promise<any>;
  onPrev: () => void;
  severity: string;
  symptoms: string[];
}

interface VitalSign {
  id: string;
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  touched: boolean;
}

/* ✅ 각 활력징후의 기본값 정의 */
const DEFAULT_VITALS: Record<string, number> = {
  sbp: 120,
  dbp: 80,
  hr: 75,
  rr: 16,
  spo2: 98,
  temp: 36.5,
};

export default function Step4Vitals({
  onPrev,
  onSubmit,
  severity,
  symptoms,
}: Step4VitalsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiCall, setApiCall] = useState<(() => Promise<any>) | null>(null);

  const [vitals, setVitals] = useState<VitalSign[]>([
    { id: "sbp", label: "SBP", value: 120, unit: "mmHg", min: 50, max: 250, step: 1, touched: false },
    { id: "dbp", label: "DBP", value: 80, unit: "mmHg", min: 30, max: 150, step: 1, touched: false },
    { id: "hr", label: "HR", value: 75, unit: "bpm", min: 30, max: 200, step: 1, touched: false },
    { id: "rr", label: "RR", value: 16, unit: "/min", min: 5, max: 60, step: 1, touched: false },
    { id: "spo2", label: "SpO₂", value: 98, unit: "%", min: 50, max: 100, step: 1, touched: false },
    { id: "temp", label: "Temp", value: 36.5, unit: "℃", min: 30, max: 45, step: 0.5, touched: false },
  ]);

  const [gcs, setGcs] = useState({ eye: 1, verbal: 1, motor: 1 });
  const [gcsTouched, setGcsTouched] = useState({
    eye: false,
    verbal: false,
    motor: false,
  });

  /* -----------------------------------
   * 🔹 숫자 클릭 시 기본값 활성화 로직
   * ----------------------------------- */
  const handleActivateVital = (id: string) => {
    setVitals((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              value: DEFAULT_VITALS[id] ?? v.value,
              touched: true,
            }
          : v
      )
    );
  };

  const updateVital = (id: string, change: number) => {
    setVitals((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const newValue = Number((v.value + change * v.step).toFixed(1));
          return {
            ...v,
            value: Math.max(v.min, Math.min(v.max, newValue)),
            touched: true,
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
    setGcsTouched((prev) => ({ ...prev, [type]: true }));
  };

  const gcsTotal = gcs.eye + gcs.verbal + gcs.motor;

  const handleOpenModal = async () => {
    const vitalMap = Object.fromEntries(vitals.map((v) => [v.id, v.value]));
    setApiCall(() => () => onSubmit(vitalMap));
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col"
    >
      <div className="flex justify-center mb-8 mt-6">
        <Image
          src="/lotties/severity-middle.png"
          alt="활력징후 입력"
          width={100}
          height={100}
          className="object-contain"
        />
      </div>

      <h2 className="text-[18px] font-semibold text-gray-900 mb-1 text-center">
        초기 활력징후를 입력해주세요
      </h2>

      <p className="text-[#A3A3A3] font-regular text-[14px] mb-10 text-center">
        측정한 값을 정확히 입력해주세요
      </p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {vitals.map((vital) => (
          <div
            key={vital.id}
            className="bg-white rounded-2xl p-4 border border-gray-200 w-[172.5px] h-[126px] flex flex-col justify-center"
          >
            <p className="text-[14px] font-medium text-gray-900 mb-3 text-center">
              {vital.label}
            </p>

            <div className="flex items-center justify-center gap-2 mb-1 -mt-0.5">
              <button
                onClick={() => updateVital(vital.id, -1)}
                className="appearance-none shrink-0 w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors leading-none"
              >
                -
              </button>

              {/* ✅ 숫자 클릭 시 기본값 활성화 */}
              <span
                onClick={() => handleActivateVital(vital.id)}
                className={`text-[24px] font-semibold min-w-[70px] text-center leading-none cursor-pointer select-none ${
                  vital.touched ? "text-[#1778FF]" : "text-gray-400"
                }`}
              >
                {vital.value}
              </span>

              <button
                onClick={() => updateVital(vital.id, 1)}
                className="appearance-none shrink-0 w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors leading-none"
              >
                +
              </button>
            </div>

            <p className="text-[12px] text-gray-400 text-center -translate-y-0.5">
              {vital.unit}
            </p>
          </div>
        ))}
      </div>

      {/* GCS 섹션 */}
      <div className="w-[353px] mx-auto mb-8">
        <h3 className="text-[16px] font-semibold text-gray-900 mb-3 text-center">
          Glasgow Coma Scale (GCS)
        </h3>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 w-[353px] h-[186px] flex flex-col justify-between">
          <div className="grid grid-cols-3 divide-x divide-gray-200 flex-1">
            {[
              { key: "eye" as const, label: "Eye (E)", value: gcs.eye },
              { key: "verbal" as const, label: "Verbal (V)", value: gcs.verbal },
              { key: "motor" as const, label: "Motor (M)", value: gcs.motor },
            ].map((item) => (
              <div
                key={item.key}
                className="flex flex-col items-center justify-center px-2"
              >
                <p className="text-[14px] font-medium text-gray-900 mb-2 text-center">
                  {item.label}
                </p>
                <p
                  className={`text-[24px] font-semibold mb-3 leading-none ${
                    gcsTouched[item.key] ? "text-[#1778FF]" : "text-gray-400"
                  }`}
                >
                  {item.value}
                </p>
                <div className="flex gap-2.5 justify-center">
                  <button
                    onClick={() => updateGcs(item.key, -1)}
                    className="appearance-none shrink-0 w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 leading-none"
                  >
                    -
                  </button>
                  <button
                    onClick={() => updateGcs(item.key, 1)}
                    className="appearance-none shrink-0 w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 leading-none"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#EEF5FF] w-full py-2 rounded-xl mt-4 mb-4 flex items-center justify-center">
            <span className="text-[15px] text-[#1778FF] font-medium">
              총점 : {gcsTotal}/15
            </span>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex gap-3 w-full py-4">
        <button
          onClick={onPrev}
          className="flex-[0.8] w-[85px] h-11 rounded-full border-2 border-gray-200 text-gray-400 font-semibold text-[14px] hover:bg-gray-50 transition-all"
        >
          이전
        </button>
        <button
          onClick={handleOpenModal}
          className="flex-2 w-[258px] h-11 rounded-full bg-[#1778FF] text-white font-semibold text-[14px] hover:bg-[#0D66E8] transition-all"
        >
          AI에게 병원 추천받기
        </button>
      </div>

      <VitalsConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={apiCall}
        vitals={vitals}
        gcs={gcs}
        severity={severity}
        symptoms={symptoms}
      />
    </motion.div>
  );
}
