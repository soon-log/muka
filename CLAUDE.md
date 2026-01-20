# CLAUDE.md

Project-specific instructions for Claude Code.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5 (strict mode)
- **UI**: React 19, Tailwind CSS 4
- **State**: Zustand
- **Testing**: Vitest (unit), Playwright (e2e)
- **Package Manager**: pnpm

## Commands

```bash
pnpm dev              # Start dev server (Turbopack)
pnpm build            # Production build
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix lint errors
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting
pnpm test             # Run unit tests
pnpm test:coverage    # Run tests with coverage
pnpm test:e2e         # Run Playwright e2e tests
pnpm typecheck        # TypeScript type check
```

## Architecture (FSD + App Router)

```
src/
├── app/                  # Next.js App Router (routing only)
│   ├── (routes)/         # Route groups
│   ├── layout.tsx
│   └── page.tsx
├── features/             # Feature modules (user-facing)
├── entities/             # Business entities
├── shared/               # Shared resources
│   ├── ui/               # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   └── types/            # Shared TypeScript types
└── widgets/              # Composite UI blocks
```

**FSD Import Rules**: `shared → entities → features → widgets → app`

## Code Style

### TypeScript

- Strict mode enabled (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- Explicit return types for functions
- No `any` — use `unknown` with type guards
- Prefix unused variables with `_`

### Avoid enum — Use `as const` pattern

```typescript
// ❌ Bad
enum Status { ACTIVE = 'Active' }

// ✅ Good
export const Status = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
} as const;
export type Status = (typeof Status)[keyof typeof Status];
```

### Imports

Order: builtin → external → internal → parent/sibling → type

```typescript
import { useEffect } from 'react';

import Image from 'next/image';

import { Button } from '@/shared/ui';

import { useAuth } from '../hooks';

import type { User } from './types';
```

### Images

Always use `next/image` for rendering images:

```typescript
import Image from 'next/image';

<Image src="/logo.png" alt="Logo" width={100} height={100} />
```

## Testing

- **Coverage target**: 80% minimum
- **TDD**: Write tests before implementation
- **Unit tests**: `*.test.tsx` files alongside components
- **E2E tests**: `e2e/` directory

```bash
# Before commit, all must pass:
pnpm lint && pnpm typecheck && pnpm test
```

## Git Workflow (GitFlow)

### Branches

- `main` — Production releases
- `develop` — Integration branch
- `feature/*` — New features (from develop)
- `release/*` — Release preparation
- `hotfix/*` — Production fixes

### Commit Convention (Conventional Commits)

```
<type>(<scope>): <description>

feat:     New feature
fix:      Bug fix
docs:     Documentation
style:    Formatting (no code change)
refactor: Code refactoring
test:     Adding tests
chore:    Maintenance
```

### Pre-commit Checklist

1. `pnpm lint:fix` — Fix lint errors
2. `pnpm format` — Format code
3. `pnpm typecheck` — Type check
4. `pnpm test` — Run tests
5. All must pass before commit

## External APIs

- **Spotify API**: Music data integration
- **Kakao SDK**: Client-side social features (`NEXT_PUBLIC_KAKAO_APP_KEY`)
- **Neon DB**: PostgreSQL database (`DATABASE_URL`)

## Important Notes

- **Use Context7 MCP** before installing or using any library to check latest docs
- **Use pnpm** for all package operations
- **Path alias**: `@/*` maps to `./src/*`
