import { prisma } from '@/lib/prisma.js';
import { NotFoundError } from '@/utils/errors.js';
import type { FleetInput, FleetUpdateInput } from './fleet.schemas.js';

export async function listFleet(companyId: string) {
  return prisma.fleet.findMany({
    where: { companyId },
    include: { images: { orderBy: { sortOrder: 'asc' } } },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function getFleetById(companyId: string, id: string) {
  const fleet = await prisma.fleet.findFirst({
    where: { id, companyId },
    include: { images: { orderBy: { sortOrder: 'asc' } } },
  });

  if (!fleet) {
    throw new NotFoundError('Fleet vehicle');
  }

  return fleet;
}

export async function createFleet(companyId: string, input: FleetInput) {
  return prisma.fleet.create({
    data: {
      companyId,
      name: input.name,
      type: input.type,
      capacityKg: input.capacityKg,
      status: input.status,
      description: input.description || null,
      features: input.features,
      sortOrder: input.sortOrder,
      images: {
        create: input.images.map((img, index) => ({
          url: img.url,
          publicId: img.publicId,
          sortOrder: index,
        })),
      },
    },
    include: { images: true },
  });
}

export async function updateFleet(companyId: string, id: string, input: FleetUpdateInput) {
  const fleet = await prisma.fleet.findFirst({
    where: { id, companyId },
    include: { images: true },
  });

  if (!fleet) {
    throw new NotFoundError('Fleet vehicle');
  }

  // If images are provided, replace existing images
  if (input.images) {
    await prisma.fleetImage.deleteMany({ where: { fleetId: id } });
  }

  return prisma.fleet.update({
    where: { id },
    data: {
      ...(input.name && { name: input.name }),
      ...(input.type && { type: input.type }),
      ...(input.capacityKg && { capacityKg: input.capacityKg }),
      ...(input.status && { status: input.status }),
      ...(input.description !== undefined && { description: input.description || null }),
      ...(input.features && { features: input.features }),
      ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
      ...(input.images && {
        images: {
          create: input.images.map((img, index) => ({
            url: img.url,
            publicId: img.publicId,
            sortOrder: index,
          })),
        },
      }),
    },
    include: { images: true },
  });
}

export async function deleteFleet(companyId: string, id: string) {
  const fleet = await prisma.fleet.findFirst({
    where: { id, companyId },
  });

  if (!fleet) {
    throw new NotFoundError('Fleet vehicle');
  }

  await prisma.fleet.delete({ where: { id } });
}
