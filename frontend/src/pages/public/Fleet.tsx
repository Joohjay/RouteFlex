import { useState, useMemo } from 'react';
import { SEO } from '@/components/seo/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Search, FilterX } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AnimatedSection, AnimatedHero, AnimatedHeroItem } from '@/animations';
import { PremiumCard } from '@/components/premium';
import { images } from '@/lib/images';
import { cn } from '@/lib/utils';

type ImageGroup = 'VAN' | 'TRUCK' | 'TRAILER' | 'FLATBED' | 'REFRIGERATED' | 'HEAVY';
type FilterGroup = 'ALL' | ImageGroup;

interface GalleryItem {
  src: string;
  name: string;
  group: ImageGroup;
}

const filterGroupConfig: { key: ImageGroup; label: string }[] = [
  { key: 'VAN', label: 'Vans' },
  { key: 'TRUCK', label: 'Trucks' },
  { key: 'TRAILER', label: 'Trailers' },
  { key: 'FLATBED', label: 'Flatbeds' },
  { key: 'REFRIGERATED', label: 'Refrigerated' },
  { key: 'HEAVY', label: 'Heavy Haul' },
];

const groupImageMap: Record<ImageGroup, readonly string[]> = {
  VAN: images.fleet.van,
  TRUCK: images.fleet.truck,
  TRAILER: images.fleet.trailer,
  FLATBED: images.fleet.flatbed,
  REFRIGERATED: images.fleet.refrigerated,
  HEAVY: images.fleet.heavy,
};

const fleetNames: Record<ImageGroup, readonly string[]> = {
  VAN: ['JJ City Runner', 'JJ Metro Mover', 'JJ Urban Express', 'JJ Compact Hauler', 'JJ Swift Van', 'JJ Quick Transit', 'JJ Local Runner', 'JJ Town Van'],
  TRUCK: ['JJ Road King', 'JJ Freight Master', 'JJ Cargo Pro', 'JJ Long Haul', 'JJ Load Master', 'JJ Highway Cruiser', 'JJ Heavy Mover', 'JJ Transport Pro', 'JJ Hauler X', 'JJ Cargo King', 'JJ Freight Runner', 'JJ Load Runner'],
  TRAILER: ['JJ Cargo Carrier', 'JJ Bulk Mover', 'JJ Secure Trailer', 'JJ Load Carrier', 'JJ Freight Trailer', 'JJ Cargo Master', 'JJ Haul Trailer', 'JJ Interlink', 'JJ Curtainsider', 'JJ Box Trailer'],
  FLATBED: ['JJ Flatbed Pro', 'JJ Open Carrier', 'JJ Heavy Loader', 'JJ Deck Master', 'JJ Flat Mover', 'JJ Oversize Hauler', 'JJ Platform King', 'JJ Trailer Flatbed'],
  REFRIGERATED: ['JJ Cold Chain', 'JJ Cool Runner', 'JJ Temp Control', 'JJ Chill Master', 'JJ Cold Carrier', 'JJ Freeze Pro', 'JJ Cool Mover', 'JJ Refrigerator Van'],
  HEAVY: ['JJ Heavy King', 'JJ Massive Haul', 'JJ Oversize Pro', 'JJ Mega Mover', 'JJ Heavy Lifter', 'JJ Giant Trans', 'JJ Heavy Duty', 'JJ Lowbed King'],
};

const fleetDescriptions: Record<ImageGroup, readonly string[]> = {
  VAN: [
    'Compact and efficient van for local deliveries and small cargo. Ideal for city routes and quick turnarounds.',
    'Perfect for last-mile delivery with easy maneuverability and secure cargo space.',
    'Economical and reliable for daily urban logistics and courier services.',
  ],
  TRUCK: [
    'Heavy-duty truck built for regional and long-haul freight. Handles large volumes with reliability and power.',
    'Versatile cargo truck suitable for mixed freight across intercity and cross-border routes.',
    'Built for endurance with advanced suspension and spacious cargo bed for bulk goods.',
  ],
  TRAILER: [
    'Versatile trailer for secure and bulk cargo transport with easy loading and unloading access.',
    'Designed for maximum cargo capacity while maintaining stability and safety on the road.',
    'Ideal for consolidated freight requiring protection from elements and road conditions.',
  ],
  FLATBED: [
    'Flatbed trailer ideal for oversized and heavy equipment that requires flexible loading options.',
    'Open deck design allows for easy crane loading of machinery, pipes, and construction materials.',
    'Perfect for irregularly shaped cargo that cannot fit inside standard enclosed trailers.',
  ],
  REFRIGERATED: [
    'Temperature-controlled refrigerated unit for perishable goods requiring precise climate management.',
    'Maintains consistent cold chain integrity for food, pharmaceuticals, and sensitive materials.',
    'Equipped with advanced cooling system and real-time temperature monitoring for peace of mind.',
  ],
  HEAVY: [
    'Specialized heavy-haul vehicle for oversized machinery and industrial equipment transport.',
    'Engineered to handle extreme loads with reinforced chassis and multi-axle configuration.',
    'Designed for moving construction equipment, mining machinery, and large industrial components.',
  ],
};

