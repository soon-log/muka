# SPEC-LINK-001: Link Generation and Question Selection Page

---

spec_id: SPEC-LINK-001
title: Link Generation and Question Selection Page
created: 2026-01-26
status: Planned
priority: High
lifecycle: spec-anchored
assigned: manager-ddd
related_specs: []
epic: MVP Core Features

---

## Overview

### Purpose

This specification defines MUKA's core MVP feature: the Link Generation and Question Selection Page. This feature enables Sender A to select a question template and generate a unique one-time shareable link to request music recommendations from friends.

### Objectives

1. Provide an intuitive question selection interface with 7 predefined templates
2. Generate unique, one-time hash-based links with 7-day expiration
3. Enable easy sharing via Kakao Talk and clipboard copy
4. Establish the database foundation for the link-based recommendation workflow

### Business Value

- **Core Value Proposition**: Enables the fundamental MUKA experience of requesting personalized music recommendations from friends
- **User Acquisition**: First touchpoint for Sender A, critical for user engagement
- **Virality**: Share functionality drives organic growth through Kakao Talk sharing

---

## User Stories

### US-001: Question Selection

**As a** Sender A
**I want to** see and select from predefined question templates
**So that** I can ask my friend a specific music-related question

**Acceptance Criteria:**

- Given I open the question selection page, when the page loads, then I see 7 question cards
- Given I see the question cards, when I read them, then each card shows the question text and a brief description
- Given I want to select a question, when I tap on a question card, then the system proceeds to link generation

### US-002: Link Generation

**As a** Sender A
**I want to** generate a unique link for my selected question
**So that** I can share it with my friend to request a music recommendation

**Acceptance Criteria:**

- Given I selected a question, when the system generates a link, then the link contains a unique 10-character hash
- Given a link is generated, when I check the database, then the link record includes question_id, is_used=false, and expires_at set to 7 days from now
- Given a link is generated, when I view the share options, then I see Kakao Talk share and copy link buttons

### US-003: Link Sharing

**As a** Sender A
**I want to** share the generated link via Kakao Talk or copy it to clipboard
**So that** I can send it to my friend

**Acceptance Criteria:**

- Given a link is generated, when I tap Kakao Talk share, then the Kakao sharing dialog opens with the link
- Given a link is generated, when I tap copy button, then the link is copied and a success toast appears
- Given I share via Kakao Talk, when my friend receives it, then they see a preview with the question text

---

## Requirements (EARS Format)

### Functional Requirements

#### FR-001: Question Template Display (Ubiquitous)

The system shall display exactly 7 question templates on the question selection page:

1. "나한테 어울리는 음악은?" (관계/A중심)
2. "내가 힘들 때 들으면 좋을 음악은?" (관계/A중심)
3. "나를 생각하면 떠오르는 음악은?" (관계/B중심)
4. "요즘 네가 꽂힌 음악은?" (상황/가벼움)
5. "아무 생각 없이 들을 수 있는 음악 추천해줘" (상황/가벼움)
6. "인생 노래 하나만 추천해줘" (상황/진지함)
7. "비 오는 날 듣기 좋은 음악은?" (상황/진지함)

#### FR-002: Question Card Interaction (Event-Driven)

**WHEN** a user taps on a question card
**THEN** the system shall initiate the link generation process for that question

#### FR-003: Unique Link Generation (Event-Driven)

**WHEN** a question is selected
**THEN** the system shall generate a unique 10-character hash using nanoid and create a database record with:

- `id`: The generated hash (primary key)
- `question_id`: The selected question's ID (1-7)
- `is_used`: false (default)
- `created_at`: Current timestamp
- `expires_at`: Current timestamp + 7 days

#### FR-004: Share Options Display (Event-Driven)

**WHEN** a link is successfully generated
**THEN** the system shall display share options including:

- Kakao Talk share button (primary action)
- Copy link button (secondary action)

#### FR-005: Kakao Talk Sharing (Event-Driven)

