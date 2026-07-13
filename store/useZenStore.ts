import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { Project } from "@/lib/types";

export type PerformanceMode = "zen" | "balanced" | "minimal";
export type ThemeMode = "zen-night" | "zen-dawn";

interface CursorState {
  x: number; // normalized -1 to 1
  y: number; // normalized -1 to 1
  rawX: number; // pixels
  rawY: number; // pixels
}

interface ZenStore {
  // Cursor / Interaction
  cursor: CursorState;
  setCursor: (x: number, y: number, rawX: number, rawY: number) => void;

  // Performance
  performanceMode: PerformanceMode;
  setPerformanceMode: (mode: PerformanceMode) => void;
  frameTime: number;
  setFrameTime: (ms: number) => void;

  // Theme
  theme: ThemeMode;
  toggleTheme: () => void;

  // Navigation / UI
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  activeRoute: string;
  setActiveRoute: (route: string) => void;

  // Detail Panel
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
}

export const useZenStore = create<ZenStore>()(
  subscribeWithSelector((set) => ({
    cursor: { x: 0, y: 0, rawX: 0, rawY: 0 },
    setCursor: (x, y, rawX, rawY) =>
      set({ cursor: { x, y, rawX, rawY } }),

    performanceMode: "zen",
    setPerformanceMode: (mode) => set({ performanceMode: mode }),
    frameTime: 16,
    setFrameTime: (ms) => set({ frameTime: ms }),

    theme: "zen-night",
    toggleTheme: () =>
      set((s) => ({
        theme: s.theme === "zen-night" ? "zen-dawn" : "zen-night",
      })),

    sidebarOpen: true,
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    activeRoute: "dashboard",
    setActiveRoute: (route) => set({ activeRoute: route }),

    // Detail Panel
    selectedProject: null,
    setSelectedProject: (project) => set({ selectedProject: project }),
  }))
);

// Throttled cursor updater for use in mousemove listeners
let lastCursorUpdate = 0;
export function updateCursorThrottled(
  e: { clientX: number; clientY: number },
  width: number,
  height: number
) {
  const now = performance.now();
  if (now - lastCursorUpdate < 16) return; // cap at ~60fps
  lastCursorUpdate = now;

  useZenStore.getState().setCursor(
    (e.clientX / width) * 2 - 1,
    -(e.clientY / height) * 2 + 1,
    e.clientX,
    e.clientY
  );
}

// Auto-detect performance degradation
let slowFrameCount = 0;
export function trackPerformance(delta: number) {
  const ms = delta * 1000;
  useZenStore.getState().setFrameTime(ms);

  if (ms > 22) {
    slowFrameCount++;
    if (slowFrameCount > 120) {
      const current = useZenStore.getState().performanceMode;
      if (current === "zen") useZenStore.getState().setPerformanceMode("balanced");
      else if (current === "balanced") useZenStore.getState().setPerformanceMode("minimal");
      slowFrameCount = 0;
    }
  } else {
    slowFrameCount = Math.max(0, slowFrameCount - 1);
  }
}
