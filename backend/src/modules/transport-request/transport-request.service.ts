import { RequestStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma.js';
import { NotFoundError } from '@/utils/errors.js';
import { generateUniqueReferenceNumber } from '@/utils/reference.js';
import { estimateQuote } from '@/modules/pricing-rule/pricing-rule.service.js';
import type { CreateTransportRequestInput, UpdateTransportRequestInput } from './transport-request.schemas.js';

export async function listTransportRequests(companyId: string) {
  return prisma.transportRequest.findMany({
    where: { companyId },
    include: {
      customer: true,
      quotes: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getTransportRequestById(companyId: string, id: string) {
  const request = await prisma.transportRequest.findFirst({
    where: { id, companyId },
    include: {
      customer: true,
      quotes: { orderBy: { createdAt: 'desc' } },
      statusHistory: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!request) {
    throw new NotFoundError('Transport request');
  }

  return request;
}

export async function trackTransportRequest(referenceNumber: string) {
  const request = await prisma.transportRequest.findUnique({
    where: { referenceNumber },
    include: {
      company: {
        select: {
          name: true,
          phone: true,
          email: true,
          whatsapp: true,
        },
      },
      quotes: { orderBy: { createdAt: 'desc' }, take: 1 },
      statusHistory: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!request) {
    throw new NotFoundError('Transport request');
  }

  return request;
}

export async function createTransportRequest(
  companyId: string,
  input: CreateTransportRequestInput,
  metadata?: { ipAddress?: string; userAgent?: string }
) {
  const estimate = await estimateQuote(companyId, {
    pickup: input.pickupLocation,
    destination: input.destination,
    cargoType: input.cargoType,
    weight: input.weight,
    vehicleType: input.vehicleType,
  });

  const referenceNumber = await generateUniqueReferenceNumber();

  // Find or create customer
  let customer = await prisma.customer.findFirst({
    where: { companyId, email: input.email },
  });

  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        companyId,
        name: input.name,
        email: input.email,
        phone: input.phone,
      },
    });
  }

  const request = await prisma.transportRequest.create({
    data: {
      companyId,
      customerId: customer.id,
      referenceNumber,
      name: input.name,
      email: input.email,
      phone: input.phone,
      pickupLocation: input.pickupLocation,
      pickupLat: input.pickupLat ?? null,
      pickupLng: input.pickupLng ?? null,
      destination: input.destination,
      destinationLat: input.destinationLat ?? null,
      destinationLng: input.destinationLng ?? null,
      cargoType: input.cargoType,
      weight: input.weight,
      vehicleType: input.vehicleType,
      preferredPickupDate: input.preferredPickupDate ? new Date(input.preferredPickupDate) : null,
      notes: input.notes || null,
      estimatedDistance: estimate.distanceKm,
      estimatedPrice: estimate.totalPrice,
      source: 'website',
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
      statusHistory: {
        create: {
          status: RequestStatus.REQUEST_SUBMITTED,
          note: 'Request submitted via website',
        },
      },
    },
    include: {
      company: {
        select: {
          name: true,
          phone: true,
          email: true,
          whatsapp: true,
        },
      },
    },
  });

  return { request, estimate };
}

export async function updateTransportRequest(
  companyId: string,
  id: string,
  input: UpdateTransportRequestInput,
  editorId: string
) {
  const existing = await prisma.transportRequest.findFirst({
    where: { id, companyId },
  });

  if (!existing) {
    throw new NotFoundError('Transport request');
  }

  const statusChanged = input.status && input.status !== existing.status;

  const updated = await prisma.transportRequest.update({
    where: { id },
    data: {
      ...(input.name && { name: input.name }),
      ...(input.email && { email: input.email }),
      ...(input.phone && { phone: input.phone }),
      ...(input.pickupLocation && { pickupLocation: input.pickupLocation }),
      ...(input.destination && { destination: input.destination }),
      ...(input.cargoType && { cargoType: input.cargoType }),
      ...(input.weight && { weight: input.weight }),
      ...(input.vehicleType && { vehicleType: input.vehicleType }),
      ...(input.preferredPickupDate !== undefined && {
        preferredPickupDate: input.preferredPickupDate ? new Date(input.preferredPickupDate) : null,
      }),
      ...(input.notes !== undefined && { notes: input.notes || null }),
      ...(input.status && { status: input.status }),
    },
  });

  if (statusChanged && input.status) {
    await prisma.statusHistory.create({
      data: {
        requestId: id,
        status: input.status,
        note: `Status updated to ${input.status.replace(/_/g, ' ')}`,
        createdById: editorId,
      },
    });
  }

  return updated;
}

export async function deleteTransportRequest(companyId: string, id: string) {
  const request = await prisma.transportRequest.findFirst({
    where: { id, companyId },
  });

  if (!request) {
    throw new NotFoundError('Transport request');
  }

  await prisma.transportRequest.delete({ where: { id } });
}
