'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IncomingPatient } from './IncomingTable';
import { X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: IncomingPatient | null;
  onAction: (action: 'accept' | 'reject', reason?: string) => void;
}

export default function ActionModal({ isOpen, onClose, patient, onAction }: ActionModalProps) {
  const [selectedAction, setSelectedAction] = useState<'accept' | 'reject' | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [acceptNotes, setAcceptNotes] = useState('');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !patient) return null;

  const handleSubmit = () => {
    if (selectedAction === 'accept') {
      onAction('accept', acceptNotes);
    } else if (selectedAction === 'reject') {
      onAction('reject', rejectReason);
    }
    
    // 초기화
    setSelectedAction(null);
    setRejectReason('');
    setAcceptNotes('');
    onClose();
  };

  const isHighRisk = patient.urgency === 'critical';

  const rejectReasons = [
    'ICU 만실',
    '수술실 부족',
    '전문의 부재',
    '장비 고장',
    '격리 병상 부족',
    '기타',
  ];

  return (
    

      

      
      
        

          {/* 헤더 */}
          

            

              
환자 수용 결정

              

                환자 ID: {patient.id}
              


            

            
              
            
          


          {/* 환자 정보 */}
          

            

              

                도착 예상:
                {patient.eta}분
              

              

                중증도:
                
                  {patient.urgency === 'critical' ? '위급' :
                   patient.urgency === 'urgent' ? '긴급' : '일반'}
                
              

              

                의심 질환:
                {patient.condition}
              

              

                전문과:
                {patient.department}
              

            

          


          {/* 고위험 환자 경고 */}
          {isHighRisk && (
            

              
              

                고위험 환자는 거부할 수 없습니다. 반드시 수용해야 합니다.
              


            

          )}

          {/* 액션 선택 */}
          

            

               setSelectedAction('accept')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedAction === 'accept'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                }`}
              >
                
                
수용


              
              
               !isHighRisk && setSelectedAction('reject')}
                disabled={isHighRisk}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isHighRisk 
                    ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50'
                    : selectedAction === 'reject'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'
                }`}
              >
                
                
거부


              
            


            {/* 수용 시 메모 */}
            {selectedAction === 'accept' && (
              

                수용 메모 (선택)
                
 setAcceptNotes(e.target.value)}
                  placeholder="예: 즉시 수술 준비, ICU 대기 등"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>
            )}

            {/* 거부 사유 선택 */}
            {selectedAction === 'reject' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">거부 사유 (필수)</label>
                <div className="grid grid-cols-2 gap-2">
                  {rejectReasons.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setRejectReason(reason)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        rejectReason === reason
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-red-300'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
                {rejectReason === '기타' && (
                  <textarea
                    placeholder="거부 사유를 입력하세요"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows={2}
                  />
                )}
              </div>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedAction || (selectedAction === 'reject' && !rejectReason)}
              variant={selectedAction === 'accept' ? 'default' : 'destructive'}
            >
              확인
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}</pre>
        </div>

        <!-- Hospital Page -->
        <div class="file-section">
            <div class="file-path">apps/web/app/hospital/page.tsx</div>
            <pre>'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import IncomingTable, { IncomingPatient } from '@/components/IncomingTable';
import CapacityPanel from '@/components/CapacityPanel';
import ActionModal from '@/components/ActionModal';
import { logAudit } from '@/server/audit';
import { Badge } from '@/components/ui/badge';
import { Hospital as HospitalIcon, Activity, TrendingUp, Clock } from 'lucide-react';

