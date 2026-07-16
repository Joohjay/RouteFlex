import type { NextFunction, Request, Response } from 'express';
import { prisma } from '@/lib/prisma.js';
import { NotFoundError } from '@/utils/errors.js';

export const DEFAULT_COMPANY_SLUG = 'jj-transport';

export async function resolvePublicCompany(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const slug = (req.params.companySlug as string | undefined) ?? DEFAULT_COMPANY_SLUG;

  const company = await prisma.company.findUnique({
    where: { slug, isActive: true },
    include: { settings: true },
  });

  if (!company) {
    return next(new NotFoundError('Company'));
  }

  req.company = company;
  next();
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      company?: Awaited<ReturnType<typeof prisma.company.findUnique>>;
    }
  }
}
