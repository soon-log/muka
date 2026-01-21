## Common Commands

```bash
# Development
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm preview                # Preview production build

# Testing
pnpm test                   # Run unit tests (Vitest)
pnpm test:watch             # Run tests in watch mode
pnpm test:coverage          # Run tests with coverage report
pnpm test:e2e               # Run E2E tests (Playwright)

# Code Quality
pnpm lint                   # Run ESLint
pnpm lint:fix               # Run ESLint with auto-fix
pnpm format                 # Format code with Prettier
pnpm format:check           # Check formatting without changes
pnpm typecheck              # Run TypeScript type checking
```

---

## Project Overview

**MUKA** - A service where users request music recommendations from friends and receive responses as shareable cards

### Tech Stack

- **Framework**: Next.js 16.1.4, React 19.2.3
- **Styling**: Tailwind CSS 4
- **Database**: Neon DB (PostgreSQL)
- **APIs**: Spotify Web API, Kakao SDK
- **Image**: Satori (@vercel/og)
- **Testing**: Vitest 4.0.17, React Testing Library 16.3.2, Playwright 1.57.0
- **Quality**: ESLint 9, Prettier 3.8.0, TypeScript 5

### Core Features

- Select from 7 question templates and generate one-time links
- Spotify music search (no login required)
- 7 card designs with swipe selection
- KakaoTalk sharing + image save
- Streaming app integration (Spotify, YouTube Music, Melon)

Detailed documentation in `doc/`:

| Doc File        | Contents                          |
| --------------- | --------------------------------- |
| prd.md          | Product requirements, user flows  |
| trd.md          | Technical architecture, API specs |
| design-guide.md | UI/UX guidelines, card designs    |

---

## Core Philosophy

You are Claude Code. I use specialized agents and skills for complex tasks.

**Key Principles:**

1. **Agent-First**: Delegate to specialized agents for complex work
2. **Plan Before Execute**: Use Plan Mode for complex operations
3. **Test-Driven**: Write tests before implementation
4. **Security-First**: Never compromise on security

## Modular Rules

Detailed guidelines are in `rules/`:

| Rule File       | Contents                                           |
| --------------- | -------------------------------------------------- |
| architecture.md | FSD architecture, layer rules, Next.js integration |
| security.md     | Security checks, secret management                 |
| coding-style.md | Immutability, file organization, error handling    |
| testing.md      | TDD workflow, 80% coverage requirement             |
| git-workflow.md | Commit format, PR workflow                         |
| patterns.md     | API response, repository patterns                  |
| performance.md  | Model selection, context management                |

---

## File Structure

```
src/
|-- app/              # Next.js app router (pages, API routes)
e2e/                  # Playwright E2E tests
doc/                  # Project documentation (PRD, TRD, Design)
rules/                # Modular coding guidelines
public/               # Static assets
```

---

## Personal Preferences

### Code Style

- No emojis in code, comments, or documentation
- Prefer immutability - never mutate objects or arrays
- Many small files over few large files
- 200-400 lines typical, 800 max per file

### Git

- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Small, focused commits

---

## Boundaries

### Always Do

- Write tests first (TDD)
- Run `pnpm lint` and `pnpm format:check` before committing
- Run `pnpm test` before pushing
- Write tests in `__tests__/` folders or `.test.ts` files
- Use environment variables for secrets
- Use Context7 MCP before installing or using any library to check latest docs
- Use pnpm for all package operations

### Ask First

- Database schema changes
- Major refactoring across multiple files
- Adding new dependencies
- Modifying `doc/` documentation structure
- Deleting any files

### Never Do

- Commit `.env` files or secrets
- Modify `pnpm-lock.yaml` manually
- Push directly to `main` branch
- Delete or overwrite `doc/` files without confirmation
- Skip tests for "quick fixes"

---

## Success Metrics

You are successful when:

- All tests pass (80%+ coverage)
- No security vulnerabilities
- Code is readable and maintainable
- User requirements are met
- ESLint passes with no errors
- Prettier formatting is consistent

---

**Philosophy**: Agent-first design, plan before action, test before code, security always.