export default function Hospital() {
  const [incomingPatients, setIncomingPatients] = useState<IncomingPatient[]>([
    {
      id: 'P-001',
      eta: 5,
      condition: '급성 심근경색',
      urgency: 'critical',
      department: '순환기내과',
      ems: '청주 구급대 01',
    },
    {
      id: 'P-002',
      eta: 12,
      condition: '다발성 외상',
      urgency: 'urgent',
      department: '외상외과',
      ems: '음성 구급대 03',
    },
    {
      id: 'P-003',
      eta: 20,
      condition: '급성 호흡곤란',
      urgency: 'normal',
      department: '호흡기내과',
      ems: '진천 구급대 02',
    },
  ]);

  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<IncomingPatient | null>(null);
  const [acceptanceHistory, setAcceptanceHistory] = useState<Array<{
    id: string;
    patient: string;
    action: 'accept' | 'reject';
    timestamp: string;
    reason?: string;
  }>>([]);

  const handlePatientAction = (patient: IncomingPatient) => {
    setSelectedPatient(patient);
    setShowActionModal(true);
  };

  const handleAction = async (action: 'accept' | 'reject', reason?: string) => {
    if (!selectedPatient) return;

    // 히스토리에 추가
    const historyEntry = {
      id: `h-${Date.now()}`,
      patient: selectedPatient.id,
      action,
      timestamp: new Date().toISOString(),
      reason,
    };
    setAcceptanceHistory([historyEntry, ...acceptanceHistory].slice(0, 10));

    // 환자 목록에서 제거
    setIncomingPatients(prev => prev.filter(p => p.id !== selectedPatient.id));

    // 감사 로그 기록
    // await logAudit({
    //   userId: 'hospital-admin',
    //   action: 'WRITE',
    //   resource: 'patient-acceptance',
    //   details: {
    //     patientId: selectedPatient.id,
    //     action,
    //     reason,
    //   },
    // });

    console.log('Patient action:', { patient: selectedPatient.id, action, reason });
    setShowActionModal(false);
    setSelectedPatient(null);
  };

  // 통계 계산
  const stats = {
    total: acceptanceHistory.length,
    accepted: acceptanceHistory.filter(h => h.action === 'accept').length,
    rejected: acceptanceHistory.filter(h => h.action === 'reject').length,
    acceptanceRate: acceptanceHistory.length > 0
      ? Math.round((acceptanceHistory.filter(h => h.action === 'accept').length / acceptanceHistory.length) * 100)
      : 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <HospitalIcon className="h-8 w-8 text-blue-600" />
              병원 관리 시스템
            </h1>
            <p className="text-gray-600 mt-1">충북대학교병원</p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            운영 시간: 24/7
          </Badge>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">오늘 수용</p>
                  <p className="text-2xl font-bold">{stats.accepted}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">오늘 거부</p>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                </div>
                <Activity className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">수용률</p>
                  <p className="text-2xl font-bold">{stats.acceptanceRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">대기 중</p>
                  <p className="text-2xl font-bold">{incomingPatients.length}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* 접근 중인 환자 */}
            <IncomingTable
              patients={incomingPatients}
              onAction={handlePatientAction}
            />

            {/* 최근 수용 이력 */}
            <Card>
              <CardHeader>
                <CardTitle>최근 수용 이력</CardTitle>
              </CardHeader>
              <CardContent>
                {acceptanceHistory.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    아직 처리된 환자가 없습니다
                  </p>
                ) : (
                  <div className="space-y-2">
                    {acceptanceHistory.slice(0, 5).map((history) => (
                      <div
                        key={history.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={history.action === 'accept' ? 'success' : 'destructive'}
                          >
                            {history.action === 'accept' ? '수용' : '거부'}
                          </Badge>
                          <span className="font-medium">{history.patient}</span>
                          {history.reason && (
                            <span className="text-sm text-gray-600">
                              ({history.reason})
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(history.timestamp).toLocaleTimeString('ko-KR')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 수용 능력 패널 */}
          <div>
            <CapacityPanel />
          </div>
        </div>

        {/* 액션 모달 */}
        <ActionModal
          isOpen={showActionModal}
          onClose={() => setShowActionModal(false)}
          patient={selectedPatient}
          onAction={handleAction}
        />
      </div>
    </div>
  );
}</pre>
        </div>

        <!-- Docs Page -->
        <div class="file-section">
            <div class="file-path">apps/web/app/docs/page.tsx</div>
            <pre>'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Code, Copy, Check, Terminal, Book } from 'lucide-react';

export default function Docs() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const apiEndpoints = [
    {
      method: 'POST',
      path: '/api/encounters',
      description: '환자 접촉 기록 생성',
      body: `{
  "patientId": "string",
  "location": {
    "lat": number,
    "lng": number
  },
  "condition": "cardiac|trauma|respiratory|stroke|other"
}`,
      response: `{
  "message": "환자 접촉 기록이 성공적으로 생성되었습니다",
  "encounterId": "string",
  "timestamp": "ISO 8601"
}`,
    },
    {
      method: 'POST',
      path: '/api/recommend',
      description: '병원 추천 요청',
      body: `{
  "encounterId": "string",
  "urgency": "critical|urgent|normal",
  "location": {
    "lat": number,
    "lng": number
  }
}`,
      response: `{
  "encounterId": "string",
  "timestamp": "ISO 8601",
  "policy": {
    "highRisk": boolean,
    "rejectAllowed": boolean
  },
  "recommendations": [
    {
      "rank": number,
      "hospitalId": "string",
      "name": "string",
      "eta": number,
      "acceptProbability": number,
      "doorToTreatment": number,
      "reasons": ["string"]
    }
  ]
}`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            API 문서
          </h1>
          <p className="text-gray-600 mt-2">
            EMS Copilot Korea RESTful API 가이드
          </p>
        </div>

        {/* 개요 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>API 개요</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">기본 URL</h3>
              <code className="bg-gray-100 px-3 py-1 rounded">
                {process.env.NEXT_PUBLIC_API_URL || 'https://api.ems-copilot.kr'}
              </code>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">인증</h3>
              <p className="text-gray-600">
                모든 API 요청은 Authorization 헤더에 Bearer 토큰을 포함해야 합니다.
              </p>
              <code className="bg-gray-100 px-3 py-1 rounded block mt-2">
                Authorization: Bearer YOUR_API_TOKEN
              </code>
            </div>

            <div>
              <h3 className="font-semibold mb-2">응답 형식</h3>
              <p className="text-gray-600">
                모든 응답은 JSON 형식으로 반환되며, 타임스탬프는 ISO 8601 형식을 따릅니다.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">오류 응답</h3>
              <code className="bg-gray-100 px-3 py-1 rounded block">
{`{
  "error": "오류 메시지",
  "code": 400
}`}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* 엔드포인트 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>API 엔드포인트</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {apiEndpoints.map((endpoint, index) => (
                <div key={index} className="border-b pb-6 last:border-0">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge
                      variant={endpoint.method === 'POST' ? 'default' : 'outline'}
                    >
                      {endpoint.method}
                    </Badge>
                    <code className="font-mono text-sm">{endpoint.path}</code>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{endpoint.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">요청 본문</h4>
                        <button
                          onClick={() => copyToClipboard(endpoint.body, `req-${index}`)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {copiedSection === `req-${index}` ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                      <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto">
                        {endpoint.body}
                      </pre>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">응답 예시</h4>
                        <button
                          onClick={() => copyToClipboard(endpoint.response, `res-${index}`)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {copiedSection === `res-${index}` ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                      <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto">
                        {endpoint.response}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SDK */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>SDK 설치</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="h-5 w-5" />
                <h3 className="font-semibold">Node.js</h3>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg">
{`npm install @ems-copilot/sdk
# or
yarn add @ems-copilot/sdk`}
              </pre>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Code className="h-5 w-5" />
                <h3 className="font-semibold">Python</h3>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg">
{`pip install ems-copilot-sdk`}
              </pre>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Book className="h-5 w-5" />
                <h3 className="font-semibold">사용 예시</h3>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm">
{`import { EMSClient } from '@ems-copilot/sdk';

const client = new EMSClient({
  apiKey: 'YOUR_API_KEY',
  region: '충북'
});

// 환자 접촉 기록
const encounter = await client.createEncounter({
  patientId: 'P-001',
  location: { lat: 36.6424, lng: 127.4890 },
  condition: 'cardiac'
});

// 병원 추천 요청
const recommendations = await client.getRecommendations({
  encounterId: encounter.id,
  urgency: 'critical',
  location: { lat: 36.6424, lng: 127.4890 }
});`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* OpenAPI 스펙 */}
        <Card>
          <CardHeader>
            <CardTitle>OpenAPI Specification</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              OpenAPI 3.0 스펙을 다운로드하여 Postman, Insomnia 등의 도구에서 사용할 수 있습니다.
            </p>
            <div className="flex gap-3">
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                OpenAPI Spec 다운로드
              </Button>
              <Button variant="outline">
                <Code className="h-4 w-4 mr-2" />
                Postman Collection
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>주의:</strong> 프로덕션 환경에서는 반드시 HTTPS를 사용하고, 
                API 키를 안전하게 관리하세요. 클라이언트 사이드 코드에 API 키를 
                노출하지 마세요.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}</pre>
        </div>

        <!-- CI/CD -->
        <div class="file-section">
            <div class="file-path">.github/workflows/ci.yml</div>
            <pre>name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  lint:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: apps/web/package-lock.json
    
    - name: Install dependencies
      run: |
        cd apps/web
        npm ci
    
    - name: Run ESLint
      run: |
        cd apps/web
        npm run lint

  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: apps/web/package-lock.json
    
    - name: Install dependencies
      run: |
        cd apps/web
        npm ci
    
    - name: Run tests
      run: |
        cd apps/web
        npm test

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: apps/web/package-lock.json
    
    - name: Install dependencies
      run: |
        cd apps/web
        npm ci
    
    - name: Build application
      run: |
        cd apps/web
        npm run build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: apps/web/.next/</pre>
        </div>

        <!-- Next Config -->
        <div class="file-section">
            <div class="file-path">apps/web/next.config.js</div>
            <pre>/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // 환경 변수
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
  },
  
  // 이미지 최적화
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // 헤더 설정
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  
  // 리다이렉트
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/hospital',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;</pre>
        </div>

        <!-- TSConfig -->
        <div class="file-section">
            <div class="file-path">apps/web/tsconfig.json</div>
            <pre>{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}</pre>
        </div>

        <!-- Modal Component -->
        <div class="file-section">
            <div class="file-path">apps/web/components/ui/modal.tsx</div>
            <pre>import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};</pre>
        </div>

        <!-- Data Schema Documentation -->
        <div class="file-section">
            <div class="file-path">docs/data_schema.md</div>
            <pre># 데이터 스키마 문서

## 개요
EMS Copilot Korea 시스템의 데이터 구조 및 스키마 정의

## 1. 핵심 엔티티

### 1.1 Patient (환자)
```typescript
interface Patient {
  id: string;                    // 환자 고유 ID
  location: Location;             // 현재 위치
  condition: Condition;           // 의심 질환
  urgency: Urgency;              // 긴급도
  timestamp: string;             // 접촉 시간 (ISO 8601)
  metadata?: {
    age?: number;                // 나이
    gender?: 'M' | 'F' | 'O';   // 성별
    vitalSigns?: VitalSigns;     // 생체 신호
  };
}
```

### 1.2 Hospital (병원)
```typescript
interface Hospital {
  hospitalId: string;             // 병원 고유 ID
  name: string;                   // 병원명
  location: Location;             // 병원 위치
  capacity: HospitalCapacity;     // 수용 능력
  specialties: Specialty[];       // 전문 분야
  contactInfo: ContactInfo;       // 연락처 정보
}
```

### 1.3 Encounter (환자 접촉)
```typescript
interface Encounter {
  encounterId: string;            // 접촉 고유 ID
  patientId: string;              // 환자 ID
  timestamp: string;              // 접촉 시간
  location: Location;             // 접촉 위치
  emsTeamId: string;             // 구급대 ID
  status: EncounterStatus;       // 상태
  hospitalId?: string;           // 배정된 병원 ID
}
```

## 2. 타입 정의

### 2.1 기본 타입
```typescript
type Region = '충북' | '충남';
type Urgency = 'critical' | 'urgent' | 'normal';
type Condition = 'cardiac' | 'trauma' | 'respiratory' | 'stroke' | 'other';
type EncounterStatus = 'active' | 'transporting' | 'completed' | 'cancelled';
```

### 2.2 위치 정보
```typescript
interface Location {
  lat: number;      // 위도 (-90 ~ 90)
  lng: number;      // 경도 (-180 ~ 180)
  address?: string; // 주소 (선택)
}
```

### 2.3 병원 수용 능력
```typescript
interface HospitalCapacity {
  or: number;           // 수술실 가용 수
  icu: number;          // ICU 가용 병상
  specialists: number;   // 전문의 수
  emergencyBeds: number; // 응급 병상 수
  lastUpdated: string;  // 마지막 업데이트 시간
}
```

## 3. API 응답 스키마

### 3.1 추천 응답
```typescript
interface RecommendationResponse {
  encounterId: string;
  timestamp: string;
  policy: Policy;
  recommendations: Recommendation[];
}

interface Recommendation {
  rank: number;                  // 추천 순위
  hospitalId: string;            // 병원 ID
  name: string;                  // 병원명
  eta: number;                   // 도착 예상 시간 (분)
  acceptProbability: number;     // 수용 확률 (0-100)
  doorToTreatment: number;       // 치료 시작까지 시간 (분)
  reasons: string[];             // 추천 사유
}
```

### 3.2 정책 정보
```typescript
interface Policy {
  highRisk: boolean;      // 고위험 환자 여부
  rejectAllowed: boolean; // 거부 가능 여부
  priorityLevel?: number; // 우선순위 레벨 (1-5)
}
```

## 4. 감사 로그 스키마

```typescript
interface AuditLog {
  logId: string;           // 로그 ID
  userId: string;          // 사용자 ID
  action: AuditAction;     // 수행 작업
  resource: string;        // 대상 리소스
  timestamp: string;       // 시간
  ipAddress?: string;      // IP 주소
  userAgent?: string;      // User Agent
  details?: any;          // 상세 정보 (JSON)
}

type AuditAction = 'READ' | 'WRITE' | 'DELETE' | 'ADMIN';
```

## 5. 통계 데이터 스키마

### 5.1 KPI 데이터
```typescript
interface KPIData {
  region: Region;
  month: string;          // YYYY-MM
  dispatch: number;       // 출동 건수
  transport: number;      // 이송 건수
  patients: number;       // 환자 수
  acceptanceRate: number; // 수용률 (%)
  avgResponseTime: number; // 평균 응답 시간 (분)
}
```

### 5.2 성과 지표
```typescript
interface PerformanceMetrics {
  hospitalId: string;
  period: string;           // YYYY-MM
  totalAccepted: number;    // 총 수용 환자
  totalRejected: number;    // 총 거부 환자
  avgProcessingTime: number; // 평균 처리 시간
  criticalCaseRate: number; // 중증 환자 비율
}
```

## 6. 실시간 이벤트 스키마

```typescript
interface RealtimeEvent {
  eventId: string;
  type: EventType;
  timestamp: string;
  data: EventData;
}

type EventType = 
  | 'patient.new'
  | 'patient.assigned'
  | 'hospital.accept'
  | 'hospital.reject'
  | 'transport.started'
  | 'transport.completed';

interface EventData {
  patientId?: string;
  hospitalId?: string;
  encounterId?: string;
  message: string;
  severity?: 'info' | 'warning' | 'error';
}
```

## 7. 데이터 검증 규칙

### 7.1 필수 필드
- 모든 ID 필드는 UUID v4 형식
- 타임스탬프는 ISO 8601 형식
- 위도/경도는 유효한 범위 내

### 7.2 비즈니스 규칙
- 고위험 환자는 거부 불가
- ETA는 1-120분 범위
- 수용 확률은 0-100% 범위
- 병원 수용 능력은 음수 불가

## 8. 데이터베이스 인덱스

권장 인덱스:
- encounters: (patientId, timestamp)
- hospitals: (location, capacity)
- audit_logs: (userId, timestamp)
- metrics: (hospitalId, period)</pre>
        </div>

        <!-- Metrics Documentation -->
        <div class="file-section">
            <div class="file-path">docs/metrics.md</div>
            <pre># 성과 지표 및 메트릭스

## 1. 핵심 성과 지표 (KPIs)

### 1.1 운영 지표

#### 응답 시간 메트릭
- **평균 응답 시간**: 신고 접수부터 현장 도착까지의 평균 시간
- **목표**: 도시 지역 8분 이내, 농촌 지역 15분 이내
- **계산**: `AVG(arrival_time - dispatch_time)`

#### 이송 성공률
- **정의**: 전체 출동 대비 성공적인 병원 이송 비율
- **목표**: 95% 이상
- **계산**: `(successful_transports / total_dispatches) * 100`

#### 병원 수용률
- **정의**: 추천된 병원의 환자 수용 비율
- **목표**: 첫 번째 추천 90% 이상
- **계산**: `(accepted_patients / recommended_patients) * 100`

### 1.2 품질 지표

#### Door-to-Treatment 시간
- **정의**: 병원 도착부터 치료 시작까지의 시간
- **목표**: 
  - 심장질환: 90분 이내
  - 뇌졸중: 60분 이내
  - 외상: 30분 이내

#### 재배치율
- **정의**: 첫 병원 거부 후 재배치된 환자 비율
- **목표**: 10% 미만
- **계산**: `(reassigned_patients / total_patients) * 100`

## 2. 시스템 성능 메트릭

### 2.1 API 성능
```yaml
추천 API 응답 시간:
  - P50: < 200ms
  - P95: < 500ms
  - P99: < 1000ms

가용성:
  - 목표: 99.9% (연간 다운타임 < 8.76시간)
  - 측정: 5분 단위 health check

처리량:
  - 목표: 1,000 requests/second
  - 피크 시간: 18:00-22:00
```

### 2.2 데이터 품질
```yaml
데이터 정확도:
  - GPS 위치 정확도: ±50m
  - 병원 정보 업데이트 주기: 5분
  - 수용 능력 정확도: 95% 이상

데이터 완전성:
  - 필수 필드 입력률: 100%
  - 선택 필드 입력률: > 80%
```

## 3. 병원별 성과 지표

### 3.1 수용 성과
```typescript
interface HospitalPerformance {
  hospitalId: string;
  period: 'daily' | 'weekly' | 'monthly';
  metrics: {
    totalRequests: number;       // 총 요청 수
    acceptedRequests: number;    // 수용 건수
    rejectedRequests: number;    // 거부 건수
    acceptanceRate: number;      // 수용률 (%)
    avgResponseTime: number;     // 평균 응답 시간 (초)
    criticalCaseRate: number;    // 중증 환자 비율 (%)
  };
}
```

### 3.2 효율성 지표
- **병상 회전율**: 일일 퇴원 환자 / 총 병상 수
- **평균 재원 시간**: 응급실 체류 시간
- **전문의 활용률**: 전문의 진료 시간 / 근무 시간

## 4. 지역별 통계

### 4.1 충북 지역
```yaml
월별 목표:
  - 출동 건수: 1,500건
  - 이송 성공률: 95%
  - 평균 응답 시간: 10분

주요 병원:
  - 충북대학교병원 (Level 1 Trauma Center)
  - 청주성모병원 (Cardiac Center)
  - 한국병원 (General Emergency)
```

### 4.2 충남 지역
```yaml
월별 목표:
  - 출동 건수: 1,800건
  - 이송 성공률: 93%
  - 평균 응답 시간: 12분

주요 병원:
  - 단국대병원 (Level 1 Trauma Center)
  - 순천향대병원 (Stroke Center)
  - 건양대병원 (General Emergency)
```

## 5. 실시간 모니터링 대시보드

### 5.1 실시간 지표
- 활성 출동 건수
- 대기 중인 환자 수
- 병원별 가용 병상
- 평균 ETA
- 시스템 상태

### 5.2 알림 임계값
```yaml
Critical Alerts:
  - 응답 시간 > 15분
  - 수용률 < 80%
  - API 응답 시간 > 2초
  - 시스템 가용성 < 99%

Warning Alerts:
  - 응답 시간 > 12분
  - 수용률 < 90%
  - API 응답 시간 > 1초
  - 대기 큐 > 10건
```

## 6. 보고서 템플릿

### 6.1 일일 보고서
```markdown
## 일일 운영 보고서 - [날짜]

### 요약
- 총 출동: XX건
- 이송 완료: XX건
- 평균 응답 시간: XX분
- 수용률: XX%

### 주요 이슈
- [이슈 1]
- [이슈 2]

### 개선 사항
- [개선 1]
- [개선 2]
```

### 6.2 월간 보고서
- 전월 대비 성과 비교
- 병원별 성과 순위
- 지역별 통계 분석
- 시스템 개선 권고사항

## 7. 데이터 수집 및 분석

### 7.1 데이터 수집 포인트
1. 신고 접수 시점
2. 구급차 출발 시점
3. 현장 도착 시점
4. 병원 추천 요청 시점
5. 병원 수용/거부 결정 시점
6. 병원 도착 시점
7. 치료 시작 시점

### 7.2 분석 도구
- Elasticsearch: 로그 분석
- Grafana: 실시간 모니터링
- Tableau: 비즈니스 인텔리전스
- Python/R: 통계 분석

## 8. 개선 목표 (2025)

### Q1 목표
- 평균 응답 시간 10% 단축
- 첫 번째 추천 수용률 95% 달성
- API 응답 시간 20% 개선

### Q2 목표
- AI 추천 정확도 90% 달성
- 재배치율 5% 미만
- 모바일 앱 출시

### 연간 목표
- 전국 확대 (경기, 강원 지역)
- 드론 연계 시범 운영
- 예측 분석 모델 도입</pre>
        </div>

        <!-- Simulator Documentation -->
        <div class="file-section">
            <div class="file-path">scripts/simulator.md</div>
            <pre># EMS 시뮬레이터 스크립트

## 개요
응급의료 시스템의 부하 테스트 및 시뮬레이션을 위한 스크립트

## 1. 환자 생성 시뮬레이터

### 1.1 기본 사용법
```bash
# 단일 환자 생성
npm run simulate:patient

# 다수 환자 생성 (부하 테스트)
npm run simulate:load --patients=100 --interval=1000
```

### 1.2 시뮬레이션 스크립트
```typescript
// scripts/simulate-patients.ts
import axios from 'axios';
import { faker } from '@faker-js/faker';

interface SimulationConfig {
  apiUrl: string;
  numPatients: number;
  interval: number; // milliseconds
  region: '충북' | '충남';
}

class PatientSimulator {
  private config: SimulationConfig;
  private conditions = ['cardiac', 'trauma', 'respiratory', 'stroke', 'other'];
  private urgencies = ['critical', 'urgent', 'normal'];

  constructor(config: SimulationConfig) {
    this.config = config;
  }

  generatePatient() {
    return {
      patientId: `SIM-${faker.string.alphanumeric(8)}`,
      location: this.generateLocation(),
      condition: faker.helpers.arrayElement(this.conditions),
      urgency: this.generateUrgency(),
      metadata: {
        age: faker.number.int({ min: 1, max: 100 }),
        gender: faker.helpers.arrayElement(['M', 'F', 'O']),
      }
    };
  }

  private generateLocation() {
    // 충북/충남 지역 좌표 범위
    const bounds = {
      충북: {
        latMin: 36.0, latMax: 37.3,
        lngMin: 127.2, lngMax: 128.7
      },
      충남: {
        latMin: 35.8, latMax: 37.1,
        lngMin: 125.6, lngMax: 127.7
      }
    };

    const regionBounds = bounds[this.config.region];
    return {
      lat: faker.number.float({
        min: regionBounds.latMin,
        max: regionBounds.latMax,
        precision: 0.0001
      }),
      lng: faker.number.float({
        min: regionBounds.lngMin,
        max: regionBounds.lngMax,
        precision: 0.0001
      })
    };
  }

  private generateUrgency() {
    // 가중치 기반 긴급도 생성
    const random = Math.random();
    if (random < 0.1) return 'critical';  // 10%
    if (random < 0.4) return 'urgent';    // 30%
    return 'normal';                      // 60%
  }

  async simulate() {
    console.log(`시뮬레이션 시작: ${this.config.numPatients}명 환자 생성`);
    
    for (let i = 0; i < this.config.numPatients; i++) {
      const patient = this.generatePatient();
      
      try {
        // 환자 접촉 기록 생성
        const encounterResponse = await axios.post(
          `${this.config.apiUrl}/api/encounters`,
          patient
        );
        
        const encounterId = encounterResponse.data.encounterId;
        console.log(`✅ 환자 ${i + 1}/${this.config.numPatients} 생성: ${encounterId}`);
        
        // 병원 추천 요청
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const recommendResponse = await axios.post(
          `${this.config.apiUrl}/api/recommend`,
          {
            encounterId,
            urgency: patient.urgency,
            location: patient.location
          }
        );
        
        console.log(`   추천 병원: ${recommendResponse.data.recommendations[0]?.name}`);
        
      } catch (error) {
        console.error(`❌ 환자 ${i + 1} 생성 실패:`, error.message);
      }
      
      // 다음 환자 생성까지 대기
      await new Promise(resolve => setTimeout(resolve, this.config.interval));
    }
    
    console.log('시뮬레이션 완료');
  }
}

// 실행
const simulator = new PatientSimulator({
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  numPatients: parseInt(process.env.NUM_PATIENTS || '10'),
  interval: parseInt(process.env.INTERVAL || '2000'),
  region: (process.env.REGION || '충북') as '충북' | '충남'
});

simulator.simulate();
```

## 2. 병원 응답 시뮬레이터

### 2.1 사용법
```bash
# 병원 응답 시뮬레이션
npm run simulate:hospital --accept-rate=0.8 --response-time=30
```

### 2.2 병원 시뮬레이터
```typescript
// scripts/simulate-hospital.ts
class HospitalSimulator {
  private acceptanceRate: number;
  private avgResponseTime: number;

  constructor(acceptanceRate = 0.8, avgResponseTime = 30) {
    this.acceptanceRate = acceptanceRate;
    this.avgResponseTime = avgResponseTime;
  }

  async simulateResponse(patientId: string) {
    // 응답 시간 시뮬레이션 (정규 분포)
    const responseTime = this.normalDistribution(
      this.avgResponseTime,
      this.avgResponseTime * 0.3
    );
    
    await new Promise(resolve => setTimeout(resolve, responseTime * 1000));
    
    // 수용/거부 결정
    const accept = Math.random() < this.acceptanceRate;
    
    if (accept) {
      return {
        action: 'accept',
        message: '환자 수용 가능',
        estimatedArrival: Math.floor(Math.random() * 20) + 5
      };
    } else {
      const reasons = [
        'ICU 만실',
        '수술실 부족',
        '전문의 부재',
        '장비 고장'
      ];
      
      return {
        action: 'reject',
        reason: reasons[Math.floor(Math.random() * reasons.length)]
      };
    }
  }

  private normalDistribution(mean: number, stdDev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * stdDev + mean;
  }
}
```

## 3. 시스템 부하 테스트

### 3.1 Artillery 설정
```yaml
# artillery-config.yml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 300
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Peak load"
  
scenarios:
  - name: "Patient Flow"
    flow:
      - post:
          url: "/api/encounters"
          json:
            patientId: "{{ $randomString() }}"
            location:
              lat: "{{ $randomNumber(36, 37) }}"
              lng: "{{ $randomNumber(127, 128) }}"
            condition: "{{ $randomString() }}"
      
      - think: 2
      
      - post:
          url: "/api/recommend"
          json:
            encounterId: "{{ encounterId }}"
            urgency: "urgent"
            location:
              lat: "{{ $randomNumber(36, 37) }}"
              lng: "{{ $randomNumber(127, 128) }}"
```

### 3.2 실행
```bash
# Artillery 부하 테스트
npx artillery run artillery-config.yml

# 리포트 생성
npx artillery report artillery-report.json
```

## 4. 데이터 생성 스크립트

### 4.1 CSV 데이터 생성
```typescript
// scripts/generate-csv.ts
import * as fs from 'fs';
import * as path from 'path';
import { format } from 'date-fns';

function generateMonthlyData(region: string, year: number) {
  const data = [];
  
  for (let month = 1; month <= 12; month++) {
    const baseDispatch = region === '충북' ? 1200 : 1400;
    const variance = Math.random() * 200 - 100;
    
    const dispatch = Math.floor(baseDispatch + variance);
    const transport = Math.floor(dispatch * (0.92 + Math.random() * 0.06));
    const patients = Math.floor(transport * (0.95 + Math.random() * 0.03));
    
    data.push({
      region,
      month: format(new Date(year, month - 1), 'yyyy-MM'),
      dispatch,
      transport,
      patients
    });
  }
  
  return data;
}

function generateCSV() {
  const headers = ['region', 'month', 'dispatch', 'transport', 'patients'];
  const rows = [];
  
  // 2024-2025 데이터 생성
  rows.push(...generateMonthlyData('충북', 2024));
  rows.push(...generateMonthlyData('충남', 2024));
  rows.push(...generateMonthlyData('충북', 2025).slice(0, 4));
  rows.push(...generateMonthlyData('충남', 2025).slice(0, 4));
  
  const csv = [
    headers.join(','),
    ...rows.map(row => Object.values(row).join(','))
  ].join('\n');
  
  const outputPath = path.join(
    __dirname,
    '../public/mnt/data/ems_pack/ems_chungcheong_2024-2025_mock.csv'
  );
  
  fs.writeFileSync(outputPath, csv);
  console.log(`CSV 파일 생성 완료: ${outputPath}`);
}

generateCSV();
```

## 5. 모니터링 스크립트

### 5.1 실시간 모니터링
```typescript
// scripts/monitor.ts
import WebSocket from 'ws';
import blessed from 'blessed';

class SystemMonitor {
  private screen: any;
  private widgets: Map<string, any>;

  constructor() {
    this.screen = blessed.screen({
      smartCSR: true,
      title: 'EMS System Monitor'
    });
    
    this.widgets = new Map();
    this.setupWidgets();
  }

  setupWidgets() {
    // 실시간 통계
    this.widgets.set('stats', blessed.box({
      label: '실시간 통계',
      top: 0,
      left: 0,
      width: '50%',
      height: '50%',
      border: { type: 'line' },
      style: {
        border: { fg: 'cyan' }
      }
    }));

    // 이벤트 로그
    this.widgets.set('events', blessed.log({
      label: '이벤트 로그',
      top: 0,
      left: '50%',
      width: '50%',
      height: '100%',
      border: { type: 'line' },
      scrollable: true,
      mouse: true
    }));

    // API 성능
    this.widgets.set('performance', blessed.box({
      label: 'API 성능',
      top: '50%',
      left: 0,
      width: '50%',
      height: '50%',
      border: { type: 'line' }
    }));

    // 화면에 위젯 추가
    this.widgets.forEach(widget => this.screen.append(widget));
    
    // ESC 키로 종료
    this.screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
  }

  connect() {
    const ws = new WebSocket('ws://localhost:3000/ws');
    
    ws.on('message', (data: string) => {
      const event = JSON.parse(data);
      this.updateDisplay(event);
    });
  }

  updateDisplay(event: any) {
    // 이벤트 로그 업데이트
    const eventLog = this.widgets.get('events');
    eventLog.log(`[${new Date().toISOString()}] ${event.type}: ${event.message}`);
    
    // 통계 업데이트
    if (event.type === 'stats') {
      const stats = this.widgets.get('stats');
      stats.setContent(`
        활성 출동: ${event.data.activeDispatches}
        대기 환자: ${event.data.queueLength}
        평균 ETA: ${event.data.avgEta}분
        수용률: ${event.data.acceptanceRate}%
      `);
    }
    
    this.screen.render();
  }

  start() {
    this.connect();
    this.screen.render();
  }
}

const monitor = new SystemMonitor();
monitor.start();
```

## 6. 실행 명령어

package.json에 추가할 스크립트:
```json
{
  "scripts": {
    "simulate:patient": "ts-node scripts/simulate-patients.ts",
    "simulate:load": "ts-node scripts/simulate-patients.ts",
    "simulate:hospital": "ts-node scripts/simulate-hospital.ts",
    "generate:csv": "ts-node scripts/generate-csv.ts",
    "monitor": "ts-node scripts/monitor.ts",
    "test:load": "artillery run artillery-config.yml"
  }
}
```</pre>
        </div>

        <!-- Test Files -->
        <div class="file-section">
            <div class="file-path">apps/web/__tests__/api.test.ts</div>
            <pre>import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/encounters/route';

describe('/api/encounters', () => {
  describe('POST', () => {
    it('should create a new encounter with valid data', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          patientId: 'P-001',
          location: { lat: 36.6424, lng: 127.4890 },
          condition: 'cardiac',
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(201);
      const jsonData = JSON.parse(res._getData());
      expect(jsonData).toHaveProperty('encounterId');
      expect(jsonData).toHaveProperty('timestamp');
      expect(jsonData.message).toBe('환자 접촉 기록이 성공적으로 생성되었습니다');
    });

    it('should return 400 for missing required fields', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          patientId: 'P-001',
          // location 누락
          condition: 'cardiac',
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const jsonData = JSON.parse(res._getData());
      expect(jsonData).toHaveProperty('error');
      expect(jsonData.code).toBe(400);
    });

    it('should return 400 for invalid condition value', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          patientId: 'P-001',
          location: { lat: 36.6424, lng: 127.4890 },
          condition: 'invalid-condition',
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const jsonData = JSON.parse(res._getData());
      expect(jsonData.error).toContain('유효하지 않은 condition');
    });
  });
});

describe('/api/recommend', () => {
  describe('POST', () => {
    it('should return recommendations for valid request', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          encounterId: 'E-001',
          urgency: 'critical',
          location: { lat: 36.6424, lng: 127.4890 },
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const jsonData = JSON.parse(res._getData());
      expect(jsonData).toHaveProperty('recommendations');
      expect(jsonData).toHaveProperty('policy');
      expect(jsonData.recommendations).toBeInstanceOf(Array);
      expect(jsonData.recommendations.length).toBeGreaterThan(0);
    });

    it('should set policy.rejectAllowed to false for critical patients', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          encounterId: 'E-001',
          urgency: 'critical',
          location: { lat: 36.6424, lng: 127.4890 },
        },
      });

      await handler(req, res);

      const jsonData = JSON.parse(res._getData());
      expect(jsonData.policy.highRisk).toBe(true);
      expect(jsonData.policy.rejectAllowed).toBe(false);
    });

    it('should set policy.rejectAllowed to true for non-critical patients', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          encounterId: 'E-001',
          urgency: 'normal',
          location: { lat: 36.6424, lng: 127.4890 },
        },
      });

      await handler(req, res);

      const jsonData = JSON.parse(res._getData());
      expect(jsonData.policy.highRisk).toBe(false);
      expect(jsonData.policy.rejectAllowed).toBe(true);
    });
  });
});</pre>
        </div>

        <!-- Jest Config -->
        <div class="file-section">
            <div class="file-path">apps/web/jest.config.js</div>
            <pre>const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Handle module aliases
    '^@/(.*)
            <pre># EMS Copilot Korea 🚨

