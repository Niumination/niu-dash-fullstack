# niu-dash-fullstack — Next.js 16 Fullstack Dashboard

**Path:** `projects/niu-dash-fullstack/`
**GitHub:** `github.com/Niumination/niu-dash-fullstack`
**Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, Prisma 7, Three.js, Zustand, Framer Motion
**Status:** 🟢 **Aktif — Deployed to Vercel**

## Fitur Utama

| Fitur | Status |
|-------|:------:|
| **Zen Glassmorphic UI** — Glass cards, blur layering, neon glow accents | ✅ |
| **112 Proyek Terinventarisasi** — 5 kategori (Ready, Dev, Ideas, Config, Legacy) | ✅ |
| **Auto-sync dari ekosistem** — `npm run sync-data` update data dari niu-dash source | ✅ |
| **Three-Panel Layout** — Sidebar navigasi, feed cards, detail panel slide-in | ✅ |
| **Team Status Card** — Monitoring status anggota tim | ✅ |
| **Live Sorting & Filter** — Sort by newest, oldest, A-Z, kategori, status | ✅ |
| **Tag Filter & Search** — Real-time pencarian nama, deskripsi, tag | ✅ |
| **Detail Panel** — Slide-in panel dengan informasi lengkap proyek | ✅ |
| **Theme Switcher** — Dark theme dengan toggle via `next-themes` | ✅ |
| **Responsive** — Mobile-first, sidebar collapse, adaptive grid | ✅ |
| **Data Extraction Script** — `npm run sync-data` update dari Production/niu-dash | ✅ |

## Catatan Perubahan Terbaru

- **3D Scene dihapus** — React Three Fiber di-removed untuk performa (a81c93e)
- **Detail Panel + TeamStatusCard** — Ditambahkan untuk monitoring proyek
- **Sync data via `npm run sync-data`** — tarik data terbaru dari ekosistem

## Struktur

```
app/                    # Next.js App Router
├── page.tsx            # Dashboard — SSR data fetch
├── layout.tsx          # Root layout + theme provider
├── loading.tsx         # Skeleton loader
├── error.tsx           # Error boundary
└── not-found.tsx       # 404 page
components/
├── layout/
│   ├── DashboardLayout.tsx  # Three-panel shell + header
│   ├── Sidebar.tsx          # Navigasi + kategori toggle
│   └── Header.tsx           # Topbar + search
├── ui/
│   ├── DetailPanel.tsx      # Slide-in detail view
│   └── FloatingCard.tsx     # Glassmorphic card
├── three/                   # ❌ Tidak aktif (3D di-removed)
└── TeamStatusCard.tsx       # Team monitoring
data/
├── projects.json       # 112 proyek — auto-generated
lib/
├── projects.ts         # Data processing + filtering
├── types.ts            # TypeScript interfaces
├── utils.ts            # Helper functions
├── motion.ts           # Framer Motion variants
└── validation.ts       # Zod schemas
prisma/
├── schema.prisma       # Schema (PostgreSQL)
└── prisma.config.ts
store/
└── useZenStore.ts      # Zustand global state
scripts/
└── extract-data.mjs    # Data extraction pipeline
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build ✅ |
| `npm run sync-data` | Extract project data → `data/projects.json` |
| `npx prisma generate` | Regenerate Prisma client |

## Ekosistem

Data dashboard ini di-sync dari `Production/niu-dash/index.html` yang merupakan inventarisasi seluruh 30+ repositori GitHub Niumination + 5 direktori non-git.

**30 repositori aktif** meliputi:
- **Production (10):** cc-acehtengah, PemdiAcehTengah, niu-vermilion, niu-dash, kune-ya.com, dll
- **Projects (16):** spatial-vision, didong-code, niu-cast, x-downloader, dll
- **Infrastructure (3):** brain (private), JHermUSB-portable, ecosystem-config

## Deploy

- **Vercel:** https://niu-dash-fullstack-niumination.vercel.app
- **GitHub:** https://github.com/Niumination/niu-dash-fullstack

```bash
git push origin main  # Auto-deploy
```
