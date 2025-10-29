"use client";

import { useEffect, useRef, useState } from "react";
import { useHospitals } from "@/lib/api-hooks";

export default function NearbyHospitalsMap() {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<number | null>(null);

  const { data: hospitals, isLoading, isError } = useHospitals();

  const getStatusColor = (capacity: number) => {
    if (capacity >= 85) return "#27A959"; // 여유
    if (capacity >= 70) return "#FFB800"; // 보통
    return "#FF4545"; // 포화
  };

  const createMarkerSvg = (color: string) => `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="10" fill="${color}"/>
      <image href="/Marker-icon.png" x="5" y="5" width="10" height="10"/>
    </svg>
  `;

  useEffect(() => {
    if (!hospitals || hospitals.length === 0) return;

    const appkey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    if (!appkey) {
      console.error("[KAKAO] NEXT_PUBLIC_KAKAO_MAP_KEY missing");
      return;
    }

    const loadKakaoMap = () => {
      if (!window.kakao || !window.kakao.maps) return;

      const container = document.getElementById("map");
      if (!container) return;

      const map = new window.kakao.maps.Map(container, {
        center: new window.kakao.maps.LatLng(37.498, 127.027),
        level: 7,
      });

      mapRef.current = map;
      const newMarkers: any[] = [];

      hospitals.forEach((h: any) => {
        // 더미 좌표 생성 (실제로는 h.lat, h.lng 사용)
        const baseLat = 37.498;
        const baseLng = 127.027;
        const lat = h.lat || baseLat + (Math.random() - 0.5) * 0.1;
        const lng = h.lng || baseLng + (Math.random() - 0.5) * 0.1;

        const pos = new window.kakao.maps.LatLng(lat, lng);
        const color = getStatusColor(h.hospitalCapacity);

        const markerContent = document.createElement("div");
        markerContent.innerHTML = createMarkerSvg(color);
        markerContent.style.cursor = "pointer";

        const marker = new window.kakao.maps.CustomOverlay({
          position: pos,
          content: markerContent,
          yAnchor: 0.5,
          xAnchor: 0,
        });
        marker.setMap(map);
        newMarkers.push({ marker, position: pos });

        // 병원 이름 라벨 표시
        const label = new window.kakao.maps.CustomOverlay({
          position: pos,
          content: `
            <div style="
              background: white;
              border-radius: 12px;
              padding: 2px 12px;
              font-size: 11px;
              font-weight: 600;
              border: 1px solid ${color};
              white-space: nowrap;
              box-shadow: 0 2px 4px rgba(0,0,0,0.15);
              margin-top: 3px;
              height: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-sizing: border-box;
            ">
              ${h.name}
            </div>`,
          yAnchor: -0.3,
          xAnchor: 0,
        });
        label.setMap(map);
      });

      markersRef.current = newMarkers;
    };

    if (window.kakao && window.kakao.maps) {
      loadKakaoMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appkey}&autoload=false`;
    script.async = true;
    script.onload = () => window.kakao.maps.load(loadKakaoMap);
    document.head.appendChild(script);
  }, [hospitals]);

  const handleHospitalClick = (index: number) => {
    setSelectedHospital(index);
    if (mapRef.current && markersRef.current[index]) {
      const { position } = markersRef.current[index];
      mapRef.current.setCenter(position);
      mapRef.current.setLevel(5);
    }
  };

  if (isLoading) return <div className="text-gray-500">병원 정보를 불러오는 중...</div>;
  if (isError) return <div className="text-red-500">병원 목록을 불러오는 중 오류가 발생했습니다.</div>;

  return (
    <section className="w-full">
      <div className="flex items-center justify-between px-3 mb-3">
        <div className="text-[15px] font-semibold text-gray-900">
          가까운 병원 상태
          <span className="text-gray-400 font-normal ml-1 text-[14px]">· 주변 10km</span>
        </div>
        <div className="flex items-center gap-3 text-[13px]">
          <span className="text-[#27A959]">● 여유</span>
          <span className="text-[#FFB800]">● 보통</span>
          <span className="text-[#FF4545]">● 포화</span>
        </div>
      </div>

      <div className="px-1 flex gap-3">
        <div className="shrink-0 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div id="map" className="w-[245px] h-[237px]"></div>
        </div>

        <div className="flex-1 flex flex-col gap-3 h-[237px] overflow-y-auto">
          {hospitals.map((h: any, i: number) => (
            <button
              key={h.id}
              onClick={() => handleHospitalClick(i)}
              className={`w-full bg-white rounded-2xl border py-3 flex flex-col items-start transition-all ${
                selectedHospital === i
                  ? "border-[#1778FF]"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="text-[14px] font-medium text-[#131313] truncate pl-2 pr-2">
                  {h.name}
                </span>
              </div>
              <span className="text-[13px] text-gray-400 pl-2">
                {h.distance}km
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}