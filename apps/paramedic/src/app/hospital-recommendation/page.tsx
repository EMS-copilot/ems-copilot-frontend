"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import useKakaoMap from "@/hooks/useKakaoMap";
import Header from "@/components/common/Header";

export default function RoutePage() {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);
  const isMapLoaded = useKakaoMap();

  const [activeTab, setActiveTab] = useState<"route" | "patient" | "hospital">(
    "route"
  );
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [hospital, setHospital] = useState<any>(null);

  useEffect(() => {
    const savedHospital = localStorage.getItem("selectedHospital");
    if (savedHospital) setHospital(JSON.parse(savedHospital));
  }, []);

  const patientData = {
    bloodPressureSystolic: "121mmHg",
    bloodPressureDiastolic: "81mmHg",
    heartRate: "76bpm",
    respiratoryRate: "17min",
    spo2: "94%",
    temperature: "36.4°C",
    estimatedArrival: "14시 43분",
    distance: "27km",
    notes: "환자 상태 업데이트. 환자 상태 업데이트.",
  };

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !hospital) return;

    const { kakao } = window;
    const centerLat = hospital.lat || 37.498095;
    const centerLng = hospital.lng || 127.02761;

    const container = mapRef.current;
    const options = {
      center: new kakao.maps.LatLng(centerLat, centerLng),
      level: 5,
    };
    const map = new kakao.maps.Map(container, options);

    const markerPosition = new kakao.maps.LatLng(centerLat, centerLng);
    const marker = new kakao.maps.Marker({ position: markerPosition });
    marker.setMap(map);

    const currentPosition = new kakao.maps.LatLng(37.4979, 127.0276);
    const currentMarker = new kakao.maps.Marker({
      position: currentPosition,
      image: new kakao.maps.MarkerImage(
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
        new kakao.maps.Size(24, 35)
      ),
    });
    currentMarker.setMap(map);

    const linePath = [currentPosition, markerPosition];
    const polyline = new kakao.maps.Polyline({
      path: linePath,
      strokeWeight: 5,
      strokeColor: "#1778FF",
      strokeOpacity: 0.7,
      strokeStyle: "solid",
    });
    polyline.setMap(map);

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
    <div className="w-full max-w-[393px] mx-auto bg-white min-h-screen relative overflow-hidden">
      {/* 헤더 */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] z-50">
        <Header variant="home" />
      </div>

      {/* 지도 */}
      <div className="w-full h-screen bg-gray-200 relative mt-[60px]">
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* 하단 영역 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] z-40">

        {/* 기존 카드 */}
        <AnimatePresence>
          {!showPatientDetails && !showCompletionModal && (
            <motion.div
              key="route-info"
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pb-8"
            >
              {/* 탭 */}
              <div className="flex justify-start gap-2 px-6 mb-2">
                {[
                  { key: "route", label: "최단경로" },
                  { key: "patient", label: "최소비용" },
                  { key: "hospital", label: "최적화" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeTab === tab.key
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-700 border border-gray-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 새로고침 */}
              <div className="flex justify-end px-6">
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
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

              {/* 예상 소요시간 카드 */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 mt-3"
              >
                <div className="bg-white rounded-2xl shadow-lg p-4 border border-blue-400">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">예상 소요시간</span>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-gray-400"
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
                      <span className="text-xs text-gray-400">
                        {patientData.estimatedArrival}
                      </span>
                    </div>
                  </div>

                  <div className="text-3xl font-bold text-gray-900 mb-3">24분</div>
                  <div className="text-sm text-gray-600 mb-4">
                    {patientData.distance}
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-colors">
                      연락하기
                    </button>
                    <button
                      onClick={() => setShowCompletionModal(true)}
                      className="flex-[2] py-3 rounded-xl bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors"
                    >
                      환자 이송 완료
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* 환자 정보 버튼 */}
              <div className="px-6 mt-3">
                <button
                  onClick={() => setShowPatientDetails(true)}
                  className="w-full"
                >
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
                    <span className="text-sm font-semibold text-gray-900">
                      환자 정보 확인/수정
                    </span>
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
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 완료 모달 */}
        <AnimatePresence>
          {showCompletionModal && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/40 z-[90]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.div
                key="completion-modal"
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 30 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 flex items-center justify-center z-[100]"
              >
                <div className="w-[320px] bg-white rounded-2xl shadow-lg p-6 text-center">
                  <div className="mb-3">
                    <motion.div
                      initial={{ rotate: -30, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="w-10 h-10 bg-[#1778FF]/10 rounded-full mx-auto flex items-center justify-center"
                    >
                      <svg
                        className="w-5 h-5 text-[#1778FF]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2l4-4"
                        />
                      </svg>
                    </motion.div>
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 mb-1">
                    환자 이송이 완료되었어요!
                  </h2>
                  <p className="text-sm text-gray-500 mb-5">
                    모든 절차가 정상적으로 완료되었어요.
                  </p>
                  <button
                    onClick={() => router.push("/home")}
                    className="w-full py-3 bg-gray-100 text-gray-800 rounded-xl font-medium text-sm hover:bg-gray-200 transition"
                  >
                    홈으로 이동하기
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
