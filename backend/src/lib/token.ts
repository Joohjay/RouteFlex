import jwt, { type SignOptions } from 'jsonwebtoken';
import { config } from '@/config/index.js';
import { prisma } from '@/lib/prisma.js';
import type { UserRole } from '@prisma/client';
import { UnauthorizedError } from '@/utils/errors.js';

export interface TokenPayload {
  id: string;
  companyId: string;
  email: string;
  role: UserRole;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export function generateAccessToken(payload: TokenPayload): string {
  const options: SignOptions = { expiresIn: config.JWT_EXPIRES_IN as SignOptions['expiresIn'] };
  return jwt.sign(payload, config.JWT_SECRET, options);
}

export function generateRefreshToken(payload: TokenPayload): string {
  const options: SignOptions = { expiresIn: config.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'] };
  return jwt.sign({ id: payload.id }, config.JWT_REFRESH_SECRET, options);
}

export function generateTokens(payload: TokenPayload): Tokens {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  const decoded = jwt.decode(accessToken) as { exp: number } | null;
  return {
    accessToken,
    refreshToken,
    expiresIn: decoded?.exp ? decoded.exp * 1000 : Date.now() + 15 * 60 * 1000,
  };
}

export async function createRefreshToken(userId: string): Promise<string> {
  const token = generateRefreshToken({ id: userId } as TokenPayload);
  const decoded = jwt.decode(token) as { exp: number };

  await prisma.refreshToken.create({
    data: {
      userId,
      token,
      expiresAt: new Date(decoded.exp * 1000),
    },
  });

  return token;
}

export async function rotateRefreshToken(oldToken: string): Promise<Tokens> {
  const stored = await prisma.refreshToken.findUnique({
    where: { token: oldToken },
    include: { user: { include: { company: true } } },
  });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  const payload: TokenPayload = {
    id: stored.user.id,
    companyId: stored.user.companyId,
    email: stored.user.email,
    role: stored.user.role,
  };

  const tokens = generateTokens(payload);
  await createRefreshToken(stored.user.id);

  return tokens;
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { token },
    data: { revokedAt: new Date() },
  });
}

export async function revokeAllUserRefreshTokens(userId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
