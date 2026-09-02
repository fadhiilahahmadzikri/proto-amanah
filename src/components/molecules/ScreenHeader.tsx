'use client';

import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

export function ScreenHeader(props: {
  title: string;
  subtitle?: React.ReactNode;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const isDark = props.theme === 'dark';

  return (
    <header
      className={cn(
        'sticky top-0 inset-x-0 z-30 w-full px-4 h-14 flex items-center justify-between transition-colors duration-200 select-none shrink-0 border-b',
        isDark
          ? 'bg-[#0a0e1a]/95 text-white border-white/10 shadow-xs'
          : 'bg-white/95 text-slate-900 border-slate-200/80 shadow-xs',
        props.className,
      )}
      style={{
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      }}
    >
      <div className="relative z-30 flex items-center justify-start shrink-0">
        {props.onBack ? (
          <button
            type="button"
            aria-label="Kembali"
            onClick={props.onBack}
            className={cn(
              'h-10 w-10 -ml-1.5 rounded-full transition-all cursor-pointer active:scale-90 flex items-center justify-center select-none',
              isDark
                ? 'text-neutral-200 hover:text-white hover:bg-white/10 active:bg-white/15'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 active:bg-slate-200',
            )}
          >
            <ArrowLeft className="h-5 w-5 stroke-[2.2]" />
          </button>
        ) : (
          <div className="w-10 h-10" />
        )}
      </div>

      <div className="absolute inset-x-0 inset-y-0 flex flex-col items-center justify-center pointer-events-none px-14">
        <h2
          className={cn(
            'text-sm sm:text-base font-bold tracking-tight text-center truncate leading-tight',
            isDark ? 'text-white' : 'text-[#14103B]',
          )}
        >
          {props.title}
        </h2>
        {props.subtitle && (
          <span
            className={cn(
              'text-[10.5px] font-medium tracking-tight text-center truncate mt-0.5',
              isDark ? 'text-neutral-400' : 'text-slate-500',
            )}
          >
            {props.subtitle}
          </span>
        )}
      </div>

      <div className="relative z-30 flex items-center justify-end shrink-0">
        {props.rightAction ?? <div className="w-10 h-10" />}
      </div>
    </header>
  );
}
