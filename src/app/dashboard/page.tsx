'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import KpiTiles from '@/components/dashboard/KpiTiles';
import MapMock from '@/components/dashboard/MapMock';
import RecommendModal from '@/components/dashboard/RecommendModal';
import EventLog from '@/components/dashboard/EventLog';
import { apiClient } from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Region, Patient, Recommendation, Policy } from '@/types';
import { RefreshCw, Users } from 'lucide-react';

export default function Dashboard() {
  const [selectedRegion, setSelectedRegion] = useState('충북');
  const [queueItems, setQueueItems] = useState([]);
  const [showRecommendModal, setShowRecommendModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [policy, setPolicy] = useState({ highRisk: false, rejectAllowed: true });

  // API hooks
  const { data: kpiData, loading: kpiLoading, execute: fetchKPIs } = useApi(
    () => apiClient.getKPIs(selectedRegion)
  );

  const { data: hospitals, execute: fetchHospitals } = useApi(
    apiClient.getHospitals
  );

  // WebSocket 연결
  const { isConnected, on, off } = useWebSocket();

  useEffect(() => {
    // 초기 데이터 로드
    fetchKPIs();
    fetchHospitals();

    // WebSocket 이벤트 리스너
    const unsubscribe = on('patient:new', (patient: Patient) => {
      setQueueItems(prev => [...prev, patient]);
    });

    return () => {
      unsubscribe();
    };
  }, [selectedRegion]);

  const handlePatientClick = async (patient: Patient) => {
    setSelectedPatient(patient);
    
    try {
      const response = await apiClient.getRecommendations({
        encounterId: patient.id,
        urgency: patient.urgency,
        location: patient.location,
      });
      
      setRecommendations(response.recommendations);
      setPolicy(response.policy);
      setShowRecommendModal(true);
    } catch (error) {
      console.error('추천 API 오류:', error);
    }
  };

  const handleHospitalSelect = async (hospital: Recommendation) => {
    console.log('병원 선택:', hospital);
    setShowRecommendModal(false);
    setQueueItems(prev => prev.filter(p => p.id !== selectedPatient?.id));
  };

  return (
    

      

        {/* 헤더 */}
        

          
응급 대시보드

          

            

               setSelectedRegion('충북')}
              >
                충북
              
               setSelectedRegion('충남')}
              >
                충남
              
            

             fetchKPIs()}
              disabled={kpiLoading}
            >
              
            
            {isConnected && (
              

            )}
          

        


        {/* KPI 타일 */}
        {kpiData && }

        {/* 메인 콘텐츠 */}
        

           {
              if (queueItems.length > 0) {
                handlePatientClick(queueItems[0]);
              }
            }}
          />

          
            

              

                
                대기 환자 큐
              

              
                {queueItems.length}명 대기 중
              
            

            {/* 환자 목록 */}
            {queueItems.map(patient => (
              
 handlePatientClick(patient)}
                className="p-3 border rounded-lg mb-2 hover:bg-gray-50 cursor-pointer"
              >
                {/* 환자 정보 표시 */}
              

            ))}
          
        


        {/* 이벤트 로그 */}
        

        {/* 추천 모달 */}
        {selectedPatient && (
           setShowRecommendModal(false)}
            encounterId={selectedPatient.id}
            recommendations={recommendations}
            policy={policy}
            onSelect={handleHospitalSelect}
          />
        )}
      

    

  );
}