**WHEN** the user taps the Kakao Talk share button
**THEN** the system shall invoke the Kakao JavaScript SDK with:

- `objectType`: 'feed'
- `content.title`: Appropriate share title
- `content.description`: The selected question text
- `content.imageUrl`: Dynamic OG image URL
- `link.webUrl` and `link.mobileWebUrl`: The generated link URL

#### FR-006: Clipboard Copy (Event-Driven)

**WHEN** the user taps the copy button
**THEN** the system shall copy the link URL to the clipboard and display a success toast notification

#### FR-007: Link Expiration (State-Driven)

**IF** a link's `expires_at` timestamp has passed
**THEN** the system shall treat the link as invalid and return an appropriate error when accessed

#### FR-008: Questions Data Source (Ubiquitous)

The system shall store question templates in a `questions` database table with the following structure:

- `id`: Sequential integer (1-7)
- `text`: Korean question text
- `category`: Question category (relationship or situation)
- `subcategory`: Subcategory (a_focused, b_focused, light, serious)

### Non-Functional Requirements

#### NFR-001: Performance

- The question selection page shall load within 1 second on 4G networks
- Link generation shall complete within 500ms
- Share dialog shall appear within 200ms of button tap

#### NFR-002: Accessibility

- Question cards shall have sufficient color contrast (WCAG AA)
- Interactive elements shall have minimum tap target of 44x44px
- Screen readers shall be able to navigate question cards

#### NFR-003: Responsive Design

- The page shall be mobile-first with 375px base width
- On desktop, the layout shall be centered with max-width 430px
- All UI elements shall scale appropriately across device sizes

---

## Acceptance Criteria (Given/When/Then)

### AC-001: Page Load

```gherkin
Feature: Question Selection Page Load

Scenario: User opens question selection page
  Given I am a new visitor to MUKA
  When I navigate to the home page
  Then I should see the MUKA logo in the header
  And I should see instruction text explaining the service
  And I should see 7 question cards displayed in a list

Scenario: Question cards display correct content
  Given I am on the question selection page
  When I view the question cards
  Then each card should display the question text
  And each card should be tappable/clickable
  And the first question should be "나한테 어울리는 음악은?"
```

### AC-002: Question Selection

```gherkin
Feature: Question Selection

Scenario: User selects a question
  Given I am on the question selection page
  And I see 7 question cards
  When I tap on the question "요즘 네가 꽂힌 음악은?"
  Then the system should generate a unique link
  And I should see the share options screen

Scenario: Link is correctly stored in database
  Given I selected a question with ID 4
  When the link is generated
  Then a new record should exist in the links table
  And the record should have a 10-character hash ID
  And the record should have question_id = 4
  And the record should have is_used = false
  And the record should have expires_at = current_time + 7 days
```

### AC-003: Share Functionality

```gherkin
Feature: Link Sharing

Scenario: User shares via Kakao Talk
  Given I have generated a link for a question
  And I see the share options screen
  When I tap the Kakao Talk share button
  Then the Kakao share dialog should open
  And the share content should include the question text
  And the share content should include the generated link URL

Scenario: User copies link to clipboard
  Given I have generated a link for a question
  And I see the share options screen
  When I tap the copy link button
  Then the link URL should be copied to my clipboard
  And I should see a "링크가 복사되었습니다" toast message
  And the toast should disappear after 2 seconds

Scenario: Copy button shows visual feedback
  Given I have generated a link
  When I tap the copy link button
  Then the button should show a brief "copied" state
  And the button should return to normal state after 1 second
```

### AC-004: Error Handling

```gherkin
Feature: Error Handling

Scenario: Link generation fails due to network error
  Given I selected a question
  And the network connection is unstable
  When the link generation request fails
  Then I should see an error message
  And I should have an option to retry

Scenario: Kakao SDK not loaded
  Given I generated a link
  And the Kakao SDK failed to load
  When I tap the Kakao share button
  Then I should see a message suggesting to copy the link instead
  And the copy button should remain functional
```

