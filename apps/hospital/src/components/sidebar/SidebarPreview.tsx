"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import HospitalCardDashboard from "@/components/sidebar/HospitalCardDashboard";
import useKakaoMap from "@/hooks/useKakaoMap";

// ✅ kakao 타입 선언 (ts 오류 방지)
declare global {
  interface Window {
    kakao: any;
  }
}

export default function SidebarPreview() {
  const mapRef = useRef<HTMLDivElement>(null);
  const isLoaded = useKakaoMap();
  const [eta, setEta] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || typeof window === "undefined") return;
    const { kakao } = window;
    if (!kakao) return;

    // 출발/도착 좌표
    const origin = { lat: 36.9935, lng: 127.5928 }; // 한울요양원
    const destination = { lat: 37.2797, lng: 127.4519 }; // 경기도의료원이천병원

    // 지도 생성
    const map = new kakao.maps.Map(mapRef.current, {
      center: new kakao.maps.LatLng(origin.lat, origin.lng),
      level: 9,
    });

    // 출발지 & 도착지 마커
    new kakao.maps.Marker({
      position: new kakao.maps.LatLng(origin.lat, origin.lng),
      map,
    });
    new kakao.maps.Marker({
      position: new kakao.maps.LatLng(destination.lat, destination.lng),
      map,
    });

    // Directions API 호출
    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `https://apis-navi.kakaomobility.com/v1/directions?origin=${origin.lng},${origin.lat}&destination=${destination.lng},${destination.lat}&priority=RECOMMEND`,
          {
            headers: {
              Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        if (!data?.routes?.[0]) return;

        const route = data.routes[0];
        const linePath: any[] = [];

        route.sections.forEach((section: any) => {
          section.roads.forEach((road: any) => {
            for (let i = 0; i < road.vertexes.length; i += 2) {
              const lat = road.vertexes[i + 1];
              const lng = road.vertexes[i];
              linePath.push(new kakao.maps.LatLng(lat, lng));
            }
          });
        });

        // 거리/시간 계산
        setDistance(route.summary.distance / 1000);
        setEta(Math.round(route.summary.duration / 60));

        // 경로선 표시
        const polyline = new kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 5,
          strokeColor: "#1778FF",
          strokeOpacity: 0.9,
          strokeStyle: "solid",
        });
        polyline.setMap(map);

        // 전체 경로 보기
        const bounds = new kakao.maps.LatLngBounds();
        linePath.forEach((p) => bounds.extend(p));
        map.setBounds(bounds);
      } catch (err) {
        console.error("경로 API 호출 실패:", err);
      }
    };

    fetchRoute();
  }, [isLoaded]);

  return (
    <div className="col-span-3 flex flex-col gap-6">
      <HospitalCardDashboard />

      {/* 지도 카드 */}
      <div className="w-[514px] h-[599px] bg-white rounded-[20px] shadow-sm border border-gray-100 p-6 font-['Pretendard'] relative overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Image
              src="/Waiting.png"
              alt="병원 수용 능력"
              width={20}
              height={20}
            />
            <h2 className="text-lg font-semibold text-gray-900">
              실시간 현황 지도
            </h2>
          </div>

          {/* 여유/보통/포화 범례 */}
          <div className="flex items-center gap-3 text-[12px] text-gray-600">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#22C55E]" />
              여유
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#FACC15]" />
              보통
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
              포화
            </span>
          </div>
        </div>

        {/* 지도 */}
        <div className="relative w-full h-[495px] rounded-xl overflow-hidden">
          <div
            ref={mapRef}
            className="absolute inset-0 mx-1 rounded-lg overflow-hidden"
          />

          {/* 예상 도착 시간 오버레이 */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[85%] bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-md px-6 py-3 flex items-start justify-between z-[10]">
            <div>
              <p className="text-[13px] text-black mb-1">예상 도착 시간</p>
              <p className="text-[26px] font-bold text-black leading-none">
                {eta ? `${eta}분 후` : "계산 중..."}
                {distance && (
                  <span className="ml-2 text-[14px] text-gray-500 font-medium align-middle">
                    {distance.toFixed(1)}km
                  </span>
                )}
              </p>
            </div>
            <div className="text-[13px] text-gray-500">14시 43분</div>
          </div>
        </div>
      </div>
    </div>
  );
}
