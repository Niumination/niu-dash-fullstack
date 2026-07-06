"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointLight } from "three";
import { useZenStore } from "@/store/useZenStore";

export default function CursorLight() {
  const lightRef = useRef<PointLight>(null);
  const { viewport } = useThree();
  const cursor = useZenStore((s) => s.cursor);

  useFrame((state) => {
    if (!lightRef.current) return;

    const targetX = cursor.x * (viewport.width / 2) * 0.8;
    const targetY = cursor.y * (viewport.height / 2) * 0.8;

    lightRef.current.position.x +=
      (targetX - lightRef.current.position.x) * 0.06;
    lightRef.current.position.y +=
      (targetY - lightRef.current.position.y) * 0.06;
    lightRef.current.position.z = 3 + Math.abs(cursor.x) * 2;

    lightRef.current.intensity =
      2.5 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
  });

  return (
    <pointLight
      ref={lightRef}
      color="#fff8e7"
      intensity={2.5}
      distance={18}
      decay={2}
      position={[0, 0, 4]}
    />
  );
}
