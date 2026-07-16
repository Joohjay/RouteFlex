import type { Request, Response } from 'express';
import { resolvePublicCompany } from '@/middleware/company.js';
import { bookingLimiter } from '@/middleware/rate-limit.js';
import { asyncHandler } from '@/utils/async-handler.js';
import { successResponse } from '@/utils/response.js';
import * as transportRequestService from './transport-request.service.js';
import type { CreateTransportRequestInput, UpdateTransportRequestInput } from './transport-request.schemas.js';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const requests = await transportRequestService.listTransportRequests(req.user!.companyId);
  res.json(successResponse(requests));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  const request = await transportRequestService.getTransportRequestById(req.user!.companyId, id);
  res.json(successResponse(request));
});

export const create = [
  resolvePublicCompany,
  bookingLimiter,
  asyncHandler(async (req: Request, res: Response) => {
    const input = req.validatedBody as CreateTransportRequestInput;
    const companyId = req.company!.id;
    const { request, estimate } = await transportRequestService.createTransportRequest(companyId, input, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    res.status(201).json(successResponse({ request, estimate }, 'Transport request submitted successfully'));
  }),
];

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  const input = req.validatedBody as UpdateTransportRequestInput;
  const request = await transportRequestService.updateTransportRequest(
    req.user!.companyId,
    id,
    input,
    req.user!.id
  );
  res.json(successResponse(request, 'Transport request updated successfully'));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  await transportRequestService.deleteTransportRequest(req.user!.companyId, id);
  res.json(successResponse(null, 'Transport request deleted successfully'));
});

export const track = asyncHandler(async (req: Request, res: Response) => {
  const { referenceNumber } = req.validatedParams as { referenceNumber: string };
  const request = await transportRequestService.trackTransportRequest(referenceNumber);
  res.json(successResponse(request));
});
