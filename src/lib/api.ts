import axios, { AxiosInstance, AxiosError } from 'axios';
import { 
  Patient, 
  Encounter, 
  RecommendationResponse, 
  KPIData,
  Hospital,
  HospitalCapacity 
} from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // 토큰 추가
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // 인증 실패 처리
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // 환자 관련 API
  async createEncounter(data: {
    patientId: string;
    location: { lat: number; lng: number };
    condition: string;
  }): Promise {
    const response = await this.client.post('/api/encounters', data);
    return response.data;
  }

  async getEncounter(encounterId: string): Promise {
    const response = await this.client.get(`/api/encounters/${encounterId}`);
    return response.data;
  }

  // 추천 API
  async getRecommendations(data: {
    encounterId: string;
    urgency: 'critical' | 'urgent' | 'normal';
    location: { lat: number; lng: number };
  }): Promise {
    const response = await this.client.post('/api/recommend', data);
    return response.data;
  }

  // 병원 관련 API
  async getHospitals(): Promise {
    const response = await this.client.get('/api/hospitals');
    return response.data;
  }

  async getHospitalCapacity(hospitalId: string): Promise {
    const response = await this.client.get(`/api/hospitals/${hospitalId}/capacity`);
    return response.data;
  }

  async updateHospitalCapacity(
    hospitalId: string, 
    capacity: HospitalCapacity
  ): Promise {
    await this.client.put(`/api/hospitals/${hospitalId}/capacity`, capacity);
  }

  async respondToPatient(
    hospitalId: string,
    patientId: string,
    action: 'accept' | 'reject',
    reason?: string
  ): Promise {
    await this.client.post(`/api/hospitals/${hospitalId}/respond`, {
      patientId,
      action,
      reason,
    });
  }

  // KPI 및 통계 API
  async getKPIs(region: '충북' | '충남'): Promise {
    const response = await this.client.get(`/api/kpis/${region}`);
    return response.data;
  }

  async getMonthlyStats(
    region: '충북' | '충남',
    year: number,
    month: number
  ): Promise {
    const response = await this.client.get('/api/stats/monthly', {
      params: { region, year, month },
    });
    return response.data;
  }

  // 이벤트 스트림
  async getEvents(limit = 50): Promise {
    const response = await this.client.get('/api/events', {
      params: { limit },
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();