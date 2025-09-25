EMS Copilot Korea

충청권 응급의료 라우팅 & 병원 연계 데모 시스템
Next.js(App Router) + TypeScript + CSV 데이터 레이어

📌 핵심 요약

목적: 현장 구급대가 가장 적합한 병원을 빠르고 정확하게 추천·배정

주요 화면: 대시보드(지표/지도/대기큐), 병원(수용관리), API 문서

데이터: public/mnt/data/...csv 를 Papa Parse로 파싱

API: Next.js App Router(/app/api/**/route.ts)로 간단 목업 구현


🚀 빠른 시작
cd apps/web
npm install
cp .env.local.example .env.local   # 필요한 값 입력
npm run dev                        # http://localhost:3000


빌드/운영:
npm run build
npm start


품질 도구:
npm run lint
npm test


🧱 프로젝트 구조
ems-copilot/
├─ apps/web/
│  ├─ app/
│  │  ├─ api/
│  │  │  ├─ encounters/route.ts
│  │  │  └─ recommend/route.ts
│  │  ├─ dashboard/page.tsx
│  │  ├─ hospital/page.tsx
│  │  ├─ docs/page.tsx
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  └─ globals.css
│  ├─ components/
│  │  ├─ ui/{button,card,badge,modal}.tsx
│  │  ├─ KpiTiles.tsx, MapMock.tsx, RecommendModal.tsx
│  │  ├─ EventLog.tsx, IncomingTable.tsx, CapacityPanel.tsx
│  │  ├─ ActionModal.tsx, ConsentBanner.tsx
│  ├─ lib/{utils.ts,data.ts,types.ts}
│  ├─ server/audit.ts
│  ├─ public/mnt/data/ems_pack/ems_chungcheong_2024-2025_mock.csv
│  ├─ package.json, tsconfig.json, tailwind.config.ts, next.config.js
│  └─ __tests__/api.test.ts, jest.config.js
├─ docs/{data_schema.md,metrics.md}
├─ .github/workflows/ci.yml
└─ README.md



🛠 기술 스택
Framework/Language: Next.js 14(App Router), React 18, TypeScript

UI: Tailwind CSS, class-variance-authority, Radix Primitives, lucide-react

Data: CSV + Papa Parse

품질: Jest, ESLint, GitHub Actions

경로 별칭: @/* (예: import { cn } from '@/lib/utils')


🔐 환경 변수
apps/web/.env.local.example를 복사해 .env.local로 사용합니다.

NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_REGION=충북
NEXT_PUBLIC_ENV=development
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
KAKAO_REST_API_KEY=
NCLOUD_ACCESS_KEY=
NCLOUD_SECRET_KEY=
NEXT_PUBLIC_* 값은 브라우저에 노출됩니다(민감정보 넣지 않기).


🖥 페이지
/ 랜딩: 기능 카드 + 시스템 현황

/dashboard: KPI 타일, 병원 현황(목업 지도), 대기 환자 큐, 추천 모달

/hospital: 병원 수용 능력, 접근 환자 테이블, 수용/거부 액션

/docs: API 가이드(샘플)


📡 API 요약 (App Router)
핸들러는 /app/api/**/route.ts에 export async function POST(...) 형태로 구현.

POST /api/encounters — 환자 접촉 생성

Request
{ "patientId": "P-001", "location": { "lat": 36.6424, "lng": 127.4890 }, "condition": "cardiac" }

Response (201)
{ "message": "환자 접촉 기록이 성공적으로 생성되었습니다", "encounterId": "E-...", "timestamp": "..." }


POST /api/recommend — 병원 추천
Request
{ "encounterId": "E-...", "urgency": "critical", "location": { "lat": 36.6424, "lng": 127.4890 } }


Response (200)
{
  "policy": { "highRisk": true, "rejectAllowed": false },
  "recommendations": [
    { "rank": 1, "name": "충북대학교병원", "eta": 12, "acceptProbability": 94, "doorToTreatment": 28, "reasons": ["높은 가용 병상","빠른 도착 가능"] }
  ]
}


cURL 예시:
curl -X POST http://localhost:3000/api/encounters \
  -H "Content-Type: application/json" \
  -d '{"patientId":"P-001","location":{"lat":36.6424,"lng":127.4890},"condition":"cardiac"}'

curl -X POST http://localhost:3000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"encounterId":"E-1","urgency":"urgent","location":{"lat":36.64,"lng":127.48}}'



📊 데이터 레이어

CSV: public/mnt/data/ems_pack/ems_chungcheong_2024-2025_mock.csv

로딩: lib/data.ts → loadCSVData()가 fetch() 후 Papa Parse 파싱

KPI: getLatestKPIs(region), getMonthlyKPI(region)

병원(목업): mockHospitals → ETA/확률/사유 생성에 활용

실패 시 폴백 데이터 반환(데모 친화적)



🧩 프론트엔드 가이드

상태는 페이지 컴포넌트에서 로드(getLatestKPIs, /api/recommend)

공통 UI는 components/ui/*, 도메인 컴포넌트는 components/*

접근성: 버튼, 닫기, ESC 등 기본 핸들링 추가

스타일: Tailwind(의미 있는 클래스 네이밍 유지)



🔧 백엔드 가이드

감사 로그: server/audit.ts (메모리 저장소; 운영 전환 시 DB/WORM + 암호화/무결성 권장)

검증: 필수 필드/enum 체크 → 400 반환

정책: critical 환자일 때 rejectAllowed=false



🧪 테스트 & 🏗 CI

테스트: apps/web/__tests__/api.test.ts

실행: npm test

App Router 테스트는 표준 Request/Response 사용 권장

CI: .github/workflows/ci.yml (Lint → Test → Build, Node 18)



🛡 보안/개인정보

동의 배너 제공(데모): ConsentBanner

운영 시: 키/토큰 비공개 관리, HTTPS, 감사로그 암호화·무결성·장기보관(WORM)



