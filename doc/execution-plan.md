# MUKA Execution Plan v1.0

## Overview

PRD를 기반으로 한 MUKA MVP 개발 실행 계획서

- **Target**: MVP 완성
- **Architecture**: FSD (Feature-Sliced Design) + Next.js App Router
- **Methodology**: TDD (Red-Green-Refactor)
- **Team**: Solo Developer (1명)

---

## Prerequisites (External Dependencies)

개발 시작 전 준비가 필요한 외부 의존성:

### API Keys & Services (개발자 직접 셋업)

| Service     | Setup Location                | Required Actions                                 |
| ----------- | ----------------------------- | ------------------------------------------------ |
| Neon DB     | https://neon.tech             | 계정 생성, 프로젝트 생성, Connection string 획득 |
| Spotify API | https://developer.spotify.com | 앱 등록, Client ID/Secret 획득                   |
| Kakao SDK   | https://developers.kakao.com  | 앱 등록, JavaScript Key 획득                     |

### Design Assets (디자이너 제공 필요)

| Asset                  | Spec                         | Status      |
| ---------------------- | ---------------------------- | ----------- |
| Logo (muka)            | SVG, 코랄 #FF6B6B            | Ready       |
| Card Backgrounds (7종) | 1080x1920px, PNG/JPG         | **Pending** |
| Favicon                | 32x32, 180x180 (apple-touch) | **Pending** |

### Asset Requirements Detail

**Card Background 7종 Spec**:

1. **Bright** (밝음/경쾌): 노란색-오렌지 계열
2. **Calm** (차분/평온): 연한 블루-하늘색 계열
3. **Dreamy** (몽환적): 라벤더-연보라 계열
4. **Warm** (따뜻함): 피치-코랄 계열
5. **Retro** (레트로): 머스타드-브라운 계열
6. **Melancholy** (감성적/쓸쓸): 그레이-블루그레이 계열
7. **Romantic** (로맨틱): 핑크-로즈 계열

**File Naming Convention**:

```
public/images/cards/
├── card-bg-1-bright.png
├── card-bg-2-calm.png
├── card-bg-3-dreamy.png
├── card-bg-4-warm.png
├── card-bg-5-retro.png
├── card-bg-6-melancholy.png
└── card-bg-7-romantic.png
```

---

## Phase 0: Setup & Configuration

### Task 0.1: API Service Registration

**Dependencies**: None
**Output**: 외부 서비스 계정 및 API 키 획득

**Checklist**:

- [ ] Neon DB 계정 생성 및 프로젝트 생성
- [ ] Spotify Developer 앱 등록
- [ ] Kakao Developers 앱 등록
- [ ] 환경변수 값 확보

---

### Task 0.2: Asset Collection

**Dependencies**: None (디자이너 작업)
**Output**: 디자인 에셋 수집

**Checklist**:

- [x] Logo SVG (muka)
- [ ] Card Background 7종 (1080x1920px)
- [ ] Favicon set

**Note**: 카드 배경 에셋 없이 개발 진행 시 placeholder 컬러로 대체 후 추후 교체

---

## Phase 1: Foundation (Infrastructure Setup)

### Task 1.1: Database Setup

**Dependencies**: None
**Output**: Neon DB 연결 및 스키마 생성

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

**Technical Decisions**:

- DB Client: `@neondatabase/serverless` (Edge Runtime 호환)
- Connection: Pooled connection string 사용
- ID Generation: `nanoid` (32자, URL-safe)

**Files**:

- `src/shared/db/client.ts` - DB 클라이언트
- `src/shared/db/schema.sql` - 스키마 정의
- `.env.local` - DATABASE_URL

---

### Task 1.2: Environment Variables Setup

**Dependencies**: None
**Output**: 환경변수 설정 및 타입 정의

```typescript
// src/shared/config/env.ts
export const env = {
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID!,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET!,
  NEXT_PUBLIC_KAKAO_APP_KEY: process.env.NEXT_PUBLIC_KAKAO_APP_KEY!,
  DATABASE_URL: process.env.DATABASE_URL!,
  CRON_SECRET: process.env.CRON_SECRET!,
} as const;
```

**Files**:

- `src/shared/config/env.ts` - 환경변수 타입
- `.env.example` - 템플릿
- `.env.local` - 실제 값 (gitignore)

---

### Task 1.3: FSD Directory Structure

**Dependencies**: None
**Output**: FSD 레이어 디렉토리 구조 생성

