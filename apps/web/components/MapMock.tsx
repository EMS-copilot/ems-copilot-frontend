'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hospital } from '@/lib/types';
import { MapPin, Activity } from 'lucide-react';

interface MapMockProps {
  hospitals: Hospital[];
  onHospitalClick: (hospital: Hospital) => void;
}

export default function MapMock({ hospitals, onHospitalClick }: MapMockProps) {
  const [selectedHospital, setSelectedHospital] = useState(null);

  const handleHospitalClick = (hospital: Hospital) => {
    setSelectedHospital(hospital.hospitalId);
    onHospitalClick(hospital);
  };

  return (
    
      
        
          
          병원 현황 지도
        
      
      
        

          {/* TODO: 실제 지도 통합 */}
          {/* Kakao Maps 또는 Naver Maps API 연동 예정 */}
          {/*  */}
          
          

            

              
              
지도 API 연동 예정


              
Kakao/Naver Maps


            

          


          {/* 병원 목록 오버레이 */}
          

            
병원 목록

            

              {hospitals.map((hospital) => (
                
 handleHospitalClick(hospital)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${hospital.name} 선택`}
                >
                  

                    
                    {hospital.name}
                  

                  

                     0.7 ? 'success' : 'warning'}>
                      {Math.round(hospital.capacity * 100)}% 가용
                    
                    
                      {hospital.baseEta}분
                    
                  

                

              ))}
            

          

        

      
    
  );
}