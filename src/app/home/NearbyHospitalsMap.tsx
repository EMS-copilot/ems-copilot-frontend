"use client";

import { useEffect, useRef, useState } from "react";

interface Hospital {
  name: string;
  lat: number;
  lng: number;
  status: "여유" | "보통" | "포화";
  distance: string;
}

export default function NearbyHospitalsMap() {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<number | null>(null);

  const hospitals: Hospital[] = [
    { name: "삼성서울병원", lat: 37.488, lng: 127.085, status: "여유", distance: "4.2km" },
    { name: "강남세브란스", lat: 37.495, lng: 127.026, status: "보통", distance: "4.2km" },
    { name: "서울아산병원", lat: 37.527, lng: 127.107, status: "포화", distance: "4.2km" },
    { name: "서울병원", lat: 35.527, lng: 127.107, status: "포화", distance: "4.2km" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "여유":
        return "#27A959";
      case "보통":
        return "#FFB800";
      case "포화":
        return "#FF4545";
      default:
        return "#1778FF";
    }
  };

  const createMarkerSvg = (color: string) => {
    return `
      <svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 0C8.954 0 0 8.954 0 20C0 31.046 20 48 20 48C20 48 40 31.046 40 20C40 8.954 31.046 0 20 0Z" fill="${color}"/>
        <circle cx="20" cy="18" r="8" fill="white"/>
      </svg>
    `;
  };

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

      // 지도 생성
      const map = new window.kakao.maps.Map(container, {
        center: new window.kakao.maps.LatLng(37.498, 127.027),
        level: 5,
      });

      mapRef.current = map;

      // 마커 생성
      const newMarkers: any[] = [];

      hospitals.forEach((h) => {
        const pos = new window.kakao.maps.LatLng(h.lat, h.lng);
        const color = getStatusColor(h.status);

        // 커스텀 마커 생성
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

        // 병원 이름 라벨
        const labelContent = `
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
          </div>
        `;

        const label = new window.kakao.maps.CustomOverlay({
          position: pos,
          content: labelContent,
          yAnchor: 2.3,
        });

        label.setMap(map);
      });

      markersRef.current = newMarkers;
    };

    // 이미 로드된 SDK 재사용
    if (window.kakao && window.kakao.maps) {
      loadKakaoMap();
      return;
    }

    // 새로 SDK 로드
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appkey}&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        setTimeout(loadKakaoMap, 0);
      });
    };
    document.head.appendChild(script);
  }, []);

  // 병원 클릭 시 지도 이동
  const handleHospitalClick = (index: number) => {
    setSelectedHospital(index);
    
    if (mapRef.current && markersRef.current[index]) {
      const { position } = markersRef.current[index];
      mapRef.current.setCenter(position);
      mapRef.current.setLevel(4); // 줌인
    }
  };

  return (
    <section className="w-full">
      {/* 상단 제목 */}
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

      {/* 지도 + 병원 리스트 (가로 배치, 카드 분리) */}
      <div className="px-1 flex gap-3">
        {/* 지도 */}
        <div className="flex-shrink-0 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div id="map" className="w-[245px] h-[237px]"></div>
        </div>

        {/* 병원 리스트 */}
        <div className="flex-1 flex flex-col gap-3 h-[237px] overflow-y-auto">
          {hospitals.map((h, i) => (
            <button
              key={i}
              onClick={() => handleHospitalClick(i)}
              className={`w-full bg-white rounded-2xl border border-gray-200 py-3 flex flex-col items-start transition-all ${
                selectedHospital === i
                  ? "border-gray-300 bg-gray-50"
                  : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="text-[14px] font-medium text-[#131313] truncate pl-2 pr-2">
                  {h.name}
                </span>
              </div>
              <span className="text-[13px] font-normal text-gray-400 pl-2">{h.distance}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}