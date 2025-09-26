// 기본 타입
export type Region = '충북' | '충남';
export type Urgency = 'critical' | 'urgent' | 'normal';
export type Condition = 'cardiac' | 'trauma' | 'respiratory' | 'stroke' | 'other';
export type AuditAction = 'READ' | 'WRITE' | 'ADMIN';

// 위치 정보
export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

// 환자 정보
export interface Patient {
  id: string;
  location: Location;
  condition: Condition;
  urgency: Urgency;
  timestamp: string;
  metadata?: {
    age?: number;
    gender?: 'M' | 'F' | 'O';
    vitalSigns?: any;
  };
}

// 병원 정보
export interface Hospital {
  hospitalId: string;
  name: string;
  location: Location;
  baseEta: number;
  capacity: number;
  specialties: string[];
}

// 병원 수용 능력
export interface HospitalCapacity {
  or: number;
  icu: number;
  specialists: number;
  emergencyBeds: number;
  lastUpdated?: string;
}

// 환자 접촉
export interface Encounter {
  encounterId: string;
  patientId: string;
  timestamp: string;
  location: Location;
  status?: string;
}

// 추천 정보
export interface Recommendation {
  rank: number;
  hospitalId: string;
  name: string;
  eta: number;
  acceptProbability: number;
  doorToTreatment: number;
  reasons: string[];
}

// 정책
export interface Policy {
  highRisk: boolean;
  rejectAllowed: boolean;
}

// API 응답
export interface RecommendationResponse {
  encounterId: string;
  timestamp: string;
  policy: Policy;
  recommendations: Recommendation[];
}

// KPI 데이터
export interface KPIData {
  dispatchSum: number;
  transportSum: number;
  patientsSum: number;
  month: string;
  acceptanceRate?: number;
}

// 이벤트
export interface Event {
  id: string;
  type: 'dispatch' | 'recommend' | 'accept' | 'reject';
  timestamp: string;
  hospital?: string;
  patient?: string;
  message: string;
}