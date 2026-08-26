'use client';

import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

export function ScreenHeader(props: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const isDark = props.theme === 'dark';

  return (
    <header
      className={cn(
        'absolute top-0 inset-x-0 z-30 w-full px-5 pt-3 pb-3 flex items-center justify-between transition-colors duration-300 select-none shrink-0 border-none outline-none',
        isDark
          ? 'bg-[#0a0e1a]/70 text-white shadow-xs'
          : 'bg-white/75 text-slate-900 shadow-xs',
        props.className,
      )}
      style={{
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      }}
    >
      {/* 1. Leading / Start (Vector-Only Back Button or Balance Spacer) */}
      <div className="flex items-center justify-start min-w-9">
        {props.onBack ? (
          <button
            type="button"
            aria-label="Kembali"
            onClick={props.onBack}
            className={cn(
              'p-1.5 -ml-1.5 rounded-full transition-all cursor-pointer active:scale-90 flex items-center justify-center',
              isDark
                ? 'text-neutral-200 hover:text-white hover:bg-white/10'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100',
            )}
          >
            <ArrowLeft className="h-6 w-6 stroke-[2]" />
          </button>
        ) : (
          <div className="w-9 h-9" />
        )}
      </div>

      {/* 2. Center: Prominent Screen Title & Optional Subtitle */}
      <div className="flex flex-col items-center justify-center truncate px-2 min-w-0">
        <h2
          className={cn(
            'text-base sm:text-lg font-bold tracking-tight text-center truncate leading-tight',
            isDark ? 'text-white' : 'text-[#14103B]',
          )}
        >
          {props.title}
        </h2>
        {props.subtitle && (
          <span
            className={cn(
              'text-[11px] font-medium tracking-tight text-center truncate mt-0.5',
              isDark ? 'text-neutral-400' : 'text-slate-500',
            )}
          >
            {props.subtitle}
          </span>
        )}
      </div>

      {/* 3. Trailing / End (Optional Action or Balance Spacer) */}
      <div className="flex items-center justify-end min-w-9">
        {props.rightAction ?? <div className="w-9 h-9" />}
      </div>
    </header>
  );
}
