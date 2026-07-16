import { prisma } from '@/lib/prisma.js';
import { ConflictError, NotFoundError } from '@/utils/errors.js';
import type { ServiceInput, ServiceUpdateInput } from './service.schemas.js';

export async function listServices(companyId: string) {
  return prisma.service.findMany({
    where: { companyId },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function getServiceById(companyId: string, id: string) {
  const service = await prisma.service.findFirst({
    where: { id, companyId },
  });

  if (!service) {
    throw new NotFoundError('Service');
  }

  return service;
}

export async function createService(companyId: string, input: ServiceInput) {
  const existing = await prisma.service.findUnique({
    where: { companyId_slug: { companyId, slug: input.slug } },
  });

  if (existing) {
    throw new ConflictError('A service with this slug already exists');
  }

  return prisma.service.create({
    data: {
      companyId,
      title: input.title,
      slug: input.slug,
      summary: input.summary || null,
      description: input.description || null,
      icon: input.icon || null,
      imageUrl: input.imageUrl || null,
      isActive: input.isActive,
      sortOrder: input.sortOrder,
    },
  });
}

export async function updateService(companyId: string, id: string, input: ServiceUpdateInput) {
  const service = await prisma.service.findFirst({
    where: { id, companyId },
  });

  if (!service) {
    throw new NotFoundError('Service');
  }

  if (input.slug && input.slug !== service.slug) {
    const existing = await prisma.service.findUnique({
      where: { companyId_slug: { companyId, slug: input.slug } },
    });
    if (existing) {
      throw new ConflictError('A service with this slug already exists');
    }
  }

  return prisma.service.update({
    where: { id },
    data: {
      ...(input.title && { title: input.title }),
      ...(input.slug && { slug: input.slug }),
      ...(input.summary !== undefined && { summary: input.summary || null }),
      ...(input.description !== undefined && { description: input.description || null }),
      ...(input.icon !== undefined && { icon: input.icon || null }),
      ...(input.imageUrl !== undefined && { imageUrl: input.imageUrl || null }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
      ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
    },
  });
}

export async function deleteService(companyId: string, id: string) {
  const service = await prisma.service.findFirst({
    where: { id, companyId },
  });

  if (!service) {
    throw new NotFoundError('Service');
  }

  await prisma.service.delete({ where: { id } });
}
