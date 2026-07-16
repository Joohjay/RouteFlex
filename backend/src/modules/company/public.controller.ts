import type { Request, Response } from 'express';
import { prisma } from '@/lib/prisma.js';
import { asyncHandler } from '@/utils/async-handler.js';
import { successResponse } from '@/utils/response.js';

export const getPublicProfile = asyncHandler(async (req: Request, res: Response) => {
  const companyId = req.company!.id;

  const [company, settings] = await Promise.all([
    prisma.company.findUnique({
      where: { id: companyId },
    }),
    prisma.setting.findUnique({
      where: { companyId },
    }),
  ]);

  res.json(successResponse({ company, settings }));
});

export const getPublicFleet = asyncHandler(async (req: Request, res: Response) => {
  const companyId = req.company!.id;
  const fleet = await prisma.fleet.findMany({
    where: { companyId, status: 'ACTIVE' },
    include: { images: { orderBy: { sortOrder: 'asc' } } },
    orderBy: { sortOrder: 'asc' },
  });
  res.json(successResponse(fleet));
});

export const getPublicServices = asyncHandler(async (req: Request, res: Response) => {
  const companyId = req.company!.id;
  const services = await prisma.service.findMany({
    where: { companyId, isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
  res.json(successResponse(services));
});

export const getPublicGallery = asyncHandler(async (req: Request, res: Response) => {
  const companyId = req.company!.id;
  const category = req.query.category as string | undefined;
  const gallery = await prisma.gallery.findMany({
    where: { companyId, isActive: true, ...(category ? { category } : {}) },
    orderBy: { sortOrder: 'asc' },
  });
  res.json(successResponse(gallery));
});

export const getPublicTestimonials = asyncHandler(async (req: Request, res: Response) => {
  const companyId = req.company!.id;
  const testimonials = await prisma.testimonial.findMany({
    where: { companyId, isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
  res.json(successResponse(testimonials));
});

export const getPublicBlogPosts = asyncHandler(async (req: Request, res: Response) => {
  const companyId = req.company!.id;
  const page = Number(req.query.page ?? 1);
  const limit = Math.min(Math.max(Number(req.query.limit ?? 10), 1), 50);
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: { companyId, status: 'PUBLISHED', publishedAt: { lte: new Date() } },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.blogPost.count({
      where: { companyId, status: 'PUBLISHED', publishedAt: { lte: new Date() } },
    }),
  ]);

  res.json(successResponse(posts, 'Blog posts retrieved', { page, limit, total, pages: Math.ceil(total / limit) }));
});

export const getPublicBlogPost = asyncHandler(async (req: Request, res: Response) => {
  const companyId = req.company!.id;
  const { slug } = req.params as { slug: string };

  const post = await prisma.blogPost.findFirst({
    where: { companyId, slug, status: 'PUBLISHED', publishedAt: { lte: new Date() } },
  });

  if (!post) {
    res.status(404).json({
      success: false,
      data: null,
      message: 'Blog post not found',
      error: { code: 'NOT_FOUND', message: 'Blog post not found' },
    });
    return;
  }

  await prisma.blogPost.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  });

  res.json(successResponse(post));
  return;
});
