import { useRef, useEffect } from 'react';
import { gsap } from '@/animations/hooks/useGSAP';
import { useReducedMotion } from '@/animations/hooks';
import { cn } from '@/lib/utils';

interface RoadProgressProps {
  steps: { label: string }[];
  currentStep: number;
  className?: string;
}

export function RoadProgress({ steps, currentStep, className }: RoadProgressProps) {
  const prefersReducedMotion = useReducedMotion();
  const roadRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion || !roadRef.current) return;

    const markers = roadRef.current.querySelectorAll('[data-road-marker]');
    const activeIndex = Math.min(currentStep - 1, markers.length - 1);

    gsap.to(markers, {
      backgroundColor: (i) =>
        i < activeIndex ? '#C29A4A' : i === activeIndex ? '#C29A4A' : '#E4E7EB',
      scale: (i) => (i === activeIndex ? 1.15 : i < activeIndex ? 1 : 1),
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, [currentStep, prefersReducedMotion]);

  return (
    <div ref={roadRef} className={cn('relative', className)}>
      <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full rounded-full bg-[#C29A4A] transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>
      <div className="relative flex justify-between">
        {steps.map((step, i) => {
          const isActive = i + 1 === currentStep;
          const isCompleted = i + 1 < currentStep;
          return (
            <div key={step.label} className="flex flex-col items-center">
              <div
                data-road-marker
                className={cn(
                  'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors',
                  isCompleted
                    ? 'border-[#C29A4A] bg-[#C29A4A] text-[#163A5F]'
                    : isActive
                    ? 'border-[#C29A4A] bg-white text-[#C29A4A] dark:bg-gray-950'
                    : 'border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-950'
                )}
              >
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs font-medium',
                  isActive
                    ? 'text-[#C29A4A]'
                    : isCompleted
                    ? 'text-gray-700 dark:text-gray-300'
                    : 'text-gray-400'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
