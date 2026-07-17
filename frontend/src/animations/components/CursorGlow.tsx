import { useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

export function CursorGlow() {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean | null>(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springX = useSpring(cursorX, { stiffness: 150, damping: 15 });
  const springY = useSpring(cursorY, { stiffness: 150, damping: 15 });

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  const handleMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    if (!isVisible) setIsVisible(true);
  }, [cursorX, cursorY, isVisible]);

  const handleLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (isTouchDevice !== false || prefersReducedMotion) return;
    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseleave', handleLeave);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [isTouchDevice, prefersReducedMotion, handleMove, handleLeave]);

  if (isTouchDevice !== false || prefersReducedMotion) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <motion.div
        animate={{
          opacity: isVisible ? 0.6 : 0,
          scale: isVisible ? 1 : 0.3,
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="h-80 w-80 rounded-full bg-[#C29A4A]/10 blur-[80px]"
      />
      <motion.div
        animate={{
          opacity: isVisible ? 0.5 : 0,
          scale: isVisible ? 1 : 0.3,
        }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 0.05 }}
        className="absolute inset-0 h-40 w-40 rounded-full bg-[#C29A4A]/20 blur-[40px]"
      />
    </motion.div>
  );
}
