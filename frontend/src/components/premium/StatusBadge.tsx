import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  ACTIVE: {
    label: 'Available',
    dot: 'bg-green-500',
    bg: 'bg-green-50 dark:bg-green-950',
    text: 'text-green-700 dark:text-green-300',
  },
  AVAILABLE: {
    label: 'Available',
    dot: 'bg-green-500',
    bg: 'bg-green-50 dark:bg-green-950',
    text: 'text-green-700 dark:text-green-300',
  },
  IN_TRANSIT: {
    label: 'In Transit',
    dot: 'bg-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950',
    text: 'text-blue-700 dark:text-blue-300',
  },
  MAINTENANCE: {
    label: 'Maintenance',
    dot: 'bg-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    text: 'text-yellow-700 dark:text-yellow-300',
  },
  RETIRED: {
    label: 'Retired',
    dot: 'bg-gray-400',
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-600 dark:text-gray-400',
  },
  PENDING: {
    label: 'Pending',
    dot: 'bg-gray-400',
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-600 dark:text-gray-400',
  },
  CONFIRMED: {
    label: 'Confirmed',
    dot: 'bg-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950',
    text: 'text-blue-700 dark:text-blue-300',
  },
  PICKED_UP: {
    label: 'Picked Up',
    dot: 'bg-[#f59e0b]',
    bg: 'bg-amber-50 dark:bg-amber-950',
    text: 'text-amber-700 dark:text-amber-300',
  },
  DELIVERED: {
    label: 'Delivered',
    dot: 'bg-green-500',
    bg: 'bg-green-50 dark:bg-green-950',
    text: 'text-green-700 dark:text-green-300',
  },
  CANCELLED: {
    label: 'Cancelled',
    dot: 'bg-red-500',
    bg: 'bg-red-50 dark:bg-red-950',
    text: 'text-red-700 dark:text-red-300',
  },
};

export function StatusBadge({ status, className, size = 'sm' }: StatusBadgeProps) {
  const cfg = statusConfig[status] ?? {
    label: status,
    dot: 'bg-gray-400',
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-600 dark:text-gray-400',
  };

  const dotSize = size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium',
        cfg.bg, cfg.text, textSize, className
      )}
    >
      <span className={cn('rounded-full', dotSize, cfg.dot)} />
      {cfg.label}
    </span>
  );
}
