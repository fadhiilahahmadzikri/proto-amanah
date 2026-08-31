'use client';

import { gsap } from 'gsap';
import { Check, ShieldAlert, ShieldCheck } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

export function PasswordStrengthTicker(props: {
  password?: string;
  className?: string;
  theme?: 'dark' | 'light';
}) {
  const password = props.password ?? '';
  const isDark = props.theme === 'dark';
  const itemRef = React.useRef<HTMLDivElement>(null);

  const criteria = React.useMemo(() => {
    return [
      {
        id: 'min8',
        label: 'Minimal 8 karakter',
        isMet: password.length >= 8,
      },
      {
        id: 'uppercase',
        label: 'Gunakan huruf besar (A-Z)',
        isMet: /[A-Z]/.test(password),
      },
      {
        id: 'number',
        label: 'Gunakan kombinasi angka (0-9)',
        isMet: /\d/.test(password),
      },
      {
        id: 'special',
        label: 'Gunakan karakter spesial (!@#$%)',
        isMet: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      },
    ];
  }, [password]);

  // Find the first unmet requirement in the sequence
  const firstUnmetIndex = criteria.findIndex(c => !c.isMet);
  const allMet = firstUnmetIndex === -1;
  const currentStep = allMet ? criteria.length : firstUnmetIndex;
  const metCount = criteria.filter(c => c.isMet).length;

  const [displayedStep, setDisplayedStep] = React.useState(currentStep);
  const prevStepRef = React.useRef(currentStep);

  // When user satisfies the current rule, trigger smooth GSAP slide-down & blur transition to the next rule
  React.useEffect(() => {
    if (currentStep === prevStepRef.current) {
      return;
    }
    prevStepRef.current = currentStep;

    if (!itemRef.current) {
      setDisplayedStep(currentStep);
      return;
    }

    // GSAP Exit: Slide current rule down with subtle blur morph
    gsap.to(itemRef.current, {
      y: 10,
      opacity: 0,
      filter: 'blur(5px)',
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => {
        setDisplayedStep(currentStep);

        // GSAP Enter: Slide next target rule down from top into place
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
            duration: 0.28,
            ease: 'power2.out',
          },
        );
      },
    });
  }, [currentStep]);

  const activeRequirement = criteria[displayedStep] ?? null;

  return (
    <div
      className={cn(
        'relative flex items-center justify-between px-1 py-1 bg-transparent border-none shadow-none transition-colors duration-300',
        props.className,
      )}
    >
      {/* 1 Single Target Rule Swap Container (GSAP Sliding & Blurring on Rule Fulfilled) */}
      <div
        ref={itemRef}
        className="flex items-center gap-2 will-change-transform"
      >
        {allMet ? (
          <>
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
              <Check className="h-2.5 w-2.5 stroke-[3]" />
            </div>
            <span className={cn(
              'text-[11px] font-semibold transition-colors',
              isDark ? 'text-emerald-400' : 'text-emerald-800',
            )}>
              Password kuat & memenuhi syarat
            </span>
          </>
        ) : (
          <>
            <div className={cn(
              'flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors',
              isDark ? 'bg-white/15 text-neutral-300' : 'bg-neutral-200 text-neutral-600',
            )}>
              <div className={cn(
                'h-1.5 w-1.5 rounded-full transition-colors',
                isDark ? 'bg-neutral-400' : 'bg-neutral-500',
              )} />
            </div>
            <span className={cn(
              'text-[11px] font-medium transition-colors',
              isDark ? 'text-neutral-300' : 'text-neutral-700',
            )}>
              {activeRequirement?.label}
            </span>
          </>
        )}
      </div>

      {/* Progress Metric */}
      <div className="flex items-center gap-1 shrink-0 pl-2">
        {allMet ? (
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <ShieldAlert className={cn(
            'h-3.5 w-3.5 transition-colors',
            isDark ? 'text-neutral-500' : 'text-neutral-400',
          )} />
        )}
        <span
          className={cn(
            'text-[10px] font-semibold tabular-nums transition-colors',
            allMet
              ? isDark ? 'text-emerald-400' : 'text-emerald-700'
              : metCount > 0
                ? isDark ? 'text-neutral-300' : 'text-neutral-700'
                : isDark ? 'text-neutral-500' : 'text-neutral-500',
          )}
        >
          {metCount}/{criteria.length}
        </span>
      </div>
    </div>
  );
}
