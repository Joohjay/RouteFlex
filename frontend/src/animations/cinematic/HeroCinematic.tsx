import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/animations/hooks';
import { gsap, ScrollTrigger } from '@/animations/hooks/useGSAP';

interface HeroCinematicProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}

export function HeroCinematic({ containerRef, children }: HeroCinematicProps) {
  const prefersReducedMotion = useReducedMotion();
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const routePathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;
    if (animationRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      containerRef.current.querySelectorAll('[data-cinematic-hero]'),
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15 },
      0.4
    );

    if (routePathRef.current) {
      tl.fromTo(
        routePathRef.current,
        { strokeDashoffset: 400 },
        { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out' },
        0
      );
    }

    animationRef.current = tl;

    ScrollTrigger.refresh();

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
        animationRef.current = null;
      }
    };
  }, [prefersReducedMotion, containerRef]);

  return (
    <>
      <svg
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-20"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          ref={routePathRef}
          d="M0 30% Q 20% 25%, 35% 35% T 55% 30% T 75% 40% T 100% 30%"
          stroke="#C29A4A"
          strokeWidth={1}
          fill="none"
          strokeDasharray="8 6"
          strokeDashoffset={400}
          vectorEffect="non-scaling-stroke"
        />
        {[
          { x: '15%', y: '32%' },
          { x: '35%', y: '35%' },
          { x: '55%', y: '30%' },
          { x: '75%', y: '38%' },
          { x: '90%', y: '32%' },
        ].map((dot, i) => (
          <g key={i}>
            <circle cx={dot.x} cy={dot.y} r={2} fill="#C29A4A" opacity={0.6} />
            <circle cx={dot.x} cy={dot.y} r={5} fill="none" stroke="#C29A4A" strokeWidth={0.5} opacity={0.2} />
          </g>
        ))}
      </svg>
      {children}
    </>
  );
}
