import type { Request, Response } from 'express';
import { asyncHandler } from '@/utils/async-handler.js';
import { successResponse } from '@/utils/response.js';
import * as notificationService from './notification.service.js';
import type { CreateNotificationInput, UpdateNotificationInput } from './notification.schemas.js';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await notificationService.listNotifications(req.user!.companyId);
  res.json(successResponse(notifications));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  const notification = await notificationService.getNotificationById(req.user!.companyId, id);
  res.json(successResponse(notification));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validatedBody as CreateNotificationInput;
  const notification = await notificationService.createNotification(
    req.user!.companyId,
    input,
    req.user!.id
  );
  res.status(201).json(successResponse(notification, 'Notification created successfully'));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  const input = req.validatedBody as UpdateNotificationInput;
  const notification = await notificationService.updateNotification(req.user!.companyId, id, input);
  res.json(successResponse(notification, 'Notification updated successfully'));
});
