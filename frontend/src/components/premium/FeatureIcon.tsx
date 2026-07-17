import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface FeatureIconProps {
  icon: LucideIcon;
  size?: number;
  variant?: 'gold' | 'navy' | 'outline';
  className?: string;
}

const variantStyles: Record<string, string> = {
  gold: 'bg-[#C29A4A]/10 text-[#C29A4A] group-hover:bg-[#C29A4A] group-hover:text-white',
  navy: 'bg-[#163A5F]/10 text-[#163A5F] dark:bg-white/10 dark:text-white',
  outline: 'border border-[#C29A4A]/30 text-[#C29A4A] bg-transparent',
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
