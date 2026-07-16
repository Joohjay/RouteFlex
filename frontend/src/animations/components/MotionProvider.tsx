import { createContext, useContext, type ReactNode } from 'react';
import { LazyMotion, domAnimation, type Variants } from 'framer-motion';
import { useReducedMotionContext, type ReducedMotionContext } from '../hooks/useReducedMotion';

export interface MotionContextValue extends ReducedMotionContext {
  defaultVariants?: Record<string, Variants>;
}

const MotionContext = createContext<MotionContextValue>({
  prefersReducedMotion: false,
  shouldAnimate: true,
});

export function useMotionContext(): MotionContextValue {
  return useContext(MotionContext);
}

export interface MotionProviderProps {
  children: ReactNode;
  defaultVariants?: Record<string, Variants>;
}

export function MotionProvider({ children, defaultVariants }: MotionProviderProps) {
  const reducedMotion = useReducedMotionContext();

  return (
    <LazyMotion features={domAnimation}>
      <MotionContext.Provider value={{ ...reducedMotion, defaultVariants }}>
        {children}
      </MotionContext.Provider>
    </LazyMotion>
  );
}
