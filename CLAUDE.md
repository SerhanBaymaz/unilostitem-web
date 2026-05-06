# UniLostItem Web

University campus lost-and-found platform frontend.

## Tech Stack

- React 19 + Vite 8 + TypeScript 6 (strict)
- Tailwind CSS 4 + shadcn/ui
- React Query (TanStack Query v5) + Zustand v5
- React Hook Form v7 + Zod v3
- React Router v7 (library mode)
- Axios v1 + interceptors
- react-leaflet + Leaflet
- react-i18next (tr/en)
- Biome.js (linter + formatter)
- Vitest + React Testing Library
- pnpm (package manager)

## Commands

- `pnpm dev` — dev server (localhost:5173)
- `pnpm build` — production build
- `pnpm check` — Biome lint + format check
- `pnpm test` — run tests
- `pnpm test:watch` — tests in watch mode

## Design System

See DESIGN.md for full token reference. Key rules:

- Fonts: Instrument Serif (headings) + Plus Jakarta Sans (body)
- Accent: Amber #D97706, Lost: Rose #E11D48, Found: Emerald #059669
- Surfaces: Warm paper white #FAF9F7
- No Inter, no indigo, no pill badges, no generic SaaS look
- Mobile-first (375px base)

### Tailwind CSS Variables

shadcn/ui semantic tokens mapped to DESIGN.md hex values in `src/index.css`:

