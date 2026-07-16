import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config/index.js';
import { prisma } from '@/lib/prisma.js';
import { UnauthorizedError, ForbiddenError } from '@/utils/errors.js';
import type { UserRole } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  companyId: string;
  email: string;
  role: UserRole;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or invalid authorization header'));
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next(new UnauthorizedError('Missing token'));
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
}

export async function requireCompanyAccess(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.user) {
    return next(new UnauthorizedError());
  }

  const company = await prisma.company.findUnique({
    where: { id: req.user.companyId, isActive: true },
  });

  if (!company) {
    return next(new ForbiddenError('Company access denied'));
  }

  next();
}
