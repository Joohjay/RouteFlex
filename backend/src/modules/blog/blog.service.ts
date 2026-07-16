import { prisma } from '@/lib/prisma.js';
import { ConflictError, NotFoundError } from '@/utils/errors.js';
import type { BlogPostInput, BlogPostUpdateInput } from './blog.schemas.js';

export async function listBlogPosts(companyId: string) {
  return prisma.blogPost.findMany({
    where: { companyId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getBlogPostById(companyId: string, id: string) {
  const post = await prisma.blogPost.findFirst({
    where: { id, companyId },
  });

  if (!post) {
    throw new NotFoundError('Blog post');
  }

  return post;
}

export async function createBlogPost(companyId: string, authorId: string, input: BlogPostInput) {
  const existing = await prisma.blogPost.findUnique({
    where: { companyId_slug: { companyId, slug: input.slug } },
  });

  if (existing) {
    throw new ConflictError('A blog post with this slug already exists');
  }

  return prisma.blogPost.create({
    data: {
      companyId,
      authorId,
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt || null,
      content: input.content,
      coverImage: input.coverImage || null,
      status: input.status,
      publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
      metaTitle: input.metaTitle || null,
      metaDescription: input.metaDescription || null,
      tags: input.tags,
    },
  });
}

export async function updateBlogPost(
  companyId: string,
  id: string,
  input: BlogPostUpdateInput
) {
  const post = await prisma.blogPost.findFirst({
    where: { id, companyId },
  });

  if (!post) {
    throw new NotFoundError('Blog post');
  }

  if (input.slug && input.slug !== post.slug) {
    const existing = await prisma.blogPost.findUnique({
      where: { companyId_slug: { companyId, slug: input.slug } },
    });
    if (existing) {
      throw new ConflictError('A blog post with this slug already exists');
    }
  }

  return prisma.blogPost.update({
    where: { id },
    data: {
      ...(input.title && { title: input.title }),
      ...(input.slug && { slug: input.slug }),
      ...(input.excerpt !== undefined && { excerpt: input.excerpt || null }),
      ...(input.content && { content: input.content }),
      ...(input.coverImage !== undefined && { coverImage: input.coverImage || null }),
      ...(input.status && { status: input.status }),
      ...(input.publishedAt !== undefined && {
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
      }),
      ...(input.metaTitle !== undefined && { metaTitle: input.metaTitle || null }),
      ...(input.metaDescription !== undefined && { metaDescription: input.metaDescription || null }),
      ...(input.tags && { tags: input.tags }),
    },
  });
}

export async function deleteBlogPost(companyId: string, id: string) {
  const post = await prisma.blogPost.findFirst({
    where: { id, companyId },
  });

  if (!post) {
    throw new NotFoundError('Blog post');
  }

  await prisma.blogPost.delete({ where: { id } });
}
