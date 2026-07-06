"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useZenStore } from "@/store/useZenStore";

const MAX_PARTICLES = 120;
const MOBILE_PARTICLES = 60;

interface ParticleData {
  positions: Float32Array;
  velocities: Float32Array;
  phases: Float32Array;
  colors: Float32Array;
}

function createParticleData(count: number): ParticleData {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const phases = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const palette = [
    new THREE.Color("#6b8c5e"), // matcha
    new THREE.Color("#8fb381"), // matcha glow
    new THREE.Color("#e8b4b8"), // sakura
    new THREE.Color("#7dd3fc"), // neon tokyo
    new THREE.Color("#a8a29e"), // stone
  ];

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 2 + Math.random() * 10;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;

    velocities[i * 3] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;

    phases[i * 3] = Math.random() * Math.PI * 2;
    phases[i * 3 + 1] = Math.random() * 0.5 + 0.5;
    phases[i * 3 + 2] = Math.random() * 0.5 + 0.5;

    const col = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }

  return { positions, velocities, phases, colors };
}

export default function ZenParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const performanceMode = useZenStore((s) => s.performanceMode);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const count =
    isMobile || performanceMode === "minimal"
      ? MOBILE_PARTICLES
      : MAX_PARTICLES;

  const data = useMemo(() => createParticleData(count), [count]);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    timeRef.current += delta * 0.3;
    const t = timeRef.current;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      const freq = data.phases[i * 3 + 1];
      const amp = data.phases[i * 3 + 2];

      arr[ix] +=
        Math.sin(t * freq + data.phases[i * 3]) * amp * delta * 0.5 +
        data.velocities[ix] * delta;
      arr[iy] +=
        Math.cos(t * freq * 0.7 + data.phases[i * 3]) * amp * delta * 0.3 +
        data.velocities[iy] * delta;
      arr[iz] +=
        Math.sin(t * freq * 0.5 + data.phases[i * 3]) * amp * delta * 0.2 +
        data.velocities[iz] * delta;

      if (Math.abs(arr[ix]) > 14) arr[ix] *= -0.9;
      if (Math.abs(arr[iy]) > 6) arr[iy] *= -0.9;
      if (Math.abs(arr[iz]) > 5) arr[iz] *= -0.9;
    }

    posAttr.needsUpdate = true;

    pointsRef.current.rotation.y = Math.sin(t * 0.1) * 0.05;
  });

  return (
    <Points
      ref={pointsRef}
      positions={data.positions}
      colors={data.colors}
    >
      <PointMaterial
        transparent
        vertexColors
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.8}
      />
    </Points>
  );
}
