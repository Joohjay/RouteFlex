import { useMemo } from 'react';
import { MeshBasicMaterial, MeshStandardMaterial, Color } from 'three';
import { createWarehouseWall, createMetal, createTruckPaint } from '../materials/PremiumMaterial';

export function WarehouseModel() {
  const wallMat = useMemo(() => createWarehouseWall(), []);
  const metalMat = useMemo(() => createMetal(), []);
  const dockMat = useMemo(() => createTruckPaint('#1A1A1E'), []);

  return (
    <group position={[0, 0, -3]}>
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 4, 0.15]} />
        <primitive object={wallMat} attach="material" />
      </mesh>

      <mesh position={[0, 2, 0.5]} castShadow>
        <boxGeometry args={[8, 0.3, 0.8]} />
        <primitive object={dockMat} attach="material" />
      </mesh>

      <mesh position={[-2.5, 0.8, 0.2]} castShadow>
        <boxGeometry args={[1.5, 1.5, 0.3]} />
        <primitive object={metalMat} attach="material" />
      </mesh>
      <mesh position={[2.5, 0.8, 0.2]} castShadow>
        <boxGeometry args={[1.5, 1.5, 0.3]} />
        <primitive object={metalMat} attach="material" />
      </mesh>

      {[-3.5, -1.5, 1.5, 3.5].map((x, i) => (
        <mesh key={`strip-${i}`} position={[x, 3.5, 0.1]} castShadow>
          <boxGeometry args={[0.3, 0.08, 0.05]} />
          <primitive object={metalMat} attach="material" />
        </mesh>
      ))}

      <group position={[0, 2.2, 0.3]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.8, 0.35]} />
          <primitive object={new MeshBasicMaterial({ color: '#C29A4A', transparent: true, opacity: 0.3 })} attach="material" />
        </mesh>
      </group>
    </group>
  );
}

export function WarehouseFloor() {
  const floorMat = useMemo(() => new MeshStandardMaterial({
    color: new Color('#1A1A1E'),
    metalness: 0.3,
    roughness: 0.8,
  }), []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[12, 10]} />
      <primitive object={floorMat} attach="material" />
    </mesh>
  );
}