---

## Technical Approach

### Database Schema

#### Questions Table

```sql
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  text VARCHAR(100) NOT NULL,
  category VARCHAR(20) NOT NULL,
  subcategory VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed data
INSERT INTO questions (id, text, category, subcategory) VALUES
(1, '나한테 어울리는 음악은?', 'relationship', 'a_focused'),
(2, '내가 힘들 때 들으면 좋을 음악은?', 'relationship', 'a_focused'),
(3, '나를 생각하면 떠오르는 음악은?', 'relationship', 'b_focused'),
(4, '요즘 네가 꽂힌 음악은?', 'situation', 'light'),
(5, '아무 생각 없이 들을 수 있는 음악 추천해줘', 'situation', 'light'),
(6, '인생 노래 하나만 추천해줘', 'situation', 'serious'),
(7, '비 오는 날 듣기 좋은 음악은?', 'situation', 'serious');
```

#### Links Table

```sql
CREATE TABLE links (
  id VARCHAR(10) PRIMARY KEY,
  question_id INTEGER NOT NULL REFERENCES questions(id),
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_links_expires_at ON links(expires_at);
CREATE INDEX idx_links_is_used ON links(is_used);
```

### API Design

#### GET /api/questions

Retrieves all question templates.

**Request:**

```
GET /api/questions
```

**Response (200 OK):**

```json
{
  "questions": [
    {
      "id": 1,
      "text": "나한테 어울리는 음악은?",
      "category": "relationship",
      "subcategory": "a_focused"
    }
    // ... 6 more questions
  ]
}
```

#### POST /api/links

Creates a new link for a selected question.

**Request:**

```json
{
  "questionId": 4
}
```

**Response (201 Created):**

```json
{
  "id": "a1b2c3d4e5",
  "url": "https://muka.app/r/a1b2c3d4e5",
  "questionId": 4,
  "questionText": "요즘 네가 꽂힌 음악은?",
  "expiresAt": "2026-02-02T12:00:00Z"
}
```

**Error Response (400 Bad Request):**

```json
{
  "error": "Invalid question ID",
  "code": "INVALID_QUESTION_ID"
}
```

#### GET /api/links/[id]

Retrieves link details (for validation and rendering).

**Request:**

```
GET /api/links/a1b2c3d4e5
```

**Response (200 OK):**

```json
{
  "id": "a1b2c3d4e5",
  "questionId": 4,
  "questionText": "요즘 네가 꽂힌 음악은?",
  "isUsed": false,
  "isExpired": false
}
```

**Error Response (404 Not Found):**

```json
{
  "error": "Link not found",
  "code": "LINK_NOT_FOUND"
}
```

**Error Response (410 Gone):**

```json
{
  "error": "Link has expired",
  "code": "LINK_EXPIRED"
}
```

### UI Components

#### QuestionCard

```typescript
interface QuestionCardProps {
  id: number;
  text: string;
  category: 'relationship' | 'situation';
  subcategory: string;
  onSelect: (id: number) => void;
}
```

**Styling (from Design Guide):**

- Background: White with subtle shadow
- Border radius: 12px
- Padding: 16px
- Text: Body Large (18px, Regular), color #2D2D2D
- Hover/Active state: Border color #FF6B6B (coral)

#### ShareButton

```typescript
interface ShareButtonProps {
  variant: 'kakao' | 'copy';
  linkUrl: string;
  questionText: string;
  onShare: () => void;
}
```

**Variants:**

