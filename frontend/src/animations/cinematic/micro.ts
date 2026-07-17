import { useCallback } from 'react';
import { gsap } from '@/animations/hooks/useGSAP';
import { useReducedMotion } from '@/animations/hooks';

export function useButtonMicro() {
  const prefersReducedMotion = useReducedMotion();

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (prefersReducedMotion) return;
      gsap.to(e.currentTarget, {
        scale: 1.03,
        duration: 0.2,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    },
    [prefersReducedMotion]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (prefersReducedMotion) return;
      gsap.to(e.currentTarget, {
        scale: 1,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    },
    [prefersReducedMotion]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (prefersReducedMotion) return;
      gsap.to(e.currentTarget, {
        scale: 0.97,
        duration: 0.1,
        ease: 'power2.in',
        overwrite: 'auto',
      });
    },
    [prefersReducedMotion]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (prefersReducedMotion) return;
      gsap.to(e.currentTarget, {
        scale: 1.03,
        duration: 0.15,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    },
    [prefersReducedMotion]
  );

  return {
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
    },
  };
}

export function useCardMicro() {
  const prefersReducedMotion = useReducedMotion();

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (prefersReducedMotion) return;
      gsap.to(e.currentTarget, {
        y: -3,
        boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    },
    [prefersReducedMotion]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (prefersReducedMotion) return;
      gsap.to(e.currentTarget, {
        y: 0,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    },
    [prefersReducedMotion]
  );

  return {
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  };
}
