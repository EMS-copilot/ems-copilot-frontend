"use client";

import { useEffect, useState } from "react";

export default function useKakaoMap() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 이미 로드되어 있으면 리턴
    if (window.kakao && window.kakao.maps) {
      setIsLoaded(true);
      return;
    }

    // 카카오맵 스크립트 로드
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        setIsLoaded(true);
      });
    };

    document.head.appendChild(script);

    return () => {
      // 클린업은 하지 않음 (다른 페이지에서도 사용할 수 있으므로)
    };
  }, []);

  return isLoaded;
}