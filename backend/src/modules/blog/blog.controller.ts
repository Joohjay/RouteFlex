import type { Request, Response } from 'express';
import { asyncHandler } from '@/utils/async-handler.js';
import { successResponse } from '@/utils/response.js';
import * as blogService from './blog.service.js';
import type { BlogPostInput, BlogPostUpdateInput } from './blog.schemas.js';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const posts = await blogService.listBlogPosts(req.user!.companyId);
  res.json(successResponse(posts));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  const post = await blogService.getBlogPostById(req.user!.companyId, id);
  res.json(successResponse(post));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const input = req.validatedBody as BlogPostInput;
  const post = await blogService.createBlogPost(req.user!.companyId, req.user!.id, input);
  res.status(201).json(successResponse(post, 'Blog post created successfully'));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  const input = req.validatedBody as BlogPostUpdateInput;
  const post = await blogService.updateBlogPost(req.user!.companyId, id, input);
  res.json(successResponse(post, 'Blog post updated successfully'));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.validatedParams as { id: string };
  await blogService.deleteBlogPost(req.user!.companyId, id);
  res.json(successResponse(null, 'Blog post deleted successfully'));
});
