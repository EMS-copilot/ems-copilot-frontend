"use client";

import { Wifi, Menu, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMyName } from "@/lib/api-hooks";

interface HeaderProps {
  variant?: "home" | "sub";
  title?: string;
}

export default function Header({ variant = "home", title }: HeaderProps) {
  const router = useRouter();

  // ✅ 로그인 후 저장된 토큰이 유지되는지 확인용 콘솔
  console.log("현재 저장된 authToken:", localStorage.getItem("authToken"));

  const { data: myName, isLoading } = useMyName();

  return (
    <header
      className="
        sticky top-0
        w-full h-[60px]
        bg-white
        flex items-end
        px-5 pb-3
        shadow-sm
        z-50
      "
    >
      <div className="flex items-center justify-between w-full max-w-[480px] mx-auto">
        {/* 왼쪽 영역 */}
        {variant === "home" ? (
          <div className="flex items-center space-x-3">
            <div className="bg-[#1778FF] text-white text-[13px] font-semibold h-7 leading-7 px-3 rounded-full text-center tracking-wider">
              근무중
            </div>
            <div className="text-base font-medium text-gray-800">
              안녕하세요,{" "}
              <span className="text-[#1778FF]">
                {isLoading ? "불러오는 중..." : myName || "이름 없음"}
              </span>
              님!
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.back()}
              className="w-7 h-7 flex items-center justify-center"
            >
              <ArrowLeft className="text-[#464D47]" strokeWidth={1.5} />
            </button>
            <div className="text-base font-medium text-gray-900">{title}</div>
          </div>
        )}

        {/* 오른쪽 영역 */}
        <div className="flex items-center space-x-2">
          <button className="w-7 h-7 flex items-center justify-center bg-[#E3F6EA] rounded-xl">
            <Wifi className="text-[#27A959] w-4 h-4" />
          </button>

          <button className="w-7 h-7 flex items-center justify-center">
            <Menu className="text-[#464D47]" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
}
