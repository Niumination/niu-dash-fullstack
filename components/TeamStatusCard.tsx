import { HardHat, Eye, Cpu, ShieldCheck } from 'lucide-react'

interface TeamStatusCardProps {
  name: string
  role: 'Pembangun' | 'Pengawas' | 'Arsitek' | 'Penjaga'
  status: 'idle' | 'working' | 'done'
}

const roleConfig = {
  Pembangun: { icon: HardHat, color: 'text-matcha-glow', glow: 'glow-matcha' },
  Pengawas: { icon: Eye, color: 'text-neon-tokyo', glow: 'glow-sakura' },
  Arsitek: { icon: Cpu, color: 'text-sakura', glow: 'glow-sakura' },
  Penjaga: { icon: ShieldCheck, color: 'text-matcha', glow: 'glow-matcha' },
} as const

const statusBadge = {
  idle: 'bg-white/[0.04] text-stone-gray',
  working: 'bg-matcha/10 text-matcha-glow animate-pulse',
  done: 'bg-white/[0.06] text-bg-washi',
} as const

export default function TeamStatusCard({ name, role, status }: TeamStatusCardProps) {
  const cfg = roleConfig[role]
  const Icon = cfg.icon

  return (
    <div className={`glass-card rounded-2xl p-4 ${cfg.glow} transition-all hover:scale-[1.02]`}>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06]">
          <Icon className={`h-5 w-5 ${cfg.color}`} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-bg-washi">{name}</h3>
          <p className="text-xs text-stone-gray">{role}</p>
        </div>
        <span className={`rounded-full px-2 py-1 text-[10px] font-mono font-medium uppercase tracking-wider ${statusBadge[status]}`}>
          {status}
        </span>
      </div>
    </div>
  )
}
