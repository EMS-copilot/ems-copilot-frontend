import axios, {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
  } from "axios";
  
  export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://emsapi.online";
  
  const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
  });
  
  // ✅ 병원 전용 토큰만 읽도록 수정
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("hospitalAuthToken"); // ✅ hospitalAuthToken으로 고정
        if (token) {
          config.headers = config.headers ?? {};
          config.headers["Authorization"] = `Bearer ${token}`;
        } else {
          // 토큰이 없으면 Authorization 제거
          delete config.headers?.Authorization;
        }
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );
  
  // ✅ 응답 에러 로깅
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      console.error(
        `[API ERROR] ${error.response?.status ?? "No Response"} - ${error.message}`
      );
      return Promise.reject(error);
    }
  );
  
  export default apiClient;
  