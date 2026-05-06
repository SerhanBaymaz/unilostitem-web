# UniLostItem Web

University campus lost-and-found platform frontend.

## Tech Stack

React 19 + Vite 8 + TypeScript 6 (strict) | Tailwind CSS 4 + shadcn/ui | React Query v5 + Zustand v5 | React Hook Form v7 + Zod v3 | React Router v7 (library mode) | Axios v1 | react-leaflet | react-i18next (tr/en) | Biome.js | Vitest + RTL | pnpm

## Commands

- `pnpm dev` — dev server (localhost:5173)
- `pnpm build` — production build
- `pnpm check` — Biome lint + format check
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

Base URL: `VITE_API_BASE_URL` (default: `http://localhost:5000`). All endpoints return `StandardApiResponse<T>`. See REACT_BRIEF.md for full reference.

## Workflow

kodla → test et → todos done yap → CLAUDE.md güncelle → commit mesajı öner → bekle.
