import { prisma } from '@/lib/prisma.js';
import { NotFoundError } from '@/utils/errors.js';
import type { GalleryInput, GalleryUpdateInput } from './gallery.schemas.js';

export async function listGallery(companyId: string) {
  return prisma.gallery.findMany({
    where: { companyId },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function getGalleryById(companyId: string, id: string) {
  const item = await prisma.gallery.findFirst({
    where: { id, companyId },
  });

  if (!item) {
    throw new NotFoundError('Gallery item');
  }

  return item;
}

export async function createGallery(companyId: string, input: GalleryInput) {
  return prisma.gallery.create({
    data: {
      companyId,
      title: input.title || null,
      description: input.description || null,
      imageUrl: input.imageUrl,
      publicId: input.publicId,
      category: input.category || null,
      isActive: input.isActive,
      sortOrder: input.sortOrder,
    },
  });
}

export async function updateGallery(companyId: string, id: string, input: GalleryUpdateInput) {
  const item = await prisma.gallery.findFirst({
    where: { id, companyId },
  });

  if (!item) {
    throw new NotFoundError('Gallery item');
  }

  return prisma.gallery.update({
    where: { id },
    data: {
      ...(input.title !== undefined && { title: input.title || null }),
      ...(input.description !== undefined && { description: input.description || null }),
      ...(input.imageUrl && { imageUrl: input.imageUrl }),
      ...(input.publicId !== undefined && { publicId: input.publicId }),
      ...(input.category !== undefined && { category: input.category || null }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
      ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
    },
  });
}

export async function deleteGallery(companyId: string, id: string) {
  const item = await prisma.gallery.findFirst({
    where: { id, companyId },
  });

  if (!item) {
    throw new NotFoundError('Gallery item');
  }

  await prisma.gallery.delete({ where: { id } });
}
