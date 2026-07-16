import { z } from 'zod';
import { FleetStatus, VehicleType } from '@prisma/client';

export const fleetSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.nativeEnum(VehicleType),
  capacityKg: z.number().positive(),
  status: z.nativeEnum(FleetStatus).default('ACTIVE'),
  description: z.string().max(5000).optional().or(z.literal('')),
  features: z.array(z.string().max(100)).max(50).default([]),
  images: z.array(z.object({ url: z.string().url(), publicId: z.string().optional() })).default([]),
  sortOrder: z.number().int().default(0),
});

export const fleetUpdateSchema = fleetSchema.partial();

export type FleetInput = z.infer<typeof fleetSchema>;
export type FleetUpdateInput = z.infer<typeof fleetUpdateSchema>;
