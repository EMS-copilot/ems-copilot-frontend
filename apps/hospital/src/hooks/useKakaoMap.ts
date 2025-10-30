"use client";

import { useEffect, useState } from "react";

export default function useKakaoMap() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {

    console.log("🔑 Kakao Map Key:", process.env.NEXT_PUBLIC_KAKAO_MAP_KEY);

    if (typeof window === "undefined") return;
  
    if (window.kakao?.maps) {
      setIsLoaded(true);
      return;
    }
  
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`;
    script.async = true;
  
    script.onload = () => {
      if (window.kakao?.maps) {
        window.kakao.maps.load(() => setIsLoaded(true));
      } else {
        console.error("⚠️ Kakao maps SDK failed to load properly.");
      }
    };
  
    script.onerror = () => {
      console.error("❌ Failed to load Kakao Map script.");
    };
  
    document.head.appendChild(script);
  }, []);
  

  return isLoaded;
}