```
src/
├── app/          # Global providers (empty for now)
├── pages/        # Page components
├── widgets/      # Composite UI blocks
├── features/     # User actions
├── entities/     # Domain models
└── shared/       # Utilities, API, DB
    ├── api/
    ├── ui/
    ├── lib/
    ├── db/
    └── config/
```

---

### Task 1.4: Design System Setup

**Dependencies**: Task 1.3
**Output**: Tailwind CSS 설정 및 디자인 토큰

**Technical Decisions**:

- Tailwind CSS 4 사용 (CSS-first configuration)
- Pretendard 웹폰트 적용
- CSS Variables로 디자인 토큰 정의

```css
/* src/app/globals.css */
@import 'tailwindcss';

:root {
  --color-primary: #ff6b6b;
  --color-bg: #fff9f5;
  --color-text-title: #2d2d2d;
  --color-text-body: #666666;
  --color-text-sub: #999999;
  --color-error: #e85555;
  --color-success: #5bbd72;
}
```

**Files**:

- `src/app/globals.css` - 글로벌 스타일, 디자인 토큰
- `src/shared/ui/index.ts` - UI 컴포넌트 export

---

## Phase 2: Core Entities

### Task 2.1: Question Entity

**Dependencies**: Task 1.3
**Output**: 질문 템플릿 데이터 및 타입

```typescript
// src/entities/question/model/types.ts
export interface Question {
  id: number;
  text: string;
  category:
    | 'relationship-a'
    | 'relationship-b'
    | 'situation-light'
    | 'situation-serious';
}

// src/entities/question/model/data.ts
export const QUESTIONS: readonly Question[] = [
  { id: 1, text: '나한테 어울리는 음악은?', category: 'relationship-a' },
  {
    id: 2,
    text: '내가 힘들 때 들으면 좋을 음악은?',
    category: 'relationship-a',
  },
  { id: 3, text: '나를 생각하면 떠오르는 음악은?', category: 'relationship-b' },
  { id: 4, text: '요즘 네가 꽂힌 음악은?', category: 'situation-light' },
  {
    id: 5,
    text: '아무 생각 없이 들을 수 있는 음악 추천해줘',
    category: 'situation-light',
  },
  { id: 6, text: '인생 노래 하나만 추천해줘', category: 'situation-serious' },
  {
    id: 7,
    text: '비 오는 날 듣기 좋은 음악은?',
    category: 'situation-serious',
  },
] as const;
```

**Files**:

- `src/entities/question/model/types.ts`
- `src/entities/question/model/data.ts`
- `src/entities/question/index.ts`

---

### Task 2.2: Card Entity

**Dependencies**: Task 1.3, Task 0.2 (에셋)
**Output**: 카드 디자인 데이터 및 타입

```typescript
// src/entities/card/model/types.ts
export interface CardDesign {
  id: number;
  mood: string;
  backgroundImage: string; // 이미지 에셋 경로
  textColor: string;
  fallbackBg: string; // 에셋 없을 때 대체 색상
}

// src/entities/card/model/data.ts
export const CARD_DESIGNS: readonly CardDesign[] = [
  {
    id: 1,
    mood: 'bright',
    backgroundImage: '/images/cards/card-bg-1-bright.png',
    textColor: '#E65100',
    fallbackBg: '#FFF3E0',
  },
  {
    id: 2,
    mood: 'calm',
    backgroundImage: '/images/cards/card-bg-2-calm.png',
    textColor: '#1565C0',
    fallbackBg: '#E3F2FD',
  },
  {
    id: 3,
    mood: 'dreamy',
    backgroundImage: '/images/cards/card-bg-3-dreamy.png',
    textColor: '#7B1FA2',
    fallbackBg: '#F3E5F5',
  },
  {
    id: 4,
    mood: 'warm',
    backgroundImage: '/images/cards/card-bg-4-warm.png',
    textColor: '#C62828',
    fallbackBg: '#FFEBEE',
  },
  {
    id: 5,
    mood: 'retro',
    backgroundImage: '/images/cards/card-bg-5-retro.png',
    textColor: '#6D4C41',
    fallbackBg: '#FFF8E1',
  },
  {
    id: 6,
    mood: 'melancholy',
    backgroundImage: '/images/cards/card-bg-6-melancholy.png',
    textColor: '#455A64',
    fallbackBg: '#ECEFF1',
  },
  {
    id: 7,
    mood: 'romantic',
    backgroundImage: '/images/cards/card-bg-7-romantic.png',
    textColor: '#AD1457',
    fallbackBg: '#FCE4EC',
  },
] as const;
```

