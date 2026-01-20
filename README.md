# MUKA (뮤카)

친구가 골라주는 음악 추천 서비스

## 컨셉

알고리즘이 아닌 **친구가 직접 고른 음악**을 주고받는 서비스입니다.
A가 친구 B에게 음악 추천을 요청하면, B가 음악을 선택해 카드로 응답합니다.

## 사용자 플로우

### A (발신자)

1. 질문 템플릿 선택 (7개 중 1개)
2. 일회성 링크 생성
3. 카카오톡으로 B에게 전송
4. B의 응답 카드 확인
5. 스트리밍 앱으로 이동 또는 이미지 저장

### B (수신자)

1. 링크 클릭
2. 음악 검색 및 선택
3. 카드 디자인 확인/변경
4. 카카오톡으로 A에게 전송

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS 4
- **Database**: Neon DB (PostgreSQL)
- **Music API**: Spotify Web API
- **Image**: Satori (@vercel/og)
- **Share**: Kakao JavaScript SDK
- **Deploy**: Vercel
- **Test**: Vitest, React Testing Library, Playwright

## 시작하기

```bash
# 의존성 설치
pnpm install

# 환경변수 설정
cp .env.example .env.local
# .env.local 파일에 API 키 입력

# 개발 서버 실행
pnpm dev
```

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 실행 (Turbopack) |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 프로덕션 서버 실행 |
| `pnpm lint` | ESLint 검사 |
| `pnpm format` | Prettier 포맷팅 |
| `pnpm test` | 단위 테스트 (Vitest) |
| `pnpm test:e2e` | E2E 테스트 (Playwright) |
| `pnpm typecheck` | TypeScript 타입 검사 |

## 환경변수

```bash
SPOTIFY_CLIENT_ID=        # Spotify API 클라이언트 ID
SPOTIFY_CLIENT_SECRET=    # Spotify API 시크릿
NEXT_PUBLIC_KAKAO_APP_KEY= # 카카오 JavaScript SDK 앱 키
DATABASE_URL=             # Neon DB 연결 URL
CRON_SECRET=              # Vercel Cron 시크릿
```

## 프로젝트 구조

```
src/
├── app/                  # Next.js App Router
│   ├── api/              # API Routes
│   ├── q/[id]/           # 질문 페이지
│   └── card/             # 카드 페이지
├── components/           # React 컴포넌트
├── lib/                  # 유틸리티 함수
└── types/                # TypeScript 타입 정의

e2e/                      # Playwright E2E 테스트
doc/                      # 문서 (PRD, TRD)
```

## 라이선스

Private
