import { useReducedMotion } from './useReducedMotion';
import { pageVariants } from '../pageTransitions';

export function usePageTransition() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return {
      variants: { initial: {}, enter: {}, exit: {} },
      initial: 'initial' as const,
      animate: 'enter' as const,
      exit: 'exit' as const,
    };
  }

  return {
    variants: pageVariants,
    initial: 'initial' as const,
    animate: 'enter' as const,
    exit: 'exit' as const,
  };
}
