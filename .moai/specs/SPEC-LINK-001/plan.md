# SPEC-LINK-001: Implementation Plan

---

spec_id: SPEC-LINK-001
title: Link Generation and Question Selection Page
phase: plan

---

## Implementation Overview

This plan outlines the implementation approach for MUKA's Link Generation and Question Selection feature, following the DDD (Domain-Driven Development) methodology with ANALYZE-PRESERVE-IMPROVE cycles.

---

## Milestones

### Milestone 1: Database Foundation (Priority: High)

**Objective:** Establish the database schema and seed data for questions and links.

**Tasks:**

1. Set up Neon PostgreSQL connection configuration
2. Create `questions` table with schema
3. Create `links` table with schema and indexes
4. Seed 7 question templates into database
5. Verify database connectivity and queries

**Dependencies:**

- Neon PostgreSQL database provisioned
- `DATABASE_URL` environment variable configured

**Deliverables:**

- Database migration scripts
- Seed data script
- Database utility module

---

### Milestone 2: API Endpoints (Priority: High)

**Objective:** Implement REST API endpoints for questions and links.

**Tasks:**

1. Create `/api/questions` GET endpoint
   - Fetch all questions from database
   - Return structured JSON response

2. Create `/api/links` POST endpoint
   - Validate question ID (1-7)
   - Generate 10-character hash using nanoid
   - Calculate expiration date (7 days)
   - Insert link record into database
   - Return link details with URL

3. Create `/api/links/[id]` GET endpoint
   - Fetch link by ID
   - Check expiration status
   - Check usage status
   - Return appropriate response or error

**Dependencies:**

- Milestone 1 (Database Foundation)
- nanoid package installed

**Deliverables:**

- Three API route handlers
- Request/response type definitions
- Error handling utilities

---

### Milestone 3: Question Selection UI (Priority: High)

**Objective:** Build the question selection page with responsive design.

**Tasks:**

1. Create QuestionCard component
   - Display question text
   - Hover/active states with coral border
   - Click handler for selection

2. Create question selection page layout
   - MUKA logo header
   - Instruction text
   - Question card list (7 cards)
   - Mobile-first responsive design

3. Implement question data fetching
   - Server-side data fetching (RSC)
   - Loading state handling
   - Error state handling

**Dependencies:**

- Milestone 2 (API Endpoints)
- Design system tokens configured

**Deliverables:**

- QuestionCard component
- Question selection page
- Loading and error states

---

### Milestone 4: Link Generation Flow (Priority: High)

**Objective:** Implement the link generation and state management.

**Tasks:**

1. Create link generation service
   - Call POST /api/links
   - Handle success/error responses
   - Return generated link data

2. Build share options view
   - Display generated link
   - Kakao share button
   - Copy link button
   - Back/cancel navigation

3. Implement loading states
   - Link generation loading indicator
   - Disable buttons during generation

**Dependencies:**

- Milestone 3 (Question Selection UI)

**Deliverables:**

- Link generation service
- Share options component
- State management for generation flow

---

### Milestone 5: Share Functionality (Priority: High)

**Objective:** Implement Kakao Talk sharing and clipboard copy.

**Tasks:**

1. Set up Kakao JavaScript SDK
   - Load SDK in layout
   - Initialize with app key
   - Handle SDK load failure

2. Implement Kakao share function
   - Configure feed template
   - Include question text
   - Include link URL
   - Handle share completion/error

3. Implement clipboard copy
   - Use Clipboard API
   - Show success toast
   - Handle copy failure (fallback)

4. Create Toast component
   - Success/error variants
   - Auto-dismiss after 2 seconds
   - Accessible announcements

**Dependencies:**

- Milestone 4 (Link Generation Flow)
- `NEXT_PUBLIC_KAKAO_APP_KEY` configured

**Deliverables:**

- Kakao SDK integration
- Share utility functions
- Toast notification component

---

### Milestone 6: Testing and Polish (Priority: Medium)

**Objective:** Ensure quality through testing and UX refinements.

