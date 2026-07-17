import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useDashboardReveal } from '@/animations/cinematic';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  FileText,
  CheckCircle,
  TrendingUp,
  Truck,
  Package,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/common/Loading';
import { api } from '@/lib/api';
import { formatDate, cn } from '@/lib/utils';
import { StatsCard } from '@/components/premium';
import type { TransportRequest } from '@/types';

interface DashboardStats {
  totalRequests: number;
  newRequests: number;
  completedDeliveries: number;
  monthlyRequests: number;
  lastMonthRequests: number;
  monthlyGrowth: number;
  requestsByStatus: Array<{ status: string; count: number }>;
  popularRoutes: Array<{ pickup: string; destination: string; count: number }>;
  popularServices: Array<{ cargoType: string; count: number }>;
  fleetOverview: Array<{ status: string; count: number }>;
  recentRequests: TransportRequest[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function RequestStatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: 'bg-gray-400',
    CONFIRMED: 'bg-blue-500',
    PICKED_UP: 'bg-[#C29A4A]',
    IN_TRANSIT: 'bg-blue-500',
    DELIVERED: 'bg-green-500',
    CANCELLED: 'bg-red-500',
  };
  return <span className={cn('h-2 w-2 rounded-full', colors[status] ?? 'bg-gray-400')} />;
}

export default function Dashboard() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useDashboardReveal(containerRef, []);
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await api.get('/dashboard/stats');
      return response.data.data;
    },
  });

  const { data: monthlyStats } = useQuery({
    queryKey: ['dashboard', 'monthly'],
    queryFn: async () => {
      const response = await api.get('/dashboard/monthly');
      return response.data.data as { labels: string[]; data: number[] };
    },
  });

  if (isLoading) {
    return <Loading className="min-h-[60vh]" />;
  }

  const chartData = monthlyStats
    ? monthlyStats.labels.map((label, index) => ({
        name: label,
        requests: monthlyStats.data[index],
      }))
    : [];

  return (
    <motion.div
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div data-dashboard-card variants={itemVariants}>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your logistics operations.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-dashboard-card>
        <StatsCard
          label="Total Requests"
          value={stats?.totalRequests ?? 0}
          icon={FileText}
        />
        <StatsCard
          label="New Requests"
          value={stats?.newRequests ?? 0}
          icon={Package}
          trend={`${stats?.monthlyGrowth ?? 0}% vs last month`}
          trendUp={(stats?.monthlyGrowth ?? 0) >= 0}
        />
        <StatsCard
          label="Completed Deliveries"
          value={stats?.completedDeliveries ?? 0}
          icon={CheckCircle}
        />
        <StatsCard
          label="Monthly Requests"
          value={stats?.monthlyRequests ?? 0}
          icon={TrendingUp}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2" data-dashboard-card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]" data-dashboard-chart>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid hsl(var(--border))',
                      background: 'hsl(var(--card))',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Bar
                    dataKey="requests"
                    fill="hsl(38 92% 50%)"
                    radius={[6, 6, 0, 0]}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4" data-dashboard-table>
              {(stats?.popularRoutes ?? []).length > 0 ? (
                stats!.popularRoutes.map((route, index) => (
                  <motion.div
                    key={index}
                    data-dashboard-row
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="group flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin size={18} className="text-[#C29A4A]" />
                      <span className="text-sm">
                        {route.pickup} <ArrowRight size={12} className="inline text-muted-foreground" /> {route.destination}
                      </span>
                    </div>
                    <span className="rounded-full bg-[#C29A4A]/10 px-3 py-1 text-xs font-medium text-[#C29A4A]">
                      {route.count} bookings
                    </span>
                  </motion.div>
                ))
              ) : (
                <p className="text-muted-foreground">No route data available yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fleet Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4" data-dashboard-table>
              {(stats?.fleetOverview ?? []).length > 0 ? (
                stats!.fleetOverview.map((item, index) => (
                  <motion.div
                    key={index}
                    data-dashboard-row
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="group flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <div className="flex items-center gap-3">
                      <Truck size={18} className="text-[#C29A4A]" />
                      <span className="text-sm capitalize">{item.status.toLowerCase().replace(/_/g, ' ')}</span>
                    </div>
                    <span className="font-medium">{item.count}</span>
                  </motion.div>
                ))
              ) : (
                <p className="text-muted-foreground">No fleet data available.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4" data-dashboard-table>
              {(stats?.recentRequests ?? []).length > 0 ? (
                stats!.recentRequests.slice(0, 5).map((request, index) => (
                  <motion.div
                    key={request.id}
                    data-dashboard-row
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="group flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <RequestStatusDot status={request.status} />
                      <div className="min-w-0">
                        <p className="font-medium truncate">{request.referenceNumber}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {request.pickupLocation} &rarr; {request.destination}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{formatDate(request.createdAt)}</span>
                  </motion.div>
                ))
              ) : (
                <p className="text-muted-foreground">No recent requests.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
