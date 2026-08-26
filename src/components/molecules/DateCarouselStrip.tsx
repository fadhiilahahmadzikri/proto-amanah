'use client';

import { addDays, format, isSameDay } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { gsap } from 'gsap';
import React from 'react';
import { cn } from '@/lib/utils';
import type { DayScheduleSetting, DoctorSchedule } from '@/types/portal.types';

export function DateCarouselStrip(props: {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  schedulesMap: Record<string, DoctorSchedule[]>;
  daySettingsMap?: Record<string, DayScheduleSetting>;
  baseToday: Date;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const isDark = props.theme === 'dark';
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Generate 25 dynamic calendar days centered around today (-8 days before to +16 days ahead)
  const calendarDays = React.useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => addDays(props.baseToday, i - 8));
  }, [props.baseToday]);

  // Find index of selected date
  const activeIndex = React.useMemo(() => {
    const idx = calendarDays.findIndex(d => isSameDay(d, props.selectedDate));
    return idx >= 0 ? idx : 8;
  }, [calendarDays, props.selectedDate]);

  // Dimensions
  const ITEM_WIDTH = 66; // px
  const ITEM_GAP = 12; // px
  const TOTAL_ITEM_SPACE = ITEM_WIDTH + ITEM_GAP; // 78px

  // Real-time track position (X offset in px)
  const [trackX, setTrackX] = React.useState<number>(0);
  const trackXRef = React.useRef<number>(0);
  trackXRef.current = trackX;

  // Drag Gesture Physics State
  const startXRef = React.useRef(0);
  const startTrackXRef = React.useRef(0);
  const isDraggingRef = React.useRef(false);
  const isPointerDownRef = React.useRef(false);
  const pointerDownTimeRef = React.useRef(0);
  const tweenRef = React.useRef<gsap.core.Tween | null>(null);
  const wheelTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Calculate target X position for any index
  const getTargetXForIndex = React.useCallback(
    (index: number) => {
      const containerWidth = containerRef.current?.offsetWidth ?? 345;
      const center = containerWidth / 2;
      return center - (index * TOTAL_ITEM_SPACE + ITEM_WIDTH / 2);
    },
    [TOTAL_ITEM_SPACE, ITEM_WIDTH],
  );

  // Smoothly animate track to an exact target position
  const smoothAnimateToX = React.useCallback(
    (targetX: number, duration = 0.45, ease = 'power2.out') => {
      if (tweenRef.current) {
        tweenRef.current.kill();
      }

      const proxy = { x: trackXRef.current };
      tweenRef.current = gsap.to(proxy, {
        x: targetX,
        duration,
        ease,
        onUpdate: () => {
          setTrackX(proxy.x);
        },
        onComplete: () => {
          tweenRef.current = null;
        },
      });
    },
    [],
  );

  // Snap to the nearest slot and trigger onSelectDate
  const snapToNearestSlot = React.useCallback(
    (currentX: number, velocityBonus = 0) => {
      const containerWidth = containerRef.current?.offsetWidth ?? 345;
      const center = containerWidth / 2;
      // Calculate floating index at current center
      const rawIndex = (center - currentX - ITEM_WIDTH / 2) / TOTAL_ITEM_SPACE;
      let targetIndex = Math.round(rawIndex + velocityBonus);
      targetIndex = Math.max(0, Math.min(calendarDays.length - 1, targetIndex));

      const targetX = center - (targetIndex * TOTAL_ITEM_SPACE + ITEM_WIDTH / 2);
      smoothAnimateToX(targetX, 0.42, 'power3.out');

      const nextDate = calendarDays[targetIndex];
      if (nextDate && !isSameDay(nextDate, props.selectedDate)) {
        props.onSelectDate(nextDate);
      }
    },
    [TOTAL_ITEM_SPACE, ITEM_WIDTH, calendarDays, smoothAnimateToX, props],
  );

  // Center on mount and when external selectedDate changes
  React.useEffect(() => {
    const targetX = getTargetXForIndex(activeIndex);
    if (Math.abs(trackXRef.current - targetX) > 2) {
      smoothAnimateToX(targetX, 0.45, 'power3.out');
    }
  }, [activeIndex, getTargetXForIndex, smoothAnimateToX]);

  // Pointer Down (Drag start)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (tweenRef.current) {
      tweenRef.current.kill();
      tweenRef.current = null;
    }

    isPointerDownRef.current = true;
    pointerDownTimeRef.current = Date.now();
    startXRef.current = e.clientX;
    startTrackXRef.current = trackXRef.current;
    isDraggingRef.current = false;

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
  };

  // Pointer Move (Live drag tracking)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) {
      return;
    }

    const deltaX = e.clientX - startXRef.current;
    if (Math.abs(deltaX) > 5) {
      isDraggingRef.current = true;
    }

    if (isDraggingRef.current) {
      setTrackX(startTrackXRef.current + deltaX);
    }
  };

  // Pointer Up / Cancel
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) {
      return;
    }
    isPointerDownRef.current = false;

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }

    if (isDraggingRef.current) {
      const elapsed = Math.max(Date.now() - pointerDownTimeRef.current, 1);
      const deltaX = trackXRef.current - startTrackXRef.current;
      const velocity = deltaX / elapsed; // px per ms

      // Velocity bonus: fast swipe moves extra slot in direction of swipe
      let bonus = 0;
      if (Math.abs(velocity) > 0.4) {
        bonus = velocity < 0 ? 1 : -1;
      }

      snapToNearestSlot(trackXRef.current, bonus);
    } else {
      snapToNearestSlot(trackXRef.current, 0);
    }

    isDraggingRef.current = false;
  };

  // Touchpad / Mouse Wheel Horizontal Scroll Interceptor
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Determine horizontal or vertical wheel displacement
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 2) {
      return;
    }

    if (tweenRef.current) {
      tweenRef.current.kill();
      tweenRef.current = null;
    }

    const newX = trackXRef.current - delta * 0.9;
    setTrackX(newX);

    // Debounce snap to nearest slot after wheel stops
    if (wheelTimeoutRef.current) {
      clearTimeout(wheelTimeoutRef.current);
    }
    wheelTimeoutRef.current = setTimeout(() => {
      snapToNearestSlot(trackXRef.current, 0);
    }, 120);
  };

  // Container Center in px
  const containerWidth = containerRef.current?.offsetWidth ?? 345;
  const containerCenter = containerWidth / 2;

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn(
        'relative w-full h-[124px] overflow-hidden select-none touch-pan-x cursor-grab active:cursor-grabbing shrink-0 flex items-center justify-start',
        props.className,
      )}
    >
      {/* 3D Stepped Track in solid flex flow */}
      <div
        className="flex items-center h-full will-change-transform"
        style={{
          transform: `translate3d(${trackX}px, 0, 0)`,
          gap: `${ITEM_GAP}px`,
        }}
      >
        {calendarDays.map((d, index) => {
          const dateKey = format(d, 'yyyy-MM-dd');
          const daySchedules = props.schedulesMap[dateKey] ?? [];
          const daySetting = props.daySettingsMap?.[dateKey];
          const isCuti = daySetting?.isCuti ?? false;
          const hasSchedules = daySchedules.length > 0;
          const isToday = isSameDay(d, props.baseToday);

          const monthName = format(d, 'MMM', { locale: idLocale }).toUpperCase();
          const dayNumber = format(d, 'd');
          const yearNumber = format(d, 'yyyy');

          // Compute continuous real-time distance from the exact container center
          const itemCenterX = trackX + index * TOTAL_ITEM_SPACE + ITEM_WIDTH / 2;
          const distanceRatio = Math.abs(itemCenterX - containerCenter) / TOTAL_ITEM_SPACE;

          // Continuous 3D Scale & Opacity transformation based on real position
          const scale = Math.max(0.72, 1.14 - distanceRatio * 0.22);
          const opacity = Math.max(0.35, 1 - distanceRatio * 0.35);
          const isCloseToCenter = distanceRatio < 0.45;
          const zIndex = isCloseToCenter ? 30 : Math.max(1, Math.round(20 - distanceRatio * 4));

          return (
            <div
              key={dateKey}
              style={{
                width: `${ITEM_WIDTH}px`,
                height: '84px',
                transform: `scale(${scale})`,
                opacity,
                zIndex,
              }}
              className="shrink-0 relative flex items-center justify-center"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isDraggingRef.current) {
                    props.onSelectDate(d);
                    const targetX = getTargetXForIndex(index);
                    smoothAnimateToX(targetX, 0.42, 'power3.out');
                  }
                }}
                className={cn(
                  'w-full h-full relative flex flex-col items-center justify-between py-2 px-1.5 rounded-2xl cursor-pointer select-none transition-all',
                  isCloseToCenter
                    ? isDark
                      ? isCuti
                        ? 'bg-amber-500 text-neutral-950 font-bold shadow-md'
                        : 'bg-cyan-500 text-neutral-950 font-bold shadow-md'
                      : isCuti
                        ? 'bg-amber-500 text-white font-bold shadow-md'
                        : 'bg-blue-600 text-white font-bold shadow-md'
                    : isDark
                      ? 'bg-neutral-850 text-white/90 font-medium border border-white/10 hover:border-white/20'
                      : 'bg-white text-slate-700 font-medium border border-slate-200 shadow-sm hover:bg-slate-50',
                )}
              >
              {/* Atas: AGS (Bulan) */}
              <span
                className={cn(
                  'text-[10px] font-extrabold tracking-wider uppercase leading-none block',
                  isCloseToCenter ? 'opacity-95' : 'opacity-65',
                )}
              >
                {monthName}
              </span>

              {/* Bawah: Tanggal Besar */}
              <span className="text-2xl font-black tabular-nums leading-none block my-0.5">
                {dayNumber}
              </span>

              {/* Bawahnya lagi: Tahun / Hari ini + Indicator */}
              <div className="flex flex-col items-center gap-0.5 leading-none">
                <span
                  className={cn(
                    'text-[9px] font-bold tabular-nums leading-none block',
                    isCloseToCenter ? 'opacity-95' : 'opacity-55',
                  )}
                >
                  {isToday ? 'Hari ini' : isCuti ? 'Cuti' : yearNumber}
                </span>

                {/* Event Schedule Dot Indicator */}
                {isCuti ? (
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full shrink-0 block mt-0.5',
                      isCloseToCenter ? (isDark ? 'bg-neutral-950' : 'bg-white') : 'bg-amber-500',
                    )}
                  />
                ) : hasSchedules ? (
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full shrink-0 block mt-0.5',
                      isCloseToCenter
                        ? isDark
                          ? 'bg-neutral-950'
                          : 'bg-white'
                        : isDark
                          ? 'bg-cyan-400'
                          : 'bg-blue-600',
                    )}
                  />
                ) : (
                  <span className="h-1.5 w-1.5 opacity-0 block mt-0.5" />
                )}
              </div>
            </button>
          </div>
        );
      })}
    </div>
  </div>
  );
}
