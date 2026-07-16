import type { Request, Response } from 'express';
import { asyncHandler } from '@/utils/async-handler.js';
import { successResponse } from '@/utils/response.js';
import * as settingsService from './settings.service.js';
import type { SettingsInput } from './settings.schemas.js';

export const get = asyncHandler(async (req: Request, res: Response) => {
  const settings = await settingsService.getSettings(req.user!.companyId);
  res.json(successResponse(settings));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validatedBody as SettingsInput;
  const settings = await settingsService.upsertSettings(req.user!.companyId, input);
  res.json(successResponse(settings, 'Settings updated successfully'));
});
