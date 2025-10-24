"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Step1SeverityProps {
  onNext: () => void;
}

const SEVERITIES = [
  {
    id: "normal",
    label: "일반",
    desc: "안정된 상태의 환자\n일반적인 이송 필요",
    icon: "/severity-vector1.png",
    color: "#27A959",
  },
  {
    id: "urgent",
    label: "긴급",
    desc: "신속한 자치가 필요\n빠른 이송 필요",
    icon: "/severity-vector2.png",
    color: "#FFB020",
  },
  {
    id: "critical",
    label: "위급",
    desc: "생명을 위협할 즉시\n자치가 필요한 환자",
    icon: "/severity-vector3.png",
    color: "#FF4545",
  },
];

export default function Step1Severity({ onNext }: Step1SeverityProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center"
    >
      {/* 중앙 이미지 */}
      <div className="mb-10 mt-8">
        <Image
          src="/lotties/severity-middle.png"
          alt="중증도 선택"
          width={120}
          height={120}
          className="object-contain"
        />
      </div>

      {/* 제목 */}
      <h2 className="text-[22px] font-bold text-gray-900 mb-3 text-center">
        환자의 중증도를 선택해주세요
      </h2>
      
      {/* 설명 */}
      <p className="text-[#9E9E9E] text-[14px] mb-10 text-center">
        환자 상태를 기준으로 적절한 중증도를 선택해주세요
      </p>

      {/* 중증도 카드들 */}
      <div className="flex gap-3 mb-12 w-full justify-center">
        {SEVERITIES.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedSeverity(item.id)}
            className={`flex flex-col items-center justify-center bg-white rounded-2xl p-5 shadow-sm transition-all w-[100px] h-[140px] ${
              selectedSeverity === item.id
                ? "border-2 border-[#1778FF]"
                : "border border-gray-100 hover:border-gray-300"
            }`}
          >
            {/* 아이콘 배경 */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: `${item.color}15` }}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={28}
                height={28}
                className="object-contain"
              />
            </div>

            {/* 라벨 */}
            <h3 className="font-semibold text-[15px] text-gray-900 mb-1">
              {item.label}
            </h3>

            {/* 설명 */}
            <p className="text-[11px] text-[#9E9E9E] text-center leading-tight whitespace-pre-line">
              {item.desc}
            </p>
          </button>
        ))}
      </div>

      {/* 음성인식 AI 버튼 */}
      <button className="flex items-center gap-2 bg-[#1778FF] text-white px-6 py-3 rounded-full shadow-md hover:bg-[#0D66E8] transition-all mb-8">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 15C13.66 15 15 13.66 15 12V6C15 4.34 13.66 3 12 3C10.34 3 9 4.34 9 6V12C9 13.66 10.34 15 12 15Z"
            fill="currentColor"
          />
          <path
            d="M17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12H5C5 15.53 7.61 18.43 11 18.92V22H13V18.92C16.39 18.43 19 15.53 19 12H17Z"
            fill="currentColor"
          />
        </svg>
        <span className="font-semibold text-[15px]">음성인식 AI</span>
      </button>

      {/* 하단 버튼들 */}
      <div className="flex gap-3 w-full">
        <button className="flex-[0.8] py-4 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-[15px] hover:bg-gray-50 transition-all">
          이전
        </button>
        <button
          onClick={selectedSeverity ? onNext : undefined}
          disabled={!selectedSeverity}
          className={`flex-[2] py-4 rounded-xl font-semibold text-[15px] transition-all ${
            selectedSeverity
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
