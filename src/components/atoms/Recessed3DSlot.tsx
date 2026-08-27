'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function Recessed3DSlotBack(props: {
  isActivating?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn(
        'absolute z-0 flex items-center justify-center pointer-events-none select-none transition-all duration-300',
        props.className,
      )}
      style={props.style}
    >
      {/* 1. Radiant Ambient Golden Backlight Aura */}
      <div className="absolute -top-6 h-24 w-64 rounded-full bg-gradient-to-b from-amber-500/50 via-orange-500/20 to-transparent blur-xl pointer-events-none" />

      {/* 2. Glowing Inner Cavity Receptacle */}
      <div
        className="relative h-24 w-[228px] rounded-b-[32px] rounded-t-[10px] bg-gradient-to-b from-amber-950/40 via-amber-900/20 to-transparent border border-amber-500/20 backdrop-blur-xs"
        style={{
          boxShadow:
            'inset 0 12px 24px rgba(0, 0, 0, 0.7), inset 0 -8px 20px rgba(255, 170, 0, 0.4), 0 8px 25px rgba(245,158,11,0.2)',
        }}
      >
        {/* Glowing Floor Mesh */}
        <div className="absolute bottom-1 inset-x-4 h-5 rounded-full bg-gradient-to-t from-amber-400/40 to-transparent blur-sm" />
      </div>
    </div>
  );
}

export function Recessed3DSlotFront(props: {
  isActivating?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn(
        'absolute z-50 flex flex-col items-center pointer-events-none select-none',
        props.className,
      )}
      style={props.style}
    >
      {/* 3D ATM Golden Guide Bezel */}
      <div className="relative w-[228px] flex flex-col items-center">
        {/* Left and Right 3D Guide Walls */}
        <div className="flex w-full justify-between -mb-1 px-0.5">
          {/* Dinding Kiri (Left Guide Wall - Radiant Amber/Gold Rim) */}
          <div
            className="h-10 w-4 rounded-tl-xl bg-gradient-to-b from-amber-400 via-amber-600 to-amber-800 border-l border-t border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
            style={{
              clipPath: 'polygon(0% 0%, 100% 25%, 100% 100%, 0% 100%)',
            }}
          />

          {/* Dinding Kanan (Right Guide Wall - Shaded Metallic Bronze/Gold Rim) */}
          <div
            className="h-10 w-4 rounded-tr-xl bg-gradient-to-b from-amber-500 via-amber-700 to-amber-900 border-r border-t border-amber-400/60 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
            style={{
              clipPath: 'polygon(0% 25%, 100% 0%, 100% 100%, 0% 100%)',
            }}
          />
        </div>

        {/* Bottom Front Chin & Glowing Beveled Rim Lip (Translucent gold glassmorphism) */}
        <div
          className={cn(
            'relative flex h-8 w-full items-center justify-center rounded-b-[28px] overflow-hidden transition-all duration-300',
            'border-t border-amber-300/80 border-b border-amber-600/40',
            'bg-gradient-to-b from-amber-500/25 via-amber-800/30 to-amber-950/50 backdrop-blur-md',
          )}
          style={{
            boxShadow:
              '0 8px 24px rgba(0,0,0,0.6), inset 0 -3px 10px rgba(255,170,0,0.6), inset 0 2px 4px rgba(255,255,255,0.4)',
          }}
        >
          {/* Glowing Amber Lip Edge */}
          <div className="absolute bottom-0 h-2.5 w-44 rounded-full bg-gradient-to-t from-amber-300 via-amber-500/40 to-transparent blur-[2px]" />

          {/* Center LED Status Indicator */}
          <div
            className={cn(
              'h-1.5 w-14 rounded-full transition-all duration-300',
              props.isActivating
                ? 'bg-amber-300 shadow-[0_0_16px_#fbbf24] scale-x-125'
                : 'bg-amber-400/70 shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse',
            )}
          />
        </div>
      </div>
    </div>
  );
}

export function Recessed3DSlot(props: {
  isActivating?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('relative flex items-center justify-center select-none', props.className)}>
      <Recessed3DSlotBack isActivating={props.isActivating} className="relative z-0" />
      <Recessed3DSlotFront isActivating={props.isActivating} className="absolute top-6 z-10" />
    </div>
  );
}
