import { z } from 'zod';

export const testimonialSchema = z.object({
  author: z.string().min(1).max(200),
  role: z.string().max(200).optional().or(z.literal('')),
  company: z.string().max(200).optional().or(z.literal('')),
  content: z.string().min(1).max(5000),
  rating: z.number().int().min(1).max(5).default(5),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const testimonialUpdateSchema = testimonialSchema.partial();

export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type TestimonialUpdateInput = z.infer<typeof testimonialUpdateSchema>;
