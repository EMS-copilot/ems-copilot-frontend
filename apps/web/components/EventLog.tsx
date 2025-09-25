'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Activity, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Event {
  id: string;
  type: 'recommend' | 'accept' | 'reject' | 'dispatch';
  timestamp: string;
  hospital?: string;
  patient?: string;
  message: string;
}

export default function EventLog() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // 목업 이벤트 데이터 생성
    const mockEvents: Event[] = [
      {
        id: 'e1',
        type: 'dispatch',
        timestamp: new Date(Date.now() - 1000000).toISOString(),
        patient: 'P-001',
        message: '새로운 응급 호출 접수',
      },
      {
        id: 'e2',
        type: 'recommend',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        patient: 'P-001',
        hospital: '충북대학교병원',
        message: '병원 추천 완료 (3개 병원)',
      },
      {
        id: 'e3',
        type: 'accept',
        timestamp: new Date(Date.now() - 800000).toISOString(),
        patient: 'P-001',
        hospital: '충북대학교병원',
        message: '환자 수용 확정',
      },
      {
        id: 'e4',
        type: 'dispatch',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        patient: 'P-002',
        message: '새로운 응급 호출 접수',
      },
      {
        id: 'e5',
        type: 'reject',
        timestamp: new Date(Date.now() - 500000).toISOString(),
        patient: 'P-002',
        hospital: '청주성모병원',
        message: '병원 수용 불가 (ICU 만실)',
      },
    ];

    setEvents(mockEvents);

    // TODO: 실시간 이벤트 스트림 연결
    // const eventSource = new EventSource('/api/events/stream');
    // eventSource.onmessage = (event) => {
    //   const newEvent = JSON.parse(event.data);
    //   setEvents(prev => [newEvent, ...prev].slice(0, 50));
    // };
    // return () => eventSource.close();
  }, []);

  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'dispatch':
        return ;
      case 'accept':
        return ;
      case 'reject':
        return ;
      case 'recommend':
        return ;
    }
  };

  const getEventColor = (type: Event['type']) => {
    switch (type) {
      case 'dispatch':
        return 'bg-blue-100 text-blue-700';
      case 'accept':
        return 'bg-green-100 text-green-700';
      case 'reject':
        return 'bg-red-100 text-red-700';
      case 'recommend':
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getEventLabel = (type: Event['type']) => {
    switch (type) {
      case 'dispatch':
        return '출동';
      case 'accept':
        return '수용';
      case 'reject':
        return '거부';
      case 'recommend':
        return '추천';
    }
  };

  return (
    
      
        
          
            
            실시간 이벤트 로그
          
          {events.length} 이벤트
        
      
      
        

          {events.map((event) => (
            

              

                {getEventIcon(event.type)}
              

              

                

                  
                    {getEventLabel(event.type)}
                  
                  {event.patient && (
                    {event.patient}
                  )}
                  {event.hospital && (
                    • {event.hospital}
                  )}
                

                
{event.message}


                

                  {formatDate(event.timestamp)}
                


              

            

          ))}
        

      
    
  );
}