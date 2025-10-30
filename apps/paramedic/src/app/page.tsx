"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import HomeStats from "@/app/home/HomeStats";
import NearbyHospitalsMap from "@/app/home/NearbyHospitalsMap";
import OngoingCases from "@/app/home/OngoingCases";
import CompletedCases from "@/app/home/CompletedCases";
import FloatingButton from "@/components/common/FloatingButton";
import OngoingRequestModal from "@/components/common/OngoingRequestModal";
import HospitalConfirmModal from "@/components/common/HospitalConfirmModal";
import RequestDeclineModal from "./add-patient/components/RequestDeclineModal";
import HospitalRecommendationModal from "./add-patient/components/HospitalRecommendationModal";

export default function HomePage() {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 단계 상태
  const [step, setStep] = useState<
    "idle" | "declined" | "loading" | "list" | "confirm"
  >("idle");

  const [aiHospitals, setAiHospitals] = useState<any[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // ✅ 인증 체크
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }
    setIsAuthenticated(true);
    setIsLoading(false);
  }, [router]);

  // ✅ “요청 전송 후 홈으로 왔을 때 진행중 모달 자동 오픈”
  useEffect(() => {
    const flag = localStorage.getItem("ems:showOngoing");
    if (flag === "1") {
      localStorage.removeItem("ems:showOngoing");
      setStep("confirm"); // 진행중 모달 열기
    }
  }, []);

  // 테스트용 병원 데이터
  useEffect(() => {
    setAiHospitals([
      {
        hospitalId: "1",
        hospitalName: "중복대학교 병원",
        aiScore: 97,
        priority: 1,
        aiExplanations: {},
        distance: 2.3,
        eta: 7,
      },
      {
        hospitalId: "2",
        hospitalName: "강남세브란스병원",
        aiScore: 91,
        priority: 2,
        aiExplanations: {},
        distance: 3.8,
        eta: 11,
      },
    ]);
  }, []);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="w-full max-w-[393px] mx-auto min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 진행 중 병원 리스트 예시
  const ongoingHospitals = [
    {
      name: "중복대학교 병원",
      type: "서울특별시",
      badgeColor: "green" as const,
      badgeText: "여유",
    },
    {
      name: "강남세브란스병원",
      type: "서울특별시",
      badgeColor: "purple" as const,
      badgeText: "보통",
    },
  ];

  const selectedHospital = {
    name: "중복대학교 병원",
    type: "서울특별시",
    badgeColor: "green" as const,
    badgeText: "여유",
  };

  return (
    <>
      {/* ===================== 메인 홈 화면 ===================== */}
      <main className="w-full max-w-[393px] mx-auto bg-[#F7F7F7] min-h-screen relative overflow-y-auto">
        {/* 고정 헤더 */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] z-50">
          <Header variant="home" />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="pt-[76px] px-4 space-y-6 pb-[230px] relative z-20">
          <HomeStats />
          <NearbyHospitalsMap />

          {/* ✅ OngoingCases는 항상 표시 */}
          <OngoingCases />

          <CompletedCases />
        </div>

        <FloatingButton />
      </main>

      {/* ===================== 모달 섹션 ===================== */}

      {/* 1️⃣ 요청 거절 모달 */}
      {step === "declined" && (
        <RequestDeclineModal
          isOpen
          onRetry={() => setStep("loading")}
          onClose={() => setStep("idle")}
        />
      )}

      {/* 2️⃣ AI 추천 병원 모달 (홈에서 테스트 열고 싶으면 step을 'loading'으로 바꾸면 됨) */}
      <HospitalRecommendationModal
        isOpen={step === "loading" || step === "list"}
        aiHospitals={aiHospitals}
        onClose={() => setStep("idle")}
        onRequestComplete={() => setStep("confirm")}
      />

      {/* 3️⃣ 요청 완료 → 진행중 요청 모달 (닫으면 홈만 남음) */}
      {step === "confirm" && (
        <OngoingRequestModal
          hospitals={ongoingHospitals}
          onClose={() => setStep("idle")}
        />
      )}

      {/* 4️⃣ 병원 확정 모달 (카드 눌렀을 때 등) */}
      {showConfirmModal && (
        <HospitalConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          hospital={selectedHospital}
        />
      )}
    </>
  );
}