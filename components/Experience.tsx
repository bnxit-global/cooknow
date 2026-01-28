'use client'

import {
  ContactShadows,
  Environment,
  Float,
  PerspectiveCamera,
} from '@react-three/drei'
import { Canvas, useFrame, type RootState } from '@react-three/fiber'
import { useRef, type ComponentType } from 'react'
import * as THREE from 'three'

type GeometryComponent = ComponentType<{ args?: number[] }>

function FloatingElement({
  position,
  color,
  speed,
  geometry: Geometry,
}: {
  position: [number, number, number]
  color: string
  speed: number
  geometry: GeometryComponent
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state: RootState) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.x = Math.sin(t * speed) * 0.2
    meshRef.current.rotation.y += speed * 0.02
    meshRef.current.position.y = position[1] + Math.sin(t * speed * 0.5) * 0.5
  })

  return (
    <mesh ref={meshRef} position={position}>
      <Geometry args={[1, 0, 0]} />
      <meshStandardMaterial
        color={color}
        roughness={0.1}
        metalness={0.8}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}

function SceneLighting() {
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame((state: RootState) => {
    if (!lightRef.current) return
    const { mouse, viewport } = state
    const x = (mouse.x * viewport.width) / 2
    const y = (mouse.y * viewport.height) / 2
    lightRef.current.position.set(x, y, 5)
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight ref={lightRef} intensity={5} distance={10} color="#4F46E5" />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={2}
        color="#fff"
      />
    </>
  )
}

export default function Experience() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />

        <color attach="background" args={['#050505']} />

        <fog attach="fog" args={['#050505', 10, 25]} />

        <group>
          <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <FloatingElement
              position={[-4, 2, -5]}
              color="#4F46E5"
              speed={0.5}
              geometry={THREE.IcosahedronGeometry}
            />
            <FloatingElement
              position={[5, -1, -8]}
              color="#ffffff"
              speed={0.3}
              geometry={THREE.TorusKnotGeometry}
            />
            <FloatingElement
              position={[-3, -4, -4]}
              color="#6366f1"
              speed={0.4}
              geometry={THREE.OctahedronGeometry}
            />
          </Float>
        </group>

        <SceneLighting />
        <Environment preset="city" />
        <ContactShadows
          position={[0, -9, 0]}
          opacity={0.4}
          scale={40}
          blur={2.5}
          far={9}
        />
      </Canvas>
    </div>
  )
}
