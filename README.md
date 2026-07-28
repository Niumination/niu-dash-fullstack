# ⚡ NIU-DASH FULLSTACK

**Dark Nexus — Project Portfolio Dashboard (Next.js Edition)**

![Version](https://img.shields.io/badge/version-0.2.0-blue?style=flat&labelColor=050508)
![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?style=flat&labelColor=ffffff&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-61dafb?style=flat&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-7-2d3748?style=flat&logo=prisma)

> **Dashboard inventarisasi & monitoring seluruh proyek Niumination**
> 112 proyek · 30+ repositori GitHub · 5 kategori

Dashboard **dark glassmorphic** untuk menginventarisasi dan memonitoring seluruh proyek Niumination. Dibangun dengan **Next.js 16** (App Router) + **React 19** + **Tailwind v4** + **Prisma 7**. Data di-sync otomatis dari ekosistem via `npm run sync-data`.

**Live:** https://niu-dash-fullstack-niumination.vercel.app

---

## ✨ Fitur

- **Zen Glassmorphic UI** — Glass cards, blur layering, neon glow accents
- **112 Proyek Terinventarisasi** — 5 kategori (Ready, Dev, Ideas, Config, Legacy)
- **Three-Panel Layout** — Sidebar navigasi, feed cards, detail panel slide-in
- **Team Status Card** — Monitoring status anggota tim
- **Live Sorting & Filter** — Sort by newest, oldest, A-Z, Z-A, status, kategori
- **Tag Filter & Search** — Real-time pencarian nama, deskripsi, tag
- **Detail Panel** — Slide-in panel dengan informasi lengkap proyek
- **Theme Switcher** — Dark theme dengan toggle via `next-themes`
- **Data Extraction Script** — `npm run sync-data` update dari ekosistem

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript 5
- **Database:** Prisma 7 → PostgreSQL
- **State:** Zustand 5
- **Validation:** Zod 4
- **Animation:** Framer Motion 12
- **Icons:** Lucide React
- **Drag & Drop:** @hello-pangea/dnd

---

## 🚀 Quick Start

```bash
git clone https://github.com/Niumination/niu-dash-fullstack.git
cd niu-dash-fullstack
npm install
npm run dev
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npm run sync-data` | Extract project data dari ekosistem |

---

## 📁 Struktur

```
app/                    # Next.js App Router (SSR)
components/
├── layout/             # DashboardLayout, Sidebar, Header
├── ui/                 # DetailPanel, FloatingCard
└── TeamStatusCard.tsx  # Team monitoring
data/
└── projects.json       # 112 proyek (auto-generated)
lib/                    # Data logic + types + validation
prisma/                 # Schema PostgreSQL
store/                  # Zustand state
scripts/                # Data extraction pipeline
```

---

## Ekosistem

Data di-sync dari inventarisasi real-time seluruh ekosistem Niumination:

**30 repositori GitHub** — cc-acehtengah, PemdiAcehTengah, niu-vermilion,
kune-ya.com, spatial-vision, didong-code, Flame-ADE, dan 23 lainnya.

**5 direktori non-git** — PI, archive, rekap, Production, scripts.

---

## 📝 License

MIT © 2026 — Niumination (Afrizal Munthe)

*Dibangun dengan 🌙 dari Aceh Tengah*
