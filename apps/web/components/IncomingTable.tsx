'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, User, Activity } from 'lucide-react';

export interface IncomingPatient {
  id: string;
  eta: number;
  condition: string;
  urgency: 'critical' | 'urgent' | 'normal';
  department: string;
  ems: string;
}

interface IncomingTableProps {
  patients: IncomingPatient[];
  onAction: (patient: IncomingPatient) => void;
}

export default function IncomingTable({ patients, onAction }: IncomingTableProps) {
  const urgencyColors = {
    critical: 'destructive',
    urgent: 'warning',
    normal: 'secondary',
  } as const;

  const urgencyLabels = {
    critical: '위급',
    urgent: '긴급',
    normal: '일반',
  };

  return (
    
      
        
          
          접근 중인 환자
        
      
      
        {patients.length === 0 ? (
          

            현재 접근 중인 환자가 없습니다
          

        ) : (
          

            
                {patients.map((patient) => (
                  
                ))}
              
환자 ID	도착 예상	의심 질환	전문과	중증도	구급대	작업

                      

                        
                        {patient.id}
                      

                    	
                      

                        
                        {patient.eta}분
                      

                    	{patient.condition}	{patient.department}	
                      
                        {patient.urgency === 'critical' && (
                          
                        )}
                        {urgencyLabels[patient.urgency]}
                      
                    	{patient.ems}	
                       onAction(patient)}
                        disabled={false}
                      >
                        대응
                      
                    

          

        )}
      
    
  );
}