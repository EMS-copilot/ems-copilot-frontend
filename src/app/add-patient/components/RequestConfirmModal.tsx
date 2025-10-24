"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Hospital {
  id: string;
  name: string;
  type: string;
  badgeColor: "green" | "purple";
  badgeText: string;
}

interface RequestConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedHospitals: Hospital[];
}

function RequestConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  selectedHospitals,
}: RequestConfirmModalProps) {
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

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-[340px] bg-white rounded-3xl shadow-2xl z-[75] overflow-hidden"
          >
            <div className="px-6 pt-7 pb-6">
              <h3 className="text-[20px] font-bold text-gray-900 mb-6">
                요청 병원 확인
              </h3>

              <div className="mb-6 space-y-3">
                {selectedHospitals.map((hospital) => (
                  <div
                    key={hospital.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-semibold text-gray-900">
                        {hospital.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          hospital.badgeColor === "green"
                            ? "bg-[#E8F5E9] text-[#27A959]"
                            : "bg-[#F3E5F5] text-[#9C27B0]"
                        }`}
                      >
                        {hospital.badgeText}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-6 text-center p-3 bg-yellow-50 rounded-xl">
                <p className="text-[13px] text-gray-700 leading-relaxed">
                  총 {selectedHospitals.length}곳의 병원에 요청을 보내시겠어요?
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 rounded-xl border border-gray-300 text-gray-600 font-medium text-[15px] hover:bg-gray-50 transition-all"
                >
                  이전
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-[1.5] py-3.5 rounded-xl bg-gray-900 text-white font-medium text-[15px] hover:bg-gray-800 transition-all"
                >
                  요청 보내기
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default RequestConfirmModal;