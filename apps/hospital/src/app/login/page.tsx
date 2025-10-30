"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function HospitalLoginPage() {
  const router = useRouter();

  const [employeeNumber, setEmployeeNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("https://emsapi.online/api/users/login", {
        employeeNumber,
        password,
      });

      const user = response.data.data;

      // ✅ 병원 전용 토큰 및 유저 정보 저장
      localStorage.setItem("hospitalAuthToken", user.token);
      localStorage.setItem("hospitalUserInfo", JSON.stringify(user));

      // ✅ 로그인 성공 후 app/page.tsx로 이동
      router.push("/");
    } catch (err: any) {
      console.error("❌ 로그인 실패:", err);
      setError("로그인에 실패했습니다. 사번과 비밀번호를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full h-screen bg-white flex flex-col items-center justify-center font-['Pretendard']">
      {/* 로고 */}
      <div className="flex flex-col items-center mb-10">
        <Image src="/Logo.png" alt="EMS Copilot Korea" width={80} height={80} />
        <h1 className="text-[20px] font-semibold text-gray-900 mt-4">
          EMS Copilot Korea
        </h1>
        <p className="text-sm text-gray-500 mt-1">응급의료서비스 지원 시스템</p>
      </div>

      {/* 로그인 폼 */}
      <form
        onSubmit={handleLogin}
        className="w-[360px] bg-[#F9FAFB] p-8 rounded-[20px] border border-gray-200 shadow-sm flex flex-col gap-5"
      >
        <div>
          <label
            htmlFor="employeeNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            직원사번
          </label>
          <input
            id="employeeNumber"
            type="text"
            placeholder="예: HA11-0001"
            value={employeeNumber}
            onChange={(e) => setEmployeeNumber(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1778FF]"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1778FF]"
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mt-1">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`mt-4 w-full py-2.5 rounded-lg text-white font-semibold transition ${
            loading ? "bg-gray-400" : "bg-[#1778FF] hover:bg-[#0F67E0]"
          }`}
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      {/* 하단 안내 */}
      <p className="text-xs text-gray-400 mt-6">
        직원사번 + 비밀번호(password)로 로그인하세요.
      </p>
    </main>
  );
}