- `--primary` → #D97706 (amber), `--background` → #FAF9F7 (warm paper)
- `--card` → #FFFFFF, `--muted` → #F5F5F4, `--destructive` → #DC2626
- Custom: `--lost` (#E11D48), `--found` (#059669), `--surface-warm` (#F5F3EF)
- Warm shadows: `--shadow-warm-1` through `--shadow-warm-4`
- Base radius: 6px (0.375rem) for buttons

### shadcn/ui Components

Installed: Button, Input, Card, Badge, Tabs, Dialog, Sheet, Select, Textarea,
Separator, Avatar, DropdownMenu, Label, Form, Sonner, Skeleton.
Config: `components.json` (base-nova style, CSS variables, lucide icons).

## Project Structure

Feature-based folder structure:
```
src/features/{auth,items,claims,admin,profile}/{api,components,hooks,types,store}
src/shared/{components,hooks,lib,types,utils,store}
src/i18n/locales/    src/layouts/    src/pages/    src/router/
```
UI primitives from shadcn/ui under `src/components/ui/`.
Path alias: `@/` → `src/`.

## Core Infrastructure

### Axios Client (`src/shared/lib/axios.ts`)
- Base URL from `VITE_API_BASE_URL` (default: localhost:5000)
- Request interceptor: injects Bearer token from localStorage (`auth_tokens` key)
- Response interceptor: 401 → silent refresh via `/api/v1/auth/refresh-token`, queuing concurrent requests
- Helpers: `getStoredTokens()`, `setStoredTokens()`, `clearStoredTokens()`, `getAccessToken()`

### React Query (`src/shared/lib/queryClient.ts`)
- `staleTime: 2min`, `retry: 1`, `refetchOnWindowFocus: false`
- Mutations: `retry: 0`

### Zustand Stores
- `useAuthStore` (`features/auth/store/authStore.ts`): user, isAuthenticated, setAuth, setUser, logout, setLoading. Persisted to `auth-storage`.
- `useLocaleStore` (`shared/store/localeStore.ts`): locale (tr/en), setLocale. Persisted to `locale-storage`.

### Routing (`src/router/index.tsx`)
- React Router v7 (library mode) with `createBrowserRouter`
- All pages lazy-loaded via `React.lazy()`
- Layouts: `MainLayout` (public + protected), `AuthLayout` (login/register), `AdminLayout` (admin pages)
- Route guards: `ProtectedRoute` (auth check), `AdminRoute` (auth + Admin role check)
- 404 catch-all → `/404` → NotFoundPage

### i18n (`src/i18n/`)
- react-i18next with tr/en namespaces
- Default locale: `tr` (from `VITE_DEFAULT_LOCALE` env or fallback)
- Translation keys: common, nav, auth, items, claims, profile, admin
- Locale synced with `useLocaleStore` via localStorage

### Provider Hierarchy (App.tsx)
QueryClientProvider → Suspense → RouterProvider + Sonner Toaster

## Shared Components (`src/shared/components/`)

### Header
- 60px sticky header with backdrop blur, stone-200 bottom border
- Desktop: logo (Instrument Serif), nav links (13px/500 uppercase tracking), search input (240px), locale dropdown, auth avatar dropdown
- Mobile: logo, search icon, locale icon, auth avatar, hamburger → Sheet (side="left")
- Uses base-ui `render` prop pattern (NOT `asChild`) for Button/SheetTrigger/DropdownMenuTrigger + Link/Router

### AppMap
- react-leaflet MapContainer with custom SVG drop-pin markers (Lost=#E11D48 rose, Found=#059669 emerald)
- Custom icon: 28x36px pin shape with white center dot, L.DivIcon
- FlyToCenter inner component for programmatic centering
- Optional selectable mode (click handler for map picker)
- Leaflet CSS override in index.css: warm stone zoom controls (bg-stone-100, text-stone-500)

### Timeline
- Vertical timeline with 1px stone-200 connector line, 10px status dots
- Dot colors: Pending=amber-500, Approved=emerald-500, Rejected/Cancelled=stone-300
- Current status gets ring-4 ring-amber-100 highlight
- Entry format: date (12px caption), actor (14px/600), description (14px/400)

### Pagination
- Desktop: page number buttons (36px square, 13px/500, rounded), active=bg-stone-900 inverted, hover=bg-stone-100, chevron prev/next
- Mobile: "Load More" button with min-h-48px touch target
- Ellipsis for large page ranges (delta=1)

### EmptyState
- Centered layout with LucideIcon (h-12 w-12, stone-300, strokeWidth=1.5), message (text-secondary), subMessage (text-tertiary), optional action Button

### FilterDrawer
- Sheet (side="bottom") with rounded top corners
- Filters: itemType (Lost/Found), category (ITEM_CATEGORIES), status (Active/Resolved/Expired)
- Controlled component pattern — parent manages state via onChange callbacks
- Active filter indicator badge on trigger button

### ClaimStatusBadge & ItemTypeBadge
- Sharp corners (rounded-sm = 2px), 12px/600 font, tracking-wide
- Lost: bg-rose-50 text-rose-700, Found: bg-emerald-50 text-emerald-700
- Pending: bg-amber-50 text-amber-700, Approved: bg-emerald-50 text-emerald-700, Rejected: bg-red-50 text-red-700, Cancelled: bg-stone-100 text-stone-500

### LoadingSkeleton
- ItemCardSkeleton: thumbnail (24x24) + 3 text lines + 2 badge placeholders
- ItemDetailSkeleton: aspect-square image + 4 text lines + badges + button
- ListSkeleton: configurable count, each row has icon + 2 lines + badge

## base-ui Pattern Note

shadcn/ui uses `base-nova` style (powered by `@base-ui/react`, NOT Radix).
- Use `render` prop instead of `asChild` for polymorphic rendering
- Example: `<SheetTrigger render={<Button />}>content</SheetTrigger>`
- DropdownMenuItem/SheetTrigger/Button etc. do NOT have `asChild`

## Backend API

Base URL: `VITE_API_BASE_URL` env variable (default: <http://localhost:5000>)
All endpoints return `StandardApiResponse<T>` wrapper.
See REACT_BRIEF.md for full API reference.

## Workflow

Implementation follows phased approach tracked in implementation-plan.md:
kodla → test et → todos done yap → CLAUDE.md güncelle → commit mesajı öner → bekle.
