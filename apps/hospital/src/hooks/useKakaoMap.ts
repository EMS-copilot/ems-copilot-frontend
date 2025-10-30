"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function useKakaoMap() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    if (!kakaoKey) {
      console.error("❌ Kakao Map Key (NEXT_PUBLIC_KAKAO_MAP_KEY) is missing.");
      return;
    }

    // 이미 로드된 경우
    if (window.kakao?.maps) {
      setIsLoaded(true);
      return;
    }

    const existing = document.getElementById("kakao-map-sdk");
    if (existing) {
      existing.addEventListener("load", () => {
        window.kakao.maps.load(() => setIsLoaded(true));
      });
      return;
    }

    const script = document.createElement("script");
    script.id = "kakao-map-sdk";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        console.log("✅ Kakao Map SDK initialized completely");
        setIsLoaded(true);
      });
    };

    script.onerror = () => console.error("❌ Failed to load Kakao Map SDK.");

    document.head.appendChild(script);
  }, []);

  return isLoaded;
}
