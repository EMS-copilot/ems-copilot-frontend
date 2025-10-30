"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Hospital {
  id: string;
  name: string;
  badgeColor: "green" | "purple";
  badgeText: string;
}

interface RequestConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedHospitals: Hospital[];
}

export default function RequestConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  selectedHospitals,
}: RequestConfirmModalProps) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const handleConfirm = () => {
    onConfirm();
    setShowSuccessModal(true);
  };

  return (
    <AnimatePresence>
      {/* 확인 모달 */}
      {isOpen && !showSuccessModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-70"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-[364px] bg-white rounded-3xl shadow-2xl z-75 overflow-hidden"
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
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-semibold text-gray-900">
                        {hospital.name}
                      </span>
                    </div>
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
                  onClick={handleConfirm}
                  className="flex-1 h-12 rounded-full bg-gray-900 text-white font-semibold text-[15px] hover:bg-gray-800"
                >
                  요청 보내기
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* 성공 모달 */}
      {showSuccessModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-80"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-[300px] bg-white rounded-3xl shadow-2xl z-85 overflow-hidden"
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
                  setShowSuccessModal(false);
                  router.push("/");
                }}
                className="mt-4 w-full h-11 rounded-full bg-[#F7F7F7] text-gray-700 font-medium text-[15px] hover:bg-gray-200"
              >
                홈에서 대기하기
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
