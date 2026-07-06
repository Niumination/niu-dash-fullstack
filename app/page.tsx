'use client'

import { useTheme } from '@/components/ThemeProvider'

export default function Home() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-[220px] z-20 flex flex-col border-r border-[var(--border)] bg-[rgba(5,5,8,.95)] backdrop-blur-2xl">
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-5 border-b border-[var(--border-subtle)]">
          <span className="text-lg font-bold font-orbitron bg-gradient-to-r from-[#00fff2] to-[#c084fc] bg-clip-text text-transparent">
            NIU
          </span>
          <span className="text-lg font-bold font-orbitron text-[var(--red)]">⚡</span>
          <span className="text-lg font-bold font-orbitron bg-gradient-to-r from-[#00fff2] to-[#c084fc] bg-clip-text text-transparent">
            DASH
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavButton icon="◈" label="Dashboard" active />
          <NavButton icon="⊞" label="Projects" />
          <NavButton icon="⟁" label="Ecosystem" />
          <NavButton icon="⏣" label="Released" />
          <NavButton icon="⚙" label="Settings" />
        </nav>

        {/* Theme toggle */}
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

      {/* Main content */}
      <main className="ml-[220px] flex-1">
        {/* Header */}
        <header className="sticky top-0 z-20 h-14 flex items-center px-8 border-b border-[var(--border)] bg-[rgba(5,5,8,.85)] backdrop-blur-2xl">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-[var(--text-muted)] tracking-widest uppercase">
              Nexus Terminal
            </span>
            <span className="w-px h-4 bg-[var(--border)]" />
            <span className="text-xs font-mono text-[var(--cyan)]" id="clock">
              00:00:00
            </span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <StatusDot label="ALL SYSTEMS" color="var(--green)" />
          </div>
        </header>

        {/* Hero */}
        <section className="relative px-8 pt-20 pb-16">
          <div className="max-w-4xl">
            <h1 className="font-orbitron text-5xl font-bold tracking-tight">
              <span className="text-gradient">DARK NEXUS</span>
            </h1>
            <p className="mt-4 text-sm font-mono text-[var(--text-secondary)] max-w-xl leading-relaxed">
              Project portfolio dashboard. 105+ proyek terinventarisasi dengan live
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
        <section className="px-8 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Projects" value="—" />
            <StatCard label="Git Tracked" value="—" />
            <StatCard label="Released" value="—" />
            <StatCard label="Ecosystem" value="—" />
          </div>
        </section>
      </main>
    </div>
  )
}

// ===== Sub-components =====

function NavButton({
  icon,
  label,
  active = false,
}: {
  icon: string
  label: string
  active?: boolean
}) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all font-mono ${
        active
          ? 'bg-[rgba(0,255,242,.12)] border border-[var(--cyan)] text-[var(--cyan)] shadow-[inset_0_0_20px_rgba(0,255,242,.06)]'
          : 'text-[var(--text-secondary)] hover:bg-[rgba(0,255,242,.06)] hover:text-[var(--text-primary)] border border-transparent'
      }`}
    >
      <span className="text-xs w-4 text-center">{icon}</span>
      <span>{label}</span>
      {active && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--cyan)] shadow-[0_0_6px_rgba(0,255,242,.6)]" />
      )}
    </button>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-[var(--rad)] p-5 card-hover transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,.4)] hover:border-[var(--cyan)]">
      <div className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold font-orbitron text-gradient">
        {value}
      </div>
    </div>
  )
}

function StatusDot({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
      />
      <span className="text-[10px] font-mono text-[var(--text-muted)] tracking-wider">
        {label}
      </span>
    </div>
  )
}
