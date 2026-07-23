import { useMemo, useRef } from 'react';
import type * as THREE from 'three';
import { createTruckPaint, createGlass, createMetal, createRubber } from '../materials/PremiumMaterial';
import { useDeviceQuality } from '../hooks/useDeviceQuality';

export function TruckModel({ color = '#1B2A3F' }: { color?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const quality = useDeviceQuality();
  const segments = quality === 'high' ? 32 : 12;

  const cabinMat = useMemo(() => createTruckPaint(color), [color]);
  const chassisMat = useMemo(() => createMetal(), []);
  const glassMat = useMemo(() => createGlass(), []);
  const rubberMat = useMemo(() => createRubber(), []);
  const trimMat = useMemo(() => createTruckPaint('#C29A4A'), []);

  const wheelPositions: [number, number, number][] = [
    [-1.2, -0.3, -0.8],
    [-1.2, -0.3, 0.8],
    [1.2, -0.3, -0.8],
    [1.2, -0.3, 0.8],
  ];

  return (
    <group ref={groupRef} position={[0, 0.4, 0]}>
      {wheelPositions.map((pos, i) => (
        <mesh key={`wheel-${i}`} position={pos} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.2, segments]} />
          <primitive object={rubberMat} attach="material" />
        </mesh>
      ))}
      {wheelPositions.map((pos, i) => (
        <mesh key={`hub-${i}`} position={pos} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.21, 8]} />
          <primitive object={chassisMat} attach="material" />
        </mesh>
      ))}

      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[2.8, 0.15, 1.6]} />
        <primitive object={chassisMat} attach="material" />
      </mesh>

      <mesh position={[-0.7, 0.5, 0]} castShadow>
        <boxGeometry args={[0.8, 0.5, 1.4]} />
        <primitive object={cabinMat} attach="material" />
      </mesh>

      <mesh position={[-0.5, 0.7, 0]} castShadow>
        <boxGeometry args={[0.5, 0.25, 1.3]} />
        <primitive object={glassMat} attach="material" />
      </mesh>

      <mesh position={[0.5, 0.45, 0]} castShadow>
        <boxGeometry args={[1.8, 0.25, 1.5]} />
        <primitive object={cabinMat} attach="material" />
      </mesh>

      <mesh position={[0.3, 0.5, 0.75]} castShadow>
        <boxGeometry args={[0.3, 0.15, 0.05]} />
        <primitive object={trimMat} attach="material" />
      </mesh>
      <mesh position={[0.3, 0.5, -0.75]} castShadow>
        <boxGeometry args={[0.3, 0.15, 0.05]} />
        <primitive object={trimMat} attach="material" />
      </mesh>
    </group>
  );
}