**Files**:

- `src/entities/card/model/types.ts`
- `src/entities/card/model/data.ts`
- `src/entities/card/index.ts`
- `public/images/cards/` - 카드 배경 이미지 7종

---

### Task 2.3: Track Entity

**Dependencies**: Task 1.3
**Output**: Spotify 트랙 타입 정의

```typescript
// src/entities/track/model/types.ts
export interface Track {
  id: string;
  name: string;
  artist: string;
  albumCover: string;
}

// Spotify API Response mapping
export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    images: Array<{ url: string; width: number; height: number }>;
  };
}

export function mapSpotifyTrack(track: SpotifyTrack): Track {
  return {
    id: track.id,
    name: track.name,
    artist: track.artists[0]?.name ?? 'Unknown',
    albumCover: track.album.images[0]?.url ?? '',
  };
}
```

**Files**:

- `src/entities/track/model/types.ts`
- `src/entities/track/index.ts`

---

### Task 2.4: Link Entity

**Dependencies**: Task 1.1, Task 1.3
**Output**: 링크 타입 및 DB 레포지토리

```typescript
// src/entities/link/model/types.ts
export interface Link {
  id: string;
  questionId: number;
  isUsed: boolean;
  createdAt: Date;
  expiresAt: Date;
}

// src/entities/link/api/repository.ts
export const linkRepository = {
  create: async (questionId: number): Promise<Link> => { ... },
  findById: async (id: string): Promise<Link | null> => { ... },
  markAsUsed: async (id: string): Promise<void> => { ... },
  deleteExpired: async (): Promise<number> => { ... },
};
```

**Files**:

- `src/entities/link/model/types.ts`
- `src/entities/link/api/repository.ts`
- `src/entities/link/index.ts`

---

## Phase 3: Shared Infrastructure

### Task 3.1: Spotify API Client

**Dependencies**: Task 1.2, Task 2.3
**Output**: Spotify 인증 및 검색 API

```typescript
// src/shared/api/spotify/client.ts
class SpotifyClient {
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  async getAccessToken(): Promise<string> {
    // Client Credentials Flow
  }

  async searchTracks(query: string): Promise<Track[]> {
    // GET /v1/search?q={query}&type=track&limit=10&market=KR
  }
}

export const spotifyClient = new SpotifyClient();
```

**Technical Decisions**:

- Client Credentials Flow (사용자 로그인 불필요)
- 토큰 캐싱 (메모리, 1시간 만료)
- Rate limiting 대응: 429 시 exponential backoff

**Files**:

- `src/shared/api/spotify/client.ts`
- `src/shared/api/spotify/types.ts`
- `src/shared/api/spotify/index.ts`

---

### Task 3.2: Kakao SDK Integration

**Dependencies**: Task 1.2
**Output**: Kakao SDK 초기화 및 공유 유틸리티

```typescript
// src/shared/lib/kakao/init.ts
export function initKakao(): void {
  if (typeof window !== 'undefined' && !window.Kakao?.isInitialized()) {
    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY);
  }
}

// src/shared/lib/kakao/share.ts
export interface KakaoShareParams {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
}

export function shareToKakao(params: KakaoShareParams): void {
  Kakao.Link.sendDefault({
    objectType: 'feed',
    content: {
      title: params.title,
      description: params.description,
      imageUrl: params.imageUrl,
      link: { mobileWebUrl: params.linkUrl, webUrl: params.linkUrl },
    },
    buttons: [{ title: '카드 확인하기', link: { ... } }],
  });
}
```

**Files**:

- `src/shared/lib/kakao/init.ts`
- `src/shared/lib/kakao/share.ts`
- `src/shared/lib/kakao/types.d.ts` - Kakao SDK 타입 선언
- `src/shared/lib/kakao/index.ts`

---

### Task 3.3: Shared UI Components

**Dependencies**: Task 1.4
**Output**: 공통 UI 컴포넌트

```typescript
// Components to implement:
// - Button (Primary, Secondary variants)
// - Input (Search input with icon)
// - BottomSheet
// - Card (wrapper component)
```

**Files**:

- `src/shared/ui/button/Button.tsx`
- `src/shared/ui/button/Button.test.tsx`
- `src/shared/ui/input/Input.tsx`
- `src/shared/ui/input/Input.test.tsx`
- `src/shared/ui/bottom-sheet/BottomSheet.tsx`
- `src/shared/ui/bottom-sheet/BottomSheet.test.tsx`
- `src/shared/ui/index.ts`

