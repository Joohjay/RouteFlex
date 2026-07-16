import { Router } from 'express';
import { authenticate, requireRole } from '@/middleware/auth.js';
import { validate } from '@/middleware/validate.js';
import { idParamSchema } from '@/utils/schemas.js';
import * as fleetController from './fleet.controller.js';
import { fleetSchema, fleetUpdateSchema } from './fleet.schemas.js';

export const fleetRoutes = Router();

fleetRoutes.use(authenticate, requireRole('ADMIN', 'MANAGER'));

fleetRoutes.get('/', fleetController.list);
fleetRoutes.get('/:id', validate(idParamSchema, 'params'), fleetController.getById);
fleetRoutes.post('/', validate(fleetSchema), fleetController.create);
fleetRoutes.put('/:id', validate(idParamSchema, 'params'), validate(fleetUpdateSchema), fleetController.update);
fleetRoutes.delete('/:id', validate(idParamSchema, 'params'), fleetController.remove);
