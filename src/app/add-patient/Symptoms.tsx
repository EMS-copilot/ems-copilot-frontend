"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Step3SymptomsProps {
  onNext: (selected: string[]) => void;
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

export default function Step3Symptoms({ onNext, onPrev }: Step3SymptomsProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const filteredSymptoms = SYMPTOMS.filter((symptom) =>
    symptom.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center pb-[76px]"
    >
      <div className="mt-10 mb-8 text-center">
        <Image src="/lotties/symptoms.png" alt="증상 선택" width={120} height={120} />
        <h2 className="text-[18px] font-semibold text-gray-900 mt-4 mb-2">
          환자의 주요 증상을 선택해주세요
        </h2>
        <p className="text-[#A3A3A3] text-[14px]">
          여러 증상을 함께 선택할 수 있습니다.
        </p>
      </div>

      {/* 검색창 */}
      <div className="w-full mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="증상 검색"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-[14px]"
        />
      </div>

      {/* 증상 리스트 */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {filteredSymptoms.map((symptom) => (
          <button
            key={symptom.id}
            onClick={() => toggleSymptom(symptom.id)}
            className={`py-3 rounded-lg border text-[14px] font-medium transition-all ${
              selectedSymptoms.includes(symptom.id)
                ? "bg-[#1778FF] text-white border-[#1778FF]"
                : "border-gray-300 text-gray-700"
            }`}
          >
            {symptom.label}
          </button>
        ))}
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[393px] mx-auto bg-[#f7f7f7] border-t border-gray-100 px-5 py-4">
        <div className="flex gap-3 w-full">
          <button
            onClick={onPrev}
            className="flex-[0.8] w-[85px] h-[44px] rounded-full border-2 border-gray-200 text-gray-400 font-semibold text-[14px]"
          >
            이전
          </button>
          <button
            onClick={() => selectedSymptoms.length > 0 && onNext(selectedSymptoms)}
            disabled={selectedSymptoms.length === 0}
            className={`flex-[2] w-[258px] h-[44px] rounded-full font-semibold text-[14px] ${
              selectedSymptoms.length > 0
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
