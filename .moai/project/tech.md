# MUKA 기술 스택 문서

## 기술 스택 개요

### 코어 스택

| 카테고리        | 기술         | 버전   | 용도                              |
| --------------- | ------------ | ------ | --------------------------------- |
| **프레임워크**  | Next.js      | 16.1.4 | App Router 기반 풀스택 프레임워크 |
| **언어**        | TypeScript   | 5.x    | 정적 타입 지원                    |
| **런타임**      | React        | 19.2.3 | UI 라이브러리                     |
| **스타일링**    | Tailwind CSS | 4.x    | 유틸리티 기반 CSS                 |
| **패키지 관리** | pnpm         | -      | 빠른 패키지 관리자                |

### 백엔드 서비스

| 서비스      | 용도                    | 특징                      |
| ----------- | ----------------------- | ------------------------- |
| **Neon DB** | PostgreSQL 데이터베이스 | 서버리스, 자동 스케일링   |
| **Vercel**  | 호스팅 및 배포          | Edge Functions, Cron Jobs |

### 외부 API

| API                      | 용도           | 인증 방식               |
| ------------------------ | -------------- | ----------------------- |
| **Spotify Web API**      | 음악 검색      | Client Credentials Flow |
| **Kakao JavaScript SDK** | 카카오톡 공유  | JavaScript SDK Key      |
| **@vercel/og**           | OG 이미지 생성 | Satori 기반             |

### 테스트 도구

| 도구                      | 버전   | 용도             |
| ------------------------- | ------ | ---------------- |
| **Vitest**                | 4.0.17 | 단위/통합 테스트 |
| **React Testing Library** | 16.3.2 | 컴포넌트 테스트  |
| **Playwright**            | 1.57.0 | E2E 테스트       |

### 코드 품질

| 도구                  | 버전   | 용도                    |
| --------------------- | ------ | ----------------------- |
| **ESLint**            | 9.x    | 코드 린팅 (Flat Config) |
| **Prettier**          | 3.8.0  | 코드 포맷팅             |
| **TypeScript-ESLint** | 8.53.1 | TS 린팅 규칙            |
| **Husky**             | 9.1.7  | Git 훅                  |
| **lint-staged**       | 16.2.7 | 스테이징 파일 린트      |

---

## 프레임워크 및 라이브러리 선택 이유

### Next.js 16 (App Router)

**선택 이유**:

- **서버 컴포넌트**: 초기 로딩 성능 최적화
- **App Router**: 직관적인 파일 기반 라우팅
- **API Routes**: 별도 백엔드 없이 API 구현
- **Edge Runtime**: 빠른 응답 시간 (이미지 생성)
- **Vercel 최적화**: 원클릭 배포 및 최적화

**대안 비교**:
| 대안 | 제외 이유 |
|------|----------|
| Remix | Vercel 배포 최적화 부족 |
| Astro | 동적 기능 지원 제한적 |
| SvelteKit | 생태계 규모, 팀 익숙도 |

### TypeScript (Strict Mode)

**선택 이유**:

- **타입 안전성**: 런타임 오류 방지
- **IDE 지원**: 자동완성 및 리팩토링
- **문서화**: 타입이 곧 문서
- **협업**: 코드 의도 명확화

