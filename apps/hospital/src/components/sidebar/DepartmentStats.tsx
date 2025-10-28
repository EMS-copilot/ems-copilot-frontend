import React from 'react';
import { Activity } from 'lucide-react';

export default function DepartmentStats() {
  const departments = [
    { name: '수술실 (OR)', count: 1, available: true },
    { name: '음압실 양성', count: 3, available: true },
    { name: '중환자실(ICU)', count: 3, available: false },
    { name: '당직 전문의', count: 3, available: false }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-blue-500" />
        <h2 className="text-lg font-bold text-gray-900">병원 수용 능력</h2>
      </div>
      <div className="space-y-4">
        {departments.map((dept, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${dept.available ? 'bg-green-500' : 'bg-orange-500'} shadow-sm`}></div>
              <span className="text-gray-700 text-sm">{dept.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">{dept.count}</span>
              <span className="text-gray-600 text-sm">개</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}