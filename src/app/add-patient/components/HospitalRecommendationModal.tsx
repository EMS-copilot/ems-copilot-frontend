"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import RequestConfirmModal from "./RequestConfirmModal";

interface Hospital {
  id: string;
  name: string;
  type: string;
  distance: string;
  waitTime: string;
  beds: string;
  departments: string[];
  treatments: string[];
  specialties: string[];
  checked: boolean;
  badgeColor: "green" | "purple";
  badgeText: string;
}

interface HospitalRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HospitalRecommendationModal({
  isOpen,
  onClose,
}: HospitalRecommendationModalProps) {
  const router = useRouter(); // 추가!
  const [isLoading, setIsLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([
    {
      id: "1",
      name: "중복대학교 병원",
      type: "서울특별시",
      distance: "3.4km",
      waitTime: "8분",
      beds: "12분",
      departments: ["최단거리", "수용 확률 높음", "전문의 보유"],
      treatments: ["PCI", "ECMO", "IABP"],
      specialties: ["심혈관센터, 응급실"],
      checked: false,
      badgeColor: "green",
      badgeText: "여유",
    },
    {
      id: "2",
      name: "강남세브란스병원",
      type: "서울특별시",
      distance: "3.4km",
      waitTime: "8분",
      beds: "12분",
      departments: ["최단거리", "수용 확률 높음", "전문의 보유"],
      treatments: ["PCI", "ECMO", "IABP"],
      specialties: ["뇌출혈센터 운영, 신경외과 전문의 대기"],
      checked: false,
      badgeColor: "purple",
      badgeText: "보통",
    },
    {
      id: "3",
      name: "서울아산병원",
      type: "서울특별시",
      distance: "5.2km",
      waitTime: "12분",
      beds: "15분",
      departments: ["최단거리", "수용 확률 높음", "전문의 보유"],
      treatments: ["CABG", "TAVR", "CT"],
      specialties: ["심장병 전문 클리닉 및 응급실팀 대응"],
      checked: false,
      badgeColor: "purple",
      badgeText: "우수",
    },
    {
      id: "4",
      name: "삼성서울병원",
      type: "서울특별시",
      distance: "6.1km",
      waitTime: "15분",
      beds: "18분",
      departments: ["최단거리", "수용 확률 높음", "전문의 보유"],
      treatments: ["PCI", "ECMO", "IABP"],
      specialties: ["심장센터, 응급실"],
      checked: false,
      badgeColor: "purple",
      badgeText: "우수",
    },
  ]);

  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const toggleHospital = (id: string) => {
    setHospitals((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const newChecked = !h.checked;
          setSelectedCount((count) => (newChecked ? count + 1 : count - 1));
          return { ...h, checked: newChecked };
        }
        return h;
      })
    );
  };

  const selectedHospitals = hospitals.filter((h) => h.checked);

  if (!isOpen) return null;

  return (
    <>
      {/* 로딩 화면 */}
      {isLoading && (
        <div className="fixed inset-0 bg-[#F7F7F7] z-[60] flex justify-center">
          <div className="w-full max-w-[393px] flex flex-col">
            <div className="bg-white px-5 py-4 flex items-center border-b border-gray-200">
              <button
                onClick={onClose}
                className="mr-3 text-gray-700 hover:text-gray-900"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <h1 className="text-[18px] font-bold text-gray-900">
                새 환자 등록
              </h1>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="mb-6"
              >
                <Image
                  src="/lotties/ai-star.png"
                  alt="AI 분석 중"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </motion.div>
              <h2 className="text-[20px] font-bold text-gray-900 mb-2 text-center">
                AI가 추천드릴 병원을 고르고있어요.
              </h2>
              <p className="text-[14px] text-gray-500 text-center">
                잠시만 기다려주세요.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 병원 목록 */}
      {!isLoading && !showRequestModal && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-[55]"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex justify-center z-[58] pointer-events-none">
            <div className="w-full max-w-[393px] h-full relative pointer-events-auto flex flex-col">
              {/* 헤더 */}
              <div className="bg-white px-5 py-4 flex items-center border-b border-gray-200">
                <button
                  onClick={onClose}
                  className="mr-3 text-gray-700 hover:text-gray-900"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <h1 className="text-[18px] font-bold text-gray-900">
                  새 환자 등록
                </h1>
              </div>

              {/* 콘텐츠 영역 */}
              <div className="flex-1 bg-white rounded-t-3xl overflow-hidden flex flex-col mt-2">
                <div className="flex-1 overflow-y-auto px-5 py-6">
                  {/* AI 추천 메시지 */}
                  <div className="flex items-center gap-2 mb-4">
                    <Image
                      src="/lotties/ai-star.png"
                      alt="AI"
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                    <span className="text-[14px] font-semibold text-gray-900">
                      AI가 추천한 병원이에요.
                    </span>
                  </div>

                  {/* 모두 선택 */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="select-all"
                        checked={selectedCount === hospitals.length}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setHospitals((prev) =>
                            prev.map((h) => ({ ...h, checked }))
                          );
                          setSelectedCount(checked ? hospitals.length : 0);
                        }}
                        className="w-5 h-5 rounded border-gray-300 text-[#1778FF] focus:ring-[#1778FF]"
                      />
                      <label
                        htmlFor="select-all"
                        className="text-[14px] font-medium text-gray-700 cursor-pointer"
                      >
                        모두 선택
                      </label>
                    </div>
                    <span className="text-[13px] text-gray-500">총 4건</span>
                  </div>

                  {/* 병원 카드들 */}
                  <div className="space-y-4 pb-6">
                    {hospitals.map((hospital) => (
                      <div
                        key={hospital.id}
                        className="bg-white rounded-2xl p-4 border border-gray-200"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <input
                            type="checkbox"
                            checked={hospital.checked}
                            onChange={() => toggleHospital(hospital.id)}
                            className="mt-1 w-5 h-5 rounded border-gray-300 text-[#1778FF] focus:ring-[#1778FF]"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-[16px] font-bold text-gray-900">
                                {hospital.name}
                              </h3>
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
                            <p className="text-[12px] text-gray-500">
                              {hospital.type}
                            </p>
                          </div>
                        </div>

                        <p className="text-[13px] text-gray-700 mb-3">
                          {hospital.specialties[0]}
                        </p>

                        <div className="mb-3">
                          <span className="text-[12px] text-gray-600">
                            치료 가능 시술 :{" "}
                          </span>
                          {hospital.treatments.map((treatment, idx) => (
                            <span
                              key={idx}
                              className="text-[12px] font-semibold text-[#1778FF]"
                            >
                              {treatment}
                              {idx < hospital.treatments.length - 1 ? " | " : ""}
                            </span>
                          ))}
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="text-center">
                            <p className="text-[11px] text-gray-500 mb-1">
                              총 거리
                            </p>
                            <p className="text-[15px] font-bold text-gray-900">
                              {hospital.distance}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-[11px] text-gray-500 mb-1">
                              예상도착시간
                            </p>
                            <p className="text-[15px] font-bold text-gray-900">
                              {hospital.waitTime}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-[11px] text-gray-500 mb-1">
                              예상대기시간
                            </p>
                            <p className="text-[15px] font-bold text-gray-900">
                              {hospital.beds}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 mb-3">
                          {hospital.departments.map((dept, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-[#E3F2FD] text-[#1778FF] rounded text-[11px] font-medium"
                            >
                              {dept}
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <button className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-[13px] font-medium hover:bg-gray-50 transition-colors">
                            ☎️ 문의
                          </button>
                          <button className="flex-[2] py-2.5 rounded-lg bg-gray-900 text-white text-[13px] font-medium hover:bg-gray-800 transition-colors">
                            💚 요청 보내기
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 하단 고정 버튼 */}
                <div className="bg-white border-t border-gray-200 px-5 py-4">
                  <button
                    disabled={selectedCount === 0}
                    onClick={() => setShowRequestModal(true)}
                    className={`w-full py-4 rounded-xl font-semibold text-[15px] transition-all ${
                      selectedCount > 0
                        ? "bg-[#1778FF] text-white hover:bg-[#0D66E8]"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    총 {selectedCount}개 선택 · 요청 보내기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

     {/* 요청 확인 모달 */}
     {showRequestModal && (
        <RequestConfirmModal
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          onConfirm={() => {
            setShowRequestModal(false);
            onClose();
            router.push("/"); // 홈으로 이동!
          }}
          selectedHospitals={selectedHospitals}
        />
      )}
    </>
  );
}