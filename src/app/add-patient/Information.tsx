"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Step2InformationProps {
  onNext: (formData: { age: number; sex: "male" | "female"; triageLevel: number }) => void;
  onPrev: () => void;
}

export default function Step2Information({ onNext, onPrev }: Step2InformationProps) {
  const [ageValue, setAgeValue] = useState("");
  const [ageUnit, setAgeUnit] = useState<"year" | "month">("year");
  const [sex, setSex] = useState<"male" | "female" | null>(null);
  const [triageLevel, setTriageLevel] = useState<number | null>(null);
  const [ageError, setAgeError] = useState("");

  const validateAge = (value: string, unit: "year" | "month") => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      setAgeError("");
      return;
    }

    if (unit === "year") {
      if (numValue < 0 || numValue > 120)
        setAgeError("나이는 0~120세 범위로 입력해주세요.");
      else setAgeError("");
    } else {
      if (numValue < 0 || numValue > 36)
        setAgeError("개월은 0~36개월까지 입력해주세요.");
      else setAgeError("");
    }
  };

  const handleAgeChange = (value: string) => {
    setAgeValue(value);
    validateAge(value, ageUnit);
  };

  const handleUnitChange = (unit: "year" | "month") => {
    setAgeUnit(unit);
    if (ageValue) validateAge(ageValue, unit);
  };

  const isFormValid = ageValue && sex && triageLevel && !ageError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center pb-[76px]"
    >
      <div className="mt-10 mb-8 text-center">
        <Image src="/lotties/info-middle.png" alt="환자 정보" width={120} height={120} />
        <h2 className="text-[18px] font-semibold text-gray-900 mt-4 mb-2">
          환자의 기본 정보를 입력해주세요
        </h2>
        <p className="text-[#A3A3A3] text-[14px]">
          나이, 성별, 중증도 정보를 입력해야 합니다.
        </p>
      </div>

      <div className="w-full space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2 text-[15px]">나이</label>
          <div className="flex gap-3">
            <input
              type="number"
              value={ageValue}
              onChange={(e) => handleAgeChange(e.target.value)}
              placeholder="나이를 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[14px]"
            />
            <select
              value={ageUnit}
              onChange={(e) => handleUnitChange(e.target.value as "year" | "month")}
              className="border border-gray-300 rounded-lg px-3 py-2 text-[14px]"
            >
              <option value="year">세</option>
              <option value="month">개월</option>
            </select>
          </div>
          {ageError && <p className="text-red-500 text-[13px] mt-1">{ageError}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2 text-[15px]">성별</label>
          <div className="flex gap-4">
            <button
              onClick={() => setSex("male")}
              className={`flex-1 py-2 rounded-lg border ${
                sex === "male" ? "bg-[#1778FF] text-white" : "border-gray-300 text-gray-600"
              }`}
            >
              남성
            </button>
            <button
              onClick={() => setSex("female")}
              className={`flex-1 py-2 rounded-lg border ${
                sex === "female" ? "bg-[#1778FF] text-white" : "border-gray-300 text-gray-600"
              }`}
            >
              여성
            </button>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2 text-[15px]">
            중증도 (1~5단계)
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setTriageLevel(n)}
                className={`flex-1 py-2 rounded-lg border ${
                  triageLevel === n ? "bg-[#1778FF] text-white" : "border-gray-300 text-gray-600"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
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
            onClick={() =>
              isFormValid &&
              onNext({
                age: Number(ageValue),
                sex: sex!,
                triageLevel: triageLevel!,
              })
            }
            disabled={!isFormValid}
            className={`flex-[2] w-[258px] h-[44px] rounded-full font-semibold text-[14px] ${
              isFormValid
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-400"
            }`}
          >
            다음 스텝 진행하기
          </button>
        </div>
      </div>
    </motion.div>
  );
}
