import { NextResponse } from 'next/server'
import { getAllProjects, getStats, getTags, getSourceInfo } from '@/lib/projects'

export const dynamic = 'force-static'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const category = url.searchParams.get('category')

  let projects = getAllProjects()
  if (category && category !== 'all') {
    projects = projects.filter((p) => p.category === category)
  }

  return NextResponse.json({
    projects,
    stats: getStats(),
    tags: getTags(),
    source: getSourceInfo(),
  })
}
