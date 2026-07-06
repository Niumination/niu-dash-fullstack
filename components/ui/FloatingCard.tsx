"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { easeSpring } from "@/lib/motion";

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "matcha" | "sakura" | "indigo" | "tokyo";
  enableTilt?: boolean;
  spotlight?: boolean;
}

const glowMap = {
  matcha: "hover:shadow-[0_0_40px_rgba(143,179,129,0.15)]",
  sakura: "hover:shadow-[0_0_40px_rgba(232,180,184,0.15)]",
  indigo: "hover:shadow-[0_0_40px_rgba(74,93,143,0.15)]",
  tokyo: "hover:shadow-[0_0_40px_rgba(125,211,252,0.15)]",
};

export default function FloatingCard({
  children,
  className,
  glowColor = "matcha",
  enableTilt = true,
  spotlight = true,
}: FloatingCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.2 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rotateX = useTransform(
    ySpring,
    [-0.5, 0.5],
    enableTilt ? [8, -8] : [0, 0]
  );
  const rotateY = useTransform(
    xSpring,
    [-0.5, 0.5],
    enableTilt ? [-8, 8] : [0, 0]
  );

  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);
  const spotlightOpacity = useMotionValue(0);

  const spotlightBg = useMotionTemplate`
    radial-gradient(
      600px circle at ${spotlightX}px ${spotlightY}px,
      rgba(255,255,255,0.06),
      transparent 40%
    )
  `;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const normalizedX = mouseX / w - 0.5;
    const normalizedY = mouseY / h - 0.5;

    x.set(normalizedX);
    y.set(normalizedY);

    if (spotlight) {
      spotlightX.set(mouseX);
      spotlightY.set(mouseY);
      spotlightOpacity.set(1);
    }
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    if (spotlight) spotlightOpacity.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.4, ease: easeSpring }}
      className={cn(
        "relative overflow-hidden rounded-2xl glass-card transition-shadow duration-500",
        glowMap[glowColor],
        className
      )}
    >
      {spotlight && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background: spotlightBg,
            opacity: spotlightOpacity,
          }}
        />
      )}
      <div className="pointer-events-none absolute inset-0 z-0 rounded-2xl border border-white/[0.06]" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

/* Reusable stat tile inside FloatingCard */
export function StatTile({
  label,
  value,
  trend,
  trendUp,
}: {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 p-5">
      <span className="text-xs font-medium tracking-widest uppercase text-stone-gray">
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-bg-washi">{value}</span>
        {trend && (
          <span
            className={cn(
              "text-xs font-mono",
              trendUp ? "text-matcha-glow" : "text-sakura-dim"
            )}
          >
            {trendUp ? "+" : ""}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
