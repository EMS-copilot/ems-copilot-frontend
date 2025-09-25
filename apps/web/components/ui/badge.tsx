
│       │   │   └── page.tsx
│       │   ├── docs/
│       │   │   └── page.tsx
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── globals.css
│       ├── components/
│       │   ├── ui/
│       │   │   ├── button.tsx
│       │   │   ├── card.tsx
│       │   │   ├── badge.tsx
│       │   │   └── modal.tsx
│       │   ├── KpiTiles.tsx
│       │   ├── MapMock.tsx
│       │   ├── RecommendModal.tsx
│       │   ├── EventLog.tsx
│       │   ├── IncomingTable.tsx
│       │   ├── CapacityPanel.tsx
│       │   ├── ActionModal.tsx
│       │   └── ConsentBanner.tsx
│       ├── lib/
│       │   ├── utils.ts
│       │   ├── data.ts
│       │   └── types.ts
│       ├── server/
│       │   └── audit.ts
│       ├── public/
│       │   └── mnt/
│       │       └── data/
│       │           └── ems_pack/
│       │               └── ems_chungcheong_2024-2025_mock.csv
│       ├── package.json
│       ├── tsconfig.json
│       ├── tailwind.config.ts
│       ├── next.config.js
│       └── .env.local.example
├── docs/
│   ├── data_schema.md
│   └── metrics.md
├── scripts/
│   └── simulator.md
├── .github/
│   └── workflows/
│       └── ci.yml
└── README.md
apps/web/package.json
{
  "name": "ems-copilot-web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "lucide-react": "^0.378.0",
    "papaparse": "^5.4.1",
    "tailwind-merge": "^2.2.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "^20.12.12",
    "@types/papaparse": "^5.3.14",
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^7.8.0",
    "@typescript-eslint/parser": "^7.8.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.3",
    "jest": "^29.7.0",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "typescript": "^5.4.5"
  }
}
apps/web/.env.local.example
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_REGION=충북
NEXT_PUBLIC_ENV=development
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
KAKAO_REST_API_KEY=
NCLOUD_ACCESS_KEY=
NCLOUD_SECRET_KEY=
apps/web/lib/types.ts
export type Region = '충북' | '충남';
export type Urgency = 'critical' | 'urgent' | 'normal';
export type Condition = 'cardiac' | 'trauma' | 'respiratory' | 'stroke' | 'other';
export type AuditAction = 'READ' | 'WRITE' | 'ADMIN';

export interface Location {
  lat: number;
  lng: number;
}

export interface Patient {
  id: string;
  location: Location;
  condition: Condition;
  urgency: Urgency;
  timestamp: string;
}

export interface Hospital {
  hospitalId: string;
  name: string;
  location: Location;
  baseEta: number;
  capacity: number;
  specialties: string[];
}

export interface Recommendation {
  rank: number;
  hospitalId: string;
  name: string;
  eta: number;
  acceptProbability: number;
  doorToTreatment: number;
  reasons: string[];
}

export interface Policy {
  highRisk: boolean;
  rejectAllowed: boolean;
}

export interface KPIData {
  dispatchSum: number;
  transportSum: number;
  patientsSum: number;
  month: string;
}

export interface MonthlyData {
  month: string;
  dispatch: number;
  transport: number;
  patients: number;
}

export interface AuditLog {
  userId: string;
  action: AuditAction;
  resource: string;
  timestamp: string;
  details?: any;
}

export interface CapacityData {
  or: number;
  icu: number;
  specialists: number;
  emergencyBeds: number;
}
apps/web/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function calculateAcceptanceRate(dispatch: number, transport: number): number {
  if (dispatch === 0) return 0;
  return Math.round((transport / dispatch) * 100);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
apps/web/public/mnt/data/ems_pack/ems_chungcheong_2024-2025_mock.csv
region,month,dispatch,transport,patients
충북,2024-01,1250,1180,1150
충북,2024-02,1320,1240,1200
충북,2024-03,1380,1310,1280
충북,2024-04,1410,1350,1320
충남,2024-01,1450,1380,1350
충남,2024-02,1520,1440,1410
충남,2024-03,1580,1510,1480
충남,2024-04,1620,1550,1520
apps/web/lib/data.ts
import Papa from 'papaparse';
import { Region, KPIData, MonthlyData } from './types';

interface CSVRow {
  region: string;
  month: string;
  dispatch: string;
  transport: string;
  patients: string;
}

async function loadCSVData(): Promise {
  try {
    // 실제 환경에서는 fetch를 사용
    const response = await fetch('/mnt/data/ems_pack/ems_chungcheong_2024-2025_mock.csv');
    const text = await response.text();
    
    const result = Papa.parse(text, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,
    });

    return result.data;
  } catch (error) {
    console.error('CSV 로드 실패:', error);
    // 폴백 데이터 반환
    return [
      { region: '충북', month: '2024-04', dispatch: '1410', transport: '1350', patients: '1320' },
      { region: '충남', month: '2024-04', dispatch: '1620', transport: '1550', patients: '1520' },
    ];
  }
}

