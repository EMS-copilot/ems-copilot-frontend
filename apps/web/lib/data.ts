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