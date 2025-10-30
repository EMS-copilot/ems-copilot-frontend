import apiClient from "./api-client";
import axios from "axios";

/* -----------------------------------
 * 로그인 응답 타입 정의
 * ----------------------------------- */
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

/* -----------------------------------
 * 로그인 요청
 * ----------------------------------- */
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

/* -----------------------------------
 * ✅ 구급대원 이름 조회 (SSR 안전 버전)
 * - API: GET /api/users/me
 * - 반환: data.name
 * ----------------------------------- */
export const getMyName = async () => {
  // ✅ 서버사이드 렌더링 시 localStorage 접근 방지
  if (typeof window === "undefined") {
    console.warn("getMyName called on server — skipped localStorage access");
    return null;
  }

  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No auth token found");

  try {
    const response = await axios.get("https://emsapi.online/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // ✅ data.name만 반환
    return response.data?.data?.name ?? null;
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

/* -----------------------------------
 * 환자 등록 API: POST /api/patients/register
 * ----------------------------------- */

// Request Body 타입
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
    data: any;
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

// 환자 등록 요청
export const registerPatient = async (
  payload: RegisterPatientRequest
): Promise<RegisterPatientResponse> => {
  const { data } = await apiClient.post<RegisterPatientResponse>(
    "/api/patients/register",
    payload
  );
  return data;
};

// 병원 목록 조회 API
export const getHospitals = async () => {
  const res = await apiClient.get("/api/hospitals");
  return res.data.data;
};

// 거리 기반 병원 조회
export const getNearbyHospitals = async (distance: number = 10) => {
  const response = await apiClient.get(`/api/hospitals/nearby`, {
    params: { distance },
  });
  return response.data; // { status, message, data: Hospital[] }
};

/* -----------------------------------
 * ✅ 병원 요청 전송 API (수정됨)
 * ----------------------------------- */

export interface SendHospitalRequestBody {
  sessionCode: string;
  hospitalIds: number[];
}

export interface SendHospitalRequestResponse {
  status: string;
  message: string;
  data: {
    sessionCode: string;
    totalSent: number;
    patientVital: {
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
    };
    requests: {
      requestId: number;
      hospitalId: number;
      hospitalName: string;
      status: string;
    }[];
  };
}

// ✅ 병원 요청 전송 (개선된 버전)
export const sendHospitalRequest = async (
  payload: SendHospitalRequestBody
): Promise<SendHospitalRequestResponse> => {
  console.log("📤 [sendHospitalRequest] 요청 시작");
  console.log("📦 Payload:", JSON.stringify(payload, null, 2));
  
  // ✅ hospitalIds가 숫자 배열인지 확인
  const validPayload = {
    sessionCode: String(payload.sessionCode),
    hospitalIds: payload.hospitalIds.map(id => Number(id))
  };
  
  console.log("✅ Validated Payload:", JSON.stringify(validPayload, null, 2));

  try {
    const { data } = await apiClient.post<SendHospitalRequestResponse>(
      "/api/hospital-requests/send",
      validPayload
    );
    console.log("✅ [sendHospitalRequest] 성공:", data);
    return data;
  } catch (error) {
    console.error("❌ [sendHospitalRequest] 실패:", error);
    if (axios.isAxiosError(error)) {
      console.error("응답 데이터:", error.response?.data);
      console.error("응답 상태:", error.response?.status);
      console.error("요청 헤더:", error.config?.headers);
    }
    throw error;
  }
};