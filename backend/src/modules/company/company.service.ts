import { prisma } from '@/lib/prisma.js';
import { ConflictError, NotFoundError } from '@/utils/errors.js';
import type { CompanyInput, CompanyUpdateInput } from './company.schemas.js';

export async function listCompanies() {
  return prisma.company.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getCompanyById(id: string) {
  const company = await prisma.company.findUnique({
    where: { id },
    include: { settings: true },
  });

  if (!company) {
    throw new NotFoundError('Company');
  }

  return company;
}

export async function getCompanyBySlug(slug: string) {
  return prisma.company.findUnique({
    where: { slug, isActive: true },
    include: { settings: true },
  });
}

export async function createCompany(input: CompanyInput) {
  const existing = await prisma.company.findUnique({
    where: { slug: input.slug },
  });

  if (existing) {
    throw new ConflictError('A company with this slug already exists');
  }

  return prisma.company.create({
    data: {
      ...input,
      logoUrl: input.logoUrl || null,
      whatsapp: input.whatsapp || null,
      address: input.address || null,
      city: input.city || null,
      country: input.country || null,
    },
    include: { settings: true },
  });
}

export async function updateCompany(id: string, input: CompanyUpdateInput) {
  const company = await prisma.company.findUnique({ where: { id } });

  if (!company) {
    throw new NotFoundError('Company');
  }

  if (input.slug && input.slug !== company.slug) {
    const existing = await prisma.company.findUnique({ where: { slug: input.slug } });
    if (existing) {
      throw new ConflictError('A company with this slug already exists');
    }
  }

  return prisma.company.update({
    where: { id },
    data: {
      ...input,
      logoUrl: input.logoUrl || null,
      whatsapp: input.whatsapp || null,
      address: input.address || null,
      city: input.city || null,
      country: input.country || null,
    },
    include: { settings: true },
  });
}

export async function deleteCompany(id: string) {
  const company = await prisma.company.findUnique({ where: { id } });

  if (!company) {
    throw new NotFoundError('Company');
  }

  await prisma.company.delete({ where: { id } });
}
