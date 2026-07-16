import { Router } from 'express';
import { authenticate, requireRole } from '@/middleware/auth.js';
import * as dashboardController from './dashboard.controller.js';

export const dashboardRoutes = Router();

dashboardRoutes.use(authenticate, requireRole('ADMIN', 'MANAGER', 'DISPATCHER'));

dashboardRoutes.get('/stats', dashboardController.getStats);
dashboardRoutes.get('/monthly', dashboardController.getMonthlyStats);
