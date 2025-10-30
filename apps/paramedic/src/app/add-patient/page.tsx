"use client";

import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import Step1Severity from "./Severity";
import Step2Information from "./Information";
import Step3Symptoms from "./Symptoms";
import Step4Vitals from "./Vitals";
import HospitalRecommendationModal from "./components/HospitalRecommendationModal";
import * as api from "@/lib/api";
import type { RegisterPatientRequest } from "@/lib/api";

interface PatientInfo {
  age?: number;
  sex?: "male" | "female";
  triageLevel?: number;
}

export default function AddPatientPage() {
  const [step, setStep] = useState(1);
  const [severity, setSeverity] = useState<string | null>(null);
  const [info, setInfo] = useState<PatientInfo>({});
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [vitals, setVitals] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  const [recommendedHospitals, setRecommendedHospitals] = useState<any[]>([]);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (vitalsArg: any) => {
    try {
      const payload: RegisterPatientRequest = {
        age: info.age!,
        sex: info.sex === "male" ? "M" : "F",
        triageLevel: info.triageLevel!,
        sbp: vitalsArg.sbp,
        dbp: vitalsArg.dbp,
        hr: vitalsArg.hr,
        rr: vitalsArg.rr,
        spo2: vitalsArg.spo2,
        temp: vitalsArg.temp,
        symptoms,
      };

      const response = await api.registerPatient(payload);
      const recommended =
        response.data?.data?.recommendedHospitals ??
        response.data?.recommendedHospitals ??
        [];

      setRecommendedHospitals(recommended);
      setShowRecommendationModal(true);
    } catch (error) {
      console.error("❌ 등록 실패:", error);
      alert("환자 등록 중 오류 발생");
    }
  };

  if (!isMounted) return null;

  return (
    <>
      <main className="w-full max-w-[393px] mx-auto min-h-dvh bg-[#F7F7F7] flex flex-col">
        <Header variant="sub" title="새 환자 등록" />

        <div className="bg-[#F7F7F7] px-5 py-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-[13px] font-semibold text-gray-900">
              {step}/4단계
            </span>
            <span className="text-gray-400 text-[13px]">|</span>
            <span className="text-[13px] font-medium text-gray-600">
              {["중증도 선택", "환자 정보 입력", "증상 선택", "활력징후 입력"][step - 1]}
            </span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className={`flex-1 h-2 rounded-full ${
                  n <= step ? "bg-[#1778FF]" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {step === 1 && (
            <Step1Severity
              onNext={nextStep}
              onSelect={(value) => {
                setSeverity(value);
                setInfo((prev) => ({
                  ...prev,
                  triageLevel:
                    value === "critical" ? 1 : value === "urgent" ? 2 : 3,
                }));
              }}
            />
          )}
          {step === 2 && (
            <Step2Information
              onNext={(formData) => {
                setInfo((prev) => ({ ...prev, ...formData }));
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
              onSubmit={async (vitalsData) => {
                setVitals(vitalsData);
                await handleSubmit(vitalsData);
              }}
              severity={severity || "긴급"}
              symptoms={symptoms}
            />
          )}
        </div>
      </main>

      {/* ✅ 추천 병원 모달 */}
      <HospitalRecommendationModal
        isOpen={showRecommendationModal}
        onClose={() => setShowRecommendationModal(false)}
        aiHospitals={recommendedHospitals}
      />
    </>
  );
}
