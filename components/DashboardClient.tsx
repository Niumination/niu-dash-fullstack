'use client'

import { useTheme } from '@/components/ThemeProvider'
import { useState, useMemo } from 'react'
import type { Project, Category } from '@/lib/types'

interface Props {
  projects: Project[]
  stats: Record<string, number>
}

export default function DashboardClient({ projects, stats }: Props) {
  const { theme, toggleTheme } = useTheme()
  const [page, setPage] = useState<'dashboard' | 'projects' | 'ecosystem' | 'released' | 'settings'>('dashboard')
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState<Category | 'all'>('all')
  const [sort, setSort] = useState<'newest' | 'oldest' | 'az'>('newest')

  const total = stats.total || 0
  const githubRepos = projects.filter((p) => p.repoName).length
  const devCount = stats.dev || 0
  const readyCount = stats.ready || 0

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sidebar */}
      <Sidebar page={page} setPage={setPage} theme={theme} toggleTheme={toggleTheme} />

      {/* Main */}
      <main className="ml-[220px] flex-1">
        <Header projects={projects} />

        {page === 'dashboard' && (
          <DashboardView
            projects={projects}
            stats={stats}
            total={total}
            githubRepos={githubRepos}
            devCount={devCount}
            readyCount={readyCount}
          />
        )}

        {page === 'projects' && (
          <ProjectsView
            projects={projects}
            search={search}
            setSearch={setSearch}
            catFilter={catFilter}
            setCatFilter={setCatFilter}
            sort={sort}
            setSort={setSort}
          />
        )}

        {page === 'ecosystem' && <EcosystemView projects={projects} />}
        {page === 'released' && <ReleasedView projects={projects} />}
      </main>
    </div>
  )
}

