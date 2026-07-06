"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Layers,
  TreePine,
  CheckCircle2,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useZenStore } from "@/store/useZenStore";
import { cn } from "@/lib/utils";
import { easeZen } from "@/lib/motion";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, jp: "ダッシュボード" },
  { id: "projects", label: "Projects", icon: Layers, jp: "プロジェクト" },
  { id: "ecosystem", label: "Ecosystem", icon: TreePine, jp: "生態系" },
  { id: "released", label: "Released", icon: CheckCircle2, jp: "リリース" },
  { id: "settings", label: "Settings", icon: Settings, jp: "設定" },
];

export default function Sidebar() {
  const sidebarOpen = useZenStore((s) => s.sidebarOpen);
  const toggleSidebar = useZenStore((s) => s.toggleSidebar);
  const activeRoute = useZenStore((s) => s.activeRoute);
  const setActiveRoute = useZenStore((s) => s.setActiveRoute);

  return (
    <motion.aside
      initial={false}
      animate={{
        width: sidebarOpen ? 220 : 80,
        transition: { duration: 0.5, ease: easeZen },
      }}
      className={cn(
        "fixed left-0 top-0 z-40 h-screen flex flex-col border-r border-white/[0.04]",
        "glass-strong"
      )}
    >
      {/* Logo area */}
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-matcha/20 text-matcha-glow ring-1 ring-matcha/20">
          <span className="font-jp text-lg font-bold leading-none">zen</span>
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <span className="text-sm font-semibold tracking-wide text-bg-washi">
                NIU DASH
              </span>
              <span className="text-[10px] font-light tracking-widest text-stone-gray uppercase">
                Zen Studio
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeRoute === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveRoute(item.id)}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-colors",
                "hover:bg-white/[0.04]",
                isActive && "bg-white/[0.06] ring-1 ring-white/[0.06]"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-full bg-matcha-glow"
                  transition={{ duration: 0.4, ease: easeZen }}
                />
              )}

              <Icon
                size={20}
                className={cn(
                  "shrink-0 transition-colors",
                  isActive ? "text-matcha-glow" : "text-stone-gray group-hover:text-bg-washi"
                )}
              />

              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.25, ease: easeZen }}
                    className="flex flex-col items-start overflow-hidden"
                  >
                    <span
                      className={cn(
                        "text-sm font-medium transition-colors",
                        isActive ? "text-bg-washi" : "text-stone-gray group-hover:text-bg-washi"
                      )}
                    >
                      {item.label}
                    </span>
                    <span className="text-[10px] font-light tracking-widest text-white/20">
                      {item.jp}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* Toggle button */}
      <div className="border-t border-white/[0.04] p-3">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center rounded-xl py-2 text-stone-gray transition-colors hover:bg-white/[0.04] hover:text-bg-washi"
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
    </motion.aside>
  );
}
