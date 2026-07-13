import { z } from 'zod'

// ===== Zod Schemas =====

export const HistoryEntrySchema = z.object({
  date: z.string(),
  text: z.string(),
})

export const RecommendationSchema = z.object({
  text: z.string(),
  priority: z.enum(['high', 'mid', 'low']),
})

export const DevStatusSchema = z.enum(['active', 'staging', 'paused'])

export const CategorySchema = z.enum([
  'ready',
  'dev',
  'ideas',
  'config',
  'legacy',
])

export const ProjectSchema = z.object({
  icon: z.string().default('📁'),
  name: z.string().min(1),
  path: z.string(),
  desc: z.string(),
  tags: z.array(z.string()).default([]),
  date: z.string(),
  website: z.string().optional(),
  category: CategorySchema,
  categoryLabel: z.string().default('Development'),
  status: DevStatusSchema.nullable().default(null),
  history: z.array(HistoryEntrySchema).nullable().default(null),
  plan: z.array(z.string()).nullable().default(null),
  recommendations: z.array(RecommendationSchema).nullable().default(null),
  repoName: z.string().nullable().default(null),
})

export const DevMetaSchema = z.record(
  z.string(),
  z.object({
    status: DevStatusSchema,
    history: z.array(HistoryEntrySchema).default([]),
    plan: z.array(z.string()).default([]),
    recommendations: z.array(RecommendationSchema).default([]),
  }),
)

export const ProjectsDataSchema = z.object({
  _meta: z.object({
    extracted: z.string(),
    source: z.string(),
    stats: z.record(z.string(), z.number()),
  }),
  projects: z.array(ProjectSchema),
  devMeta: DevMetaSchema.default({}),
})

// ===== Types from Zod (keeps TS types in sync) =====

export type Project = z.infer<typeof ProjectSchema>
export type DevMeta = z.infer<typeof DevMetaSchema>
export type ProjectsData = z.infer<typeof ProjectsDataSchema>
export type Category = z.infer<typeof CategorySchema>
export type DevStatus = z.infer<typeof DevStatusSchema>
export type Recommendation = z.infer<typeof RecommendationSchema>
export type HistoryEntry = z.infer<typeof HistoryEntrySchema>
