"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Zap, GitBranch, Box } from "lucide-react";
import FloatingCard, { StatTile } from "@/components/ui/FloatingCard";
import { useZenStore } from "@/store/useZenStore";
import { staggerContainer, fadeInUp } from "@/lib/motion";

interface HeaderProps {
  stats?: {
    totalProjects?: number;
    activeWIP?: number;
    ecosystemTools?: number;
    releasedCount?: number;
  };
}

export default function Header({ stats }: HeaderProps) {
  const sidebarOpen = useZenStore((s) => s.sidebarOpen);
  const [dateString, setDateString] = useState("");

  useEffect(() => {
    setDateString(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  const statItems = [
    {
      label: "Total Projects",
      value: String(stats?.totalProjects ?? 0),
      trend: "ecosystem",
      trendUp: true,
      icon: Box,
      glow: "tokyo" as const,
    },
    {
      label: "Active WIP",
      value: String(stats?.activeWIP ?? 0),
      trend: "in development",
      trendUp: true,
      icon: Activity,
      glow: "matcha" as const,
    },
    {
      label: "Ecosystem",
      value: String(stats?.ecosystemTools ?? 0),
      trend: "tools",
      trendUp: true,
      icon: GitBranch,
      glow: "indigo" as const,
    },
    {
      label: "Released",
      value: String(stats?.releasedCount ?? 0),
      trend: "shipped",
      trendUp: true,
      icon: Zap,
      glow: "sakura" as const,
    },
  ];

  return (
    <motion.header
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-30 pt-6"
      style={{
        marginLeft: sidebarOpen ? 220 : 80,
        transition: "margin-left 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div className="mx-6 mb-6">
        <div className="flex items-end justify-between">
          <div>
            <motion.h1
              variants={fadeInUp}
              className="font-jp text-3xl font-light tracking-wide text-bg-washi"
            >
              禅スタジオ
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mt-1 text-sm text-stone-gray"
            >
              Zen Studio — {dateString}
            </motion.p>
          </div>

          <motion.div
            variants={fadeInUp}
            className="hidden items-center gap-2 md:flex"
          >
            <div className="h-2 w-2 rounded-full bg-matcha-glow animate-pulse" />
            <span className="text-xs font-mono text-stone-gray uppercase tracking-widest">
              System Nominal
            </span>
          </motion.div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mx-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((s, i) => (
          <motion.div key={s.label} variants={fadeInUp}>
            <FloatingCard glowColor={s.glow} className="h-full">
              <StatTile
                label={s.label}
                value={s.value}
                trend={s.trend}
                trendUp={s.trendUp}
              />
            </FloatingCard>
          </motion.div>
        ))}
      </div>
    </motion.header>
  );
}
