import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  light?: boolean;
}

export function SectionHeader({ title, subtitle, centered = false, className, light = false }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(centered && 'text-center', className)}
    >
      <h2
        className={cn(
          'text-3xl font-bold tracking-tight sm:text-4xl',
          light ? 'text-white' : 'text-foreground'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn('mt-4 text-lg', light ? 'text-white/80' : 'text-muted-foreground')}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
