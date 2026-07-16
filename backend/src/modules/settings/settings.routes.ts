import { Router } from 'express';
import { authenticate, requireRole } from '@/middleware/auth.js';
import { validate } from '@/middleware/validate.js';
import * as settingsController from './settings.controller.js';
import { settingsSchema } from './settings.schemas.js';

export const settingsRoutes = Router();

settingsRoutes.use(authenticate, requireRole('ADMIN', 'MANAGER'));

settingsRoutes.get('/', settingsController.get);
settingsRoutes.put('/', validate(settingsSchema), settingsController.update);
