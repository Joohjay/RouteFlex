import { useMemo } from 'react';
import { createTruckPaint, createMetal, createRubber } from '../materials/PremiumMaterial';
import { useDeviceQuality } from '../hooks/useDeviceQuality';

export function TrailerModel({ color = '#C29A4A' }: { color?: string }) {
  const quality = useDeviceQuality();
  const segments = quality === 'high' ? 24 : 12;

  const bodyMat = useMemo(() => createTruckPaint('#163A5F'), []);
  const accentMat = useMemo(() => createTruckPaint(color), [color]);
  const chassisMat = useMemo(() => createMetal(), []);
  const rubberMat = useMemo(() => createRubber(), []);

  const wheelPositions: [number, number, number][] = [
    [1.8, -0.3, -0.8],
    [1.8, -0.3, 0.8],
    [-1.8, -0.3, -0.8],
    [-1.8, -0.3, 0.8],
  ];

  return (
    <group position={[0, 0.4, 0]}>
      {wheelPositions.map((pos, i) => (
        <mesh key={`tw-${i}`} position={pos} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.18, segments]} />
          <primitive object={rubberMat} attach="material" />
        </mesh>
      ))}
      {wheelPositions.map((pos, i) => (
        <mesh key={`th-${i}`} position={pos} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.19, 8]} />
          <primitive object={chassisMat} attach="material" />
        </mesh>
      ))}

      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[4.2, 0.12, 1.6]} />
        <primitive object={chassisMat} attach="material" />
      </mesh>

      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[4, 0.8, 1.5]} />
        <primitive object={bodyMat} attach="material" />
      </mesh>

      <mesh position={[-2.1, 0.65, 0]}>
        <boxGeometry args={[0.05, 0.7, 1.4]} />
        <primitive object={accentMat} attach="material" />
      </mesh>
    </group>
  );
}