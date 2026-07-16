import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.string().cuid(),
});

export const slugParamSchema = z.object({
  slug: z.string().min(1),
});

export const paginationSchema = z.object({
  page: z.string().optional().transform((v) => (v ? Number(v) : 1)),
  limit: z.string().optional().transform((v) => {
    const n = v ? Number(v) : 20;
    return Math.min(Math.max(n, 1), 100);
  }),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type PaginationParams = z.infer<typeof paginationSchema>;
