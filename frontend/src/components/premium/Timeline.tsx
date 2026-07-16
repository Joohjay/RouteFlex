import { motion } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimelineEvent {
  status: string;
  label: string;
  description?: string;
  timestamp: string;
  location?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}

export interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function Timeline({ events, className }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {events.map((event, i) => {
        const Icon = event.icon;
        const isLast = i === events.length - 1;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.4 }}
            className="relative flex gap-5 pb-8 last:pb-0"
          >
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 + 0.15, type: 'spring', stiffness: 200 }}
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 bg-white dark:bg-gray-950',
                  event.color.replace('text-', 'border-')
                )}
              >
                <Icon size={16} className={event.color} />
              </motion.div>
              {!isLast && (
                <div className="mt-1 h-full w-px bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-700" />
              )}
            </div>
            <div className="min-w-0 flex-1 pt-1">
              <p className="font-semibold">{event.label}</p>
              {event.description && (
                <p className="mt-0.5 text-sm text-muted-foreground">{event.description}</p>
              )}
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                <span className="inline-flex items-center gap-1">
                  <Clock size={11} />
                  {new Date(event.timestamp).toLocaleString('en-US', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </span>
                {event.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={11} />
                    {event.location}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
