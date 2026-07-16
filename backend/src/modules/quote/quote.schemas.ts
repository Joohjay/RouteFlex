import { z } from 'zod';
import { CargoType, VehicleType } from '@prisma/client';

export const quoteEstimateSchema = z.object({
  pickup: z.string().min(1).max(500),
  destination: z.string().min(1).max(500),
  cargoType: z.nativeEnum(CargoType),
  weight: z.number().positive(),
  vehicleType: z.nativeEnum(VehicleType),
  distanceKm: z.number().positive().optional(),
});

export const createQuoteSchema = z.object({
  requestId: z.string().cuid(),
  basePrice: z.number().nonnegative(),
  distancePrice: z.number().nonnegative(),
  weightPrice: z.number().nonnegative(),
  vehiclePrice: z.number().nonnegative().default(0),
  extrasPrice: z.number().nonnegative().default(0),
  taxPrice: z.number().nonnegative().default(0),
  totalPrice: z.number().positive(),
  distanceKm: z.number().nonnegative().optional(),
  notes: z.string().max(5000).optional().or(z.literal('')),
  validUntil: z.string().datetime().optional(),
});

export const updateQuoteSchema = createQuoteSchema.partial();

export type QuoteEstimateInput = z.infer<typeof quoteEstimateSchema>;
export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>;
