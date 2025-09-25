<!-- PASTE:EMS Copilot Korea 🚨

충청권 응급의료 라우팅 및 병원 연계 시스템

목적
구급대가 현장에서 가장 적합한 병원을 빠르고 정확하게 추천·배정할 수 있도록, 실시간 수용능력과 거리/ETA 등을 고려한 라우팅을 제공합니다. 현재 저장소는 데모/프로토타입으로, 목업 데이터와 간단한 정책 로직이 포함되어 있습니다.

목차

아키텍처 개요

기술 스택

프로젝트 구조

로컬 실행

환경 변수

스크립트

API 명세(요약)

데이터 레이어 & 목업

프론트엔드 가이드

백엔드 가이드(App Router)

품질: Lint, Test, CI

보안/개인정보 & 감사로그

코딩 컨벤션

트러블슈팅

로드맵

라이선스

아키텍처 개요
Next.js 14 (App Router)
├─ app/
│  ├─ page.tsx, layout.tsx      # 메인 랜딩
│  ├─ dashboard/page.tsx        # 지표/맵/대기큐
│  ├─ hospital/page.tsx         # 병원 수용관리 UI
│  ├─ docs/page.tsx             # 내장 API 문서 화면
│  └─ api/
│     ├─ encounters/route.ts    # 환자 접촉 생성 (POST)
│     └─ recommend/route.ts     # 병원 추천 (POST)
├─ components/                  # UI & 도메인 컴포넌트
├─ lib/                         # 타입, 유틸, 데이터 접근
├─ server/                      # 서버사이드 유틸(감사로그 등)
└─ public/mnt/data/...csv       # 데모용 CSV


프론트엔드: Next.js + React, Tailwind(Shadcn UI 스타일), lucide-react 아이콘

