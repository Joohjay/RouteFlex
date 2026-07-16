import { z } from 'zod';

export const settingsSchema = z.object({
  primaryColor: z.string().max(20).optional(),
  secondaryColor: z.string().max(20).optional(),
  faviconUrl: z.string().url().optional().or(z.literal('')),
  supportEmail: z.string().email().optional().or(z.literal('')),
  supportPhone: z.string().max(50).optional().or(z.literal('')),
  bookingEmail: z.string().email().optional().or(z.literal('')),
  facebookUrl: z.string().url().optional().or(z.literal('')),
  instagramUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  twitterUrl: z.string().url().optional().or(z.literal('')),
  enableBlog: z.boolean().optional(),
  enableCareers: z.boolean().optional(),
  enableTestimonials: z.boolean().optional(),
  enableQuoteEstimator: z.boolean().optional(),
  enableWhatsApp: z.boolean().optional(),
  enableOnlineBooking: z.boolean().optional(),
  defaultMetaTitle: z.string().max(300).optional().or(z.literal('')),
  defaultMetaDescription: z.string().max(500).optional().or(z.literal('')),
  googleAnalyticsId: z.string().max(100).optional().or(z.literal('')),
  googleMapsApiKey: z.string().max(200).optional().or(z.literal('')),
  whatsappNumber: z.string().max(50).optional().or(z.literal('')),
  defaultCurrency: z.string().length(3).optional(),
  taxRate: z.number().min(0).max(100).optional(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
