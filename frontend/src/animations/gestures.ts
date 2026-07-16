import type { TargetAndTransition } from 'framer-motion';

export const hoverScale: TargetAndTransition = {
  scale: 1.03,
  transition: { type: 'spring', stiffness: 400, damping: 25 },
};

export const hoverLift: TargetAndTransition = {
  y: -4,
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
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
