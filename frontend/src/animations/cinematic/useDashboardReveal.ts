import { useEffect } from 'react';
import { gsap } from '@/animations/hooks/useGSAP';
import { useReducedMotion } from '@/animations/hooks';

export function useDashboardReveal(containerRef: React.RefObject<HTMLDivElement | null>, deps: unknown[] = []) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const cards = containerRef.current.querySelectorAll('[data-dashboard-card]');
    const charts = containerRef.current.querySelectorAll('[data-dashboard-chart]');
    const tables = containerRef.current.querySelectorAll('[data-dashboard-table]');
    const rows = containerRef.current.querySelectorAll('[data-dashboard-row]');

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
    });

    tl.fromTo(
      cards,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08 }
    );

    if (charts.length > 0) {
      tl.fromTo(
        charts,
        { opacity: 0, scaleY: 0 },
        { opacity: 1, scaleY: 1, duration: 0.5, stagger: 0.1, transformOrigin: 'bottom center' },
        '-=0.2'
      );
    }

    if (tables.length > 0) {
      tl.fromTo(
        tables,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        '-=0.1'
      );
    }

    if (rows.length > 0) {
      tl.fromTo(
        rows,
        { opacity: 0, x: -15 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.04 },
        '-=0.1'
      );
    }

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
