import { duration, easeStandard, easeExpressive, easeExit } from './easing';

export const transitions = {
  fast: { duration: duration.fast, ease: easeStandard },
  normal: { duration: duration.normal, ease: easeStandard },
  slow: { duration: duration.slow, ease: easeStandard },
  expressive: { duration: duration.expressive, ease: easeExpressive },
  exit: { duration: duration.fast, ease: easeExit },
  spring: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },
  springGentle: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25,
  },
  springSnappy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 20,
  },
} as const;
