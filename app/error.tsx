'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[dashboard]', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="text-5xl mb-6 opacity-40">◆</div>
        <h2 className="font-jp text-2xl font-light tracking-wide text-bg-washi">
          エラー
        </h2>
        <p className="mt-3 text-sm font-mono text-stone-gray/80 leading-relaxed">
          Something went wrong loading the dashboard. This is usually a
          transient issue — try again.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <p className="mt-4 text-xs font-mono text-sakura-dim/60 select-all">
            {error.message}
          </p>
        )}
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-strong text-sm font-mono text-matcha-glow hover:bg-white/[0.08] transition-all"
        >
          ⟳ Try Again
        </button>
      </div>
    </div>
  )
}
