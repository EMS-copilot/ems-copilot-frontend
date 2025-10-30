"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import * as api from "./api";

// 로그인
export const useLogin = () => {
  return useMutation<
    api.LoginResponse,
    Error,
    { employeeNumber: string; password: string }
  >({
    mutationFn: ({ employeeNumber, password }) =>
      api.login(employeeNumber, password),
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        const user = data.data;
        localStorage.setItem("authToken", user.token);
        localStorage.setItem("userInfo", JSON.stringify(user));
      }
    },
  });
};

// ✅ 이름 조회: enabled로 호출 제어
export const useMyName = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["myName"],
    queryFn: api.getMyName,
    enabled,                 // ← variant==="home"일 때만 true로
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

// 환자 등록
export const useRegisterPatient = () => {
  return useMutation({
    mutationFn: (payload: api.RegisterPatientRequest) =>
      api.registerPatient(payload),
  });
};

// 병원 목록 조회
export const useHospitals = () => {
  return useQuery({
    queryKey: ["hospitals"],
    queryFn: api.getHospitals,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

// 병원 요청 전송 훅
export const useSendHospitalRequest = () => {
  return useMutation<
    api.SendHospitalRequestResponse,
    Error,
    api.SendHospitalRequestBody
  >({
    mutationFn: api.sendHospitalRequest,
  });
};
