import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Company, Fleet, Gallery, Service, Settings, Testimonial, BlogPost } from '@/types';

export function usePublicProfile() {
  return useQuery({
    queryKey: ['public', 'profile'],
    queryFn: async () => {
      const response = await api.get(`/public/profile`);
      return response.data.data as { company: Company; settings: Settings };
    },
  });
}

export function usePublicServices() {
  return useQuery({
    queryKey: ['public', 'services'],
    queryFn: async () => {
      const response = await api.get(`/public/services`);
      return response.data.data as Service[];
    },
  });
}

export function usePublicFleet() {
  return useQuery({
    queryKey: ['public', 'fleet'],
    queryFn: async () => {
      const response = await api.get(`/public/fleet`);
      return response.data.data as Fleet[];
    },
  });
}

export function usePublicGallery(category?: string) {
  return useQuery({
    queryKey: ['public', 'gallery', category],
    queryFn: async () => {
      const response = await api.get(`/public/gallery`, { params: { category } });
      return response.data.data as Gallery[];
    },
  });
}

export function usePublicTestimonials() {
  return useQuery({
    queryKey: ['public', 'testimonials'],
    queryFn: async () => {
      const response = await api.get(`/public/testimonials`);
      return response.data.data as Testimonial[];
    },
  });
}

export function usePublicBlogPosts(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['public', 'blog', page, limit],
    queryFn: async () => {
      const response = await api.get(`/public/blog`, { params: { page, limit } });
      return response.data as { data: BlogPost[]; meta: { total: number; pages: number } };
    },
  });
}

export function usePublicBlogPost(slug: string) {
  return useQuery({
    queryKey: ['public', 'blog', slug],
    queryFn: async () => {
      const response = await api.get(`/public/blog/${slug}`);
      return response.data.data as BlogPost;
    },
    enabled: !!slug,
  });
}
