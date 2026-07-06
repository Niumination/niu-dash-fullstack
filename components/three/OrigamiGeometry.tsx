"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Edges } from "@react-three/drei";
import * as THREE from "three";
import { useZenStore } from "@/store/useZenStore";

interface OrigamiPieceProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  speed: number;
  phase: number;
}

function OrigamiPiece({
  position,
  rotation,
  scale,
  color,
  speed,
  phase,
}: OrigamiPieceProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x += delta * speed * 0.15;
    meshRef.current.rotation.y += delta * speed * 0.2;
    meshRef.current.position.y +=
      Math.sin(t * speed + phase) * delta * 0.05;
  });

  const geometry = useMemo(() => new THREE.TetrahedronGeometry(1, 0), []);

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation}
        scale={scale}
        geometry={geometry}
      >
        <meshStandardMaterial
          color={color}
          roughness={0.85}
          metalness={0.05}
          flatShading
          side={THREE.DoubleSide}
          transparent
          opacity={0.9}
        />
        <Edges
          scale={1.02}
          threshold={15}
          color={color}
          transparent
          opacity={0.2}
        />
      </mesh>
    </Float>
  );
}

export default function OrigamiGeometry() {
  const performanceMode = useZenStore((s) => s.performanceMode);

  const pieces = useMemo(() => {
    const count = performanceMode === "minimal" ? 5 : 12;
    const palette = [
      "#6b8c5e",
      "#8fb381",
      "#e8b4b8",
      "#7dd3fc",
      "#4a5d8f",
      "#a8a29e",
    ];
    const arr: OrigamiPieceProps[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6 - 2,
        ],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ],
        scale: [
          0.6 + Math.random() * 0.8,
          0.6 + Math.random() * 0.8,
          0.6 + Math.random() * 0.8,
        ],
        color: palette[i % palette.length],
        speed: 0.3 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, [performanceMode]);

  return (
    <group>
      {pieces.map((p, i) => (
        <OrigamiPiece key={i} {...p} />
      ))}
    </group>
  );
}
