import { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { CanvasProvider } from '../CanvasProvider';
import { SceneLighting } from '../Lighting';
import { CameraController } from '../CameraController';
import { TruckModel } from '../models/createTruck';
import { TrailerModel } from '../models/createTrailer';
import { ContainerModel } from '../models/createContainer';
import { WarehouseModel, WarehouseFloor } from '../models/createWarehouse';
import { gsap } from '@/animations/hooks/useGSAP';
import { useReducedMotion } from '@/animations/hooks';

export interface LoginSceneHandle {
  playExit: () => Promise<void>;
}

interface LoginSceneProps {
  children: React.ReactNode;
  onComplete?: () => void;
}

function Login3DContent({ onReady }: { onReady: () => void }) {
  const truckRef = useRef<THREE.Group>(null);
  const trailerRef = useRef<THREE.Group>(null);
  const containerRef = useRef<THREE.Group>(null);
  const warehouseRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!truckRef.current || !trailerRef.current || !containerRef.current) return;

    const group = new THREE.Group();
    group.add(truckRef.current);
    group.add(trailerRef.current);
    group.add(containerRef.current);

    group.position.set(-6, 0, 0);

    const tl = gsap.timeline({
      onComplete: onReady,
      defaults: { ease: 'power3.out' },
    });

    tl.to(group.position, {
      x: 0,
      duration: 2.5,
      ease: 'power2.out',
    });

    tl.to({}, { duration: 0.4 });

    tl.to(containerRef.current!.position, {
      z: -1.8,
      duration: 1.2,
      ease: 'power3.out',
    });

    tl.to(containerRef.current!.rotation, {
      y: Math.PI,
      duration: 0.8,
      ease: 'power2.out',
    }, '-=1.0');

    tl.to(containerRef.current!.position, {
      x: 2.5,
      duration: 1.0,
      ease: 'power2.out',
    });

    tl.set(containerRef.current!, { visible: false });

    return () => { tl.kill(); };
  }, [onReady]);

  return (
    <>
      <CameraController target={[0, 1.5, 0]} offset={[0, 2.5, 7]} lerpSpeed={0.03} />
      <SceneLighting />
      <WarehouseFloor />
      <group ref={warehouseRef}>
        <WarehouseModel />
      </group>
      <group ref={truckRef} position={[-1.5, 0, 0]}>
        <TruckModel />
      </group>
      <group ref={trailerRef} position={[1.5, 0, 0]}>
        <TrailerModel />
      </group>
      <group ref={containerRef} position={[2.5, 0, 0]}>
        <ContainerModel open />
      </group>
    </>
  );
}

export const LoginScene = forwardRef<LoginSceneHandle, LoginSceneProps>(
  function LoginScene({ children, onComplete }, ref) {
  const prefersReducedMotion = useReducedMotion();
  const [sceneReady, setSceneReady] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [exiting, setExiting] = useState(false);
  const resolveRef = useRef<(() => void) | null>(null);

  const handleSceneReady = useCallback(() => {
    setSceneReady(true);
    setTimeout(() => setShowPanel(true), 300);
    onComplete?.();
  }, [onComplete]);

  const playExit = useCallback(() => {
    return new Promise<void>((resolve) => {
      resolveRef.current = resolve;
      setShowPanel(false);
      setExiting(true);
      setTimeout(() => resolve(), 1000);
    });
  }, []);

  useImperativeHandle(ref, () => ({ playExit }), [playExit]);

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  if (!sceneReady && !exiting) {
    return (
      <div className="relative min-h-screen bg-[#0F1F2E]">
        <CanvasProvider className="absolute inset-0 h-full w-full">
          <Login3DContent onReady={handleSceneReady} />
        </CanvasProvider>
        {showPanel && (
          <div className="fixed left-1/2 top-1/2 z-20 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      {children}
    </div>
  );
});