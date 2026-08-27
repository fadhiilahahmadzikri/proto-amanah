'use client';

import { cn } from '@/lib/utils';

export function BottomNotchedDock(props: {
  isActivating?: boolean;
  dragProgress?: number;
  isLongPressing?: boolean;
  theme?: 'dark' | 'light';
  label?: string;
  className?: string;
}) {
  const { isActivating, dragProgress = 0, isLongPressing = false, theme = 'dark', label, className } = props;
  const activeProgress = isActivating ? 1 : dragProgress;
  const isDark = theme === 'dark';

  return (
    <div
      className={cn(
        'absolute inset-x-0 bottom-0 z-30 flex flex-col items-center pointer-events-none select-none transition-all duration-500 ease-out',
        isActivating ? 'translate-y-48 opacity-0' : 'translate-y-0 opacity-100',
        className,
      )}
    >
      {/* 1. Volumetric Aura & Rising Heat Beam */}
      <div
        className="absolute top-0 inset-x-0 flex flex-col items-center pointer-events-none transition-all duration-700 z-0 overflow-visible"
        style={{
          opacity: isLongPressing ? 1 : 0.2 + activeProgress * 0.8,
        }}
      >
        {/* Rising Aura Beam on Long-Press */}
        <div
          className={cn(
            'absolute -top-36 h-[220px] w-[260px] rounded-t-full bg-gradient-to-t from-blue-600/90 via-sky-500/60 to-transparent blur-2xl transition-all duration-1000 ease-out pointer-events-none origin-bottom',
            isLongPressing
              ? 'opacity-100 scale-y-100 scale-x-105 animate-pulse'
              : 'opacity-0 scale-y-50 scale-x-90',
          )}
        />

        {/* Inner Cyan Heat Core */}
        <div
          className={cn(
            'absolute -top-24 h-[160px] w-[200px] rounded-t-full bg-gradient-to-t from-blue-500/80 via-cyan-400/50 to-transparent blur-xl transition-all duration-1200 ease-out pointer-events-none origin-bottom',
            isLongPressing
              ? 'opacity-90 scale-y-100 scale-x-100'
              : 'opacity-0 scale-y-30 scale-x-80',
          )}
        />

        {/* Semi-Circular Radial Volumetric Dome Halo */}
        <div
          className={cn(
            'relative -top-16 h-[150px] w-[245px] rounded-t-full bg-gradient-to-t from-blue-500/70 via-sky-400/40 to-transparent blur-xl transition-all duration-700',
            isLongPressing ? 'scale-110 from-blue-600/80 via-cyan-500/50' : '',
          )}
          style={{
            transform: isLongPressing ? 'scale(1.08)' : `scale(${0.92 + activeProgress * 0.28})`,
          }}
        />

        {/* Interior Cavity Core Radial Aperture Glow */}
        <div
          className={cn(
            'absolute top-2 h-[45px] w-[235px] rounded-full blur-md transition-all duration-800',
            isLongPressing ? 'bg-sky-400 shadow-[0_0_25px_#38bdf8] scale-105' : 'bg-blue-400/90',
          )}
          style={{
            opacity: isLongPressing ? 1 : 0.45 + activeProgress * 0.55,
          }}
        />
      </div>

      {/* 2. SVG Notched Solid Foreground Floor Mask */}
      <div className="relative w-full h-[145px] z-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 390 145"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Deep Recessed Hollow Slot Cavity Opening */}
          <path
            d="M 73 10 Q 81 10 83 18 L 86 30 Q 89 40 100 40 L 290 40 Q 301 40 304 30 L 307 18 Q 309 10 317 10 L 317 55 L 73 55 Z"
            fill="url(#hollowCavityBacking)"
          />

          {/* Elevated Solid Notched Box Surface */}
          <path
            d="M 0 10 L 73 10 Q 81 10 83 18 L 86 30 Q 89 40 100 40 L 290 40 Q 301 40 304 30 L 307 18 Q 309 10 317 10 L 390 10 L 390 145 L 0 145 Z"
            fill="url(#bottomDockBoxSurface)"
          />

          {/* Ambient Glow across whole contour */}
          <path
            d="M 0 10 L 73 10 Q 81 10 83 18 L 86 30 Q 89 40 100 40 L 290 40 Q 301 40 304 30 L 307 18 Q 309 10 317 10 L 390 10"
            stroke="url(#ambientNotchGlow)"
            strokeWidth="5.5"
            fill="none"
            className="blur-[3.5px]"
          />

          {/* Base Rim Stroke */}
          <path
            d="M 0 10 L 73 10 Q 81 10 83 18 L 86 30 Q 89 40 100 40 L 290 40 Q 301 40 304 30 L 307 18 Q 309 10 317 10 L 390 10"
            stroke="url(#notchedGoldRim)"
            strokeWidth="1.85"
            fill="none"
          />

          {/* Dedicated Molten Glow on Core Lip */}
          <path
            d="M 100 40 L 290 40"
            stroke="url(#straightMoltenGlow)"
            strokeWidth={isLongPressing ? 8 : 0}
            strokeLinecap="round"
            fill="none"
            className={cn('transition-all duration-1000 ease-out', isLongPressing ? 'opacity-100 blur-[4px]' : 'opacity-0')}
          />

          {/* Dedicated Radiant Core Filament */}
          <path
            d="M 100 40 L 290 40"
            stroke="url(#straightMoltenCore)"
            strokeWidth={isLongPressing ? 3 : 0}
            strokeLinecap="round"
            fill="none"
            className={cn('transition-all duration-1000 ease-out', isLongPressing ? 'opacity-100' : 'opacity-0')}
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="bottomDockBoxSurface" x1="0%" y1="0%" x2="0%" y2="100%">
              {isDark ? (
                <>
                  <stop offset="0%" stopColor="#0f1629" />
                  <stop offset="35%" stopColor="#0a0f1d" />
                  <stop offset="100%" stopColor="#050810" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#e2e8f0" />
                  <stop offset="35%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </>
              )}
            </linearGradient>
            <linearGradient id="hollowCavityBacking" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#060913" />
              <stop offset="100%" stopColor="#020306" />
            </linearGradient>
            <linearGradient id="ambientNotchGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0" />
              <stop offset="22%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="78%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="notchedGoldRim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0369a1" stopOpacity="0.1" />
              <stop offset="22%" stopColor="#0284c7" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="1" />
              <stop offset="78%" stopColor="#0284c7" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="straightMoltenGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.2" />
              <stop offset="20%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#7dd3fc" stopOpacity="1" />
              <stop offset="80%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="straightMoltenCore" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
              <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#e0f2fe" stopOpacity="1" />
              <stop offset="75%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 3. Drag-to-Activate Instruction Prompt */}
      <div
        className={cn(
          'absolute top-[66px] inset-x-0 z-20 flex flex-col items-center transition-opacity duration-300 pointer-events-none px-4',
          isActivating ? 'opacity-0' : 'opacity-100',
        )}
      >
        <p
          className={cn(
            'text-xs sm:text-[13px] font-semibold tracking-wide transition-all duration-300 text-center select-none',
            activeProgress > 0.05
              ? 'text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.85)] font-bold'
              : isDark ? 'text-slate-300' : 'text-slate-700',
          )}
        >
          {label ?? 'Tarik antrean ke bawah untuk proses'}
        </p>
      </div>

      {/* 4. Bottom Home Indicator Gesture Bar */}
      <div className="absolute bottom-2.5 z-20 flex justify-center pointer-events-none">
        <div className={cn('h-1 w-28 rounded-full backdrop-blur-sm', isDark ? 'bg-white/35' : 'bg-black/35')} />
      </div>
    </div>
  );
}
