import { useCallback } from 'react';
import { gsap } from '@/animations/hooks/useGSAP';
import { useReducedMotion } from '@/animations/hooks';
import { cn } from '@/lib/utils';

export function useFleetCardHover() {
  const prefersReducedMotion = useReducedMotion();

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;
      const card = e.currentTarget;
      gsap.to(card, {
        y: -6,
        scale: 1.01,
        boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    },
    [prefersReducedMotion]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;
      const card = e.currentTarget;
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    },
    [prefersReducedMotion]
  );

  return {
    cardHandlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  };
}

export function FleetCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const { cardHandlers } = useFleetCardHover();

  return (
    <div
      {...cardHandlers}
      className={cn(
        'rounded-xl border bg-white shadow-sm transition-colors will-change-transform dark:bg-gray-950',
        className
      )}
    >
      {children}
    </div>
  );
}
