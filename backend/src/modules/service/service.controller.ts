import type { Request, Response } from 'express';
import { asyncHandler } from '@/utils/async-handler.js';
import { successResponse } from '@/utils/response.js';
import * as serviceService from './service.service.js';
import type { ServiceInput, ServiceUpdateInput } from './service.schemas.js';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const services = await serviceService.listServices(req.user!.companyId);
  res.json(successResponse(services));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  const service = await serviceService.getServiceById(req.user!.companyId, id);
  res.json(successResponse(service));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validatedBody as ServiceInput;
  const service = await serviceService.createService(req.user!.companyId, input);
  res.status(201).json(successResponse(service, 'Service created successfully'));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  const input = req.validatedBody as ServiceUpdateInput;
  const service = await serviceService.updateService(req.user!.companyId, id, input);
  res.json(successResponse(service, 'Service updated successfully'));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  await serviceService.deleteService(req.user!.companyId, id);
  res.json(successResponse(null, 'Service deleted successfully'));
});