충청권 응급의료 라우팅 및 병원 연계 시스템

## 📋 프로젝트 개요

EMS Copilot Korea는 충청권(충북/충남) 지역의 응급환자 이송을 최적화하는 지능형 라우팅 시스템입니다. 
실시간 병원 수용 능력과 AI 기반 추천 알고리즘을 활용하여 응급환자를 가장 적합한 병원으로 신속하게 연계합니다.

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.0 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 프로젝트 클론
git clone https://github.com/your-org/ems-copilot.git
cd ems-copilot

# 의존성 설치
cd apps/web
npm install

# 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일을 열어 필요한 API 키 입력

# 개발 서버 실행
npm run dev
```

개발 서버는 http://localhost:3000 에서 실행됩니다.

## 🏗 프로젝트 구조

```
ems-copilot/
├── apps/
│   └── web/                 # Next.js 웹 애플리케이션
│       ├── app/             # App Router 페이지 및 API
│       ├── components/      # React 컴포넌트
│       ├── lib/            # 유틸리티 및 데이터 레이어
│       └── server/         # 서버 사이드 로직
├── docs/                   # 문서
└── scripts/                # 유틸리티 스크립트
```

## 📡 API 엔드포인트

### POST /api/encounters
환자 접촉 기록 생성

```json
{
  "patientId": "string",
  "location": { "lat": number, "lng": number },
  "condition": "cardiac|trauma|respiratory|stroke|other"
}
```

### POST /api/recommend
병원 추천 요청

```json
{
  "encounterId": "string",
  "urgency": "critical|urgent|normal",
  "location": { "lat": number, "lng": number }
}
```

## 📊 데이터 스키마

### CSV 데이터 구조
- `region`: 지역 (충북/충남)
- `month`: 년월 (YYYY-MM)
- `dispatch`: 출동 건수
- `transport`: 이송 건수
- `patients`: 환자 수

## 🧪 테스트

```bash
# 린트 실행
npm run lint

