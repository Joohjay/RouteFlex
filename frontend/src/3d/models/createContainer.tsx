import { useMemo, useRef, forwardRef, useImperativeHandle } from 'react';
import type * as THREE from 'three';
import { createContainerMaterial, createMetal } from '../materials/PremiumMaterial';

export interface ContainerHandle {
  leftDoor: THREE.Group | null;
  rightDoor: THREE.Group | null;
}

export const ContainerModel = forwardRef<ContainerHandle, { color?: string; open?: boolean }>(
  function ContainerModel(_props, ref) {
  const bodyMat = useMemo(() => createContainerMaterial('#C29A4A'), []);
  const doorMat = useMemo(() => createContainerMaterial('#B8863A'), []);
  const metalMat = useMemo(() => createMetal(), []);
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);

  useImperativeHandle(ref, () => ({
    leftDoor: leftDoorRef.current,
    rightDoor: rightDoorRef.current,
  }));

  return (
    <group position={[0, 0.6, 0]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2.0, 1.0, 1.4]} />
        <primitive object={bodyMat} attach="material" />
      </mesh>

      <mesh position={[0, 0.3, -0.71]} castShadow>
        <boxGeometry args={[1.8, 0.02, 0.02]} />
        <primitive object={metalMat} attach="material" />
      </mesh>
      <mesh position={[0, 0.7, -0.71]} castShadow>
        <boxGeometry args={[1.8, 0.02, 0.02]} />
        <primitive object={metalMat} attach="material" />
      </mesh>
      <mesh position={[0.9, 0.5, -0.71]} castShadow>
        <boxGeometry args={[0.02, 0.9, 0.02]} />
        <primitive object={metalMat} attach="material" />
      </mesh>
      <mesh position={[-0.9, 0.5, -0.71]} castShadow>
        <boxGeometry args={[0.02, 0.9, 0.02]} />
        <primitive object={metalMat} attach="material" />
      </mesh>

      <mesh position={[0, 0.5, 0.71]} castShadow>
        <boxGeometry args={[1.95, 0.95, 0.03]} />
        <primitive object={doorMat} attach="material" />
      </mesh>

      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[2.0, 0.05, 1.4]} />
        <primitive object={metalMat} attach="material" />
      </mesh>

      <mesh position={[1.01, 0.5, 0]} castShadow>
        <boxGeometry args={[0.03, 0.9, 1.35]} />
        <primitive object={metalMat} attach="material" />
      </mesh>
      <mesh position={[-1.01, 0.5, 0]} castShadow>
        <boxGeometry args={[0.03, 0.9, 1.35]} />
        <primitive object={metalMat} attach="material" />
      </mesh>

      <mesh position={[0, 1.01, 0]} castShadow>
        <boxGeometry args={[1.95, 0.03, 1.35]} />
        <primitive object={metalMat} attach="material" />
      </mesh>

      <group ref={leftDoorRef} position={[-0.6, 0.5, -0.1]} rotation={[0, 0, 0]}>
        <mesh position={[0, 0, 0.8]}>
          <boxGeometry args={[0.02, 0.85, 0.7]} />
          <primitive object={doorMat} attach="material" />
        </mesh>
      </group>
      <group ref={rightDoorRef} position={[0.6, 0.5, -0.1]} rotation={[0, 0, 0]}>
        <mesh position={[0, 0, 0.8]}>
          <boxGeometry args={[0.02, 0.85, 0.7]} />
          <primitive object={doorMat} attach="material" />
        </mesh>
      </group>
    </group>
  );
});