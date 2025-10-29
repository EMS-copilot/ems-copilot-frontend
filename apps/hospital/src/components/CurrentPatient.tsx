import React from 'react';
import { Clipboard } from 'lucide-react';

export default function CurrentPatient() {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 mb-6 text-white shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clipboard className="w-6 h-6" />
          <h3 className="text-xl font-bold">현재 이송 중인 환자 세부사항</h3>
        </div>
        <span className="text-gray-400 text-sm">총 24건</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg">
          고위험
        </button>
        <button className="bg-pink-400 hover:bg-pink-500 text-white px-4 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg">
          응급
        </button>
      </div>

      <div className="bg-gray-900 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-3xl font-bold">P2024-001</h4>
          <span className="text-gray-400 bg-gray-800 px-4 py-1 rounded-full text-sm">남성</span>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <p className="text-gray-400 text-sm">환자 증상도</p>
              <p className="text-gray-400 text-sm">주요 증상</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-pink-400 text-white px-4 py-1.5 rounded-full text-sm font-medium">위급</span>
              <span className="bg-blue-400 text-white px-4 py-1.5 rounded-full text-sm font-medium">외상</span>
              <span className="bg-sky-400 text-white px-4 py-1.5 rounded-full text-sm font-medium">출혈</span>
              <span className="bg-cyan-400 text-white px-4 py-1.5 rounded-full text-sm font-medium">화상</span>
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-3">초기 활력징후</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="grid grid-cols-6 gap-4">
            {[
              { label: 'SBP', value: '121mmHg' },
              { label: 'DBP', value: '81mmHg' },
              { label: 'HR', value: '76bpm' },
              { label: 'RR', value: '17/min' },
              { label: 'SpO₂', value: '94%' },
              { label: 'Temp', value: '36.4°C' }
            ].map((vital, idx) => (
              <div key={idx} className="text-center">
                <p className="text-xs text-gray-500 mb-1">{vital.label}</p>
                <p className="text-base font-semibold text-white">{vital.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}