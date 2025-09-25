import { NextRequest, NextResponse } from 'next/server';
import { logAudit } from '@/server/audit';
import { mockHospitals } from '@/lib/data';
import { Urgency, Recommendation, Policy } from '@/lib/types';

interface RecommendRequest {
  encounterId: string;
  urgency: Urgency;
  location: {
    lat: number;
    lng: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RecommendRequest;

    // 요청 검증
    if (!body.encounterId || !body.urgency || !body.location) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다', code: 400 },
        { status: 400 }
      );
    }

    if (!['critical', 'urgent', 'normal'].includes(body.urgency)) {
      return NextResponse.json(
        { error: '유효하지 않은 urgency 값입니다', code: 400 },
        { status: 400 }
      );
    }

    // 정책 설정
    const policy: Policy = {
      highRisk: body.urgency === 'critical',
      rejectAllowed: body.urgency !== 'critical',
    };

    // 추천 생성 (목업 데이터 기반)
    const recommendations: Recommendation[] = mockHospitals.map((hospital, index) => {
      // 거리 기반 ETA 계산 (간단한 모의 계산)
      const distanceFactor = Math.abs(body.location.lat - hospital.location.lat) + 
                           Math.abs(body.location.lng - hospital.location.lng);
      const urgencyMultiplier = body.urgency === 'critical' ? 0.8 : 
                               body.urgency === 'urgent' ? 1.0 : 1.2;
      
      const eta = Math.round(hospital.baseEta * (1 + distanceFactor * 10) * urgencyMultiplier);
      
      // 수용 확률 계산
      const acceptProbability = Math.round(
        hospital.capacity * 100 * (body.urgency === 'critical' ? 1.2 : 1.0)
      );

      // Door to Treatment 시간
      const doorToTreatment = Math.round(15 + Math.random() * 30);

      // 추천 사유
      const reasons = [];
      if (hospital.capacity > 0.7) reasons.push('높은 가용 병상');
      if (eta < 15) reasons.push('빠른 도착 가능');
      if (acceptProbability > 80) reasons.push('높은 수용 확률');
      if (body.urgency === 'critical' && index === 0) reasons.push('중증 환자 우선 배치');

      return {
        rank: index + 1,
        hospitalId: hospital.hospitalId,
        name: hospital.name,
        eta,
        acceptProbability: Math.min(acceptProbability, 100),
        doorToTreatment,
        reasons: reasons.length > 0 ? reasons : ['표준 추천'],
      };
    }).sort((a, b) => {
      // 중증도에 따른 정렬 로직
      if (body.urgency === 'critical') {
        return a.eta - b.eta; // 중증 환자는 ETA 우선
      }
      return b.acceptProbability - a.acceptProbability; // 일반 환자는 수용 확률 우선
    });

    // 순위 재정렬
    recommendations.forEach((rec, index) => {
      rec.rank = index + 1;
    });

    // 감사 로그
    await logAudit({
      userId: 'system', // TODO: 실제 사용자 ID로 교체
      action: 'READ',
      resource: 'recommendation',
      details: {
        encounterId: body.encounterId,
        urgency: body.urgency,
        recommendationCount: recommendations.length,
      },
    });

    // TODO: Azure OpenAI API 통합
    // const aiRecommendation = await azureOpenAI.getRecommendation({
    //   patientCondition: body.condition,
    //   urgency: body.urgency,
    //   hospitals: mockHospitals,
    //   location: body.location
    // });

    return NextResponse.json({
      encounterId: body.encounterId,
      timestamp: new Date().toISOString(),
      policy,
      recommendations,
    });
  } catch (error) {
    console.error('추천 생성 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다', code: 500 },
      { status: 500 }
    );
  }
}