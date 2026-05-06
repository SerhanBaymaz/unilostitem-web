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

## Project Structure

Feature-based folder structure under `src/features/` (auth, items, claims, admin, profile).
Shared components, hooks, and utilities under `src/shared/`.
UI primitives from shadcn/ui under `src/components/ui/`.

## Backend API

Base URL: `VITE_API_BASE_URL` env variable (default: <http://localhost:5000>)
All endpoints return `StandardApiResponse<T>` wrapper.
See REACT_BRIEF.md for full API reference.

## Workflow

Implementation follows phased approach tracked in implementation-plan.md:
kodla → test et → todos done yap → CLAUDE.md güncelle → commit mesajı öner → bekle.
