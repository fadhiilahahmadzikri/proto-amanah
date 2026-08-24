'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function GlassTouchCursor(props: {
  containerRef: React.RefObject<HTMLElement | null>;
  isDark?: boolean;
}) {
  const [position, setPosition] = React.useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);
  const [isInteractive, setIsInteractive] = React.useState(false);

  React.useEffect(() => {
    const container = props.containerRef.current;
    if (!container) {
      return;
    }

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setPosition({ x, y });
      setIsVisible(true);

      // Check if target or parent is an interactive element
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (target) {
        const isClickable = target.closest('button, a, input, [role="button"], label, select, textarea');
        setIsInteractive(Boolean(isClickable));
      }
    };

    const handlePointerDown = () => {
      setIsPressed(true);
    };

    const handlePointerUp = () => {
      setIsPressed(false);
    };

    const handlePointerLeave = () => {
      setIsVisible(false);
      setIsPressed(false);
      setIsInteractive(false);
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerdown', handlePointerDown);
    container.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [props.containerRef]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute top-0 left-0 z-[100] will-change-transform"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      <div
        className={cn(
          'relative -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-100 ease-out',
          props.isDark
            ? 'border border-white/40 bg-white/20 shadow-[0_2px_14px_rgba(0,0,0,0.4)]'
            : 'border border-neutral-900/30 bg-neutral-900/15 shadow-[0_2px_12px_rgba(0,0,0,0.12)]',
          isPressed
            ? 'h-6 w-6 scale-80 bg-neutral-900/40 dark:bg-white/40'
            : isInteractive
              ? 'h-9 w-9 scale-110 bg-neutral-900/20 dark:bg-white/25 ring-2 ring-blue-500/30'
              : 'h-7 w-7 scale-100',
        )}
        style={{
          backdropFilter: 'blur(8px) saturate(160%)',
          WebkitBackdropFilter: 'blur(8px) saturate(160%)',
        }}
      >
        {/* Apple Glass Center Highlight */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 via-transparent to-transparent opacity-70" />
      </div>
    </div>
  );
}
