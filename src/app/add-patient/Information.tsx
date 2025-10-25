"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Step2InformationProps {
  onNext: () => void;
  onPrev: () => void;
}

export default function Step2Information({ onNext, onPrev }: Step2InformationProps) {
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"male" | "female" | null>(null);
  const [triageLevel, setTriageLevel] = useState<number | null>(null);

  const isFormValid = age && sex && triageLevel;

  const TRIAGE_LEVELS = [
    { level: 5, label: "경증" },
    { level: 4, label: "준응급" },
    { level: 3, label: "잠재적 위급" },
    { level: 2, label: "중증" },
    { level: 1, label: "최중증" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center pb-28"
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
      <h2 className="text-[18px] font-semibold text-gray-900 mb-1 text-center">
        환자의 정보를 입력해주세요
      </h2>
      
      {/* 설명 */}
      <p className="text-[#A3A3A3] font-regular text-[14px] mb-10 text-center">
        환자의 나이, 성별, Triage Level을 입력해주세요.
      </p>

      {/* 환자 나이 */}
      <div className="w-full mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-[15px] font-semibold text-gray-900">
            환자 나이 (Age)
          </label>
          <button className="px-3 py-1 rounded-full bg-gray-900 text-white text-[12px] font-medium">
            개월
          </button>
        </div>
        <input
          type="number"
          placeholder="예) 43"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[15px] placeholder:text-gray-300 focus:outline-none focus:border-[#1778FF]"
        />
      </div>

      {/* 성별 */}
      <div className="w-full mb-6">
        <label className="text-[15px] font-semibold text-gray-900 mb-3 block">
          성별 (Sex)
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => setSex("male")}
            className={`flex-1 py-3 rounded-xl font-medium text-[15px] transition-all flex items-center justify-center gap-2 ${
              sex === "male"
                ? "bg-[#1778FF] text-white"
                : "bg-white border border-gray-200 text-gray-600"
            }`}
          >
            <span className="text-[20px]">♂</span>
            <span>남성 Male</span>
          </button>
          <button
            onClick={() => setSex("female")}
            className={`flex-1 py-3 rounded-xl font-medium text-[15px] transition-all flex items-center justify-center gap-2 ${
              sex === "female"
                ? "bg-[#FF9AB5] text-white"
                : "bg-white border border-gray-200 text-gray-600"
            }`}
          >
            <span className="text-[20px]">♀</span>
            <span>여성 Female</span>
          </button>
        </div>
      </div>

      {/* Triage Level */}
      <div className="w-full mb-8">
        <label className="text-[15px] font-semibold text-gray-900 mb-3 block">
          Triage Level
        </label>
        <div className="flex gap-2">
          {TRIAGE_LEVELS.map((item) => (
            <button
              key={item.level}
              onClick={() => setTriageLevel(item.level)}
              className={`flex-1 py-4 rounded-xl transition-all flex flex-col items-center justify-center ${
                triageLevel === item.level
                  ? "bg-gray-200 border-2 border-gray-400"
                  : "bg-white border border-gray-200"
              }`}
            >
              <span className="text-[18px] font-bold text-gray-600 mb-1">
                {item.level}
              </span>
              <span className="text-[11px] text-gray-500">{item.label}</span>
            </button>
          ))}
        </div>
      </div>


      {/* 하단 버튼들 */}
      <div className="flex gap-3 w-full">
        <button className="flex-[0.8] w-[85px] h-[44px] rounded-full border-2 border-gray-200 text-gray-400 font-semibold text-[14px] hover:bg-gray-50 transition-all">
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
