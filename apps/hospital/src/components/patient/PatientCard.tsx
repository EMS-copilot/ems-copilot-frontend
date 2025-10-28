import React from 'react';
import { Phone } from 'lucide-react';

interface PatientCardProps {
  patient: {
    id: string;
    status: 'emergency' | 'urgent';
    tags: string[];
    vitals: {
      sbp: string;
      dbp: string;
      hr: string;
      rr: string;
      spo2: string;
      temp: string;
    };
  };
}

export default function PatientCard({ patient }: PatientCardProps) {
  const getTagColor = (index: number) => {
    const colors = ['bg-pink-400', 'bg-blue-400', 'bg-sky-400', 'bg-cyan-400'];
    return colors[index % colors.length];
  };

  return (
    <div className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm">
            고위험
          </button>
          <button className="bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm">
            응급
          </button>
        </div>
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
          <Phone className="w-4 h-4" />
          <span className="text-sm font-medium">구급차 연락</span>
        </button>
      </div>

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h4 className="text-2xl font-bold text-gray-900">{patient.id}</h4>
          <button className="border-2 border-gray-300 px-3 py-1 rounded-lg text-sm hover:bg-gray-50 transition-colors font-medium">
            프리뷰 ⬚
          </button>
        </div>
        <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
          <span className="text-lg">⊕</span>
          수용
        </button>
      </div>

      <div className="mb-5">
        <div className="flex items-center gap-4 mb-3">
          <p className="text-gray-600 text-sm">환자 증상도</p>
          <p className="text-gray-600 text-sm">주요 증상</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {patient.tags.map((tag, i) => (
            <span
              key={i}
              className={`px-3 py-1.5 rounded-full text-sm text-white font-medium ${getTagColor(i)}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-gray-600 text-sm mb-3 font-medium">초기 활력징후</p>
        <div className="grid grid-cols-6 gap-3">
          {[
            { label: 'SBP', value: patient.vitals.sbp },
            { label: 'DBP', value: patient.vitals.dbp },
            { label: 'HR', value: patient.vitals.hr },
            { label: 'RR', value: patient.vitals.rr },
            { label: 'SpO₂', value: patient.vitals.spo2 },
            { label: 'Temp', value: patient.vitals.temp }
          ].map((vital, idx) => (
            <div key={idx} className="text-center">
              <p className="text-xs text-gray-500 mb-1">{vital.label}</p>
              <p className="text-sm font-semibold text-gray-900">{vital.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}