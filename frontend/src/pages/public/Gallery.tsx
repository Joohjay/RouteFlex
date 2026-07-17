import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '@/components/seo/SEO';
import { Image, X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { usePublicGallery } from '@/hooks/usePublicData';
import { AnimatedSection, AnimatedHero, AnimatedHeroItem } from '@/animations';
import { images } from '@/lib/images';
import { cn } from '@/lib/utils';

const categories = ['ALL', 'FLEET', 'OPERATIONS', 'TEAM', 'FACILITY', 'EVENTS'] as const;
const categoryLabels: Record<string, string> = {
  ALL: 'All Photos',
  FLEET: 'Fleet',
  OPERATIONS: 'Operations',
  TEAM: 'Team',
  FACILITY: 'Facility',
  EVENTS: 'Events',
};

function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: { imageUrl: string; title?: string; description?: string }[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const current = images[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
        aria-label="Close lightbox"
      >
        <X size={24} />
      </button>

      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          aria-label="Previous image"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          aria-label="Next image"
        >
          <ChevronRight size={28} />
        </button>
      )}

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative max-h-[85vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={current?.imageUrl}
          alt={current?.title ?? ''}
          loading="lazy"
          className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
        />
        {(current?.title || current?.description) && (
          <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-gradient-to-t from-black/70 to-transparent p-6">
            {current.title && <p className="text-lg font-semibold text-white">{current.title}</p>}
            {current.description && <p className="mt-1 text-sm text-gray-300">{current.description}</p>}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function GalleryPage() {
  const { data: gallery, isLoading, error } = usePublicGallery();
  const [category, setCategory] = useState<string>('ALL');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const fallbackGallery = useMemo(() => {
    const existing = images.gallery.items.map((url, i) => ({
      id: `gallery-${i}`,
      imageUrl: url,
      title: `JJ Transport ${['Fleet', 'Operations', 'Facility', 'Team', 'Logistics', 'Equipment'][i]}`,
      description: undefined,
      category: ['FLEET', 'OPERATIONS', 'FACILITY', 'TEAM', 'OPERATIONS', 'FLEET'][i],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const fleetNames: Record<string, readonly string[]> = {
      van: ['JJ City Runner', 'JJ Metro Mover', 'JJ Urban Express', 'JJ Compact Hauler', 'JJ Swift Van', 'JJ Quick Transit', 'JJ Local Runner', 'JJ Town Van'],
      truck: ['JJ Road King', 'JJ Freight Master', 'JJ Cargo Pro', 'JJ Long Haul', 'JJ Load Master', 'JJ Highway Cruiser', 'JJ Heavy Mover', 'JJ Transport Pro', 'JJ Hauler X', 'JJ Cargo King', 'JJ Freight Runner', 'JJ Load Runner'],
      trailer: ['JJ Cargo Carrier', 'JJ Bulk Mover', 'JJ Secure Trailer', 'JJ Load Carrier', 'JJ Freight Trailer', 'JJ Cargo Master', 'JJ Haul Trailer', 'JJ Interlink', 'JJ Curtainsider', 'JJ Box Trailer'],
      flatbed: ['JJ Flatbed Pro', 'JJ Open Carrier', 'JJ Heavy Loader', 'JJ Deck Master', 'JJ Flat Mover', 'JJ Oversize Hauler', 'JJ Platform King', 'JJ Trailer Flatbed'],
      refrigerated: ['JJ Cold Chain', 'JJ Cool Runner', 'JJ Temp Control', 'JJ Chill Master', 'JJ Cold Carrier', 'JJ Freeze Pro', 'JJ Cool Mover', 'JJ Refrigerator Van'],
      heavy: ['JJ Heavy King', 'JJ Massive Haul', 'JJ Oversize Pro', 'JJ Mega Mover', 'JJ Heavy Lifter', 'JJ Giant Trans', 'JJ Heavy Duty', 'JJ Lowbed King'],
    };

    const fleetGroups = [
      { key: 'van' }, { key: 'truck' }, { key: 'trailer' },
      { key: 'flatbed' }, { key: 'refrigerated' }, { key: 'heavy' },
    ] as const;

    const fleetImages = fleetGroups.flatMap(({ key }) =>
      ((images.fleet as Record<string, readonly string[]>)[key] ?? []).map((url, i) => {
        const names = fleetNames[key] ?? [];
        return {
          id: `fleet-${key}-${i}`,
          imageUrl: url,
          title: names[i % names.length] ?? `JJ ${key.charAt(0).toUpperCase() + key.slice(1)}`,
          description: undefined,
          category: 'FLEET' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      })
    );

    return [...fleetImages, ...existing];
  }, []);

  const effectiveGallery = gallery && gallery.length > 0 ? gallery : fallbackGallery;

  const filtered = useMemo(() => {
    if (!effectiveGallery) return [];
    return category === 'ALL'
      ? effectiveGallery
      : effectiveGallery.filter((img) => img.category === category);
  }, [effectiveGallery, category]);

  const allImages = useMemo(() => {
    if (!effectiveGallery) return [];
    return effectiveGallery.map((img) => ({
      imageUrl: img.imageUrl,
      title: (img as { title?: string }).title ?? undefined,
      description: (img as { description?: string }).description ?? undefined,
    }));
  }, [effectiveGallery]);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
  }, []);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null && prev < allImages.length - 1 ? prev + 1 : prev
    );
  }, [allImages.length]);

  return (
    <>
      <SEO
  title="Gallery"
  description="Browse our gallery showcasing JJ Transport's fleet, operations, team, and facilities in action across Tanzania."
  canonical="/gallery"
/>

      {/* Hero */}
      <section className="relative overflow-hidden py-28 lg:py-36" style={{ background: 'linear-gradient(135deg, #163A5F 0%, #204B74 55%, #2A5F90 100%)' }}>
        <div className="absolute inset-0">
          <img src={images.gallery.items[0]} alt="" className="h-full w-full object-cover opacity-20" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#163A5F]/60 to-[#163A5F]" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C29A4A]/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedHero className="mx-auto max-w-3xl text-center">
            <AnimatedHeroItem>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C29A4A]/20 bg-[#C29A4A]/10 px-4 py-1.5 text-sm font-medium text-[#C29A4A]">
                <Image size={14} />
                Our Work in Action
              </div>
            </AnimatedHeroItem>
            <AnimatedHeroItem>
              <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl font-heading">
                Gallery
              </h1>
            </AnimatedHeroItem>
            <AnimatedHeroItem>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
                A visual journey through our fleet, operations, and the team that makes it all happen.
              </p>
            </AnimatedHeroItem>
          </AnimatedHero>
        </div>
      </section>

      {/* Category Filter */}
      <AnimatedSection className="border-b bg-white py-6 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
                  category === cat
                    ? 'bg-[#163A5F] text-white dark:bg-[#C29A4A] dark:text-[#163A5F]'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                )}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Masonry Grid */}
      <AnimatedSection className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="mb-4 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"
                  style={{ height: `${150 + Math.random() * 200}px` }}
                />
              ))}
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <Image size={48} className="mx-auto text-gray-300 dark:text-gray-600" />
              <p className="mt-4 text-lg text-gray-500">Failed to load gallery.</p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
              {filtered.map((img, i) => (
                <motion.button
                  key={img.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 8) * 0.05, duration: 0.4 }}
                  onClick={() => openLightbox(allImages.indexOf(allImages.find((a) => a.imageUrl === img.imageUrl)!))}
                  className="group relative mb-4 w-full overflow-hidden rounded-xl"
                >
                  <img
                    src={img.imageUrl}
                    alt={img.title ?? ''}
                    className="w-full rounded-xl transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-end rounded-xl bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="text-left">
                      {img.title && <p className="text-sm font-semibold text-white">{img.title}</p>}
                      {img.description && <p className="mt-0.5 text-xs text-gray-200">{img.description}</p>}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <Image size={48} className="mx-auto text-gray-300 dark:text-gray-600" />
              <p className="mt-4 text-lg text-gray-500">
                {category !== 'ALL' ? `No photos in "${categoryLabels[category]}" category.` : 'No gallery photos available yet.'}
              </p>
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={allImages}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
      </AnimatePresence>
    </>
  );
}
