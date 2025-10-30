"use client";

import React, { useEffect, useRef } from "react";
import useKakaoMap from "@/hooks/useKakaoMap";
import HospitalCardDashboard from "@/components/sidebar/HospitalCardDashboard";

export default function SidebarPreview() {
  const mapRef = useRef<HTMLDivElement>(null);
  const isLoaded = useKakaoMap();

  useEffect(() => {
    // 1️⃣ 기본 방어 코드
    if (!isLoaded || !mapRef.current) return;
    if (typeof window === "undefined" || !window.kakao) return;

    // 2️⃣ SDK가 완전히 로드된 뒤 지도 초기화
    window.kakao.maps.load(() => {
      const { kakao } = window;

      // ✅ 지도 생성
      const map = new kakao.maps.Map(mapRef.current!, {
        center: new kakao.maps.LatLng(36.6424, 127.4890), // 충북대병원 근처
        level: 4,
      });

      // ✅ 마커 추가
      new kakao.maps.Marker({
        position: new kakao.maps.LatLng(36.6424, 127.4890),
        map,
      });
    });
  }, [isLoaded]);

  return (
    <div className="col-span-3 flex flex-col gap-6">
      {/* ✅ 병원 대시보드 카드 */}
      <HospitalCardDashboard />

      {/* ✅ 지도 */}
      <div className="w-[514px] h-[420px] bg-white rounded-[20px] shadow-sm border border-gray-100 p-4 overflow-hidden">
        <p className="text-sm font-medium text-gray-700 mb-3">실시간 위치 지도</p>
        <div
          ref={mapRef}
          className="w-full h-[370px] rounded-lg overflow-hidden"
        />
      </div>
    </div>
  );
}
