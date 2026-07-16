import { type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { pageVariants } from '../pageTransitions';
import { cn } from '@/lib/utils';

export interface PageTransitionProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className, ...props }: PageTransitionProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
