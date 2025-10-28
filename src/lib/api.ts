import apiClient from "./api-client";
import axios from "axios";

// 로그인 응답 타입
export interface LoginResponse {
  status: string;
  message: string;
  data: {
    token: string;
    employeeNumber: string;
    name: string;
    role: string;
    department: string;
  };
}

// 로그인 요청
export const login = async (
  employeeNumber: string,
  password: string
): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>("/api/users/login", {
    employeeNumber,
    password,
  });
  return data;
};

// ✅ 구급대원 이름 조회 (수정됨: /api/users/me)
export const getMyName = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No auth token found");

  try {
    const response = await axios.get("https://emsapi.online/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // ✅ data.name만 추출해서 반환
    return response.data?.data?.name || null;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("getMyName failed:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("getMyName failed:", error.message);
    } else {
      console.error("getMyName failed: 알 수 없는 오류", error);
    }
    throw error;
  }
};

// ---- 환자 정보 등록 API: POST /api/patients/register ---- //

// Request Body
export interface RegisterPatientRequest {
  age: number;
  sex: "M" | "F";
  triageLevel: number;
  sbp: number;
  dbp: number;
  hr: number;
  rr: number;
  spo2: number;
  temp: number;
  symptoms: string[];
}

// Response 타입
export interface RegisterPatientResponse {
  status: string;
  message: string;
  data: {
    sessionCode: string;
    patientCode: string;
    patientTempId: string;
    recommendedHospitals: {
      hospitalId: string;
      hospitalName: string;
      aiScore: number;
      priority: number;
      aiExplanations: Record<string, any>;
      distance: number;
      eta: number;
    }[];
    createdAt: string;
    expiresAt: string;
    status: string;
  };
}

// 환자 등록 함수
export const registerPatient = async (
  payload: RegisterPatientRequest
): Promise<RegisterPatientResponse> => {
  const { data } = await apiClient.post<RegisterPatientResponse>(
    "/api/patients/register",
    payload
  );
  return data;
};

// 병원 목록 조회
export const getHospitals = async () => {
  const res = await apiClient.get("/hospitals");
  return res.data.data;
};
