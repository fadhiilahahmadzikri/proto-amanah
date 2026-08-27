import { ChevronDown } from 'lucide-react';
import React from 'react';
import { type EjectionStage, QueueDockCardItem } from '@/components/atoms/QueueDockCardItem';
import { cn } from '@/lib/utils';
import {
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

  // Stable references to prevent listener re-attachment on every frame
  const stateRef = React.useRef({
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    dragAxis: null as 'x' | 'y' | null,
    startX: 0,
    startY: 0,
    currentIndex,
    totalCards: cards.length,
    isActivating,
  });

  stateRef.current.currentIndex = currentIndex;
  stateRef.current.totalCards = cards.length;
  stateRef.current.isActivating = isActivating;

  const longPressTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // Ignore if vibration is not permitted
      }
    }
  }, [currentIndex]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (stateRef.current.isActivating) return;

    const targetEl = e.target as HTMLElement;
    console.log('[3D CAROUSEL] PointerDown at', e.clientX, e.clientY, '| Target:', targetEl?.tagName, targetEl?.className);

    stateRef.current.isDragging = true;
    stateRef.current.dragAxis = null;
    stateRef.current.startX = e.clientX;
    stateRef.current.startY = e.clientY;
    stateRef.current.dragOffset = { x: 0, y: 0 };

    setIsDragging(true);
    setDragAxis(null);
    setDragOffset({ x: 0, y: 0 });

    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
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

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!stateRef.current.isDragging || stateRef.current.isActivating) return;

    const deltaX = e.clientX - stateRef.current.startX;
    const deltaY = e.clientY - stateRef.current.startY;

    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
      setIsLongPressing(false);
      onLongPressChange?.(false);
    }

    // Dynamic directional resolution (never rigid lock on initial sub-pixel jitter)
    let axis: 'x' | 'y' = 'x';
    if (deltaY > 10 && deltaY > Math.abs(deltaX) * 0.7) {
      axis = 'y';
    } else {
      axis = 'x';
    }

    stateRef.current.dragAxis = axis;
    setDragAxis(axis);

    if (axis === 'x') {
      stateRef.current.dragOffset = { x: deltaX, y: 0 };
      setDragOffset({ x: deltaX, y: 0 });
      onDragProgress?.(0);
    } else {
      const offsetY = Math.max(0, deltaY);
      stateRef.current.dragOffset = { x: 0, y: offsetY };
      setDragOffset({ x: 0, y: offsetY });
      onDragProgress?.(Math.min(1, offsetY / 80));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setIsLongPressing(false);
    onLongPressChange?.(false);

    if (!stateRef.current.isDragging || stateRef.current.isActivating) return;
    stateRef.current.isDragging = false;
    setIsDragging(false);

    const { dragAxis: activeAxis, dragOffset: activeOffset, currentIndex: curIdx, totalCards: total } = stateRef.current;

    if (activeAxis === 'x') {
      const floatShift = -activeOffset.x / DOCK_SPACING;
      let roundedShift = Math.round(floatShift);

      // Flick assistance: if user flicked (>= 30px) but didn't cross 0.5 card threshold
      if (roundedShift === 0 && Math.abs(activeOffset.x) >= 30) {
        roundedShift = activeOffset.x < 0 ? 1 : -1;
      }

      const targetIndex = Math.max(0, Math.min(total - 1, curIdx + roundedShift));
      onIndexChange(targetIndex);
      onDragProgress?.(0);
    } else if (activeAxis === 'y') {
      if (activeOffset.y > 45) {
        onDragProgress?.(1);
        setDragOffset({ x: 0, y: 0 });
        stateRef.current.dragOffset = { x: 0, y: 0 };
        stateRef.current.dragAxis = null;
        setDragAxis(null);
        onActivate();
        return;
      }
      onDragProgress?.(0);
    }

    setDragOffset({ x: 0, y: 0 });
    stateRef.current.dragOffset = { x: 0, y: 0 };
    stateRef.current.dragAxis = null;
    setDragAxis(null);
  };

  React.useEffect(() => {
    if (!isDragging) return undefined;

    const handleWindowPointerMove = (e: PointerEvent) => {
      if (!stateRef.current.isDragging || stateRef.current.isActivating) return;

      const deltaX = e.clientX - stateRef.current.startX;
      const deltaY = e.clientY - stateRef.current.startY;

      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }
        setIsLongPressing(false);
        onLongPressChange?.(false);
      }

      let axis: 'x' | 'y' = 'x';
      if (deltaY > 8 && deltaY > Math.abs(deltaX) * 0.6) {
        axis = 'y';
      } else {
        axis = 'x';
      }

      stateRef.current.dragAxis = axis;
      setDragAxis(axis);

      if (axis === 'x') {
        stateRef.current.dragOffset = { x: deltaX, y: 0 };
        setDragOffset({ x: deltaX, y: 0 });
        onDragProgress?.(0);
      } else {
        const offsetY = Math.max(0, deltaY);
        stateRef.current.dragOffset = { x: 0, y: offsetY };
        setDragOffset({ x: 0, y: offsetY });
        onDragProgress?.(Math.min(1, offsetY / 65));
      }
    };

    const handleWindowPointerUp = () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
      setIsLongPressing(false);
      onLongPressChange?.(false);

      if (!stateRef.current.isDragging || stateRef.current.isActivating) return;
      stateRef.current.isDragging = false;
      setIsDragging(false);

      const { dragAxis: activeAxis, dragOffset: activeOffset, currentIndex: curIdx, totalCards: total } = stateRef.current;

      if (activeAxis === 'x') {
        const floatShift = -activeOffset.x / DOCK_SPACING;
        let roundedShift = Math.round(floatShift);

        // Flick assistance or edge tap
        if (roundedShift === 0 && Math.abs(activeOffset.x) >= 30) {
          roundedShift = activeOffset.x < 0 ? 1 : -1;
        } else if (Math.abs(activeOffset.x) < 8 && Math.abs(activeOffset.y) < 8 && containerRef.current) {
          // Tap on left/right side of the upper deck surface
          const rect = containerRef.current.getBoundingClientRect();
          const clickX = stateRef.current.startX - rect.left;
          if (clickX < rect.width * 0.3) {
            roundedShift = -1;
          } else if (clickX > rect.width * 0.7) {
            roundedShift = 1;
          }
        }

        const targetIndex = Math.max(0, Math.min(total - 1, curIdx + roundedShift));
        console.log('[3D CAROUSEL] Snapped precisely to targetIndex:', targetIndex);
        onIndexChange(targetIndex);
        onDragProgress?.(0);
      } else if (activeAxis === 'y') {
        if (activeOffset.y > 45) {
          onDragProgress?.(1);
          setDragOffset({ x: 0, y: 0 });
          stateRef.current.dragOffset = { x: 0, y: 0 };
          stateRef.current.dragAxis = null;
          setDragAxis(null);
          onActivate();
          return;
        }
        onDragProgress?.(0);
      }

      setDragOffset({ x: 0, y: 0 });
      stateRef.current.dragOffset = { x: 0, y: 0 };
      stateRef.current.dragAxis = null;
      setDragAxis(null);
    };

    window.addEventListener('pointermove', handleWindowPointerMove, { passive: false });
    window.addEventListener('pointerup', handleWindowPointerUp);
    window.addEventListener('pointercancel', handleWindowPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
      window.removeEventListener('pointercancel', handleWindowPointerUp);
    };
  }, [isDragging, onIndexChange, onActivate, onDragProgress, onLongPressChange]);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isActivating) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 25) {
      if (delta > 0 && currentIndex < cards.length - 1) {
        onIndexChange((prev: number) => Math.min(cards.length - 1, prev + 1));
      } else if (delta < 0 && currentIndex > 0) {
        onIndexChange((prev: number) => Math.max(0, prev - 1));
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'card-container relative flex h-full w-full items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none pt-8 sm:pt-10',
        props.className,
      )}
      data-interactive="true"
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      style={{ perspective: '1000px', transformStyle: 'preserve-3d', touchAction: 'none' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
    >
      {/* 1. Target Alignment Glow Frame (Positioned at Z = -50px, strictly behind all cards during drag) */}
      <div
        className={cn(
          'absolute h-[360px] w-[231px] rounded-[25px] border-[2.5px] pointer-events-none transition-all duration-500 z-0 box-border',
          isActivating
            ? 'opacity-0 scale-90 border-orange-500/90'
            : ejectionStage === 'full_eject' || ejectionStage === 'atm_peek'
              ? 'opacity-100 scale-100 border-amber-400 shadow-[0_0_50px_rgba(255,153,0,0.95),inset_0_0_25px_rgba(255,153,0,0.6)] animate-pulse'
              : isDragging && dragAxis === 'y'
                ? 'opacity-30 scale-100 border-orange-500/90 shadow-[0_0_20px_rgba(255,153,0,0.3)]'
                : 'opacity-100 scale-100 border-orange-500/90 shadow-[0_0_35px_rgba(255,153,0,0.4),inset_0_0_15px_rgba(255,153,0,0.3)]',
        )}
        style={{
          transform: 'translate3d(0, 0, -50px)',
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

      {/* 3. Render 3D Cards (Virtualized window of +/- 6 cards around active position for ultra-smooth 60fps with 1400+ cards) */}
      {cards.map((card, index) => {
        const offsetCards = dragAxis === 'x' && isDragging ? -dragOffset.x / DOCK_SPACING : 0;
        const effectiveCenter = currentIndex + offsetCards;
        if (Math.abs(index - effectiveCenter) > 6.5) {
          return null;
        }

        return (
          <QueueDockCardItem
            key={card.id || index}
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
            onSelect={onIndexChange}
            onPointerDown={handlePointerDown}
          />
        );
      })}

      {/* 4. Full-Surface Top Touch/Drag Capture Surface (Spans 100% full width and height of the upper card deck) */}
      <div
        className="absolute inset-0 z-25 w-full h-full cursor-grab active:cursor-grabbing select-none touch-none"
        onPointerDown={handlePointerDown}
      />
    </div>
  );
}
