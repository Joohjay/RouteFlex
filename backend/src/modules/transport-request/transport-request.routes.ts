import { Router } from 'express';
import { authenticate, requireRole } from '@/middleware/auth.js';
import { validate } from '@/middleware/validate.js';
import { idParamSchema } from '@/utils/schemas.js';
import * as transportRequestController from './transport-request.controller.js';
import {
  createTransportRequestSchema,
  trackRequestSchema,
  updateTransportRequestSchema,
} from './transport-request.schemas.js';

export const transportRequestRoutes = Router();

// Public booking and tracking
transportRequestRoutes.post(
  '/',
  validate(createTransportRequestSchema),
  ...transportRequestController.create
);
transportRequestRoutes.get(
  '/track/:referenceNumber',
  validate(trackRequestSchema, 'params'),
  transportRequestController.track
);

// Protected admin routes
transportRequestRoutes.use(authenticate, requireRole('ADMIN', 'MANAGER', 'DISPATCHER'));

transportRequestRoutes.get('/', transportRequestController.list);
transportRequestRoutes.get('/:id', validate(idParamSchema, 'params'), transportRequestController.getById);
transportRequestRoutes.put('/:id', validate(idParamSchema, 'params'), validate(updateTransportRequestSchema), transportRequestController.update);
transportRequestRoutes.delete('/:id', validate(idParamSchema, 'params'), transportRequestController.remove);
