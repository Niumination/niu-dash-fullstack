export interface Project {
  icon: string
  name: string
  path: string
  desc: string
  tags: string[]
  date: string
  website?: string
  category: Category
  categoryLabel: string
  status: DevStatus | null
  history: HistoryEntry[] | null
  plan: string[] | null
  recommendations: Recommendation[] | null
  repoName: string | null
}

export type Category = 'ready' | 'dev' | 'ideas' | 'config' | 'legacy'

export type DevStatus = 'active' | 'staging' | 'paused'

export interface HistoryEntry {
  date: string
  text: string
}

export interface Recommendation {
  text: string
  priority: 'high' | 'mid' | 'low'
}

export interface DevMeta {
  [projectName: string]: {
    status: DevStatus
    history: HistoryEntry[]
    plan: string[]
    recommendations: Recommendation[]
  }
}

export interface ProjectsData {
  _meta: {
    extracted: string
    source: string
    stats: Record<string, number>
  }
  projects: Project[]
  devMeta: DevMeta
}

export const CATEGORIES: { key: Category; label: string; icon: string; color: string }[] = [
  { key: 'ready', label: 'Ready', icon: '⚡', color: 'var(--green)' },
  { key: 'dev', label: 'Development', icon: '⟐', color: 'var(--cyan)' },
  { key: 'ideas', label: 'Ideas/Planning', icon: '◇', color: 'var(--amber)' },
  { key: 'config', label: 'Config/Dotfiles', icon: '⚙', color: 'var(--magenta)' },
  { key: 'legacy', label: 'Legacy/Arsip', icon: '◫', color: 'var(--text-muted)' },
]

export const CATEGORY_ORDER: Category[] = ['ready', 'dev', 'ideas', 'config', 'legacy']
