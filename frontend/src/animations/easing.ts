export const duration = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.35,
  slow: 0.6,
  expressive: 0.8,
  cinematic: 1.2,
} as const;

export const easeStandard = [0.4, 0, 0.2, 1] as const;
export const easeExpressive = [0.0, 0, 0.2, 1] as const;
export const easeExit = [0.4, 0, 1, 1] as const;
export const easeIn = [0.4, 0, 1, 1] as const;
export const easeOut = [0.0, 0, 0.2, 1] as const;
export const easeInOut = [0.4, 0, 0.2, 1] as const;
