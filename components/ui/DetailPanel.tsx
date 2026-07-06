'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Project } from '@/lib/types'

interface DetailPanelProps {
  project: Project | null
  onClose: () => void
}

export default function DetailPanel({ project, onClose }: DetailPanelProps) {
  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg border-l border-white/[0.06] bg-bg-zen/95 backdrop-blur-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-bg-zen/80 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{project.icon}</span>
                <h2 className="font-jp text-lg font-light tracking-wide text-bg-washi truncate">
                  {project.name}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 rounded-xl glass-strong text-stone-gray hover:text-bg-washi transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-stone-gray/60 mb-2">
                  Description
                </h3>
                <p className="text-sm font-mono text-stone-gray/90 leading-relaxed">
                  {project.desc}
                </p>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-[10px] font-mono uppercase tracking-widest text-stone-gray/60 mb-2">
                    Category
                  </h3>
                  <span
                    className={cn(
                      'inline-block px-3 py-1 rounded-xl text-xs font-mono',
                      project.category === 'ready' && 'bg-matcha/10 text-matcha-glow',
                      project.category === 'dev' && 'bg-white/[0.05] text-neon-tokyo',
                      project.category === 'ideas' && 'bg-white/[0.05] text-sakura',
                      project.category === 'config' && 'bg-white/[0.05] text-indigo-400',
                      project.category === 'legacy' && 'bg-white/[0.05] text-stone-gray/60',
                    )}
                  >
                    {project.categoryLabel || project.category}
                  </span>
                </div>
                {project.status && (
                  <div>
                    <h3 className="text-[10px] font-mono uppercase tracking-widest text-stone-gray/60 mb-2">
                      Status
                    </h3>
                    <span
                      className={cn(
                        'inline-block px-3 py-1 rounded-xl text-xs font-mono',
                        project.status === 'active' && 'bg-matcha/10 text-matcha-glow',
                        project.status === 'staging' && 'bg-amber-500/10 text-amber-400',
                        project.status === 'paused' && 'bg-white/[0.05] text-stone-gray',
                      )}
                    >
                      {project.status}
                    </span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {project.tags.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-mono uppercase tracking-widest text-stone-gray/60 mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-mono px-2 py-1 rounded-lg glass-strong text-stone-gray"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Date */}
              {project.date && (
                <div>
                  <h3 className="text-[10px] font-mono uppercase tracking-widest text-stone-gray/60 mb-2">
                    Date
                  </h3>
                  <p className="text-sm font-mono text-stone-gray/80">{project.date}</p>
                </div>
              )}

              {/* Links */}
              {(project.website || project.repoName) && (
                <div>
                  <h3 className="text-[10px] font-mono uppercase tracking-widest text-stone-gray/60 mb-2">
                    Links
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {project.website && (
                      <a
                        href={project.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-strong text-xs font-mono text-neon-tokyo hover:text-bg-washi transition-colors"
                      >
                        🌐 {new URL(project.website).hostname}
                      </a>
                    )}
                    {project.repoName && (
                      <a
                        href={`https://github.com/Niumination/${project.repoName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-strong text-xs font-mono text-stone-gray hover:text-bg-washi transition-colors"
                      >
                        ⎇ {project.repoName}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* History */}
              {project.history && project.history.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-mono uppercase tracking-widest text-stone-gray/60 mb-3">
                    History
                  </h3>
                  <div className="space-y-3">
                    {project.history.map((h, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-matcha-glow/60 mt-1.5" />
                          {i < project.history!.length - 1 && (
                            <div className="w-px flex-1 bg-white/[0.06] mt-1" />
                          )}
                        </div>
                        <div>
                          <p className="text-[10px] font-mono text-stone-gray/60">{h.date}</p>
                          <p className="text-xs font-mono text-stone-gray/80 mt-0.5">{h.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Plan */}
              {project.plan && project.plan.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-mono uppercase tracking-widest text-stone-gray/60 mb-2">
                    Plan
                  </h3>
                  <ul className="space-y-1.5">
                    {project.plan.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-mono text-stone-gray/80">
                        <span className="text-matcha-glow/60 mt-0.5">◇</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {project.recommendations && project.recommendations.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-mono uppercase tracking-widest text-stone-gray/60 mb-2">
                    Recommendations
                  </h3>
                  <div className="space-y-2">
                    {project.recommendations.map((r, i) => (
                      <div
                        key={i}
                        className={cn(
                          'px-3 py-2 rounded-xl text-xs font-mono flex items-start gap-2',
                          r.priority === 'high' && 'bg-matcha/10 text-matcha-glow',
                          r.priority === 'mid' && 'bg-amber-500/10 text-amber-400',
                          r.priority === 'low' && 'bg-white/[0.04] text-stone-gray',
                        )}
                      >
                        <span>
                          {r.priority === 'high' && '‼'}
                          {r.priority === 'mid' && '⚠'}
                          {r.priority === 'low' && '·'}
                        </span>
                        {r.text}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Path */}
              {project.path && (
                <div>
                  <h3 className="text-[10px] font-mono uppercase tracking-widest text-stone-gray/60 mb-2">
                    Path
                  </h3>
                  <p className="text-[11px] font-mono text-stone-gray/50 truncate">
                    {project.path}
                  </p>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
