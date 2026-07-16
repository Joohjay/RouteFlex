import { Router } from 'express';
import { authenticate, requireRole } from '@/middleware/auth.js';
import { validate } from '@/middleware/validate.js';
import { idParamSchema } from '@/utils/schemas.js';
import { resolvePublicCompany } from '@/middleware/company.js';
import * as pricingRuleController from './pricing-rule.controller.js';
import { pricingRuleSchema, pricingRuleUpdateSchema } from './pricing-rule.schemas.js';
import { quoteEstimateSchema } from '../quote/quote.schemas.js';

export const pricingRuleRoutes = Router();

// Public estimate endpoint
pricingRuleRoutes.post('/estimate', resolvePublicCompany, validate(quoteEstimateSchema), pricingRuleController.estimate);

// Protected admin routes
pricingRuleRoutes.use(authenticate, requireRole('ADMIN', 'MANAGER'));

pricingRuleRoutes.get('/', pricingRuleController.list);
pricingRuleRoutes.get('/:id', validate(idParamSchema, 'params'), pricingRuleController.getById);
pricingRuleRoutes.post('/', validate(pricingRuleSchema), pricingRuleController.create);
pricingRuleRoutes.put('/:id', validate(idParamSchema, 'params'), validate(pricingRuleUpdateSchema), pricingRuleController.update);
pricingRuleRoutes.delete('/:id', validate(idParamSchema, 'params'), pricingRuleController.remove);
