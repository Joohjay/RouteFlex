import { type ReactNode } from 'react';
import { motion, type HTMLMotionProps, type Variants } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { cardReveal } from '../variants';
import { hoverLift, tapScale } from '../gestures';
import { cn } from '@/lib/utils';

export interface AnimatedCardProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  disableHover?: boolean;
  index?: number;
}

export function AnimatedCard({
  children,
  className,
  variants = cardReveal,
  delay = 0,
  disableHover = false,
  index = 0,
  ...props
}: AnimatedCardProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-30px' }}
      variants={variants}
      whileHover={disableHover ? undefined : hoverLift}
      whileTap={disableHover ? undefined : tapScale}
      className={cn(className)}
      custom={delay}
      transition={{ delay: index * 0.05 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
