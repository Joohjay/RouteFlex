import { Router } from 'express';
import { authenticate } from '@/middleware/auth.js';
import { validate } from '@/middleware/validate.js';
import { authLimiter } from '@/middleware/rate-limit.js';
import { resolvePublicCompany } from '@/middleware/company.js';
import * as authController from './auth.controller.js';
import { loginSchema, refreshTokenSchema, registerSchema } from './auth.schemas.js';

export const authRoutes = Router();

authRoutes.post('/login', authLimiter, validate(loginSchema), authController.login);
authRoutes.post('/refresh', validate(refreshTokenSchema), authController.refresh);
authRoutes.post('/logout', validate(refreshTokenSchema), authController.logout);
authRoutes.get('/me', authenticate, authController.getMe);
authRoutes.post(
  '/register',
  authLimiter,
  resolvePublicCompany,
  validate(registerSchema),
  authController.register
);
