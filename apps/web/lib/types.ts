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