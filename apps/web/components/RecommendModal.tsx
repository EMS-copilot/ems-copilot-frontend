'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Recommendation, Policy } from '@/lib/types';
import { X, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface RecommendModalProps {
  isOpen: boolean;
  onClose: () => void;
  encounterId: string;
  recommendations: Recommendation[];
  policy: Policy;
  onSelect: (hospital: Recommendation) => void;
}

export default function RecommendModal({
  isOpen,
  onClose,
  encounterId,
  recommendations,
  policy,
  onSelect,
}: RecommendModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    

      {/* 배경 오버레이 */}
      

      
      {/* 모달 컨텐츠 */}
      

        {/* 헤더 */}
        

          

            
병원 추천

            

              환자 ID: {encounterId}
            


          

          

            {policy.highRisk && (
              
                
                고위험 환자
              
            )}
            
              
            
          

        

        
        {/* 바디 */}
        

          

            {recommendations.map((rec) => (
               onSelect(rec)}
              >
                

                  

                    

                      #{rec.rank}
                      
{rec.name}

                    

                    
                    

                      

                        
                        

                          
도착 예상


                          
{rec.eta}분


                        

                      

                      
                      

                        
                        

                          
수용 확률


                          
{rec.acceptProbability}%


                        

                      

                      
                      

                        
                        

                          
치료 시작


                          
{rec.doorToTreatment}분


                        

                      

                    

                    
                    {rec.reasons.length > 0 && (
                      

                        
추천 사유:


                        

                          {rec.reasons.map((reason, idx) => (
                            
                              {reason}
                            
                          ))}
                        

                      

                    )}
                  

                  
                   {
                      e.stopPropagation();
                      onSelect(rec);
                    }}
                  >
                    선택
                  
                

              
            ))}
          

        

        
        {/* 푸터 */}
        

          

            

              {!policy.rejectAllowed && '* 고위험 환자는 병원 거부가 불가능합니다'}
            


            
              취소
            
          

        

      

    

  );
}