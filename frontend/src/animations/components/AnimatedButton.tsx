import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { hoverScale, tapScale } from '../gestures';
import { cn } from '@/lib/utils';

export interface AnimatedButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  className?: string;
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, className, ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
      return (
        <button ref={ref} className={cn(className)} {...(props as React.ComponentProps<'button'>)}>
          {children}
        </button>
      );
    }

    return (
      <motion.button
        ref={ref}
        whileHover={hoverScale}
        whileTap={tapScale}
        className={cn(className)}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';
