'use client';

import React from 'react';
import { ScheduleCard } from '@/components/molecules/ScheduleCard';
import { cn } from '@/lib/utils';
import type { DoctorSchedule } from '@/types/portal.types';

export function ScheduleCardStack(props: {
  schedules: DoctorSchedule[];
  theme?: 'dark' | 'light';
  onCardClick?: (schedule: DoctorSchedule) => void;
  className?: string;
}) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [dragOffset, setDragOffset] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = React.useState<'left' | 'right' | null>(null);

  const startXRef = React.useRef(0);
  const schedules = props.schedules;

  if (!schedules || schedules.length === 0) {
    return null;
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Avoid dragging if user clicked the close button
    const target = e.target as HTMLElement | null;
    if (target?.closest('button, [aria-label="Tutup jadwal"]')) {
      return;
    }

    startXRef.current = e.clientX;
    setIsDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }
    const diff = e.clientX - startXRef.current;
    setDragOffset(diff);
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const diff = e.clientX - startXRef.current;

    // Detect simple tap to trigger onCardClick
    if (Math.abs(diff) < 6) {
      const frontSchedule = schedules[currentIndex % schedules.length];
      if (frontSchedule) {
        props.onCardClick?.(frontSchedule);
      }
      setDragOffset(0);
      return;
    }

    if (Math.abs(diff) > 65) {
      const direction = diff > 0 ? 'right' : 'left';
      setIsAnimatingOut(direction);

      setTimeout(() => {
        if (direction === 'right') {
          setCurrentIndex(prev => (prev - 1 + schedules.length) % schedules.length);
        } else {
          setCurrentIndex(prev => (prev + 1) % schedules.length);
        }
        setIsAnimatingOut(null);
        setDragOffset(0);
      }, 220);
    } else {
      setDragOffset(0);
    }
  };

  const handleDismiss = () => {
    setIsAnimatingOut('right');
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % schedules.length);
      setIsAnimatingOut(null);
      setDragOffset(0);
    }, 220);
  };

  // Render 3 stacked cards
  const stackItems = [2, 1, 0].map((depth) => {
    const dataIndex = (currentIndex + depth) % schedules.length;
    const schedule = schedules[dataIndex];
    if (!schedule) {
      return null;
    }

    const isFront = depth === 0;

    let style: React.CSSProperties = {};

    if (isFront) {
      if (isAnimatingOut) {
        const sign = isAnimatingOut === 'right' ? 1 : -1;
        style = {
          transform: `translate3d(${sign * 380}px, 0px, 0) scale(0.95) rotate(${sign * 18}deg)`,
          opacity: 0,
          zIndex: 30,
          transition: 'transform 220ms ease-out, opacity 220ms ease-out',
        };
      } else if (isDragging) {
        const rotate = dragOffset * 0.04;
        style = {
          transform: `translate3d(${dragOffset}px, 0px, 0) scale(1) rotate(${rotate}deg)`,
          opacity: 1,
          zIndex: 30,
          transition: 'none',
        };
      } else {
        style = {
          transform: 'translate3d(0px, 0px, 0) scale(1)',
          opacity: 1,
          zIndex: 30,
          transition: 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1), opacity 300ms ease',
        };
      }
    } else if (depth === 1) {
      style = {
        transform: isDragging
          ? `translate3d(0px, ${14 - Math.min(Math.abs(dragOffset) * 0.08, 14)}px, 0) scale(${0.92 + Math.min(Math.abs(dragOffset) * 0.001, 0.08)})`
          : 'translate3d(0px, 14px, 0) scale(0.92)',
        zIndex: 20,
        opacity: 0.95,
        transition: isDragging ? 'none' : 'transform 300ms ease-out, opacity 300ms ease',
      };
    } else {
      style = {
        transform: 'translate3d(0px, 28px, 0) scale(0.84)',
        zIndex: 10,
        opacity: 0.8,
        transition: 'transform 300ms ease-out, opacity 300ms ease',
      };
    }

    return (
      <div
        key={`${schedule.id}-${depth}`}
        className="absolute top-0 left-0 w-full will-change-transform"
        style={style}
      >
        <ScheduleCard
          schedule={schedule}
          theme={props.theme}
          onDismiss={isFront ? handleDismiss : undefined}
          className={cn(
            isFront ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none',
          )}
        />
      </div>
    );
  });

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      className={cn(
        'relative w-full h-[175px] mb-5 select-none touch-none',
        props.className,
      )}
      style={{ perspective: 1000 }}
    >
      {stackItems}
    </div>
  );
}
