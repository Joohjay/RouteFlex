import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Search, FilterX, Weight } from 'lucide-react';
import { usePublicFleet } from '@/hooks/usePublicData';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AnimatedSection, AnimatedHero, AnimatedHeroItem } from '@/animations';
import { PremiumCard, StatusBadge } from '@/components/premium';
import { images } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { Fleet } from '@/types';

const vehicleTypeLabels: Record<string, string> = {
  VAN: 'Vans',
  TRUCK: 'Trucks',
  TRAILER: 'Trailers',
  FLATBED: 'Flatbeds',
  REFRIGERATED: 'Refrigerated',
  HEAVY: 'Heavy Haul',
};

const typeFilters = ['ALL', 'VAN', 'TRUCK', 'TRAILER', 'FLATBED', 'REFRIGERATED', 'HEAVY'] as const;

const fleetImages: Record<string, string> = {
  VAN: images.fleet.van,
  TRUCK: images.fleet.truck,
  TRAILER: images.fleet.trailer,
  FLATBED: images.fleet.flatbed,
  REFRIGERATED: images.fleet.refrigerated,
  HEAVY: images.fleet.heavy,
};

function FleetCard({ vehicle, index }: { vehicle: Fleet; index: number }) {
  const imgSrc = vehicle.images?.[0]?.url || fleetImages[vehicle.type] || images.fleet.truck;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <PremiumCard variant="elevated" hover="lift" className="group h-full overflow-hidden">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imgSrc}
            alt={vehicle.name}
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <StatusBadge status={vehicle.status} size="sm" />
            <span className="rounded-full bg-[#f59e0b]/90 px-3 py-1 text-xs font-bold text-[#0a0e1a] backdrop-blur-sm">
              {(vehicle.capacityKg / 1000).toFixed(0)}T capacity
            </span>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-lg font-bold">{vehicle.name}</h3>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {vehicleTypeLabels[vehicle.type] ?? vehicle.type}
              </span>
            </div>
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {vehicle.description}
          </p>

          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Weight size={13} /> {(vehicle.capacityKg / 1000).toFixed(0)}T capacity
            </span>
          </div>

          {vehicle.features && vehicle.features.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {vehicle.features.slice(0, 3).map((f, i) => (
                <span key={i} className="rounded-md bg-[#f59e0b]/5 px-2 py-0.5 text-xs font-medium text-[#f59e0b]">
                  {f}
                </span>
              ))}
              {vehicle.features.length > 3 && (
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-800">
                  +{vehicle.features.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </PremiumCard>
    </motion.div>
  );
}

export default function Fleet() {
  const { data: fleet, isLoading } = usePublicFleet();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filtered = useMemo(() => {
    if (!fleet) return [];
    return fleet.filter((v) => {
      const matchesSearch = search.length === 0 ||
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.description?.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'ALL' || v.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [fleet, search, typeFilter]);

  const hasFilters = search.length > 0 || typeFilter !== 'ALL';
  const vehicleCounts = useMemo(() => {
    if (!fleet) return {};
    const counts: Record<string, number> = { ALL: fleet.length };
    typeFilters.slice(1).forEach((t) => {
      counts[t] = fleet.filter((v) => v.type === t).length;
    });
    return counts;
  }, [fleet]);

  return (
    <>
      <Helmet>
        <title>Our Fleet | JJ Transport</title>
        <meta name="description" content="Explore JJ Transport's modern fleet of vehicles including vans, trucks, trailers, flatbeds, and refrigerated transport." />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a0e1a] py-28 lg:py-36">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[length:200%_200%] bg-gradient-to-br from-[#0a0e1a] via-[#111827] to-[#0a0e1a] animate-[gradient_8s_ease_infinite]" />
          <img src={images.fleet.truck} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/60 to-[#0a0e1a]" />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.08, 0.05] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f59e0b] blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedHero className="mx-auto max-w-3xl text-center">
            <AnimatedHeroItem>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#f59e0b]/20 bg-[#f59e0b]/10 px-4 py-1.5 text-sm font-medium text-[#f59e0b] backdrop-blur-sm">
                <Truck size={14} />
                Modern Fleet
              </div>
            </AnimatedHeroItem>
            <AnimatedHeroItem>
              <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Our Fleet
              </h1>
            </AnimatedHeroItem>
            <AnimatedHeroItem>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
                A diverse, well-maintained fleet ready to handle any cargo requirement. Every vehicle is GPS-tracked and regularly serviced.
              </p>
            </AnimatedHeroItem>
          </AnimatedHero>
        </div>
      </section>

      {/* Filters */}
      <AnimatedSection className="sticky top-20 z-30 border-b bg-white/80 py-5 backdrop-blur-xl dark:bg-gray-950/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {typeFilters.map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={cn(
                    'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
                    typeFilter === type
                      ? 'bg-[#0a0e1a] text-white shadow-sm dark:bg-[#f59e0b] dark:text-[#0a0e1a]'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  )}
                >
                  {type === 'ALL' ? 'All Vehicles' : vehicleTypeLabels[type] ?? type}
                  <span className="ml-1.5 text-xs opacity-60">({vehicleCounts[type] ?? 0})</span>
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search vehicles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Fleet Grid */}
      <AnimatedSection className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-80 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((vehicle, i) => (
                  <FleetCard key={vehicle.id} vehicle={vehicle} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-20 text-center"
            >
              <FilterX size={48} className="mx-auto text-gray-300 dark:text-gray-600" />
              <p className="mt-4 text-lg font-medium text-gray-500">No vehicles match your filters</p>
              {hasFilters && (
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => { setSearch(''); setTypeFilter('ALL'); }}
                >
                  Clear Filters
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </AnimatedSection>
    </>
  );
}
