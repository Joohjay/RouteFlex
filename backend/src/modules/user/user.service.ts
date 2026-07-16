import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma.js';
import { ConflictError, ForbiddenError, NotFoundError } from '@/utils/errors.js';
import type { CreateUserInput, UpdateUserInput } from './user.schemas.js';
import type { UserRole } from '@prisma/client';

function stripPassword<T extends { passwordHash: string }>(user: T): Omit<T, 'passwordHash'> {
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
}

export async function listUsers(companyId: string) {
  const users = await prisma.user.findMany({
    where: { companyId },
    orderBy: { createdAt: 'desc' },
  });
  return users.map((u) => stripPassword(u));
}

export async function getUserById(companyId: string, id: string) {
  const user = await prisma.user.findFirst({
    where: { id, companyId },
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  return stripPassword(user);
}

export async function createUser(companyId: string, input: CreateUserInput, creatorRole: UserRole) {
  const existing = await prisma.user.findFirst({
    where: { email: input.email },
  });

  if (existing) {
    throw new ConflictError('A user with this email already exists');
  }

  if (input.role === 'ADMIN' && creatorRole !== 'ADMIN') {
    throw new ForbiddenError('Only admins can create admin users');
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      companyId,
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone || null,
      role: input.role,
      status: input.status,
    },
  });

  return stripPassword(user);
}

export async function updateUser(companyId: string, id: string, input: UpdateUserInput, editorRole: UserRole) {
  const user = await prisma.user.findFirst({
    where: { id, companyId },
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  if (input.role === 'ADMIN' && editorRole !== 'ADMIN' && user.role !== 'ADMIN') {
    throw new ForbiddenError('Only admins can assign admin role');
  }

  if (user.role === 'ADMIN' && input.role && input.role !== 'ADMIN' && editorRole !== 'ADMIN') {
    throw new ForbiddenError('Only admins can demote admins');
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(input.firstName && { firstName: input.firstName }),
      ...(input.lastName && { lastName: input.lastName }),
      ...(input.phone !== undefined && { phone: input.phone || null }),
      ...(input.role && { role: input.role }),
      ...(input.status && { status: input.status }),
    },
  });

  return stripPassword(updated);
}

export async function deleteUser(companyId: string, id: string) {
  const user = await prisma.user.findFirst({
    where: { id, companyId },
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  await prisma.user.delete({ where: { id } });
}