function getFleetName(group: ImageGroup, index: number): string {
  const names = fleetNames[group];
  return names[index % names.length]!;
}

function getFleetDescription(group: ImageGroup, index: number): string {
  const descriptions = fleetDescriptions[group];
  return descriptions[index % descriptions.length]!;
}

const allGalleryItems: GalleryItem[] = (Object.entries(groupImageMap) as [ImageGroup, readonly string[]][]).flatMap(
  ([group, paths]) =>
    paths.map((src, index) => ({
      src,
      name: getFleetName(group, index),
      group,
    }))
);

function FleetCard({ item, index }: { item: GalleryItem; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
    >
      <PremiumCard variant="elevated" hover="lift" className="group h-full overflow-hidden">
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.src}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-3 left-3">
            <span className="rounded-full bg-[#C29A4A]/90 px-3 py-1 text-xs font-bold text-[#163A5F] backdrop-blur-sm">
              {filterGroupConfig.find((c) => c.key === item.group)?.label ?? item.group}
            </span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold">{item.name}</h3>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {getFleetDescription(item.group, index)}
          </p>
        </div>
      </PremiumCard>
    </motion.div>
  );
}

export default function Fleet() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<FilterGroup>('ALL');

  const filtered = useMemo(() => {
    return allGalleryItems.filter((item) => {
      const matchesSearch = search.length === 0 ||
        item.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'ALL' || item.group === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  const hasFilters = search.length > 0 || typeFilter !== 'ALL';

  const vehicleCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: allGalleryItems.length };
    filterGroupConfig.forEach((c) => {
      counts[c.key] = allGalleryItems.filter((item) => item.group === c.key).length;
    });
    return counts;
  }, []);

  return (
    <>
      <SEO
  title="Our Fleet"
  description="Explore JJ Transport's modern fleet of vehicles including vans, trucks, trailers, flatbeds, and refrigerated transport for all your cargo needs in Tanzania."
  canonical="/fleet"
/>

      {/* Hero */}
      <section className="relative overflow-hidden py-28 lg:py-36" style={{ background: 'linear-gradient(135deg, #163A5F 0%, #204B74 55%, #2A5F90 100%)' }}>
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[length:200%_200%] bg-gradient-to-br from-[#163A5F] via-[#204B74] to-[#2A5F90] animate-[gradient_8s_ease_infinite]" />
          <img src={images.fleet.truck[0]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#163A5F]/50 to-[#163A5F]" />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C29A4A]/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedHero className="mx-auto max-w-3xl text-center">
            <AnimatedHeroItem>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C29A4A]/20 bg-[#C29A4A]/10 px-4 py-1.5 text-sm font-medium text-[#C29A4A] backdrop-blur-sm">
                <Truck size={14} />
                Modern Fleet
              </div>
            </AnimatedHeroItem>
            <AnimatedHeroItem>
              <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl font-heading">
                Our Fleet
              </h1>
            </AnimatedHeroItem>
            <AnimatedHeroItem>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-[#C29A4A]/80">
                A diverse, well-maintained fleet ready to handle any cargo requirement.
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
              <button
                onClick={() => setTypeFilter('ALL')}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
                  typeFilter === 'ALL'
                    ? 'bg-[#163A5F] text-white shadow-sm dark:bg-[#C29A4A] dark:text-[#163A5F]'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                )}
              >
                All Vehicles
                <span className="ml-1.5 text-xs opacity-60">({vehicleCounts['ALL']})</span>
              </button>
              {filterGroupConfig.map((config) => (
                <button
                  key={config.key}
                  onClick={() => setTypeFilter(config.key)}
                  className={cn(
                    'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
                    typeFilter === config.key
                      ? 'bg-[#163A5F] text-white shadow-sm dark:bg-[#C29A4A] dark:text-[#163A5F]'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  )}
                >
                  {config.label}
                  <span className="ml-1.5 text-xs opacity-60">({vehicleCounts[config.key]})</span>
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
          {filtered.length > 0 ? (
            <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((item, i) => (
                  <FleetCard key={item.src} item={item} index={i} />
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
