"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Step2SymptomsProps {
  onNext: () => void;
  onPrev: () => void;
}

const SYMPTOMS = [
  { id: "chest-pain", label: "흉통" },
  { id: "breathing", label: "호흡곤란" },
  { id: "injury", label: "외상" },
  { id: "bleeding", label: "뇌출혈" },
  { id: "convulsion", label: "경련" },
  { id: "unconscious", label: "의식저하" },
  { id: "bleeding-2", label: "출혈" },
  { id: "burn", label: "화상" },
  { id: "poisoning", label: "중독" },
];

export default function Step2Symptoms({ onNext, onPrev }: Step2SymptomsProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const removeSymptom = (id: string) => {
    setSelectedSymptoms((prev) => prev.filter((s) => s !== id));
  };

  // 검색 필터링
  const filteredSymptoms = SYMPTOMS.filter((symptom) =>
    symptom.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          alt="증상 선택"
          width={100}
          height={100}
          className="object-contain"
        />
      </div>

      {/* 제목 */}
      <h2 className="text-[22px] font-bold text-gray-900 mb-2 text-center">
        환자의 주요 증상을 선택해주세요
      </h2>

      {/* 설명 */}
      <p className="text-[#9E9E9E] text-[14px] mb-6 text-center">
        해당되는 증상을 모두 선택해주세요.
      </p>

      {/* 검색창 */}
      <div className="relative mb-6">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19 19L14.65 14.65"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="찾으시는 증상을 검색해주세요."
          className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-10 py-3 text-[14px] placeholder:text-gray-400 focus:outline-none focus:border-[#1778FF] transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* 선택된 증상 칩들 */}
      {selectedSymptoms.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedSymptoms.map((id) => {
            const symptom = SYMPTOMS.find((s) => s.id === id);
            return (
              <div
                key={id}
                className="flex items-center gap-2 bg-[#1778FF] text-white px-4 py-2 rounded-full text-[14px] font-medium"
              >
                <span>{symptom?.label}</span>
                <button
                  onClick={() => removeSymptom(id)}
                  className="hover:opacity-70 transition-opacity"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4L4 12M4 4L12 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* 증상 그리드 */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {filteredSymptoms.map((symptom) => (
          <button
            key={symptom.id}
            onClick={() => toggleSymptom(symptom.id)}
            className={`flex flex-col items-center justify-center bg-white rounded-2xl p-4 transition-all h-[110px] ${
              selectedSymptoms.includes(symptom.id)
                ? "border-2 border-[#1778FF]"
                : "border border-gray-200 hover:border-gray-300"
            }`}
          >
            {/* 아이콘 */}
            <div className="w-12 h-12 mb-2 flex items-center justify-center">
              <Image
                src="/symptoms-vector.png"
                alt={symptom.label}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>

            {/* 라벨 */}
            <span className="text-[14px] font-medium text-gray-900">
              {symptom.label}
            </span>
          </button>
        ))}
      </div>

      {/* 검색 결과 없음 메시지 */}
      {filteredSymptoms.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-[14px] mb-8">
          검색 결과가 없습니다.
        </div>
      )}

      {/* 하단 버튼들 */}
      <div className="flex gap-3 w-full">
        <button
          onClick={onPrev}
          className="flex-[0.8] py-4 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-[15px] hover:bg-gray-50 transition-all"
        >
          이전
        </button>
        <button
          onClick={selectedSymptoms.length > 0 ? onNext : undefined}
          disabled={selectedSymptoms.length === 0}
          className={`flex-[2] py-4 rounded-xl font-semibold text-[15px] transition-all ${
            selectedSymptoms.length > 0
              ? "bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          다음 단계 진행하기
        </button>
      </div>
    </motion.div>
  );
}