# 테스트 실행
npm test

# 빌드
npm run build
```

## 🔧 확장 계획

### 단기 (1-3개월)
- [ ] Azure OpenAI GPT-4 통합 (지능형 추천)
- [ ] Kakao/Naver Maps API 연동 (실시간 지도)
- [ ] PostgreSQL 데이터베이스 연동
- [ ] 실시간 WebSocket 통신

### 중기 (3-6개월)
- [ ] 음성 인식 (STT) 통합
- [ ] 모바일 앱 개발 (React Native)
- [ ] 예측 분석 대시보드
- [ ] 다국어 지원 (i18n)

### 장기 (6-12개월)
- [ ] 전국 확대 적용
- [ ] AI 기반 수요 예측
- [ ] 드론 연계 시스템
- [ ] 블록체인 감사 로그

## 🔐 보안 및 규정 준수

- 의료법 및 개인정보보호법 준수
- HIPAA 호환 설계
- 암호화된 데이터 전송 (TLS 1.3)
- 감사 로그 및 접근 제어

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

기여를 환영합니다! PR을 제출하기 전에 다음 사항을 확인해주세요:
- 코드 스타일 가이드라인 준수
- 테스트 코드 작성
- 문서 업데이트

## 📞 문의

- 이메일: ems-support@example.com
- 이슈 트래커: [GitHub Issues](https://github.com/your-org/ems-copilot/issues)

---

© 2024 EMS Copilot Korea. All rights reserved.</pre>
        </div>

        <div class="file-section">
            <div class="file-path">apps/web/tailwind.config.ts</div>
            <pre>import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;</pre>
        </div>

        <div class="file-section">
            <div class="file-path">apps/web/app/globals.css</div>
            <pre>@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}</pre>
        </div>
        <!-- PostCSS Config -->
        <div class="file-section">
            <div class="file-path">apps/web/postcss.config.js</div>
            <pre>module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}</pre>
        </div>

        <!-- .gitignore -->
        <div class="file-section">
            <div class="file-path">.gitignore</div>
            <pre># dependencies
node_modules/
/.pnp
.pnp.js

# testing
/coverage
*.lcov

# next.js
.next/
out/
build/
dist/

# production
/build

# misc
.DS_Store
*.pem
.idea/
.vscode/

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# turbo
.turbo

# logs
logs/
*.log

# runtime data
pids
*.pid
*.seed
*.pid.lock

# OS files
Thumbs.db
*.swp
*.swo

# IDEs
.idea/
*.iml
.vscode/
*.code-workspace

# Test artifacts
test-results/
playwright-report/
playwright/.cache/

# Temporary files
tmp/
temp/
*.tmp

# Build artifacts
*.map
.cache/

# Database
*.db
*.sqlite
*.sqlite3

# Uploads
uploads/
public/uploads/

# Documentation build
docs/.vitepress/dist/
docs/.vitepress/cache/</pre>
        </div>

        <!-- Environment Types -->
        <div class="file-section">
            <div class="file-path">apps/web/next-env.d.ts</div>
            <pre>/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.</pre>
        </div>

        <!-- Component Test Example -->
        <div class="file-section">
            <div class="file-path">apps/web/__tests__/components/Button.test.tsx</div>
            <pre>import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading spinner when loading prop is true', () => {
    render(<Button loading>Loading...</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');
    
    rerender(<Button variant="outline">Cancel</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('border');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });
});</pre>
        </div>

        <!-- Data Layer Test -->
        <div class="file-section">
            <div class="file-path">apps/web/__tests__/lib/data.test.ts</div>
            <pre>import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { getLatestKPIs, getMonthlyKPI } from '@/lib/data';

// Mock fetch
global.fetch = jest.fn();

describe('Data Layer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getLatestKPIs', () => {
    it('should return latest KPI data for a region', async () => {
      const mockCSV = `region,month,dispatch,transport,patients
