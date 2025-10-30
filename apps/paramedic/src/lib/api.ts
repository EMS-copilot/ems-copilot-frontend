// src/api/api.ts
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
 * ----------------------------------- */
export const getMyName = async () => {
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
 * 환자 등록
 * ----------------------------------- */
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

export const registerPatient = async (
  payload: RegisterPatientRequest
): Promise<RegisterPatientResponse> => {
  const { data } = await apiClient.post<RegisterPatientResponse>(
    "/api/patients/register",
    payload
  );
  return data;
};

/* -----------------------------------
 * 병원/요청
 * ----------------------------------- */
export const getHospitals = async () => {
  const res = await apiClient.get("/api/hospitals");
  return res.data.data;
};

export const getNearbyHospitals = async (distance: number = 10) => {
  const response = await apiClient.get(`/api/hospitals/nearby`, {
    params: { distance },
  });
  return response.data;
};

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

export const sendHospitalRequest = async (
  payload: SendHospitalRequestBody
): Promise<SendHospitalRequestResponse> => {
  console.log("📤 [sendHospitalRequest] 요청 시작");
  console.log("📦 Payload:", JSON.stringify(payload, null, 2));

  const validPayload = {
    sessionCode: String(payload.sessionCode),
    hospitalIds: payload.hospitalIds.map((id) => Number(id)),
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

/* -----------------------------------
 * ✅ 음성 → 텍스트(STT) 업로드
 *   POST /api/speech/transcribe  (multipart/form-data)
 *   반환: { status, message, data: { transcript, confidence, ... } }
 * ----------------------------------- */
export interface SpeechTranscribeResponse {
  status: "SUCCESS" | "FAIL";
  message: string;
  data?: {
    transcript: string;
    confidence?: number;
    alternatives?: { transcript: string; confidence?: number }[];
  };
}

export const postSpeechTranscribe = async (
  audioFile: Blob,
  options?: {
    languageCode?: string; // default ko-KR
    sampleRateHz?: number; // default 44100
    encoding?: "MP3" | "WAV" | "FLAC" | "OGG";
  }
): Promise<SpeechTranscribeResponse> => {
  const formData = new FormData();
  // 서버가 파일 키를 audioFile로 받음
  formData.append("audioFile", audioFile, "voice.ogg");
  formData.append("languageCode", options?.languageCode ?? "ko-KR");
  formData.append("sampleRateHz", String(options?.sampleRateHz ?? 48000));
  formData.append("encoding", options?.encoding ?? "OGG");

  const { data } = await apiClient.post<SpeechTranscribeResponse>(
    "/api/speech/transcribe",
    formData,
    {
      headers: {
        // apiClient 기본 헤더가 json이라 multipart로 덮어써줌
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

/* -----------------------------------
 * ✅ 메모 저장 (세션 기준)
 *   POST /api/patients/memo
 *   body: { sessionCode, memo }
 *   ※ 실제 엔드포인트가 다르면 이 부분만 바꿔줘.
 * ----------------------------------- */
export interface SaveMemoResponse {
  status: "SUCCESS" | "FAIL";
  message: string;
  data?: { sessionCode: string; memo: string; savedAt: string };
}

export const postPatientMemo = async ({
  sessionCode,
  memo,
}: {
  sessionCode: string;
  memo: string;
}): Promise<SaveMemoResponse> => {
  const { data } = await apiClient.post<SaveMemoResponse>(
    "/api/patients/memo",
    { sessionCode, memo }
  );
  return data;
};

/* -----------------------------------
 * ✅ 병원 이송 완료 (구급대원)
 *   PUT /api/encounters/{id}/arrive
 * ----------------------------------- */
export interface ArriveResponse {
  status: string;
  message: string;
  data: {
    id: number;
    patientCode: string;
    patientTempId: string;
    sessionCode: string;
    hospitalId: number;
    hospitalName: string;
    hospitalAddress: string;
    age: number;
    sex: string;
    triageLevel: number;
    transferLocation: string;
    transferDistance: number;
    transferEta: number;
    status: string;
    transferredAt: string;
  };
}

export const arriveAtHospital = async (encounterId: number): Promise<ArriveResponse> => {
  const { data } = await apiClient.put<ArriveResponse>(
    `/api/encounters/${encounterId}/arrive`
  );
  return data;
};