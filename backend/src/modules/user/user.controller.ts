import type { Request, Response } from 'express';
import { asyncHandler } from '@/utils/async-handler.js';
import { successResponse } from '@/utils/response.js';
import * as userService from './user.service.js';
import type { CreateUserInput, UpdateUserInput } from './user.schemas.js';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.listUsers(req.user!.companyId);
  res.json(successResponse(users));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  const user = await userService.getUserById(req.user!.companyId, id);
  res.json(successResponse(user));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validatedBody as CreateUserInput;
  const user = await userService.createUser(req.user!.companyId, input, req.user!.role);
  res.status(201).json(successResponse(user, 'User created successfully'));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  const input = req.validatedBody as UpdateUserInput;
  const user = await userService.updateUser(req.user!.companyId, id, input, req.user!.role);
  res.json(successResponse(user, 'User updated successfully'));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  await userService.deleteUser(req.user!.companyId, id);
  res.json(successResponse(null, 'User deleted successfully'));
});
