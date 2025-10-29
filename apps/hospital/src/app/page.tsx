'use client';

import React from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CurrentPatient from '@/components/CurrentPatient';
import PatientList from '@/components/PatientList';

export default function Page() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto p-6">
        <Header />
        
        <div className="grid grid-cols-12 gap-6">
          <Sidebar />
          
          <div className="col-span-9">
            <div className="flex gap-2 mb-6">
              <button className="px-6 py-3 rounded-lg font-semibold transition-colors bg-green-500 text-white hover:bg-green-600">
                여유
              </button>
            </div>

            <CurrentPatient />
            <PatientList />
          </div>
        </div>
      </div>
    </div>
  );
}