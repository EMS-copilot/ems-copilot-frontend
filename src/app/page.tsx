"use client";

import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import HomeStats from "./home/HomeStats";
import NearbyHospitalsMap from "./home/NearbyHospitalsMap";
import OngoingCases from "./home/OngoingCases";
import CompletedCases from "./home/CompletedCases";
import FloatingButton from "@/components/common/FloatingButton";
import OngoingRequestModal from "@/components/common/OngoingRequestModal";

export default function HomePage() {
  const [showOngoingModal, setShowOngoingModal] = useState(false);

  // 페이지 로드 시 요청 중인 병원이 있는지 확인
  useEffect(() => {
    // TODO: 실제로는 API나 localStorage에서 확인
    const hasOngoingRequests = true; // 임시
    if (hasOngoingRequests) {
      setShowOngoingModal(true);
    }
  }, []);

  // 임시 데이터
  const ongoingHospitals = [
    { name: "중복대학교 병원", type: "서울특별시", badgeColor: "green" as const, badgeText: "여유" },
    { name: "강남세브란스병원", type: "서울특별시", badgeColor: "purple" as const, badgeText: "보통" },
  ];

  return (
    <>
      <main className="w-full max-w-[393px] mx-auto bg-[#F7F7F7] min-h-screen relative overflow-y-auto">
        {/* 상단 고정 헤더 */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] z-50">
          <Header variant="home" />
        </div>

        {/* 본문 컨텐츠 */}
        <div className="pt-[116px] px-4 space-y-6 pb-10">
          <HomeStats />
          <NearbyHospitalsMap />
          <OngoingCases />
          <CompletedCases />
        </div>

        {/* 플로팅 버튼 */}
        <FloatingButton />
      </main>

      {/* 진행 중인 요청 모달 - main 밖에 렌더링 */}
      {showOngoingModal && (
        <OngoingRequestModal
          hospitals={ongoingHospitals}
          onClose={() => setShowOngoingModal(false)}
        />
      )}
    </>
  );
}