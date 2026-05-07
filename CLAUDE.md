# UniLostItem Web

University campus lost-and-found platform frontend.

## Tech Stack

React 19 + Vite 8 + TypeScript 6 (strict) | Tailwind CSS 4 + shadcn/ui | React Query v5 + Zustand v5 | React Hook Form v7 + Zod v3 | React Router v7 (library mode) | Axios v1 | react-leaflet | react-i18next (tr/en) | ESLint + Prettier | Vitest + RTL | pnpm

## Commands

- `pnpm dev` — dev server (localhost:5173)
- `pnpm build` — production build
- `pnpm check` — ESLint + Prettier check
- `pnpm test` — run tests

## Design Rules

See DESIGN.md for full token reference.

- Fonts: Instrument Serif (headings) + Plus Jakarta Sans (body)
- Accent: Amber #D97706, Lost: Rose #E11D48, Found: Emerald #059669
- Surfaces: Warm paper white #FAF9F7
- No Inter, no indigo, no pill badges, no generic SaaS look
- Mobile-first (375px base)

## Project Structure

Feature-based: `src/features/{auth,items,claims,admin,profile}/`, shared code under `src/shared/`. UI primitives from shadcn/ui under `src/components/ui/`. Path alias: `@/` → `src/`.

## Key Infrastructure

### Axios Client (`src/shared/lib/axios.ts`)

Base URL from `VITE_API_BASE_URL`. Request interceptor injects Bearer token. Response interceptor handles 401 → silent refresh with request queuing.

### React Query (`src/shared/lib/queryClient.ts`)

`staleTime: 2min`, `retry: 1`, `refetchOnWindowFocus: false`. Mutations: `retry: 0`.

### Zustand Stores

- `useAuthStore`: user, isAuthenticated, setAuth, logout. Persisted to `auth-storage`.
- `useLocaleStore`: locale (tr/en), setLocale. Persisted to `locale-storage`.

### Routing (`src/router/index.tsx`)

All pages lazy-loaded. `ProtectedRoute` (auth check), `AdminRoute` (auth + Admin role). 404 catch-all.

### Provider Hierarchy (App.tsx)

QueryClientProvider → Suspense → RouterProvider + Sonner Toaster

## base-ui Pattern Note

shadcn/ui uses `base-nova` style (powered by `@base-ui/react`, NOT Radix).

- Use `render` prop instead of `asChild`: `<SheetTrigger render={<Button />}>content</SheetTrigger>`
- DropdownMenuItem/SheetTrigger/Button do NOT have `asChild`

## Backend API

Base URL: `VITE_API_BASE_URL` (default: `https://localhost:5001`). All endpoints return `StandardApiResponse<T>`. See REACT_BRIEF.md for full reference.

## Code Quality (Zero Tolerance)

**Zero error/warning tolerance** is applied with ESLint + Prettier. Build and commit are blocked if there are any lint/format errors.

### Strict Rules (do not violate these)

- **`no-explicit-any`** — `any` type is forbidden. Create raw type interfaces for API responses (like `ApiClaim`, `ApiItem`) and transform them into domain types with `mapClaim()`/`mapItem()`.
- **`no-unused-vars`** — Unused variables are errors. If unnecessary, name them with a `_` prefix (e.g., `confirmPassword: _`).
- **`reportUnusedDisableDirectives`** — Unnecessary `// eslint-disable` comments are errors. Clean up old disable comments.
- **React Hooks rules** — `rules-of-hooks` and `exhaustive-deps` are at error level.
- **SonarJS rules** — Cognitive complexity, duplicate string, no-identical-functions, etc. (~35 rules).

### Formatting Rules (Prettier — automatic)

- Tab indentation (no spaces)
- Double quotes (not `'`)
- Semicolon required
- Trailing comma required
- Line length max 100 characters

### Pay Attention to These While Coding

- Do not use `any` → use proper types or `unknown`
- Do not use `!` non-null assertion like `document.getElementById("root")!` → perform a null check
- Do not use array index as a key in `map()` → add `// eslint-disable-line react/no-array-index-key` for static lists but only if truly necessary
- Organize imports (no `@trivago/prettier-plugin-sort-imports`, but follow alphabetical order)
- Use `import type` or `import { type X }` (`verbatimModuleSyntax` is active)

## Workflow

code → test → mark todos as done → update CLAUDE.md and README.md → suggest commit message → wait.
