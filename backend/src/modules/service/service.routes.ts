import { Router } from 'express';
import { authenticate, requireRole } from '@/middleware/auth.js';
import { validate } from '@/middleware/validate.js';
import { idParamSchema } from '@/utils/schemas.js';
import * as serviceController from './service.controller.js';
import { serviceSchema, serviceUpdateSchema } from './service.schemas.js';

export const serviceRoutes = Router();

serviceRoutes.use(authenticate, requireRole('ADMIN', 'MANAGER'));

serviceRoutes.get('/', serviceController.list);
serviceRoutes.get('/:id', validate(idParamSchema, 'params'), serviceController.getById);
serviceRoutes.post('/', validate(serviceSchema), serviceController.create);
serviceRoutes.put('/:id', validate(idParamSchema, 'params'), validate(serviceUpdateSchema), serviceController.update);
serviceRoutes.delete('/:id', validate(idParamSchema, 'params'), serviceController.remove);
