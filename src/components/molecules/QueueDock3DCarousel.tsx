import { ChevronDown } from 'lucide-react';
import React from 'react';
import { type EjectionStage, QueueDockCardItem } from '@/components/atoms/QueueDockCardItem';
import { cn } from '@/lib/utils';
import {
  DOCK_ACTIVATION_THRESHOLD,
  DOCK_SPACING,
  type QueueDockCardData,
} from '@/types/queue-dock.types';

export function QueueDock3DCarousel(props: {
  cards: QueueDockCardData[];
  currentIndex: number;
  onIndexChange: (newIndex: number | ((prev: number) => number)) => void;
  onActivate: () => void;
  onDragProgress?: (progress: number) => void;
  onLongPressChange?: (isPressing: boolean) => void;
  isActivating: boolean;
  ejectionStage?: EjectionStage;
  showSuccess: boolean;
  className?: string;
}) {
  const {
    cards,
    currentIndex,
    onIndexChange,
    onActivate,
    onDragProgress,
    onLongPressChange,
    isActivating,
    ejectionStage = 'idle',
    showSuccess,
  } = props;

  const [isDragging, setIsDragging] = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
  const [dragAxis, setDragAxis] = React.useState<'x' | 'y' | null>(null);
  const [isLongPressing, setIsLongPressing] = React.useState(false);

  const prevIndexRef = React.useRef(currentIndex);
  const dragStartRef = React.useRef({ x: 0, y: 0 });
  const dragAxisRef = React.useRef<'x' | 'y' | null>(null);
  const longPressTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (prevIndexRef.current === currentIndex) {
      return undefined;
    }

    prevIndexRef.current = currentIndex;
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // Ignore if vibration is not permitted
      }
    }
    return undefined;
  }, [currentIndex]);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isActivating) return;
    setIsDragging(true);
    dragAxisRef.current = null;
    setDragAxis(null);

    const clientX = 'clientX' in e ? e.clientX : e.touches[0]?.clientX ?? 0;
    const clientY = 'clientY' in e ? e.clientY : e.touches[0]?.clientY ?? 0;

    dragStartRef.current = { x: clientX, y: clientY };

    // Long press detection: triggers smoldering heatwave on the slot rim
    longPressTimerRef.current = setTimeout(() => {
      setIsLongPressing(true);
      onLongPressChange?.(true);
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([25, 30, 45]);
        } catch {}
      }
    }, 320);
  };

  const handleMove = React.useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging || isActivating) return;

      const clientX = 'clientX' in e ? e.clientX : e.touches[0]?.clientX ?? 0;
      const clientY = 'clientY' in e ? e.clientY : e.touches[0]?.clientY ?? 0;

      const deltaX = clientX - dragStartRef.current.x;
      const deltaY = clientY - dragStartRef.current.y;

      if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }
        setIsLongPressing(false);
        onLongPressChange?.(false);
      }

      if (!dragAxisRef.current) {
        const axis = Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y';
        dragAxisRef.current = axis;
        setDragAxis(axis);
      }

      if (dragAxisRef.current === 'x') {
        setDragOffset({ x: deltaX, y: 0 });
        onDragProgress?.(0);
      } else if (dragAxisRef.current === 'y') {
        const offsetY = Math.max(0, deltaY);
        setDragOffset({ x: 0, y: offsetY });
        onDragProgress?.(Math.min(1, offsetY / DOCK_ACTIVATION_THRESHOLD));
      }
    },
    [isDragging, isActivating, onDragProgress, onLongPressChange],
  );

  const handleEnd = React.useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setIsLongPressing(false);
    onLongPressChange?.(false);

    if (!isDragging || isActivating) return;
    setIsDragging(false);

    if (dragAxisRef.current === 'x') {
      const offsetRatio = dragOffset.x / DOCK_SPACING;
      if (offsetRatio < -0.22 && currentIndex < cards.length - 1) {
        onIndexChange((prev: number) => prev + 1);
      } else if (offsetRatio > 0.22 && currentIndex > 0) {
        onIndexChange((prev: number) => prev - 1);
      }
      onDragProgress?.(0);
    } else if (dragAxisRef.current === 'y') {
      if (dragOffset.y > DOCK_ACTIVATION_THRESHOLD) {
        onDragProgress?.(1);
        setDragOffset({ x: 0, y: 0 });
        dragAxisRef.current = null;
        setDragAxis(null);
        setIsDragging(false);
        onActivate();
        return;
      }
      onDragProgress?.(0);
    }

    setDragOffset({ x: 0, y: 0 });
    dragAxisRef.current = null;
    setDragAxis(null);
  }, [isDragging, isActivating, dragOffset, currentIndex, cards.length, onIndexChange, onActivate, onDragProgress, onLongPressChange]);

  React.useEffect(() => {
    const handleMouseUp = () => handleEnd();
    const handleMouseMove = (e: MouseEvent) => handleMove(e);
    const handleTouchMove = (e: TouchEvent) => handleMove(e);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMove, handleEnd]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'card-container relative -mt-36 sm:-mt-44 flex flex-1 items-center justify-center cursor-grab active:cursor-grabbing select-none',
        props.className,
      )}
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    >
      {/* 1. Target Alignment Glow Frame (Glows brightly when card snaps / ejects back in) */}
      <div
        className={cn(
          'absolute h-[331px] w-[206px] rounded-[21.5px] border-[2.5px] pointer-events-none transition-all duration-500 z-0 box-border',
          isActivating
            ? 'opacity-0 scale-90 border-orange-500/90'
            : ejectionStage === 'full_eject' || ejectionStage === 'atm_peek'
              ? 'opacity-100 scale-100 border-amber-400 shadow-[0_0_50px_rgba(255,153,0,0.95),inset_0_0_25px_rgba(255,153,0,0.6)] animate-pulse'
              : isDragging && dragAxis === 'y'
                ? 'opacity-30 scale-100 border-orange-500/90 shadow-[0_0_20px_rgba(255,153,0,0.3)]'
                : 'opacity-100 scale-100 border-orange-500/90 shadow-[0_0_35px_rgba(255,153,0,0.4),inset_0_0_15px_rgba(255,153,0,0.3)]',
        )}
        style={{
          transform: 'translate3d(0, 0, 0px)',
        }}
      />

      {/* 2. Dual ChevronDown Arrow Animation Strictly Under / Behind the Cards */}
      <div
        className={cn(
          'absolute top-[calc(50%+198px)] z-0 flex flex-col items-center pointer-events-none transition-opacity duration-300',
          isActivating ? 'opacity-0' : 'opacity-100',
        )}
        style={{
          transform:
            dragAxis === 'y' && dragOffset.y > 0
              ? `translate3d(0, ${dragOffset.y * 0.3}px, -20px)`
              : 'translate3d(0, 0, -20px)',
        }}
      >
        <div className="flex flex-col items-center">
          <ChevronDown className="animate-bounce text-orange-500" size={24} strokeWidth={3} />
          <ChevronDown className="-mt-4 animate-bounce text-orange-500 delay-150" size={24} strokeWidth={3} />
        </div>
      </div>

      {/* 3. Render 3D Cards (Strictly on top of Chevron) */}
      {cards.map((card, index) => (
        <QueueDockCardItem
          key={card.id}
          card={card}
          index={index}
          currentIndex={currentIndex}
          dragOffset={dragOffset}
          dragAxis={dragAxis}
          isDragging={isDragging}
          isActivating={isActivating}
          ejectionStage={ejectionStage}
          isLongPressing={isLongPressing}
          showSuccess={showSuccess}
        />
      ))}
    </div>
  );
}
