EMS Copilot Korea — Frontend (Next.js + TypeScript + Tailwind)

응급의료 운영을 돕는 EMS Copilot Korea의 프론트엔드 리포지토리입니다.
Next.js(App Router) + TypeScript + TailwindCSS 기반으로 대시보드/병원관리/문서 페이지를 포함한 기본 뼈대를 제공합니다.

✅ 주요 기능(현재 스캐폴드 기준)

App Router 구조의 페이지 라우팅 (/, /dashboard, /hospital, /docs)

공용 UI 컴포넌트(버튼/카드/배지/모달)와 도메인 컴포넌트(대시보드/병원관리)

유틸/타입/훅 분리 (src/lib, src/types, src/hooks)

Tailwind 전역 스타일 및 경로 별칭(@/*) 설정

🧰 기술 스택

Framework: Next.js (App Router)

Language: TypeScript

UI: TailwindCSS

Etc: ESLint, (테스트 디렉터리만 준비됨)

🧩 사전 준비

Node.js 18+ (권장 20+)

npm (또는 선호 시 pnpm/yarn으로 스크립트만 맞춰 사용)

🚀 빠른 시작
# 의존성 설치
npm install

# 개발 서버
npm run dev
# http://localhost:3000


Windows PowerShell/터미널에서 바로 실행 가능합니다.

🔧 스크립트
{
  "dev": "next dev -p 3000",
  "build": "next build",
  "start": "next start -p 3000",
  "lint": "next lint",
  "typecheck": "tsc --noEmit"
}


dev: 개발 서버 실행

build: 프로덕션 빌드

start: 빌드 결과 실행

lint: ESLint 검사

typecheck: 타입 검사만 수행

🔐 환경 변수

루트에 .env.local 파일을 생성해 아래 예시를 채워주세요.

NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001/ws


NEXT_PUBLIC_* 접두사는 브라우저에서도 노출됩니다. 민감정보는 백엔드로 넘겨주세요.

📁 디렉터리 구조
ems-copilot-frontend/
├── src/
│   ├── app/
│   │   ├── dashboard/page.tsx
│   │   ├── hospital/page.tsx
│   │   ├── docs/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/{button,card,badge,modal}.tsx
│   │   ├── dashboard/{KpiTiles,MapMock,EventLog,RecommendModal}.tsx
│   │   ├── hospital/{IncomingTable,CapacityPanel,ActionModal}.tsx
│   │   └── common/ConsentBanner.tsx
│   ├── lib/{api.ts,utils.ts,constants.ts}
│   ├── types/index.ts
│   ├── hooks/{useApi.ts,useLocalStorage.ts,useWebSocket.ts}
│   └── styles/globals.css
├── public/images/.gitkeep
├── __tests__/.gitkeep
├── .env.local.example
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── package.json
└── README.md


경로 별칭: @/* → src/* (예: import Button from '@/components/ui/button')

스타일: src/app/globals.css → src/styles/globals.css를 import

🧩 VS Code 추천 설정

Extensions

ESLint

Tailwind CSS IntelliSense

Prettier(선호 시)

편의 설정

"editor.formatOnSave": true

ESLint + Prettier를 함께 쓴다면 관련 설정 추가

🧪 테스트(옵션)

현재 __tests__ 디렉터리만 포함되어 있습니다.
Jest/RTL을 사용할 경우 다음을 추가하세요.

jest, ts-jest, @testing-library/react, @types/jest 등 설치

jest.config.ts 작성 및 package.json에 "test" 스크립트 추가

🛠️ 배포(예시)

Vercel: Next.js 기본 설정으로 바로 배포 가능

자체 서버:

npm run build
npm run start  # NODE_ENV=production


리버스 프록시(Nginx) 등으로 3000 포트를 연결

🧭 협업 가이드(간단)

브랜치: feature/*, fix/*, chore/*

PR: 스크린샷/동영상(가능 시), 변경 요약, 테스트 방법 포함

커밋 메시지: feat:, fix:, chore:, refactor: 등 prefix 권장

🧰 트러블슈팅

Tailwind 스타일이 적용되지 않음

src/app/globals.css 안에서 @import '../styles/globals.css';가 있는지 확인

tailwind.config.ts의 content 경로에 src 하위가 모두 포함됐는지 확인

모듈 경로 오류(@/...)

tsconfig.json의 paths 설정 확인: "@/*": ["./src/*"]

API 호출 실패

.env.local의 NEXT_PUBLIC_API_BASE_URL 값을 점검

브라우저 콘솔과 네트워크 탭에서 에러 메시지 확인

라이선스

TBD (팀 내 정책에 맞게 지정하세요)