import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/common/Loading';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
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

export default function Dashboard() {
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
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your logistics operations.</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Requests"
          value={stats?.totalRequests ?? 0}
          icon={FileText}
        />
        <StatCard
          title="New Requests"
          value={stats?.newRequests ?? 0}
          icon={Package}
          trend={`${stats?.monthlyGrowth ?? 0}% vs last month`}
        />
        <StatCard
          title="Completed Deliveries"
          value={stats?.completedDeliveries ?? 0}
          icon={CheckCircle}
        />
        <StatCard
          title="Monthly Requests"
          value={stats?.monthlyRequests ?? 0}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="requests" fill="hsl(221 83% 53%)" radius={[4, 4, 0, 0]} />
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
            <div className="space-y-4">
              {(stats?.popularRoutes ?? []).map((route, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-primary" />
                    <span className="text-sm">
                      {route.pickup} &rarr; {route.destination}
                    </span>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {route.count} bookings
                  </span>
                </div>
              ))}
              {stats?.popularRoutes.length === 0 && (
                <p className="text-muted-foreground">No route data available yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fleet Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(stats?.fleetOverview ?? []).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Truck size={18} className="text-primary" />
                    <span className="text-sm capitalize">{item.status.toLowerCase().replace(/_/g, ' ')}</span>
                  </div>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(stats?.recentRequests ?? []).slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{request.referenceNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {request.pickupLocation} &rarr; {request.destination}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(request.createdAt)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string;
  value: number;
  icon: typeof FileText;
  trend?: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value.toLocaleString()}</p>
            {trend && <p className="mt-1 text-xs text-green-600">{trend}</p>}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
