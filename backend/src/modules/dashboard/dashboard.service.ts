import { RequestStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma.js';

export async function getDashboardStats(companyId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    totalRequests,
    newRequests,
    completedDeliveries,
    monthlyRequests,
    lastMonthRequests,
    requestsByStatus,
    popularRoutes,
    popularServices,
    fleetOverview,
    recentRequests,
  ] = await Promise.all([
    prisma.transportRequest.count({ where: { companyId } }),
    prisma.transportRequest.count({
      where: { companyId, status: RequestStatus.REQUEST_SUBMITTED },
    }),
    prisma.transportRequest.count({
      where: { companyId, status: RequestStatus.DELIVERED },
    }),
    prisma.transportRequest.count({
      where: { companyId, createdAt: { gte: startOfMonth } },
    }),
    prisma.transportRequest.count({
      where: {
        companyId,
        createdAt: { gte: startOfLastMonth, lt: startOfMonth },
      },
    }),
    prisma.transportRequest.groupBy({
      by: ['status'],
      where: { companyId },
      _count: { status: true },
    }),
    prisma.transportRequest.groupBy({
      by: ['pickupLocation', 'destination'],
      where: { companyId },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    }),
    prisma.transportRequest.groupBy({
      by: ['cargoType'],
      where: { companyId },
      _count: { cargoType: true },
      orderBy: { _count: { cargoType: 'desc' } },
      take: 5,
    }),
    prisma.fleet.groupBy({
      by: ['status'],
      where: { companyId },
      _count: { status: true },
    }),
    prisma.transportRequest.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        quotes: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    }),
  ]);

  const monthlyGrowth = lastMonthRequests === 0
    ? 100
    : Number((((monthlyRequests - lastMonthRequests) / lastMonthRequests) * 100).toFixed(1));

  return {
    totalRequests,
    newRequests,
    completedDeliveries,
    monthlyRequests,
    lastMonthRequests,
    monthlyGrowth,
    requestsByStatus: requestsByStatus.map((r) => ({
      status: r.status,
      count: r._count.status,
    })),
    popularRoutes: popularRoutes.map((r) => ({
      pickup: r.pickupLocation,
      destination: r.destination,
      count: r._count.id,
    })),
    popularServices: popularServices.map((s) => ({
      cargoType: s.cargoType,
      count: s._count.cargoType,
    })),
    fleetOverview: fleetOverview.map((f) => ({
      status: f.status,
      count: f._count.status,
    })),
    recentRequests,
  };
}

export async function getMonthlyStats(companyId: string, months = 12) {
  const now = new Date();
  const labels: string[] = [];
  const data: number[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const label = start.toLocaleString('default', { month: 'short', year: '2-digit' });

    const count = await prisma.transportRequest.count({
      where: {
        companyId,
        createdAt: { gte: start, lt: end },
      },
    });

    labels.push(label);
    data.push(count);
  }

  return { labels, data };
}
