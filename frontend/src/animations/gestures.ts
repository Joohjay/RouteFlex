import type { TargetAndTransition } from 'framer-motion';

export const hoverScale: TargetAndTransition = {
  scale: 1.02,
  transition: { type: 'spring', stiffness: 400, damping: 25 },
};

export const hoverLift: TargetAndTransition = {
  y: -3,
  boxShadow: '0 6px 20px rgba(0,0,0,0.10)',
  transition: { type: 'spring', stiffness: 400, damping: 25 },
};

export const hoverGlow: TargetAndTransition = {
  scale: 1.02,
  transition: { type: 'spring', stiffness: 400, damping: 25 },
};

export const hoverBrightness: TargetAndTransition = {
  scale: 1.02,
  filter: 'brightness(1.1)',
  transition: { type: 'spring', stiffness: 400, damping: 25 },
};

export const tapScale: TargetAndTransition = {
  scale: 0.97,
  transition: { type: 'spring', stiffness: 400, damping: 20 },
};

export const tapScaleSmall: TargetAndTransition = {
  scale: 0.98,
  transition: { type: 'spring', stiffness: 400, damping: 20 },
};
