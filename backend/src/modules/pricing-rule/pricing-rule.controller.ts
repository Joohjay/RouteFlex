import type { Request, Response } from 'express';
import { asyncHandler } from '@/utils/async-handler.js';
import { successResponse } from '@/utils/response.js';
import * as pricingRuleService from './pricing-rule.service.js';
import type { PricingRuleInput, PricingRuleUpdateInput } from './pricing-rule.schemas.js';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const rules = await pricingRuleService.listPricingRules(req.user!.companyId);
  res.json(successResponse(rules));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  const rule = await pricingRuleService.getPricingRuleById(req.user!.companyId, id);
  res.json(successResponse(rule));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validatedBody as PricingRuleInput;
  const rule = await pricingRuleService.createPricingRule(req.user!.companyId, input);
  res.status(201).json(successResponse(rule, 'Pricing rule created successfully'));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  const input = req.validatedBody as PricingRuleUpdateInput;
  const rule = await pricingRuleService.updatePricingRule(req.user!.companyId, id, input);
  res.json(successResponse(rule, 'Pricing rule updated successfully'));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  await pricingRuleService.deletePricingRule(req.user!.companyId, id);
  res.json(successResponse(null, 'Pricing rule deleted successfully'));
});

export const estimate = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validatedBody as pricingRuleService.QuoteEstimateInput;
  const estimate = await pricingRuleService.estimateQuote(req.company!.id, input);
  res.json(successResponse(estimate, 'Quote estimate generated'));
});
