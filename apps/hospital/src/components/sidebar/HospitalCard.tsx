import React from 'react';
import { User } from 'lucide-react';

export default function HospitalCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <User className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-bold text-gray-900">A등급</h2>
      </div>
      <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white relative overflow-hidden shadow-lg">
        <h3 className="text-xl font-bold mb-1 leading-tight">충북대학교병원 응급의료센터</h3>
        <div className="flex items-center justify-between mt-6 text-sm opacity-90">
          <button className="hover:underline">대기 정보</button>
          <button className="hover:underline">병원 정보 수정</button>
        </div>
      </div>
    </div>
  );
}