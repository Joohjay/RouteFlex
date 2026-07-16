import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface FeatureIconProps {
  icon: LucideIcon;
  size?: number;
  variant?: 'gold' | 'navy' | 'outline';
  className?: string;
}

const variantStyles: Record<string, string> = {
  gold: 'bg-[#f59e0b]/10 text-[#f59e0b] group-hover:bg-[#f59e0b] group-hover:text-white',
  navy: 'bg-[#0f172a]/10 text-[#0f172a] dark:bg-white/10 dark:text-white',
  outline: 'border border-[#f59e0b]/30 text-[#f59e0b] bg-transparent',
};

export function FeatureIcon({ icon: Icon, size = 24, variant = 'gold', className }: FeatureIconProps) {
  return (
    <div
      className={cn(
        'flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300',
        variantStyles[variant],
        className
      )}
    >
      <Icon size={size} />
    </div>
  );
}
