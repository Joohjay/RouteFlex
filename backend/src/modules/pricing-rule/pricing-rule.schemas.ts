import { z } from 'zod';
import { CargoType, PricingRuleType, VehicleType } from '@prisma/client';

export const pricingRuleSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.nativeEnum(PricingRuleType),
  vehicleType: z.nativeEnum(VehicleType).optional(),
  cargoType: z.nativeEnum(CargoType).optional(),
  value: z.number().nonnegative(),
  minWeight: z.number().nonnegative().optional(),
  maxWeight: z.number().nonnegative().optional(),
  minDistance: z.number().nonnegative().optional(),
  maxDistance: z.number().nonnegative().optional(),
  isActive: z.boolean().default(true),
  priority: z.number().int().default(0),
  description: z.string().max(1000).optional().or(z.literal('')),
});

export const pricingRuleUpdateSchema = pricingRuleSchema.partial();

export type PricingRuleInput = z.infer<typeof pricingRuleSchema>;
export type PricingRuleUpdateInput = z.infer<typeof pricingRuleUpdateSchema>;
