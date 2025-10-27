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

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showOngoingModal, setShowOngoingModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    // 🔐 로그인 체크
    const token = localStorage.getItem("authToken");
    if (!token) {
      // 토큰이 없으면 로그인 페이지로 리다이렉트
      router.push("/login");
      return;
    }
    
    // 로그인되어 있음
    setIsAuthenticated(true);
    setIsLoading(false);

    // 기존 로직: 진행 중인 요청 확인
    const hasOngoingRequests = true; // TODO: 실제 API 연동
    if (hasOngoingRequests) {
      setShowOngoingModal(true);
    }
  }, [router]);

  // 로딩 중이거나 인증되지 않은 경우
  if (isLoading || !isAuthenticated) {
    return (
      <div className="w-full max-w-[393px] mx-auto min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  // ✅ 진행 중 병원 리스트
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

  // ✅ 병원 확정 모달에 표시할 병원 (예시)
  const selectedHospital = {
    name: "중복대학교 병원",
    type: "서울특별시",
    badgeColor: "green" as const,
    badgeText: "여유",
  };

  return (
    <>
      <main className="w-full max-w-[393px] mx-auto bg-[#F7F7F7] min-h-screen relative overflow-y-auto">
        {/* 상단 고정 헤더 */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] z-50">
          <Header variant="home" />
        </div>

        {/* 본문 컨텐츠 */}
        <div className="pt-[76px] px-4 space-y-6 pb-[230px]">
          <HomeStats />
          <NearbyHospitalsMap />
          <OngoingCases />
          <CompletedCases />
        </div>

        {/* 플로팅 버튼 — 모달 상태에 따라 위치/노출 제어 */}
        <FloatingButton
          showModal={showOngoingModal}
          showHospitalConfirmModal={showConfirmModal}
        />
      </main>

      {/* 진행 중인 요청 모달 */}
      {showOngoingModal && (
        <OngoingRequestModal hospitals={ongoingHospitals} />
      )}

      {/* 병원 확정 모달 */}
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