'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CapacityData } from '@/lib/types';
import { Bed, Users, Activity, AlertCircle, Save, X, Edit } from 'lucide-react';

export default function CapacityPanel() {
  const [capacity, setCapacity] = useState({
    or: 5,
    icu: 10,
    specialists: 8,
    emergencyBeds: 25,
  });
  const [editMode, setEditMode] = useState(false);
  const [tempCapacity, setTempCapacity] = useState(capacity);

  useEffect(() => {
    // localStorage에서 데이터 로드
    const saved = localStorage.getItem('hospital_capacity');
    if (saved) {
      const data = JSON.parse(saved);
      setCapacity(data);
      setTempCapacity(data);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('hospital_capacity', JSON.stringify(tempCapacity));
    setCapacity(tempCapacity);
    setEditMode(false);
    
    // TODO: API 호출로 서버에 업데이트
    // await updateHospitalCapacity(tempCapacity);
  };

  const handleCancel = () => {
    setTempCapacity(capacity);
    setEditMode(false);
  };

  const capacityItems = [
    {
      key: 'or' as keyof CapacityData,
      label: '수술실',
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      key: 'icu' as keyof CapacityData,
      label: 'ICU',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      key: 'specialists' as keyof CapacityData,
      label: '전문의',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      key: 'emergencyBeds' as keyof CapacityData,
      label: '응급 병상',
      icon: Bed,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    
      
        
          
            
            병원 수용 능력
          
          

            {editMode ? (
              <>
                
                  
                  취소
                
                
                  
                  저장
                
              
            ) : (
               setEditMode(true)}>
                
                수정
              
            )}
          

        
      
      
        

          {capacityItems.map((item) => (
            

              

                

                  
                

                {item.label}
              

              {editMode ? (
                

                    setTempCapacity({
                      ...tempCapacity,
                      [item.key]: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                
{capacity[item.key]}

              )}
            

          ))}
        

        
        

          
수용 가능 상태

          

            

              전체 가용률:
               10 ? 'success' : 'warning'}>
                {Math.round((capacity.emergencyBeds / 50) * 100)}%
              
            

            

              ICU 가용:
               5 ? 'success' : 'destructive'}>
                {capacity.icu > 5 ? '여유' : '부족'}
              
            

          

        

      
    
  );
}