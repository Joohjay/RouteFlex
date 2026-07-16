import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, Package, CheckCircle2, Truck, Loader2, MapPin, Calendar, FileText, Circle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { api } from '@/lib/api';
import { AnimatedHero, AnimatedHeroItem, AnimatedSection } from '@/animations';
import { PremiumCard, Timeline, StatusBadge } from '@/components/premium';
import type { TimelineEvent } from '@/components/premium';
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

const statusTimelineConfig: Record<string, { label: string; icon: typeof Package; color: string }> = {
  PENDING: { label: 'Order Placed', icon: Package, color: 'text-gray-400' },
  CONFIRMED: { label: 'Confirmed', icon: CheckCircle2, color: 'text-blue-500' },
  PICKED_UP: { label: 'Picked Up', icon: Truck, color: 'text-[#f59e0b]' },
  IN_TRANSIT: { label: 'In Transit', icon: Truck, color: 'text-[#f59e0b]' },
  DELIVERED: { label: 'Delivered', icon: CheckCircle2, color: 'text-green-500' },
};

const timelineOrder = ['PENDING', 'CONFIRMED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];

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

  const currentStatusIndex = result ? timelineOrder.indexOf(result.status) : -1;

  const timelineEvents: TimelineEvent[] = useMemo(() => {
    if (!result?.events) return [];
    return result.events.map((event) => {
      const cfg = statusTimelineConfig[event.status] ?? { label: event.status, icon: Package, color: 'text-gray-400' };
      return {
        status: event.status,
        label: cfg.label,
        description: event.description,
        timestamp: event.timestamp,
        location: event.location,
        icon: cfg.icon,
        color: cfg.color,
      };
    });
  }, [result]);

  return (
    <>
      <Helmet>
        <title>Track Shipment | JJ Transport</title>
        <meta name="description" content="Track your JJ Transport shipment in real-time. Enter your reference number to see the latest status and delivery updates." />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a0e1a] py-28 lg:py-36">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f59e0b] blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedHero className="mx-auto max-w-3xl text-center">
            <AnimatedHeroItem>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#f59e0b]/20 bg-[#f59e0b]/10 px-4 py-1.5 text-sm font-medium text-[#f59e0b] backdrop-blur-sm">
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
          <PremiumCard variant="glass" hover="none" className="p-1">
            <form onSubmit={handleSearch} className="flex gap-3 p-5">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Enter reference number (e.g. JJT-2024-001)"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="pl-10 border-0 bg-gray-50 dark:bg-gray-900"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !reference.trim()}
                className="bg-[#0a0e1a] text-white hover:bg-[#1a1f2e] dark:bg-[#f59e0b] dark:text-[#0a0e1a]"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Track'}
              </Button>
            </form>
          </PremiumCard>
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
              {/* Status overview cards */}
              <div className="grid gap-3 sm:grid-cols-5">
                {timelineOrder.map((status) => {
                  const cfg = statusTimelineConfig[status] ?? { label: status, icon: Package, color: 'text-gray-400' };
                  const Icon = cfg.icon;
                  const idx = timelineOrder.indexOf(status);
                  const isReached = idx <= currentStatusIndex;
                  const isCurrent = idx === currentStatusIndex;
                  return (
                    <div
                      key={status}
                      className={cn(
                        'flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-center transition-all',
                        isCurrent
                          ? 'border-[#f59e0b] bg-[#f59e0b]/5 shadow-sm'
                          : isReached
                          ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950'
                          : 'border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900'
                      )}
                    >
                      <Icon
                        size={20}
                        className={cn(
                          isCurrent ? 'text-[#f59e0b]' : isReached ? 'text-green-500' : 'text-gray-300'
                        )}
                      />
                      <p
                        className={cn(
                          'text-[11px] font-semibold leading-tight',
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

              {/* Shipment info card */}
              <PremiumCard variant="elevated" hover="none">
                <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                  <FileText size={18} className="text-[#f59e0b]" />
                  <div>
                    <p className="text-xs text-muted-foreground">Reference</p>
                    <p className="font-bold text-[#f59e0b]">{result.referenceNumber}</p>
                  </div>
                </div>
                <div className="grid gap-6 p-6 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-[#f59e0b]" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">From</p>
                      <p className="mt-0.5 font-semibold">{result.pickupAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-[#f59e0b]" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">To</p>
                      <p className="mt-0.5 font-semibold">{result.deliveryAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar size={16} className="mt-0.5 shrink-0 text-[#f59e0b]" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Estimated Delivery</p>
                      <p className="mt-0.5 font-semibold">
                        {new Date(result.estimatedDelivery).toLocaleDateString('en-US', {
                          month: 'long', day: 'numeric', year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Circle size={16} className="mt-0.5 shrink-0 text-[#f59e0b]" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Current Status</p>
                      <div className="mt-0.5">
                        <StatusBadge status={result.status} />
                      </div>
                    </div>
                  </div>
                </div>
              </PremiumCard>

              {/* Timeline */}
              {timelineEvents.length > 0 && (
                <PremiumCard variant="elevated" hover="none">
                  <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                    <h3 className="text-lg font-bold">Tracking Timeline</h3>
                  </div>
                  <div className="p-6">
                    <Timeline events={timelineEvents} />
                  </div>
                </PremiumCard>
              )}
            </motion.div>
          )}
        </div>
      </AnimatedSection>
    </>
  );
}
