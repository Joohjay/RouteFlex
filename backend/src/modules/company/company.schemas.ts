import { z } from 'zod';

export const companySchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase, numbers, and hyphens only'),
  tagline: z.string().max(300).optional(),
  description: z.string().max(5000).optional(),
  website: z.string().url().optional().or(z.literal('')),
  email: z.string().email(),
  phone: z.string().min(3).max(50),
  whatsapp: z.string().max(50).optional().or(z.literal('')),
  address: z.string().max(300).optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  country: z.string().max(100).optional().or(z.literal('')),
  timezone: z.string().max(100).default('UTC'),
  currency: z.string().length(3).default('USD'),
  logoUrl: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

export const companyUpdateSchema = companySchema.partial();

export type CompanyInput = z.infer<typeof companySchema>;
export type CompanyUpdateInput = z.infer<typeof companyUpdateSchema>;
