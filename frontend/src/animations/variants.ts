import type { Variants } from 'framer-motion';
import { duration } from './easing';
import { easeExpressive, easeExit } from './easing';
import { transitions } from './transitions';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: transitions.normal },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: transitions.normal },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: transitions.normal },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: transitions.normal },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: transitions.normal },
};

export const heroReveal: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.98, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
    transition: transitions.expressive,
  },
};

export const heroRevealChild: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: transitions.normal },
};

export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: transitions.normal },
};

export const modalOpen: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: duration.normal, ease: easeExpressive },
  },
  exit: {
    opacity: 0, scale: 0.95, y: 10,
    transition: { duration: duration.fast, ease: easeExit },
  },
};

export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.fast } },
  exit: { opacity: 0, transition: { duration: duration.fast } },
};

export const drawerSlide: Variants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { duration: duration.slow, ease: easeExpressive },
  },
  exit: {
    x: '100%',
    transition: { duration: duration.fast, ease: easeExit },
  },
};

export const accordionExpand: Variants = {
  hidden: { height: 0, opacity: 0, overflow: 'hidden' },
  visible: {
    height: 'auto', opacity: 1,
    transition: transitions.normal,
  },
  exit: {
    height: 0, opacity: 0, overflow: 'hidden',
    transition: transitions.normal,
  },
};

export const listItem: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: transitions.fast },
};

export const notificationSlide: Variants = {
  hidden: { opacity: 0, x: 100, height: 0 },
  visible: {
    opacity: 1, x: 0, height: 'auto',
    transition: { duration: duration.normal, ease: easeExpressive },
  },
  exit: {
    opacity: 0, x: 100, height: 0,
    transition: { duration: duration.fast, ease: easeExit },
  },
};
