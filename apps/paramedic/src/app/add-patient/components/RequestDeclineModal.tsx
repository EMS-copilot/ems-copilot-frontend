"use client";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onRetry: () => void;
  onClose: () => void;
}

export default function RequestDeclineModal({ isOpen, onRetry, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl w-[85%] max-w-[360px] p-8 text-center shadow-2xl"
        >
          <h3 className="text-[18px] font-semibold text-gray-900 mb-3">
            요청을 수락할 병원이 없어요
          </h3>
          <p className="text-[14px] text-gray-500 mb-6">
            AI가 주변 병원을 다시 추천드릴까요?
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-11 rounded-full border border-gray-300 text-gray-400 font-medium"
            >
              취소
            </button>
            <button
              onClick={onRetry}
              className="flex-1 h-11 rounded-full bg-[#1778FF] text-white font-semibold"
            >
              AI 재추천 받기
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
