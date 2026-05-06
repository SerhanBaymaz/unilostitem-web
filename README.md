# UniLostItem Web

A university campus lost-and-found platform built with React. Students can post and search for lost or found items on an interactive map, submit claims, and manage their listings.

## Features

- **Interactive map** — Leaflet-based campus map with Lost (rose) and Found (emerald) pin markers
- **Item management** — Create, edit, and delete lost/found item listings with category, date, and location
- **Claim system** — Submit claims on items, track status with a visual timeline (Pending → Approved/Rejected)
- **Auth** — JWT-based authentication with silent token refresh and protected routes
- **Admin panel** — Dashboard with stats, pending claim review, and item management
- **Bilingual** — Turkish (default) and English via react-i18next
- **Mobile-first** — Responsive design with bottom sheets, touch-friendly targets, and adaptive layouts

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 + Vite 8 + TypeScript 6 |
| Styling | Tailwind CSS 4 + shadcn/ui (base-nova) |
| State | TanStack Query v5 + Zustand v5 |
| Forms | React Hook Form v7 + Zod v3 |
| Routing | React Router v7 (library mode) |
| HTTP | Axios v1 with interceptors |
| Maps | react-leaflet + Leaflet |
| i18n | react-i18next (tr/en) |
| Linting | Biome.js |
| Testing | Vitest + React Testing Library |

## Prerequisites

- Node.js 20+
- pnpm 9+
- Backend API running at `http://localhost:5000`

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Open http://localhost:5173
```

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_DEFAULT_LOCALE=tr
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |
| `pnpm check` | Biome lint + format check |
| `pnpm test` | Run tests |
| `pnpm test:watch` | Tests in watch mode |

## Project Structure

```
src/
├── components/ui/       # shadcn/ui primitives
├── features/
│   ├── auth/            # Login, register, auth API
│   ├── items/           # Item listings, create/edit forms
│   ├── claims/          # Claim submission, timeline, review
│   ├── admin/           # Admin dashboard, claim review, item management
│   └── profile/         # User profile with tabs
├── shared/
│   ├── components/      # Header, AppMap, Timeline, Pagination, FilterDrawer, etc.
│   ├── hooks/           # Shared hooks
│   ├── lib/             # Axios client, React Query config
│   ├── types/           # API types, common enums
│   └── utils/           # Formatters, validators
├── i18n/locales/        # tr.json, en.json
├── layouts/             # AuthLayout, MainLayout, AdminLayout
├── pages/               # Route-level page components (lazy-loaded)
├── router/              # React Router config
└── index.css            # Tailwind + design tokens
```

## Design System

The UI follows a warm editorial aesthetic inspired by campus notice boards:

- **Typography** — Instrument Serif for headings, Plus Jakarta Sans for body text
- **Colors** — Amber (#D97706) accent, Rose (#E11D48) for Lost, Emerald (#059669) for Found
- **Surfaces** — Warm paper white (#FAF9F7) backgrounds, soft stone borders

See `DESIGN.md` for the full design token reference.

## License

Private project.