// ===== Sidebar =====
function Sidebar({
  page,
  setPage,
  theme,
  toggleTheme,
}: {
  page: string
  setPage: (p: any) => void
  theme: string
  toggleTheme: () => void
}) {
  const nav = [
    { key: 'dashboard', icon: '◈', label: 'Dashboard' },
    { key: 'projects', icon: '⊞', label: 'Projects' },
    { key: 'ecosystem', icon: '⟁', label: 'Ecosystem' },
    { key: 'released', icon: '⏣', label: 'Released' },
    { key: 'settings', icon: '⚙', label: 'Settings' },
  ] as const

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] z-20 flex flex-col border-r border-[var(--border)] bg-[rgba(5,5,8,.95)] backdrop-blur-2xl">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-[var(--border-subtle)]">
        <span className="text-lg font-bold font-orbitron bg-gradient-to-r from-[#00fff2] to-[#c084fc] bg-clip-text text-transparent">
          NIU
        </span>
        <span className="text-lg font-bold font-orbitron text-[var(--red)]">⚡</span>
        <span className="text-lg font-bold font-orbitron bg-gradient-to-r from-[#00fff2] to-[#c084fc] bg-clip-text text-transparent">
          DASH
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => (
          <button
            key={item.key}
            onClick={() => setPage(item.key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all font-mono ${
              page === item.key
                ? 'bg-[rgba(0,255,242,.12)] border border-[var(--cyan)] text-[var(--cyan)] shadow-[inset_0_0_20px_rgba(0,255,242,.06)]'
                : 'text-[var(--text-secondary)] hover:bg-[rgba(0,255,242,.06)] hover:text-[var(--text-primary)] border border-transparent'
            }`}
          >
            <span className="text-xs w-4 text-center">{item.icon}</span>
            <span>{item.label}</span>
            {page === item.key && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--cyan)] shadow-[0_0_6px_rgba(0,255,242,.6)]" />
            )}
          </button>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-[var(--border-subtle)]">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-mono text-[var(--text-muted)] hover:bg-[rgba(0,255,242,.06)] hover:text-[var(--text-secondary)] transition-all"
        >
          <span>{theme === 'dark' ? '☀' : '☾'}</span>
          <span>{theme === 'dark' ? 'CYBER DIM' : 'DARK NEXUS'}</span>
        </button>
      </div>
    </aside>
  )
}

// ===== Header =====
function Header({ projects }: { projects: Project[] }) {
  const latest = projects.sort((a, b) => {
    const da = parseDateValue(a.date)
    const db = parseDateValue(b.date)
    return db - da
  })[0]

  return (
    <header className="sticky top-0 z-20 h-14 flex items-center px-8 border-b border-[var(--border)] bg-[rgba(5,5,8,.85)] backdrop-blur-2xl">
      <div className="flex items-center gap-4">
        <span className="text-xs font-mono text-[var(--text-muted)] tracking-widest uppercase">
          Nexus Terminal
        </span>
        <span className="w-px h-4 bg-[var(--border)]" />
        <span className="text-xs font-mono text-[var(--cyan)]" suppressHydrationWarning>
          {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Jakarta' })}
        </span>
        <span className="w-px h-4 bg-[var(--border)]" />
        <span className="text-[10px] font-mono text-[var(--text-muted)]">
          Latest: {latest?.name || '—'} · {latest?.date || ''}
        </span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <StatusDot label="ALL SYSTEMS" color="var(--green)" />
      </div>
    </header>
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
}: {
  projects: Project[]
  stats: Record<string, number>
  total: number
  githubRepos: number
  devCount: number
  readyCount: number
}) {
  const activeDev = projects.filter((p) => p.category === 'dev' && p.status === 'active').length
  const latestProjects = [...projects].sort((a, b) => parseDateValue(b.date) - parseDateValue(a.date)).slice(0, 6)
  const tagCloud = getTagCloud(projects)

  return (
    <>
      {/* Hero */}
      <section className="relative px-8 pt-20 pb-16">
        <div className="max-w-4xl">
          <h1 className="font-orbitron text-5xl font-bold tracking-tight">
            <span className="text-gradient">DARK NEXUS</span>
          </h1>
          <p className="mt-4 text-sm font-mono text-[var(--text-secondary)] max-w-xl leading-relaxed">
            Project portfolio dashboard. {total} proyek terinventarisasi dengan live
            GitHub stats, auto-detection, dan DEV TRACKER.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded border border-[var(--border)] bg-[rgba(0,255,242,.04)]">
              <span className="w-2 h-2 rounded-full bg-[var(--green)] shadow-[0_0_6px_rgba(0,255,136,.5)]" />
              <span className="text-xs font-mono text-[var(--text-secondary)]">LIVE</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded border border-[var(--border)] text-xs font-mono text-[var(--text-muted)]">
              v3.1
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="px-8 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Projects" value={String(total)} />
          <StatCard label="GitHub Tracked" value={String(githubRepos)} />
          <StatCard label="In Development" value={String(devCount)} />
          <StatCard label="Ready/Shipped" value={String(readyCount)} />
        </div>
      </section>

      {/* Detailed Stats Row */}
      <section className="px-8 pb-8">
        <h2 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest mb-4">
          ⟐ Per Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { key: 'ready', label: '⚡ Ready', count: stats.ready || 0 },
            { key: 'dev', label: '⟐ Development', count: stats.dev || 0 },
            { key: 'ideas', label: '◇ Ideas/Plan', count: stats.ideas || 0 },
            { key: 'config', label: '⚙ Config/Dots', count: stats.config || 0 },
            { key: 'legacy', label: '◫ Legacy', count: stats.legacy || 0 },
          ].map((cat) => (
            <div
              key={cat.key}
              className="glass rounded-[var(--rad)] p-4 flex items-center justify-between transition-all duration-300 hover:border-[var(--cyan)]"
            >
              <span className="text-xs font-mono text-[var(--text-secondary)]">{cat.label}</span>
              <span className="text-lg font-bold font-orbitron text-gradient">{cat.count}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 glass rounded-[var(--rad)] p-4 flex items-center justify-between">
          <span className="text-xs font-mono text-[var(--text-secondary)]">
            Active Development <span className="text-[var(--green)]">⬤</span>
          </span>
          <span className="text-lg font-bold font-orbitron text-gradient">{activeDev}</span>
        </div>
      </section>

      {/* Latest Projects */}
      <section className="px-8 pb-8">
        <h2 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest mb-4">
          ◈ Latest Projects
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {latestProjects.map((p) => (
            <ProjectCard key={p.name} project={p} />
          ))}
        </div>
      </section>

      {/* Tag Cloud */}
      <section className="px-8 pb-20">
        <h2 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest mb-4">
          ◇ Technology Tags
        </h2>
        <div className="flex flex-wrap gap-2">
          {tagCloud.slice(0, 40).map((t) => (
            <span
              key={t.tag}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono bg-[rgba(0,255,242,.06)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[rgba(0,255,242,.12)] hover:text-[var(--cyan)] transition-all"
            >
              {t.tag}
              <span className="text-[10px] text-[var(--text-muted)]">{t.count}</span>
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
}: {
  projects: Project[]
  search: string
  setSearch: (s: string) => void
  catFilter: Category | 'all'
  setCatFilter: (c: Category | 'all') => void
  sort: string
  setSort: (s: any) => void
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
      <section className="relative px-8 pt-12 pb-8">
        <h1 className="font-orbitron text-3xl font-bold">
          <span className="text-gradient">⟐ PROJECT FEED</span>
        </h1>
        <p className="mt-2 text-xs font-mono text-[var(--text-muted)]">
          {displayed.length} of {projects.length} projects visible
        </p>
      </section>

      {/* Controls */}
      <section className="px-8 pb-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 pl-8 rounded border border-[var(--border)] bg-[rgba(5,5,8,.6)] text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--cyan)] transition-all"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs">⌕</span>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c.key}
                onClick={() => setCatFilter(c.key)}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${
                  catFilter === c.key
                    ? 'bg-[rgba(0,255,242,.12)] border border-[var(--cyan)] text-[var(--cyan)]'
                    : 'bg-[rgba(5,5,8,.4)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-1.5 rounded text-xs font-mono bg-[rgba(5,5,8,.6)] border border-[var(--border)] text-[var(--text-secondary)] focus:outline-none focus:border-[var(--cyan)]"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A–Z</option>
          </select>
        </div>
      </section>

      {/* Feed */}
      <section className="px-8 pb-20">
        {displayed.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4 opacity-30">⏳</div>
            <p className="text-sm font-mono text-[var(--text-muted)]">No projects match your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayed.map((p) => (
              <ProjectCard key={p.name} project={p} detailed />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

// ===== Ecosystem View =====
function EcosystemView({ projects }: { projects: Project[] }) {
  const devProjects = projects.filter((p) => p.category === 'dev')
  const byStatus = {
    active: devProjects.filter((p) => p.status === 'active'),
    staging: devProjects.filter((p) => p.status === 'staging'),
    paused: devProjects.filter((p) => p.status === 'paused'),
    noStatus: devProjects.filter((p) => !p.status),
  }

  return (
    <>
      <section className="relative px-8 pt-12 pb-8">
        <h1 className="font-orbitron text-3xl font-bold">
          <span className="text-gradient">⟁ ECOSYSTEM</span>
        </h1>
        <p className="mt-2 text-xs font-mono text-[var(--text-muted)]">
          {devProjects.length} development projects · {devProjects.filter((p) => p.status === 'active').length} active
        </p>
      </section>

      <section className="px-8 pb-8">
        {byStatus.active.length > 0 && (
          <EcoSection title="⟐ Active" projects={byStatus.active} color="var(--green)" />
        )}
        {byStatus.staging.length > 0 && (
          <EcoSection title="⟐ Staging" projects={byStatus.staging} color="var(--amber)" />
        )}
        {byStatus.paused.length > 0 && (
          <EcoSection title="⟐ Paused" projects={byStatus.paused} color="var(--text-muted)" />
        )}
        {byStatus.noStatus.length > 0 && (
          <EcoSection title="⟐ Unclassified" projects={byStatus.noStatus} color="var(--text-muted)" />
        )}
      </section>
    </>
  )
}

function EcoSection({ title, projects, color }: { title: string; projects: Project[]; color: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color }}>
        {title} <span className="text-[var(--text-muted)]">({projects.length})</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {projects.map((p) => (
          <div
            key={p.name}
            className="glass rounded-[var(--rad)] p-4 transition-all duration-300 hover:border-[var(--cyan)]"
          >
            <div className="flex items-center gap-2">
              <span>{p.icon}</span>
              <h3 className="text-sm font-mono font-bold text-[var(--text-primary)] truncate">{p.name}</h3>
            </div>
            <p className="mt-2 text-xs font-mono text-[var(--text-secondary)] line-clamp-2">{p.desc}</p>
            {p.tags && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tags.slice(0, 4).map((t) => (
                  <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[rgba(0,255,242,.06)] border border-[var(--border)] text-[var(--text-muted)]">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ===== Released View =====
function ReleasedView({ projects }: { projects: Project[] }) {
  const released = projects.filter(
    (p) => p.website || (p.repoName && p.category === 'ready'),
  )
  const ghReady = projects.filter(
    (p) => p.repoName && p.category === 'ready',
  )

  return (
    <>
      <section className="relative px-8 pt-12 pb-8">
        <h1 className="font-orbitron text-3xl font-bold">
          <span className="text-gradient">⏣ RELEASED</span>
        </h1>
        <p className="mt-2 text-xs font-mono text-[var(--text-muted)]">
          {released.length} deployed/shipped projects
        </p>
      </section>

      <section className="px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ghReady.map((p) => (
            <div
              key={p.name}
              className="glass rounded-[var(--rad)] p-4 transition-all duration-300 hover:border-[var(--cyan)]"
            >
              <div className="flex items-center gap-2">
                <span>{p.icon}</span>
                <h3 className="text-sm font-mono font-bold text-[var(--text-primary)] truncate">{p.name}</h3>
              </div>
              <p className="mt-2 text-xs font-mono text-[var(--text-secondary)] line-clamp-2">{p.desc}</p>
              <div className="mt-3 flex items-center gap-2">
                {p.website && (
                  <a
                    href={p.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono text-[var(--cyan)] hover:underline"
                  >
                    🌐 {new URL(p.website).hostname}
                  </a>
                )}
                {p.repoName && (
                  <a
                    href={`https://github.com/Niumination/${p.repoName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--cyan)]"
                  >
                    ⎇ repo
                  </a>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-[var(--text-muted)]">
                <span>{p.date}</span>
                <span>·</span>
                <span className="text-[var(--green)]">● ready</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

// ===== Shared Components =====

function ProjectCard({ project, detailed = false }: { project: Project; detailed?: boolean }) {
  const p = project
  return (
    <div className="glass rounded-[var(--rad)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,.4)] hover:border-[var(--cyan)] group">
      <div className="flex items-center gap-2">
        <span>{p.icon}</span>
        <h3 className="text-sm font-mono font-bold text-[var(--text-primary)] truncate group-hover:text-[var(--cyan)] transition-colors">
          {p.name}
        </h3>
        {p.status && (
          <span
            className={`ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded ${
              p.status === 'active'
                ? 'bg-[rgba(0,255,136,.1)] text-[var(--green)]'
                : p.status === 'staging'
                  ? 'bg-[rgba(255,200,0,.1)] text-[var(--amber)]'
                  : 'bg-[rgba(255,255,255,.05)] text-[var(--text-muted)]'
            }`}
          >
            {p.status}
          </span>
        )}
      </div>
      <p className="mt-2 text-xs font-mono text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
        {p.desc}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {p.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[rgba(0,255,242,.06)] border border-[var(--border)] text-[var(--text-muted)]"
            >
              {t}
            </span>
          ))}
          {p.tags.length > 3 && (
            <span className="text-[10px] font-mono text-[var(--text-muted)]">+{p.tags.length - 3}</span>
          )}
        </div>
        <span className="text-[10px] font-mono text-[var(--text-muted)] whitespace-nowrap ml-2">
          {p.category !== 'dev' && (
            <span className={`text-[10px] font-mono ${
              p.category === 'ready' ? 'text-[var(--green)]' : 'text-[var(--text-muted)]'
            }`}>
              {p.categoryLabel}
            </span>
          )}
        </span>
      </div>
      {detailed && p.date && (
        <div className="mt-2 text-[10px] font-mono text-[var(--text-muted)]">{p.date}</div>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-[var(--rad)] p-5 card-hover transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,.4)] hover:border-[var(--cyan)]">
      <div className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">{label}</div>
      <div className="mt-2 text-2xl font-bold font-orbitron text-gradient">{value}</div>
    </div>
  )
}

function StatusDot({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      <span className="text-[10px] font-mono text-[var(--text-muted)] tracking-wider">{label}</span>
    </div>
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
