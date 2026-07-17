import { useRef, useEffect } from 'react';
import { gsap } from '@/animations/hooks/useGSAP';
import { useReducedMotion } from '@/animations/hooks';
import { cn } from '@/lib/utils';
import { MapPin, CheckCircle, Truck } from 'lucide-react';

export interface TrackingMilestone {
  label: string;
  location: string;
  timestamp?: string;
  completed: boolean;
  active: boolean;
}

interface TrackingTimelineProps {
  milestones: TrackingMilestone[];
  className?: string;
}

export function TrackingTimeline({ milestones, className }: TrackingTimelineProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const truckRef = useRef<HTMLDivElement | null>(null);

  const completedCount = milestones.filter((m) => m.completed).length;
  const progress = milestones.length > 0 ? completedCount / (milestones.length - 1) : 0;

  useEffect(() => {
    if (prefersReducedMotion || !truckRef.current || milestones.length === 0) return;

    gsap.to(truckRef.current, {
      top: `${Math.min(progress * 90, 90)}%`,
      duration: 1.2,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  }, [progress, prefersReducedMotion, milestones.length]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="absolute left-6 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700">
        <div
          className="w-full bg-[#C29A4A] transition-all duration-700"
          style={{ height: `${Math.min(progress * 100, 100)}%` }}
        />
      </div>

      <div
        ref={truckRef}
        className="absolute left-3 z-10 transition-all duration-700"
        style={{ top: `${Math.min(progress * 90, 90)}%` }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#163A5F] shadow-lg">
          <Truck size={14} className="text-white" />
        </div>
      </div>

      <div className="space-y-8 pl-16">
        {milestones.map((milestone, i) => (
          <div
            key={i}
            className={cn(
              'relative rounded-xl border p-4 transition-all duration-300',
              milestone.active
                ? 'border-[#C29A4A] bg-[#C29A4A]/5 shadow-sm'
                : milestone.completed
                ? 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'
                : 'border-gray-100 bg-gray-50 opacity-60 dark:border-gray-800 dark:bg-gray-900/50'
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                  milestone.completed
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30'
                    : milestone.active
                    ? 'bg-[#C29A4A]/10 text-[#C29A4A]'
                    : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
                )}
              >
                {milestone.completed ? (
                  <CheckCircle size={14} />
                ) : (
                  <MapPin size={14} />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-gray-100">{milestone.label}</p>
                <p className="text-sm text-gray-500">{milestone.location}</p>
                {milestone.timestamp && (
                  <p className="mt-1 text-xs text-gray-400">{milestone.timestamp}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
