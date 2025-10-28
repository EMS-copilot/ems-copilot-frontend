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
    <svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 0C8.954 0 0 8.954 0 20C0 31.046 20 48 20 48C20 48 40 31.046 40 20C40 8.954 31.046 0 20 0Z" fill="${color}"/>
      <circle cx="20" cy="18" r="8" fill="white"/>
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
        // 병원 좌표 정보가 없으면 표시하지 않음
        if (!h.lat || !h.lng) return;

        const pos = new window.kakao.maps.LatLng(h.lat, h.lng);
        const color = getStatusColor(h.hospitalCapacity);

        const markerContent = document.createElement("div");
        markerContent.innerHTML = createMarkerSvg(color);
        markerContent.style.cursor = "pointer";

        const marker = new window.kakao.maps.CustomOverlay({
          position: pos,
          content: markerContent,
          yAnchor: 1,
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
              padding: 6px 12px;
              font-size: 13px;
              font-weight: 600;
              border: 2px solid ${color};
              white-space: nowrap;
              box-shadow: 0 2px 6px rgba(0,0,0,0.15);
              margin-top: -8px;
            ">
              ${h.name}
            </div>`,
          yAnchor: 2.3,
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
                  ? "border-gray-300 bg-gray-50"
                  : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="text-[14px] font-medium text-[#131313] truncate pl-2 pr-2">
                  {h.name}
                </span>
                <span
                  className="text-[12px] font-semibold pr-3"
                  style={{ color: getStatusColor(h.hospitalCapacity) }}
                >
                  {h.hospitalCapacity >= 85
                    ? "여유"
                    : h.hospitalCapacity >= 70
                    ? "보통"
                    : "포화"}
                </span>
              </div>
              <span className="text-[13px] text-gray-400 pl-2">
                {h.address} · {h.distance}km
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
