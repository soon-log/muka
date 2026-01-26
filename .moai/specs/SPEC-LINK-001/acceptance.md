# SPEC-LINK-001: Acceptance Criteria

---

spec_id: SPEC-LINK-001
title: Link Generation and Question Selection Page
phase: acceptance

---

## Test Scenarios (Given/When/Then)

### Feature: Question Selection Page Load

```gherkin
@critical @smoke
Scenario: User visits MUKA home page
  Given I am a new visitor
  When I navigate to the MUKA home page "/"
  Then I should see the page title "MUKA"
  And I should see the MUKA logo in the header
  And I should see instruction text explaining the service
  And I should see exactly 7 question cards

@critical
Scenario: All question templates are displayed correctly
  Given I am on the question selection page
  When I view the question cards
  Then I should see the following questions in order:
    | id | text                                          |
    | 1  | 나한테 어울리는 음악은?                       |
    | 2  | 내가 힘들 때 들으면 좋을 음악은?              |
    | 3  | 나를 생각하면 떠오르는 음악은?                |
    | 4  | 요즘 네가 꽂힌 음악은?                        |
    | 5  | 아무 생각 없이 들을 수 있는 음악 추천해줘     |
    | 6  | 인생 노래 하나만 추천해줘                     |
    | 7  | 비 오는 날 듣기 좋은 음악은?                  |

@ui
Scenario: Question cards have correct visual styling
  Given I am on the question selection page
  When I inspect a question card
  Then the card should have a white background
  And the card should have border-radius of 12px
  And the text should be 18px Regular weight
  And the text color should be #2D2D2D

@ui @interaction
Scenario: Question card shows hover state
  Given I am on the question selection page
  When I hover over a question card
  Then the card should show a coral (#FF6B6B) border
  And the cursor should change to pointer
```

### Feature: Question Selection

```gherkin
@critical
Scenario: User selects a question
  Given I am on the question selection page
  And I see 7 question cards
  When I click on the question "요즘 네가 꽂힌 음악은?"
  Then the system should start generating a link
  And I should see a loading indicator

@critical
Scenario: Link generation completes successfully
  Given I clicked on a question
  And the system is generating a link
  When the link generation completes
  Then I should see the share options view
  And I should see the generated link displayed
  And I should see a Kakao share button
  And I should see a copy link button

@critical @database
Scenario: Link record is created correctly
  Given I selected question with ID 4
  When the link is generated successfully
  Then a new record should exist in the links table
  And the record ID should be exactly 10 characters
  And the record question_id should be 4
  And the record is_used should be false
  And the record expires_at should be 7 days from now
```

### Feature: Kakao Talk Sharing

```gherkin
@critical @integration
Scenario: User shares link via Kakao Talk
  Given I have generated a link for question "나한테 어울리는 음악은?"
  And I see the share options view
  When I click the Kakao share button
  Then the Kakao share dialog should open
  And the share content title should contain "MUKA"
  And the share content description should contain "나한테 어울리는 음악은?"
  And the share link should be the generated URL

@error-handling
Scenario: Kakao SDK fails to load
  Given the Kakao SDK failed to load
  And I have generated a link
  When I click the Kakao share button
  Then I should see an error message "카카오톡 공유를 사용할 수 없습니다"
  And I should see a suggestion to use the copy link button
  And the copy link button should remain enabled
```

### Feature: Clipboard Copy

```gherkin
@critical
Scenario: User copies link to clipboard
  Given I have generated a link "https://muka.app/r/a1b2c3d4e5"
  And I see the share options view
  When I click the copy link button
  Then the link "https://muka.app/r/a1b2c3d4e5" should be in my clipboard
  And I should see a success toast "링크가 복사되었습니다"

@ui
Scenario: Copy button shows visual feedback
  Given I have generated a link
  When I click the copy link button
  Then the button should show a checkmark icon
  And the button text should change to "복사됨"
  And the button should return to normal state after 1 second

@ui
Scenario: Toast notification auto-dismisses
  Given I copied a link successfully
  And I see the success toast
  When 2 seconds have passed
  Then the toast should disappear with fade animation
```

### Feature: API Endpoints

```gherkin
@api @critical
Scenario: GET /api/questions returns all questions
  Given the questions table is seeded with 7 questions
  When I send a GET request to "/api/questions"
  Then the response status should be 200
  And the response should contain "questions" array with 7 items
  And each question should have "id", "text", "category", "subcategory" fields

@api @critical
Scenario: POST /api/links creates a new link
  Given question with ID 3 exists
  When I send a POST request to "/api/links" with body:
    """
    { "questionId": 3 }
    """
  Then the response status should be 201
  And the response should contain "id" with 10 characters
  And the response should contain "url" starting with "https://muka.app/r/"
  And the response should contain "questionId" equal to 3
  And the response should contain "expiresAt" 7 days in the future

@api @error-handling
Scenario: POST /api/links with invalid question ID
  When I send a POST request to "/api/links" with body:
    """
    { "questionId": 99 }
    """
  Then the response status should be 400
  And the response should contain error code "INVALID_QUESTION_ID"

@api @critical
Scenario: GET /api/links/[id] returns link details
  Given a link with ID "a1b2c3d4e5" exists for question 4
  When I send a GET request to "/api/links/a1b2c3d4e5"
  Then the response status should be 200
  And the response should contain "questionId" equal to 4
  And the response should contain "isUsed" equal to false
  And the response should contain "isExpired" equal to false

@api @error-handling
Scenario: GET /api/links/[id] with non-existent link
  When I send a GET request to "/api/links/nonexistent"
  Then the response status should be 404
  And the response should contain error code "LINK_NOT_FOUND"

@api @error-handling
Scenario: GET /api/links/[id] with expired link
  Given a link with ID "expired123" exists
  And the link expires_at is in the past
  When I send a GET request to "/api/links/expired123"
  Then the response status should be 410
  And the response should contain error code "LINK_EXPIRED"
```

