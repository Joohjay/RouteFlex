import { type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { staggerSlow } from '../stagger';
import { heroRevealChild } from '../variants';
import { cn } from '@/lib/utils';

export interface AnimatedHeroProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  children: ReactNode;
  className?: string;
}

export function AnimatedHero({ children, className, ...props }: AnimatedHeroProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerSlow}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedHeroItem({
  children,
  className,
  ...props
}: { children: ReactNode; className?: string } & Omit<HTMLMotionProps<'div'>, 'variants'>) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div variants={heroRevealChild} className={cn(className)} {...props}>
      {children}
    </motion.div>
  );
}
