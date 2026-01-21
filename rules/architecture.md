# Architecture

## FSD (Feature-Sliced Design)

This project uses FSD adapted for Next.js App Router.

## Layer Structure

```
app → pages → widgets → features → entities → shared
```

- Higher layers import from lower layers only
- No same-layer imports
- No reverse imports

| Layer    | Purpose                  | Examples                          |
| -------- | ------------------------ | --------------------------------- |
| app      | Providers, global styles | ThemeProvider, QueryProvider      |
| pages    | Full page components     | HomePage, CardPage                |
| widgets  | Composite UI blocks      | Header, CardList, QuestionForm    |
| features | User actions             | SelectMusic, ShareCard, SaveImage |
| entities | Domain models            | Card, Question, User              |
| shared   | Utilities, API, DB       | api/, ui/, lib/, db/              |

## Next.js App Router Integration

Next.js file-based routing conflicts with FSD flat structure.
Solution: `app/` at root for routing, FSD layers in `src/`.

```
├── app/                    # Next.js routing only
│   ├── layout.tsx
│   ├── page.tsx
│   ├── api/
│   └── [routes]/
├── pages/                  # Empty (prevents src/pages as Pages Router)
│   └── README.md
├── middleware.ts           # Must be at root
├── instrumentation.ts      # Must be at root
└── src/                    # FSD layers
    ├── app/
    ├── pages/
    ├── widgets/
    ├── features/
    ├── entities/
    └── shared/
```

### Page Re-exports

```typescript
// app/card/[id]/page.tsx
export { CardPage as default, metadata } from '@/pages/card';
```

### API Routes

```typescript
// app/api/cards/route.ts
export { GET, POST } from '@/shared/api/cards';
```

## Slice Structure

```
features/select-music/
├── ui/           # Components
├── model/        # State, hooks, types
├── api/          # API calls
└── index.ts      # Public exports
```

## Public API Rule

Export from `index.ts` only:

```typescript
// Good
import { MusicSearch } from '@/features/select-music';

// Bad
import { MusicSearch } from '@/features/select-music/ui/MusicSearch';
```
