# MUKA TRD v1.0

## 기술 스택
- Framework: Next.js
- Deploy: Vercel
- DB: Neon DB (PostgreSQL, 서버리스)
- Image: Satori (@vercel/og)
- Music API: Spotify Web API
- Share: Kakao JavaScript SDK
- Cron: Vercel Cron
- Test: Vitest, React Testing Library, Playwright
- Lint/Format: ESLint 9+, Prettier

## 아키텍처
```
Vercel (Next.js + API Routes + Cron)
    ↓
Spotify API / Kakao SDK / Neon DB
```

## DB 스키마

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

## 데이터 저장 전략
- DB: 링크 ID, 질문 ID, 사용여부, 만료시간
- 쿼리스트링: 음악정보, 카드 디자인 ID (영구저장 불필요)

## URL 구조
- 질문 링크: `/q/{linkId}`
- 카드 링크: `/card?q={questionId}&t={trackId}&a={artist}&n={trackName}&c={cardId}&img={albumCover}` (Base64 인코딩)

## API 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| POST | /api/links | 링크 생성 |
| GET | /api/links/[id] | 링크 상태 확인 |
| POST | /api/links/[id]/use | 링크 사용 처리 |
| GET | /api/og | OG 이미지 생성 |
| GET | /api/card-image | 카드 이미지 생성 |
| POST | /api/cron/cleanup | 만료 링크 정리 |

## 링크 생성 API
```json
// POST /api/links
Request: { "questionId": 1 }
Response: { "id": "abc123...", "questionId": 1, "url": "https://muka.app/q/abc123...", "expiresAt": "2025-01-27T00:00:00Z" }
```

## 에러 응답
| 상황 | HTTP | 코드 | 메시지 |
|------|------|------|--------|
| 이미 사용됨 | 410 | ALREADY_USED | 이미 응답이 완료된 링크예요 |
| 만료됨 | 410 | EXPIRED | 링크가 만료되었어요 |
| 없음 | 404 | NOT_FOUND | 링크를 찾을 수 없어요 |
| 검색실패 | 502 | SEARCH_FAILED | 검색 중 문제가 발생했어요 |
| 서버오류 | 500 | INTERNAL_ERROR | 문제가 발생했어요. 다시 시도해주세요 |

## Spotify API
- 인증: Client Credentials Flow (사용자 로그인 불필요)
- 엔드포인트: `GET /v1/search?q={query}&type=track&limit=10&market=KR`
- 사용필드: id, name, artists[0].name, album.images[0].url

## Kakao 공유
```javascript
Kakao.Link.sendDefault({
  objectType: 'feed',
  content: {
    title: '친구가 음악을 추천해줬어요 🎵',
    description: '{질문}',
    imageUrl: 'https://muka.app/api/og?...',
    link: { mobileWebUrl: '...', webUrl: '...' }
  },
  buttons: [{ title: '카드 확인하기', link: {...} }]
});
```

## 이미지 생성 (Satori)
- OG: 1200x630px
- 카드: 1080x1920px (9:16)
- 앨범커버 CORS 해결: 서버에서 fetch → base64 변환

## 스트리밍 링크
```
Spotify: https://open.spotify.com/search/{query}
YouTube Music: https://music.youtube.com/search?q={query}
멜론: https://www.melon.com/search/total/index.htm?q={query}
```

## Cron 설정
```json
// vercel.json
{ "crons": [{ "path": "/api/cron/cleanup", "schedule": "0 0 * * *" }] }
```
```sql
DELETE FROM links WHERE expires_at < NOW();
```

## 환경변수
```
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
NEXT_PUBLIC_KAKAO_APP_KEY=
DATABASE_URL=
CRON_SECRET=
```

## 코드 품질 도구

### ESLint (v9+ Flat Config)
```javascript
// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    rules: {
      "no-unused-vars": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];

export default eslintConfig;
```

### Prettier
```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

### 패키지
```bash
npm install -D eslint-config-prettier prettier @eslint/eslintrc
```

## 테스트

### 스택
- Vitest: 단위/통합 테스트
- React Testing Library: 컴포넌트 테스트
- Playwright: E2E 테스트

### 패키지
```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
npm install -D @playwright/test
```

### Vitest 설정
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
  },
});
```

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom';
```

### Playwright 설정
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 테스트 스크립트
```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test"
  }
}
```

### TDD 방법론
개발 시 Red-Green-Refactor 사이클 준수:
1. Red: 실패하는 테스트 먼저 작성
2. Green: 테스트 통과하는 최소한의 코드 작성
3. Refactor: 코드 개선 (테스트 통과 유지)

### 테스트 구조
```
/src
  /components
    Button.tsx
    Button.test.tsx
  /lib
    links.ts
    links.test.ts
/e2e
  create-link.spec.ts
  select-music.spec.ts
  share-card.spec.ts
```

## 보안
- 링크 ID: 32자+ 랜덤 해시 (crypto.randomUUID 또는 nanoid)
- Cron API: CRON_SECRET 헤더 검증

## 성능
- Spotify 검색: debounce 300ms
- 이미지 생성: Edge Runtime
- OG 캐시: Cache-Control: public, max-age=86400
