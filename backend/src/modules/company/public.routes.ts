import { Router } from 'express';
import { resolvePublicCompany } from '@/middleware/company.js';
import * as publicController from './public.controller.js';

export const publicRoutes = Router();

publicRoutes.use(resolvePublicCompany);

publicRoutes.get('/profile', publicController.getPublicProfile);
publicRoutes.get('/fleet', publicController.getPublicFleet);
publicRoutes.get('/services', publicController.getPublicServices);
publicRoutes.get('/gallery', publicController.getPublicGallery);
publicRoutes.get('/testimonials', publicController.getPublicTestimonials);
publicRoutes.get('/blog', publicController.getPublicBlogPosts);
publicRoutes.get('/blog/:slug', publicController.getPublicBlogPost);
