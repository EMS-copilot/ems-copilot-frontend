import { describe, it, expect } from '@jest/globals';
import { POST as EncountersPOST } from '@/app/api/encounters/route';
import { POST as RecommendPOST } from '@/app/api/recommend/route';

// 헬퍼: body로 Fetch 표준 Request 만들기
function jsonRequest(url: string, body: unknown) {
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/encounters (App Router)', () => {
  it('should create a new encounter with valid data', async () => {
    const req = jsonRequest('http://test/api/encounters', {
      patientId: 'P-001',
      location: { lat: 36.6424, lng: 127.489 },
      condition: 'cardiac',
    });

    const res = await EncountersPOST(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data).toHaveProperty('encounterId');
    expect(data).toHaveProperty('timestamp');
    expect(data.message).toBe('환자 접촉 기록이 성공적으로 생성되었습니다');
  });

  it('should return 400 for missing required fields', async () => {
    const req = jsonRequest('http://test/api/encounters', {
      patientId: 'P-001',
      // location 누락
      condition: 'cardiac',
    });
    const res = await EncountersPOST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data).toHaveProperty('error');
    expect(data.code).toBe(400);
  });

  it('should return 400 for invalid condition value', async () => {
    const req = jsonRequest('http://test/api/encounters', {
      patientId: 'P-001',
      location: { lat: 36.6424, lng: 127.489 },
      condition: 'invalid-condition',
    });
    const res = await EncountersPOST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(String(data.error)).toContain('유효하지 않은 condition');
  });
});

describe('/api/recommend (App Router)', () => {
  it('should return recommendations for valid request', async () => {
    const req = jsonRequest('http://test/api/recommend', {
      encounterId: 'E-001',
      urgency: 'critical',
      location: { lat: 36.6424, lng: 127.489 },
    });

    const res = await RecommendPOST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveProperty('recommendations');
    expect(Array.isArray(data.recommendations)).toBe(true);
    expect(data.recommendations.length).toBeGreaterThan(0);
  });

  it('should set policy.rejectAllowed to false for critical patients', async () => {
    const req = jsonRequest('http://test/api/recommend', {
      encounterId: 'E-001',
      urgency: 'critical',
      location: { lat: 36.6424, lng: 127.489 },
    });

    const res = await RecommendPOST(req);
    const data = await res.json();
    expect(data.policy.highRisk).toBe(true);
    expect(data.policy.rejectAllowed).toBe(false);
  });

  it('should set policy.rejectAllowed to true for non-critical patients', async () => {
    const req = jsonRequest('http://test/api/recommend', {
      encounterId: 'E-001',
      urgency: 'normal',
      location: { lat: 36.6424, lng: 127.489 },
    });

    const res = await RecommendPOST(req);
    const data = await res.json();
    expect(data.policy.highRisk).toBe(false);
    expect(data.policy.rejectAllowed).toBe(true);
  });
});
