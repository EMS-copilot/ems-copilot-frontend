"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao?: any;
  }
}

export default function NearbyHospitalsMap() {
  useEffect(() => {
    const appkey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

    if (!appkey) {
      console.error("[KAKAO] NEXT_PUBLIC_KAKAO_MAP_KEY missing");
      return;
    }

    const loadKakaoMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        console.error("[KAKAO] SDK not loaded yet");
        return;
      }

      const container = document.getElementById("map");
      if (!container) {
        console.error("[KAKAO] #map container not found.");
        return;
      }

      const map = new window.kakao.maps.Map(container, {
        center: new window.kakao.maps.LatLng(37.498, 127.027),
        level: 5,
      });

      const hospitals = [
        { name: "삼성서울병원", lat: 37.488, lng: 127.085, status: "여유", distance: "4.2km" },
        { name: "강남세브란스", lat: 37.495, lng: 127.026, status: "보통", distance: "4.2km" },
        { name: "서울아산병원", lat: 37.527, lng: 127.107, status: "포화", distance: "4.2km" },
      ];

      const getColor = (status: string) =>
        status === "여유" ? "#27A959" : status === "보통" ? "#1778FF" : "#FF4545";

      hospitals.forEach((h) => {
        const pos = new window.kakao.maps.LatLng(h.lat, h.lng);
        const _marker = new window.kakao.maps.Marker({ position: pos, map });
        const overlay = new window.kakao.maps.CustomOverlay({
          position: pos,
          content: `
            <div style="
              background:white;border-radius:12px;padding:4px 10px;
              font-size:13px;border:1px solid ${getColor(h.status)};
              white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.15);
            ">
              ${h.name}
            </div>`,
          yAnchor: 2.2,
        });
        overlay.setMap(map);
      });
    };

    // ✅ 이미 로드된 SDK 재사용
    if (window.kakao && window.kakao.maps) {
      loadKakaoMap();
      return;
    }

    // ✅ 새로 SDK 로드
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appkey}&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        // DOM이 다 그려진 이후 실행 보장
        setTimeout(loadKakaoMap, 0);
      });
    };
    document.head.appendChild(script);
  }, []);

  return (
    <section className="px-4">
      {/* 상단 제목 */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-[15px] font-semibold text-gray-900">
          가까운 병원 상태
          <span className="text-gray-400 font-normal ml-1 text-[14px]">· 주변 10km</span>
        </div>
        <div className="flex items-center gap-3 text-[13px]">
          <span className="text-[#27A959]">● 여유</span>
          <span className="text-[#1778FF]">● 보통</span>
          <span className="text-[#FF4545]">● 포화</span>
        </div>
      </div>

      {/* 지도 + 병원 리스트 */}
      <div className="flex bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div id="map" className="w-[230px] h-[260px]"></div>

        <div className="flex flex-col gap-3 p-3 w-[145px] overflow-y-auto">
          {[
            { name: "삼성서울병원", distance: "4.2km" },
            { name: "강남세브란스", distance: "4.2km" },
            { name: "서울아산병원", distance: "4.2km" },
          ].map((h, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 shadow-sm px-3 py-2 flex flex-col"
            >
              <span className="text-[14px] font-semibold text-gray-900 truncate">
                {h.name}
              </span>
              <span className="text-[13px] text-gray-400">{h.distance}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
