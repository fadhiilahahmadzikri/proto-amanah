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
  initialDragY?: number;
  initialDragAxis?: 'x' | 'y';
  theme?: 'dark' | 'light';
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
    initialDragY,
    initialDragAxis,
  } = props;

  const isDark = props.theme !== 'light';
  const [isDragging, setIsDragging] = React.useState(Boolean(initialDragY || initialDragAxis));
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: initialDragY ?? 0 });
  const [dragAxis, setDragAxis] = React.useState<'x' | 'y' | null>(initialDragAxis ?? (initialDragY ? 'y' : null));
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

  const [spinOffset, setSpinOffset] = React.useState(0);
  const spinOffsetRef = React.useRef(0);

  const spinStateRef = React.useRef<{
    isSpinning: boolean;
    isDecelerating: boolean;
    velocity: number;
    lastTime: number;
    rafId: number | null;
  }>({
    isSpinning: false,
    isDecelerating: false,
    velocity: 0,
    lastTime: 0,
    rafId: null,
  });

  // Rapid Roulette Card Spin-Off on Long Press + Smooth Deceleration on Release
  React.useEffect(() => {
    if (isLongPressing) {
      // 1. Immediately spin cards rapidly in real-time during hold
      spinStateRef.current.isSpinning = true;
      spinStateRef.current.isDecelerating = false;
      spinStateRef.current.velocity = 18 * DOCK_SPACING; // ~18 cards per second
      spinStateRef.current.lastTime = performance.now();

      let lastCardStep = 0;

      const spinLoop = (now: number) => {
        const dt = Math.min(0.1, (now - spinStateRef.current.lastTime) / 1000);
        spinStateRef.current.lastTime = now;

        spinOffsetRef.current += spinStateRef.current.velocity * dt;
        setSpinOffset(spinOffsetRef.current);

        const currentCardStep = Math.floor(spinOffsetRef.current / DOCK_SPACING);
        if (currentCardStep !== lastCardStep) {
          lastCardStep = currentCardStep;
          if (typeof window !== 'undefined' && 'vibrate' in navigator) {
            try {
              navigator.vibrate(6);
            } catch {}
          }
        }

        if (spinStateRef.current.isSpinning) {
          spinStateRef.current.rafId = requestAnimationFrame(spinLoop);
        }
      };

      spinStateRef.current.rafId = requestAnimationFrame(spinLoop);

      return () => {
        if (spinStateRef.current.rafId) {
          cancelAnimationFrame(spinStateRef.current.rafId);
        }
      };
    } else if (spinStateRef.current.isSpinning) {
      // 2. Release -> Smooth exponential deceleration to land on selected card
      spinStateRef.current.isSpinning = false;
      spinStateRef.current.isDecelerating = true;
      spinStateRef.current.lastTime = performance.now();

      let lastCardStep = Math.floor(spinOffsetRef.current / DOCK_SPACING);

      const decelerateLoop = (now: number) => {
        const dt = Math.min(0.1, (now - spinStateRef.current.lastTime) / 1000);
        spinStateRef.current.lastTime = now;

        // Exponential deceleration friction
        spinStateRef.current.velocity *= Math.pow(0.04, dt);
        spinOffsetRef.current += spinStateRef.current.velocity * dt;
        setSpinOffset(spinOffsetRef.current);

        const currentCardStep = Math.floor(spinOffsetRef.current / DOCK_SPACING);
        if (currentCardStep !== lastCardStep) {
          lastCardStep = currentCardStep;
          if (typeof window !== 'undefined' && 'vibrate' in navigator) {
            try {
              navigator.vibrate(8);
            } catch {}
          }
        }

        if (spinStateRef.current.velocity > 40) {
          spinStateRef.current.rafId = requestAnimationFrame(decelerateLoop);
        } else {
          // Final snap to selected card
          spinStateRef.current.isDecelerating = false;
          const shiftCards = Math.round(spinOffsetRef.current / DOCK_SPACING);
          const rawTarget = currentIndex + shiftCards;
          const targetIndex = ((rawTarget % cards.length) + cards.length) % cards.length;
          onIndexChange(targetIndex);
          spinOffsetRef.current = 0;
          setSpinOffset(0);
          if (typeof window !== 'undefined' && 'vibrate' in navigator) {
            try {
              navigator.vibrate([20, 30]);
            } catch {}
          }
        }
      };

      spinStateRef.current.rafId = requestAnimationFrame(decelerateLoop);

      return () => {
        if (spinStateRef.current.rafId) {
          cancelAnimationFrame(spinStateRef.current.rafId);
        }
      };
    }

    return undefined;
  }, [isLongPressing, currentIndex, cards.length, onIndexChange]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (stateRef.current.isActivating) return;

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
    }, 220);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!stateRef.current.isDragging || stateRef.current.isActivating) return;

    const deltaX = e.clientX - stateRef.current.startX;
    const deltaY = e.clientY - stateRef.current.startY;

    if (!isLongPressing && (Math.abs(deltaX) > 12 || Math.abs(deltaY) > 12)) {
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

    const wasRouletteActive = spinStateRef.current.isSpinning || spinStateRef.current.isDecelerating;

    if (!wasRouletteActive) {
      if (activeAxis === 'x') {
        const floatShift = -activeOffset.x / DOCK_SPACING;
        let roundedShift = Math.round(floatShift);

        // Flick assistance: if user flicked (>= 30px) but didn't cross 0.5 card threshold
        if (roundedShift === 0 && Math.abs(activeOffset.x) >= 30) {
          roundedShift = activeOffset.x < 0 ? 1 : -1;
        }

        const targetIndex = ((curIdx + roundedShift) % total + total) % total;
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
      const wasWindowRouletteActive = spinStateRef.current.isSpinning || spinStateRef.current.isDecelerating;

      if (!wasWindowRouletteActive) {
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

          const targetIndex = ((curIdx + roundedShift) % total + total) % total;
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

  const lastWheelTimeRef = React.useRef(0);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isActivating) return;
    const now = performance.now();
    if (now - lastWheelTimeRef.current < 220) return;

    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 18) {
      lastWheelTimeRef.current = now;
      if (delta > 0) {
        onIndexChange((prev: number) => (prev + 1) % cards.length);
      } else {
        onIndexChange((prev: number) => ((prev - 1) % cards.length + cards.length) % cards.length);
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
      {/* 1. Target Alignment Glow Frame */}
      <div
        className={cn(
          'absolute h-[360px] w-[231px] rounded-[25px] border-[2.5px] pointer-events-none transition-all duration-500 z-0 box-border',
          isActivating || showSuccess
            ? 'opacity-0 scale-90 border-blue-500/90'
            : ejectionStage === 'full_eject' || ejectionStage === 'atm_peek'
              ? 'opacity-100 scale-100 border-sky-400 shadow-[0_0_50px_rgba(14,165,233,0.9),inset_0_0_25px_rgba(14,165,233,0.5)] animate-pulse'
              : isDragging && dragAxis === 'y'
                ? 'opacity-40 scale-100 border-blue-500/90 shadow-[0_0_20px_rgba(10,68,255,0.3)]'
                : isDark
                  ? 'opacity-100 scale-100 border-sky-400/80 shadow-[0_0_35px_rgba(10,68,255,0.3),inset_0_0_15px_rgba(10,68,255,0.2)]'
                  : 'opacity-100 scale-100 border-blue-500/80 shadow-[0_0_35px_rgba(10,68,255,0.2),inset_0_0_15px_rgba(10,68,255,0.1)]',
        )}
        style={{
          transform: 'translate3d(0, 0, -50px)',
        }}
      />

      {/* 2. Dual ChevronDown Arrow Animation Strictly Under / Behind the Cards */}
      <div
        className={cn(
          'absolute top-[calc(50%+198px)] z-0 flex flex-col items-center pointer-events-none transition-opacity duration-300',
          isActivating || showSuccess || ejectionStage !== 'idle' ? 'opacity-0' : 'opacity-100',
        )}
        style={{
          transform:
            dragAxis === 'y' && dragOffset.y > 0
              ? `translate3d(0, ${dragOffset.y * 0.3}px, -20px)`
              : 'translate3d(0, 0, -20px)',
        }}
      >
        <div className="flex flex-col items-center">
          <ChevronDown
            className={cn('animate-bounce', isDark ? 'text-sky-400' : 'text-[#0d66e9]')}
            size={24}
            strokeWidth={3}
          />
          <ChevronDown
            className={cn('-mt-4 animate-bounce delay-150', isDark ? 'text-sky-400' : 'text-[#0d66e9]')}
            size={24}
            strokeWidth={3}
          />
        </div>
      </div>

      {/* 3. Render 3D Cards: Stable Virtualized Window of +/- 3 slots around effective center */}
      {Array.from({ length: 7 }, (_, slotIdx) => {
        const relativeSlot = slotIdx - 3; // -3 to +3
        const totalXOffset = (dragAxis === 'x' && isDragging ? dragOffset.x : 0) - spinOffset;
        const offsetCards = -totalXOffset / DOCK_SPACING;
        const effectiveCenter = currentIndex + offsetCards;
        const centerFloor = Math.round(effectiveCenter);
        const virtualIndex = centerFloor + relativeSlot;
        const actualCardIndex = ((virtualIndex % cards.length) + cards.length) % cards.length;
        const card = cards[actualCardIndex];
        if (!card) return null;

        const effectiveDragOffset = {
          x: totalXOffset,
          y: dragOffset.y,
        };

        return (
          <QueueDockCardItem
            key={`slot-${virtualIndex}-${card.id || actualCardIndex}`}
            card={card}
            index={virtualIndex}
            currentIndex={currentIndex}
            dragOffset={effectiveDragOffset}
            dragAxis={spinOffset !== 0 ? 'x' : dragAxis}
            isDragging={isDragging || spinOffset !== 0}
            isActivating={isActivating}
            ejectionStage={ejectionStage}
            isLongPressing={isLongPressing}
            showSuccess={showSuccess}
            theme={props.theme}
            onSelect={(clickedVirtualIndex) => {
              const targetIndex = ((clickedVirtualIndex % cards.length) + cards.length) % cards.length;
              onIndexChange(targetIndex);
            }}
            onPointerDown={handlePointerDown}
          />
        );
      })}

      {/* 4. Full-Surface Top Touch/Drag Capture Surface (Spans 100% full width and height of the upper card deck) */}
      <div
        className={cn(
          'absolute inset-0 z-25 w-full h-full cursor-grab active:cursor-grabbing select-none touch-none',
          isActivating || showSuccess || ejectionStage !== 'idle' ? 'pointer-events-none' : 'pointer-events-auto',
        )}
        onPointerDown={handlePointerDown}
      />
    </div>
  );
}
