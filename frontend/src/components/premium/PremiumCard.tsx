import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { cardPreset } from '@/animations';

export interface PremiumCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'bordered' | 'elevated';
  hover?: 'lift' | 'glow' | 'none';
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: 'bg-white shadow-sm dark:bg-gray-950',
  glass: 'bg-white/85 shadow-sm backdrop-blur-md dark:bg-gray-950/80',
  bordered: 'border-2 border-gray-200 bg-transparent dark:border-gray-800',
  elevated: 'bg-white shadow-lg dark:bg-gray-950 dark:shadow-2xl dark:shadow-black/20',
};

const hoverStyles: Record<string, string> = {
  lift: 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-black/30',
  glow: 'transition-shadow duration-300 hover:shadow-[0_0_30px_-5px_rgba(194,154,74,0.25)]',
  none: '',
};

export function PremiumCard({ className, variant = 'default', hover = 'lift', children }: PremiumCardProps) {
  return (
    <motion.div
      {...cardPreset}
      className={cn(
        'rounded-xl border',
        variantStyles[variant],
        hoverStyles[hover],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
