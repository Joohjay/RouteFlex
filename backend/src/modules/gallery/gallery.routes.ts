import { Router } from 'express';
import { authenticate, requireRole } from '@/middleware/auth.js';
import { validate } from '@/middleware/validate.js';
import { idParamSchema } from '@/utils/schemas.js';
import * as galleryController from './gallery.controller.js';
import { gallerySchema, galleryUpdateSchema } from './gallery.schemas.js';

export const galleryRoutes = Router();

galleryRoutes.use(authenticate, requireRole('ADMIN', 'MANAGER'));

galleryRoutes.get('/', galleryController.list);
galleryRoutes.get('/:id', validate(idParamSchema, 'params'), galleryController.getById);
galleryRoutes.post('/', validate(gallerySchema), galleryController.create);
galleryRoutes.put('/:id', validate(idParamSchema, 'params'), validate(galleryUpdateSchema), galleryController.update);
galleryRoutes.delete('/:id', validate(idParamSchema, 'params'), galleryController.remove);
