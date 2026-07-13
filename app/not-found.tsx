import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-6 font-jp font-light tracking-wider text-bg-washi/30">
          404
        </div>
        <h2 className="font-jp text-xl font-light tracking-wide text-bg-washi">
          見つかりません
        </h2>
        <p className="mt-3 text-sm font-mono text-stone-gray/80 leading-relaxed">
          This page doesn&apos;t exist — or it&apos;s waiting to be built.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-strong text-sm font-mono text-matcha-glow hover:bg-white/[0.08] transition-all"
        >
          ← Back Home
        </Link>
      </div>
    </div>
  )
}