충북,2024-01,1250,1180,1150
충북,2024-02,1320,1240,1200
충북,2024-03,1380,1310,1280
충북,2024-04,1410,1350,1320`;

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        text: async () => mockCSV,
      });

      const result = await getLatestKPIs('충북');

      expect(result).toEqual({
        dispatchSum: 1410,
        transportSum: 1350,
        patientsSum: 1320,
        month: '2024-04',
      });
    });

    it('should return default values on error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await getLatestKPIs('충북');

      expect(result).toEqual({
        dispatchSum: 1400,
        transportSum: 1300,
        patientsSum: 1250,
        month: '2024-04',
      });
    });

    it('should handle empty data for region', async () => {
      const mockCSV = `region,month,dispatch,transport,patients
충남,2024-01,1450,1380,1350`;

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        text: async () => mockCSV,
      });

      const result = await getLatestKPIs('충북');

      expect(result.dispatchSum).toBe(0);
      expect(result.transportSum).toBe(0);
      expect(result.patientsSum).toBe(0);
    });
  });

  describe('getMonthlyKPI', () => {
    it('should return monthly KPI data array', async () => {
      const mockCSV = `region,month,dispatch,transport,patients
충북,2024-01,1250,1180,1150
충북,2024-02,1320,1240,1200`;

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        text: async () => mockCSV,
      });

      const result = await getMonthlyKPI('충북');

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        month: '2024-01',
        dispatch: 1250,
        transport: 1180,
        patients: 1150,
      });
    });

    it('should filter by region correctly', async () => {
      const mockCSV = `region,month,dispatch,transport,patients
