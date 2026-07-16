import type { Request, Response } from 'express';
import { asyncHandler } from '@/utils/async-handler.js';
import { successResponse } from '@/utils/response.js';
import * as quoteService from './quote.service.js';
import type { CreateQuoteInput, UpdateQuoteInput } from './quote.schemas.js';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const quotes = await quoteService.listQuotes(req.user!.companyId);
  res.json(successResponse(quotes));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  const quote = await quoteService.getQuoteById(req.user!.companyId, id);
  res.json(successResponse(quote));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validatedBody as CreateQuoteInput;
  const quote = await quoteService.createQuote(req.user!.companyId, req.user!.id, input);
  res.status(201).json(successResponse(quote, 'Quote created successfully'));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  const input = req.validatedBody as UpdateQuoteInput;
  const quote = await quoteService.updateQuote(req.user!.companyId, id, input);
  res.json(successResponse(quote, 'Quote updated successfully'));
});

export const accept = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  await quoteService.acceptQuote(req.user!.companyId, id);
  res.json(successResponse(null, 'Quote accepted successfully'));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  await quoteService.deleteQuote(req.user!.companyId, id);
  res.json(successResponse(null, 'Quote deleted successfully'));
});
