"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSendHospitalRequest } from "@/lib/api-hooks";

interface Hospital {
  id: string;
  name: string;
  badgeColor: "green" | "purple";
  badgeText: string;
}

interface RequestConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedHospitals: Hospital[];
  onConfirm: () => void;
}

export default function RequestConfirmModal({
  isOpen,
  onClose,
  selectedHospitals,
}: RequestConfirmModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<"confirm" | "privacy" | "success">("confirm");
  const [loading, setLoading] = useState(false);

  const sendRequestMutation = useSendHospitalRequest();

  /* -----------------------------
   * ✅ 실제 요청 함수
   * --------------------------- */
  const handleSendRequest = async (latitude: number, longitude: number) => {
    try {
      const sessionCode = localStorage.getItem("currentSessionCode");
      if (!sessionCode) {
        toast.error("세션 코드가 없습니다. 환자를 다시 등록해주세요.");
        return;
      }

      const hospitalIds = selectedHospitals.map((h) => parseInt(h.id, 10));
      const body = { sessionCode, hospitalIds };

      setLoading(true);
      await sendRequestMutation.mutateAsync(body);

      // 성공 처리
      localStorage.setItem("ems:showOngoing", "1");
      setStep("success");
    } catch (error) {
      console.error(error);
      toast.error("요청 전송 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
   * ✅ 위치 동의 처리
   * --------------------------- */
  const handleLocationAgree = async () => {
    if (!navigator.geolocation) {
      toast.error("이 브라우저에서는 위치 권한을 사용할 수 없습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log("📍 위치 동의 완료:", latitude, longitude);
        handleSendRequest(latitude, longitude);
      },
      (err) => {
        console.error("❌ 위치 권한 거부:", err);
        toast.error("위치 권한이 필요합니다.");
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  /* -----------------------------
   * ✅ 초기 요청 보내기 클릭 시 → 위치 동의 화면으로 전환
   * --------------------------- */
  const handleConfirmClick = () => {
    setStep("privacy");
  };

  /* -----------------------------
   * ✅ UI
   * --------------------------- */
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[70]"
          />

          {/* STEP 1️⃣ 요청 확인 */}
          {step === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-[364px] bg-white rounded-3xl shadow-2xl z-[75] overflow-hidden"
            >
              <div className="px-6 pt-6 pb-6">
                <h3 className="text-[18px] font-semibold text-black mb-4">
                  요청 병원 확인
                </h3>

                <div className="mb-5 space-y-2">
                  {selectedHospitals.map((hospital) => (
                    <div
                      key={hospital.id}
                      className="flex items-center justify-between h-11 py-3 px-4 bg-[#F7F7F7] rounded-xl"
                    >
                      <span className="text-[15px] font-semibold text-gray-900">
                        {hospital.name}
                      </span>
                      <span
                        className={`px-3 py-1 rounded text-[13px] font-medium ${
                          hospital.badgeColor === "green"
                            ? "bg-[#E8F5E9] text-[#27A959]"
                            : "bg-[#F3E5F5] text-[#9C27B0]"
                        }`}
                      >
                        {hospital.badgeText}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="text-[14px] text-center text-gray-800 font-medium mb-5">
                  총 {selectedHospitals.length}곳의 병원에 요청을 보내시겠어요?
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 h-12 rounded-full border-2 border-gray-200 text-gray-400 font-medium text-[15px] hover:bg-gray-50"
                  >
                    이전
                  </button>
                  <button
                    onClick={handleConfirmClick}
                    className="flex-1 h-12 rounded-full bg-gray-900 text-white font-semibold text-[15px] hover:bg-gray-800"
                  >
                    요청 보내기
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2️⃣ 위치 수집·이용·제공 동의 */}
          {step === "privacy" && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.25 }}
              className="
                fixed top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2
                w-[90%] max-w-[380px] max-h-[85vh]
                bg-white rounded-3xl shadow-xl z-[80]
                flex flex-col overflow-hidden
              "
            >
              <div className="px-6 pt-6 pb-4 overflow-y-auto">
                <h2 className="text-[18px] font-bold text-gray-900 mb-4 text-center">
                  🚑 구급차/사용자 위치 수집·이용·제공 동의
                </h2>

                <p className="text-[14px] text-gray-700 leading-relaxed whitespace-pre-line">
                  수집항목: 구급차 위치(GPS), 이송 경로, 속도, 도착 예상시간(ETA)
                  {"\n\n"}
                  이용목적: 병원 도착 예측, 이송 시간 분석, 실시간 응급실 연결
                  {"\n\n"}
                  제공대상: 이송 대상 병원 및 응급관리기관
                  {"\n\n"}
                  보관 및 파기: 이송 완료 후 즉시 파기하며 법적 근거에 따라 보관될 수 있습니다.
                </p>
              </div>

              <div className="border-t border-gray-200 px-6 py-5 flex gap-3">
                <button
                  onClick={() => {
                    toast("위치 동의가 필요합니다.");
                    setStep("confirm");
                  }}
                  className="flex-1 h-12 rounded-full border border-gray-200 text-gray-500 font-medium text-[15px]"
                >
                  동의하지 않음
                </button>
                <button
                  disabled={loading}
                  onClick={handleLocationAgree}
                  className="flex-1 h-12 rounded-full bg-[#1778FF] text-white font-semibold text-[15px] hover:bg-[#0D66E8]"
                >
                  {loading ? "요청 중..." : "동의하고 계속"}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3️⃣ 요청 성공 모달 */}
          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-[300px] bg-white rounded-3xl shadow-2xl z-[85] overflow-hidden"
            >
              <div className="px-8 py-10 flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-[#1778FF] rounded-full flex items-center justify-center mb-5"
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 13L9 17L19 7"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>

                <h3 className="text-[18px] font-bold text-gray-900 mb-2">
                  요청을 성공적으로 전송했어요!
                </h3>

                <button
                  onClick={() => {
                    setStep("confirm");
                    onClose();
                    router.push("/");
                  }}
                  className="mt-4 w-full h-11 rounded-full bg-[#F7F7F7] text-gray-700 font-medium text-[15px] hover:bg-gray-200"
                >
                  홈에서 대기하기
                </button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}