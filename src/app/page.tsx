"use client";

import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import HomeStats from "./home/HomeStats";
import NearbyHospitalsMap from "./home/NearbyHospitalsMap";
import OngoingCases from "./home/OngoingCases";
import CompletedCases from "./home/CompletedCases";
import FloatingButton from "@/components/common/FloatingButton";
import OngoingRequestModal from "@/components/common/OngoingRequestModal";
import HospitalConfirmModal from "@/components/common/HospitalConfirmModal";

export default function HomePage() {
  const [showOngoingModal, setShowOngoingModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const hasOngoingRequests = true; // TODO: 실제 API 연동
    if (hasOngoingRequests) {
      setShowOngoingModal(true);
    }
  }, []);

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
          showHospitalConfirmModal={showConfirmModal} // ✅ 이 줄 추가!
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
