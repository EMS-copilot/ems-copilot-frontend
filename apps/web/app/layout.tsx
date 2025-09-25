import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EMS Copilot Korea - 충청권 응급의료 라우팅 시스템',
  description: '충청권 응급환자 병원 연계 및 라우팅 최적화 시스템',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
      
        

          

            

              

                
                  🚨 EMS Copilot Korea
                
              

              

                
                  홈
                
                
                  대시보드
                
                
                  병원 관리
                
                
                  API 문서
                
              

            

          

        

        
{children}

      
    
  );
}