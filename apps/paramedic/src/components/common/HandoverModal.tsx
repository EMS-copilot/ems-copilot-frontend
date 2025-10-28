"use client";

import { motion } from "framer-motion";

interface HandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function HandoverModal({
  isOpen,
  onClose,
  onConfirm,
}: HandoverModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 bg-black/40 z-[95]" onClick={onClose} />

      {/* 모달 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="
        fixed bottom-0 left-1/2 -translate-x-1/2
        w-[393px] h-[750px]
        bg-white rounded-t-3xl
        shadow-[0_-4px_12px_rgba(0,0,0,0.1)]
        z-[100]
        flex flex-col overflow-hidden
      "
      >
        {/* 헤더 */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-block px-3 py-1 bg-[#FF4444] text-white text-[12px] font-medium rounded">
              위급
            </span>
            <span className="text-[13px] text-gray-500">
              2024-01-15 | 14:32
            </span>
          </div>
          <h2 className="text-[24px] font-bold text-gray-900 mb-2">
            P2024-001
          </h2>
          <p className="text-[13px] text-gray-500">남성/55세 | EMS2024-001</p>
        </div>

        {/* 콘텐츠 영역 - 스크롤 가능 */}
        <div className="flex-1 overflow-y-auto px-5 py-4 bg-white">
          {/* 환자 기본 정보 */}
          <div className="bg-[#F7F7F7] rounded-2xl p-4 mb-4">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-[12px] text-gray-500 mb-1">성별/나이</p>
                <p className="text-[15px] font-semibold text-gray-900">
                  남성, 55세
                </p>
              </div>
              <div>
                <p className="text-[12px] text-gray-500 mb-1">케이스 번호</p>
                <p className="text-[15px] font-semibold text-gray-900">
                  EMS2024-001
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[12px] text-gray-500 mb-1">출동 시간</p>
                <p className="text-[15px] font-semibold text-gray-900">
                  2024-01-15 14:32
                </p>
              </div>
              <div>
                <p className="text-[12px] text-gray-500 mb-1">중증도</p>
                <p className="text-[15px] font-semibold text-[#FF4444]">위급</p>
              </div>
            </div>
          </div>

          {/* 환자 증상도 + 주요 증상 + 초기 활력징후 (하나의 큰 회색 박스) */}
          <div className="mb-4">
            <div className="bg-[#F7F7F7] rounded-2xl p-4">
              {/* 환자 중증도 */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[12px] font-light text-gray-500">
                  환자 중증도
                </h3>
                <span className="px-3 py-1.5 bg-[#FFE8E8] text-[#FF4444] rounded-full text-[13px] font-medium">
                  위급
                </span>
              </div>

              {/* 주요 증상 */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[12px] font-light text-gray-500">
                  주요 증상
                </h3>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 bg-[#E3F2FD] text-[#1778FF] rounded-full text-[13px] font-medium">
                    와상
                  </span>
                  <span className="px-3 py-1.5 bg-[#E3F2FD] text-[#1778FF] rounded-full text-[13px] font-medium">
                    출혈
                  </span>
                  <span className="px-3 py-1.5 bg-[#E3F2FD] text-[#1778FF] rounded-full text-[13px] font-medium">
                    화상
                  </span>
                </div>
              </div>

              {/* ✅ 초기 활력징후 (수정됨) */}
              <div>
                <h3 className="text-[12px] font-light text-gray-500 mb-3">
                  초기 활력징후
                </h3>
                <div className="bg-white rounded-2xl p-4">
                  <div className="flex justify-between">
                    {/* 왼쪽 */}
                    <div className="flex-1 pr-6 border-r border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[13px] text-gray-400">SBP</span>
                        <span className="text-[15px] font-semibold text-gray-900">
                          121mmHg
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[13px] text-gray-400">DBP</span>
                        <span className="text-[15px] font-semibold text-gray-900">
                          81mmHg
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] text-gray-400">HR</span>
                        <span className="text-[15px] font-semibold text-gray-900">
                          76bpm
                        </span>
                      </div>
                    </div>

                    {/* 오른쪽 */}
                    <div className="flex-1 pl-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[13px] text-gray-400">RR</span>
                        <span className="text-[15px] font-semibold text-gray-900">
                          17min
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[13px] text-gray-400">
                          SpO<sub>2</sub>
                        </span>
                        <span className="text-[15px] font-semibold text-gray-900">
                          94%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] text-gray-400">Temp</span>
                        <span className="text-[15px] font-semibold text-gray-900">
                          36.4°C
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 메모 */}
          <div className="mb-4">
            {/* 흰색 바탕 + 회색 테두리로 감싼 컨테이너 */}
            <div className="bg-[#F7F7F7] rounded-xl p-4">
              <h3 className="text-[12px] font-light text-gray-500 mb-3">메모</h3>

              {/* 내부 내용 (연한 회색 박스) */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <p className="text-[13px] text-gray-700 leading-relaxed">
                  환자 상태 업데이트. 환자 상태 업데이트. 환자 상태 업데이트. 환자 상태
                  업데이트. 환자 상태 업데이트. 환자 상태 업데이트. 환자 상태 업데이트.
                </p>
              </div>
            </div>
          </div>

        {/* 👇 여기 닫힘이 빠져있었음: 콘텐츠 영역 종료 */}
        </div>

        {/* 하단 버튼 - 고정 */}
        <div className="bg-white px-5 py-4">
          <button
            onClick={onConfirm}
            className="w-full h-[48px] bg-gray-900 text-white rounded-2xl text-[15px] font-semibold hover:bg-gray-800 transition-all"
          >
            병원 확정하기
          </button>
        </div>
      </motion.div>
    </>
  );
}
