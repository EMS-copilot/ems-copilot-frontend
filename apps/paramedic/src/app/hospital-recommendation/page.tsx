"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import useKakaoMap from "@/hooks/useKakaoMap";
import Header from "@/components/common/Header";
import { useSpeechTranscribe, useSavePatientMemo } from "@/lib/api-hooks";

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

  // ETA 및 거리 상태 추가
  const [eta, setEta] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  // 메모 상태 + 버튼 상태
  const [memo, setMemo] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  // hooks
  const { mutateAsync: transcribeVoice } = useSpeechTranscribe();
  const { mutateAsync: saveMemo } = useSavePatientMemo();

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

  /* --------------------------------------
   * ✅ 지도 렌더링 (카카오 내비 Directions API 적용)
   * -------------------------------------- */
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !hospital) return;

    const { kakao } = window as any;

    kakao.maps.load(async () => {
      const origin = { lat: 37.4979, lng: 127.0276 }; // 출발 (현재 위치)
      const destination = {
        lat: hospital.lat ?? 37.498095,
        lng: hospital.lng ?? 127.02761,
      };

      // ✅ 지도 생성
      const map = new kakao.maps.Map(mapRef.current, {
        center: new kakao.maps.LatLng(origin.lat, origin.lng),
        level: 7,
      });

      // ✅ 마커 표시
      new kakao.maps.Marker({
        position: new kakao.maps.LatLng(origin.lat, origin.lng),
        map,
      });
      new kakao.maps.Marker({
        position: new kakao.maps.LatLng(destination.lat, destination.lng),
        map,
      });

      // ✅ Directions API 호출
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
        if (!data?.routes?.[0]) {
          console.warn("⚠️ No route data found");
          return;
        }

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

        // ✅ 거리/시간 계산
        const distanceKm = (route.summary.distance / 1000).toFixed(1);
        const etaMin = Math.round(route.summary.duration / 60);
        console.log(`🚗 예상 거리: ${distanceKm}km, 소요시간: ${etaMin}분`);
        setDistance(parseFloat(distanceKm));
        setEta(etaMin);

        // ✅ 경로선 표시
        const polyline = new kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 5,
          strokeColor: "#1778FF",
          strokeOpacity: 0.9,
          strokeStyle: "solid",
        });
        polyline.setMap(map);

        // ✅ 경로 전체 보기
        const bounds = new kakao.maps.LatLngBounds();
        linePath.forEach((p) => bounds.extend(p));
        map.setBounds(bounds);
      } catch (err) {
        console.error("❌ 경로 API 호출 실패:", err);
      }
    });
  }, [isMapLoaded, hospital]);

  /* --------------------------------------
   * 🎙️ 음성 녹음 + 메모 저장 로직
   * -------------------------------------- */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      let mimeType = "";
      if (MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")) {
        mimeType = "audio/ogg;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus";
      }

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, {
          type: mimeType.startsWith("audio/ogg") ? "audio/ogg" : "audio/webm",
        });

        setIsTranscribing(true);
        try {
          const res = await transcribeVoice(blob);
          const transcript = res?.data?.transcript ?? "";
          if (transcript) {
            setMemo((prev) => (prev ? `${prev}\n${transcript}` : transcript));
          } else {
            alert("변환 결과가 비어 있습니다.");
          }
        } catch (err) {
          console.error(err);
          alert("음성 변환에 실패했습니다.");
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (e) {
      console.error(e);
      alert("마이크 권한을 확인해주세요.");
    }
  };

  const stopRecording = () => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== "inactive") {
      mr.stop();
      setIsRecording(false);
    }
  };

  const handleMicClick = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const handleSaveMemo = async () => {
    try {
      const sessionCode = localStorage.getItem("currentSessionCode") || "";
      if (!sessionCode) {
        alert("세션 코드가 없습니다. 환자 등록을 먼저 진행해주세요.");
        return;
      }
      if (!memo.trim()) {
        alert("메모 내용이 비어 있습니다.");
        return;
      }
      const result = await saveMemo({ sessionCode, memo });
      if (result.status === "SUCCESS") {
        setShowPatientDetails(false);
      } else {
        alert(result.message || "저장에 실패했습니다.");
      }
    } catch (e) {
      console.error(e);
      alert("메모 저장 중 오류가 발생했습니다.");
    }
  };

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
        <AnimatePresence>
          {!showPatientDetails && !showCompletionModal && (
            <motion.div
              key="route-info"
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* 탭 + 새로고침 한 줄로 정렬 */}
              <div className="flex items-center justify-between px-6 mb-4">
                <div className="flex gap-2">
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
                className="px-6 mt-3 mb-[66px]"
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
                        {eta ? `${eta}분 후` : "계산 중..."}
                      </span>
                    </div>
                  </div>

                  <div className="text-3xl font-bold text-gray-900 mb-3">
                    {eta ? `${eta}분` : "계산 중..."}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    {distance ? `${distance.toFixed(1)}km` : ""}
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-colors">
                      연락하기
                    </button>
                    <button
                      onClick={() => setShowCompletionModal(true)}
                      className="flex-2 py-3 rounded-xl bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors"
                    >
                      환자 이송 완료
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* 환자 정보 버튼 */}
              <button
                onClick={() => setShowPatientDetails(true)}
                className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px]"
              >
                <div className="flex items-center justify-between p-4 bg-white border-t border-gray-200 shadow-[0_-2px_6px_rgba(0,0,0,0.05)] hover:bg-gray-50 transition-all">
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* 이하 환자 정보 패널 / 모달 부분 동일 */}
        {/* ... (생략 — 기존 코드 그대로 유지) */}
      </div>
    </div>
  );
}