'use client';

import { gsap } from 'gsap';
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
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const startYRef = React.useRef(0);
  const startXRef = React.useRef(0);
  const currentDragYRef = React.useRef(0);
  const isDraggingRef = React.useRef(false);
  const isClosingRef = React.useRef(false);

  const showBack = props.showBack ?? Boolean(props.onBack);
  const showClose = props.showClose ?? Boolean(props.onClose);

  // GSAP Ultra-Smooth Slide Up Entrance Animation on Mount
  React.useEffect(() => {
    if (!drawerRef.current) {
      return;
    }

    gsap.fromTo(
      drawerRef.current,
      {
        y: '100%',
        opacity: 0.95,
      },
      {
        y: '0%',
        opacity: 1,
        duration: 0.45,
        ease: 'power3.out',
      },
    );
  }, []);

  // GSAP Ultra-Smooth Slide Down Exit Animation
  const triggerClose = React.useCallback(() => {
    if (isClosingRef.current || !drawerRef.current) {
      return;
    }
    isClosingRef.current = true;

    gsap.to(drawerRef.current, {
      y: '100%',
      duration: 0.32,
      ease: 'power3.in',
      onComplete: () => {
        props.onClose?.();
        isClosingRef.current = false;
      },
    });
  }, [props]);

  const triggerBack = () => {
    if (isClosingRef.current || !drawerRef.current) {
      return;
    }
    isClosingRef.current = true;

    gsap.to(drawerRef.current, {
      x: '30%',
      opacity: 0.6,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        props.onBack?.();
        isClosingRef.current = false;
      },
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('input, textarea, select, button, a')) {
      return;
    }

    startYRef.current = e.clientY;
    startXRef.current = e.clientX;
    currentDragYRef.current = 0;

    if (!contentRef.current || contentRef.current.scrollTop <= 0) {
      isDraggingRef.current = true;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || isClosingRef.current || !drawerRef.current) {
      return;
    }
    const deltaY = e.clientY - startYRef.current;
    const deltaX = e.clientX - startXRef.current;

    if (deltaY > 4 && deltaY > Math.abs(deltaX) * 0.7) {
      currentDragYRef.current = deltaY;
      gsap.set(drawerRef.current, { y: deltaY });
    } else if (deltaY < 0 && currentDragYRef.current > 0) {
      currentDragYRef.current = deltaY * 0.15;
      gsap.set(drawerRef.current, { y: currentDragYRef.current });
    }
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current || isClosingRef.current || !drawerRef.current) {
      return;
    }
    isDraggingRef.current = false;

    if (currentDragYRef.current > 60) {
      // Exceeded threshold -> slide down smoothly with GSAP
      triggerClose();
    } else {
      // Spring bounce back to 0 with GSAP physics
      gsap.to(drawerRef.current, {
        y: 0,
        duration: 0.42,
        ease: 'elastic.out(1, 0.75)',
      });
    }
    currentDragYRef.current = 0;
  };

  return (
    <div
      ref={drawerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn(
        'relative z-20 flex max-h-[92%] min-h-[82%] mt-auto w-full flex-col overflow-hidden rounded-t-[32px] sm:rounded-t-[36px] bg-white shadow-[0_-12px_45px_rgba(0,0,0,0.25)] border-t border-neutral-100 will-change-transform select-text touch-pan-y',
        props.className,
      )}
    >
      {/* Interactive Shadcn-like Drawer Drag Handle Area */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Tarik ke bawah untuk menutup"
        onClick={() => {
          triggerClose();
        }}
        className="flex w-full cursor-grab active:cursor-grabbing flex-col items-center justify-center pt-3.5 pb-1 shrink-0 touch-none select-none hover:bg-neutral-50/50 transition-colors"
      >
        <div className="h-1.25 w-11 rounded-full bg-neutral-300 hover:bg-neutral-400 active:bg-neutral-500 transition-colors duration-150" />
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
              onClick={triggerBack}
              variant="ghost"
              className="text-neutral-700 hover:text-neutral-950 -ml-1 cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </IconButton>
          )}
        </div>

        {/* Center: Draggable Header Zone */}
        <div className="flex-1 h-full cursor-grab active:cursor-grabbing touch-none select-none" />

        {/* Right Action: Close */}
        <div className="flex w-9 items-center justify-end">
          {showClose && props.onClose && (
            <IconButton
              ariaLabel="Tutup"
              onClick={triggerClose}
              variant="ghost"
              className="bg-neutral-100/80 text-neutral-500 hover:text-neutral-900 -mr-1 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </IconButton>
          )}
        </div>
      </div>

      {/* Screen Content with Mobile-Native Hidden Scrollbar */}
      <div
        ref={contentRef}
        className="flex w-full flex-1 flex-col px-6 pt-1 pb-6 overflow-y-auto no-scrollbar select-text"
      >
        {props.children}
      </div>
    </div>
  );
}
