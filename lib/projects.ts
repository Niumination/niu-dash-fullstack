import type { Project, Category, DevStatus, ProjectsData } from './types'
import raw from '@/data/projects.json'

const data = raw as unknown as ProjectsData

export function getAllProjects(): Project[] {
  return data.projects
}

export function getProjectsByCategory(cat: Category): Project[] {
  return data.projects.filter((p) => p.category === cat)
}

export function getStats() {
  return data._meta.stats
}

export function getDevProjects() {
  return data.projects.filter((p) => p.category === 'dev')
}

export function getDevProjectsByStatus(status: DevStatus) {
  return data.projects.filter((p) => p.category === 'dev' && p.status === status)
}

export function getTags(): { tag: string; count: number }[] {
  const tagMap = new Map<string, number>()
  for (const p of data.projects) {
    for (const tag of p.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    }
  }
  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

export function searchProjects(query: string): Project[] {
  const q = query.toLowerCase()
  return data.projects.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)),
  )
}

export function filterByCategory(cat: Category | 'all'): Project[] {
  if (cat === 'all') return data.projects
  return data.projects.filter((p) => p.category === cat)
}

export function filterByStatus(status: DevStatus | 'all'): Project[] {
  if (status === 'all') return data.projects
  return data.projects.filter((p) => p.category === 'dev' && p.status === status)
}

export function getDevMetaForProject(name: string) {
  return data.devMeta[name] || null
}

export function getSourceInfo() {
  return {
    extracted: data._meta.extracted,
    total: data._meta.stats.total,
  }
}
