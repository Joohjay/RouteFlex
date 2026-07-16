import { motion, type HTMLMotionProps } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { scaleIn, clipReveal, clipRevealVertical } from '../variants';
import { hoverScale } from '../gestures';
import { cn } from '@/lib/utils';

export interface AnimatedImageProps extends Omit<HTMLMotionProps<'img'>, 'variants'> {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  disableZoom?: boolean;
  reveal?: 'scale' | 'clip' | 'clip-vertical';
}

const revealVariants = {
  scale: scaleIn,
  clip: clipReveal,
  'clip-vertical': clipRevealVertical,
};

export function AnimatedImage({
  src,
  alt,
  className,
  wrapperClassName,
  disableZoom = false,
  reveal = 'scale',
  ...props
}: AnimatedImageProps) {
  const prefersReducedMotion = useReducedMotion();
  const variants = revealVariants[reveal] ?? scaleIn;

  if (prefersReducedMotion) {
    return (
      <div className={cn('overflow-hidden', wrapperClassName)}>
        <img src={src} alt={alt} className={cn(className)} {...(props as React.ImgHTMLAttributes<HTMLImageElement>)} />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={variants}
      className={cn('overflow-hidden', wrapperClassName)}
    >
      <motion.img
        src={src}
        alt={alt}
        whileHover={disableZoom ? undefined : hoverScale}
        className={cn('w-full', className)}
        {...props}
      />
    </motion.div>
  );
}
