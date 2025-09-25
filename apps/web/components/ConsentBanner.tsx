'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, X } from 'lucide-react';

export default function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [consent, setConsent] = useState(null);

  useEffect(() => {
    // localStorage에서 동의 상태 확인
    const savedConsent = localStorage.getItem('ems_privacy_consent');
    if (savedConsent === null) {
      setShowBanner(true);
    } else {
      setConsent(savedConsent === 'true');
    }
  }, []);

  const handleConsent = (agreed: boolean) => {
    localStorage.setItem('ems_privacy_consent', agreed.toString());
    setConsent(agreed);
    setShowBanner(false);
    
    // 감사 로그 기록 (실제로는 API 호출)
    console.log('Privacy consent:', agreed ? 'Agreed' : 'Declined');
  };

  if (!showBanner) return null;

  return (
    

      
        

          
          

            

              개인정보 처리 및 응급 예외 동의
            

            

              본 시스템은 응급의료 서비스 제공을 위해 환자의 위치정보와 의료정보를 수집·처리합니다. 
              응급 상황에서는 환자의 생명과 안전을 위해 사전 동의 없이 정보를 처리할 수 있으며, 
              모든 정보는 의료법 및 개인정보보호법에 따라 안전하게 관리됩니다.
            


            

               handleConsent(true)}>
                동의합니다
              
               handleConsent(false)}
              >
                동의하지 않습니다
              
            

          

           setShowBanner(false)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="닫기"
          >
            
          
        

      
    

  );
}