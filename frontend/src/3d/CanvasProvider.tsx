import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

interface CanvasProviderProps {
  children: React.ReactNode;
  className?: string;
  camera?: { position: [number, number, number]; fov?: number; near?: number; far?: number };
  dpr?: [number, number] | number;
  gl?: { antialias?: boolean; alpha?: boolean; toneMapping?: number };
  onCreated?: (state: unknown) => void;
  fallback?: React.ReactNode;
}

const defaultFallback = (
  <div className="flex h-full w-full items-center justify-center bg-[#0F1F2E]" />
);

export function CanvasProvider({
  children,
  className,
  camera = { position: [0, 2, 8], fov: 45, near: 0.1, far: 100 },
  dpr = [1, 1.5],
  gl = { antialias: true, alpha: false, toneMapping: 0 },
  onCreated,
  fallback = defaultFallback,
}: CanvasProviderProps) {
  return (
    <div className={className}>
      <Canvas
        camera={camera}
        dpr={dpr}
        gl={{
          antialias: gl.antialias,
          alpha: gl.alpha,
          powerPreference: 'high-performance' as const,
          stencil: false,
          depth: true,
        }}
        onCreated={onCreated}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}