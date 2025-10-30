"use client";

import { useQuery } from "@tanstack/react-query";
import * as api from "./api";

/* -----------------------------------
 * ✅ 병원 요청 목록 훅
 * ----------------------------------- */
export const useHospitalRequests = () => {
  return useQuery({
    queryKey: ["hospitalRequests"],
    queryFn: async () => {
      const res = await api.getHospitalRequests();
      return res.data; // HospitalRequest[]
    },
    staleTime: 1000 * 60 * 2, // 2분 캐싱
    retry: false,
  });
};

/* -----------------------------------
 * 이송 중 환자 조회 (IN_TRANSIT)
 * ----------------------------------- */
export const useInTransitPatients = () => {
    return useQuery({
      queryKey: ["inTransitPatients"],
      queryFn: () => api.getHospitalRequestsByStatus("IN_TRANSIT"),
      staleTime: 1000 * 60 * 5, // 5분 캐시
      retry: false,
    });
  };