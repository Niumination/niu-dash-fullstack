"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Scene from "@/components/three/Scene";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useZenStore, updateCursorThrottled } from "@/store/useZenStore";
import { pageTransition, easeZen } from "@/lib/motion";

interface DashboardLayoutProps {
  children: React.ReactNode;
  stats?: {
    totalProjects?: number;
    activeWIP?: number;
    ecosystemTools?: number;
    releasedCount?: number;
  };
}

export default function DashboardLayout({
  children,
  stats,
}: DashboardLayoutProps) {
  const sidebarOpen = useZenStore((s) => s.sidebarOpen);
  const activeRoute = useZenStore((s) => s.activeRoute);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      updateCursorThrottled(e, window.innerWidth, window.innerHeight);
    }
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* 3D Atmosphere Layer */}
      <Scene />

      {/* DOM Overlay Layer */}
      <div className="relative z-10">
        <Sidebar />

        <main
          className="transition-[margin] duration-500"
          style={{
            marginLeft: sidebarOpen ? 220 : 80,
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <Header stats={stats} />

          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRoute}
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                className="min-h-[60vh]"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
