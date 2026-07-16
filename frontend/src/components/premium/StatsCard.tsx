import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  value: string | number;
  label: string;
  icon?: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function StatsCard({
  value,
  label,
  icon: Icon,
  trend,
  trendUp = true,
  className,
  prefix = '',
  suffix = '',
}: StatsCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseInt(value.toString().replace(/[^0-9]/g, '')) || 0;
  const displayValue = typeof value === 'string' && isNaN(Number(value)) ? value : '';

  useEffect(() => {
    if (!isInView || displayValue) return;
    let start = 0;
    const end = numericValue;
    const duration = 1500;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, numericValue, displayValue]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn('rounded-xl border bg-white p-5 shadow-sm dark:bg-gray-950', className)}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold tracking-tight">
            {displayValue || `${prefix}${count.toLocaleString()}${suffix}`}
          </p>
          {trend && (
            <p className={cn('text-xs', trendUp ? 'text-green-600' : 'text-red-500')}>
              {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f59e0b]/10 text-[#f59e0b]">
            <Icon size={20} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