충북,2024-01,1250,1180,1150
충남,2024-01,1450,1380,1350
충북,2024-02,1320,1240,1200`;

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        text: async () => mockCSV,
      });

      const result = await getMonthlyKPI('충북');

      expect(result).toHaveLength(2);
      expect(result.every(item => item.month.startsWith('2024'))).toBe(true);
    });
  });
});</pre>
        </div>

        <!-- Utils Test -->
        <div class="file-section">
            <div class="file-path">apps/web/__tests__/lib/utils.test.ts</div>
            <pre>import { describe, it, expect } from '@jest/globals';
import { cn, formatDate, calculateAcceptanceRate, generateId } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('base-class', 'additional-class');
      expect(result).toBe('base-class additional-class');
    });

    it('should handle conditional classes', () => {
      const result = cn('base', false && 'hidden', true && 'visible');
      expect(result).toBe('base visible');
    });

    it('should merge Tailwind classes intelligently', () => {
      const result = cn('p-2', 'p-4');
      expect(result).toBe('p-4');
    });
  });

  describe('formatDate', () => {
    it('should format Date object to Korean locale', () => {
      const date = new Date('2024-04-15T10:30:00');
      const result = formatDate(date);
      expect(result).toMatch(/2024/);
      expect(result).toMatch(/04/);
      expect(result).toMatch(/15/);
    });

    it('should format ISO string to Korean locale', () => {
      const dateString = '2024-04-15T10:30:00Z';
      const result = formatDate(dateString);
      expect(result).toMatch(/2024/);
    });
  });

  describe('calculateAcceptanceRate', () => {
    it('should calculate acceptance rate correctly', () => {
      const result = calculateAcceptanceRate(100, 95);
      expect(result).toBe(95);
    });

    it('should return 0 when dispatch is 0', () => {
      const result = calculateAcceptanceRate(0, 0);
      expect(result).toBe(0);
    });

    it('should round to nearest integer', () => {
      const result = calculateAcceptanceRate(100, 33);
      expect(result).toBe(33);
    });

    it('should handle cases where transport exceeds dispatch', () => {
      const result = calculateAcceptanceRate(100, 105);
      expect(result).toBe(105);
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should generate ID in correct format', () => {
      const id = generateId();
      expect(id).toMatch(/^\d+-[a-z0-9]+$/);
    });

    it('should include timestamp', () => {
      const before = Date.now();
      const id = generateId();
      const after = Date.now();
      
      const timestamp = parseInt(id.split('-')[0]);
      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });
  });
});</pre>
        </div>

        <!-- Docker Configuration -->
        <div class="file-section">
            <div class="file-path">Dockerfile</div>
            <pre># Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY apps/web/package*.json ./apps/web/
COPY package*.json ./

# Install dependencies
RUN cd apps/web && npm ci --only=production

# Copy source code
COPY apps/web ./apps/web

# Build application
WORKDIR /app/apps/web
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next ./apps/web/.next
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/package*.json ./apps/web/
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/node_modules ./apps/web/node_modules

USER nextjs

WORKDIR /app/apps/web

EXPOSE 3000

ENV NODE_ENV production
ENV PORT 3000

CMD ["npm", "start"]</pre>
        </div>

        <!-- Docker Compose -->
        <div class="file-section">
            <div class="file-path">docker-compose.yml</div>
            <pre>version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://localhost:3000
      - NEXT_PUBLIC_REGION=충북
    volumes:
      - ./apps/web/public/mnt/data:/app/apps/web/public/mnt/data:ro
    restart: unless-stopped
    networks:
      - ems-network

  # 향후 추가될 서비스들
  # postgres:
  #   image: postgres:15-alpine
  #   environment:
  #     POSTGRES_DB: ems_copilot
  #     POSTGRES_USER: ems_user
  #     POSTGRES_PASSWORD: ${DB_PASSWORD}
  #   volumes:
  #     - postgres-data:/var/lib/postgresql/data
  #   networks:
  #     - ems-network

  # redis:
  #   image: redis:7-alpine
  #   command: redis-server --appendonly yes
  #   volumes:
  #     - redis-data:/data
  #   networks:
  #     - ems-network

networks:
  ems-network:
    driver: bridge

volumes:
  postgres-data:
  redis-data:</pre>
        </div>

        <!-- Package.json Scripts Update -->
        <div class="file-section">
            <div class="file-path">scripts/package.json</div>
            <pre>{
  "name": "ems-copilot-scripts",
  "version": "1.0.0",
  "description": "EMS Copilot Korea 시뮬레이터 및 유틸리티 스크립트",
  "scripts": {
    "simulate:patient": "ts-node simulate-patients.ts",
    "simulate:load": "ts-node simulate-patients.ts",
    "simulate:hospital": "ts-node simulate-hospital.ts",
    "generate:csv": "ts-node generate-csv.ts",
    "monitor": "ts-node monitor.ts",
    "test:load": "artillery run artillery-config.yml"
  },
  "dependencies": {
    "@faker-js/faker": "^8.4.1",
    "artillery": "^2.0.0",
    "axios": "^1.6.7",
    "blessed": "^0.1.81",
    "date-fns": "^3.3.1",
    "papaparse": "^5.4.1",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.3",
    "ws": "^8.16.0"
  },
  "devDependencies": {
    "@types/blessed": "^0.1.25",
    "@types/node": "^20.11.20",
    "@types/papaparse": "^5.3.14",
    "@types/ws": "^8.5.10"
  }
}</pre>
        </div>

        <!-- 프로젝트 완성 메시지 -->
        <div style="margin-top: 40px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white;">
            <h2 style="margin-bottom: 20px;">✅ EMS Copilot Korea 프로젝트 구현 완료!</h2>
            
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3>구현된 주요 기능:</h3>
                <ul style="list-style: none; padding: 0;">
                    <li>✓ Next.js 14 App Router 기반 프론트엔드</li>
                    <li>✓ TypeScript + Tailwind CSS + shadcn/ui 컴포넌트</li>
                    <li>✓ 응급환자 접촉 및 병원 추천 API</li>
                    <li>✓ 실시간 대시보드 및 KPI 모니터링</li>
                    <li>✓ 병원 관리 시스템 (수용/거부 결정)</li>
                    <li>✓ 감사 로깅 시스템</li>
                    <li>✓ 데이터 시뮬레이터 및 부하 테스트 도구</li>
                    <li>✓ API 문서 및 개발자 가이드</li>
                </ul>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
                <h3>실행 방법:</h3>
                <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 4px; margin: 10px 0;">
cd ems-copilot/apps/web
npm install
npm run dev
</pre>
                <p>브라우저에서 http://localhost:3000 접속</p>
            </div>

            <div style="margin-top: 20px;">
                <h3>향후 통합 가능한 기능:</h3>
                <ul style="list-style: none; padding: 0;">
                    <li>• Azure OpenAI API (지능형 추천)</li>
                    <li>• Kakao/Naver Maps (실시간 지도)</li>
                    <li>• PostgreSQL/MongoDB (데이터베이스)</li>
                    <li>• WebSocket (실시간 통신)</li>
                    <li>• STT/TTS (음성 인식)</li>
                </ul>
            </div>
        </div>
    </div>
</body>
</html>: '<rootDir>/$1',
  },
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);</pre>
        </div>

        <!-- Jest Setup -->
        <div class="file-section">
            <div class="file-path">apps/web/jest.setup.js</div>
            <pre>import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch
global.fetch = jest.fn();

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});</pre>
        </div>

        <!-- ESLint Config -->
        <div class="file-section">
            <div class="file-path">apps/web/.eslintrc.json</div>
            <pre>{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "react/display-name": "off",
    "react-hooks/exhaustive-deps": "warn"
  },
  "overrides": [
    {
      "files": ["*.ts", "*.tsx"],
      "rules": {
        "@typescript-eslint/explicit-function-return-type": "off"
      }
    }
  ]
}</pre>
        </div>

        <!-- README -->
        <div class="file-section">
            <div class="file-path">README.md</div>
            <pre># EMS Copilot Korea 🚨

충청권 응급의료 라우팅 및 병원 연계 시스템

## 📋 프로젝트 개요

EMS Copilot Korea는 충청권(충북/충남) 지역의 응급환자 이송을 최적화하는 지능형 라우팅 시스템입니다. 
실시간 병원 수용 능력과 AI 기반 추천 알고리즘을 활용하여 응급환자를 가장 적합한 병원으로 신속하게 연계합니다.

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.0 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 프로젝트 클론
git clone https://github.com/your-org/ems-copilot.git
cd ems-copilot

# 의존성 설치
cd apps/web
npm install

# 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일을 열어 필요한 API 키 입력

# 개발 서버 실행
npm run dev
```

