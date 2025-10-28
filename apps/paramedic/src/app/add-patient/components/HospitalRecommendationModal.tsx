"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import RequestConfirmModal from "./RequestConfirmModal";
import Header from "@/components/common/Header";

type RecommendedHospital = {
  hospitalId: string;
  hospitalName: string;
  aiScore: number;
  priority: number;
  aiExplanations: Record<string, any>;
  distance: number; // km
  eta: number; // min
};

type Summary = {
  severity: string;
  symptoms: string[];
  vitals: { id: string; label: string; value: number; unit: string }[];
};

interface HospitalRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiHospitals: RecommendedHospital[];
  summary?: Summary;
}

export default function HospitalRecommendationModal({
  isOpen,
  onClose,
  aiHospitals,
  summary,
}: HospitalRecommendationModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // ✅ API 응답 -> UI 데이터 변환
  const hospitals = useMemo(() => {
    return (aiHospitals ?? []).map((h) => ({
      id: h.hospitalId,
      name: h.hospitalName,
      type: "서울특별시", // ✅ Hospital 타입 요구사항 반영
      distance: `${h.distance}km`,
      waitTime: `${h.eta}분`,
      beds: "-",
      departments: ["AI 추천", "가까운 거리", "수용 가능"],
      treatments: ["응급", "심혈관", "외상"],
      specialties: ["24시간 응급실 운영"],
      checked: false,
      badgeColor: h.priority <= 2 ? ("green" as const) : ("purple" as const), // ✅ 문자열 literal로 고정
      badgeText: h.priority <= 2 ? "우수" : "보통",
      aiScore: h.aiScore,
      priority: h.priority,
    }));
  }, [aiHospitals]);
  

  const [hospitalList, setHospitalList] = useState(hospitals);
  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    setHospitalList(hospitals);
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
  }, [isOpen, hospitals]);

  const toggleHospital = (id: string) => {
    setHospitalList((prev) => {
      const updated = prev.map((h) =>
        h.id === id ? { ...h, checked: !h.checked } : h
      );
      setSelectedCount(updated.filter((h) => h.checked).length);
      return updated;
    });
  };

  const selectedHospitals = hospitalList.filter((h) => h.checked);

  if (!isOpen) return null;

  return (
    <>
      {/* 로딩 화면 */}
      {isLoading && (
        <div className="fixed inset-0 bg-[#F7F7F7] z-60 flex justify-center">
          <div className="w-full max-w-[393px] flex flex-col">
            <Header variant="sub" title="새 환자 등록" />
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
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
          <div className="fixed inset-0 bg-black/30 z-55" onClick={onClose} />
          <div className="fixed inset-0 flex justify-center z-58 pointer-events-none">
            <div className="w-full max-w-[393px] h-full relative pointer-events-auto flex flex-col">
              <Header variant="sub" title="새 환자 등록" />

              {/* 상단 요약 */}
              {summary && (
                <div className="bg-white border-b border-gray-200 px-5 py-3 flex flex-wrap gap-2">
                  <span
                    className={`px-3 h-7 inline-flex items-center rounded-xl text-[12px] ${
                      summary.severity === "위급"
                        ? "bg-[#FB4D40] text-white"
                        : summary.severity === "긴급"
                        ? "bg-[#FFA034] text-white"
                        : "bg-[#27A959] text-white"
                    }`}
                  >
                    {summary.severity}
                  </span>
                  {summary.symptoms.slice(0, 2).map((s, i) => (
                    <span
                      key={i}
                      className="px-3 h-7 inline-flex items-center rounded-xl text-[12px] bg-[#E3F2FD] text-[#1778FF]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

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
                        checked={
                          selectedCount > 0 &&
                          selectedCount === hospitalList.length
                        }
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setHospitalList((prev) =>
                            prev.map((h) => ({ ...h, checked }))
                          );
                          setSelectedCount(checked ? hospitalList.length : 0);
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
                      총 {hospitalList.length}건
                    </span>
                  </div>

                  {/* 병원 카드 리스트 */}
                  <div className="space-y-3 pb-2">
                    {hospitalList.map((hospital) => (
                      <div
                        key={hospital.id}
                        className="bg-white rounded-2xl p-4 border border-white"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <input
                            type="checkbox"
                            checked={hospital.checked}
                            onChange={() => toggleHospital(hospital.id)}
                            className="mt-1.5 w-4 h-4 rounded border-gray-200 text-[#1778FF] focus:ring-[#1778FF] shrink-0"
                          />
                          <div className="flex-1 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <h3 className="text-[16px] font-semibold text-black">
                                {hospital.name}
                              </h3>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-[13px] font-medium shrink-0 ${
                                hospital.badgeColor === "green"
                                  ? "bg-[#E8F5E9] text-[#27A959]"
                                  : "bg-[#F3E5F5] text-[#9C27B0]"
                              }`}
                              style={{
                                width: "47px",
                                height: "28px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {hospital.badgeText}
                            </span>
                          </div>
                        </div>

                        <div className="bg-[#F7F7F7] rounded-lg px-3 py-2.5 mb-2 flex items-center">
                          <p className="text-[13px] font-medium text-gray-700">
                            {hospital.specialties[0]}
                          </p>
                        </div>

                        <div className="bg-[#F7F7F7] rounded-lg px-3 py-2.5 mb-4 flex items-center">
                          <span className="text-[13px] font-medium text-gray-600 mr-1.5">
                            치료 가능 시술 :
                          </span>
                          <div className="flex items-center flex-wrap">
                            {hospital.treatments.map((t, idx) => (
                              <span
                                key={idx}
                                className="text-[13px] font-semibold text-[#1778FF]"
                              >
                                {t}
                                {idx < hospital.treatments.length - 1 && (
                                  <span className="text-[#1778FF] mx-1">|</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* 거리 / 시간 */}
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

                        {/* 태그 */}
                        <div className="flex gap-2 mb-3 flex-wrap">
                          {hospital.departments.map((dept, idx) => (
                            <span
                              key={idx}
                              className="px-1 bg-[#E3F2FD] text-[#1778FF] rounded-full text-[13px] font-regular"
                              style={{
                                height: "32px",
                                display: "flex",
                                alignItems: "center",
                                padding: "0 16px",
                              }}
                            >
                              {dept}
                            </span>
                          ))}
                        </div>

                        {/* 버튼 */}
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
