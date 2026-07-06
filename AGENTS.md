# niu-dash-fullstack — Next.js 16 Fullstack Dashboard

**Path:** `projects/niu-dash-fullstack/`
**GitHub:** `github.com/Niumination/niu-dash-fullstack`
**Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, Prisma 7, Three.js, TanStack Query, next-auth, Zustand, Framer Motion

## Status
- ✅ Git initialized & pushed ke GitHub (06 Jul 2026)
- 🟡 **Active** — dalam pengembangan
- ⚪ Deployment: belum

## Struktur
- `app/` — Next.js App Router (pages, layout, API routes)
- `components/` — React components (ThreeBackground, ThemeProvider, dll)
- `prisma/` — Database schema & migrations
- `scripts/` — Deploy scripts
- `public/` — Static assets

## Fitur
- **3D Particle Background** — React Three Fiber (80 partikel dengan connection lines)
- **Dark Nexus Theme** — Dark/Cyber Dim mode, grid overlay, scanlines, glitch effect
- **Sidebar Dashboard** — Navigasi + theme toggle + status indicator

## Catatan
- `.env` di .gitignore — jangan commit
- Prisma generate output di `app/generated/prisma/` — di-ignore
- Next.js 16 — cek `node_modules/next/dist/docs/` untuk API terbaru
