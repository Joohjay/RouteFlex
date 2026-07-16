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
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-[#0a0e1a]"
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
              className="flex items-center gap-3"
            >
              <svg
                className="h-10 w-10 text-[#f59e0b]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                />
              </svg>
              <span className="text-2xl font-bold tracking-wider text-white">
                JJ TRANSPORT
              </span>
            </motion.div>

            <motion.div
              animate={prefersReducedMotion ? { opacity: 1 } : { width: ['0%', '100%'] }}
              transition={{ duration: minDuration / 1000, ease: 'easeInOut' }}
              className="h-0.5 w-48 rounded-full bg-[#f59e0b]/30"
            >
              <motion.div
                animate={{ width: ['0%', '100%'] }}
                transition={{ duration: minDuration / 1000, ease: 'easeInOut' }}
                className="h-full rounded-full bg-[#f59e0b]"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
