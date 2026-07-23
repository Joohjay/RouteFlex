import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CanvasProvider } from '../CanvasProvider';
import { DimLighting } from '../Lighting';
import { useReducedMotion } from '@/animations/hooks';

function LoadingLogo() {
  const groupRef = useRef<THREE.Group>(null);
  const barRef = useRef<THREE.Mesh>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 0.08;
        return next >= 1 ? 1 : next;
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group>
      <group ref={groupRef} position={[0, 0.5, 0]}>
        <mesh position={[-0.6, 0, 0]}>
          <boxGeometry args={[0.35, 0.25, 0.3]} />
          <meshPhysicalMaterial color="#C29A4A" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0.6, 0, 0]}>
          <boxGeometry args={[0.5, 0.35, 0.4]} />
          <meshPhysicalMaterial color="#C29A4A" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.6, 0.6, 0.5]} />
          <meshPhysicalMaterial color="#C29A4A" metalness={0.5} roughness={0.4} transparent opacity={0.3} />
        </mesh>
      </group>

      <mesh ref={barRef} position={[-0.8, -0.6, 0]}>
        <boxGeometry args={[1.6 * progress, 0.04, 0.02]} />
        <meshPhysicalMaterial color="#C29A4A" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[-0.8, -0.6, 0]}>
        <boxGeometry args={[1.6, 0.02, 0.01]} />
        <meshPhysicalMaterial color="#C29A4A" transparent opacity={0.2} metalness={0} roughness={1} />
      </mesh>
    </group>
  );
}

function LoadingContent() {
  return (
    <>
      <DimLighting />
      <LoadingLogo />
    </>
  );
}

export function LoadingSequence({ onComplete }: { onComplete?: () => void }) {
  const prefersReducedMotion = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      onComplete?.();
      return;
    }
    const timer = setTimeout(() => {
      setDone(true);
      onComplete?.();
    }, 1500);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion, onComplete]);

  if (done) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-[#0F1F2E]">
      {!prefersReducedMotion && (
        <CanvasProvider className="h-full w-full" camera={{ position: [0, 1, 4], fov: 40, near: 0.1, far: 10 }} dpr={[1, 1]}>
          <LoadingContent />
        </CanvasProvider>
      )}
    </div>
  );
}