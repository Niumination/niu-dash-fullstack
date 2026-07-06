"use client";

import { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import ZenParticles from "./ZenParticles";
import OrigamiGeometry from "./OrigamiGeometry";
import CursorLight from "./CursorLight";
import { useZenStore, trackPerformance } from "@/store/useZenStore";

function PerformanceTracker() {
  useFrame((_, delta) => {
    trackPerformance(delta);
  });
  return null;
}

function LightingRig() {
  return (
    <>
      <ambientLight color="#fff8e7" intensity={0.4} />
      <directionalLight
        color="#c7d2fe"
        intensity={0.3}
        position={[-5, 5, 5]}
      />
      <directionalLight
        color="#e8b4b8"
        intensity={0.15}
        position={[0, -5, 2]}
      />
      <CursorLight />
    </>
  );
}

export default function Scene() {
  const performanceMode = useZenStore((s) => s.performanceMode);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{
          position: [0, 0, 8],
          fov: 50,
          near: 0.1,
          far: 40,
        }}
        dpr={performanceMode === "minimal" ? [1, 1] : [1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference:
            performanceMode === "zen" ? "high-performance" : "low-power",
        }}
        style={{ width: "100%", height: "100%" }}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <LightingRig />
          <ZenParticles />
          <OrigamiGeometry />
          <PerformanceTracker />
          <fog attach="fog" args={["#09090b", 12, 22]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