export async function getLatestKPIs(region: Region): Promise {
  try {
    const data = await loadCSVData();
    const regionData = data.filter(row => row.region === region);
    
    if (regionData.length === 0) {
      return {
        dispatchSum: 0,
        transportSum: 0,
        patientsSum: 0,
        month: new Date().toISOString().slice(0, 7),
      };
    }

    // 최신 월 데이터 가져오기
    const latest = regionData[regionData.length - 1];
    
    return {
      dispatchSum: parseInt(latest.dispatch, 10),
      transportSum: parseInt(latest.transport, 10),
      patientsSum: parseInt(latest.patients, 10),
      month: latest.month,
    };
  } catch (error) {
    console.error('KPI 데이터 로드 실패:', error);
    // 기본값 반환
    return {
      dispatchSum: 1400,
      transportSum: 1300,
      patientsSum: 1250,
      month: '2024-04',
    };
  }
}

export async function getMonthlyKPI(region: Region): Promise {
  try {
    const data = await loadCSVData();
    const regionData = data.filter(row => row.region === region);
    
    return regionData.map(row => ({
      month: row.month,
      dispatch: parseInt(row.dispatch, 10),
      transport: parseInt(row.transport, 10),
      patients: parseInt(row.patients, 10),
    }));
  } catch (error) {
    console.error('월별 KPI 데이터 로드 실패:', error);
    // 기본값 반환
    return [
      { month: '2024-01', dispatch: 1250, transport: 1180, patients: 1150 },
      { month: '2024-02', dispatch: 1320, transport: 1240, patients: 1200 },
      { month: '2024-03', dispatch: 1380, transport: 1310, patients: 1280 },
      { month: '2024-04', dispatch: 1410, transport: 1350, patients: 1320 },
    ];
  }
}

// 병원 목록 (목업 데이터)
export const mockHospitals = [
  { 
    hospitalId: 'h1', 
    name: '충북대학교병원',
    location: { lat: 36.6424, lng: 127.4890 },
    baseEta: 10,
    capacity: 0.9,
    specialties: ['cardiac', 'trauma', 'stroke']
  },
  { 
    hospitalId: 'h2', 
    name: '청주성모병원',
    location: { lat: 36.6350, lng: 127.4869 },
    baseEta: 15,
    capacity: 0.7,
    specialties: ['cardiac', 'respiratory']
  },
  { 
    hospitalId: 'h3', 
    name: '한국병원',
    location: { lat: 36.6290, lng: 127.4920 },
    baseEta: 20,
    capacity: 0.5,
    specialties: ['trauma', 'other']
  },
];
apps/web/server/audit.ts
import { AuditLog, AuditAction } from '@/lib/types';

// 메모리 저장소 (프로덕션에서는 DB/WORM 스토리지로 교체)
const auditLogs: AuditLog[] = [];

export async function logAudit(event: {
  userId: string;
  action: AuditAction;
  resource: string;
  details?: any;
}): Promise {
  const log: AuditLog = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  // 메모리에 저장
  auditLogs.push(log);

  // 콘솔 로깅
  console.log('[AUDIT]', JSON.stringify(log, null, 2));

  // TODO: 프로덕션 환경에서는 다음과 같이 구현
  // - PostgreSQL/MongoDB 등 DB에 저장
  // - AWS S3 Glacier 같은 WORM 스토리지에 백업
  // - Elasticsearch/Splunk 등으로 실시간 분석
  // - 규정 준수를 위한 암호화 및 무결성 검증
  
  // await db.auditLogs.insert(log);
  // await s3.putObject({ Bucket: 'audit-logs', Key: `${log.timestamp}-${log.userId}`, Body: JSON.stringify(log) });
}

export async function getAuditLogs(
  filter?: { userId?: string; action?: AuditAction; startDate?: string; endDate?: string }
): Promise {
  let logs = [...auditLogs];

  if (filter?.userId) {
    logs = logs.filter(log => log.userId === filter.userId);
  }
  if (filter?.action) {
    logs = logs.filter(log => log.action === filter.action);
  }
  if (filter?.startDate) {
    logs = logs.filter(log => log.timestamp >= filter.startDate);
  }
  if (filter?.endDate) {
    logs = logs.filter(log => log.timestamp <= filter.endDate);
  }

  return logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}
apps/web/app/api/encounters/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { logAudit } from '@/server/audit';
import { generateId } from '@/lib/utils';
import { Condition } from '@/lib/types';

interface EncounterRequest {
  patientId: string;
  location: {
    lat: number;
    lng: number;
  };
  condition: Condition;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as EncounterRequest;