**설정**:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}
```

### Tailwind CSS 4

**선택 이유**:

- **빠른 개발**: 유틸리티 클래스로 빠른 스타일링
- **일관성**: 디자인 시스템 내장
- **번들 크기**: 사용한 클래스만 포함
- **반응형**: 모바일 퍼스트 기본 지원

### React 19

**선택 이유**:

- **React Compiler**: 자동 메모이제이션
- **Actions**: 서버 액션 지원
- **최신 패턴**: Suspense, Transitions 개선

### Neon DB (PostgreSQL)

**선택 이유**:

- **서버리스**: 트래픽에 따른 자동 스케일링
- **비용**: 낮은 트래픽 시 비용 효율적
- **호환성**: 표준 PostgreSQL 호환
- **Vercel 통합**: 원활한 연동

**대안 비교**:
| 대안 | 제외 이유 |
|------|----------|
| Supabase | 추가 기능 불필요, 복잡성 |
| PlanetScale | MySQL, PostgreSQL 선호 |
| Firebase | NoSQL, 관계형 데이터 필요 |

---

## 개발 환경 요구사항

### 필수 소프트웨어

| 소프트웨어 | 최소 버전 | 권장 버전 |
| ---------- | --------- | --------- |
| Node.js    | 20.x      | 22.x LTS  |
| pnpm       | 9.x       | 최신      |
| Git        | 2.x       | 최신      |

### 권장 IDE

| IDE     | 필수 확장                                   |
| ------- | ------------------------------------------- |
| VS Code | ESLint, Prettier, Tailwind CSS IntelliSense |
| Cursor  | 동일                                        |

### 환경 변수

```bash
# .env.local
SPOTIFY_CLIENT_ID=        # Spotify Developer Console에서 발급
SPOTIFY_CLIENT_SECRET=    # Spotify Developer Console에서 발급
NEXT_PUBLIC_KAKAO_APP_KEY= # Kakao Developers에서 발급
DATABASE_URL=             # Neon DB 연결 문자열
CRON_SECRET=              # Vercel Cron 인증용 시크릿
```

### 로컬 개발 시작

```bash
# 1. 저장소 클론
git clone <repository-url>
cd muka

# 2. 의존성 설치
pnpm install

# 3. 환경변수 설정
cp .env.example .env.local
# .env.local 파일에 API 키 입력

# 4. 개발 서버 실행
pnpm dev

# 5. 브라우저에서 확인
# http://localhost:3000
```

---

## 빌드 및 배포 구성

### 스크립트

| 명령어               | 설명                  |
| -------------------- | --------------------- |
| `pnpm dev`           | 개발 서버 (Turbopack) |
| `pnpm build`         | 프로덕션 빌드         |
| `pnpm start`         | 프로덕션 서버         |
| `pnpm lint`          | ESLint 검사           |
| `pnpm lint:fix`      | ESLint 자동 수정      |
| `pnpm format`        | Prettier 포맷팅       |
| `pnpm format:check`  | 포맷팅 검사           |
| `pnpm typecheck`     | TypeScript 타입 검사  |
| `pnpm test`          | Vitest 실행           |
| `pnpm test:ui`       | Vitest UI 모드        |
| `pnpm test:coverage` | 테스트 커버리지       |
| `pnpm test:e2e`      | Playwright E2E        |
| `pnpm test:e2e:ui`   | Playwright UI 모드    |

### 빌드 파이프라인

```
코드 변경
    ↓
Git Commit (Pre-commit Hook)
    ├── lint-staged
    │   ├── ESLint --fix
    │   └── Prettier --write
    ↓
Git Push
    ↓
Vercel Build
    ├── pnpm install
    ├── pnpm build
    │   ├── TypeScript 컴파일
    │   ├── Next.js 빌드
    │   └── 정적 최적화
    ↓
배포 (Preview/Production)
```

### Vercel 배포 설정

| 설정             | 값             |
| ---------------- | -------------- |
| Framework Preset | Next.js        |
| Build Command    | `pnpm build`   |
| Output Directory | `.next`        |
| Install Command  | `pnpm install` |
| Node.js Version  | 20.x           |

### Cron 작업

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 0 * * *"
    }
  ]
}
```

- **실행 주기**: 매일 자정 (UTC)
- **작업 내용**: 7일 지난 만료 링크 삭제
- **인증**: `CRON_SECRET` 헤더 검증

---

## 외부 서비스 통합 정보

### Spotify Web API

**용도**: 음악 검색 및 메타데이터 조회

| 항목       | 값                                  |
| ---------- | ----------------------------------- |
| 인증 방식  | Client Credentials Flow             |
| 엔드포인트 | `https://api.spotify.com/v1/search` |
| 마켓 설정  | `market=KR` (한국)                  |
| 검색 제한  | `limit=10`                          |

**사용 데이터**:

