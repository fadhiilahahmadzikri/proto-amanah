'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import { GlassTouchCursor } from '@/components/atoms/GlassTouchCursor';
import { cn } from '@/lib/utils';

export function PhoneFrame(props: {
  children: React.ReactNode;
  className?: string;
  isDarkContent?: boolean;
  onSwipeBack?: () => void;
}) {
  const isDark = props.isDarkContent ?? false;
  const screenRef = React.useRef<HTMLDivElement>(null);

  // Dual Edge Swipe Navigation (Swipe from Left or Right edge to navigate / dismiss)
  const [edgeSwipe, setEdgeSwipe] = React.useState<{
    active: boolean;
    side: 'left' | 'right' | null;
    deltaX: number;
    y: number;
  }>({
    active: false,
    side: null,
    deltaX: 0,
    y: 350,
  });

  const swipeStartRef = React.useRef<{
    x: number;
    y: number;
    side: 'left' | 'right' | null;
  }>({
    x: 0,
    y: 350,
    side: null,
  });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // If user clicks on an interactive button, link, or input, do NOT hijack with edge swipe
    const target = e.target as HTMLElement | null;
    if (target?.closest('button, a, input, textarea, select, [role="button"]')) {
      swipeStartRef.current = { x: 0, y: 350, side: null };
      return;
    }

    const screen = screenRef.current;
    if (!screen) {
      return;
    }
    const rect = screen.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    const width = rect.width;

    // Detect if pointer started from Left edge (< 40px) or Right edge (> width - 40px)
    if (relX <= 40) {
      swipeStartRef.current = { x: e.clientX, y: relY, side: 'left' };
    } else if (relX >= width - 40) {
      swipeStartRef.current = { x: e.clientX, y: relY, side: 'right' };
    } else {
      swipeStartRef.current = { x: 0, y: 350, side: null };
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!swipeStartRef.current.side) {
      return;
    }
    const delta = e.clientX - swipeStartRef.current.x;

    if (swipeStartRef.current.side === 'left' && delta > 0) {
      setEdgeSwipe({ active: true, side: 'left', deltaX: delta, y: swipeStartRef.current.y });
    } else if (swipeStartRef.current.side === 'right' && delta < 0) {
      setEdgeSwipe({ active: true, side: 'right', deltaX: delta, y: swipeStartRef.current.y });
    }
  };

  const handlePointerUp = () => {
    if (swipeStartRef.current.side === 'left' && edgeSwipe.deltaX > 45) {
      props.onSwipeBack?.();
    } else if (swipeStartRef.current.side === 'right' && Math.abs(edgeSwipe.deltaX) > 45) {
      props.onSwipeBack?.();
    }

    swipeStartRef.current = { x: 0, y: 350, side: null };
    setEdgeSwipe({ active: false, side: null, deltaX: 0, y: 350 });
  };

  return (
    <div className={cn('relative mx-auto my-2 sm:my-4 select-text', props.className)}>
      {/* Outer iPhone Pro Chassis with Space Black Titanium Edge & 1:1 Black Hardware Buttons */}
      <div className="relative h-[790px] w-[375px] rounded-[52px] bg-neutral-950 p-[10px] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.12)_inset,0_0_0_2.5px_rgba(0,0,0,0.95)] ring-1 ring-neutral-800/90 sm:h-[844px] sm:w-[393px] sm:rounded-[56px] sm:p-[12px]">
        {/* 1:1 Black Titanium iPhone Side Buttons */}
        {/* Left Side: Action Button */}
        <div
          className="absolute top-[112px] -left-[4px] h-[30px] w-[4px] rounded-l-[3px] bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-950 border-y border-l border-neutral-700/60 shadow-[-2px_0_4px_rgba(0,0,0,0.8)] ring-[0.5px] ring-neutral-950"
          aria-hidden="true"
        />

        {/* Left Side: Volume Up Button */}
        <div
          className="absolute top-[156px] -left-[4px] h-[54px] w-[4px] rounded-l-[3px] bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-950 border-y border-l border-neutral-700/60 shadow-[-2px_0_4px_rgba(0,0,0,0.8)] ring-[0.5px] ring-neutral-950"
          aria-hidden="true"
        />

        {/* Left Side: Volume Down Button */}
        <div
          className="absolute top-[222px] -left-[4px] h-[54px] w-[4px] rounded-l-[3px] bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-950 border-y border-l border-neutral-700/60 shadow-[-2px_0_4px_rgba(0,0,0,0.8)] ring-[0.5px] ring-neutral-950"
          aria-hidden="true"
        />

        {/* Right Side: Power / Side Button */}
        <div
          className="absolute top-[172px] -right-[4px] h-[82px] w-[4px] rounded-r-[3px] bg-gradient-to-l from-neutral-900 via-neutral-800 to-neutral-950 border-y border-r border-neutral-700/60 shadow-[2px_0_4px_rgba(0,0,0,0.8)] ring-[0.5px] ring-neutral-950"
          aria-hidden="true"
        />

        {/* Right Side: Camera Control / Capture Button */}
        <div
          className="absolute top-[510px] -right-[3px] h-[64px] w-[3px] rounded-r-[2px] bg-gradient-to-l from-neutral-900 via-neutral-800 to-neutral-950 border-y border-r border-neutral-700/50 shadow-[1.5px_0_3px_rgba(0,0,0,0.7)] ring-[0.5px] ring-neutral-950"
          aria-hidden="true"
        />

        {/* Screen Bezel & Display Viewport with Liquid Glass Touch Cursor */}
        <div
          ref={screenRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative flex h-full w-full flex-col overflow-hidden rounded-[42px] bg-neutral-950 shadow-inner sm:rounded-[46px] cursor-none"
        >
          {/* Authentic iOS Liquid Glass Touch Cursor */}
          <GlassTouchCursor containerRef={screenRef} isDark={isDark} />

          {/* Left Edge Swipe Gesture Indicator */}
          {edgeSwipe.active && edgeSwipe.side === 'left' && edgeSwipe.deltaX > 4 && (
            <div
              className="pointer-events-none absolute left-0 z-50 -translate-y-1/2 will-change-transform"
              style={{
                top: `${edgeSwipe.y}px`,
                transform: `translate3d(${Math.min(edgeSwipe.deltaX * 0.45, 36) - 40}px, 0, 0)`,
                transition: edgeSwipe.deltaX === 0 ? 'transform 200ms ease-out' : 'none',
              }}
            >
              <div
                className={cn(
                  'flex h-12 w-10 items-center justify-center rounded-r-2xl border-y border-r shadow-2xl transition-all',
                  edgeSwipe.deltaX > 45
                    ? 'bg-neutral-900/95 text-white border-white/50 ring-2 ring-white/30 scale-105'
                    : 'bg-neutral-900/80 text-white/90 border-white/25',
                )}
                style={{
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                }}
              >
                <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
              </div>
            </div>
          )}

          {/* Right Edge Swipe Gesture Indicator */}
          {edgeSwipe.active && edgeSwipe.side === 'right' && edgeSwipe.deltaX < -4 && (
            <div
              className="pointer-events-none absolute right-0 z-50 -translate-y-1/2 will-change-transform"
              style={{
                top: `${edgeSwipe.y}px`,
                transform: `translate3d(${40 - Math.min(Math.abs(edgeSwipe.deltaX) * 0.45, 36)}px, 0, 0)`,
                transition: edgeSwipe.deltaX === 0 ? 'transform 200ms ease-out' : 'none',
              }}
            >
              <div
                className={cn(
                  'flex h-12 w-10 items-center justify-center rounded-l-2xl border-y border-l shadow-2xl transition-all',
                  Math.abs(edgeSwipe.deltaX) > 45
                    ? 'bg-neutral-900/95 text-white border-white/50 ring-2 ring-white/30 scale-105'
                    : 'bg-neutral-900/80 text-white/90 border-white/25',
                )}
                style={{
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                }}
              >
                <ChevronRight className="h-5 w-5 stroke-[2.5]" />
              </div>
            </div>
          )}

          {/* Native Liquid Glass iOS Status Bar */}
          <header
            className={cn(
              'relative z-40 flex items-center justify-between px-7 pt-3.5 pb-2.5 text-xs font-semibold tracking-tight transition-all duration-300 shrink-0 select-none border-b',
              isDark
                ? 'bg-neutral-950/40 text-white border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.25)]'
                : 'bg-white/55 text-neutral-900 border-white/40 shadow-[0_4px_25px_rgba(0,0,0,0.05)]',
            )}
            style={{
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            }}
          >
            {/* Specular Liquid Glass Top Sheen */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent" />

            {/* iOS Time with Precision Typography */}
            <span className="text-[13px] font-bold tracking-tight pl-0.5">
              09:41
            </span>

            {/* Liquid Glass Dynamic Island */}
            <div className="absolute top-2.5 left-1/2 flex h-[28px] w-[114px] -translate-x-1/2 items-center justify-between rounded-full bg-black/95 px-3 shadow-[0_2px_12px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] ring-1 ring-white/10 transition-all">
              {/* Camera Lens */}
              <div className="relative flex h-3 w-3 items-center justify-center rounded-full bg-neutral-900 ring-1 ring-neutral-800">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-950 shadow-[inset_0_0_2px_rgba(59,130,246,0.6)]" />
              </div>
              {/* FaceID / Mic Indicator Dot */}
              <div className="h-2 w-2 rounded-full bg-neutral-900 ring-1 ring-neutral-800" />
            </div>

            {/* Native iOS Status Metrics */}
            <div className="flex items-center gap-1.5 text-[11px] pr-0.5 font-medium">
              {/* Cellular 4-bars */}
              <svg
                width="15"
                height="11"
                viewBox="0 0 17 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <rect x="0" y="8" width="2.5" height="3" rx="0.75" fill="currentColor" />
                <rect x="4.5" y="5.5" width="2.5" height="5.5" rx="0.75" fill="currentColor" />
                <rect x="9" y="3" width="2.5" height="8" rx="0.75" fill="currentColor" />
                <rect x="13.5" y="0" width="2.5" height="11" rx="0.75" fill="currentColor" />
              </svg>

              {/* Wi-Fi Signal */}
              <svg
                width="14"
                height="11"
                viewBox="0 0 15 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <path
                  d="M7.5 10.5C8.05228 10.5 8.5 10.0523 8.5 9.5C8.5 8.94772 8.05228 8.5 7.5 10.5Z"
                  fill="currentColor"
                />
                <path
                  d="M4.32 6.32C6.08 4.56 8.92 4.56 10.68 6.32"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <path
                  d="M1.5 3.5C4.81 0.19 10.19 0.19 13.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>

              {/* Battery Pill with Terminal */}
              <div className="relative flex items-center">
                <div
                  className={cn(
                    'h-[11px] w-[21px] rounded-[3.5px] border p-[1px] flex items-center',
                    isDark ? 'border-white/80' : 'border-neutral-900',
                  )}
                >
                  <div
                    className={cn(
                      'h-full w-[85%] rounded-[1.5px] transition-all',
                      isDark ? 'bg-white' : 'bg-neutral-900',
                    )}
                  />
                </div>
                {/* Battery Cap */}
                <div
                  className={cn(
                    'h-[4px] w-[1.5px] rounded-r-[1px] ml-[1px]',
                    isDark ? 'bg-white/80' : 'bg-neutral-900',
                  )}
                />
              </div>
            </div>
          </header>

          {/* Main Mobile Screen Viewport */}
          <div className="relative flex w-full flex-1 flex-col overflow-x-hidden overflow-y-auto no-scrollbar">
            {props.children}
          </div>

          {/* Native Liquid Glass iOS Bottom Navigation / Home Indicator Bar */}
          <footer
            className={cn(
              'relative z-40 flex w-full shrink-0 flex-col items-center justify-center pt-2 pb-2.5 transition-all duration-300 select-none border-t',
              'backdrop-blur-2xl',
              isDark
                ? 'bg-neutral-950/45 border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.3)]'
                : 'bg-white/55 border-white/40 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]',
            )}
            style={{
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            }}
          >
            {/* Liquid Glass Bottom Sheen Line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent" />

            {/* Native Home Indicator Pill */}
            <div
              className={cn(
                'h-[4.5px] w-36 rounded-full transition-all duration-200 shadow-xs',
                isDark
                  ? 'bg-white/80 shadow-[0_1px_4px_rgba(0,0,0,0.5)]'
                  : 'bg-neutral-900/70 shadow-[0_1px_3px_rgba(0,0,0,0.2)]',
              )}
            />
          </footer>
        </div>
      </div>
    </div>
  );
}
