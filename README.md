# ⚡ NIU-DASH FULLSTACK

**Dark Nexus — Project Portfolio Dashboard (Next.js Edition)**

![Version](https://img.shields.io/badge/version-0.1.0-blue?style=flat&labelColor=050508)
![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?style=flat&labelColor=ffffff&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-61dafb?style=flat&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-7-2d3748?style=flat&logo=prisma)

> *// teknologi tidak pernah berhenti — semakin cepat, semakin dalam //*
> *Technology never stops — faster, deeper*

Dashboard **dark cyber** dengan **glassmorphic Zen UI** untuk menginventarisasi dan memonitoring seluruh proyek Niumination. Dibangun dengan **Next.js 16** (App Router) + **React 19** + **Tailwind v4** + **Prisma 7** PostgreSQL. Mendukung 3D scene background via React Three Fiber, Zustand state management, dan real-time sync dari `data/projects.json` (112 proyek).

---

## ✨ Fitur

| Fitur | Status |
|-------|--------|
| **Zen Glassmorphic UI** — Glass cards, blur layering, neon glow accents | ✅ |
| **112 Proyek Terinventarisasi** — 5 kategori (Ready, Dev, Ideas, Config, Legacy) | ✅ |
| **Three-Panel Layout** — Sidebar navigasi, feed cards, detail panel slide-in | ✅ |
| **3D Scene Background** — Origami geometry + particles + cursor light (R3F) | ✅ |
| **Team Status Card** — Monitoring status anggota tim | ✅ |
| **Kanban API Integration** — Sinkronisasi via Prisma 7 ke PostgreSQL | ✅ v0.2 |
| **Live Sorting & Filter** — Sort by newest, oldest, A-Z, Z-A, status, kategori | ✅ |
| **Tag Filter & Search** — Real-time pencarian nama, deskripsi, tag | ✅ |
| **Detail Panel** — Slide-in panel dengan informasi lengkap proyek | ✅ |
| **Theme Switcher** — Dark theme dengan toggle via `next-themes` | ✅ |
| **Responsive** — Mobile-first, sidebar collapse, adaptive grid | ✅ |
| **Data Extraction Script** — `npm run sync-data` update `data/projects.json` dari repositori | ✅ |

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Styling:** Tailwind CSS v4 + `@tailwindcss/postcss`
- **Language:** TypeScript 5
- **Database:** Prisma 7 → PostgreSQL (extendable ke SQLite untuk dev)
- **State:** Zustand 5
- **Forms & Validation:** Zod 4
- **3D Graphics:** `@react-three/fiber` + `@react-three/drei` + `three`
- **Animation:** Framer Motion 12
- **Icons:** Lucide React
- **Auth (optional):** NextAuth v5 beta
- **Toast:** sonner + react-hot-toast
- **Drag & Drop:** @hello-pangea/dnd
- **Query:** @tanstack/react-query

---

## 🚀 Quick Start

```bash
# Clone repo
git clone https://github.com/Niumination/niu-dash-fullstack.git
cd niu-dash-fullstack

# Install dependencies
npm install

# Setup database (Prisma)
npx prisma generate
npx prisma db push   # atau setup PostgreSQL + migrate

# Run dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (Next.js) |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npm run sync-data` | Extract project data → `data/projects.json` |
| `npx prisma studio` | Open Prisma Studio untuk kelola data |

---

## 📁 Struktur Proyek

```
niu-dash-fullstack/
├── app/
│   ├── layout.tsx          # Root layout + theme provider
│   ├── page.tsx            # Dashboard main page
│   ├── loading.tsx         # Skeleton loader
│   ├── error.tsx           # Error boundary
│   └── not-found.tsx       # 404 page
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx  # Three-panel shell
│   │   ├── Sidebar.tsx          # Navigasi + kategori
│   │   └── Header.tsx           # Topbar + search + theme toggle
│   ├── ui/
│   │   ├── DetailPanel.tsx      # Slide-in detail view
│   │   └── FloatingCard.tsx     # Card component
│   ├── three/
│   │   ├── Scene.tsx            # R3F canvas
│   │   ├── OrigamiGeometry.tsx  # 3D origami mesh
│   │   ├── ZenParticles.tsx     # Particle system
│   │   └── CursorLight.tsx      # Cursor-follow spotlight
│   └── TeamStatusCard.tsx       # Team monitoring card
├── data/
│   └── projects.json            # 112 projects dataset
├── lib/
│   ├── projects.ts              # Data processing + filtering
│   ├── types.ts                 # TypeScript interfaces
│   ├── utils.ts                 # Helper functions
│   ├── motion.ts                # Framer Motion variants
│   └── validation.ts            # Zod schemas
├── prisma/
│   ├── schema.prisma            # Database schema (Prisma 7)
│   └── prisma.config.ts         # Prisma config
├── store/
│   └── useZenStore.ts           # Zustand global state
├── scripts/
│   └── extract-data.mjs         # Data extraction pipeline
├── vercel.json                  # Vercel deploy config
├── tailwind.config.ts           # Tailwind v4 config
├── tsconfig.json
└── package.json
```

---

## 🗂️ Kategori Proyek

| Kategori | Label | Deskripsi |
|----------|-------|-----------|
| `⚡ Ready` | Green | Proyek selesai, stabil, production-ready |
| `⟐ Dev` | Cyan | Dalam pengembangan aktif (Active / Staging / Paused) |
| `◇ Ideas` | Amber | Ide, konsep, atau planning phase |
| `⚙ Config` | Purple | Dotfiles, configs, setup tools (Hyprland, macOS, dll) |
| `◫ Legacy` | Dim | Proyek lama, arsip, atau tidak di-maintain lagi |

---

## 🧠 Filosofi

Niu-Dash Fullstack adalah **next-generation** dari niu-dash vanilla. Tidak lagi single-file, namun portofolio modular berbasis Next.js App Router — siap di-deploy ke Vercel dengan database PostgreSQL via Prisma. Dengan **React Three Fiber background**, **Zustand state**, dan **Tailwind v4 glassmorphic theme**, dashboard ini menggabungkan estetika cyberpunk dengan arsitektur modern React 19.

---

## 📝 License

MIT © 2026 — Niumination (Afrizal Munthe)

*Dibangun dengan 🌙 dari Aceh Tengah*
