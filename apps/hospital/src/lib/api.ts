import apiClient from "./api-client";

/* -----------------------------------
 * ✅ 병원 요청 목록 조회
 * GET /api/hospital-requests/hospital
 * ----------------------------------- */

export interface HospitalRequest {
  id: number;
  sessionCode: string;
  patientCode: string;
  hospitalId: number;
  hospitalName: string;
  hospitalAddress: string;
  distance: number;
  eta: number;
  age: number;
  sex: "M" | "F";
  triageLevel: number;
  symptoms: string[];
  sbp: number;
  dbp: number;
  hr: number;
  rr: number;
  spo2: number;
  temp: number;
  paramedicMemo: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | string;
  responseMessage?: string | null;
  createdAt: string;
  respondedAt?: string | null;
  expiresAt: string;
}

export interface HospitalRequestsResponse {
  status: string;
  message: string;
  data: HospitalRequest[];
}

export const getHospitalRequests = async (): Promise<HospitalRequestsResponse> => {
  const { data } = await apiClient.get<HospitalRequestsResponse>(
    "/api/hospital-requests/hospital"
  );
  return data;
};

/* -----------------------------------
 * 병원 요청 상태별 조회
 * ----------------------------------- */
export const getHospitalRequestsByStatus = async (status: string) => {
    const response = await apiClient.get(
      `/api/hospital-requests/hospital/status`,
      { params: { status } }
    );
    return response.data.data;
  };
