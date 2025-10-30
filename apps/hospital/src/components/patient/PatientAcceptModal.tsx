"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";

interface Patient {
  id: string;
  risk: string;
  emergency: string;
  condition: string;
  symptoms: string[];
  vitals: {
    sbp: string;
    dbp: string;
    hr: string;
    rr: string;
    spo2: string;
    temp: string;
  };
}

interface PatientAcceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
}

export default function PatientAcceptModal({
  isOpen,
  onClose,
  patient,
}: PatientAcceptModalProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  if (!isOpen || !patient) return null;

  return (
    <AnimatePresence>
      {/* 배경 */}
      <motion.div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* -------------------
            1️⃣ 환자 수용 확인 모달
        ------------------- */}
        {!showRejectModal && (
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-[540px] bg-white rounded-2xl shadow-xl p-8 font-['Pretendard']"
          >
            {/* 제목 */}
            <h2 className="text-[18px] font-semibold text-gray-900 text-center mb-2">
              이 환자 요청을 수용하시겠습니까?
            </h2>
            <p className="text-center text-[13px] text-gray-500 mb-8 leading-relaxed">
              수용 시 해당 환자는 상단 현재 이송 중인 환자 영역에 등록되며, <br />
              구급대원이 병원으로 즉시 출발합니다.
            </p>

            {/* 환자 정보 */}
            <div className="bg-[#F9FAFB] rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[13px] font-light text-gray-600">환자 중증도</p>
                <span className="px-4 py-1.5 text-[14px] font-semibold rounded-full bg-[#FEE4E2] text-[#FB4D40]">
                  {patient.condition}
                </span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <p className="text-[13px] font-light text-gray-600">주요 증상</p>
                <div className="flex gap-2 flex-wrap justify-end">
                  {patient.symptoms.map((s, i) => (
                    <span
                      key={i}
                      className="px-4 py-1.5 text-[13px] font-medium bg-[#E3F2FD] text-[#1778FF] rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[13px] font-light text-gray-600 mb-3">
                  초기 활력징후
                </p>
                <div className="grid grid-cols-2 gap-y-2 gap-x-8">
                  {[
                    { label: "SBP", value: patient.vitals.sbp },
                    { label: "DBP", value: patient.vitals.dbp },
                    { label: "HR", value: patient.vitals.hr },
                    { label: "RR", value: patient.vitals.rr },
                    { label: "SpO₂", value: patient.vitals.spo2 },
                    { label: "Temp", value: patient.vitals.temp },
                  ].map((v, idx) => (
                    <div key={idx} className="flex justify-between text-[13px]">
                      <p className="text-gray-500">{v.label}</p>
                      <p className="text-gray-900 font-semibold">{v.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRejectModal(true)}
                className="flex-1 h-11 rounded-full bg-gray-100 text-gray-400 font-medium hover:bg-gray-200 transition"
              >
                거절하기
              </button>
              <button
                onClick={() => {
                  alert("환자 수용 완료");
                  onClose();
                }}
                className="flex-1 h-11 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
              >
                확정하기
              </button>
            </div>
          </motion.div>
        )}

        {/* -------------------
            2️⃣ 거절 사유 입력 모달
        ------------------- */}
        {showRejectModal && (
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-[540px] bg-white rounded-2xl shadow-xl p-8 font-['Pretendard']"
          >
            {/* 제목 */}
            <h2 className="text-[18px] font-semibold text-gray-900 text-center mb-2">
              거절 사유를 입력해 주세요
            </h2>
            <p className="text-center text-[13px] text-gray-500 mb-6 leading-relaxed">
              사유는 구급대원과 상황실에 공유되며, <br />
              이송 결정 기록에 남습니다.
            </p>

            {/* 입력창 */}
            <textarea
              placeholder="거절 사유를 입력해주세요."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full h-[100px] resize-none border border-gray-200 rounded-xl p-4 text-[14px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1778FF] focus:border-transparent mb-6"
            />

            {/* 버튼 */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  if (!rejectReason.trim()) {
                    alert("거절 사유를 입력해주세요.");
                    return;
                  }
                  alert(`❌ 거절 사유 제출됨: ${rejectReason}`);
                  setRejectReason("");
                  setShowRejectModal(false);
                  onClose();
                }}
                className="w-[150px] h-11 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
              >
                제출하기
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
