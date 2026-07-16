import type { Request, Response } from 'express';
import { asyncHandler } from '@/utils/async-handler.js';
import { successResponse } from '@/utils/response.js';
import * as dashboardService from './dashboard.service.js';

export const getStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await dashboardService.getDashboardStats(req.user!.companyId);
  res.json(successResponse(stats));
});

export const getMonthlyStats = asyncHandler(async (req: Request, res: Response) => {
  const months = req.query.months ? Number(req.query.months) : 12;
  const stats = await dashboardService.getMonthlyStats(req.user!.companyId, months);
  res.json(successResponse(stats));
});
