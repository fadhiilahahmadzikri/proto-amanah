'use client';

import { cn } from '@/lib/utils';

export function BottomNotchedDock(props: {
  isActivating?: boolean;
  dragProgress?: number;
  isLongPressing?: boolean;
  label?: string;
  className?: string;
}) {
  const { isActivating, dragProgress = 0, isLongPressing = false, label, className } = props;
  const activeProgress = isActivating ? 1 : dragProgress;

  return (
    <div
      className={cn(
        'absolute inset-x-0 bottom-0 z-30 flex flex-col items-center pointer-events-none select-none transition-all duration-500 ease-out',
        isActivating ? 'translate-y-48 opacity-0' : 'translate-y-0 opacity-100',
        className,
      )}
    >
      {/* 1. Interior Slot Radiant Semi-Circular Halo Emitter (20% Initial Base Glow -> 100% on Drag) */}
      <div
        className="absolute top-0 inset-x-0 flex flex-col items-center pointer-events-none transition-all duration-300 z-0 overflow-visible"
        style={{
          opacity: isLongPressing ? 1 : 0.2 + activeProgress * 0.8,
        }}
      >
        {/* Superheated Molten Thermal Aura on Long-Press */}
        <div
          className={cn(
            'absolute -top-24 h-[175px] w-[245px] rounded-t-full bg-gradient-to-t from-red-600 via-orange-500 to-amber-300 blur-xl transition-all duration-300 pointer-events-none',
            isLongPressing ? 'opacity-100 scale-105 animate-pulse' : 'opacity-0 scale-90',
          )}
        />

        {/* Semi-Circular Radial Volumetric Dome Halo */}
        <div
          className={cn(
            'relative -top-16 h-[150px] w-[245px] rounded-t-full bg-gradient-to-t from-amber-400/85 via-orange-500/40 to-transparent blur-xl transition-all duration-200',
            isLongPressing ? 'scale-110 from-orange-500/90 via-red-500/60' : '',
          )}
          style={{
            transform: isLongPressing ? 'scale(1.1)' : `scale(${0.92 + activeProgress * 0.28})`,
          }}
        />

        {/* Interior Cavity Core Radial Aperture Glow */}
        <div
          className={cn(
            'absolute top-2 h-[45px] w-[235px] rounded-full blur-md transition-all duration-300',
            isLongPressing ? 'bg-orange-500 shadow-[0_0_25px_#ea580c] scale-105' : 'bg-amber-300/90',
          )}
          style={{
            opacity: isLongPressing ? 1 : 0.45 + activeProgress * 0.55,
          }}
        />
      </div>

      {/* 2. SVG Notched Solid Foreground Floor Mask (z-10, fully opaque surface) */}
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

          {/* Elevated Warm Brown Solid Notched Box Surface */}
          <path
            d="M 0 10 L 73 10 Q 81 10 83 18 L 86 30 Q 89 40 100 40 L 290 40 Q 301 40 304 30 L 307 18 Q 309 10 317 10 L 390 10 L 390 145 L 0 145 Z"
            fill="url(#bottomDockBoxSurface)"
          />

          {/* Ambient Glow across whole contour (Seamlessly lights up entire notch floor and corners) */}
          <path
            d="M 0 10 L 73 10 Q 81 10 83 18 L 86 30 Q 89 40 100 40 L 290 40 Q 301 40 304 30 L 307 18 Q 309 10 317 10 L 390 10"
            stroke="url(#ambientNotchGlow)"
            strokeWidth="5.5"
            fill="none"
            className="blur-[3.5px]"
          />

          {/* Base Golden Beveled Rim (Seamless corner-to-corner luminescence) */}
          <path
            d="M 0 10 L 73 10 Q 81 10 83 18 L 86 30 Q 89 40 100 40 L 290 40 Q 301 40 304 30 L 307 18 Q 309 10 317 10 L 390 10"
            stroke="url(#notchedGoldRim)"
            strokeWidth="1.85"
            fill="none"
          />

          {/* 3. Dedicated Superheated Molten Glow strictly on the Straight Core Lip (X: 100 -> 290, Y: 40) */}
          <path
            d="M 100 40 L 290 40"
            stroke="url(#straightMoltenGlow)"
            strokeWidth={isLongPressing ? 10 : 0}
            strokeLinecap="round"
            fill="none"
            className={cn('transition-all duration-300', isLongPressing ? 'opacity-100 blur-[5px]' : 'opacity-0')}
          />

          {/* 4. Dedicated White-Hot Incandescent Core Filament strictly on the Straight Core Lip (X: 100 -> 290, Y: 40) */}
          <path
            d="M 100 40 L 290 40"
            stroke="url(#straightMoltenCore)"
            strokeWidth={isLongPressing ? 3.5 : 0}
            strokeLinecap="round"
            fill="none"
            className={cn('transition-all duration-300', isLongPressing ? 'opacity-100' : 'opacity-0')}
          />

          {/* Gradients: Elevated Warm Brown Box Surface + Deep Cavity + Wide Aperture Rim + Straight Molten Core */}
          <defs>
            <linearGradient id="bottomDockBoxSurface" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#23150d" />
              <stop offset="35%" stopColor="#180e08" />
              <stop offset="100%" stopColor="#100905" />
            </linearGradient>
            <linearGradient id="hollowCavityBacking" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0d0704" />
              <stop offset="100%" stopColor="#040201" />
            </linearGradient>
            <linearGradient id="ambientNotchGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b45309" stopOpacity="0" />
              <stop offset="12%" stopColor="#d97706" stopOpacity="0.15" />
              <stop offset="22%" stopColor="#f59e0b" stopOpacity="0.5" />
              <stop offset="35%" stopColor="#fbbf24" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#fcd34d" stopOpacity="0.85" />
              <stop offset="65%" stopColor="#fbbf24" stopOpacity="0.75" />
              <stop offset="78%" stopColor="#f59e0b" stopOpacity="0.5" />
              <stop offset="88%" stopColor="#d97706" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="notchedGoldRim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#92400e" stopOpacity="0.05" />
              <stop offset="12%" stopColor="#d97706" stopOpacity="0.2" />
              <stop offset="22%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="35%" stopColor="#fbbf24" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#fde047" stopOpacity="1" />
              <stop offset="65%" stopColor="#fbbf24" stopOpacity="0.95" />
              <stop offset="78%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="88%" stopColor="#d97706" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#92400e" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="straightMoltenGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
              <stop offset="18%" stopColor="#f97316" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#fde047" stopOpacity="1" />
              <stop offset="82%" stopColor="#f97316" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="straightMoltenCore" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
              <stop offset="25%" stopColor="#fbbf24" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#fef08a" stopOpacity="1" />
              <stop offset="75%" stopColor="#fbbf24" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 3. Drag-to-Activate Instruction Prompt (Centrally Positioned in the Solid Floor Plate) */}
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
              ? 'bg-gradient-to-r from-amber-200 via-orange-400 to-amber-700 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(251,191,36,0.75)] font-bold'
              : 'text-white/90 drop-shadow-none',
          )}
        >
          {label ?? 'Drag down to activate offer'}
        </p>
      </div>

      {/* 4. Bottom Home Indicator Gesture Bar */}
      <div className="absolute bottom-2.5 z-20 flex justify-center pointer-events-none">
        <div className="h-1 w-28 rounded-full bg-white/35 backdrop-blur-sm" />
      </div>
    </div>
  );
}
