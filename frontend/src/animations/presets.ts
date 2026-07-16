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
