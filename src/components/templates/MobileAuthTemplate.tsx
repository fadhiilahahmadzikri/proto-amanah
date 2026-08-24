'use client';

import { ArrowLeft, X } from 'lucide-react';
import React from 'react';
import { IconButton } from '@/components/atoms/IconButton';
import { cn } from '@/lib/utils';

export function MobileAuthTemplate(props: {
  children: React.ReactNode;
  onBack?: () => void;
  onClose?: () => void;
  showBack?: boolean;
  showClose?: boolean;
  className?: string;
  headerClassName?: string;
}) {
  const [dragY, setDragY] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const startYRef = React.useRef(0);
  const hasMovedRef = React.useRef(false);

  const showBack = props.showBack ?? Boolean(props.onBack);
  const showClose = props.showClose ?? Boolean(props.onClose);

  const triggerCloseWithAnimation = () => {
    setDragY(650);
    setTimeout(() => {
      props.onClose?.();
      setDragY(0);
    }, 240);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    startYRef.current = e.clientY;
    hasMovedRef.current = false;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }
    const deltaY = e.clientY - startYRef.current;
    if (Math.abs(deltaY) > 3) {
      hasMovedRef.current = true;
    }
    if (deltaY > 0) {
      setDragY(deltaY);
    } else {
      setDragY(deltaY * 0.12);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    if (!hasMovedRef.current) {
      // Just a click on the handle -> close drawer
      triggerCloseWithAnimation();
      return;
    }

    if (dragY > 75) {
      triggerCloseWithAnimation();
    } else {
      setDragY(0);
    }
  };

  return (
    <div
      className={cn(
        'relative z-20 flex max-h-[92%] min-h-[82%] mt-auto w-full flex-col overflow-hidden rounded-t-[32px] sm:rounded-t-[36px] bg-white shadow-[0_-12px_45px_rgba(0,0,0,0.25)] border-t border-neutral-100 will-change-transform select-text',
        props.className,
      )}
      style={{
        transform: `translate3d(0, ${Math.max(0, dragY)}px, 0)`,
        transition: isDragging
          ? 'none'
          : 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)',
      }}
    >
      {/* Interactive Shadcn-like Drawer Drag Handle Area */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Tarik ke bawah untuk menutup"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="flex w-full cursor-grab active:cursor-grabbing flex-col items-center justify-center pt-3.5 pb-1 shrink-0 touch-none select-none hover:bg-neutral-50/50 transition-colors"
      >
        <div
          className={cn(
            'h-1.25 w-11 rounded-full transition-all duration-150',
            isDragging
              ? 'bg-neutral-500 scale-105'
              : 'bg-neutral-300 hover:bg-neutral-400',
          )}
        />
      </div>

      {/* Sheet Header Actions (Back & Close) */}
      <div
        className={cn(
          'relative z-20 flex items-center justify-between px-5 pt-0.5 pb-2 shrink-0 h-11',
          props.headerClassName,
        )}
      >
        {/* Left Action: Back */}
        <div className="flex w-9 items-center">
          {showBack && props.onBack && (
            <IconButton
              ariaLabel="Kembali ke halaman sebelumnya"
              onClick={props.onBack}
              variant="ghost"
              className="text-neutral-700 hover:text-neutral-950 -ml-1"
            >
              <ArrowLeft className="h-5 w-5" />
            </IconButton>
          )}
        </div>

        {/* Center: Draggable Header Zone */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="flex-1 h-full cursor-grab active:cursor-grabbing touch-none select-none"
        />

        {/* Right Action: Close */}
        <div className="flex w-9 items-center justify-end">
          {showClose && props.onClose && (
            <IconButton
              ariaLabel="Tutup"
              onClick={triggerCloseWithAnimation}
              variant="ghost"
              className="bg-neutral-100/80 text-neutral-500 hover:text-neutral-900 -mr-1"
            >
              <X className="h-4 w-4" />
            </IconButton>
          )}
        </div>
      </div>

      {/* Screen Content with Mobile-Native Hidden Scrollbar */}
      <div className="flex w-full flex-1 flex-col px-6 pt-1 pb-6 overflow-y-auto no-scrollbar select-text">
        {props.children}
      </div>
    </div>
  );
}
