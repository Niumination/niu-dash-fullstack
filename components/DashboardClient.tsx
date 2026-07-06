'use client'

import { useState, useMemo } from 'react'
import { useZenStore } from '@/store/useZenStore'
import FloatingCard from '@/components/ui/FloatingCard'
import DetailPanel from '@/components/ui/DetailPanel'
import { cn } from '@/lib/utils'
import type { Project, Category } from '@/lib/types'

interface Props {
  projects: Project[]
  stats: Record<string, number>
}

export default function DashboardClient({ projects, stats }: Props) {
  const activeRoute = useZenStore((s) => s.activeRoute)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState<Category | 'all'>('all')
  const [sort, setSort] = useState<'newest' | 'oldest' | 'az'>('newest')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const total = stats.total || 0
  const githubRepos = projects.filter((p) => p.repoName).length
  const devCount = stats.dev || 0
  const readyCount = stats.ready || 0

  return (
    <>
      {activeRoute === 'dashboard' && (
        <DashboardView
          projects={projects}
          stats={stats}
          total={total}
          githubRepos={githubRepos}
          devCount={devCount}
          readyCount={readyCount}
          onProjectClick={setSelectedProject}
        />
      )}

      {activeRoute === 'projects' && (
        <ProjectsView
          projects={projects}
          search={search}
          setSearch={setSearch}
          catFilter={catFilter}
          setCatFilter={setCatFilter}
          sort={sort}
          setSort={setSort}
          onProjectClick={setSelectedProject}
        />
      )}

      {activeRoute === 'ecosystem' && <EcosystemView projects={projects} onProjectClick={setSelectedProject} />}
      {activeRoute === 'released' && <ReleasedView projects={projects} onProjectClick={setSelectedProject} />}
      {activeRoute === 'settings' && <SettingsView />}

      <DetailPanel project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  )
}

// ===== Settings View =====
function SettingsView() {
  return (
    <section className="px-6 pt-4">
      <h2 className="font-jp text-2xl font-light tracking-wide text-bg-washi">
        設定
      </h2>
      <p className="mt-2 text-sm text-stone-gray">
        Settings panel — configure dashboard preferences and data sources.
      </p>
    </section>
  )
}

// ===== Dashboard View =====
function DashboardView({
  projects,
  stats,
  total,
  githubRepos,
  devCount,
  readyCount,
  onProjectClick,
}: {
  projects: Project[]
  stats: Record<string, number>
  total: number
  githubRepos: number
  devCount: number
  readyCount: number
  onProjectClick: (p: Project) => void
}) {
  const activeDev = projects.filter((p) => p.category === 'dev' && p.status === 'active').length
  const latestProjects = [...projects].sort((a, b) => parseDateValue(b.date) - parseDateValue(a.date)).slice(0, 6)
  const tagCloud = getTagCloud(projects)

  return (
    <>
      {/* Hero */}
      <section className="relative px-6 pt-4 pb-8">
        <div className="max-w-4xl">
          <h1 className="font-jp text-4xl font-light tracking-wide text-bg-washi">
            Zen Studio
          </h1>
          <p className="mt-2 text-sm text-stone-gray max-w-xl leading-relaxed">
            Project portfolio dashboard. {total} proyek terinventarisasi dengan live
            GitHub stats, auto-detection, dan DEV TRACKER.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass-strong">
              <span className="h-2 w-2 rounded-full bg-matcha-glow shadow-[0_0_8px_rgba(143,179,129,0.5)]" />
              <span className="text-xs font-mono text-stone-gray">LIVE</span>
            </div>
            <div className="rounded-xl glass-strong px-4 py-2 text-xs font-mono text-stone-gray">
              v3.1 · Zen Studio
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="px-6 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Projects" value={String(total)} />
          <StatCard label="GitHub Tracked" value={String(githubRepos)} />
          <StatCard label="In Development" value={String(devCount)} />
          <StatCard label="Ready/Shipped" value={String(readyCount)} />
        </div>
      </section>

      {/* Per Category */}
      <section className="px-6 pb-8">
        <h2 className="text-xs font-medium tracking-widest uppercase text-stone-gray/60 mb-4 font-mono">
          ◇ Per Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((cat) => {
            const count = stats[cat.key] || 0
            return (
              <FloatingCard key={cat.key} glowColor={cat.glow} className="h-full" enableTilt={false}>
                <div className="flex items-center justify-between p-4">
                  <span className="text-xs font-mono text-stone-gray">{cat.label}</span>
                  <span className={cn("text-lg font-semibold", cat.textClass)}>{count}</span>
                </div>
              </FloatingCard>
            )
          })}
        </div>
        <div className="mt-3 glass-card rounded-2xl flex items-center justify-between px-5 py-4">
          <span className="text-xs font-mono text-stone-gray">
            Active Development <span className="text-matcha-glow">⬤</span>
          </span>
          <span className="text-lg font-semibold text-bg-washi">{activeDev}</span>
        </div>
      </section>

      {/* Latest Projects */}
      <section className="px-6 pb-8">
        <h2 className="text-xs font-medium tracking-widest uppercase text-stone-gray/60 mb-4 font-mono">
          ◈ Latest Projects
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {latestProjects.map((p) => (
            <ProjectCard key={p.name} project={p} onProjectClick={onProjectClick} />
          ))}
        </div>
      </section>

      {/* Tag Cloud */}
      <section className="px-6 pb-12">
        <h2 className="text-xs font-medium tracking-widest uppercase text-stone-gray/60 mb-4 font-mono">
          ◇ Technology Tags
        </h2>
        <div className="flex flex-wrap gap-2">
          {tagCloud.slice(0, 40).map((t) => (
            <span
              key={t.tag}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono glass-strong text-stone-gray hover:text-bg-washi transition-colors"
            >
              {t.tag}
              <span className="text-[10px] text-white/30">{t.count}</span>
            </span>
          ))}
        </div>
      </section>
    </>
  )
}

