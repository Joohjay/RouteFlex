import { Router } from 'express';
import { authenticate, requireRole } from '@/middleware/auth.js';
import { validate } from '@/middleware/validate.js';
import { idParamSchema } from '@/utils/schemas.js';
import * as quoteController from './quote.controller.js';
import { createQuoteSchema, updateQuoteSchema } from './quote.schemas.js';

export const quoteRoutes = Router();

quoteRoutes.use(authenticate, requireRole('ADMIN', 'MANAGER', 'DISPATCHER'));

quoteRoutes.get('/', quoteController.list);
quoteRoutes.get('/:id', validate(idParamSchema, 'params'), quoteController.getById);
quoteRoutes.post('/', validate(createQuoteSchema), quoteController.create);
quoteRoutes.put('/:id', validate(idParamSchema, 'params'), validate(updateQuoteSchema), quoteController.update);
quoteRoutes.post('/:id/accept', validate(idParamSchema, 'params'), quoteController.accept);
quoteRoutes.delete('/:id', validate(idParamSchema, 'params'), quoteController.remove);
