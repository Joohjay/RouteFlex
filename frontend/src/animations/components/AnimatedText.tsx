import { type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { fadeUp } from '../variants';
import { cn } from '@/lib/utils';

export interface AnimatedTextProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedText({
  children,
  className,
  delay = 0,
  ...props
}: AnimatedTextProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20px' }}
      variants={fadeUp}
      className={cn(className)}
      custom={delay}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export interface AnimatedWordProps extends Omit<HTMLMotionProps<'span'>, 'variants'> {
  text: string;
  className?: string;
  delay?: number;
}

export function AnimatedWord({
  text,
  className,
  delay = 0,
  ...props
}: AnimatedWordProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <span className={cn(className)}>{text}</span>;
  }

  return (
    <motion.span
      className={cn('inline-block', className)}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
          opacity: 1,
          y: 0,
          transition: { delay: i * 0.04, ...fadeUp.visible },
        }),
      }}
      custom={delay}
      {...props}
    >
      {text}
    </motion.span>
  );
}

export function AnimatedCharacter({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <span className={cn(className)}>{text}</span>;
  }

  const characters = text.split('');

  return (
    <span className={cn('inline', className)}>
      {characters.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: i * 0.03, duration: 0.35, ease: [0.0, 0, 0.2, 1] }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}
