"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, X, UserPlus, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingButtonProps {
  showModal?: boolean;
  showHospitalConfirmModal?: boolean;
}

export default function FloatingButton({
  showModal = false,
  showHospitalConfirmModal = false,
}: FloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleAddPatient = () => {
    setIsOpen(false);
    router.push("/add-patient");
  };

  // ✅ 모달 유무에 따라 위치 계산
  const buttonBottom = showModal ? "230px" : "28px";
  const menuBottom = showModal ? "342px" : "90px";

  // ✅ 병원확정모달이 열리면 아예 렌더링하지 않음
  if (showHospitalConfirmModal) return null;

  return (
    <>
      {/* 확장 메뉴 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="
              fixed right-[calc(50%-196.5px+20px)]
              bg-white rounded-2xl shadow-lg p-2
              flex flex-col gap-2
              z-70
              transition-all duration-300
            "
            style={{ bottom: menuBottom }}
          >
            <button
              onClick={handleAddPatient}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition"
            >
              <UserPlus className="w-[18px] h-[18px]" strokeWidth={1.5} />
              <span className="text-[14px] font-medium text-gray-900">
                새 환자 추가하기
              </span>
            </button>

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

      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          fixed right-[calc(50%-196.5px+20px)]
          w-14 h-14
          bg-black text-white rounded-full
          flex items-center justify-center
          shadow-lg
          hover:bg-gray-800 active:scale-95
          transition-all duration-300
          z-80
        "
        style={{ bottom: buttonBottom }}
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
