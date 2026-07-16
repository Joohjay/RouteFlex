import bcrypt from 'bcryptjs';
import { UserRole, UserStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma.js';
import { createRefreshToken, generateTokens, revokeAllUserRefreshTokens } from '@/lib/token.js';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  UnauthorizedError,
} from '@/utils/errors.js';
import type { LoginInput, RegisterInput, ChangePasswordInput, UpdateProfileInput } from './auth.schemas.js';

export async function login(input: LoginInput) {
  const user = await prisma.user.findFirst({
    where: { email: input.email },
    include: { company: true },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new ForbiddenError('Account is not active');
  }

  if (!user.company.isActive) {
    throw new ForbiddenError('Company account is suspended');
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const tokens = generateTokens({
    id: user.id,
    companyId: user.companyId,
    email: user.email,
    role: user.role,
  });

  await createRefreshToken(user.id);

  return {
    tokens,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      role: user.role,
      status: user.status,
      company: {
        id: user.company.id,
        name: user.company.name,
        slug: user.company.slug,
        logoUrl: user.company.logoUrl,
        currency: user.company.currency,
      },
    },
  };
}

export async function register(companyId: string, input: RegisterInput, creatorRole?: UserRole) {
  const existing = await prisma.user.findFirst({
    where: { email: input.email },
  });

  if (existing) {
    throw new ConflictError('An account with this email already exists');
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId, isActive: true },
  });

  if (!company) {
    throw new BadRequestError('Invalid company');
  }

  // Only admins can create other admins
  const role = input.role === UserRole.ADMIN && creatorRole !== UserRole.ADMIN
    ? UserRole.MANAGER
    : (input.role ?? UserRole.MANAGER);

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      companyId,
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      role,
      status: UserStatus.ACTIVE,
    },
    include: { company: true },
  });

  const tokens = generateTokens({
    id: user.id,
    companyId: user.companyId,
    email: user.email,
    role: user.role,
  });

  await createRefreshToken(user.id);

  return {
    tokens,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      role: user.role,
      status: user.status,
      company: {
        id: user.company.id,
        name: user.company.name,
        slug: user.company.slug,
        logoUrl: user.company.logoUrl,
        currency: user.company.currency,
      },
    },
  };
}

export async function changePassword(userId: string, input: ChangePasswordInput) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new UnauthorizedError();
  }

  const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);
  if (!valid) {
    throw new BadRequestError('Current password is incorrect');
  }

  const newHash = await bcrypt.hash(input.newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newHash },
  });

  await revokeAllUserRefreshTokens(userId);
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(input.firstName && { firstName: input.firstName }),
      ...(input.lastName && { lastName: input.lastName }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.avatarUrl !== undefined && { avatarUrl: input.avatarUrl || null }),
    },
    include: { company: true },
  });

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    role: user.role,
    status: user.status,
    company: {
      id: user.company.id,
      name: user.company.name,
      slug: user.company.slug,
      logoUrl: user.company.logoUrl,
      currency: user.company.currency,
    },
  };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { company: true },
  });

  if (!user) {
    throw new UnauthorizedError();
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    role: user.role,
    status: user.status,
    company: {
      id: user.company.id,
      name: user.company.name,
      slug: user.company.slug,
      logoUrl: user.company.logoUrl,
      currency: user.company.currency,
    },
  };
}
