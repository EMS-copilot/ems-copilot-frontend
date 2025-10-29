import axios, {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
  } from "axios";
  
  export const API_BASE_URL = "https://emsapi.online";
  
  const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
  });
  
  // 요청 인터셉터
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken");
        if (token) {
          config.headers = config.headers ?? {};
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );
  
  // 응답 인터셉터
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
  