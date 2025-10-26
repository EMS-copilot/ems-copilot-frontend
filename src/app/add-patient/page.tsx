"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import Step1Severity from "./Severity";
import Step2Information from "./Information";
import Step3Symptoms from "./Symptoms";
import Step4Vitals from "./Vitals";

const STEPS = [
  { number: 1, label: "중증도 선택" },
  { number: 2, label: "환자 정보 입력" },
  { number: 3, label: "증상 선택" },
  { number: 4, label: "환자 입력 정보" },
];

export default function AddPatientPage() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <main className="w-full max-w-[393px] mx-auto min-h-[100dvh] bg-[#F7F7F7] flex flex-col">
      <Header variant="sub" title="새 환자 등록" />

      {/* 진행 바 섹션 */}
      <div className="bg-[#F7F7F7] px-5 py-4">
        {/* 단계 텍스트 */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-[13px] font-semibold text-gray-900">
            {step}/4단계
          </span>
          <span className="text-gray-400 text-[13px]">|</span>
          <span className="text-[13px] font-medium text-gray-600">
            {STEPS[step - 1].label}
          </span>
        </div>

        {/* 진행 바들 */}
        <div className="flex gap-2">
          {STEPS.map((s) => (
            <div
              key={s.number}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                s.number <= step ? "bg-[#1778FF]" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 스크롤 가능한 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto px-5">
        {/* 단계별 콘텐츠 */}
        {step === 1 && <Step1Severity onNext={nextStep} />}
        {step === 2 && <Step2Information onNext={nextStep} onPrev={prevStep} />}
        {step === 3 && <Step3Symptoms onNext={nextStep} onPrev={prevStep} />}
        {step === 4 && <Step4Vitals onPrev={prevStep} />}
      </div>
    </main>
  );
}