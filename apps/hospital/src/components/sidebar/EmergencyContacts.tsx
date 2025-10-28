import React from 'react';
import { Phone } from 'lucide-react';

export default function EmergencyContacts() {
  const contacts = [
    { name: '김선산 응급구조팀', phone: '010-4234-4234' },
    { name: '이순정 심리방아자', phone: '010-5678-9101' },
    { name: '박은정 외과의사', phone: '010-2345-6789' },
    { name: '최지은 내과의사', phone: '010-9876-5432' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <Phone className="w-6 h-6 text-blue-500" />
        <h2 className="text-lg font-bold text-gray-900">전문의 긴급 연락</h2>
      </div>
      <div className="space-y-2">
        {contacts.map((contact, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <span className="text-gray-700 text-sm">{contact.name}</span>
            <span className="text-gray-600 text-xs font-mono">{contact.phone}</span>
          </div>
        ))}
      </div>
    </div>
  );
}