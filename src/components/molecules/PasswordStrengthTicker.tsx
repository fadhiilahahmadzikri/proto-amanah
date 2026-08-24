'use client';

import { gsap } from 'gsap';
import { Check, ShieldCheck } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

interface CriteriaItem {
  id: string;
  label: string;
  isMet: boolean;
}

export function PasswordStrengthTicker(props: {
  password?: string;
  className?: string;
}) {
  const password = props.password ?? '';
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const itemRef = React.useRef<HTMLDivElement>(null);

  const criteria: CriteriaItem[] = React.useMemo(() => {
    return [
      {
        id: 'min8',
        label: 'Minimal 8 karakter',
        isMet: password.length >= 8,
      },
      {
        id: 'uppercase',
        label: 'Huruf besar (A-Z)',
        isMet: /[A-Z]/.test(password),
      },
      {
        id: 'lowercase',
        label: 'Huruf kecil (a-z)',
        isMet: /[a-z]/.test(password),
      },
      {
        id: 'number',
        label: 'Kombinasi angka (0-9)',
        isMet: /\d/.test(password),
      },
      {
        id: 'special',
        label: 'Karakter spesial (!@#$%)',
        isMet: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      },
    ];
  }, [password]);

  // Periodic GSAP sliding down + blur animation to swap context
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!itemRef.current) {
        return;
      }

      // GSAP Exit Animation: Slide down with blurry motion
      gsap.to(itemRef.current, {
        y: 10,
        opacity: 0,
        filter: 'blur(5px)',
        duration: 0.28,
        ease: 'power2.in',
        onComplete: () => {
          setCurrentIndex(prev => (prev + 1) % criteria.length);

          // GSAP Enter Animation: Slide in from top with smooth blur resolution
          gsap.fromTo(
            itemRef.current,
            {
              y: -10,
              opacity: 0,
              filter: 'blur(5px)',
            },
            {
              y: 0,
              opacity: 1,
              filter: 'blur(0px)',
              duration: 0.32,
              ease: 'power2.out',
            },
          );
        },
      });
    }, 2400);

    return () => {
      clearInterval(interval);
    };
  }, [criteria.length]);

  const activeItem = criteria[currentIndex] ?? criteria[0];

  if (!activeItem) {
    return null;
  }

  const allMet = criteria.every(c => c.isMet);
  const metCount = criteria.filter(c => c.isMet).length;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex items-center justify-between overflow-hidden rounded-xl px-3 py-1.5 transition-colors duration-300',
        allMet
          ? 'bg-emerald-50/90 border border-emerald-200/70'
          : metCount > 0
            ? 'bg-neutral-50/90 border border-neutral-200/70'
            : 'bg-neutral-50/60 border border-neutral-100',
        props.className,
      )}
    >
      {/* 1 Single Context Swap Ticker Area with GSAP Animations */}
      <div
        ref={itemRef}
        className="flex items-center gap-2 will-change-transform"
      >
        <div
          className={cn(
            'flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors duration-200',
            activeItem.isMet
              ? 'bg-emerald-600 text-white'
              : 'bg-neutral-200 text-neutral-500',
          )}
        >
          {activeItem.isMet ? (
            <Check className="h-2.5 w-2.5 stroke-[3]" />
          ) : (
            <div className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
          )}
        </div>
        <span
          className={cn(
            'text-[11px] font-medium leading-none tracking-normal transition-colors duration-200',
            activeItem.isMet ? 'text-emerald-800' : 'text-neutral-600',
          )}
        >
          {activeItem.label}
        </span>
      </div>

      {/* Right Progress Capsule */}
      <div className="flex items-center gap-1 shrink-0 pl-2">
        <ShieldCheck
          className={cn(
            'h-3.5 w-3.5 transition-colors',
            allMet
              ? 'text-emerald-600'
              : metCount >= 3
                ? 'text-amber-500'
                : 'text-neutral-400',
          )}
        />
        <span
          className={cn(
            'text-[10px] font-semibold tabular-nums',
            allMet
              ? 'text-emerald-700'
              : metCount >= 3
                ? 'text-amber-600'
                : 'text-neutral-500',
          )}
        >
          {metCount}/{criteria.length}
        </span>
      </div>
    </div>
  );
}
