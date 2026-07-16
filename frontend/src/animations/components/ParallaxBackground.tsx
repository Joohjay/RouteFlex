import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { cn } from '@/lib/utils';

interface ParallaxBackgroundProps {
  src: string;
  className?: string;
  speed?: number;
  children?: React.ReactNode;
}

export function ParallaxBackground({ src, className, speed = 0.3, children }: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-10%', `${speed * 30}%`]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <div ref={ref} className={cn('absolute inset-0 overflow-hidden', className)}>
      {prefersReducedMotion ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <motion.img
          src={src}
          alt=""
          style={{ y, scale }}
          className="h-full w-full object-cover will-change-transform"
        />
      )}
      {children}
    </div>
  );
}
