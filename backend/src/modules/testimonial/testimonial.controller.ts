import type { Request, Response } from 'express';
import { asyncHandler } from '@/utils/async-handler.js';
import { successResponse } from '@/utils/response.js';
import * as testimonialService from './testimonial.service.js';
import type { TestimonialInput, TestimonialUpdateInput } from './testimonial.schemas.js';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const testimonials = await testimonialService.listTestimonials(req.user!.companyId);
  res.json(successResponse(testimonials));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  const testimonial = await testimonialService.getTestimonialById(req.user!.companyId, id);
  res.json(successResponse(testimonial));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validatedBody as TestimonialInput;
  const testimonial = await testimonialService.createTestimonial(req.user!.companyId, input);
  res.status(201).json(successResponse(testimonial, 'Testimonial created successfully'));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  const input = req.validatedBody as TestimonialUpdateInput;
  const testimonial = await testimonialService.updateTestimonial(req.user!.companyId, id, input);
  res.json(successResponse(testimonial, 'Testimonial updated successfully'));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  await testimonialService.deleteTestimonial(req.user!.companyId, id);
  res.json(successResponse(null, 'Testimonial deleted successfully'));
});