개발 서버는 http://localhost:3000 에서 실행됩니다.

## 🏗 프로젝트 구조

```
ems-copilot/
├── apps/
│   └── web/                 # Next.js 웹 애플리케이션
│       ├── app/             # App Router 페이지 및 API
│       ├── components/      # React 컴포넌트
│       ├── lib/            # 유틸리티 및 데이터 레이어
│       └── server/         # 서버 사이드 로직
├── docs/                   # 문서
└── scripts/                # 유틸리티 스크립트
```

## 📡 API 엔드포인트

### POST /api/encounters
환자 접촉 기록 생성

```json
{
  "patientId": "string",
  "location": { "lat": number, "lng": number },
  "condition": "cardiac|trauma|respiratory|stroke|other"
}
```

### POST /api/recommend
병원 추천 요청

```json
{
  "encounterId": "string",
  "urgency": "critical|urgent|normal",
  "location": { "lat": number, "lng": number }
}
```

## 📊 데이터 스키마

### CSV 데이터 구조
- `region`: 지역 (충북/충남)
- `month`: 년월 (YYYY-MM)
- `dispatch`: 출동 건수
- `transport`: 이송 건수
- `patients`: 환자 수

## 🧪 테스트

```bash
# 린트 실행
npm run lint

# 테스트 실행
npm test

# 빌드
npm run build
```

