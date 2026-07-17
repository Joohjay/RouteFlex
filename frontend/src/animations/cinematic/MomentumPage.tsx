import { type ReactNode, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/animations/hooks';
import { gsap, ScrollTrigger } from '@/animations/hooks/useGSAP';
import { cn } from '@/lib/utils';

interface MomentumPageProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const directionVariants = {
  up: { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -30 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } },
};

export function MomentumPage({ children, className, direction = 'up' }: MomentumPageProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion || !ref.current) return;

    const elements = ref.current.querySelectorAll('[data-momentum]');
    if (elements.length === 0) return;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out', duration: 0.6 },
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    tl.set(elements, { opacity: 0, y: 24 });
    tl.to(elements, { opacity: 1, y: 0, stagger: 0.06 });

    ScrollTrigger.refresh();

    return () => {
      tl.kill();
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      variants={directionVariants[direction]}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
