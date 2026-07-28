@AGENTS.md

# CLAUDE.md — Project Context for niu-dash-fullstack

## Quick Reference
- **Framework:** Next.js 16 (App Router) + TypeScript + Tailwind v4
- **Data Source:** Static JSON in `data/projects.json` (112 projects)
- **State Management:** Zustand 5
- **Validation:** Zod 4

## Build Commands
```bash
npm run dev          # Dev server (port 3000)
npm run build        # Production build
npm run sync-data    # Re-extract projects from Production/niu-dash/
```

## Key Conventions
- Zen/glassmorphic theme with dark backgrounds
- Components under `components/layout/`, `components/ui/`
- All data flows through `lib/projects.ts` → Zod validation → typed Project[]
- 3D/Three.js was removed for performance (commit a81c93e)
- Dead code: `components/three/` deleted, Three.js deps removed from package.json

## Project Structure
```
app/page.tsx          # SSR → fetches projects, renders DashboardLayout
components/
├── DashboardClient.tsx   # Main client component (all views)
├── layout/               # DashboardLayout, Sidebar, Header
├── ui/                   # DetailPanel, FloatingCard
└── TeamStatusCard.tsx
data/projects.json        # Auto-generated
lib/                      # Data logic
prisma/schema.prisma      # PostgreSQL schema
```

## Ecosystem
- Data syncs from `Production/niu-dash/index.html` via `npm run sync-data`
- 30+ GitHub repos + 5 non-git dirs across Niumination ecosystem
- Live: https://niu-dash-fullstack-niumination.vercel.app
