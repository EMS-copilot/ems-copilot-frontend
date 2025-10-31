"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import useKakaoMap from "@/hooks/useKakaoMap";
import Header from "@/components/common/Header";
import {
  useSpeechTranscribe,
  useSavePatientMemo,
  useArriveAtHospital,
} from "@/lib/api-hooks";
import toast from "react-hot-toast";

export default function RoutePage() {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);
  const isMapLoaded = useKakaoMap();

  const [activeTab, setActiveTab] = useState<"route" | "patient" | "hospital">(
    "route"
  );
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // ETA/거리
  const [eta, setEta] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  // 메모 & 음성
  const [memo, setMemo] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  // hooks
  const { mutateAsync: transcribeVoice } = useSpeechTranscribe();
  const { mutateAsync: saveMemo } = useSavePatientMemo();
  const { mutateAsync: arriveAtHospital } = useArriveAtHospital();

  /* --------------------------------------
   * 지도 + 경로 (Kakao Mobility Directions)
   * -------------------------------------- */
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return;
    const { kakao } = window as any;

    kakao.maps.load(async () => {
      // ✅ 출발지 / 도착지 고정
      const origin = { lat: 36.993245, lng: 127.595424 }; // 한울요양원
      const destination = { lat: 37.272715, lng: 127.434897 }; // 경기도의료원이천병원

      const map = new kakao.maps.Map(mapRef.current, {
        center: new kakao.maps.LatLng(origin.lat, origin.lng),
        level: 7,
      });

      // 🔹 출발지 마커
      new kakao.maps.Marker({
        position: new kakao.maps.LatLng(origin.lat, origin.lng),
        map,
        title: "출발지 (한울요양원)",
      });

      // 🔹 도착지 마커
      new kakao.maps.Marker({
        position: new kakao.maps.LatLng(destination.lat, destination.lng),
        map,
        title: "도착지 (경기도의료원이천병원)",
      });

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

        const distanceKm = (route.summary.distance / 1000).toFixed(1);
        const etaMin = Math.round(route.summary.duration / 60);
        setDistance(parseFloat(distanceKm));
        setEta(etaMin);

        const polyline = new kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 5,
          strokeColor: "#1778FF",
          strokeOpacity: 0.9,
          strokeStyle: "solid",
        });
        polyline.setMap(map);

        const bounds = new kakao.maps.LatLngBounds();
        linePath.forEach((p) => bounds.extend(p));
        map.setBounds(bounds);
      } catch (err) {
        console.error("❌ 경로 API 호출 실패:", err);
      }
    });
  }, [isMapLoaded]);

  /* --------------------------------------
   * 🎙️ 음성 녹음 + STT + 메모 저장
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
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
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

  /* --------------------------------------
   * ✅ 병원 이송 완료
   * -------------------------------------- */
  const handleArrive = async () => {
    try {
      const encounterId = localStorage.getItem("currentEncounterId");
      if (!encounterId) {
        alert("이송 ID가 없습니다.");
        return;
      }

      const result = await arriveAtHospital(Number(encounterId));

      if (result.status === "SUCCESS") {
        toast.success("병원 도착이 성공적으로 처리되었습니다.");
        setShowCompletionModal(true);
      } else {
        toast.error(result.message || "이송 완료 처리 실패");
      }
    } catch (err) {
      console.error("❌ 병원 도착 요청 실패:", err);
      toast.error("서버 요청 중 오류가 발생했습니다.");
    }
  };

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

      {/* 하단 UI */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] z-40">
        <motion.div
          key="route-info"
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
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

          <motion.div className="px-6 mt-3 mb-[66px]">
            <div className="bg-white rounded-2xl shadow-lg p-4 border border-blue-400">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">예상 소요시간</span>
                <div className="flex items-center gap-1">
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
                  onClick={handleArrive}
                  className="flex-2 py-3 rounded-xl bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors"
                >
                  환자 이송 완료
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* 완료 모달 */}
        <AnimatePresence>
          {showCompletionModal && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/40 z-[70]"
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
                className="fixed inset-0 flex items-center justify-center z-[80]"
              >
                <div className="w-[320px] bg-white rounded-2xl shadow-lg p-6 text-center">
                  <div className="mb-3">
                    <div className="w-10 h-10 bg-[#1778FF]/10 rounded-full mx-auto flex items-center justify-center">
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
                    </div>
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 mb-1">
                    환자 이송이 완료되었어요!
                  </h2>
                  <p className="text-sm text-gray-500 mb-5">
                    모든 절차가 정상적으로 완료되었어요.
                  </p>
                  <button
                    onClick={() => setShowCompletionModal(false)}
                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition"
                  >
                    계속 보기
                  </button>
                  <button
                    onClick={() => router.push("/")}
                    className="w-full mt-2 py-3 bg-gray-100 text-gray-800 rounded-xl font-medium text-sm hover:bg-gray-200 transition"
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