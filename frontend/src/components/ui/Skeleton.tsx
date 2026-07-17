import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'image';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, variant = 'text', width, height }: SkeletonProps) {
  const base = 'animate-pulse bg-gray-200 dark:bg-gray-800';

  const variants: Record<string, string> = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'h-48 w-full rounded-xl',
    image: 'aspect-[4/3] w-full rounded-lg',
  };

  return (
    <div
      className={cn(base, variants[variant], className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-white p-4 dark:bg-gray-950">
      <Skeleton variant="image" className="mb-4" />
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="mb-1 h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 w-24" />
          <Skeleton className="h-12 w-24" />
        </div>
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#163A5F]">
      <div className="w-full max-w-3xl space-y-6 px-4">
        <Skeleton className="mx-auto h-6 w-48 rounded-full bg-white/10" />
        <Skeleton className="mx-auto h-16 w-3/4 bg-white/10" />
        <Skeleton className="mx-auto h-6 w-1/2 bg-white/10" />
        <div className="flex justify-center gap-4">
          <Skeleton className="h-12 w-36 rounded-lg bg-white/10" />
          <Skeleton className="h-12 w-36 rounded-lg bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
          <Skeleton className="mx-auto h-8 w-8 rounded-full bg-white/10" />
          <Skeleton className="mx-auto h-8 w-20 bg-white/10" />
          <Skeleton className="mx-auto h-4 w-24 bg-white/10" />
        </div>
      ))}
    </div>
  );
}
