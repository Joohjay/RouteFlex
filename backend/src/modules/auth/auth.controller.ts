import type { Request, Response } from 'express';
import { rotateRefreshToken, revokeRefreshToken } from '@/lib/token.js';
import { asyncHandler } from '@/utils/async-handler.js';
import { successResponse } from '@/utils/response.js';
import * as authService from './auth.service.js';
import type { LoginInput, RegisterInput } from './auth.schemas.js';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validatedBody as LoginInput;
  const result = await authService.login(input);
  res.json(successResponse(result, 'Login successful'));
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validatedBody as RegisterInput;
  const companyId = req.company?.id;

  if (!companyId) {
    throw new Error('Company context is required');
  }

  const result = await authService.register(companyId, input);
  res.status(201).json(successResponse(result, 'User created successfully'));
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.validatedBody as { refreshToken: string };
  const tokens = await rotateRefreshToken(refreshToken);
  res.json(successResponse(tokens, 'Token refreshed'));
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.validatedBody as { refreshToken: string };
  await revokeRefreshToken(refreshToken);
  res.json(successResponse(null, 'Logged out successfully'));
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getMe(req.user!.id);
  res.json(successResponse(user, 'User profile retrieved'));
});
