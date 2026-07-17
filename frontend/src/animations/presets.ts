import { fadeUp, scaleIn, cardReveal } from './variants';
import { staggerContainer, staggerSlow } from './stagger';
import { pageVariants } from './pageTransitions';
import { hoverLift, hoverScale, tapScale } from './gestures';
import { transitions } from './transitions';

export const heroPreset = {
  container: staggerSlow,
  item: fadeUp,
};

export const sectionPreset = {
  container: staggerContainer,
  item: fadeUp,
};

export const cardPreset = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-50px' },
  variants: cardReveal,
  whileHover: hoverLift,
};

export const gridPreset = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-50px' },
  variants: staggerContainer,
};

export const buttonPreset = {
  whileHover: hoverScale,
  whileTap: tapScale,
  transition: transitions.springSnappy,
};

export const imagePreset = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-50px' },
  variants: scaleIn,
};

export const pagePreset = {
  initial: 'initial',
  animate: 'enter',
  exit: 'exit',
  variants: pageVariants,
};

export const statCardPreset = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: transitions.normal,
};

export const timelineItemPreset = {
  initial: { opacity: 0, x: -20 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: transitions.normal,
};

export const stepIconPulse = {
  animate: { scale: [1, 1.05, 1] },
  transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
};

export const glassHover = {
  whileHover: {
    backdropFilter: 'blur(8px)',
    backgroundColor: 'rgba(255,255,255,0.85)',
    transition: { duration: 0.3 },
  },
};
