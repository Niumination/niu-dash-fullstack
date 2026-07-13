"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import DetailPanel from "@/components/ui/DetailPanel";
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
  const selectedProject = useZenStore((s) => s.selectedProject);
  const setSelectedProject = useZenStore((s) => s.setSelectedProject);

  // Track header height to prevent sticky overlap
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (!headerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeaderHeight(entry.contentRect.height);
      }
    });
    observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      updateCursorThrottled(e, window.innerWidth, window.innerHeight);
    }
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  const contentPaddingTop = headerHeight > 0 ? headerHeight + 16 : 0;

  return (
    <div className="relative min-h-screen">
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
          {/* Header wrapper — measured via ResizeObserver */}
          <div ref={headerRef}>
            <Header stats={stats} />
          </div>

          {/* Content area — padded so sticky header doesn't overlap */}
          <div
            className="p-6"
            style={{ paddingTop: contentPaddingTop > 0 ? `${contentPaddingTop}px` : undefined, minHeight: '100vh' }}
          >
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

        {/* Detail Panel — rendered OUTSIDE main content area
            to avoid stacking-context isolation from motion.div's filter/blur */}
        <DetailPanel
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </div>
  );
}