## 🔧 확장 계획

### 단기 (1-3개월)
- [ ] Azure OpenAI GPT-4 통합 (지능형 추천)
- [ ] Kakao/Naver Maps API 연동 (실시간 지도)
- [ ] PostgreSQL 데이터베이스 연동
- [ ] 실시간 WebSocket 통신

### 중기 (3-6개월)
- [ ] 음성 인식 (STT) 통합
- [ ] 모바일 앱 개발 (React Native)
- [ ] 예측 분석 대시보드
- [ ] 다국어 지원 (i18n)

### 장기 (6-12개월)
- [ ] 전국 확대 적용
- [ ] AI 기반 수요 예측
- [ ] 드론 연계 시스템
- [ ] 블록체인 감사 로그

## 🔐 보안 및 규정 준수

- 의료법 및 개인정보보호법 준수
- HIPAA 호환 설계
- 암호화된 데이터 전송 (TLS 1.3)
- 감사 로그 및 접근 제어

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

기여를 환영합니다! PR을 제출하기 전에 다음 사항을 확인해주세요:
- 코드 스타일 가이드라인 준수
- 테스트 코드 작성
- 문서 업데이트

## 📞 문의

- 이메일: ems-support@example.com
- 이슈 트래커: [GitHub Issues](https://github.com/your-org/ems-copilot/issues)

---

© 2024 EMS Copilot Korea. All rights reserved.</pre>
        </div>

        <div class="file-section">
            <div class="file-path">apps/web/tailwind.config.ts</div>
            <pre>import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;</pre>
        </div>

        <div class="file-section">
            <div class="file-path">apps/web/app/globals.css</div>
            <pre>@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}</pre>
        </div>
    </div>
</body>
</html>