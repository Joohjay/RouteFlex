import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, Package, CheckCircle2, Truck, Clock, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { AnimatedHero, AnimatedHeroItem, AnimatedSection } from '@/animations';
import { cn } from '@/lib/utils';

interface TrackingEvent {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

interface TrackingResult {
  referenceNumber: string;
  status: string;
  pickupAddress: string;
  deliveryAddress: string;
  estimatedDelivery: string;
  events: TrackingEvent[];
}

const statusConfig: Record<string, { label: string; icon: typeof Package; color: string }> = {
  PENDING: { label: 'Order Placed', icon: Package, color: 'text-gray-400' },
  CONFIRMED: { label: 'Confirmed', icon: CheckCircle2, color: 'text-blue-500' },
  PICKED_UP: { label: 'Picked Up', icon: Truck, color: 'text-[#f59e0b]' },
  IN_TRANSIT: { label: 'In Transit', icon: Truck, color: 'text-[#f59e0b]' },
  DELIVERED: { label: 'Delivered', icon: CheckCircle2, color: 'text-green-500' },
};

function Timeline({ events }: { events: TrackingEvent[] }) {
  return (
    <div className="relative space-y-0">
      {events.map((event, i) => {
        const cfg = statusConfig[event.status] ?? { label: event.status, icon: Package, color: 'text-gray-400' };
        const Icon = cfg.icon;
        const isLast = i === events.length - 1;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative flex gap-6 pb-8"
          >
            <div className="flex flex-col items-center">
              <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 bg-white', cfg.color.replace('text-', 'border-'))}>
                <Icon size={16} className={cfg.color} />
              </div>
              {!isLast && <div className="mt-1 h-full w-0.5 bg-gray-200 dark:bg-gray-700" />}
            </div>
            <div className={cn('pb-4', isLast ? '' : '')}>
              <p className="font-semibold">{cfg.label}</p>
              <p className="text-sm text-gray-500">{event.description}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                <Clock size={12} />
                {new Date(event.timestamp).toLocaleString('en-US', {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
                <MapPin size={12} className="ml-1" />
                {event.location}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function Track() {
  const [reference, setReference] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) return;
    setIsLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await api.get(`/public/track/${reference.trim()}`);
      setResult(response.data.data);
    } catch {
      setError('No shipment found with that reference number. Please check and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const timelineStatuses = ['PENDING', 'CONFIRMED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];
  const currentStatusIndex = result ? timelineStatuses.indexOf(result.status) : -1;

  return (
    <>
      <Helmet>
        <title>Track Shipment | JJ Transport</title>
        <meta name="description" content="Track your JJ Transport shipment in real-time. Enter your reference number to see the latest status and delivery updates." />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a0e1a] py-28 lg:py-36">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f59e0b]/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedHero className="mx-auto max-w-3xl text-center">
            <AnimatedHeroItem>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#f59e0b]/20 bg-[#f59e0b]/10 px-4 py-1.5 text-sm font-medium text-[#f59e0b]">
                <Search size={14} />
                Real-Time Tracking
              </div>
            </AnimatedHeroItem>
            <AnimatedHeroItem>
              <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Track Shipment
              </h1>
            </AnimatedHeroItem>
            <AnimatedHeroItem>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
                Enter your reference number to track your shipment in real-time.
              </p>
            </AnimatedHeroItem>
          </AnimatedHero>
        </div>
      </section>

      {/* Search */}
      <AnimatedSection className="relative -mt-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <Card className="border-0 bg-white shadow-lg dark:bg-gray-950">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Enter reference number (e.g. JJT-2024-001)"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" disabled={isLoading || !reference.trim()} className="bg-[#0a0e1a] text-white hover:bg-[#1a1f2e]">
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Track'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </AnimatedSection>

      {/* Results */}
      <AnimatedSection className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950"
            >
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Status Overview */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {['PENDING', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED'].map((status) => {
                  const cfg = statusConfig[status] ?? { label: status, icon: Package, color: 'text-gray-400' };
                  const Icon = cfg.icon;
                  const isReached = timelineStatuses.indexOf(status) <= currentStatusIndex;
                  const isCurrent = timelineStatuses.indexOf(status) === currentStatusIndex;
                  return (
                    <div
                      key={status}
                      className={cn(
                        'rounded-xl border-2 p-4 text-center transition-all',
                        isCurrent
                          ? 'border-[#f59e0b] bg-[#f59e0b]/5'
                          : isReached
                          ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950'
                          : 'border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900'
                      )}
                    >
                      <Icon
                        size={24}
                        className={cn(
                          'mx-auto',
                          isCurrent ? 'text-[#f59e0b]' : isReached ? 'text-green-500' : 'text-gray-300'
                        )}
                      />
                      <p
                        className={cn(
                          'mt-2 text-sm font-semibold',
                          isCurrent
                            ? 'text-[#f59e0b]'
                            : isReached
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-400'
                        )}
                      >
                        {cfg.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Shipment Info */}
              <Card className="border-0 bg-white shadow-sm dark:bg-gray-950">
                <CardContent className="p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Reference</p>
                      <p className="mt-1 font-bold text-[#f59e0b]">{result.referenceNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Estimated Delivery</p>
                      <p className="mt-1 font-semibold">
                        {new Date(result.estimatedDelivery).toLocaleDateString('en-US', {
                          month: 'long', day: 'numeric', year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">From</p>
                      <p className="mt-1 font-semibold">{result.pickupAddress}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">To</p>
                      <p className="mt-1 font-semibold">{result.deliveryAddress}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              {result.events && result.events.length > 0 && (
                <Card className="border-0 bg-white shadow-sm dark:bg-gray-950">
                  <CardContent className="p-6">
                    <h3 className="mb-6 text-lg font-bold">Tracking Timeline</h3>
                    <Timeline events={result.events} />
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </div>
      </AnimatedSection>
    </>
  );
}
