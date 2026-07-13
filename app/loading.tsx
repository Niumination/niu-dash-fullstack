// Loading skeleton for dashboard — matches glassmorphic design
export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <section className="relative px-6 pt-4 pb-8">
        <div className="max-w-4xl">
          <div className="h-10 w-48 rounded-xl bg-white/[0.04] animate-pulse" />
          <div className="mt-3 h-4 w-96 rounded-lg bg-white/[0.03] animate-pulse" />
          <div className="mt-6 flex items-center gap-4">
            <div className="h-8 w-20 rounded-xl bg-white/[0.04] animate-pulse" />
            <div className="h-8 w-28 rounded-xl bg-white/[0.03] animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats grid skeleton */}
      <section className="px-6 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl glass-card p-5 animate-pulse"
            >
              <div className="h-3 w-20 rounded-lg bg-white/[0.04]" />
              <div className="mt-3 h-8 w-16 rounded-lg bg-white/[0.05]" />
            </div>
          ))}
        </div>
      </section>

      {/* Category pills skeleton */}
      <section className="px-6 pb-8">
        <div className="h-3 w-24 rounded-lg bg-white/[0.03] animate-pulse mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-2xl glass-card p-4 animate-pulse">
              <div className="h-3 w-16 rounded-lg bg-white/[0.04]" />
              <div className="mt-2 h-6 w-8 rounded-lg bg-white/[0.05]" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
