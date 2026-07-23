import { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { CanvasProvider } from '../CanvasProvider';
import { SceneLighting } from '../Lighting';
import { CameraController } from '../CameraController';
import { TruckModel } from '../models/createTruck';
import { TrailerModel } from '../models/createTrailer';
import { ContainerModel } from '../models/createContainer';
import type { ContainerHandle } from '../models/createContainer';
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

interface SceneRefs {
  group: THREE.Group | null;
  container: ContainerHandle | null;
}

function Login3DContent({ onReady, sceneRefs }: { onReady: () => void; sceneRefs: React.MutableRefObject<SceneRefs> }) {
  const groupRef = useRef<THREE.Group>(null);
  const containerHandleRef = useRef<ContainerHandle>(null);

  useEffect(() => {
    const group = groupRef.current;
    const handle = containerHandleRef.current;
    if (!group || !handle) return;

    sceneRefs.current = { group, container: handle };

    group.position.set(10, 0, 0);

    const tl = gsap.timeline({
      onComplete: onReady,
      defaults: { ease: 'power3.out' },
    });

    tl.to(group.position, {
      x: 0,
      duration: 2.2,
      ease: 'power2.out',
    });

    tl.to({}, { duration: 0.3 });

    if (handle.leftDoor && handle.rightDoor) {
      tl.to(handle.leftDoor.rotation, {
        y: 0.65,
        duration: 1.0,
        ease: 'back.out(1.2)',
      }, 0);
      tl.to(handle.rightDoor.rotation, {
        y: -0.65,
        duration: 1.0,
        ease: 'back.out(1.2)',
      }, 0);
    }

    return () => { tl.kill(); };
  }, [onReady, sceneRefs]);

  return (
    <>
      <CameraController target={[0, 1.5, 0]} offset={[0, 2.5, 7]} lerpSpeed={0.03} />
      <SceneLighting />
      <WarehouseFloor />
      <WarehouseModel />
      <group ref={groupRef}>
        <group position={[0, 0.4, 0]}>
          <TruckModel />
        </group>
        <group position={[-1.8, 0, 0]}>
          <TrailerModel />
        </group>
        <group position={[-1.8, 0, 0]}>
          <ContainerModel ref={containerHandleRef} />
        </group>
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
  const sceneRefs = useRef<SceneRefs>({ group: null, container: null });

  const handleSceneReady = useCallback(() => {
    setSceneReady(true);
    setTimeout(() => setShowPanel(true), 400);
    onComplete?.();
  }, [onComplete]);

  const playExit = useCallback(() => {
    return new Promise<void>((resolve) => {
      const { group, container } = sceneRefs.current;

      setShowPanel(false);
      setExiting(true);

      const exitTl = gsap.timeline({ defaults: { ease: 'power3.in' } });

      if (container?.leftDoor && container?.rightDoor) {
        exitTl.to(container.leftDoor.rotation, {
          y: 0,
          duration: 0.4,
          ease: 'power2.in',
        }, 0);
        exitTl.to(container.rightDoor.rotation, {
          y: 0,
          duration: 0.4,
          ease: 'power2.in',
        }, 0);
      }

      if (group) {
        exitTl.to(group.position, {
          x: -10,
          duration: 1.2,
          ease: 'power2.in',
        }, '-=0.2');
      }

      exitTl.call(() => resolve());
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
          <Login3DContent onReady={handleSceneReady} sceneRefs={sceneRefs} />
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