import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3 } from 'three';

interface CameraControllerProps {
  target?: [number, number, number];
  offset?: [number, number, number];
  lerpSpeed?: number;
  enabled?: boolean;
}

export function CameraController({
  target = [0, 1.5, 0],
  offset: [ox, oy, oz] = [0, 2, 8],
  lerpSpeed = 0.05,
  enabled = true,
}: CameraControllerProps) {
  const targetPos = useRef(new Vector3(ox, oy, oz));
  const targetLook = useRef(new Vector3(...target));

  useFrame(({ camera }) => {
    if (!enabled) return;
    camera.position.lerp(targetPos.current, lerpSpeed);
    camera.lookAt(targetLook.current);
  });

  return null;
}

export function useCameraControl() {
  const ref = useRef<{ setTarget: (pos: [number, number, number], lookAt?: [number, number, number]) => void }>({
    setTarget: () => {},
  });
  return ref.current;
}