"use client";

import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import Step1Severity from "./Severity";
import Step2Information from "./Information";
import Step3Symptoms from "./Symptoms";
import Step4Vitals from "./Vitals";
import * as api from "@/lib/api";
import type { RegisterPatientRequest } from "@/lib/api";

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  /* ------------------------------------
   * ✅ 환자 등록 + 추천 병원 조회 (fallback 포함)
   * ------------------------------------ */
  const handleSubmit = async (vitalsArg?: VitalsPayload) => {
    if (!isMounted) return;

    const usedVitals = vitalsArg ?? vitals;

    if (!info.age || !info.sex || !info.triageLevel || !usedVitals) {
      console.error("⚠️ 입력 불완전:", {
        age: info.age,
        sex: info.sex,
        triageLevel: info.triageLevel,
        vitalsState: vitals,
        vitalsArg,
      });
      alert("입력 정보가 완전하지 않습니다. (콘솔 확인)");
      throw new Error("입력 정보 불완전");
    }

    const payload: RegisterPatientRequest = {
      age: info.age,
      sex: info.sex === "male" ? "M" : "F",
      triageLevel: info.triageLevel,
      sbp: usedVitals.sbp,
      dbp: usedVitals.dbp,
      hr: usedVitals.hr,
      rr: usedVitals.rr,
      spo2: usedVitals.spo2,
      temp: usedVitals.temp,
      symptoms,
    };

    console.log("📦 [전송할 데이터]:", payload);

    try {
      // 1️⃣ 환자 등록 요청
      const response = await api.registerPatient(payload);
      console.log("✅ 환자 등록 성공:", response);
      const recommended = response.data?.recommendedHospitals ?? [];

      console.log("📍 추천 병원 개수:", recommended.length);
      console.table(recommended ?? []);

      // 2️⃣ 추천 병원이 없을 경우 fallback으로 거리 기반 병원 조회
      if (recommended.length === 0) {
        console.warn("⚠️ 추천 병원 없음 → 거리 기반 병원 조회로 대체");

        try {
          const nearbyRes = await api.getNearbyHospitals(10); // 거리 10km 내 검색
          const nearbyHospitals = (nearbyRes.data ?? []).slice(0, 3); // 상위 3개

          console.log("📍 거리 기반 병원 목록:", nearbyHospitals);

          // 동일 구조로 변환
          return nearbyHospitals.map((h: any, index: number) => ({
            hospitalId: h.externalId ?? String(h.id),
            hospitalName: h.name,
            aiScore: h.hospitalCapacity ?? 0,
            priority: index + 1,
            aiExplanations: {},
            distance: h.distance,
            eta: h.eta,
          }));
        } catch (fallbackError) {
          console.error("❌ 거리 기반 병원 조회 실패:", fallbackError);
          alert("추천 병원 조회 중 오류가 발생했습니다.");
          return [];
        }
      }

      // 3️⃣ 추천 병원이 있을 경우 그대로 반환
      return recommended;
    } catch (error: any) {
      console.error("❌ 등록 실패:", error.response?.data || error.message);
      alert("환자 등록 중 오류가 발생했습니다.");
      throw error;
    }
  };

  if (!isMounted) return null;

  /* ------------------------------------
   * JSX 렌더링
   * ------------------------------------ */
  return (
    <main className="w-full max-w-[393px] mx-auto min-h-dvh bg-[#F7F7F7] flex flex-col">
      <Header variant="sub" title="새 환자 등록" />

      {/* 진행 단계 표시 */}
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

      {/* 단계별 컴포넌트 */}
      <div className="flex-1 overflow-y-auto px-5">
        {step === 1 && (
          <Step1Severity
            onNext={nextStep}
            onSelect={(value) => {
              setSeverity(value);
              setInfo((prev) => ({
                ...prev,
                triageLevel:
                  value === "critical"
                    ? 1
                    : value === "urgent"
                    ? 2
                    : 3,
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
              const payload: VitalsPayload = {
                sbp: vitalsData.sbp,
                dbp: vitalsData.dbp,
                hr: vitalsData.hr,
                rr: vitalsData.rr,
                spo2: vitalsData.spo2,
                temp: vitalsData.temp,
              };
              setVitals(payload);

              // ✅ 바로 handleSubmit 전달
              return handleSubmit(payload);
            }}
            severity={severity || "긴급"}
            symptoms={symptoms}
          />
        )}
      </div>
    </main>
  );
}
