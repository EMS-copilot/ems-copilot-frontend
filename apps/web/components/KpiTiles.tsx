'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calculateAcceptanceRate } from '@/lib/utils';
import { KPIData } from '@/lib/types';
import { Activity, Truck, Users, TrendingUp } from 'lucide-react';

interface KpiTilesProps {
  data: KPIData;
}

export default function KpiTiles({ data }: KpiTilesProps) {
  const acceptanceRate = calculateAcceptanceRate(data.dispatchSum, data.transportSum);

  const tiles = [
    {
      title: '출동',
      value: data.dispatchSum.toLocaleString('ko-KR'),
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: '이송',
      value: data.transportSum.toLocaleString('ko-KR'),
      icon: Truck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: '환자',
      value: data.patientsSum.toLocaleString('ko-KR'),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: '수용률',
      value: `${acceptanceRate}%`,
      icon: TrendingUp,
      color: acceptanceRate > 90 ? 'text-green-600' : 'text-orange-600',
      bgColor: acceptanceRate > 90 ? 'bg-green-50' : 'bg-orange-50',
    },
  ];

  return (
    

      {tiles.map((tile) => (
        
          
            {tile.title}
            

              
            

          
          
            
{tile.value}

            

              {data.month} 기준
            


          
        
      ))}
    

  );
}