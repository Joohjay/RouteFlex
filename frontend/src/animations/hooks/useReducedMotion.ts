import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false;
}

export type ReducedMotionContext = {
  prefersReducedMotion: boolean;
  shouldAnimate: boolean;
};

export function useReducedMotionContext(): ReducedMotionContext {
  const prefersReducedMotion = useReducedMotion();
  return {
    prefersReducedMotion,
    shouldAnimate: !prefersReducedMotion,
  };
}