- **Kakao**: Yellow background (#FEE500), Kakao icon, text "카카오톡으로 공유"
- **Copy**: Secondary button style (#F0F0F0), copy icon, text "링크 복사"

#### Toast

```typescript
interface ToastProps {
  message: string;
  type: 'success' | 'error';
  duration?: number; // default 2000ms
}
```

### Page Structure

```
app/
  page.tsx                    # Question selection page (home)
  layout.tsx                  # Root layout with Kakao SDK
  r/
    [linkId]/
      page.tsx                # Link redirect/handler (future SPEC)
  api/
    questions/
      route.ts                # GET /api/questions
    links/
      route.ts                # POST /api/links
      [id]/
        route.ts              # GET /api/links/[id]
```

### Technology Stack (from tech.md)

- **Framework**: Next.js 16.1.4 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **Database**: Neon PostgreSQL with `@neondatabase/serverless`
- **Link Hash**: nanoid (10 characters)
- **Share SDK**: Kakao JavaScript SDK

### Dependencies

```json
{
  "dependencies": {
    "nanoid": "^5.0.0",
    "@neondatabase/serverless": "latest"
  }
}
```

---

## Out of Scope

The following features are explicitly excluded from this SPEC and will be addressed in separate specifications:

### SPEC-MUSIC-001: Music Search and Selection (Receiver B Flow)

- Spotify API integration for music search
- Autocomplete search functionality
- Track selection interface
- Receiver B's complete user flow

### SPEC-CARD-001: Card Design and Preview

- 7 card design templates
- Card swipe/selection interface
- Card image generation
- Album cover integration

### SPEC-SHARE-002: Card Sharing (Receiver B to Sender A)

- Card sharing from B to A
- OG image generation for cards
- Complete card viewing experience

### SPEC-VIEW-001: Card Viewing (Sender A)

- Card confirmation page
- Image save functionality
- Streaming app deep links
- Bottom sheet platform selector

### Deferred to v2:

- Card customization (pen tool, stickers)
- Browser storage for history
- Multiple streaming API integration
- Analytics and monitoring

---

## Dependencies

### External Services

| Service              | Purpose                          | Status   |
| -------------------- | -------------------------------- | -------- |
| Neon PostgreSQL      | Database for questions and links | Required |
| Kakao JavaScript SDK | Share functionality              | Required |
| Vercel               | Hosting and deployment           | Required |

### Internal Dependencies

| Dependency            | Description                                            |
| --------------------- | ------------------------------------------------------ |
| Design System         | Colors, typography, button styles from design-guide.md |
| Environment Variables | `DATABASE_URL`, `NEXT_PUBLIC_KAKAO_APP_KEY`            |

### npm Packages

| Package                  | Version | Purpose                                  |
| ------------------------ | ------- | ---------------------------------------- |
| nanoid                   | ^5.0.0  | Generate unique 10-character link hashes |
| @neondatabase/serverless | latest  | PostgreSQL client for Neon               |

---

## Risk Assessment

### Technical Risks

| Risk                       | Impact                       | Mitigation                                                     |
| -------------------------- | ---------------------------- | -------------------------------------------------------------- |
| Kakao SDK load failure     | Users cannot share via Kakao | Provide copy link as fallback                                  |
| Database connection issues | Links cannot be generated    | Implement retry logic, show error message                      |
| Hash collision (nanoid)    | Duplicate link IDs           | 10-char nanoid has 64^10 combinations, collision is negligible |

### Business Risks

| Risk                    | Impact                              | Mitigation                                        |
| ----------------------- | ----------------------------------- | ------------------------------------------------- |
| Low question engagement | Users don't find relevant questions | 7 questions cover relationship/situation spectrum |
| Share friction          | Users abandon before sharing        | Minimize steps, prominent share buttons           |

---

## Success Metrics

| Metric                          | Target                  | Measurement         |
| ------------------------------- | ----------------------- | ------------------- |
| Page Load Time                  | < 1s                    | Vercel Analytics    |
| Link Generation Success Rate    | > 99%                   | API monitoring      |
| Share Completion Rate           | > 70%                   | Event tracking (v2) |
| Question Selection Distribution | Even across 7 questions | Database queries    |

---

## Revision History

| Version | Date       | Author       | Changes               |
| ------- | ---------- | ------------ | --------------------- |
| 1.0     | 2026-01-26 | manager-spec | Initial SPEC creation |

---

_Document generated following EARS format and MoAI SPEC-First methodology_
