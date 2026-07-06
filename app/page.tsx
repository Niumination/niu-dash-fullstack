import { getAllProjects, getStats } from '@/lib/projects'
import DashboardClient from '@/components/DashboardClient'
import type { Category } from '@/lib/types'

export default function HomePage() {
  const projects = getAllProjects()
  const stats = getStats()

  return <DashboardClient projects={projects} stats={stats} />
}
