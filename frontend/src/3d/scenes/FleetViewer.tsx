import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { CanvasProvider } from '../CanvasProvider';
import { SceneLighting } from '../Lighting';
import { TruckModel } from '../models/createTruck';
import { TrailerModel } from '../models/createTrailer';
import { ContainerModel } from '../models/createContainer';
import { useReducedMotion } from '@/animations/hooks';

type ViewMode = 'truck' | 'trailer' | 'container' | 'full';

const viewConfig: Record<ViewMode, { cameraPosition: [number, number, number]; target: [number, number, number]; label: string }> = {
  truck: { cameraPosition: [0, 1.5, 3], target: [0, 0.5, 0], label: 'Truck' },
  trailer: { cameraPosition: [0, 1.5, 3.5], target: [1.5, 0.5, 0], label: 'Trailer' },
  container: { cameraPosition: [0, 1.5, 3], target: [2.5, 0.6, 0], label: 'Container' },
  full: { cameraPosition: [0, 2, 5], target: [0.5, 0.5, 0], label: 'Full View' },
};

function ViewerContent({ view }: { view: ViewMode }) {
  const truckRef = useRef<THREE.Group>(null);
  const trailerRef = useRef<THREE.Group>(null);
  const containerRef = useRef<THREE.Group>(null);
  const config = viewConfig[view];

  const [cameraPos, setCameraPos] = useState(config.cameraPosition);

  useEffect(() => {
    setCameraPos(config.cameraPosition);
  }, [config.cameraPosition]);

  useFrame(({ camera }) => {
    camera.position.lerp(
      new THREE.Vector3(cameraPos[0], cameraPos[1], cameraPos[2]),
      0.05
    );
    camera.lookAt(config.target[0], config.target[1], config.target[2]);
  });

  return (
    <>
      <SceneLighting />
      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={2}
        maxDistance={8}
        minPolarAngle={0.3}
        maxPolarAngle={1.2}
        target={new THREE.Vector3(config.target[0], config.target[1], config.target[2])}
      />
      <group ref={truckRef} position={[-1.5, 0, 0]}>
        <TruckModel />
      </group>
      <group ref={trailerRef} position={[1.5, 0, 0]}>
        <TrailerModel />
      </group>
      <group ref={containerRef} position={[2.5, 0, 0]}>
        <ContainerModel />
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial color="#1A1A1E" metalness={0.2} roughness={0.8} />
      </mesh>
    </>
  );
}

const viewOptions: { key: ViewMode; emoji: string }[] = [
  { key: 'truck', emoji: '🚛' },
  { key: 'trailer', emoji: '🚚' },
  { key: 'container', emoji: '📦' },
  { key: 'full', emoji: '🔍' },
];

export function FleetViewer() {
  const prefersReducedMotion = useReducedMotion();
  const [view, setView] = useState<ViewMode>('full');

  if (prefersReducedMotion) return null;

  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-2xl">
      <CanvasProvider
        className="h-full w-full"
        camera={{ position: [0, 2, 5], fov: 40, near: 0.1, far: 20 }}
        dpr={[1, 1.5]}
      >
        <ViewerContent view={view} />
      </CanvasProvider>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {viewOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setView(opt.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all ${
              view === opt.key
                ? 'bg-[#C29A4A] text-white shadow-lg'
                : 'bg-black/40 text-white/70 hover:bg-black/60 hover:text-white'
            }`}
          >
            {opt.emoji} {viewConfig[opt.key].label}
          </button>
        ))}
      </div>
    </div>
  );
}