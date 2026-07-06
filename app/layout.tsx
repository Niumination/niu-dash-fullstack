import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Orbitron } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'
import ThreeBackground from '@/components/ThreeBackground'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
})

const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'NIU⚡DASH // DARK NEXUS',
  description:
    'Dark Nexus — Project portfolio dashboard. Live GitHub stats, ecosystem tracking, real-time monitoring.',
}

export const viewport: Viewport = {
  themeColor: '#050508',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${orbitron.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider>
          <ThreeBackground />
          <div className="grid-overlay" />
          <div className="scanlines" />
          <div className="glitch-overlay" />
          <div className="relative z-10 min-h-screen">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