**Tasks:**

1. Write unit tests
   - API endpoint tests
   - Utility function tests
   - Component tests

2. Write E2E tests
   - Question selection flow
   - Link generation flow
   - Copy link functionality

3. UX polish
   - Animation refinements
   - Error message improvements
   - Accessibility audit

**Dependencies:**

- All previous milestones

**Deliverables:**

- Test suite with coverage
- Accessibility compliance
- Polished user experience

---

## Technical Approach

### Architecture Design

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                      │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐              │
│  │ Question Select │──│  Share Options  │              │
│  │     Page        │  │    Component    │              │
│  └────────┬────────┘  └────────┬────────┘              │
│           │                    │                        │
│  ┌────────▼────────────────────▼────────┐              │
│  │           Kakao SDK / Clipboard       │              │
│  └───────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  Next.js API Routes                      │
├─────────────────────────────────────────────────────────┤
│  GET /api/questions    POST /api/links                  │
│  GET /api/links/[id]                                    │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Neon PostgreSQL                        │
├─────────────────────────────────────────────────────────┤
│  questions table       links table                      │
└─────────────────────────────────────────────────────────┘
```

### File Structure

```
src/
├── app/
│   ├── page.tsx                 # Question selection page
│   ├── layout.tsx               # Root layout with Kakao SDK
│   └── api/
│       ├── questions/
│       │   └── route.ts         # GET /api/questions
│       └── links/
│           ├── route.ts         # POST /api/links
│           └── [id]/
│               └── route.ts     # GET /api/links/[id]
├── components/
│   ├── question-card.tsx        # Question card component
│   ├── share-button.tsx         # Share button variants
│   └── toast.tsx                # Toast notification
├── lib/
│   ├── db.ts                    # Database connection
│   ├── kakao.ts                 # Kakao SDK utilities
│   └── utils.ts                 # General utilities
└── types/
    └── index.ts                 # TypeScript type definitions
```

### Key Implementation Decisions

1. **Server Components for Data Fetching**
   - Questions loaded server-side for faster initial render
   - No client-side loading state for questions

2. **nanoid for Link Hash**
   - 10 characters provide sufficient uniqueness (64^10 combinations)
   - URL-safe characters by default
   - Lightweight package

3. **Kakao SDK Loading Strategy**
   - Load in root layout for availability across pages
   - Graceful degradation if SDK fails to load

4. **Database Connection Pooling**
   - Use Neon's serverless driver with built-in pooling
   - Connection reuse across API requests

---

## Risk Mitigation

| Risk                            | Mitigation Strategy                                       |
| ------------------------------- | --------------------------------------------------------- |
| Kakao SDK unavailable           | Fallback to copy-only sharing with helpful message        |
| Database connection failure     | Retry logic with exponential backoff, user-friendly error |
| Slow API responses              | Loading indicators, optimistic UI where appropriate       |
| Mobile browser clipboard issues | Feature detection, manual copy instructions fallback      |

---

## Definition of Done

- [ ] All 7 questions display correctly on selection page
- [ ] Link generation creates valid database record
- [ ] Kakao share opens with correct content
- [ ] Copy button works and shows toast
- [ ] All API endpoints return correct responses
- [ ] Error states are handled gracefully
- [ ] Responsive design works on mobile (375px) and desktop
- [ ] Unit tests pass with >80% coverage
- [ ] E2E tests pass for core flows
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Accessibility audit passes (WCAG AA)

---

## Next Steps After Completion

Upon successful completion of SPEC-LINK-001, the following SPECs should be implemented:

1. **SPEC-MUSIC-001**: Music Search and Selection (Receiver B receives link, searches music)
2. **SPEC-CARD-001**: Card Design and Preview (Receiver B selects card design)
3. **SPEC-SHARE-002**: Card Sharing (Receiver B shares card back to Sender A)
4. **SPEC-VIEW-001**: Card Viewing (Sender A views the received card)

---

_Plan created following MoAI SPEC-First DDD methodology_
