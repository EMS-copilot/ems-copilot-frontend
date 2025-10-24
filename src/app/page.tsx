"use client";

import Header from "@/components/common/Header";
import HomeStats from "./home/HomeStats";
import NearbyHospitalsMap from "./home/NearbyHospitalsMap";
import OngoingCases from "./home/OngoingCases";
import CompletedCases from "./home/CompletedCases";
import FloatingButton from "@/components/common/FloatingButton";

export default function HomePage() {
  return (
    <main className="w-full max-w-[393px] mx-auto bg-[#F7F7F7] min-h-screen relative overflow-y-auto">
      {/* ✅ 상단 고정 헤더 */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] z-50">
        <Header variant="home" />
      </div>

      {/* ✅ 본문 컨텐츠 (헤더 높이만큼 패딩 추가) */}
      <div className="pt-[116px] px-4 space-y-6 pb-10">
        <HomeStats />
        <NearbyHospitalsMap />
        <OngoingCases />
        <CompletedCases />
      </div>

      {/* ✅ 플로팅 버튼 */}
      <FloatingButton />
    </main>
  );
}