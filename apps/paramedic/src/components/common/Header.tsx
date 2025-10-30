"use client";

import { useState } from "react";
import {
  Wifi,
  Menu,
  X,
  ArrowLeft,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMyName } from "@/lib/api-hooks";

interface HeaderProps {
  variant?: "home" | "sub";
  title?: string;
}

export default function Header({ variant = "home", title }: HeaderProps) {
  const router = useRouter();
  const isHome = variant === "home";
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ 이름 API 호출 (홈일 때만)
  const { data: myName, isLoading } = useMyName(isHome);

  // ✅ 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 w-full bg-white z-50 shadow-sm">
      <div className="flex items-end justify-between h-[60px] px-5 pb-3">
        {/* ✅ 왼쪽 영역 */}
        {isHome ? (
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

        {/* ✅ 오른쪽 영역 */}
        <div className="flex items-center space-x-2 relative">
          {/* 와이파이 버튼 */}
          <button className="w-7 h-7 flex items-center justify-center bg-[#E3F6EA] rounded-xl">
            <Wifi className="text-[#27A959] w-4 h-4" />
          </button>

          {/* 햄버거 버튼 (위치 고정, 아이콘만 교체됨) */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="w-7 h-7 flex items-center justify-center relative"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {menuOpen ? (
                <X className="text-[#464D47] w-5 h-5 transition-transform duration-150" />
              ) : (
                <Menu className="text-[#464D47] w-5 h-5 transition-transform duration-150" />
              )}
            </div>
          </button>

          {/* ✅ 드롭다운 메뉴 */}
          {menuOpen && (
            <div className="absolute top-[42px] right-0 w-[180px] bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-fadeIn">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/profile");
                }}
                className="flex items-center w-full px-4 py-2.5 hover:bg-gray-50 transition"
              >
                <User className="w-4 h-4 mr-3 text-gray-700" />
                <span className="text-sm font-medium text-gray-800">
                  내 프로필 정보
                </span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/settings");
                }}
                className="flex items-center w-full px-4 py-2.5 hover:bg-gray-50 transition"
              >
                <Settings className="w-4 h-4 mr-3 text-gray-700" />
                <span className="text-sm font-medium text-gray-800">
                  설정
                </span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center w-full px-4 py-2.5 hover:bg-gray-50 transition"
              >
                <LogOut className="w-4 h-4 mr-3 text-gray-700" />
                <span className="text-sm font-medium text-gray-800">
                  로그아웃
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
