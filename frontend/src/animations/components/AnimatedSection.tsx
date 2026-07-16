import { type ReactNode } from 'react';
import { motion, type HTMLMotionProps, type Variants } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { fadeUp } from '../variants';
import { cn } from '@/lib/utils';

export interface AnimatedSectionProps extends Omit<HTMLMotionProps<'section'>, 'variants'> {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  once?: boolean;
}

export function AnimatedSection({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  once = true,
  ...props
}: AnimatedSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <section className={cn(className)}>{children}</section>;
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
      variants={variants}
      className={cn(className)}
      {...props}
      custom={delay}
    >
      {children}
    </motion.section>
  );
}
