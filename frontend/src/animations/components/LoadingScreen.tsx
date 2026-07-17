import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface LoadingScreenProps {
  minDuration?: number;
}

export function LoadingScreen({ minDuration = 1500 }: LoadingScreenProps) {
  const [isDone, setIsDone] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setIsDone(true), minDuration);
    return () => clearTimeout(timer);
  }, [minDuration]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-[#163A5F]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <motion.div className="flex flex-col items-center gap-4">
            <motion.div
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : {
                      scale: [1, 1.15, 1],
                      opacity: [0.6, 1, 0.6],
                    }
              }
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center"
            >
              <img
                src="/images/logo/jj-transports-logo-truck-centerpiece-removebg-preview.png"
                alt="JJ Transport"
                className="h-32 w-auto"
              />
            </motion.div>

            <motion.div
              animate={prefersReducedMotion ? { opacity: 1 } : { width: ['0%', '100%'] }}
              transition={{ duration: minDuration / 1000, ease: 'easeInOut' }}
              className="h-0.5 w-48 rounded-full bg-[#C29A4A]/30"
            >
              <motion.div
                animate={{ width: ['0%', '100%'] }}
                transition={{ duration: minDuration / 1000, ease: 'easeInOut' }}
                className="h-full rounded-full bg-[#C29A4A]"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
