import { Router } from 'express';
import { authenticate, requireRole } from '@/middleware/auth.js';
import { validate } from '@/middleware/validate.js';
import { idParamSchema } from '@/utils/schemas.js';
import * as userController from './user.controller.js';
import { createUserSchema, updateUserSchema } from './user.schemas.js';

export const userRoutes = Router();

userRoutes.use(authenticate, requireRole('ADMIN', 'MANAGER'));

userRoutes.get('/', userController.list);
userRoutes.get('/:id', validate(idParamSchema, 'params'), userController.getById);
userRoutes.post('/', validate(createUserSchema), userController.create);
userRoutes.put('/:id', validate(idParamSchema, 'params'), validate(updateUserSchema), userController.update);
userRoutes.delete('/:id', validate(idParamSchema, 'params'), userController.remove);
