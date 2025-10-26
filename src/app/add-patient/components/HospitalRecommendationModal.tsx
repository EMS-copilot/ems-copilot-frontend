"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import RequestConfirmModal from "./RequestConfirmModal";
import Header from "@/components/common/Header";

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
  const router = useRouter();
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
    setHospitals((prev) => {
      const updated = prev.map((h) =>
        h.id === id ? { ...h, checked: !h.checked } : h
      );
      setSelectedCount(updated.filter((h) => h.checked).length);
      return updated;
    });
  };

  const selectedHospitals = hospitals.filter((h) => h.checked);

  if (!isOpen) return null;

  return (
    <>
      {/* 로딩 화면 */}
      {isLoading && (
        <div className="fixed inset-0 bg-[#F7F7F7] z-[60] flex justify-center">
          <div className="w-full max-w-[393px] flex flex-col">
            <Header variant="sub" title="새 환자 등록" />

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
                AI가 추천드릴 병원을 고르고 있어요.
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
              <Header variant="sub" title="새 환자 등록" />

              {/* 콘텐츠 영역 */}
              <div className="flex-1 bg-[#F7F7F7] rounded-t-3xl overflow-hidden flex flex-col mt-15">
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
                    <span className="text-[14px] font-medium text-gray-900">
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
                        className="w-[18px] h-[18px] rounded border-gray-300 text-[#1778FF] focus:ring-[#1778FF]"
                      />
                      <label
                        htmlFor="select-all"
                        className="text-[14px] font-medium text-gray-700 cursor-pointer"
                      >
                        모두 선택
                      </label>
                    </div>
                    <span className="text-[13px] font-regular text-gray-400">
                      총 4건
                    </span>
                  </div>

                  {/* 병원 카드들 */}
                  <div className="space-y-3 pb-2">
                    {hospitals.map((hospital) => (
                      <div
                        key={hospital.id}
                        className="bg-white rounded-2xl p-4 border border-white"
                      >
                        {/* 첫 번째 줄: 체크박스 + 병원명 + 지역 + 배지 */}
                        <div className="flex items-start gap-3 mb-3">
                          <input
                            type="checkbox"
                            checked={hospital.checked}
                            onChange={() => toggleHospital(hospital.id)}
                            className="mt-1.5 w-[16px] h-[16px] rounded border-gray-200 text-[#1778FF] focus:ring-[#1778FF] flex-shrink-0"
                          />
                          <div className="flex-1 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <h3 className="text-[16px] font-semibold text-black">
                                {hospital.name}
                              </h3>
                              <span className="text-[13px] font-regular text-gray-400">
                                {hospital.type}
                              </span>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-[13px] font-medium flex-shrink-0 ${
                                hospital.badgeColor === "green"
                                  ? "bg-[#E8F5E9] text-[#27A959]"
                                  : "bg-[#F3E5F5] text-[#9C27B0]"
                              }`}
                              style={{ width: "47px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                              {hospital.badgeText}
                            </span>
                          </div>
                        </div>

                        {/* 특성 정보 박스 */}
                        <div className="bg-[#F7F7F7] rounded-lg px-3 py-2.5 mb-2" style={{ width: "321px", height: "36px", display: "flex", alignItems: "center" }}>
                          <p className="text-[13px] font-medium text-gray-700">
                            {hospital.specialties[0]}
                          </p>
                        </div>

                        {/* 치료 가능 시술 박스 */}
                        <div
                          className="bg-[#F7F7F7] rounded-lg px-3 py-2.5 mb-4 flex items-center"
                          style={{ width: "321px", height: "36px" }}
                        >
                          <span className="text-[13px] font-medium text-gray-600 mr-1.5">
                            치료 가능 시술 :
                          </span>
                          <div className="flex items-center flex-wrap">
                            {hospital.treatments.map((treatment, idx) => (
                              <span key={idx} className="text-[13px] font-semibold text-[#1778FF]">
                                {treatment}
                                {idx < hospital.treatments.length - 1 && (
                                  <span className="text-[#1778FF] mx-1">|</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* 거리/시간 정보 */}
                        <div className="grid grid-cols-3 mb-4 divide-x divide-gray-200">
                          <div className="text-center px-1">
                            <p className="text-[13px] font-regular text-gray-500">
                              총 거리
                            </p>
                            <p className="text-[16px] font-semibold text-black">
                              {hospital.distance}
                            </p>
                          </div>
                          <div className="text-center px-1">
                            <p className="text-[13px] font-regular text-gray-500">
                              예상도착시간
                            </p>
                            <p className="text-[16px] font-semibold text-black">
                              {hospital.waitTime}
                            </p>
                          </div>
                          <div className="text-center px-1">
                            <p className="text-[13px] font-regular text-gray-500">
                              예상대기시간
                            </p>
                            <p className="text-[16px] font-semibold text-black">
                              {hospital.beds}
                            </p>
                          </div>
                        </div>

                        {/* 특성 태그들 */}
                        <div className="flex gap-2 mb-3">
                          {hospital.departments.map((dept, idx) => (
                            <span
                              key={idx}
                              className="px-1 bg-[#E3F2FD] text-[#1778FF] rounded-full text-[13px] font-regular"
                              style={{ height: "32px", display: "flex", alignItems: "center", padding: "0 16px" }}
                            >
                              {dept}
                            </span>
                          ))}
                        </div>

                        {/* 하단 버튼들 */}
                        <div className="flex gap-2">
                          <button className="w-[73px] py-2.5 rounded-xl border border-gray-300 text-gray-700 text-[13px] font-medium hover:bg-gray-50 transition-colors">
                            문의
                          </button>
                          <button className="w-[244px] py-2.5 rounded-xl bg-gray-800 text-white text-[13px] font-medium hover:bg-gray-800 transition-colors">
                            요청 보내기
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
            router.push("/");
          }}
          selectedHospitals={selectedHospitals}
        />
      )}
    </>
  );
}