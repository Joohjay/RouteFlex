import { z } from 'zod';
import { BlogPostStatus } from '@prisma/client';

export const blogPostSchema = z.object({
  title: z.string().min(1).max(300),
  slug: z.string().min(1).max(150).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(1000).optional().or(z.literal('')),
  content: z.string().min(1).max(50000),
  coverImage: z.string().url().optional().or(z.literal('')),
  status: z.nativeEnum(BlogPostStatus).default('DRAFT'),
  publishedAt: z.string().datetime().optional().or(z.literal('')),
  metaTitle: z.string().max(300).optional().or(z.literal('')),
  metaDescription: z.string().max(500).optional().or(z.literal('')),
  tags: z.array(z.string().max(50)).max(50).default([]),
});

export const blogPostUpdateSchema = blogPostSchema.partial();

export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type BlogPostUpdateInput = z.infer<typeof blogPostUpdateSchema>;
