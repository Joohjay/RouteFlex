import { Router } from 'express';
import { authenticate, requireRole } from '@/middleware/auth.js';
import { validate } from '@/middleware/validate.js';
import { idParamSchema } from '@/utils/schemas.js';
import * as testimonialController from './testimonial.controller.js';
import { testimonialSchema, testimonialUpdateSchema } from './testimonial.schemas.js';

export const testimonialRoutes = Router();

testimonialRoutes.use(authenticate, requireRole('ADMIN', 'MANAGER'));

testimonialRoutes.get('/', testimonialController.list);
testimonialRoutes.get('/:id', validate(idParamSchema, 'params'), testimonialController.getById);
testimonialRoutes.post('/', validate(testimonialSchema), testimonialController.create);
testimonialRoutes.put('/:id', validate(idParamSchema, 'params'), validate(testimonialUpdateSchema), testimonialController.update);
testimonialRoutes.delete('/:id', validate(idParamSchema, 'params'), testimonialController.remove);
