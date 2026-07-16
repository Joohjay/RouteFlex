import type { Variants } from 'framer-motion';
import { duration } from './easing';
import { easeExpressive, easeExit } from './easing';

export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easeExpressive,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: duration.fast,
      ease: easeExit,
    },
  },
};

export const pageSlideLeft: Variants = {
  initial: { opacity: 0, x: 40 },
  enter: {
    opacity: 1, x: 0,
    transition: { duration: duration.normal, ease: easeExpressive },
  },
  exit: {
    opacity: 0, x: -40,
    transition: { duration: duration.fast, ease: easeExit },
  },
};

export const pageSlideRight: Variants = {
  initial: { opacity: 0, x: -40 },
  enter: {
    opacity: 1, x: 0,
    transition: { duration: duration.normal, ease: easeExpressive },
  },
  exit: {
    opacity: 0, x: 40,
    transition: { duration: duration.fast, ease: easeExit },
  },
};

export const pageScale: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  enter: {
    opacity: 1, scale: 1,
    transition: { duration: duration.normal, ease: easeExpressive },
  },
  exit: {
    opacity: 0, scale: 0.98,
    transition: { duration: duration.fast, ease: easeExit },
  },
};
