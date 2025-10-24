"use client";

import { motion } from "framer-motion";

interface Hospital {
  name: string;
  type: string;
  badgeColor: "green" | "purple";
  badgeText: string;
}

interface OngoingRequestModalProps {
  hospitals: Hospital[];
  onClose: () => void;
}

export default function OngoingRequestModal({
  hospitals,
  onClose,
}: OngoingRequestModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      {/* 반투명 배경 */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* 모달 */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-[393px] bg-white rounded-t-3xl shadow-2xl pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 드래그 핸들 */}
        <div className="flex justify-center pt-3 pb-4">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="px-5">
          {/* 제목 */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[18px] font-bold text-gray-900">
              📢 총 {hospitals.length}곳의 요청이 진행 중입니다
            </span>
          </div>

          {/* 병원 리스트 */}
          <div className="space-y-3 mb-4">
            {hospitals.map((hospital, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
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
                <span className="text-[12px] text-gray-500">대기중</span>
              </div>
            ))}
          </div>

          {/* 닫기 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-full py-3.5 rounded-xl bg-gray-100 text-gray-700 font-medium text-[15px] hover:bg-gray-200 transition-all active:scale-[0.98] cursor-pointer"
          >
            확인
          </button>
        </div>
      </motion.div>
    </div>
  );
}