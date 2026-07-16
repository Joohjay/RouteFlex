import { RequestStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma.js';
import { BadRequestError, NotFoundError } from '@/utils/errors.js';
import type { CreateQuoteInput, UpdateQuoteInput } from './quote.schemas.js';

export async function listQuotes(companyId: string) {
  return prisma.quote.findMany({
    where: { companyId },
    include: { request: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getQuoteById(companyId: string, id: string) {
  const quote = await prisma.quote.findFirst({
    where: { id, companyId },
    include: { request: true },
  });

  if (!quote) {
    throw new NotFoundError('Quote');
  }

  return quote;
}

export async function createQuote(companyId: string, creatorId: string, input: CreateQuoteInput) {
  const request = await prisma.transportRequest.findFirst({
    where: { id: input.requestId, companyId },
  });

  if (!request) {
    throw new NotFoundError('Transport request');
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  const currency = company?.currency ?? 'USD';

  const quote = await prisma.$transaction(async (tx) => {
    const newQuote = await tx.quote.create({
      data: {
        companyId,
        requestId: input.requestId,
        basePrice: input.basePrice,
        distancePrice: input.distancePrice,
        weightPrice: input.weightPrice,
        vehiclePrice: input.vehiclePrice,
        extrasPrice: input.extrasPrice,
        taxPrice: input.taxPrice,
        totalPrice: input.totalPrice,
        currency,
        distanceKm: input.distanceKm ?? null,
        notes: input.notes || null,
        validUntil: input.validUntil ? new Date(input.validUntil) : null,
        createdById: creatorId,
      },
    });

    await tx.transportRequest.update({
      where: { id: input.requestId },
      data: { status: RequestStatus.QUOTE_PREPARED },
    });

    await tx.statusHistory.create({
      data: {
        requestId: input.requestId,
        status: RequestStatus.QUOTE_PREPARED,
        note: 'Quote prepared and sent to customer',
        createdById: creatorId,
      },
    });

    return newQuote;
  });

  return quote;
}

export async function updateQuote(companyId: string, id: string, input: UpdateQuoteInput) {
  const quote = await prisma.quote.findFirst({
    where: { id, companyId },
  });

  if (!quote) {
    throw new NotFoundError('Quote');
  }

  if (quote.isAccepted) {
    throw new BadRequestError('Cannot modify an accepted quote');
  }

  return prisma.quote.update({
    where: { id },
    data: {
      ...(input.basePrice !== undefined && { basePrice: input.basePrice }),
      ...(input.distancePrice !== undefined && { distancePrice: input.distancePrice }),
      ...(input.weightPrice !== undefined && { weightPrice: input.weightPrice }),
      ...(input.vehiclePrice !== undefined && { vehiclePrice: input.vehiclePrice }),
      ...(input.extrasPrice !== undefined && { extrasPrice: input.extrasPrice }),
      ...(input.taxPrice !== undefined && { taxPrice: input.taxPrice }),
      ...(input.totalPrice !== undefined && { totalPrice: input.totalPrice }),
      ...(input.distanceKm !== undefined && { distanceKm: input.distanceKm ?? null }),
      ...(input.notes !== undefined && { notes: input.notes || null }),
      ...(input.validUntil !== undefined && {
        validUntil: input.validUntil ? new Date(input.validUntil) : null,
      }),
    },
  });
}

export async function acceptQuote(companyId: string, id: string) {
  const quote = await prisma.quote.findFirst({
    where: { id, companyId },
  });

  if (!quote) {
    throw new NotFoundError('Quote');
  }

  if (quote.validUntil && quote.validUntil < new Date()) {
    throw new BadRequestError('Quote has expired');
  }

  await prisma.$transaction(async (tx) => {
    await tx.quote.update({
      where: { id },
      data: { isAccepted: true, acceptedAt: new Date() },
    });

    await tx.transportRequest.update({
      where: { id: quote.requestId },
      data: { status: RequestStatus.BOOKING_CONFIRMED },
    });

    await tx.statusHistory.create({
      data: {
        requestId: quote.requestId,
        status: RequestStatus.BOOKING_CONFIRMED,
        note: 'Quote accepted by customer',
      },
    });
  });
}

export async function deleteQuote(companyId: string, id: string) {
  const quote = await prisma.quote.findFirst({
    where: { id, companyId },
  });

  if (!quote) {
    throw new NotFoundError('Quote');
  }

  await prisma.quote.delete({ where: { id } });
}
