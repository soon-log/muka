# MUKA 프로젝트 구조

## 디렉터리 트리

```
muka/
├── .claude/                    # Claude Code 설정
│   ├── agents/                 # 에이전트 정의
│   ├── commands/               # 슬래시 명령
│   ├── rules/                  # 규칙 파일
│   │   ├── core/               # 핵심 규칙
│   │   ├── development/        # 개발 규칙
│   │   └── workflow/           # 워크플로우 규칙
│   └── skills/                 # 스킬 정의
│
├── .github/                    # GitHub 설정
│   └── workflows/              # CI/CD 워크플로우
│
├── .husky/                     # Git 훅
│   └── pre-commit              # 커밋 전 린트/포맷
│
├── .moai/                      # MoAI-ADK 설정
│   ├── announcements/          # 공지사항
│   ├── backups/                # 백업 파일
│   ├── config/                 # 구성 설정
│   ├── docs/                   # 생성된 문서
│   ├── llm-configs/            # LLM 구성
│   ├── logs/                   # 로그 파일
│   ├── memory/                 # 메모리 저장소
│   ├── project/                # 프로젝트 문서 (현재 위치)
│   ├── reports/                # 보고서
│   └── specs/                  # SPEC 문서
│
├── doc/                        # 프로젝트 문서
│   ├── prd.md                  # 제품 요구사항 문서
│   ├── trd.md                  # 기술 요구사항 문서
│   ├── design-guide.md         # 디자인 가이드
│   └── execution-plan.md       # 실행 계획
│
├── e2e/                        # E2E 테스트 (Playwright)
│   └── *.spec.ts               # E2E 테스트 파일
│
├── example/                    # 참조 구현 예시
│   ├── components/             # 예시 컴포넌트
│   └── services/               # 예시 서비스
│
├── public/                     # 정적 에셋
│   ├── favicon.ico             # 파비콘
│   └── images/                 # 이미지 에셋
│
├── src/                        # 소스 코드
│   └── app/                    # Next.js App Router
│       ├── __tests__/          # 단위 테스트
│       ├── api/                # API Routes
│       │   ├── links/          # 링크 관리 API
│       │   ├── og/             # OG 이미지 생성
│       │   ├── card-image/     # 카드 이미지 생성
│       │   └── cron/           # Cron 작업
│       ├── q/[id]/             # 질문 페이지 (동적)
│       ├── card/               # 카드 페이지
│       ├── layout.tsx          # 루트 레이아웃
│       ├── page.tsx            # 홈페이지
│       └── globals.css         # 전역 스타일
│
├── .env.example                # 환경변수 템플릿
├── .env.local                  # 로컬 환경변수 (gitignore)
├── .gitignore                  # Git 제외 파일
├── .mcp.json                   # MCP 서버 구성
├── .prettierrc                 # Prettier 설정
├── CLAUDE.md                   # Claude Code 지침
├── README.md                   # 프로젝트 소개
├── eslint.config.mjs           # ESLint 설정
├── next.config.ts              # Next.js 설정
├── package.json                # 패키지 정보
├── playwright.config.ts        # Playwright 설정
├── pnpm-lock.yaml              # pnpm 잠금 파일
├── pnpm-workspace.yaml         # pnpm 워크스페이스
├── postcss.config.mjs          # PostCSS 설정
├── tsconfig.json               # TypeScript 설정
├── vitest.config.ts            # Vitest 설정
└── vitest.setup.ts             # Vitest 셋업
```

---

## 주요 디렉터리 설명

### `/src/app/` - Next.js App Router

Next.js 16의 App Router를 사용하는 메인 애플리케이션 디렉터리입니다.

| 경로          | 용도                                   |
| ------------- | -------------------------------------- |
| `layout.tsx`  | 루트 레이아웃 (HTML, 폰트, 메타데이터) |
| `page.tsx`    | 홈페이지 (질문 선택 화면)              |
| `globals.css` | Tailwind CSS 전역 스타일               |
| `__tests__/`  | 페이지 단위 테스트                     |
| `api/`        | API Routes (서버리스 함수)             |
| `q/[id]/`     | 동적 질문 페이지                       |
| `card/`       | 카드 뷰어 페이지                       |

### `/src/app/api/` - API Routes

서버리스 API 엔드포인트입니다.

| 엔드포인트            | 메서드 | 용도                         |
| --------------------- | ------ | ---------------------------- |
| `/api/links`          | POST   | 새 링크 생성                 |
| `/api/links/[id]`     | GET    | 링크 상태 확인               |
| `/api/links/[id]/use` | POST   | 링크 사용 처리               |
| `/api/og`             | GET    | OG 이미지 생성 (1200x630)    |
| `/api/card-image`     | GET    | 카드 이미지 생성 (1080x1920) |
| `/api/cron/cleanup`   | POST   | 만료 링크 정리               |

### `/doc/` - 프로젝트 문서

기획 및 기술 문서를 보관합니다.

| 파일                | 내용                                   |
| ------------------- | -------------------------------------- |
| `prd.md`            | 제품 요구사항 (기능, 플로우, MVP 범위) |
| `trd.md`            | 기술 요구사항 (스택, API, DB 스키마)   |
| `design-guide.md`   | 디자인 시스템 (컬러, 타이포, 컴포넌트) |
| `execution-plan.md` | 개발 실행 계획                         |

### `/e2e/` - E2E 테스트

Playwright를 사용한 End-to-End 테스트입니다.

