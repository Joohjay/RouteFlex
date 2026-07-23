import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CanvasProvider } from '../CanvasProvider';
import { SceneLighting } from '../Lighting';
import { TruckModel } from '../models/createTruck';
import { useReducedMotion } from '@/animations/hooks';

function ParticleField({ count = 30 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={meshRef} position={[0, 1, -2]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#C29A4A"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
}

function HeroTruck() {
  const groupRef = useRef<THREE.Group>(null);
  const wheelSpin = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    wheelSpin.current += delta * 0.5;
    groupRef.current.children.forEach((child) => {
      if (child.name === 'wheel') {
        child.rotation.x = wheelSpin.current;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      <TruckModel />
    </group>
  );
}

function HeroSceneContent() {
  return (
    <>
      <SceneLighting />
      <HeroTruck />
      <ParticleField count={40} />
    </>
  );
}

export function ThreeHero({ className }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <div className={className}>
      <CanvasProvider
        camera={{ position: [0, 1.5, 5], fov: 40, near: 0.1, far: 20 }}
        dpr={[1, 1]}
        gl={{ antialias: true, alpha: true, toneMapping: 0 }}
      >
        <HeroSceneContent />
      </CanvasProvider>
    </div>
  );
}