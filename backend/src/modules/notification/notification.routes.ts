import { Router } from 'express';
import { authenticate, requireRole } from '@/middleware/auth.js';
import { validate } from '@/middleware/validate.js';
import { idParamSchema } from '@/utils/schemas.js';
import * as notificationController from './notification.controller.js';
import { createNotificationSchema, updateNotificationSchema } from './notification.schemas.js';

export const notificationRoutes = Router();

notificationRoutes.use(authenticate, requireRole('ADMIN', 'MANAGER'));

notificationRoutes.get('/', notificationController.list);
notificationRoutes.get('/:id', validate(idParamSchema, 'params'), notificationController.getById);
notificationRoutes.post('/', validate(createNotificationSchema), notificationController.create);
notificationRoutes.put('/:id', validate(idParamSchema, 'params'), validate(updateNotificationSchema), notificationController.update);
