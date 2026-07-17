import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { gsap } from '@/animations/hooks/useGSAP';
import { useReducedMotion } from '@/animations/hooks';

export interface LoginCinematicHandle {
  playExit: () => Promise<void>;
}

interface LoginCinematicProps {
  onComplete?: () => void;
  children: React.ReactNode;
}

const CARGO_W = 112;
const INITIAL_GAP = 150;

export const LoginCinematic = forwardRef<LoginCinematicHandle, LoginCinematicProps>(
  function LoginCinematic({ onComplete, children }, ref) {
    const prefersReducedMotion = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);
    const roadPathRef = useRef<SVGPathElement>(null);
    const roadGlowRef = useRef<HTMLDivElement>(null);
    const nodesGroupRef = useRef<SVGGElement>(null);
    const truckRef = useRef<HTMLDivElement>(null);
    const cargoRef = useRef<HTMLDivElement>(null);
    const panelContentRef = useRef<HTMLDivElement>(null);
    const exitResolveRef = useRef<(() => void) | null>(null);

    useImperativeHandle(ref, () => ({
      playExit: () => new Promise<void>((resolve) => {
        if (prefersReducedMotion) {
          resolve();
          return;
        }
        exitResolveRef.current = resolve;
        playExitAnimation();
      }),
    }));

    const playExitAnimation = () => {
      const tl = gsap.timeline({
        onComplete: () => {
          exitResolveRef.current?.();
        },
      });

      tl.to(panelContentRef.current, { opacity: 0, duration: 0.15, ease: 'power2.in' });

      tl.set(cargoRef.current, { display: 'flex', opacity: 1, scale: 1 });

      tl.fromTo(cargoRef.current, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)' });

      tl.to(cargoRef.current, { x: `-=${INITIAL_GAP}`, duration: 0.7, ease: 'power3.in' }, '-=0.1');

      tl.to(truckRef.current, { x: '100vw', duration: 1.2, ease: 'power2.in' }, '-=0.4');
      tl.to(cargoRef.current, { x: '100vw', opacity: 0, duration: 1.2, ease: 'power2.in' }, '-=1.0');

      tl.to([roadPathRef.current, roadGlowRef.current, nodesGroupRef.current], {
        opacity: 0,
        duration: 0.5,
      }, '-=0.5');
    };

    useEffect(() => {
      if (prefersReducedMotion) {
        onComplete?.();
        return;
      }

      const vw = window.innerWidth;
      const cargoCenterX = vw / 2 - CARGO_W / 2;
      const truckTargetX = Math.min(vw * 0.08, 120);
      const cargoFollowX = truckTargetX + INITIAL_GAP;

      const tl = gsap.timeline({
        onComplete: () => {
          onComplete?.();
        },
      });

      tl.set([truckRef.current, cargoRef.current], { x: -500, opacity: 0 });
      tl.set(panelContentRef.current, { opacity: 0 });
      tl.set(nodesGroupRef.current, { opacity: 0, scale: 0.8 });
      tl.set(roadGlowRef.current, { opacity: 0 });

      tl.to(roadPathRef.current, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: 'power2.out',
      }, 0);

      tl.to(roadGlowRef.current, {
        opacity: 0.2,
        duration: 0.8,
      }, '-=0.6');

      tl.to(nodesGroupRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(2)',
      }, '-=0.4');

      tl.to(truckRef.current, {
        x: truckTargetX,
        opacity: 1,
        duration: 1.6,
        ease: 'power3.out',
      }, '-=0.3');

      tl.to(cargoRef.current, {
        x: cargoFollowX,
        opacity: 1,
        duration: 1.6,
        ease: 'power3.out',
      }, '-=1.6');

      tl.to({}, { duration: 0.15 });

      tl.to(cargoRef.current, {
        x: cargoCenterX,
        duration: 0.8,
        ease: 'power3.out',
      });

      tl.to(cargoRef.current, {
        scale: 1.08,
        duration: 0.3,
        ease: 'power2.out',
      });

      tl.to(cargoRef.current, {
        opacity: 0,
        duration: 0.15,
        ease: 'power2.in',
      });

      tl.to(panelContentRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
        onStart: () => {
          if (panelContentRef.current) panelContentRef.current.style.pointerEvents = 'auto';
        },
      }, '-=0.25');

      tl.to(truckRef.current, {
        x: '100vw',
        opacity: 0,
        duration: 1,
        ease: 'power2.in',
      }, '-=0.8');

      return () => { tl.kill(); };
    }, [prefersReducedMotion, onComplete]);

    if (prefersReducedMotion) {
      return <>{children}</>;
    }

    return (
      <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-[#0F1F2E]">
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C29A4A]/5 blur-3xl" />

        <div className="absolute left-0 right-0 top-1/2 z-0 -translate-y-1/2">
          <div className="h-px bg-[#2A2A2D]" />
          <svg className="absolute inset-0 h-px w-full" viewBox="0 0 1200 1" preserveAspectRatio="none">
            <path
              ref={roadPathRef}
              d="M0 0.5 L1200 0.5"
              stroke="#C29A4A"
              strokeWidth={1.5}
              strokeDasharray="16 12"
              strokeDashoffset={1200}
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div
            ref={roadGlowRef}
            className="absolute left-0 right-0 top-1/2 h-16 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#C29A4A]/8 to-transparent blur-xl"
          />
        </div>

        <svg className="absolute inset-0 z-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
          <g ref={nodesGroupRef}>
            {[
              { x: '12%', y: '38%', r: 2.5 },
              { x: '25%', y: '55%', r: 3 },
              { x: '40%', y: '44%', r: 2 },
              { x: '55%', y: '52%', r: 3.5 },
              { x: '68%', y: '42%', r: 2 },
              { x: '82%', y: '50%', r: 3 },
              { x: '93%', y: '46%', r: 2.5 },
            ].map((node, i) => (
              <g key={i}>
                <circle cx={node.x} cy={node.y} r={node.r} fill="#C29A4A" opacity={0.7} />
                <circle cx={node.x} cy={node.y} r={node.r * 2.5} fill="none" stroke="#C29A4A" strokeWidth={0.5} opacity={0.2} />
                <circle cx={node.x} cy={node.y} r={node.r * 5} fill="none" stroke="#C29A4A" strokeWidth={0.3} opacity={0.08} />
              </g>
            ))}
            <path
              d="M12% 38% L25% 55% L40% 44% L55% 52% L68% 42% L82% 50% L93% 46%"
              stroke="#C29A4A"
              strokeWidth={0.5}
              opacity={0.15}
              fill="none"
            />
          </g>
        </svg>

        <div
          ref={truckRef}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2"
        >
          <svg width="140" height="56" viewBox="0 0 140 56" fill="none">
            <rect x="75" y="10" width="60" height="28" rx="4" fill="#1B2A3F" />
            <rect x="83" y="6" width="28" height="16" rx="3" fill="#1B2A3F" />
            <rect x="86" y="8" width="22" height="12" rx="2" fill="#2A4A6F" opacity={0.5} />
            <rect x="0" y="20" width="85" height="6" rx="2" fill="#2A2A2D" />
            <circle cx="30" cy="42" r="7" fill="#1B1B1D" />
            <circle cx="30" cy="42" r="3.5" fill="#5E646B" />
            <circle cx="115" cy="42" r="7" fill="#1B1B1D" />
            <circle cx="115" cy="42" r="3.5" fill="#5E646B" />
            <rect x="128" y="14" width="4" height="20" rx="1.5" fill="#C29A4A" />
            <rect x="128" y="14" width="2" height="20" rx="1" fill="#D4AA4A" opacity={0.6} />
          </svg>
        </div>

        <div
          ref={cargoRef}
          className="pointer-events-none absolute left-0 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center"
        >
          <div className="flex h-16 w-28 items-center justify-center rounded-lg border-2 border-[#C29A4A]/80 bg-gradient-to-br from-[#C29A4A] to-[#B8863A] shadow-lg shadow-[#C29A4A]/30">
            <span className="text-xs font-bold tracking-widest text-[#163A5F]">JJ</span>
          </div>
        </div>

        <div
          ref={panelContentRef}
          className="pointer-events-none fixed left-1/2 top-1/2 z-20 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4 opacity-0"
        >
          {children}
        </div>
      </div>
    );
  }
);
