"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import Step1Severity from "./Severity";
import Step2Information from "./Information";
import Step3Symptoms from "./Symptoms";
import Step4Vitals from "./Vitals";
import axios from "axios";

interface PatientInfo {
  age?: number;
  sex?: "male" | "female";
  triageLevel?: number;
}

export interface VitalsPayload {
  sbp: number;
  dbp: number;
  hr: number;
  rr: number;
  spo2: number;
  temp: number;
}

const STEPS = [
  { number: 1, label: "중증도 선택" },
  { number: 2, label: "환자 정보 입력" },
  { number: 3, label: "증상 선택" },
  { number: 4, label: "환자 입력 정보" },
];

export default function AddPatientPage() {
  const [step, setStep] = useState(1);
  const [severity, setSeverity] = useState<string | null>(null);
  const [info, setInfo] = useState<PatientInfo>({});
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [vitals, setVitals] = useState<VitalsPayload | null>(null);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // ✅ 실제 API 요청 함수
  const handleSubmit = async () => {
    if (!info.age || !info.sex || !info.triageLevel || !vitals) {
      alert("입력 정보가 완전하지 않습니다.");
      return;
    }

    const token = localStorage.getItem("authToken");

    const payload = {
      age: info.age,
      sex: info.sex === "male" ? "M" : "F",
      triageLevel: info.triageLevel,
      sbp: vitals.sbp,
      dbp: vitals.dbp,
      hr: vitals.hr,
      rr: vitals.rr,
      spo2: vitals.spo2,
      temp: vitals.temp,
      symptoms,
    };

    console.log("📦 전송할 데이터:", payload);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/patients/register",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ 환자 등록 성공:", response.data);
      alert("환자 정보가 등록되었습니다.\n추천 병원 결과를 콘솔에서 확인하세요.");

      // ✅ 추천 병원 결과 콘솔 출력
      console.table(response.data.data.recommendedHospitals);
    } catch (error: any) {
      console.error("❌ 등록 실패:", error.response?.data || error.message);
      alert("환자 정보 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <main className="w-full max-w-[393px] mx-auto min-h-[100dvh] bg-[#F7F7F7] flex flex-col">
      <Header variant="sub" title="새 환자 등록" />

      {/* 단계 표시 */}
      <div className="bg-[#F7F7F7] px-5 py-4">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-[13px] font-semibold text-gray-900">
            {step}/4단계
          </span>
          <span className="text-gray-400 text-[13px]">|</span>
          <span className="text-[13px] font-medium text-gray-600">
            {STEPS[step - 1].label}
          </span>
        </div>
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

      {/* 단계별 화면 */}
      <div className="flex-1 overflow-y-auto px-5">
        {step === 1 && (
          <Step1Severity
            onNext={nextStep}
            onSelect={(value) => setSeverity(value)}
          />
        )}

        {step === 2 && (
          <Step2Information
            onNext={(formData) => {
              setInfo(formData);
              nextStep();
            }}
            onPrev={prevStep}
          />
        )}

        {step === 3 && (
          <Step3Symptoms
            onNext={(selected) => {
              setSymptoms(selected);
              nextStep();
            }}
            onPrev={prevStep}
          />
        )}

        {step === 4 && (
          <Step4Vitals
            onPrev={prevStep}
            onSubmit={(vitalsData) => {
              const payload: VitalsPayload = {
                sbp: vitalsData.sbp,
                dbp: vitalsData.dbp,
                hr: vitalsData.hr,
                rr: vitalsData.rr,
                spo2: vitalsData.spo2,
                temp: vitalsData.temp,
              };
              setVitals(payload);
              handleSubmit();
            }}
          />
        )}
      </div>
    </main>
  );
}