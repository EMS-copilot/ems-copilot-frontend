import React from 'react';
import { Clipboard } from 'lucide-react';
import PatientCard from './patient/PatientCard';

interface Patient {
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
}

export default function PatientList() {
  const patients: Patient[] = [
    {
      id: 'P2024-001',
      status: 'urgent',
      tags: ['위급', '외상', '출혈', '화상'],
      vitals: {
        sbp: '121mmHg',
        dbp: '81mmHg',
        hr: '76bpm',
        rr: '17/min',
        spo2: '94%',
        temp: '36.4°C'
      }
    },
    {
      id: 'P2024-001',
      status: 'urgent',
      tags: ['위급', '외상', '출혈', '화상'],
      vitals: {
        sbp: '121mmHg',
        dbp: '81mmHg',
        hr: '76bpm',
        rr: '17/min',
        spo2: '94%',
        temp: '36.4°C'
      }
    },
    {
      id: 'P2024-002',
      status: 'emergency',
      tags: ['안정', '경미한 외상', '통증', '골절'],
      vitals: {
        sbp: '130mmHg',
        dbp: '85mmHg',
        hr: '80bpm',
        rr: '18/min',
        spo2: '96%',
        temp: '36.8°C'
      }
    },
    {
      id: 'P2024-002',
      status: 'emergency',
      tags: ['안정', '경미한 외상', '통증', '골절'],
      vitals: {
        sbp: '130mmHg',
        dbp: '85mmHg',
        hr: '80bpm',
        rr: '18/min',
        spo2: '96%',
        temp: '36.8°C'
      }
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clipboard className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-bold text-gray-900">요청받은 환자 목록</h3>
        </div>
        <span className="text-gray-500 text-sm">총 24건</span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {patients.map((patient, index) => (
          <PatientCard key={index} patient={patient} />
        ))}
      </div>
    </div>
  );
}