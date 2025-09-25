# setup.ps1  (레포 루트에서 실행)
$ErrorActionPreference = 'Stop'

function New-Dir([string]$p){$d=Split-Path $p;if($d){New-Item -ItemType Directory -Force -Path $d | Out-Null}}
function New-Text([string]$p,[string]$c=""){New-Dir $p;Set-Content -Path $p -Value $c -Encoding UTF8}

@"
# Node / Next.js
node_modules/
.next/
out/
dist/
coverage/
*.log
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*

# Env
.env*
!.env.local.example

# OS / Editor
.DS_Store
*.swp
.vscode/
.idea/
"@ | Set-Content .gitignore -Encoding UTF8

$files = @(
"README.md",
"docs/data_schema.md","docs/metrics.md","scripts/simulator.md",".github/workflows/ci.yml",
"apps/web/package.json","apps/web/tsconfig.json","apps/web/tailwind.config.ts","apps/web/next.config.js","apps/web/.env.local.example",
"apps/web/app/api/encounters/route.ts","apps/web/app/api/recommend/route.ts",
"apps/web/app/dashboard/page.tsx","apps/web/app/hospital/page.tsx","apps/web/app/docs/page.tsx",
"apps/web/app/layout.tsx","apps/web/app/page.tsx","apps/web/app/globals.css",
"apps/web/components/ui/button.tsx","apps/web/components/ui/card.tsx","apps/web/components/ui/badge.tsx","apps/web/components/ui/modal.tsx",
"apps/web/components/KpiTiles.tsx","apps/web/components/MapMock.tsx","apps/web/components/RecommendModal.tsx",
"apps/web/components/EventLog.tsx","apps/web/components/IncomingTable.tsx","apps/web/components/CapacityPanel.tsx",
"apps/web/components/ActionModal.tsx","apps/web/components/ConsentBanner.tsx",
"apps/web/lib/utils.ts","apps/web/lib/data.ts","apps/web/lib/types.ts","apps/web/server/audit.ts",
"apps/web/public/mnt/data/ems_pack/ems_chungcheong_2024-2025_mock.csv",
"apps/web/__tests__/api.test.ts","apps/web/jest.config.js","apps/web/jest.setup.js"
)

foreach($f in $files){
  $ext=[IO.Path]::GetExtension($f).ToLower()
  switch($ext){
    ".ts" { New-Text $f "// PASTE: $f`r`n" }
    ".tsx"{ New-Text $f "// PASTE: $f`r`n" }
    ".js" { New-Text $f "// PASTE: $f`r`n" }
    ".css"{ New-Text $f "/* PASTE: $f */`r`n" }
    ".yml"{ New-Text $f "# PASTE: $f`r`n" }
    ".md" { New-Text $f "<!-- PASTE: $f -->`r`n" }
    ".json"{ New-Text $f "{`n  `"_paste`": `"$f`"`n}" }
    ".csv"{ New-Text $f "" }
    default{ New-Text $f "# PASTE: $f`r`n" }
  }
}

Write-Host "✅ 스캐폴드 생성 완료. 각 파일에 파일블록을 붙여넣으세요!"
