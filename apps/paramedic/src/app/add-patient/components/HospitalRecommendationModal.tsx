"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Header from "@/components/common/Header";
import { useSendHospitalRequest } from "@/lib/api-hooks";
import toast from "react-hot-toast";
import axios from "axios";

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

// 🔹 환자 요약 정보 타입
type Summary = {
  severity: string;
  symptoms: string[];
  vitals: { id: string; label: string; value: number; unit: string }[];
};

// 🔹 내부 상태에서 사용하는 병원 카드용 타입
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
  const [hospitalList, setHospitalList] = useState<HospitalCard[]>([]);
  const [selectedCount, setSelectedCount] = useState(0);

  // ✅ 병원 요청 API 훅
  const sendRequestMutation = useSendHospitalRequest();

  // ✅ aiHospitals → hospitalList 변환
  const hospitals = useMemo<HospitalCard[]>(() => {
    console.log("🔄 [useMemo] aiHospitals 변환 시작");
    console.log("aiHospitals:", aiHospitals);
    
    return (aiHospitals ?? []).map((h, index) => {
      const badgeColor = h.priority <= 2 ? "green" : "purple" as const;
      const badgeText = h.priority <= 2 ? "우수" : "보통";

      // ✅ hospitalId를 문자열로 저장 (API 응답값 그대로 사용)
      const hospitalId = String(h.hospitalId);
      
      console.log(`  → Hospital ${index}:`, {
        original: h.hospitalId,
        converted: hospitalId,
        type: typeof hospitalId,
        name: h.hospitalName
      });

      return {
        id: hospitalId, // 문자열로 저장
        name: h.hospitalName,
        distance: `${h.distance}km`,
        waitTime: `${h.eta}분`,
        beds: "-",
        departments: ["AI 추천", "가까운 거리", "수용 가능"],
        treatments: ["응급", "심혈관", "외상"],
        specialties: ["24시간 응급실 운영"],
        checked: false,
        badgeColor,
        badgeText,
        aiScore: h.aiScore,
        priority: h.priority,
      };
    });
  }, [aiHospitals]);

  // ✅ 초기 렌더 시 로딩 세팅
  useEffect(() => {
    if (!isOpen) return;
    setHospitalList(hospitals);
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [isOpen, hospitals]);

  // ✅ 병원 선택 toggle
  const toggleHospital = (id: string) => {
    setHospitalList((prev) => {
      const updated = prev.map((h) =>
        h.id === id ? { ...h, checked: !h.checked } : h
      );
      setSelectedCount(updated.filter((h) => h.checked).length);
      return updated;
    });
  };

  // ✅ 병원 요청 전송 함수 (개선된 버전)
  const handleSendRequest = async (hospitalIds: (string | number)[]) => {
    try {
      // 1️⃣ 세션 코드 확인
      const sessionCode = localStorage.getItem("currentSessionCode");
      
      console.log("🔍 [요청 전송 전 검증 - RAW]");
      console.log("sessionCode:", sessionCode);
      console.log("hospitalIds (raw):", hospitalIds);
      console.log("hospitalIds types:", hospitalIds.map(id => `${id} (${typeof id})`));

      if (!sessionCode) {
        toast.error("세션 코드가 없습니다. 환자를 다시 등록해주세요.");
        return;
      }

      // 2️⃣ hospitalIds를 정수로 변환 (parseInt 사용)
      const validHospitalIds = hospitalIds
        .map(id => {
          // 문자열이든 숫자든 parseInt로 변환
          const num = parseInt(String(id), 10);
          console.log(`Converting: ${id} → ${num} (isNaN: ${isNaN(num)})`);
          
          if (isNaN(num) || num <= 0) {
            console.error(`❌ Invalid hospital ID: ${id} → ${num}`);
            return null;
          }
          return num;
        })
        .filter((id): id is number => id !== null && id > 0);

      console.log("✅ Valid hospital IDs:", validHospitalIds);

      if (validHospitalIds.length === 0) {
        toast.error("유효한 병원을 선택해주세요.");
        console.error("❌ No valid hospital IDs after conversion");
        return;
      }

      // 3️⃣ 요청 Body 구성
      const body = {
        sessionCode: sessionCode,
        hospitalIds: validHospitalIds
      };

      console.log("📦 [최종 전송 Body]:", JSON.stringify(body, null, 2));
      console.log("📦 [Body 타입 확인]:", {
        sessionCode: typeof body.sessionCode,
        hospitalIds: body.hospitalIds.map(id => `${id} (${typeof id})`)
      });

      // 4️⃣ API 호출
      await sendRequestMutation.mutateAsync(body);

      // 5️⃣ 성공 처리
      toast.success("병원으로 환자 정보가 전송되었습니다.");
      onClose();
      router.push("/");
      
    } catch (err) {
      console.error("❌ [handleSendRequest] 에러:", err);
      
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const errorData = err.response?.data;
        
        console.error("📍 에러 상세:");
        console.error("- Status:", status);
        console.error("- Data:", errorData);
        console.error("- Headers:", err.config?.headers);
        
        if (status === 500) {
          const message = errorData?.message || "서버 오류가 발생했습니다.";
          toast.error(message);
        } else if (status === 403) {
          toast.error("권한이 없습니다. 다시 로그인해주세요.");
        } else if (status === 400) {
          const message = errorData?.message || "요청 형식이 잘못되었습니다.";
          toast.error(message);
        } else if (status === 404) {
          toast.error("세션을 찾을 수 없습니다. 환자를 다시 등록해주세요.");
        } else {
          toast.error("요청 전송 중 오류가 발생했습니다.");
        }
      } else {
        toast.error("네트워크 오류가 발생했습니다.");
      }
    }
  };

  // ✅ 단일 병원 요청
  const handleSendSingle = (hospitalId: string) => {
    console.log("🔵 [handleSendSingle] 호출됨");
    console.log("- hospitalId (raw):", hospitalId, typeof hospitalId);
    
    const numId = parseInt(hospitalId, 10);
    console.log("- hospitalId (converted):", numId, typeof numId);
    
    if (isNaN(numId) || numId <= 0) {
      console.error("❌ 잘못된 병원 ID:", hospitalId);
      toast.error("잘못된 병원 ID입니다.");
      return;
    }
    
    handleSendRequest([numId]);
  };

  // ✅ 선택된 병원 전체 요청
  const handleSendSelected = () => {
    console.log("🟢 [handleSendSelected] 호출됨");
    console.log("- hospitalList:", hospitalList.map(h => ({ id: h.id, checked: h.checked })));
    
    const selectedHospitals = hospitalList.filter((h) => h.checked);
    console.log("- selectedHospitals:", selectedHospitals);
    
    const selectedIds = selectedHospitals
      .map((h) => {
        const numId = parseInt(h.id, 10);
        console.log(`  → Converting: ${h.id} (${h.name}) → ${numId}`);
        return numId;
      })
      .filter(id => !isNaN(id) && id > 0);
    
    console.log("- selectedIds (final):", selectedIds);
      
    if (selectedIds.length === 0) {
      toast.error("병원을 선택해주세요.");
      return;
    }
    
    handleSendRequest(selectedIds);
  };

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
      {!isLoading && (
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

              {/* 콘텐츠 */}
              <div className="flex-1 bg-[#F7F7F7] rounded-t-3xl overflow-hidden flex flex-col mt-15">
                <div className="flex-1 overflow-y-auto px-5 py-6">
                  {/* 상단 타이틀 */}
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
                    <span className="text-[13px] text-gray-400">
                      총 {hospitalList.length}건
                    </span>
                  </div>

                  {/* 병원 카드 리스트 */}
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
                            >
                              {hospital.badgeText}
                            </span>
                          </div>
                        </div>

                        {/* 병원 정보 */}
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

                        {/* 거리 / 시간 */}
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
                            className="w-[73px] py-2.5 rounded-xl border border-gray-300 text-gray-700 text-[13px] font-medium hover:bg-gray-50 transition-colors"
                          >
                            문의
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSendSingle(hospital.id);
                            }}
                            className="w-[244px] py-2.5 rounded-xl bg-gray-800 text-white text-[13px] font-medium hover:bg-gray-900 transition-colors"
                          >
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
                    type="button"
                    disabled={selectedCount === 0}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSendSelected();
                    }}
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
    </>
  );
}