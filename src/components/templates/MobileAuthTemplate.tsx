'use client';

import { gsap } from 'gsap';
import { ArrowLeft, X } from 'lucide-react';
import React from 'react';
import { IconButton } from '@/components/atoms/IconButton';
import { cn } from '@/lib/utils';

export function MobileAuthTemplate(props: {
  children: React.ReactNode;
  theme?: 'dark' | 'light';
  onBack?: () => void;
  onClose?: () => void;
  showBack?: boolean;
  showClose?: boolean;
  className?: string;
  headerClassName?: string;
}) {
  const isDark = props.theme === 'dark';
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const startYRef = React.useRef(0);
  const startXRef = React.useRef(0);
  const currentDragYRef = React.useRef(0);
  const currentDragXRef = React.useRef(0);
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

  // Single Unified GSAP Slide Down Exit Animation
  const triggerClose = React.useCallback(() => {
    if (isClosingRef.current || !drawerRef.current) {
      return;
    }
    isClosingRef.current = true;

    gsap.to(drawerRef.current, {
      y: '100%',
      opacity: 0.9,
      duration: 0.36,
      ease: 'power3.inOut',
      onComplete: () => {
        props.onClose?.();
        isClosingRef.current = false;
      },
    });
  }, [props]);

  // Single Unified GSAP Back Animation
  const triggerBack = React.useCallback(() => {
    if (isClosingRef.current || !drawerRef.current) {
      return;
    }
    isClosingRef.current = true;

    gsap.to(drawerRef.current, {
      x: '100%',
      opacity: 0.7,
      duration: 0.3,
      ease: 'power3.in',
      onComplete: () => {
        props.onBack?.();
        isClosingRef.current = false;
      },
    });
  }, [props]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('input, textarea, select, button, a')) {
      return;
    }

    startYRef.current = e.clientY;
    startXRef.current = e.clientX;
    currentDragYRef.current = 0;
    currentDragXRef.current = 0;

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

    // Track vertical drag and edge swipe seamlessly
    if (deltaY > 3 || Math.abs(deltaX) > 10) {
      // Calculate smooth translation
      const effectiveY = Math.max(0, deltaY) + (Math.abs(deltaX) * 0.35);
      currentDragYRef.current = effectiveY;
      currentDragXRef.current = deltaX;
      gsap.set(drawerRef.current, { y: effectiveY });
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

    if (currentDragYRef.current > 50 || Math.abs(currentDragXRef.current) > 60) {
      // Exceeded threshold -> close smoothly using unified GSAP exit
      triggerClose();
    } else {
      // Spring bounce back to 0 with GSAP physics
      gsap.to(drawerRef.current, {
        y: 0,
        x: 0,
        duration: 0.42,
        ease: 'elastic.out(1, 0.75)',
      });
    }
    currentDragYRef.current = 0;
    currentDragXRef.current = 0;
  };

  return (
    <div
      ref={drawerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn(
        'relative z-20 flex max-h-[92%] min-h-[82%] mt-auto w-full flex-col overflow-hidden rounded-t-[32px] sm:rounded-t-[36px] will-change-transform select-text touch-pan-y transition-colors duration-300 shadow-[0_-12px_45px_rgba(0,0,0,0.25)] border-t',
        isDark
          ? 'bg-[#0a0e1a] border-white/10 text-white shadow-black/80'
          : 'bg-white border-neutral-100 text-slate-900 shadow-[0_-12px_45px_rgba(0,0,0,0.25)]',
        props.className,
      )}
    >
      {/* Interactive Shadcn-like Drawer Drag Handle Area */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Tarik ke bawah untuk menutup"
        onClick={(e) => {
          e.stopPropagation();
          triggerClose();
        }}
        className={cn(
          'flex w-full cursor-grab active:cursor-grabbing flex-col items-center justify-center pt-3.5 pb-1 shrink-0 touch-none select-none transition-colors',
          isDark ? 'hover:bg-white/5' : 'hover:bg-neutral-50/50',
        )}
      >
        <div
          className={cn(
            'h-1.25 w-11 rounded-full transition-colors duration-150',
            isDark
              ? 'bg-white/25 hover:bg-white/40 active:bg-white/50'
              : 'bg-neutral-300 hover:bg-neutral-400 active:bg-neutral-500',
          )}
        />
      </div>

      {/* Sheet Header Actions (Back & Close) */}
      <div
        className={cn(
          'relative z-20 flex items-center justify-between px-5 pt-1 pb-2 shrink-0 h-12 border-b border-inherit',
          props.headerClassName,
        )}
      >
        {/* Left Action: Back */}
        <div className="flex w-9 items-center">
          {showBack && props.onBack && (
            <IconButton
              ariaLabel="Kembali ke halaman sebelumnya"
              onClick={(e) => {
                e.stopPropagation();
                triggerBack();
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              variant="ghost"
              className={cn(
                '-ml-1 cursor-pointer transition-colors',
                isDark
                  ? 'bg-white/10 text-neutral-300 hover:text-white hover:bg-white/20'
                  : 'bg-neutral-100/80 text-neutral-600 hover:text-neutral-900 hover:bg-slate-200',
              )}
            >
              <ArrowLeft className="h-4 w-4" />
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
              onClick={(e) => {
                e.stopPropagation();
                triggerClose();
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              variant="ghost"
              className={cn(
                '-mr-1 cursor-pointer transition-colors',
                isDark
                  ? 'bg-white/10 text-neutral-300 hover:text-white hover:bg-white/20'
                  : 'bg-neutral-100/80 text-neutral-600 hover:text-neutral-900 hover:bg-slate-200',
              )}
            >
              <X className="h-4 w-4" />
            </IconButton>
          )}
        </div>
      </div>

      {/* Screen Content with Mobile-Native Hidden Scrollbar */}
      <div
        ref={contentRef}
        className="flex w-full flex-1 flex-col px-6 pt-5 pb-6 overflow-y-auto no-scrollbar select-text"
      >
        {props.children}
      </div>
    </div>
  );
}
