import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Truck, Search, FilterX } from 'lucide-react';
import { usePublicFleet } from '@/hooks/usePublicData';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { AnimatedSection, AnimatedCard, AnimatedGrid, AnimatedHero, AnimatedHeroItem } from '@/animations';
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

function FleetCard({ vehicle, index }: { vehicle: Fleet; index: number }) {
  return (
    <AnimatedCard index={index} className="group h-full">
      <Card className="h-full overflow-hidden border-0 bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-gray-950">
        {vehicle.images?.[0]?.url ? (
          <div className="relative h-52 overflow-hidden">
            <img src={vehicle.images[0].url} alt={vehicle.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        ) : (
          <div className="flex h-52 items-center justify-center bg-gradient-to-br from-[#f59e0b]/5 to-[#0a0e1a]/5">
            <Truck size={56} className="text-[#f59e0b]/20" />
          </div>
        )}
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold">{vehicle.name}</h3>
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {vehicleTypeLabels[vehicle.type] ?? vehicle.type}
              </span>
            </div>
            <span className="rounded-full bg-[#f59e0b]/10 px-3 py-1 text-xs font-bold text-[#f59e0b]">
              {(vehicle.capacityKg / 1000).toFixed(0)}T
            </span>
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            {vehicle.description}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'h-2.5 w-2.5 rounded-full',
                  vehicle.status === 'ACTIVE' ? 'bg-green-500' :
                  vehicle.status === 'MAINTENANCE' ? 'bg-yellow-500' :
                  vehicle.status === 'IN_TRANSIT' ? 'bg-blue-500' : 'bg-gray-400'
                )}
              />
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {vehicle.status === 'ACTIVE' ? 'Available' :
                 vehicle.status === 'MAINTENANCE' ? 'Maintenance' :
                 vehicle.status === 'IN_TRANSIT' ? 'In Transit' : 'Retired'}
              </span>
            </div>
            {vehicle.features && vehicle.features.length > 0 && (
              <span className="text-xs text-gray-400">{vehicle.features.length} features</span>
            )}
          </div>
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {vehicle.features.slice(0, 3).map((f, i) => (
                <span key={i} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
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
        </CardContent>
      </Card>
    </AnimatedCard>
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
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f59e0b]/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedHero className="mx-auto max-w-3xl text-center">
            <AnimatedHeroItem>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#f59e0b]/20 bg-[#f59e0b]/10 px-4 py-1.5 text-sm font-medium text-[#f59e0b]">
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
      <AnimatedSection className="border-b bg-white py-6 dark:bg-gray-950">
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
                      ? 'bg-[#0a0e1a] text-white dark:bg-[#f59e0b] dark:text-[#0a0e1a]'
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
            <AnimatedGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((vehicle, i) => (
                <FleetCard key={vehicle.id} vehicle={vehicle} index={i} />
              ))}
            </AnimatedGrid>
          ) : (
            <div className="py-20 text-center">
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
            </div>
          )}
        </div>
      </AnimatedSection>
    </>
  );
}
