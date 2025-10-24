"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, X, UserPlus, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // 버튼 클릭 시 이동 함수
  const handleAddPatient = () => {
    setIsOpen(false); // 메뉴 닫고
    router.push("/add-patient"); // 새 환자 등록 페이지로 이동
  };

  return (
    <>
      {/* ✅ 확장 메뉴 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="
              fixed bottom-[90px] right-[calc(50%-196.5px+20px)]
              bg-white rounded-2xl shadow-lg p-2
              flex flex-col gap-2
              z-[70]
            "
          >
            {/* 새 환자 추가하기 */}
            <button
              onClick={handleAddPatient}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition"
            >
              <UserPlus className="w-[18px] h-[18px]" strokeWidth={1.5} />
              <span className="text-[14px] font-medium text-gray-900">
                새 환자 추가하기
              </span>
            </button>

            {/* 음성으로 추가하기 */}
            <button
              onClick={() => alert("음성 추가 기능 준비 중 🎙️")}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition"
            >
              <Mic className="w-[18px] h-[18px]" strokeWidth={1.5} />
              <span className="text-[14px] font-medium text-gray-900">
                음성으로 추가하기
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ 플로팅 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          fixed bottom-[28px] right-[calc(50%-196.5px+20px)]
          w-[56px] h-[56px]
          bg-black text-white rounded-full
          flex items-center justify-center
          shadow-lg
          hover:bg-gray-800 active:scale-95 transition
          z-[80]
        "
      >
        {isOpen ? (
          <X size={26} strokeWidth={1.5} />
        ) : (
          <Plus size={26} strokeWidth={1.5} />
        )}
      </button>
    </>
  );
}