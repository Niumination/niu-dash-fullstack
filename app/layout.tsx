import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const notoJp = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NIU⚡DASH // ZEN STUDIO",
  description:
    "Zen Studio — Project portfolio dashboard. Minimalist Japanese creativity meets high-fidelity web technology.",
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${notoJp.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-bg-zen text-bg-washi">
        {/* Atmospheric overlays */}
        <div className="washi-overlay" />
        <div className="vignette" />

        {/* Main content layer (z-10 above canvas) */}
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
