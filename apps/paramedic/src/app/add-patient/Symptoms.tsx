"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Step3SymptomsProps {
  onNext: (selected: string[]) => void;
  onPrev: () => void;
}

const SYMPTOMS = [
  { id: "abdominal-pain", label: "복통" },
  { id: "unconscious", label: "의식저하" },
  { id: "fever", label: "발열" },
  { id: "bleeding", label: "출혈" },
  { id: "headache", label: "두통" },
  { id: "breathing", label: "호흡곤란" },
  { id: "injury", label: "외상" },
  { id: "chest-pain", label: "흉통" },
  { id: "stroke", label: "뇌졸중" },
];


export default function Step3Symptoms({ onNext, onPrev }: Step3SymptomsProps) {
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

  const filteredSymptoms = SYMPTOMS.filter((symptom) =>
    symptom.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* 메인 콘텐츠 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col pb-[92px]"
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
        <h2 className="text-[18px] font-semibold text-gray-900 mb-1 text-center">
          환자의 주요 증상을 선택해주세요
        </h2>

        {/* 설명 */}
        <p className="text-[#A3A3A3] font-regular text-[14px] mb-10 text-center">
          여러 증상을 함께 선택할 수 있습니다.
        </p>

        {/* 검색창 */}
        <div className="relative w-[353px] h-11 mb-6 mx-auto">
          {/* 검색 아이콘 */}
          <div className="absolute left-4 top-[calc(50%+2px)] -translate-y-1/2">
            <Image
              src="/search.png"
              alt="검색 아이콘"
              width={16}
              height={16}
              className="opacity-60"
            />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="찾으시는 증상을 검색해주세요."
            className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-10 py-3 text-[14px] placeholder:text-gray-400 focus:outline-none focus:border-[#1778FF] transition-colors"
          />

          {/* 검색어 초기화 버튼 */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-[calc(50%+2px)] -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

        {/* 선택된 증상 칩 */}
        {selectedSymptoms.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {selectedSymptoms.map((id) => {
              const symptom = SYMPTOMS.find((s) => s.id === id);
              return (
                <div
                  key={id}
                  className="relative flex h-[33px] items-center justify-center bg-[#1778FF] text-white px-6 py-3 rounded-full text-[14px] font-medium"
                >
                  <span>{symptom?.label}</span>
                  <button
                    onClick={() => removeSymptom(id)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-gray-400 flex items-center justify-center hover:opacity-80 transition-opacity"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 4L4 12M4 4L12 12"
                        stroke="#444"
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

        {/* 증상 선택 버튼들 */}
        <div className="grid grid-cols-3 gap-2">
          {filteredSymptoms.map((symptom) => (
            <button
              key={symptom.id}
              onClick={() => toggleSymptom(symptom.id)}
              className={`flex flex-col w-[112.33px] h-[88px] items-center justify-center bg-white rounded-2xl p-4 transition-all ${
                selectedSymptoms.includes(symptom.id)
                  ? "border-2 border-[#1778FF]"
                  : "border border-white hover:border-gray-300"
              }`}
            >
              <div className="w-12 h-12 mb-2 flex items-center justify-center">
                <Image
                  src="/symptoms-vector.png"
                  alt={symptom.label}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-[14px] font-medium text-gray-900">
                {symptom.label}
              </span>
            </button>
          ))}
        </div>

        {/* 검색 결과 없음 */}
        {filteredSymptoms.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-[14px]">
            검색 결과가 없습니다.
          </div>
        )}
      </motion.div>

      {/* 하단 버튼 */}
      <div className="flex gap-3 w-full py-4">
        <button
          onClick={onPrev}
          className="flex-[0.8] w-[85px] h-11 rounded-full border-2 border-gray-200 text-gray-400 font-semibold text-[14px] hover:bg-gray-50 transition-all"
        >
          이전
        </button>
        <button
          onClick={() => selectedSymptoms.length > 0 && onNext(selectedSymptoms)}
          disabled={selectedSymptoms.length === 0}
          className={`flex-2 w-[258px] h-11 rounded-full font-semibold text-[14px] transition-all ${
            selectedSymptoms.length > 0
              ? "bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          다음 스텝 진행하기
        </button>
      </div>
    </>
  );
}