// ===== Projects View =====
function ProjectsView({
  projects,
  search,
  setSearch,
  catFilter,
  setCatFilter,
  sort,
  setSort,
  onProjectClick,
}: {
  projects: Project[]
  search: string
  setSearch: (s: string) => void
  catFilter: Category | 'all'
  setCatFilter: (c: Category | 'all') => void
  sort: string
  setSort: (s: any) => void
  onProjectClick: (p: Project) => void
}) {
  const displayed = useMemo(() => {
    let items = [...projects]
    if (catFilter !== 'all') items = items.filter((p) => p.category === catFilter)
    if (search) {
      const q = search.toLowerCase()
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }
    if (sort === 'newest') items.sort((a, b) => parseDateValue(b.date) - parseDateValue(a.date))
    else if (sort === 'oldest') items.sort((a, b) => parseDateValue(a.date) - parseDateValue(b.date))
    else if (sort === 'az') items.sort((a, b) => a.name.localeCompare(b.name))
    return items
  }, [projects, catFilter, search, sort])

  const cats: { key: Category | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'ready', label: 'Ready' },
    { key: 'dev', label: 'Dev' },
    { key: 'ideas', label: 'Ideas' },
    { key: 'config', label: 'Config' },
    { key: 'legacy', label: 'Legacy' },
  ]

  return (
    <>
      <section className="px-6 pt-4 pb-6">
        <h1 className="font-jp text-3xl font-light tracking-wide text-bg-washi">
          プロジェクト
        </h1>
        <p className="mt-1 text-sm text-stone-gray">
          {displayed.length} of {projects.length} projects visible
        </p>
      </section>

      {/* Controls */}
      <section className="px-6 pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 pl-8 rounded-xl glass-strong text-sm font-mono text-bg-washi placeholder:text-stone-gray/50 focus:outline-none focus:ring-1 focus:ring-matcha-glow/30 transition-all"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-gray/50 text-xs">⌕</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c.key}
                onClick={() => setCatFilter(c.key)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-mono transition-all",
                  catFilter === c.key
                    ? "glass-strong text-matcha-glow"
                    : "text-stone-gray hover:text-bg-washi hover:bg-white/[0.04]"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-mono glass-strong text-stone-gray focus:outline-none focus:ring-1 focus:ring-matcha-glow/30"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A–Z</option>
          </select>
        </div>
      </section>

      {/* Feed */}
      <section className="px-6 pb-12">
        {displayed.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4 opacity-30">⏳</div>
            <p className="text-sm font-mono text-stone-gray">No projects match your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayed.map((p) => (
              <ProjectCard key={p.name} project={p} detailed onProjectClick={onProjectClick} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

// ===== Ecosystem View =====
function EcosystemView({ projects, onProjectClick }: { projects: Project[]; onProjectClick: (p: Project) => void }) {
  const devProjects = projects.filter((p) => p.category === 'dev')
  const byStatus = {
    active: devProjects.filter((p) => p.status === 'active'),
    staging: devProjects.filter((p) => p.status === 'staging'),
    paused: devProjects.filter((p) => p.status === 'paused'),
    noStatus: devProjects.filter((p) => !p.status),
  }

  return (
    <>
      <section className="px-6 pt-4 pb-6">
        <h1 className="font-jp text-3xl font-light tracking-wide text-bg-washi">
          生態系
        </h1>
        <p className="mt-1 text-sm text-stone-gray">
          {devProjects.length} development projects · {devProjects.filter((p) => p.status === 'active').length} active
        </p>
      </section>

      <section className="px-6 pb-12">
        {byStatus.active.length > 0 && (
          <EcoSection title="⟐ Active" projects={byStatus.active} color="text-matcha-glow" onProjectClick={onProjectClick} />
        )}
        {byStatus.staging.length > 0 && (
          <EcoSection title="⟐ Staging" projects={byStatus.staging} color="text-amber-400" onProjectClick={onProjectClick} />
        )}
        {byStatus.paused.length > 0 && (
          <EcoSection title="⟐ Paused" projects={byStatus.paused} color="text-stone-gray" onProjectClick={onProjectClick} />
        )}
        {byStatus.noStatus.length > 0 && (
          <EcoSection title="⟐ Unclassified" projects={byStatus.noStatus} color="text-stone-gray/60" onProjectClick={onProjectClick} />
        )}
      </section>
    </>
  )
}

function EcoSection({ title, projects, color, onProjectClick }: { title: string; projects: Project[]; color: string; onProjectClick: (p: Project) => void }) {
  return (
    <div className="mb-8">
      <h2 className={cn("text-xs font-mono uppercase tracking-widest mb-3", color)}>
        {title} <span className="text-stone-gray/50">({projects.length})</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {projects.map((p) => (
          <button key={p.name} onClick={() => onProjectClick(p)} className="w-full text-left">
            <FloatingCard glowColor="matcha" enableTilt={false} className="h-full">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <span>{p.icon}</span>
                  <h3 className="text-sm font-mono font-semibold text-bg-washi truncate">{p.name}</h3>
                </div>
                <p className="mt-2 text-xs font-mono text-stone-gray/80 line-clamp-2">{p.desc}</p>
                {p.tags && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 4).map((t) => (
                      <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded-lg glass-strong text-stone-gray">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </FloatingCard>
          </button>
        ))}
      </div>
    </div>
  )
}

// ===== Released View =====
function ReleasedView({ projects, onProjectClick }: { projects: Project[]; onProjectClick: (p: Project) => void }) {
  const released = projects.filter(
    (p) => p.website || (p.repoName && p.category === 'ready'),
  )
  const ghReady = projects.filter(
    (p) => p.repoName && p.category === 'ready',
  )

  return (
    <>
      <section className="px-6 pt-4 pb-6">
        <h1 className="font-jp text-3xl font-light tracking-wide text-bg-washi">
          リリース
        </h1>
        <p className="mt-1 text-sm text-stone-gray">
          {released.length} deployed/shipped projects
        </p>
      </section>

      <section className="px-6 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ghReady.map((p) => (
            <button key={p.name} onClick={() => onProjectClick(p)} className="w-full text-left">
              <FloatingCard glowColor="tokyo" enableTilt={false} className="h-full">
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <span>{p.icon}</span>
                    <h3 className="text-sm font-mono font-semibold text-bg-washi truncate">{p.name}</h3>
                  </div>
                  <p className="mt-2 text-xs font-mono text-stone-gray/80 line-clamp-2">{p.desc}</p>
                  <div className="mt-3 flex items-center gap-2">
                    {p.website && (
                      <a
                        href={p.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-neon-tokyo hover:underline"
                      >
                        🌐 {new URL(p.website).hostname}
                      </a>
                    )}
                    {p.repoName && (
                      <a
                        href={`https://github.com/Niumination/${p.repoName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-stone-gray hover:text-bg-washi transition-colors"
                      >
                        ⎇ repo
                      </a>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-stone-gray/60">
                    <span>{p.date}</span>
                    <span>·</span>
                    <span className="text-matcha-glow">● ready</span>
                  </div>
                </div>
              </FloatingCard>
            </button>
          ))}
        </div>
      </section>
    </>
  )
}

// ===== Shared Components =====
function ProjectCard({ project, detailed = false, onProjectClick }: { project: Project; detailed?: boolean; onProjectClick?: (p: Project) => void }) {
  const p = project
  const card = (
    <FloatingCard glowColor="indigo" enableTilt={false} className={'h-full group' + (onProjectClick ? ' cursor-pointer' : '')}>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <span>{p.icon}</span>
          <h3 className="text-sm font-mono font-semibold text-bg-washi truncate group-hover:text-matcha-glow transition-colors">
            {p.name}
          </h3>
          {p.status && (
            <span
              className={cn(
                "ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded-lg",
                p.status === 'active' && "bg-matcha/10 text-matcha-glow",
                p.status === 'staging' && "bg-amber-500/10 text-amber-400",
                p.status === 'paused' && "bg-white/[0.05] text-stone-gray",
              )}
            >
              {p.status}
            </span>
          )}
        </div>
        <p className="mt-2 text-xs font-mono text-stone-gray/80 line-clamp-2 leading-relaxed">
          {p.desc}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {p.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded-lg glass-strong text-stone-gray"
              >
                {t}
              </span>
            ))}
            {p.tags.length > 3 && (
              <span className="text-[10px] font-mono text-stone-gray/60">+{p.tags.length - 3}</span>
            )}
          </div>
          <span className="text-[10px] font-mono text-stone-gray/60 whitespace-nowrap ml-2">
            {p.category !== 'dev' && (
              <span className={cn(
                "text-[10px] font-mono",
                p.category === 'ready' ? 'text-matcha-glow' : 'text-stone-gray/60'
              )}>
                {p.categoryLabel}
              </span>
            )}
          </span>
        </div>
        {detailed && p.date && (
          <div className="mt-2 text-[10px] font-mono text-stone-gray/60">{p.date}</div>
        )}
      </div>
    </FloatingCard>
  )

  if (onProjectClick) {
    return (
      <button onClick={() => onProjectClick(p)} className="w-full text-left">
        {card}
      </button>
    )
  }

  return card
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <FloatingCard glowColor="tokyo" enableTilt={false} className="h-full">
      <div className="p-5">
        <div className="text-xs font-mono text-stone-gray uppercase tracking-wider">{label}</div>
        <div className="mt-2 text-2xl font-semibold text-bg-washi">{value}</div>
      </div>
    </FloatingCard>
  )
}

// ===== Helpers =====
function parseDateValue(str: string): number {
  if (!str) return 0
  const months: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  }
  const parts = str.split(' ')
  if (parts.length >= 3) {
    const d = parseInt(parts[0])
    const mo = parts[1]?.toLowerCase().substring(0, 3)
    const y = parseInt(parts[2])
    if (!isNaN(d) && months[mo] !== undefined && !isNaN(y)) return new Date(y, months[mo], d).getTime()
  }
  if (parts.length >= 2) {
    const y = parseInt(parts[0])
    if (!isNaN(y)) return new Date(y, 0, 1).getTime()
  }
  return 0
}

function getTagCloud(projects: Project[]): { tag: string; count: number }[] {
  const map = new Map<string, number>()
  for (const p of projects) {
    for (const t of p.tags) {
      map.set(t, (map.get(t) || 0) + 1)
    }
  }
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

// Category mapping for Per Category stats display
const categories: { key: string; label: string; glow: 'matcha' | 'sakura' | 'indigo' | 'tokyo'; textClass: string }[] = [
  { key: 'ready', label: '⚡ Ready', glow: 'matcha', textClass: 'text-matcha-glow' },
  { key: 'dev', label: '⟐ Development', glow: 'tokyo', textClass: 'text-neon-tokyo' },
  { key: 'ideas', label: '◇ Ideas/Plan', glow: 'sakura', textClass: 'text-sakura' },
  { key: 'config', label: '⚙ Config/Dots', glow: 'indigo', textClass: 'text-indigo-400' },
  { key: 'legacy', label: '◫ Legacy', glow: 'indigo', textClass: 'text-stone-gray/60' },
]
