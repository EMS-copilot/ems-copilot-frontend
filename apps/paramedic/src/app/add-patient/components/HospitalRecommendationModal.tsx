"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/common/Header";
import { motion } from "framer-motion";
import { useSendHospitalRequest } from "@/lib/api-hooks";
import toast from "react-hot-toast";
import RequestConfirmModal from "./RequestConfirmModal";
import RequestDeclineModal from "./RequestDeclineModal";

// 🔹 추천 병원 기본 데이터 타입
type RecommendedHospital = {
  hospitalId: string;
  hospitalName: string;
  aiScore: number;
  priority: number;
  aiExplanations: Record<string, any>;
  distance: number;
  eta: number;
};

// 🔹 내부 카드용 타입
interface HospitalCard {
  id: string;
  name: string;
  distance: string;
  waitTime: string;
  beds: string;
  departments: string[];
  treatments: string[];
  specialties: string[];
  checked: boolean;
  badgeColor: "green" | "purple";
  badgeText: string;
  aiScore: number;
  priority: number;
}

interface HospitalRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiHospitals: RecommendedHospital[];
  onRequestComplete?: () => void;
}

export default function HospitalRecommendationModal({
  isOpen,
  onClose,
  aiHospitals,
  onRequestComplete,
}: HospitalRecommendationModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hospitalList, setHospitalList] = useState<HospitalCard[]>([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeclineOpen, setIsDeclineOpen] = useState(false);
  const [declinedOnce, setDeclinedOnce] = useState(false); // ✅ 첫 요청 여부 추적
  const [selectedHospitalsForConfirm, setSelectedHospitalsForConfirm] = useState<
    { id: string; name: string; badgeColor: "green" | "purple"; badgeText: string }[]
  >([]);

  const sendRequestMutation = useSendHospitalRequest();

  // ✅ 세션 스토리지 상태 불러오기 (hydration 이후)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const flag = sessionStorage.getItem("ems:demoDeclinedOnce");
      setDeclinedOnce(flag === "1");
    }
  }, []);

  // ✅ AI 추천 → 카드 변환
  const hospitals = useMemo<HospitalCard[]>(() => {
    return (aiHospitals ?? []).map((h) => ({
      id: String(h.hospitalId),
      name: h.hospitalName,
      distance: `${h.distance}km`,
      waitTime: `${h.eta}분`,
      beds: "-",
      departments: ["AI 추천", "가까운 거리", "수용 가능"],
      treatments: ["응급", "심혈관", "외상"],
      specialties: ["24시간 응급실 운영"],
      checked: false,
      badgeColor: h.priority <= 2 ? "green" : "purple",
      badgeText: h.priority <= 2 ? "여유" : "보통",
      aiScore: h.aiScore,
      priority: h.priority,
    }));
  }, [aiHospitals]);

  // ✅ 초기 로딩
  useEffect(() => {
    if (!isOpen) return;
    setHospitalList(hospitals);
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [isOpen, hospitals]);

  // ✅ 체크 토글
  const toggleHospital = (id: string) => {
    setHospitalList((prev) => {
      const updated = prev.map((h) =>
        h.id === id ? { ...h, checked: !h.checked } : h
      );
      setSelectedCount(updated.filter((h) => h.checked).length);
      return updated;
    });
  };

  // ✅ 요청 처리 로직 (거절 → 재추천 → 정상)
  const handleSendRequest = async (hospitalIds: (string | number)[]) => {
    try {
      const sessionCode = localStorage.getItem("currentSessionCode");
      if (!sessionCode) {
        toast.error("세션 코드가 없습니다. 환자를 다시 등록해주세요.");
        return;
      }

      const validIds = hospitalIds
        .map((id) => parseInt(String(id), 10))
        .filter((id) => !isNaN(id) && id > 0);

      if (validIds.length === 0) {
        toast.error("유효한 병원을 선택해주세요.");
        return;
      }

      // ✅ 첫 요청 → 거절 모달 (무조건 한 번은 뜸)
      if (!declinedOnce) {
        sessionStorage.setItem("ems:demoDeclinedOnce", "1");
        setDeclinedOnce(true);
        setIsConfirmOpen(false);
        setIsDeclineOpen(true);
        return;
      }

      // ✅ 두 번째 요청 → 실제 요청
      const body = { sessionCode, hospitalIds: validIds };
      await sendRequestMutation.mutateAsync(body);

      toast.success("요청을 성공적으로 전송했어요!");
      localStorage.setItem("ems:showOngoing", "1");

      setIsConfirmOpen(false);
      onClose();
      onRequestComplete?.();
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("요청 전송 중 오류가 발생했습니다.");
    }
  };

  // ✅ 다중 선택
  const handleSendSelected = () => {
    const selectedHospitals = hospitalList.filter((h) => h.checked);
    if (selectedHospitals.length === 0) {
      toast.error("병원을 선택해주세요.");
      return;
    }
    setSelectedHospitalsForConfirm(
      selectedHospitals.map((h) => ({
        id: h.id,
        name: h.name,
        badgeColor: h.badgeColor,
        badgeText: h.badgeText,
      }))
    );
    setIsConfirmOpen(true);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* ✅ 로딩 */}
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

      {/* ✅ 병원 카드 목록 (UI 그대로 유지) */}
      {!isLoading && !isConfirmOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-55" onClick={onClose} />
          <div className="fixed inset-0 flex justify-center z-58 pointer-events-none">
            <div className="w-full max-w-[393px] h-full relative pointer-events-auto flex flex-col">
              <Header variant="sub" title="새 환자 등록" />
              <div className="flex-1 bg-[#F7F7F7] rounded-t-3xl overflow-hidden flex flex-col mt-15">
                <div className="flex-1 overflow-y-auto px-5 py-6">
                  {/* 헤더 */}
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

                  {/* 전체선택 */}
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
                    <span className="text-[13px] text-gray-400">
                      총 {hospitalList.length}건
                    </span>
                  </div>

                  {/* 병원 카드 */}
                  <div className="space-y-3 pb-2">
                    {hospitalList.map((hospital, idx) => (
                      <div
                        key={hospital.id ?? idx}
                        className="bg-white rounded-2xl p-4 border border-white"
                      >
                        {/* 병원명 */}
                        <div className="flex items-start gap-3 mb-3">
                          <input
                            type="checkbox"
                            checked={hospital.checked}
                            onChange={() => toggleHospital(hospital.id)}
                            className="mt-1.5 w-4 h-4 rounded border-gray-200 text-[#1778FF] focus:ring-[#1778FF]"
                          />
                          <div className="flex-1 flex items-center justify-between gap-2">
                            <h3 className="text-[16px] font-semibold text-black">
                              {hospital.name}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-[13px] font-medium ${
                                hospital.badgeColor === "green"
                                  ? "bg-[#E8F5E9] text-[#27A959]"
                                  : "bg-[#F3E5F5] text-[#9C27B0]"
                              }`}
                            >
                              {hospital.badgeText}
                            </span>
                          </div>
                        </div>

                        {/* 특이사항 */}
                        <div className="bg-[#F7F7F7] rounded-lg px-3 py-2.5 mb-2 flex items-center">
                          <p className="text-[13px] font-medium text-gray-700">
                            {hospital.specialties[0]}
                          </p>
                        </div>

                        {/* 치료 가능 시술 */}
                        <div className="bg-[#F7F7F7] rounded-lg px-3 py-2.5 mb-4 flex items-center">
                          <span className="text-[13px] font-medium text-gray-600 mr-1.5">
                            치료 가능 시술 :
                          </span>
                          <div className="flex items-center flex-wrap">
                            {hospital.treatments.map((t, i) => (
                              <span
                                key={i}
                                className="text-[13px] font-semibold text-[#1778FF]"
                              >
                                {t}
                                {i < hospital.treatments.length - 1 && (
                                  <span className="text-[#1778FF] mx-1">|</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* 거리 정보 */}
                        <div className="grid grid-cols-3 mb-4 divide-x divide-gray-200">
                          <div className="text-center px-1">
                            <p className="text-[13px] text-gray-500">총 거리</p>
                            <p className="text-[16px] font-semibold text-black">
                              {hospital.distance}
                            </p>
                          </div>
                          <div className="text-center px-1">
                            <p className="text-[13px] text-gray-500">
                              예상도착시간
                            </p>
                            <p className="text-[16px] font-semibold text-black">
                              {hospital.waitTime}
                            </p>
                          </div>
                          <div className="text-center px-1">
                            <p className="text-[13px] text-gray-500">
                              예상대기시간
                            </p>
                            <p className="text-[16px] font-semibold text-black">
                              {hospital.beds}
                            </p>
                          </div>
                        </div>

                        {/* 태그 */}
                        <div className="flex gap-2 mb-3 flex-wrap">
                          {hospital.departments.map((dept, i) => (
                            <span
                              key={i}
                              className="px-1 bg-[#E3F2FD] text-[#1778FF] rounded-full text-[13px]"
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
                          <button
                            type="button"
                            className="w-[73px] py-2.5 rounded-xl border border-gray-300 text-gray-700 text-[13px] font-medium hover:bg-gray-50"
                          >
                            문의
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedHospitalsForConfirm([
                                {
                                  id: hospital.id,
                                  name: hospital.name,
                                  badgeColor: hospital.badgeColor,
                                  badgeText: hospital.badgeText,
                                },
                              ]);
                              setIsConfirmOpen(true);
                            }}
                            className="w-[244px] py-2.5 rounded-xl bg-gray-800 text-white text-[13px] font-medium hover:bg-gray-900"
                          >
                            요청 보내기
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 하단 버튼 */}
                <div className="bg-white border-t border-gray-200 px-5 py-4">
                  <button
                    type="button"
                    disabled={selectedCount === 0}
                    onClick={handleSendSelected}
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

      {/* ✅ 확인 모달 */}
      <RequestConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        selectedHospitals={selectedHospitalsForConfirm}
        onConfirm={() => {
          const ids = selectedHospitalsForConfirm.map((h) => parseInt(h.id, 10));
          handleSendRequest(ids);
        }}
      />

      {/* ✅ 거절 모달 */}
      <RequestDeclineModal
        isOpen={isDeclineOpen}
        onRetry={() => {
          setIsDeclineOpen(false);
          setIsLoading(true);
          setTimeout(() => setIsLoading(false), 1000);
        }}
        onClose={() => setIsDeclineOpen(false)}
      />
    </>
  );
}