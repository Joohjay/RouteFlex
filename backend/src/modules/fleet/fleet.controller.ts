import type { Request, Response } from 'express';
import { asyncHandler } from '@/utils/async-handler.js';
import { successResponse } from '@/utils/response.js';
import * as fleetService from './fleet.service.js';
import type { FleetInput, FleetUpdateInput } from './fleet.schemas.js';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const fleet = await fleetService.listFleet(req.user!.companyId);
  res.json(successResponse(fleet));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  const fleet = await fleetService.getFleetById(req.user!.companyId, id);
  res.json(successResponse(fleet));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validatedBody as FleetInput;
  const fleet = await fleetService.createFleet(req.user!.companyId, input);
  res.status(201).json(successResponse(fleet, 'Fleet vehicle created successfully'));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  const input = req.validatedBody as FleetUpdateInput;
  const fleet = await fleetService.updateFleet(req.user!.companyId, id, input);
  res.json(successResponse(fleet, 'Fleet vehicle updated successfully'));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  await fleetService.deleteFleet(req.user!.companyId, id);
  res.json(successResponse(null, 'Fleet vehicle deleted successfully'));
});
