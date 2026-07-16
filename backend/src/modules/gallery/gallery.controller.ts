import type { Request, Response } from 'express';
import { asyncHandler } from '@/utils/async-handler.js';
import { successResponse } from '@/utils/response.js';
import * as galleryService from './gallery.service.js';
import type { GalleryInput, GalleryUpdateInput } from './gallery.schemas.js';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const gallery = await galleryService.listGallery(req.user!.companyId);
  res.json(successResponse(gallery));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  const item = await galleryService.getGalleryById(req.user!.companyId, id);
  res.json(successResponse(item));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validatedBody as GalleryInput;
  const item = await galleryService.createGallery(req.user!.companyId, input);
  res.status(201).json(successResponse(item, 'Gallery item created successfully'));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  const input = req.validatedBody as GalleryUpdateInput;
  const item = await galleryService.updateGallery(req.user!.companyId, id, input);
  res.json(successResponse(item, 'Gallery item updated successfully'));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  await galleryService.deleteGallery(req.user!.companyId, id);
  res.json(successResponse(null, 'Gallery item deleted successfully'));
});