| 테스트 파일            | 검증 내용         |
| ---------------------- | ----------------- |
| `create-link.spec.ts`  | 링크 생성 플로우  |
| `select-music.spec.ts` | 음악 검색 및 선택 |
| `share-card.spec.ts`   | 카드 공유 기능    |

### `/example/` - 참조 구현

개발 참조용 예시 코드입니다.

| 디렉터리      | 내용               |
| ------------- | ------------------ |
| `components/` | 참조 컴포넌트 구현 |
| `services/`   | 참조 서비스 로직   |

### `/.moai/` - MoAI-ADK 설정

AI 기반 개발 도구 설정입니다.

| 디렉터리   | 용도                                     |
| ---------- | ---------------------------------------- |
| `config/`  | 품질, 언어, 사용자 설정                  |
| `specs/`   | SPEC 문서 저장소                         |
| `project/` | 프로젝트 문서 (product, structure, tech) |
| `logs/`    | 실행 로그                                |
| `memory/`  | 세션 간 메모리                           |

---

## 핵심 파일 위치

### 설정 파일

| 파일                   | 용도                 | 위치       |
| ---------------------- | -------------------- | ---------- |
| `next.config.ts`       | Next.js 설정         | `/`        |
| `tsconfig.json`        | TypeScript 설정      | `/`        |
| `tailwind.config.ts`   | Tailwind 설정        | `/` (예정) |
| `eslint.config.mjs`    | ESLint 9 Flat Config | `/`        |
| `.prettierrc`          | Prettier 설정        | `/`        |
| `vitest.config.ts`     | 테스트 설정          | `/`        |
| `playwright.config.ts` | E2E 테스트 설정      | `/`        |

### 환경 변수

| 파일           | 용도                       |
| -------------- | -------------------------- |
| `.env.example` | 환경변수 템플릿 (Git 포함) |
| `.env.local`   | 로컬 환경변수 (Git 제외)   |

### CI/CD

| 파일                 | 용도                      |
| -------------------- | ------------------------- |
| `.github/workflows/` | GitHub Actions 워크플로우 |
| `vercel.json`        | Vercel 배포 설정 (예정)   |

---

## 모듈 구성 방식: Feature-Sliced Design (FSD)

MUKA는 **Feature-Sliced Design (FSD)** 아키텍처 패턴을 따릅니다.

### FSD 레이어 구조

```
src/
├── app/          # Layer 1: App (엔트리포인트, 라우팅)
├── pages/        # Layer 2: Pages (페이지 컴포넌트) - App Router에 통합
├── widgets/      # Layer 3: Widgets (독립적 UI 블록) - 예정
├── features/     # Layer 4: Features (사용자 시나리오) - 예정
├── entities/     # Layer 5: Entities (비즈니스 엔티티) - 예정
├── shared/       # Layer 6: Shared (공유 유틸리티) - 예정
│   ├── ui/       # 공통 UI 컴포넌트
│   ├── lib/      # 유틸리티 함수
│   ├── api/      # API 클라이언트
│   └── types/    # 공통 타입 정의
```

### 현재 구조 (MVP)

MVP 단계에서는 단순화된 구조를 사용합니다:

```
src/
├── app/          # Next.js App Router (Pages + App 레이어 통합)
├── components/   # UI 컴포넌트 (예정)
├── lib/          # 유틸리티 함수 (예정)
└── types/        # TypeScript 타입 (예정)
```

### FSD 원칙

1. **단방향 의존성**: 상위 레이어만 하위 레이어를 import
2. **Public API**: 각 슬라이스는 index.ts로 공개 인터페이스 정의
3. **격리**: 슬라이스 간 직접 참조 금지

---

## 파일 네이밍 규칙

### 컴포넌트

| 유형     | 패턴             | 예시                  |
| -------- | ---------------- | --------------------- |
| 페이지   | `page.tsx`       | `app/q/[id]/page.tsx` |
| 레이아웃 | `layout.tsx`     | `app/layout.tsx`      |
| 컴포넌트 | `PascalCase.tsx` | `MusicCard.tsx`       |
| 훅       | `use*.ts`        | `useSpotifySearch.ts` |
| 유틸리티 | `camelCase.ts`   | `formatTrackName.ts`  |

### 테스트

| 유형        | 패턴         | 위치                      |
| ----------- | ------------ | ------------------------- |
| 단위 테스트 | `*.test.tsx` | `__tests__/` 또는 소스 옆 |
| E2E 테스트  | `*.spec.ts`  | `e2e/`                    |

### API Routes

| 유형        | 패턴               | 예시                      |
| ----------- | ------------------ | ------------------------- |
| 핸들러      | `route.ts`         | `api/links/route.ts`      |
| 동적 라우트 | `[param]/route.ts` | `api/links/[id]/route.ts` |

---

## Import 경로

### 절대 경로 설정

`tsconfig.json`에서 경로 별칭을 설정합니다:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Import 규칙

| 유형      | 패턴                                              |
| --------- | ------------------------------------------------- |
| 컴포넌트  | `import { Button } from '@/components/ui/Button'` |
| 유틸리티  | `import { formatDate } from '@/lib/utils'`        |
| 타입      | `import type { Track } from '@/types/spotify'`    |
| 상대 경로 | 같은 디렉터리 내에서만 사용                       |

---

_문서 버전: 1.0_
_최종 수정: 2026-01-26_
_아키텍처: Feature-Sliced Design (FSD)_
