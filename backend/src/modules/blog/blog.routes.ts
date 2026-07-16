import { Router } from 'express';
import { authenticate, requireRole } from '@/middleware/auth.js';
import { validate } from '@/middleware/validate.js';
import { idParamSchema } from '@/utils/schemas.js';
import * as blogController from './blog.controller.js';
import { blogPostSchema, blogPostUpdateSchema } from './blog.schemas.js';

export const blogRoutes = Router();

blogRoutes.use(authenticate, requireRole('ADMIN', 'MANAGER'));

blogRoutes.get('/', blogController.list);
blogRoutes.get('/:id', validate(idParamSchema, 'params'), blogController.getById);
blogRoutes.post('/', validate(blogPostSchema), blogController.create);
blogRoutes.put('/:id', validate(idParamSchema, 'params'), validate(blogPostUpdateSchema), blogController.update);
blogRoutes.delete('/:id', validate(idParamSchema, 'params'), blogController.remove);
