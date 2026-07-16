import { Router } from 'express';
import { authenticate, requireRole } from '@/middleware/auth.js';
import { validate } from '@/middleware/validate.js';
import * as companyController from './company.controller.js';
import { companySchema, companyUpdateSchema } from './company.schemas.js';
import { idParamSchema } from '@/utils/schemas.js';

export const companyRoutes = Router();

companyRoutes.use(authenticate, requireRole('ADMIN'));

companyRoutes.get('/', companyController.list);
companyRoutes.get('/:id', validate(idParamSchema, 'params'), companyController.getById);
companyRoutes.post('/', validate(companySchema), companyController.create);
companyRoutes.put('/:id', validate(idParamSchema, 'params'), validate(companyUpdateSchema), companyController.update);
companyRoutes.delete('/:id', validate(idParamSchema, 'params'), companyController.remove);
