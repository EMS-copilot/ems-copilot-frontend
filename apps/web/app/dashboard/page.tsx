'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import KpiTiles from '@/components/KpiTiles';
import MapMock from '@/components/MapMock';
import RecommendModal from '@/components/RecommendModal';
import EventLog from '@/components/EventLog';
import { getLatestKPIs, mockHospitals } from '@/lib/data';
import { Region, KPIData, Hospital, Patient, Urgency, Recommendation, Policy } from '@/lib/types';
import { RefreshCw, Users } from 'lucide-react';

export default function Dashboard() {
  const [selectedRegion, setSelectedRegion] = useState('충북');
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [queueItems, setQueueItems] = useState([]);
  const [showRecommendModal, setShowRecommendModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [policy, setPolicy] = useState({ highRisk: false, rejectAllowed: true });

  useEffect(() => {
    loadKPIData();
    initializeQueue();
  }, [selectedRegion]);

  const loadKPIData = async () => {
    setLoading(true);
    try {
      const data = await getLatestKPIs(selectedRegion);
      setKpiData(data);
    } catch (error) {
      console.error('KPI 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeQueue = () => {
    // 목업 대기 환자 큐 데이터
    const mockQueue: Patient[] = [
      {
        id: 'p1',
        location: { lat: 36.6424, lng: 127.4890 },
        condition: 'cardiac',
        urgency: 'critical',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'p2',
        location: { lat: 36.6350, lng: 127.4869 },
        condition: 'trauma',
        urgency: 'urgent',
        timestamp: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: 'p3',
        location: { lat: 36.6290, lng: 127.4920 },
        condition: 'respiratory',
        urgency: 'normal',
        timestamp: new Date(Date.now() - 600000).toISOString(),
      },
    ];
    setQueueItems(mockQueue);
  };

  const handlePatientClick = async (patient: Patient) => {
    setSelectedPatient(patient);
    
    // API 호출하여 추천 받기
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          encounterId: patient.id,
          urgency: patient.urgency,
          location: patient.location,
        }),
      });
      
      const data = await response.json();
      setRecommendations(data.recommendations);
      setPolicy(data.policy);
      setShowRecommendModal(true);
    } catch (error) {
      console.error('추천 API 오류:', error);
    }
  };

  const handleHospitalSelect = (hospital: Recommendation) => {
    console.log('병원 선택:', hospital);
    // TODO: 병원 요청 처리
    setShowRecommendModal(false);
    // 큐에서 환자 제거
    setQueueItems(prev => prev.filter(p => p.id !== selectedPatient?.id));
  };

  const urgencyColors = {
    critical: 'destructive',
    urgent: 'warning',
    normal: 'secondary',
  } as const;

  const conditionLabels = {
    cardiac: '심장질환',
    trauma: '외상',
    respiratory: '호흡기',
    stroke: '뇌졸중',
    other: '기타',
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
            
            
              
            
          

        


        {/* KPI 타일 */}
        {kpiData && }

        {/* 메인 콘텐츠 */}
        

          {/* 병원 지도 */}
           {
              if (queueItems.length > 0) {
                handlePatientClick(queueItems[0]);
              }
            }}
          />

          {/* 대기 환자 큐 */}
          
            
              
                
                대기 환자 큐
              
            
            
              

                {queueItems.length === 0 ? (
                  

                    대기 중인 환자가 없습니다
                  


                ) : (
                  queueItems.map((patient) => (
                    
 handlePatientClick(patient)}
                      role="button"
                      tabIndex={0}
                      aria-label={`환자 ${patient.id} 선택`}
                    >
                      

                        

                          

                            환자 ID: {patient.id}
                            
                              {patient.urgency === 'critical' ? '위급' :
                               patient.urgency === 'urgent' ? '긴급' : '일반'}
                            
                          

                          

                            증상: {conditionLabels[patient.condition]}
                          


                          

                            대기 시간: {Math.round((Date.now() - new Date(patient.timestamp).getTime()) / 60000)}분
                          


                        

                        
                          병원 추천
                        
                      

                    

                  ))
                )}
              

            
          
        


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