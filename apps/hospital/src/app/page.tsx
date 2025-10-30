'use client';

import React from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/sidebar/Sidebar';
import CurrentPatient from '@/components/CurrentPatient';
import PatientList from '@/components/PatientList';

export default function Page() {
  return (
    <div className="w-full h-[1039px] bg-gray-50 overflow-hidden">
      <div className="max-w-[1920px] mx-auto p-6 h-full">
        <Header />

        {/* 전체 레이아웃 */}
        <div className="grid grid-cols-12 gap-6 h-[calc(100%-100px)]">
          {/* 왼쪽 사이드바 */}
          <Sidebar />

          {/* 오른쪽 콘텐츠 */}
          <div className="col-span-9 pl-16 flex flex-col gap-6 h-full min-h-0">
            {/* 현재 이송 중인 환자 */}
            <CurrentPatient />

            {/* 요청받은 환자 목록 (내부 스크롤 전용) */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <PatientList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
