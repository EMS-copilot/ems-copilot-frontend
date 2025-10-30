"use client";

import React from "react";
import Header from "@/components/Header";
import SidebarPreview from "@/components/sidebar/SidebarPreview";
import CurrentPatient from "@/components/CurrentPatient";
import PatientCardDetail from "@/components/patient/PatientCardDetail";

export default function PreviewPage() {
  return (
    <div className="w-full h-[1039px] bg-gray-50 overflow-hidden">
      <div className="max-w-[1920px] mx-auto p-6 h-full">
        <Header />

        {/* 전체 레이아웃 */}
        <div className="grid grid-cols-12 gap-6 h-[calc(100%-100px)]">
          {/* ✅ 왼쪽 사이드바 (지도 포함 프리뷰 버전) */}
          <SidebarPreview />

          {/* 오른쪽 콘텐츠 */}
          <div className="col-span-9 pl-16 flex flex-col gap-6 h-full min-h-0">
            {/* 상단 - 현재 이송 중인 환자 */}
            <CurrentPatient />

            {/* 하단 - 단일 환자 카드 */}
            <div className="flex-1 min-h-0 overflow-auto">
              <PatientCardDetail />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
