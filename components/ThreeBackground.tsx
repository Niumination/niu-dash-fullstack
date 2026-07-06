'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Vector3,
  Points as ThreePoints,
  LineSegments,
} from 'three'

const PARTICLE_COUNT = 80
const CONNECTION_DIST = 2.2
const FLOAT_SPEED = 0.15

interface ParticleData {
  position: Vector3
  velocity: Vector3
  phase: number
}

function Particles() {
  const meshRef = useRef<ThreePoints>(null!)
  const particles = useMemo(() => {
    const arr: ParticleData[] = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr.push({
        position: new Vector3(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6,
        ),
        velocity: new Vector3(
          (Math.random() - 0.5) * FLOAT_SPEED,
          (Math.random() - 0.5) * FLOAT_SPEED,
          (Math.random() - 0.5) * FLOAT_SPEED,
        ),
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  const positions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), [])

  useEffect(() => {
    particles.forEach((p, i) => {
      positions[i * 3] = p.position.x
      positions[i * 3 + 1] = p.position.y
      positions[i * 3 + 2] = p.position.z
    })
  }, [particles, positions])

  useFrame((_, delta) => {
    const time = performance.now() * 0.001
    particles.forEach((p, i) => {
      p.position.x += Math.sin(time * 0.3 + p.phase) * delta * 0.3
      p.position.y += Math.cos(time * 0.2 + p.phase) * delta * 0.3
      p.position.z += Math.sin(time * 0.15 + p.phase * 0.5) * delta * 0.2

      const bound = 6
      if (Math.abs(p.position.x) > bound) p.velocity.x *= -1
      if (Math.abs(p.position.y) > bound) p.velocity.y *= -1
      if (Math.abs(p.position.z) > bound) p.velocity.z *= -1

      positions[i * 3] = p.position.x
      positions[i * 3 + 1] = p.position.y
      positions[i * 3 + 2] = p.position.z
    })
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#00fff2"
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={2}
      />
    </points>
  )
}

function Connections() {
  const lineRef = useRef<LineSegments>(null!)

  const maxPairs = 80
  const maxVerts = maxPairs * 6
  const linePositions = useMemo(() => new Float32Array(maxVerts), [])

  useFrame(() => {
    const lines = lineRef.current
    if (!lines) return

    // Find particle positions from the scene
    const pointsObj = lines.parent?.getObjectById(
      // The Points object should be the first child of ParticleScene
      lines.parent?.children.find((c) => c.type === 'Points')?.id ?? 0,
    ) as ThreePoints | undefined
    if (!pointsObj) return

    const attr = pointsObj.geometry.getAttribute('position')
    if (!attr) return

    const arr = attr.array as Float32Array
    const verts: number[] = []
    let count = 0

    for (let i = 0; i < PARTICLE_COUNT && count < maxPairs; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT && count < maxPairs; j++) {
        const dx = arr[i * 3] - arr[j * 3]
        const dy = arr[i * 3 + 1] - arr[j * 3 + 1]
        const dz = arr[i * 3 + 2] - arr[j * 3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist < CONNECTION_DIST) {
          verts.push(
            arr[i * 3], arr[i * 3 + 1], arr[i * 3 + 2],
            arr[j * 3], arr[j * 3 + 1], arr[j * 3 + 2],
          )
          count++
        }
      }
    }

    for (let k = 0; k < maxVerts; k++) {
      linePositions[k] = verts[k] ?? 0
    }
    lines.geometry.attributes.position.needsUpdate = true
  })

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[linePositions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#00fff2"
        transparent
        opacity={0.12}
        depthWrite={false}
      />
    </lineSegments>
  )
}

function ParticleScene() {
  return (
    <>
      <Particles />
      <Connections />
      <ambientLight intensity={0.2} />
    </>
  )
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'low-power',
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <ParticleScene />
      </Canvas>
    </div>
  )
}
