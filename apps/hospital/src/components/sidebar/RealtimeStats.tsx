import React from 'react';
import { Clipboard } from 'lucide-react';

export default function RealtimeStats() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <Clipboard className="w-6 h-6 text-blue-500" />
        <h2 className="text-lg font-bold text-gray-900">실시간 현황</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">수용 건 수</p>
          <p className="text-4xl font-bold text-blue-600">24건</p>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">대기 건 수</p>
          <p className="text-4xl font-bold text-red-600">8분</p>
        </div>
      </div>
    </div>
  );
}