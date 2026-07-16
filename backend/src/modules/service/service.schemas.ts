import { z } from 'zod';

export const serviceSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  summary: z.string().max(500).optional().or(z.literal('')),
  description: z.string().max(10000).optional().or(z.literal('')),
  icon: z.string().max(100).optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const serviceUpdateSchema = serviceSchema.partial();

export type ServiceInput = z.infer<typeof serviceSchema>;
export type ServiceUpdateInput = z.infer<typeof serviceUpdateSchema>;