- `id`: 트랙 ID
- `name`: 곡 이름
- `artists[0].name`: 아티스트 이름
- `album.images[0].url`: 앨범 커버 이미지

**주의사항**:

- Spotify 로고 표시 의무 (이용약관)
- Access Token 만료 시간 관리 필요

### Kakao JavaScript SDK

**용도**: 카카오톡 공유

| 항목      | 값                 |
| --------- | ------------------ |
| SDK 버전  | 최신               |
| 공유 타입 | Feed (기본)        |
| 이미지    | 동적 OG 이미지 URL |

**공유 데이터 구조**:

```javascript
{
  objectType: 'feed',
  content: {
    title: '친구가 음악을 추천해줬어요',
    description: '{질문}',
    imageUrl: 'https://muka.app/api/og?...',
    link: { webUrl, mobileWebUrl }
  },
  buttons: [{ title: '카드 확인하기', link: {...} }]
}
```

### Neon DB (PostgreSQL)

**용도**: 링크 데이터 저장

| 항목      | 값                         |
| --------- | -------------------------- |
| 연결 방식 | `@neondatabase/serverless` |
| 연결 풀링 | Neon Proxy 사용            |
| SSL       | 필수                       |

**스키마**:

```sql
CREATE TABLE links (
  id VARCHAR(32) PRIMARY KEY,
  question_id INTEGER NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL
);
CREATE INDEX idx_expires_at ON links(expires_at);
```

### @vercel/og (Satori)

**용도**: 동적 이미지 생성

| 이미지 유형 | 크기        | 용도          |
| ----------- | ----------- | ------------- |
| OG 이미지   | 1200x630px  | 링크 미리보기 |
| 카드 이미지 | 1080x1920px | 저장용 (9:16) |

**CORS 해결**:

- 앨범 커버 이미지: 서버에서 fetch → base64 변환

**캐싱**:

- OG 이미지: `Cache-Control: public, max-age=86400`

---

## 성능 최적화 전략

### 프론트엔드

| 최적화        | 방법                  |
| ------------- | --------------------- |
| 코드 스플리팅 | Next.js 자동 적용     |
| 이미지 최적화 | `next/image` 사용     |
| 폰트 최적화   | `next/font` 사용      |
| 프리페칭      | `next/link` 자동 적용 |

### 백엔드

| 최적화        | 방법                  |
| ------------- | --------------------- |
| 검색 디바운스 | 300ms 지연            |
| Edge Runtime  | 이미지 생성 API       |
| 연결 풀링     | Neon Proxy            |
| 응답 캐싱     | OG 이미지 24시간 캐시 |

### 보안

| 항목      | 구현                                |
| --------- | ----------------------------------- |
| 링크 ID   | 32자+ 랜덤 해시 (crypto.randomUUID) |
| Cron API  | `CRON_SECRET` 헤더 검증             |
| 환경 변수 | 민감 정보 서버 사이드 전용          |

---

## 테스트 전략

### 테스트 피라미드

```
        E2E (Playwright)
           /    \
      통합 테스트 (Vitest)
         /        \
    단위 테스트 (Vitest)
```

### 테스트 구성

| 유형     | 도구       | 대상          | 커버리지 목표 |
| -------- | ---------- | ------------- | ------------- |
| 단위     | Vitest     | 유틸리티, 훅  | 80%           |
| 컴포넌트 | RTL        | UI 컴포넌트   | 70%           |
| E2E      | Playwright | 사용자 플로우 | 핵심 시나리오 |

### TDD 방법론

```
Red (실패 테스트 작성)
    ↓
Green (최소 구현)
    ↓
Refactor (개선)
```

---

## 모니터링 및 로깅

### 계획된 도구 (v2)

| 도구             | 용도        |
| ---------------- | ----------- |
| Vercel Analytics | 페이지 성능 |
| Sentry           | 에러 추적   |
| PostHog          | 사용자 분석 |

### 현재 로깅

- `console.warn`, `console.error` 허용
- `console.log` 린트 경고

---

_문서 버전: 1.0_
_최종 수정: 2026-01-26_
_출처: TRD v1.0, package.json_
