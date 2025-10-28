"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import * as api from "./api";

// 로그인
export const useLogin = () => {
    return useMutation<
      api.LoginResponse, // 성공 시 반환 타입
      Error,             // 에러 타입
      { employeeNumber: string; password: string } // 입력 변수 타입
    >({
      mutationFn: ({ employeeNumber, password }) =>
        api.login(employeeNumber, password),
      onSuccess: (data) => {
        // 토큰 및 유저 정보 저장
        if (typeof window !== "undefined") {
          const user = data.data;
          localStorage.setItem("authToken", user.token);
          localStorage.setItem("userInfo", JSON.stringify(user));
        }
      },
    });
};

// 이름 조회
export const useMyName = () => {
  return useQuery({
    queryKey: ["myName"],
    queryFn: api.getMyName,
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

// 병원 목록 조회 훅
export const useHospitals = () => {
  return useQuery({
    queryKey: ["hospitals"],
    queryFn: api.getHospitals,
    staleTime: 1000 * 60 * 5, // 5분 캐싱
    retry: false, // 서버 500 반복 방지
  });
};