---

## Phase 4: API Routes

### Task 4.1: Link Creation API

**Dependencies**: Task 2.4
**Output**: POST /api/links

```typescript
// app/api/links/route.ts
export async function POST(request: Request) {
  const { questionId } = await request.json();

  // Validation
  if (!questionId || questionId < 1 || questionId > 7) {
    return Response.json({ error: 'INVALID_QUESTION' }, { status: 400 });
  }

  const link = await linkRepository.create(questionId);

  return Response.json({
    id: link.id,
    questionId: link.questionId,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/q/${link.id}`,
    expiresAt: link.expiresAt.toISOString(),
  });
}
```

**Files**:

- `app/api/links/route.ts`
- `app/api/links/route.test.ts`

---

### Task 4.2: Link Status API

**Dependencies**: Task 2.4
**Output**: GET /api/links/[id], POST /api/links/[id]/use

```typescript
// app/api/links/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const link = await linkRepository.findById(params.id);

  if (!link) {
    return Response.json({ error: 'NOT_FOUND' }, { status: 404 });
  }

  if (link.expiresAt < new Date()) {
    return Response.json({ error: 'EXPIRED' }, { status: 410 });
  }

  if (link.isUsed) {
    return Response.json({ error: 'ALREADY_USED' }, { status: 410 });
  }

  return Response.json({ questionId: link.questionId });
}

// app/api/links/[id]/use/route.ts
export async function POST(...) { ... }
```

**Files**:

- `app/api/links/[id]/route.ts`
- `app/api/links/[id]/use/route.ts`
- `app/api/links/[id]/route.test.ts`

---

### Task 4.3: Music Search API

**Dependencies**: Task 3.1
**Output**: GET /api/music/search

```typescript
// app/api/music/search/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return Response.json({ tracks: [] });
  }

  try {
    const tracks = await spotifyClient.searchTracks(query);
    return Response.json({ tracks });
  } catch (error) {
    return Response.json({ error: 'SEARCH_FAILED' }, { status: 502 });
  }
}
```

**Files**:

- `app/api/music/search/route.ts`
- `app/api/music/search/route.test.ts`

---

### Task 4.4: Image Generation APIs

**Dependencies**: Task 2.1, Task 2.2, Task 2.3
**Output**: GET /api/og, GET /api/card-image

```typescript
// app/api/og/route.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const questionId = searchParams.get('q');

  // Satori로 OG 이미지 생성 (1200x630px)
  return new ImageResponse(
    <OGImageTemplate question={question} />,
    { width: 1200, height: 630 }
  );
}

