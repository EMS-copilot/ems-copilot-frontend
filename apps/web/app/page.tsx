'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ConsentBanner from '@/components/ConsentBanner';
import { Activity, Hospital, FileText, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    

      

        {/* 히어로 섹션 */}
        

          

            EMS Copilot Korea
          

          

            충청권 응급의료 라우팅 및 병원 연계 시스템으로 
            신속하고 효율적인 응급 환자 이송을 지원합니다
          


        


        {/* 기능 카드 */}
        

          
            
              

                
                
              

              응급 대시보드
              
                실시간 출동 현황과 병원 상태를 모니터링하고 
                효율적인 환자 배치를 관리합니다
              
            
            
               window.location.href = '/dashboard'}>
                대시보드로 이동
              
            
          

          
            
              

                
                
              

              병원 관리
              
                병원 수용 능력을 실시간으로 업데이트하고 
                환자 수용 요청을 관리합니다
              
            
            
               window.location.href = '/hospital'}
              >
                병원 화면으로 이동
              
            
          

          
            
              

                
                
              

              API 문서
              
                시스템 통합을 위한 RESTful API 문서와 
                SDK 사용 가이드를 제공합니다
              
            
            
               window.location.href = '/docs'}
              >
                API 문서로 이동
              
            
          
        


        {/* 통계 섹션 */}
        
          
            시스템 현황
          
          
            

              

                
15


                
연계 병원


              

              

                
94%


                
평균 수용률


              

              

                
12분


                
평균 이송 시간


              

              

                
24/7


                
운영 시간


              

            

          
        

        {/* 동의 배너 */}
        
      

    

  );
}