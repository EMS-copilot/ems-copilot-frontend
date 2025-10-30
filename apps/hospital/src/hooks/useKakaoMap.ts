"use client";

import { useEffect, useState } from "react";

// ✅ 전역 kakao 타입 선언
declare global {
  interface Window {
    kakao: any;
  }
}

/**
 * Kakao 지도 SDK 로더 (Next.js + Vercel 안전 버전)
 */
export default function useKakaoMap() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY; // ✅ JavaScript 키 사용
    if (!kakaoKey) {
      console.error("❌ Kakao Map Key (NEXT_PUBLIC_KAKAO_MAP_KEY) is missing.");
      return;
    }

    // 이미 로드된 경우
    if (window.kakao?.maps) {
      setIsLoaded(true);
      return;
    }

    // 중복 로드 방지
    const existingScript = document.getElementById("kakao-map-sdk");
    if (existingScript) {
      existingScript.addEventListener("load", () => setIsLoaded(true));
      return;
    }

    // SDK 로드
    const script = document.createElement("script");
    script.id = "kakao-map-sdk";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        console.log("✅ Kakao Map SDK loaded successfully");
        setIsLoaded(true);
      });
    };

    script.onerror = () => {
      console.error("❌ Kakao Map SDK failed to load.");
    };

    document.head.appendChild(script);
  }, []);

  return isLoaded;
}
