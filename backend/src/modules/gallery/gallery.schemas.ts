import { z } from 'zod';

export const gallerySchema = z.object({
  title: z.string().max(200).optional().or(z.literal('')),
  description: z.string().max(2000).optional().or(z.literal('')),
  imageUrl: z.string().url(),
  publicId: z.string().optional(),
  category: z.string().max(100).optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const galleryUpdateSchema = gallerySchema.partial();

export type GalleryInput = z.infer<typeof gallerySchema>;
export type GalleryUpdateInput = z.infer<typeof galleryUpdateSchema>;