// app/api/card-image/route.tsx
export async function GET(request: Request) {
  // 카드 이미지 생성 (1080x1920px)
  // 앨범커버 CORS: 서버에서 fetch -> base64
}
```

**Technical Decisions**:

- Edge Runtime 사용 (성능)
- 앨범커버 CORS 해결: 서버사이드 fetch -> base64 인코딩
- Cache-Control: public, max-age=86400

**Files**:

- `app/api/og/route.tsx`
- `app/api/card-image/route.tsx`
- `src/shared/lib/image/fetch-as-base64.ts`

---

### Task 4.5: Cron Cleanup API

**Dependencies**: Task 2.4
**Output**: POST /api/cron/cleanup

```typescript
// app/api/cron/cleanup/route.ts
export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const deletedCount = await linkRepository.deleteExpired();

  return Response.json({ deleted: deletedCount });
}
```

**Files**:

- `app/api/cron/cleanup/route.ts`
- `vercel.json` - Cron 스케줄 설정

---

## Phase 5: Features

### Task 5.1: Create Link Feature

**Dependencies**: Task 2.1, Task 4.1
**Output**: 질문 선택 및 링크 생성 기능

```typescript
// src/features/create-link/
// - ui/QuestionSelector.tsx - 질문 카드 리스트
// - ui/LinkCreator.tsx - 링크 생성 버튼 및 결과
// - model/useCreateLink.ts - 링크 생성 훅
// - api/createLink.ts - API 호출
```

**Files**:

- `src/features/create-link/ui/QuestionSelector.tsx`
- `src/features/create-link/ui/QuestionSelector.test.tsx`
- `src/features/create-link/model/useCreateLink.ts`
- `src/features/create-link/api/createLink.ts`
- `src/features/create-link/index.ts`

---

### Task 5.2: Select Music Feature

**Dependencies**: Task 3.1, Task 4.3
**Output**: 음악 검색 및 선택 기능

```typescript
// src/features/select-music/
// - ui/MusicSearch.tsx - 검색창
// - ui/TrackList.tsx - 검색 결과 리스트
// - ui/TrackItem.tsx - 개별 트랙 아이템
// - model/useSearchMusic.ts - 검색 훅 (debounce 300ms)
```

**Technical Decisions**:

- Debounce: 300ms
- 자동완성: 2글자 이상부터 검색
- 무한스크롤 없음 (10개 고정)

**Files**:

- `src/features/select-music/ui/MusicSearch.tsx`
- `src/features/select-music/ui/TrackList.tsx`
- `src/features/select-music/ui/TrackItem.tsx`
- `src/features/select-music/model/useSearchMusic.ts`
- `src/features/select-music/index.ts`

---

### Task 5.3: Select Card Feature

**Dependencies**: Task 2.2
**Output**: 카드 디자인 선택 기능

```typescript
// src/features/select-card/
// - ui/CardCarousel.tsx - 카드 스와이프/화살표
// - ui/CardPreview.tsx - 카드 미리보기
// - ui/CardIndicator.tsx - 점 인디케이터
// - model/useSelectCard.ts - 카드 선택 상태
```

**Technical Decisions**:

- 스와이프: CSS scroll-snap 사용 (라이브러리 없음)
- 초기 카드: 랜덤 배정

**Files**:

- `src/features/select-card/ui/CardCarousel.tsx`
- `src/features/select-card/ui/CardPreview.tsx`
- `src/features/select-card/ui/CardIndicator.tsx`
- `src/features/select-card/model/useSelectCard.ts`
- `src/features/select-card/index.ts`

---

### Task 5.4: Share Card Feature

**Dependencies**: Task 3.2
**Output**: 카카오톡 공유 및 링크 복사 기능

```typescript
// src/features/share-card/
// - ui/ShareButtons.tsx - 공유 버튼들
// - model/useShareCard.ts - 공유 로직
// - lib/buildCardUrl.ts - 카드 URL 생성
```

**URL Structure**:

```
/card?q={questionId}&t={trackId}&a={artist}&n={trackName}&c={cardId}&img={albumCover}
// Base64 인코딩
```

**Files**:

- `src/features/share-card/ui/ShareButtons.tsx`
- `src/features/share-card/model/useShareCard.ts`
- `src/features/share-card/lib/buildCardUrl.ts`
- `src/features/share-card/index.ts`

---

### Task 5.5: Save Image Feature

**Dependencies**: Task 4.4
**Output**: 카드 이미지 저장 기능

```typescript
// src/features/save-image/
// - ui/SaveImageButton.tsx
// - model/useSaveImage.ts - 이미지 다운로드 로직
```

**Technical Decisions**:

- 서버에서 이미지 생성 후 Blob으로 다운로드
- 파일명: muka-card-{timestamp}.png

**Files**:

- `src/features/save-image/ui/SaveImageButton.tsx`
- `src/features/save-image/model/useSaveImage.ts`
- `src/features/save-image/index.ts`

---

### Task 5.6: Open Streaming Feature

**Dependencies**: None
**Output**: 스트리밍 앱 열기 기능

```typescript
// src/features/open-streaming/
// - ui/StreamingSheet.tsx - 바텀시트
// - ui/StreamingButton.tsx - 개별 플랫폼 버튼
// - lib/streamingUrls.ts - URL 생성기