백엔드(API): Next.js App Router의 Route Handlers (app/api/*/route.ts)

데이터: public/mnt/data/...csv를 클라이언트에서 fetch → PapaParse로 파싱

감사로그: 데모에선 메모리 저장(server/audit.ts), 실제 환경에선 DB/WORM 전환 예정

기술 스택

Runtime/Framework: Node.js 18+, Next.js 14.2.x

언어: TypeScript (strict)

UI: React 18, Tailwind CSS, class-variance-authority, radix primitives

Parsing/Etc: Papa Parse (CSV), lucide-react

테스트: Jest

품질: ESLint, TypeScript, GitHub Actions (lint/test/build)

지도/AI(추가 연동 포인트): Kakao/Naver Maps, Azure OpenAI (플레이스홀더 환경변수만 반영)

프로젝트 구조
ems-copilot/
├─ apps/
│  └─ web/
│     ├─ app/
│     │  ├─ api/
│     │  │  ├─ encounters/route.ts
│     │  │  └─ recommend/route.ts
│     │  ├─ dashboard/page.tsx
│     │  ├─ hospital/page.tsx
│     │  ├─ docs/page.tsx
│     │  ├─ layout.tsx
│     │  ├─ page.tsx
│     │  └─ globals.css
│     ├─ components/
│     │  ├─ ui/{button,card,badge,modal}.tsx
│     │  ├─ KpiTiles.tsx, MapMock.tsx, RecommendModal.tsx, ...
│     ├─ lib/{utils.ts,data.ts,types.ts}
│     ├─ server/audit.ts
│     ├─ public/mnt/data/ems_pack/ems_chungcheong_2024-2025_mock.csv
│     ├─ package.json, tsconfig.json, tailwind.config.ts, next.config.js
│     └─ __tests__/api.test.ts, jest.config.js
├─ docs/{data_schema.md,metrics.md}
├─ .github/workflows/ci.yml
└─ README.md

로컬 실행
# 1) Node 18+ 확인
node -v

# 2) 의존성 설치
cd apps/web
npm install

# 3) 환경변수 템플릿 복사
cp .env.local.example .env.local
# 필요 값 채우기 (아래 [환경 변수] 참고)

# 4) 개발 서버
npm run dev
# http://localhost:3000

# 5) 품질 체크
npm run lint
npm test
npm run build


Windows PowerShell:

cd apps/web
npm install
copy .env.local.example .env.local
npm run dev

환경 변수

apps/web/.env.local.example 참고:

NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_REGION=충북
NEXT_PUBLIC_ENV=development

# (연동 예정) Azure OpenAI
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini

# (연동 예정) Kakao / Naver Cloud
KAKAO_REST_API_KEY=
NCLOUD_ACCESS_KEY=
NCLOUD_SECRET_KEY=


주의

NEXT_PUBLIC_* 는 브라우저에 노출됩니다. 민감정보는 절대 넣지 마세요.

실제 키는 .env.local에만 보관하고 커밋 금지(.gitignore 적용).

스크립트

apps/web/package.json

dev – Next.js 개발 서버

build – 프로덕션 빌드

start – 빌드된 앱 실행

lint – ESLint

test – Jest

문서/시뮬레이션 가이드는 scripts/simulator.md, docs/metrics.md, docs/data_schema.md 참고.

API 명세(요약)
1) POST /api/encounters — 환자 접촉 생성

Request

{
  "patientId": "string",
  "location": { "lat": 36.6424, "lng": 127.4890 },
  "condition": "cardiac|trauma|respiratory|stroke|other"
}


Response (201)

{
  "message": "환자 접촉 기록이 성공적으로 생성되었습니다",
  "encounterId": "string",
  "timestamp": "ISO 8601"
}


에러 (400/500)

{ "error": "필수 필드가 누락되었습니다", "code": 400 }

2) POST /api/recommend — 병원 추천

Request

{
  "encounterId": "string",
  "urgency": "critical|urgent|normal",
  "location": { "lat": 36.6424, "lng": 127.4890 }
}


Response (200)

{
  "encounterId": "string",
  "timestamp": "ISO 8601",
  "policy": { "highRisk": true, "rejectAllowed": false },
  "recommendations": [
    {
      "rank": 1,
      "hospitalId": "h1",
      "name": "충북대학교병원",
      "eta": 12,
      "acceptProbability": 94,
      "doorToTreatment": 28,
      "reasons": ["높은 가용 병상","빠른 도착 가능"]
    }
  ]
}


정책 로직(요약)

highRisk = (urgency === 'critical')

rejectAllowed = !highRisk

정렬: critical은 ETA 우선, 그 외는 수용 확률 우선

데이터 레이어 & 목업

CSV: apps/web/public/mnt/data/ems_pack/ems_chungcheong_2024-2025_mock.csv

region, month, dispatch, transport, patients

파싱: lib/data.ts → loadCSVData()에서 fetch('/mnt/data/...csv') 후 Papa Parse

KPI: getLatestKPIs(region), getMonthlyKPI(region)

병원 목록: mockHospitals (ETA/수용률 계산 데모용 필드 포함)

프론트엔드 가이드

UI 컴포넌트

components/ui/{button,card,badge,modal}.tsx – shadcn 스타일 유틸

components/KpiTiles.tsx – KPI 4타일 (출동/이송/환자/수용률)

components/MapMock.tsx – 지도 영역(플레이스홀더 + 병원 리스트)

components/RecommendModal.tsx – 추천 결과 모달

components/EventLog.tsx – 이벤트 타임라인

components/IncomingTable.tsx, CapacityPanel.tsx, ActionModal.tsx – 병원 화면

페이지

/ – 랜딩

/dashboard – 대시보드(맵/대기큐/추천모달)

/hospital – 병원 수용 관리

/docs – 내장 API 문서/SDK 예시

스타일/유틸

Tailwind + cn() 유틸 (lib/utils.ts)

아이콘: lucide-react

국제화는 한국어 UI 중심(숫자 포맷 toLocaleString('ko-KR'), 날짜 Intl 사용)

백엔드 가이드(App Router)

핸들러 시그니처: export async function POST(request: NextRequest)

응답: NextResponse.json(data, { status })

감사로그: server/audit.ts의 logAudit() 사용

외부 연동 포인트

Azure OpenAI(정책/설명 생성 등) – 주석/환경변수만 있음

Kakao/Naver 지도 – MapMock.tsx에 연동 TODO 주석 표시

테스트에서 라우트를 부르는 방법(표준 Request 사용):

import { POST as RecommendPOST } from '@/app/api/recommend/route';

const req = new Request('http://test/api/recommend', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ encounterId:'E-1', urgency:'urgent', location:{lat:36.6,lng:127.4} })
});
const res = await RecommendPOST(req);
expect(res.status).toBe(200);

품질: Lint, Test, CI

ESLint: npm run lint

Jest: apps/web/__tests__/api.test.ts
App Router 기준으로 표준 Request를 사용해 POST 함수를 직접 호출

CI(GitHub Actions): .github/workflows/ci.yml

lint → test → build

apps/web 하위에서 의존성 설치/검사/빌드

lockfile 유무에 따라 npm ci/npm install 동작하도록 구성 가능

보안/개인정보 & 감사로그

ConsentBanner 컴포넌트에 응급 상황 개인정보 처리 고지/동의 배너 포함(데모)

Audit: server/audit.ts는 현재 메모리 저장소 사용
→ 실제 운영 시 DB + WORM(S3 Glacier 등) + 암호화/무결성 체크로 대체 필요

민감 정보는 절대 클라이언트 노출 금지 (NEXT_PUBLIC_* 주의)

코딩 컨벤션

TypeScript strict 유지

경로 별칭: @/* (tsconfig paths)

폴더/파일명: PascalCase 컴포넌트, kebab-case 라우트

상태 관리: 현재는 컴포넌트 내부 state (필요 시 React Query/Server Actions로 확장)

커밋 메시지: Conventional Commits 권장
ex) feat:, fix:, chore:, refactor:, test:, docs:

트러블슈팅

CI에서 npm ci 실패: package-lock.json 커밋했는지 확인. 없으면 npm install 후 커밋

CSV 로딩 실패: public/mnt/data/...csv 경로/파일 존재 확인. CORS/경로 오타 체크

App Router 테스트 에러: node-mocks-http가 아닌 표준 Request 사용

환경변수 미반영: .env.local 위치가 apps/web/ 아래인지 확인

로드맵

실 지도 연동 (Kakao/Naver Maps)

실제 병원 수용능력 데이터 API 연계

추천 엔진 고도화 (실측 ETA, 혼잡도, 전문과 Matching, 정책 플래그)

Azure OpenAI 기반 사유/설명 생성, triage 보조

실시간 스트림(EventSource/WebSocket)

데이터 저장소 전환 + 감사로그 WORM 스토리지 + SIEM 연동

라이선스

팀/조직 내 공모전 용도로 사용 중입니다. 외부 공개 시 라이선스 및 3rd-party 약관을 함께 검토하세요.

문의

FE: Next.js/Tailwind 구조, 컴포넌트·상태·라우팅 관련

BE: App Router 핸들러, 정책/추천 로직, 감사로그/데이터 연계 관련 README.md -->

