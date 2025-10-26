"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Step2InformationProps {
  onNext: () => void;
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
      if (numValue < 0 || numValue > 120) {
        setAgeError("나이는 0~120세 범위로 입력해주세요.");
      } else {
        setAgeError("");
      }
    } else {
      if (numValue < 0 || numValue > 36) {
        setAgeError("개월은 0~36개월까지 입력해주세요.");
      } else {
        setAgeError("");
      }
    }
  };

  const handleAgeChange = (value: string) => {
    setAgeValue(value);
    validateAge(value, ageUnit);
  };

  const handleUnitChange = (unit: "year" | "month") => {
    setAgeUnit(unit);
    if (ageValue) {
      validateAge(ageValue, unit);
    }
  };

  const isFormValid = ageValue && sex && triageLevel && !ageError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center pb-4"
    >
      {/* 중앙 이미지 */}
      <div className="mb-4 mt-8">
        <Image
          src="/lotties/severity-middle.png"
          alt="환자 정보"
          width={120}
          height={120}
          className="object-contain"
        />
      </div>

      {/* 제목 */}
      <h2 className="text-[18px] font-semibold text-gray-900 text-center">
        환자의 정보를 입력해주세요
      </h2>
      
      {/* 설명 */}
      <p className="text-[#A3A3A3] font-regular text-[14px] mb-10 text-center">
        환자의 나이, 성별, Triage Level을 입력해주세요.
      </p>

      {/* 환자 나이 */}
      <div className="w-full mb-3">
        <div className="flex items-center justify-between mb-3">
          <label className="text-[16px] font-semibold text-gray-900">
            환자 나이 <span className="text-[13px] font-light text-gray-400" >(Age)</span>
          </label>

          {/* 🔘 년 / 개월 토글 스위치 */}
          <div className="relative flex w-[107px] h-[28px] bg-white border border-gray-300 rounded-full p-1">
            {/* 배경 이동 애니메이션 */}
            <div
              className={`absolute top-[2px] bottom-[2px] w-[50%] bg-[#131313] rounded-full transition-all duration-300 ${
                ageUnit === "year" ? "left-[2px]" : "left-[calc(50%-2px)]"
              }`}
            ></div>

            {/* 텍스트 */}
            <button
              onClick={() => handleUnitChange("year")}
              className={`z-10 flex-1 text-[12px] font-medium transition-all ${
                ageUnit === "year" ? "text-white" : "text-gray-500"
              }`}
            >
              년
            </button>
            <button
              onClick={() => handleUnitChange("month")}
              className={`z-10 flex-1 text-[12px] font-medium transition-all ${
                ageUnit === "month" ? "text-white" : "text-gray-500"
              }`}
            >
              개월
            </button>
          </div>
        </div>

        {/* 🧾 나이 입력창 */}
        <div className="relative flex items-center">
          <input
            type="number"
            placeholder={ageUnit === "year" ? "예) 43" : "예) 24"}
            value={ageValue}
            onChange={(e) => handleAgeChange(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border bg-white text-[15px] placeholder:text-gray-300 focus:outline-none ${
              ageError
                ? "border-red-500 focus:border-red-500"
                : "border-gray-200 focus:border-[#1778FF]"
            }`}
          />

          {/* 🔹 단위 (밖에 표시) */}
          <span className="ml-2 text-gray-400 text-[14px] whitespace-nowrap translate-y-[12.5px]">
            {ageUnit === "year" ? "세" : "개월"}
          </span>
        </div>

        {ageError && (
          <div className="flex items-center gap-1 mt-2 text-red-500 text-[13px]">
            <svg
              width="13"
              height="13"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M8 4V8.5M8 11V11.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span>{ageError}</span>
          </div>
        )}
      </div>


      {/* 성별 */}
      <div className="w-full mb-3">
        <label className="text-[16px] font-semibold text-gray-900 mb-3 block">
          성별 <span className="text-[13px] font-light text-gray-400">(Sex)</span>
        </label>

        <div className="flex gap-3">
          {/* ♂ 남성 */}
          <button
            onClick={() => setSex("male")}
            className={`w-[172.5px] h-[44px] rounded-xl flex items-center justify-center gap-2 font-regular text-[14px] transition-all border ${
              sex === "male"
                ? "bg-[#1778FF] text-white border-[#1778FF]"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            <Image
              src={
                sex === "male"
                  ? "/male-outline.png" 
                  : "/male-filled.png"  
              }
              alt="male-icon"
              width={24}   
              height={24}  // ✅ 필수
              className="w-5 h-5"
            />
            <span>남성 Male</span>
          </button>

          {/* ♀ 여성 */}
          <button
            onClick={() => setSex("female")}
            className={`w-[172.5px] h-[44px] rounded-xl flex items-center justify-center gap-2 font-regular text-[14px] transition-all border ${
              sex === "female"
                ? "bg-[#FF5374] text-white border-[#FF5374]"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            <Image
              src={
                sex === "female"
                  ? "/female-outline.png" 
                  : "/female-filled.png"  
              }
              alt="female-icon"
              width={24}   
              height={24} 
              className="w-5 h-5"
            />
            <span>여성 Female</span>
          </button>
        </div>
      </div>


      {/* Triage Level */}
      <div className="w-full mb-8">
        <label className="text-[16px] font-semibold text-gray-900 mb-3 block">
          Triage Level
        </label>
        <div className="flex gap-2 justify-between">
          {[
            { level: 5, label: "경증", color: "#27A959" },
            { level: 4, label: "준응급", color: "#1778FF" },
            { level: 3, label: "잠재적 위급", color: "#975BFF" },
            { level: 2, label: "중증", color: "#D9801A" },
            { level: 1, label: "최중증", color: "#CF0E0E" },
          ].map((item) => (
            <button
              key={item.level}
              onClick={() => setTriageLevel(item.level)}
              className={`w-[64px] h-[100px] rounded-xl flex flex-col items-center justify-center transition-all border-2 ${
                triageLevel === item.level
                  ? "bg-white"
                  : "bg-white border-gray-200 opacity-70 hover:opacity-100"
              }`}
              style={{
                borderColor:
                  triageLevel === item.level ? item.color : "#E5E7EB",
              }}
            >
              {/* 숫자 동그라미 */}
              <div
                className="w-[24px] h-[24px] rounded-full flex items-center justify-center mb-2 transition-all"
                style={{
                  backgroundColor:
                    triageLevel === item.level ? item.color : "#9E9E9E",
                }}
              >
                <span className="text-[12px] font-regular text-white">
                  {item.level}
                </span>
              </div>

              {/* 라벨 */}
              <span
                className={`text-[12px] transition-all ${
                  triageLevel === item.level ? "font-medium" : "text-gray-500"
                }`}
                style={{
                  color: triageLevel === item.level ? item.color : "#9E9E9E",
                }}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>


      {/* 하단 버튼들 */}
      <div className="flex gap-3 w-full">
        <button
          onClick={onPrev}
          className="flex-[0.8] w-[85px] h-[44px] rounded-full border-2 border-gray-200 text-gray-400 font-semibold text-[14px] hover:bg-gray-50 transition-all"
        >
          이전
        </button>
        <button
          onClick={isFormValid ? onNext : undefined}
          disabled={!isFormValid}
          className={`flex-[2] w-[258px] h-[44px] rounded-full font-semibold text-[14px] transition-all ${
            isFormValid
              ? "bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          다음 스텝 진행하기
        </button>
      </div>
    </motion.div>
  );
}