// Streaming URLs:
// Spotify: https://open.spotify.com/search/{query}
// YouTube Music: https://music.youtube.com/search?q={query}
// Melon: https://www.melon.com/search/total/index.htm?q={query}
```

**Files**:

- `src/features/open-streaming/ui/StreamingSheet.tsx`
- `src/features/open-streaming/ui/StreamingButton.tsx`
- `src/features/open-streaming/lib/streamingUrls.ts`
- `src/features/open-streaming/index.ts`

---

## Phase 6: Pages & Widgets

### Task 6.1: Question Select Widget

**Dependencies**: Task 5.1
**Output**: 질문 선택 위젯 (메인 페이지용)

```typescript
// src/widgets/question-select/
// - ui/QuestionSelectWidget.tsx
```

**Files**:

- `src/widgets/question-select/ui/QuestionSelectWidget.tsx`
- `src/widgets/question-select/index.ts`

---

### Task 6.2: Music Select Widget

**Dependencies**: Task 5.2, Task 5.3
**Output**: 음악 검색 + 카드 선택 위젯

```typescript
// src/widgets/music-select/
// - ui/MusicSelectWidget.tsx - 음악 검색 -> 카드 선택 플로우
```

**Files**:

- `src/widgets/music-select/ui/MusicSelectWidget.tsx`
- `src/widgets/music-select/index.ts`

---

### Task 6.3: Card View Widget

**Dependencies**: Task 5.4, Task 5.5, Task 5.6
**Output**: 카드 확인 위젯

```typescript
// src/widgets/card-view/
// - ui/CardViewWidget.tsx - 카드 + 액션 버튼들
```

**Files**:

- `src/widgets/card-view/ui/CardViewWidget.tsx`
- `src/widgets/card-view/index.ts`

---

### Task 6.4: Header Widget

**Dependencies**: Task 1.4
**Output**: 공통 헤더 컴포넌트

```typescript
// src/widgets/header/
// - ui/Header.tsx - 로고 / 뒤로가기 + 타이틀
```

**Files**:

- `src/widgets/header/ui/Header.tsx`
- `src/widgets/header/index.ts`

---

### Task 6.5: Home Page

**Dependencies**: Task 6.1, Task 6.4
**Output**: 메인 페이지 (질문 선택)

```typescript
// src/pages/home/
// - ui/HomePage.tsx
// - index.ts

// app/page.tsx
export { HomePage as default } from '@/pages/home';
```

**Files**:

- `src/pages/home/ui/HomePage.tsx`
- `src/pages/home/index.ts`
- `app/page.tsx` (수정)

---

### Task 6.6: Question Page

**Dependencies**: Task 6.2, Task 6.4
**Output**: 질문 응답 페이지 (/q/[id])

```typescript
// src/pages/question/
// - ui/QuestionPage.tsx

// app/q/[id]/page.tsx
export { QuestionPage as default } from '@/pages/question';
```

**Files**:

- `src/pages/question/ui/QuestionPage.tsx`
- `src/pages/question/index.ts`
- `app/q/[id]/page.tsx`

---

### Task 6.7: Card Page

**Dependencies**: Task 6.3, Task 6.4
**Output**: 카드 확인 페이지 (/card)

```typescript
// src/pages/card/
// - ui/CardPage.tsx

// app/card/page.tsx
export { CardPage as default } from '@/pages/card';
```

**Files**:

- `src/pages/card/ui/CardPage.tsx`
- `src/pages/card/index.ts`
- `app/card/page.tsx`

---

## Phase 7: E2E Testing & Polish

### Task 7.1: E2E Tests

**Dependencies**: All Phase 6 tasks
**Output**: Playwright E2E 테스트

```typescript
// e2e/
// - create-link.spec.ts - 링크 생성 플로우
// - select-music.spec.ts - 음악 선택 플로우
// - share-card.spec.ts - 카드 공유 플로우
// - view-card.spec.ts - 카드 확인 플로우
```

**Files**:

- `e2e/create-link.spec.ts`
- `e2e/select-music.spec.ts`
- `e2e/share-card.spec.ts`
- `e2e/view-card.spec.ts`

---

### Task 7.2: Error Pages

**Dependencies**: Task 1.4
**Output**: 에러 페이지들

```typescript
// app/not-found.tsx - 404
// app/error.tsx - 500
// src/pages/link-expired/ui/LinkExpiredPage.tsx - 링크 만료/사용됨
```

**Files**:

- `app/not-found.tsx`
- `app/error.tsx`
- `src/pages/link-expired/ui/LinkExpiredPage.tsx`

---

### Task 7.3: SEO & Metadata

**Dependencies**: Task 4.4
**Output**: 메타데이터 및 OG 태그

```typescript
// app/layout.tsx - 기본 메타데이터
// app/q/[id]/page.tsx - 동적 OG 이미지
// app/card/page.tsx - 동적 OG 이미지
```

**Files**:

- `app/layout.tsx` (수정)
- `app/q/[id]/page.tsx` (수정)
- `app/card/page.tsx` (수정)

---

### Task 7.4: Vercel Deployment Config

**Dependencies**: Task 4.5
**Output**: Vercel 배포 설정

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

**Files**:

- `vercel.json`
- Environment variables 설정 (Vercel Dashboard)

---

## Dependency Graph

```
Phase 1 (Foundation)
├── 1.1 Database Setup
├── 1.2 Environment Variables
├── 1.3 FSD Directory Structure
└── 1.4 Design System Setup ── depends on ── 1.3

