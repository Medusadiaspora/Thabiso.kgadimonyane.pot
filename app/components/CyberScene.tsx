"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function FloatingShape({
  position,
  color,
  shape,
}: {
  position: [number, number, number];
  color: string;
  shape: "box" | "torus" | "icosa";
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    if (shape === "box") return new THREE.BoxGeometry(1.5, 1.5, 1.5);
    if (shape === "torus") return new THREE.TorusKnotGeometry(0.7, 0.25, 64, 8);
    return new THREE.IcosahedronGeometry(1, 1);
  }, [shape]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position} geometry={geometry}>
        <MeshDistortMaterial
          color={color}
          roughness={0.2}
          metalness={0.9}
          distort={0.3}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

export default function CyberScene() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f3ff" />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#ff00ff" />
        <pointLight position={[0, 5, -10]} intensity={0.5} color="#ffffff" />

        <FloatingShape position={[-5, 2, -8]} color="#00f3ff" shape="icosa" />
        <FloatingShape position={[5, -1, -6]} color="#ff00ff" shape="torus" />
        <FloatingShape position={[0, 4, -10]} color="#ffffff" shape="box" />
        <FloatingShape position={[-3, -3, -5]} color="#00f3ff" shape="torus" />
        <FloatingShape position={[4, 3, -7]} color="#ff00ff" shape="icosa" />
      </Canvas>
    </div>
  );
}
