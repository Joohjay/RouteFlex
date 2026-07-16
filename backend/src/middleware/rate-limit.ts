import rateLimit from 'express-rate-limit';

export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, data: null, message: 'Too many requests', error: { code: 'RATE_LIMITED', message: 'Too many requests, please try again later.' } },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, data: null, message: 'Too many authentication attempts', error: { code: 'RATE_LIMITED', message: 'Too many authentication attempts, please try again later.' } },
});

export const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, data: null, message: 'Booking limit reached', error: { code: 'RATE_LIMITED', message: 'Too many booking requests, please try again later.' } },
});