Phase 2 (Entities)
├── 2.1 Question Entity ── depends on ── 1.3
├── 2.2 Card Entity ── depends on ── 1.3
├── 2.3 Track Entity ── depends on ── 1.3
└── 2.4 Link Entity ── depends on ── 1.1, 1.3

Phase 3 (Shared)
├── 3.1 Spotify API ── depends on ── 1.2, 2.3
├── 3.2 Kakao SDK ── depends on ── 1.2
└── 3.3 Shared UI ── depends on ── 1.4

Phase 4 (APIs)
├── 4.1 Link Creation ── depends on ── 2.4
├── 4.2 Link Status ── depends on ── 2.4
├── 4.3 Music Search ── depends on ── 3.1
├── 4.4 Image Generation ── depends on ── 2.1, 2.2, 2.3
└── 4.5 Cron Cleanup ── depends on ── 2.4

Phase 5 (Features)
├── 5.1 Create Link ── depends on ── 2.1, 4.1
├── 5.2 Select Music ── depends on ── 3.1, 4.3
├── 5.3 Select Card ── depends on ── 2.2
├── 5.4 Share Card ── depends on ── 3.2
├── 5.5 Save Image ── depends on ── 4.4
└── 5.6 Open Streaming ── depends on ── none

Phase 6 (Pages)
├── 6.1 Question Select Widget ── depends on ── 5.1
├── 6.2 Music Select Widget ── depends on ── 5.2, 5.3
├── 6.3 Card View Widget ── depends on ── 5.4, 5.5, 5.6
├── 6.4 Header Widget ── depends on ── 1.4
├── 6.5 Home Page ── depends on ── 6.1, 6.4
├── 6.6 Question Page ── depends on ── 6.2, 6.4
└── 6.7 Card Page ── depends on ── 6.3, 6.4

Phase 7 (Polish)
├── 7.1 E2E Tests ── depends on ── all Phase 6
├── 7.2 Error Pages ── depends on ── 1.4
├── 7.3 SEO & Metadata ── depends on ── 4.4
└── 7.4 Vercel Config ── depends on ── 4.5
```

---

## Critical Path

최소 실행 경로 (MVP 핵심):

```
1.1 → 1.3 → 2.4 → 4.1 → 5.1 → 6.1 → 6.5 (Home)
                   ↓
1.2 → 2.3 → 3.1 → 4.3 → 5.2 → 6.2 → 6.6 (Question)
                              ↓
              2.2 → 5.3 ──────┘
                   ↓
1.4 → 3.3 → 5.4 → 6.3 → 6.7 (Card)
         ↓
      3.2 ──┘
