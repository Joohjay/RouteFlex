import { prisma } from '@/lib/prisma.js';
import { NotFoundError } from '@/utils/errors.js';
import type { TestimonialInput, TestimonialUpdateInput } from './testimonial.schemas.js';

export async function listTestimonials(companyId: string) {
  return prisma.testimonial.findMany({
    where: { companyId },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function getTestimonialById(companyId: string, id: string) {
  const testimonial = await prisma.testimonial.findFirst({
    where: { id, companyId },
  });

  if (!testimonial) {
    throw new NotFoundError('Testimonial');
  }

  return testimonial;
}

export async function createTestimonial(companyId: string, input: TestimonialInput) {
  return prisma.testimonial.create({
    data: {
      companyId,
      author: input.author,
      role: input.role || null,
      company: input.company || null,
      content: input.content,
      rating: input.rating,
      avatarUrl: input.avatarUrl || null,
      isActive: input.isActive,
      sortOrder: input.sortOrder,
    },
  });
}

export async function updateTestimonial(
  companyId: string,
  id: string,
  input: TestimonialUpdateInput
) {
  const testimonial = await prisma.testimonial.findFirst({
    where: { id, companyId },
  });

  if (!testimonial) {
    throw new NotFoundError('Testimonial');
  }

  return prisma.testimonial.update({
    where: { id },
    data: {
      ...(input.author && { author: input.author }),
      ...(input.role !== undefined && { role: input.role || null }),
      ...(input.company !== undefined && { company: input.company || null }),
      ...(input.content && { content: input.content }),
      ...(input.rating && { rating: input.rating }),
      ...(input.avatarUrl !== undefined && { avatarUrl: input.avatarUrl || null }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
      ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
    },
  });
}

export async function deleteTestimonial(companyId: string, id: string) {
  const testimonial = await prisma.testimonial.findFirst({
    where: { id, companyId },
  });

  if (!testimonial) {
    throw new NotFoundError('Testimonial');
  }

  await prisma.testimonial.delete({ where: { id } });
}