    // 요청 검증
    if (!body.patientId || !body.location || !body.condition) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다', code: 400 },
        { status: 400 }
      );
    }

    if (!['cardiac', 'trauma', 'respiratory', 'stroke', 'other'].includes(body.condition)) {
      return NextResponse.json(
        { error: '유효하지 않은 condition 값입니다', code: 400 },
        { status: 400 }
      );
    }

    const encounterId = generateId();
    const timestamp = new Date().toISOString();

    // 감사 로그
    await logAudit({
      userId: 'system', // TODO: 실제 사용자 ID로 교체
      action: 'WRITE',
      resource: 'encounter',
      details: {
        encounterId,
        patientId: body.patientId,
        condition: body.condition,
        location: body.location,
      },
    });

    // TODO: 실제 DB 저장
    // await db.encounters.create({
    //   id: encounterId,
    //   patientId: body.patientId,
    //   condition: body.condition,
    //   location: body.location,
    //   timestamp,
    //   status: 'active'
    // });

    return NextResponse.json(
      {
        message: '환자 접촉 기록이 성공적으로 생성되었습니다',
        encounterId,
        timestamp,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Encounter 생성 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다', code: 500 },
      { status: 500 }
    );
  }
}
apps/web/app/api/recommend/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { logAudit } from '@/server/audit';
import { mockHospitals } from '@/lib/data';
import { Urgency, Recommendation, Policy } from '@/lib/types';

interface RecommendRequest {
  encounterId: string;
  urgency: Urgency;
  location: {
    lat: number;
    lng: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RecommendRequest;

    // 요청 검증
    if (!body.encounterId || !body.urgency || !body.location) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다', code: 400 },
        { status: 400 }
      );
    }

    if (!['critical', 'urgent', 'normal'].includes(body.urgency)) {
      return NextResponse.json(
        { error: '유효하지 않은 urgency 값입니다', code: 400 },
        { status: 400 }
      );
    }

    // 정책 설정
    const policy: Policy = {
      highRisk: body.urgency === 'critical',
      rejectAllowed: body.urgency !== 'critical',
    };

    // 추천 생성 (목업 데이터 기반)
    const recommendations: Recommendation[] = mockHospitals.map((hospital, index) => {
      // 거리 기반 ETA 계산 (간단한 모의 계산)
      const distanceFactor = Math.abs(body.location.lat - hospital.location.lat) + 
                           Math.abs(body.location.lng - hospital.location.lng);
      const urgencyMultiplier = body.urgency === 'critical' ? 0.8 : 
                               body.urgency === 'urgent' ? 1.0 : 1.2;
      
      const eta = Math.round(hospital.baseEta * (1 + distanceFactor * 10) * urgencyMultiplier);
      
      // 수용 확률 계산
      const acceptProbability = Math.round(
        hospital.capacity * 100 * (body.urgency === 'critical' ? 1.2 : 1.0)
      );

      // Door to Treatment 시간
      const doorToTreatment = Math.round(15 + Math.random() * 30);

      // 추천 사유
      const reasons = [];
      if (hospital.capacity > 0.7) reasons.push('높은 가용 병상');
      if (eta < 15) reasons.push('빠른 도착 가능');
      if (acceptProbability > 80) reasons.push('높은 수용 확률');
      if (body.urgency === 'critical' && index === 0) reasons.push('중증 환자 우선 배치');

      return {
        rank: index + 1,
        hospitalId: hospital.hospitalId,
        name: hospital.name,
        eta,
        acceptProbability: Math.min(acceptProbability, 100),
        doorToTreatment,
        reasons: reasons.length > 0 ? reasons : ['표준 추천'],
      };
    }).sort((a, b) => {
      // 중증도에 따른 정렬 로직
      if (body.urgency === 'critical') {
        return a.eta - b.eta; // 중증 환자는 ETA 우선
      }
      return b.acceptProbability - a.acceptProbability; // 일반 환자는 수용 확률 우선
    });

    // 순위 재정렬
    recommendations.forEach((rec, index) => {
      rec.rank = index + 1;
    });

    // 감사 로그
    await logAudit({
      userId: 'system', // TODO: 실제 사용자 ID로 교체
      action: 'READ',
      resource: 'recommendation',
      details: {
        encounterId: body.encounterId,
        urgency: body.urgency,
        recommendationCount: recommendations.length,
      },
    });

    // TODO: Azure OpenAI API 통합
    // const aiRecommendation = await azureOpenAI.getRecommendation({
    //   patientCondition: body.condition,
    //   urgency: body.urgency,
    //   hospitals: mockHospitals,
    //   location: body.location
    // });

    return NextResponse.json({
      encounterId: body.encounterId,
      timestamp: new Date().toISOString(),
      policy,
      recommendations,
    });
  } catch (error) {
    console.error('추천 생성 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다', code: 500 },
      { status: 500 }
    );
  }
}
apps/web/components/ui/button.tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes,
    VariantProps {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      
        {loading && (
          
        )}
        {children}
      
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
apps/web/components/ui/card.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes
>(({ className, ...props }, ref) => (
  

));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes
>(({ className, ...props }, ref) => (
  

));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes
>(({ className, ...props }, ref) => (
  

));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes
>(({ className, ...props }, ref) => (
  

));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes
>(({ className, ...props }, ref) => (
  


));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes
>(({ className, ...props }, ref) => (
  

));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
apps/web/components/ui/badge.tsx