### Feature: Responsive Design

```gherkin
@responsive @mobile
Scenario: Page displays correctly on mobile (375px)
  Given I am viewing on a device with 375px width
  When I load the question selection page
  Then the logo should be centered in the header
  And question cards should span full width with margins
  And all text should be readable without horizontal scrolling

@responsive @desktop
Scenario: Page displays correctly on desktop
  Given I am viewing on a device with 1440px width
  When I load the question selection page
  Then the content should be centered
  And the maximum content width should be 430px
  And the background should extend to full width
```

### Feature: Error Handling

```gherkin
@error-handling
Scenario: Network error during link generation
  Given I selected a question
  And the network connection is unavailable
  When the link generation request fails
  Then I should see an error message "링크 생성에 실패했습니다"
  And I should see a "다시 시도" retry button
  And clicking retry should attempt link generation again

@error-handling
Scenario: Server error during link generation
  Given I selected a question
  And the server returns a 500 error
  When the link generation request fails
  Then I should see an error message
  And I should have an option to go back to question selection
```

### Feature: Accessibility

```gherkin
@a11y
Scenario: Screen reader can navigate questions
  Given I am using a screen reader
  When I navigate to the question selection page
  Then the page title should be announced
  And I should be able to navigate through question cards using arrow keys
  And each question text should be announced when focused

@a11y
Scenario: Keyboard navigation works correctly
  Given I am on the question selection page
  When I press Tab key
  Then focus should move to the first question card
  And pressing Enter on a focused card should select it
  And focus indicators should be visible

@a11y
Scenario: Toast notifications are accessible
  Given I copied a link successfully
  When the toast appears
  Then the toast content should be announced by screen readers
  And the toast should have role="status"
```

---

## Quality Gate Checklist

### Functional Completeness

- [ ] All 7 questions display on selection page
- [ ] Question selection triggers link generation
- [ ] Link generation creates valid database record
- [ ] Generated link has 10-character hash
- [ ] Link expires_at is set to 7 days from creation
- [ ] Kakao share opens with correct content
- [ ] Copy button copies link to clipboard
- [ ] Toast notification appears and auto-dismisses
- [ ] All API endpoints return correct responses
- [ ] Error states show appropriate messages

### Performance

- [ ] Page loads in under 1 second on 4G
- [ ] Link generation completes in under 500ms
- [ ] Share dialog opens in under 200ms
- [ ] No layout shift during page load

### UI/UX

- [ ] Design matches design-guide.md specifications
- [ ] Colors match brand palette (#FF6B6B coral, #FFF9F5 cream)
- [ ] Typography matches Pretendard font specifications
- [ ] Responsive design works on 375px and 430px+ widths
- [ ] Loading states provide visual feedback
- [ ] Error states are clear and actionable

### Code Quality

- [ ] No TypeScript errors (strict mode)
- [ ] No ESLint warnings
- [ ] Unit test coverage > 80%
- [ ] E2E tests pass for critical paths
- [ ] No console errors in production

### Accessibility

- [ ] WCAG AA color contrast compliance
- [ ] Keyboard navigation works
- [ ] Screen reader announces content correctly
- [ ] Focus indicators are visible
- [ ] Tap targets are at least 44x44px

### Security

- [ ] Input validation on API endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] No sensitive data in client-side code
- [ ] CORS configured correctly

---

## Test Data Requirements

### Questions Seed Data

```sql
INSERT INTO questions (id, text, category, subcategory) VALUES
(1, '나한테 어울리는 음악은?', 'relationship', 'a_focused'),
(2, '내가 힘들 때 들으면 좋을 음악은?', 'relationship', 'a_focused'),
(3, '나를 생각하면 떠오르는 음악은?', 'relationship', 'b_focused'),
(4, '요즘 네가 꽂힌 음악은?', 'situation', 'light'),
(5, '아무 생각 없이 들을 수 있는 음악 추천해줘', 'situation', 'light'),
(6, '인생 노래 하나만 추천해줘', 'situation', 'serious'),
(7, '비 오는 날 듣기 좋은 음악은?', 'situation', 'serious');
```

### Test Links Data

```sql
-- Valid link for testing
INSERT INTO links (id, question_id, is_used, created_at, expires_at) VALUES
('test123456', 1, false, NOW(), NOW() + INTERVAL '7 days');

-- Expired link for testing
INSERT INTO links (id, question_id, is_used, created_at, expires_at) VALUES
('expired123', 2, false, NOW() - INTERVAL '8 days', NOW() - INTERVAL '1 day');

-- Used link for testing
INSERT INTO links (id, question_id, is_used, created_at, expires_at) VALUES
('usedlink12', 3, true, NOW() - INTERVAL '1 day', NOW() + INTERVAL '6 days');
```

---

## Verification Methods

| Criterion         | Verification Method              | Tool                  |
| ----------------- | -------------------------------- | --------------------- |
| Question display  | Visual inspection + E2E test     | Playwright            |
| Link generation   | API test + Database query        | Vitest + Neon Console |
| Kakao share       | Manual test on mobile            | Physical device       |
| Clipboard copy    | E2E test + Manual test           | Playwright            |
| Responsive design | Visual inspection at breakpoints | Chrome DevTools       |
| Accessibility     | Automated + Manual audit         | axe-core + VoiceOver  |
| Performance       | Lighthouse audit                 | Chrome DevTools       |
| API responses     | Unit tests                       | Vitest                |

---

_Acceptance criteria created following MoAI SPEC-First methodology with Gherkin format_
