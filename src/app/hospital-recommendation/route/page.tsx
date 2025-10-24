"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import useKakaoMap from "@/hooks/useKakaoMap";

export default function RoutePage() {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);
  const isMapLoaded = useKakaoMap();
  
  const [activeTab, setActiveTab] = useState<"route" | "patient" | "hospital">(
    "route"
  );
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [hospital, setHospital] = useState<any>(null);

  // localStorage에서 병원 정보 가져오기
  useEffect(() => {
    const savedHospital = localStorage.getItem("selectedHospital");
    if (savedHospital) {
      setHospital(JSON.parse(savedHospital));
    }
  }, []);

  // 환자 데이터 (임시)
  const patientData = {
    bloodPressureSystolic: "121mmHg",
    bloodPressureDiastolic: "81mmHg",
    heartRate: "76bpm",
    spo2: "94%",
    temperature: "36.4°C",
    estimatedArrival: "14시 43분",
    distance: "27km",
    cost: "1,200원",
    notes: "환자 상태 업데이트: 환자 상태 업데이트.",
  };

  // 카카오맵 초기화
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !hospital) return;

    const { kakao } = window;
    
    // 지도 중심 좌표 (기본값: 강남역)
    const centerLat = hospital.lat || 37.498095;
    const centerLng = hospital.lng || 127.027610;
    
    const container = mapRef.current;
    const options = {
      center: new kakao.maps.LatLng(centerLat, centerLng),
      level: 5,
    };

    const map = new kakao.maps.Map(container, options);

    // 병원 위치에 마커 추가
    const markerPosition = new kakao.maps.LatLng(centerLat, centerLng);
    const marker = new kakao.maps.Marker({
      position: markerPosition,
    });
    marker.setMap(map);

    // 현재 위치 마커도 추가할 수 있음 (예시)
    const currentPosition = new kakao.maps.LatLng(37.4979, 127.0276);
    const currentMarker = new kakao.maps.Marker({
      position: currentPosition,
      image: new kakao.maps.MarkerImage(
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
        new kakao.maps.Size(24, 35)
      ),
    });
    currentMarker.setMap(map);

    // 경로 그리기 (폴리라인)
    const linePath = [currentPosition, markerPosition];
    const polyline = new kakao.maps.Polyline({
      path: linePath,
      strokeWeight: 5,
      strokeColor: "#1778FF",
      strokeOpacity: 0.7,
      strokeStyle: "solid",
    });
    polyline.setMap(map);

    // 지도 범위 재설정
    const bounds = new kakao.maps.LatLngBounds();
    bounds.extend(currentPosition);
    bounds.extend(markerPosition);
    map.setBounds(bounds);
  }, [isMapLoaded, hospital]);

  if (!hospital) {
    return (
      <div className="w-full max-w-[393px] mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">병원 정보를 불러오는 중...</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[393px] mx-auto bg-white min-h-screen relative">
      {/* 상단 헤더 */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-white z-50 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
            근무중
          </button>
          <div>
            <p className="text-sm font-bold text-gray-900">
              안녕하세요, <span className="text-blue-500">구급대원A</span>님!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
              />
            </svg>
          </button>
          <button className="w-9 h-9 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 지도 영역 */}
      <div className="w-full h-[50vh] bg-gray-200 relative mt-[60px]">
        {/* 카카오맵 컨테이너 */}
        <div ref={mapRef} className="w-full h-full" />

        {/* 왼쪽 상단 탭 */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <button
            onClick={() => setActiveTab("route")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md ${
              activeTab === "route"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            최단경로
          </button>
          <button
            onClick={() => setActiveTab("patient")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md ${
              activeTab === "patient"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            최소비용
          </button>
          <button
            onClick={() => setActiveTab("hospital")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md ${
              activeTab === "hospital"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            최적화
          </button>
        </div>

        {/* 오른쪽 상단 새로고침 버튼 */}
        <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md z-10">
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {/* 하단 정보 카드 - 지도 밖으로 이동 */}
      <div className="px-4 -mt-20 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-blue-400">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-gray-600">예상 소요시간</span>
            </div>
            <span className="text-xs text-gray-400">
              {patientData.estimatedArrival}
            </span>
          </div>

          <div className="text-3xl font-bold text-gray-900 mb-3">24분</div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span>{patientData.distance}</span>
            <span>{patientData.cost}</span>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-colors">
              연락하기
            </button>
            <button className="flex-1 py-3 rounded-xl bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors">
              환자 이송 완료
            </button>
          </div>
        </div>
      </div>

      {/* 하단 스크롤 영역 */}
      <div className="px-4 py-6 space-y-4 bg-white">
        {/* 환자 정보 확인/수정 섹션 */}
        <button
          onClick={() => setShowPatientDetails(!showPatientDetails)}
          className="w-full"
        >
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <span className="text-sm font-semibold text-gray-900">
              환자 정보 확인/수정
            </span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${
                showPatientDetails ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        {/* 환자 정보 상세 (접힘/펼침) */}
        {showPatientDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4"
          >
            {/* 환자 정보 헤더 */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">환자 정보</h3>
              <button className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-blue-600 transition-colors">
                수정내용 업데이트
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>

            {/* 환자 중증도 */}
            <div className="space-y-2">
              <label className="text-xs text-gray-600">환자 중증도</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value="위급"
                  readOnly
                  className="flex-1 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-600"
                />
              </div>
            </div>

            {/* 주요 증상 */}
            <div className="space-y-2">
              <label className="text-xs text-gray-600">주요 증상</label>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg text-xs font-medium">
                  의식
                </button>
                <button className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg text-xs font-medium">
                  출혈
                </button>
                <button className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg text-xs font-medium">
                  화상
                </button>
              </div>
            </div>

            {/* 호기 관찰일지 */}
            <div className="space-y-2">
              <label className="text-xs text-gray-600">호기 관찰일지</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-600">SBP</span>
                  <span className="text-sm font-bold text-gray-900">
                    {patientData.bloodPressureSystolic}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-600">RR</span>
                  <span className="text-sm font-bold text-gray-900">
                    17min
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-600">DBP</span>
                  <span className="text-sm font-bold text-gray-900">
                    {patientData.bloodPressureDiastolic}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-600">
                    SpO<sub>2</sub>
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {patientData.spo2}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-600">HR</span>
                  <span className="text-sm font-bold text-gray-900">
                    {patientData.heartRate}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-600">Temp</span>
                  <span className="text-sm font-bold text-gray-900">
                    {patientData.temperature}
                  </span>
                </div>
              </div>
            </div>

            {/* 메모 */}
            <div className="space-y-2">
              <label className="text-xs text-gray-600">메모</label>
              <textarea
                value={patientData.notes}
                readOnly
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 resize-none"
                rows={3}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* 뒤로가기 버튼 (왼쪽 하단) */}
      <button
        onClick={() => router.back()}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 ml-[-170px] w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center shadow-lg z-40 hover:bg-gray-800 transition-colors"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>
    </div>
  );
}