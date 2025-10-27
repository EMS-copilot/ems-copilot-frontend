"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLogin } from "@/lib/api-hooks";

export default function LoginPage() {
  const router = useRouter();
  const { mutateAsync: login } = useLogin(); 

  const [organization, setOrganization] = useState("");
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 소속 목록 (표시용)
  const organizations = [
    "서울특별시 소방재난본부",
    "부산광역시 소방재난본부",
    "인천광역시 소방재난본부",
  ];

  // 로그인 처리 함수
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 유효성 검사
    if (!organization) {
      setError("소속을 선택해주세요.");
      return;
    }
    if (!employeeId) {
      setError("사번을 입력해주세요.");
      return;
    }
    if (!password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    try {
      // ✅ 실제 API 호출
      const response = await login({
        employeeNumber: employeeId,
        password,
      });

      if (response.status === "SUCCESS") {
        const user = response.data;

        // ✅ 토큰 및 사용자 정보 저장
        localStorage.setItem("authToken", user.token);
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            employeeNumber: user.employeeNumber,
            name: user.name,
            role: user.role,
            department: user.department,
            organization,
          })
        );

        // ✅ 홈으로 이동
        router.push("/");
      } else {
        setError("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (_err) {
      console.error("로그인 실패:", _err);
      setError("서버 연결에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="w-full max-w-[393px] mx-auto min-h-screen bg-white flex flex-col">
      {/* 로고 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="mb-3">
          <Image
            src="/Logo.png"
            alt="로고"
            width={80}
            height={80}
            className="object-contain"
            priority
          />
        </div>
        <h1 className="font-paperlogy text-[16px] font-extrabold text-gray-900">
          EMS Copilot Korea
        </h1>
      </div>

      {/* 로그인 폼 */}
      <div className="px-6 pb-8">
        <h2 className="text-[24px] font-semibold text-black mb-2">로그인</h2>
        <p className="text-[14px] font-medium text-gray-400 mb-4">
          구급대원 계정으로 로그인 해주세요.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* 소속 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              소속
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowOrgDropdown(!showOrgDropdown)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-left text-sm text-gray-700 flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span
                  className={
                    organization ? "text-gray-900" : "text-gray-400"
                  }
                >
                  {organization || "소속을 선택해주세요."}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    showOrgDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* 드롭다운 메뉴 */}
              {showOrgDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {organizations.map((org) => (
                    <button
                      key={org}
                      type="button"
                      onClick={() => {
                        setOrganization(org);
                        setShowOrgDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {org}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 사번 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              사번
            </label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="사번을 입력해주세요."
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해주세요."
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={!organization || !employeeId || !password}
            className={`w-full py-3 rounded-lg font-medium text-sm transition-colors ${
              organization && employeeId && password
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            로그인하기
          </button>
        </form>
      </div>
    </div>
  );
}
