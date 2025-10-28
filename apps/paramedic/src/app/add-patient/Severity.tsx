"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Step1SeverityProps {
  onNext: () => void;
  onSelect: (value: string) => void;
}

const SEVERITIES = [
  { id: "normal", label: "일반", desc: "안정된 상태의 환자\n일반적인 이송 필요", icon: "/severity-vector1.png", color: "#27A959" },
  { id: "urgent", label: "긴급", desc: "신속한 조치가 필요\n빠른 이송 필요", icon: "/severity-vector2.png", color: "#FFB020" },
  { id: "critical", label: "위급", desc: "생명을 위협할 즉시\n조치가 필요한 환자", icon: "/severity-vector3.png", color: "#FF4545" },
];

export default function Step1Severity({ onNext, onSelect }: Step1SeverityProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center pb-[76px]"
      >
        <div className="mb-4 mt-8">
          <Image src="/lotties/severity-middle.png" alt="중증도 선택" width={120} height={120} />
        </div>

        <h2 className="text-[18px] font-semibold text-gray-900 mb-1 text-center">
          환자의 중증도를 선택해주세요
        </h2>
        <p className="text-[#A3A3A3] text-[14px] mb-10 text-center">
          환자 상태를 기준으로 적절한 중증도를 선택해주세요
        </p>

        <div className="flex gap-3 mb-8 w-full justify-center">
          {SEVERITIES.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedSeverity(item.id);
                onSelect(item.id);
              }}
              className={`flex flex-col items-center justify-center bg-white rounded-2xl p-2 transition-all w-[112.33px] h-[164px] ${
                selectedSeverity === item.id
                  ? "border-2 border-[#1778FF]"
                  : "border border-white hover:border-gray-300"
              }`}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <Image src={item.icon} alt={item.label} width={28} height={28} />
              </div>
              <h3 className="font-semibold text-[15px] text-gray-900 mb-2">
                {item.label}
              </h3>
              <p className="text-[12px] font-light text-[#9E9E9E] text-center leading-tight whitespace-pre-line">
                {item.desc}
              </p>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[393px] mx-auto bg-[#f7f7f7] border-t border-gray-100 px-5 py-4">
        <div className="flex gap-3 w-full">
          <button className="flex-[0.8] h-11 rounded-full border-2 border-gray-200 text-gray-400 font-semibold text-[14px]">
            이전
          </button>
          <button
            onClick={selectedSeverity ? onNext : undefined}
            disabled={!selectedSeverity}
            className={`flex-2 h-11 rounded-full font-semibold text-[14px] ${
              selectedSeverity
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            다음 스텝 진행하기
          </button>
        </div>
      </div>
    </>
  );
}
