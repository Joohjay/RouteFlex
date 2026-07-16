import { z } from 'zod';
import { CargoType, RequestStatus, VehicleType } from '@prisma/client';

export const createTransportRequestSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().min(3).max(50),
  pickupLocation: z.string().min(1).max(500),
  pickupLat: z.number().optional(),
  pickupLng: z.number().optional(),
  destination: z.string().min(1).max(500),
  destinationLat: z.number().optional(),
  destinationLng: z.number().optional(),
  cargoType: z.nativeEnum(CargoType),
  weight: z.number().positive(),
  vehicleType: z.nativeEnum(VehicleType),
  preferredPickupDate: z.string().datetime().optional(),
  notes: z.string().max(5000).optional().or(z.literal('')),
});

export const updateTransportRequestSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(3).max(50).optional(),
  pickupLocation: z.string().min(1).max(500).optional(),
  destination: z.string().min(1).max(500).optional(),
  cargoType: z.nativeEnum(CargoType).optional(),
  weight: z.number().positive().optional(),
  vehicleType: z.nativeEnum(VehicleType).optional(),
  preferredPickupDate: z.string().datetime().optional().or(z.literal('')),
  notes: z.string().max(5000).optional().or(z.literal('')),
  status: z.nativeEnum(RequestStatus).optional(),
});

export const trackRequestSchema = z.object({
  referenceNumber: z.string().min(1),
});

export type CreateTransportRequestInput = z.infer<typeof createTransportRequestSchema>;
export type UpdateTransportRequestInput = z.infer<typeof updateTransportRequestSchema>;