```

---

## Risk Assessment

| Risk                   | Impact | Mitigation                |
| ---------------------- | ------ | ------------------------- |
| Spotify API Rate Limit | High   | Exponential backoff, 캐싱 |
| 앨범커버 CORS          | Medium | 서버사이드 fetch + base64 |
| Kakao SDK 초기화 실패  | Medium | 링크 복사 fallback        |
| Neon DB Cold Start     | Low    | Connection pooling        |
| 이미지 생성 메모리     | Medium | Edge Runtime 사용         |

---

## File Count Summary

- **Entities**: 12 files
- **Shared**: 18 files
- **Features**: 24 files
- **Widgets**: 8 files
- **Pages**: 6 files
- **API Routes**: 10 files
- **E2E Tests**: 4 files
- **Config**: 4 files

**Total**: ~86 files

---

## Schedule Estimation (Solo Developer)

### Assumptions

- 하루 평균 4-6시간 집중 개발 가능
- TDD 방식 (테스트 작성 시간 포함)
- Claude Code 활용으로 생산성 향상 반영

### Phase별 예상 소요 시간

| Phase     | Tasks                 | Estimated Hours | Calendar Days |
| --------- | --------------------- | --------------- | ------------- |
| Phase 0   | Setup & Config        | 2h              | 0.5일         |
| Phase 1   | Foundation            | 4h              | 1일           |
| Phase 2   | Entities              | 3h              | 0.5일         |
| Phase 3   | Shared Infrastructure | 6h              | 1일           |
| Phase 4   | API Routes            | 8h              | 1.5일         |
| Phase 5   | Features              | 12h             | 2일           |
| Phase 6   | Pages & Widgets       | 8h              | 1.5일         |
| Phase 7   | E2E & Polish          | 6h              | 1일           |
| **Total** | -                     | **49h**         | **9일**       |

### Detailed Breakdown

**Phase 0 (2h)**:

- 0.1 API Service Registration: 1h
- 0.2 Asset Collection: 1h (디자이너 대기 제외)

**Phase 1 (4h)**:

- 1.1 Database Setup: 1h
- 1.2 Environment Variables: 0.5h
- 1.3 FSD Directory Structure: 0.5h
- 1.4 Design System Setup: 2h

**Phase 2 (3h)**:

- 2.1 Question Entity: 0.5h
- 2.2 Card Entity: 0.5h
- 2.3 Track Entity: 0.5h
- 2.4 Link Entity: 1.5h (DB 연동 포함)

**Phase 3 (6h)**:

- 3.1 Spotify API Client: 3h (인증 + 검색 + 테스트)
- 3.2 Kakao SDK Integration: 1.5h
- 3.3 Shared UI Components: 1.5h

**Phase 4 (8h)**:

- 4.1 Link Creation API: 1h
- 4.2 Link Status API: 1.5h
- 4.3 Music Search API: 1.5h
- 4.4 Image Generation APIs: 3h (Satori 설정 + CORS 처리)
- 4.5 Cron Cleanup API: 1h

**Phase 5 (12h)**:

- 5.1 Create Link Feature: 2h
- 5.2 Select Music Feature: 3h (debounce + UI)
- 5.3 Select Card Feature: 2.5h (carousel + swipe)
- 5.4 Share Card Feature: 2h
- 5.5 Save Image Feature: 1.5h
- 5.6 Open Streaming Feature: 1h

**Phase 6 (8h)**:

- 6.1-6.3 Widgets: 3h
- 6.4 Header Widget: 0.5h
- 6.5-6.7 Pages: 4.5h (라우팅 + 상태관리 연결)

**Phase 7 (6h)**:

- 7.1 E2E Tests: 3h
- 7.2 Error Pages: 1h
- 7.3 SEO & Metadata: 1h
- 7.4 Vercel Deployment: 1h

### Milestones

| Milestone         | Target | Deliverable                 |
| ----------------- | ------ | --------------------------- |
| M1: Backend Ready | Day 3  | Phase 0-2, API 동작 확인    |
| M2: Core Features | Day 6  | Phase 3-5, 전체 플로우 동작 |
| M3: MVP Complete  | Day 9  | Phase 6-7, 배포 완료        |

### Risk Buffer

- 예상치 못한 이슈 대응: +2일
- 디자인 에셋 대기: +1-3일 (병렬 작업으로 최소화)
- **Total with Buffer**: 12일

---

## Execution Order (Recommended)

병렬 작업이 불가능한 Solo 개발 환경에서의 최적 실행 순서:

```
Day 1:
├── 0.1 API Service Registration (병렬: 디자이너에게 에셋 요청)
├── 1.1 Database Setup
├── 1.2 Environment Variables
└── 1.3 FSD Directory Structure

Day 2:
├── 1.4 Design System Setup
├── 2.1 Question Entity
├── 2.2 Card Entity (placeholder 사용)
├── 2.3 Track Entity
└── 2.4 Link Entity

Day 3:
├── 3.1 Spotify API Client
├── 4.1 Link Creation API
└── 4.2 Link Status API

Day 4:
├── 4.3 Music Search API
├── 3.2 Kakao SDK Integration
└── 3.3 Shared UI Components

Day 5:
├── 4.4 Image Generation APIs
├── 4.5 Cron Cleanup API
└── 5.1 Create Link Feature

Day 6:
├── 5.2 Select Music Feature
├── 5.3 Select Card Feature
└── 5.6 Open Streaming Feature

Day 7:
├── 5.4 Share Card Feature
├── 5.5 Save Image Feature
├── 6.1 Question Select Widget
└── 6.4 Header Widget

Day 8:
├── 6.2 Music Select Widget
├── 6.3 Card View Widget
├── 6.5 Home Page
├── 6.6 Question Page
└── 6.7 Card Page

Day 9:
├── 7.1 E2E Tests
├── 7.2 Error Pages
├── 7.3 SEO & Metadata
├── 7.4 Vercel Deployment
└── 최종 QA

Day 10-12 (Buffer):
├── 버그 수정
├── 에셋 교체 (디자이너 제공 시)
└── 성능 최적화
```
