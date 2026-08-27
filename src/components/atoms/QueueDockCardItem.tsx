import { cn } from '@/lib/utils';
import {
  DOCK_CURVE_DEPTH,
  DOCK_MAX_ROTATION_Y,
  DOCK_MAX_ROTATION_Z,
  DOCK_RAIL_ANGLE_STEP,
  DOCK_RAIL_RADIUS,
  DOCK_SPACING,
  type QueueDockCardData,
} from '@/types/queue-dock.types';

export type EjectionStage = 'idle' | 'dock_appear' | 'atm_peek' | 'full_eject';

import { QueueCardMaster } from './QueueCardMaster';

export function QueueDockCardItem(props: {
  card: QueueDockCardData;
  index: number;
  currentIndex: number;
  totalCards?: number;
  dragOffset: { x: number; y: number };
  dragAxis: 'x' | 'y' | null;
  isDragging: boolean;
  isActivating: boolean;
  ejectionStage?: EjectionStage;
  isLongPressing?: boolean;
  showSuccess?: boolean;
  onSelect?: (index: number) => void;
  onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
  className?: string;
}) {
  const {
    card,
    index,
    currentIndex,
    dragOffset,
    dragAxis,
    isDragging,
    isActivating,
    ejectionStage = 'idle',
    onSelect,
    onPointerDown,
  } = props;

  // Compute offset from center active card index
  let distanceFromCenter = index - currentIndex;

  if (isDragging && dragAxis !== 'y') {
    distanceFromCenter += dragOffset.x / DOCK_SPACING;
  }

  // Clamped angle along the U-railway arc
  const angleDeg = distanceFromCenter * DOCK_RAIL_ANGLE_STEP;
  const angleRad = (angleDeg * Math.PI) / 180;

  // 1. Horizontal position along the circular U-railway arc
  let x = DOCK_RAIL_RADIUS * Math.sin(angleRad);

  // 2. Vertical position: elevated upwards along the U-rail to sit directly on the rail line
  let y = -DOCK_RAIL_RADIUS * (1 - Math.cos(angleRad)) * 0.8;

  // 3. Tangent rotation along the U-curve (Left card tilts clockwise, Right card tilts counter-clockwise)
  let rotateZ = -distanceFromCenter * DOCK_MAX_ROTATION_Z;
  let rotateY = distanceFromCenter * DOCK_MAX_ROTATION_Y;
  let z = 5 - Math.abs(distanceFromCenter) * Math.abs(DOCK_CURVE_DEPTH);
  let zIndex = Math.round(20 - Math.abs(distanceFromCenter) * 2);
  const opacity = 1;

  // Pull-down activation gesture handling (stays strictly in front of the target frame, 100% solid)
  if (dragAxis === 'y' && dragOffset.y > 0 && index === currentIndex) {
    y += dragOffset.y;
    z = 20;
    zIndex = 50;
  }

  // Activation animation state (disperse left & right offscreen, center card plunges completely down offscreen through slot)
  if (isActivating) {
    if (index < currentIndex) {
      x = -550 - (currentIndex - index) * 120;
      y = -40;
      z = -200;
      rotateZ = -45;
      rotateY = -35;
    } else if (index > currentIndex) {
      x = 550 + (index - currentIndex) * 120;
      y = -40;
      z = -200;
      rotateZ = 45;
      rotateY = 35;
    } else {
      x = 0;
      y = 650;
      z = 20;
      zIndex = 50;
      rotateY = 0;
      rotateZ = 0;
    }
  } else if (ejectionStage === 'dock_appear') {
    // Stage 1 of Cancellation: Dock slot appears first; card sits completely offscreen below the phone frame
    if (index === currentIndex) {
      x = 0;
      y = 650;
      z = 20;
      zIndex = 50;
      rotateY = 0;
      rotateZ = 0;
    }
  } else if (ejectionStage === 'atm_peek') {
    // Stage 2 of Cancellation: ATM-style peek - emerges from way below off-screen up into the slot mouth
    if (index === currentIndex) {
      x = 0;
      y = 165;
      z = 20;
      zIndex = 50;
      rotateY = 0;
      rotateZ = 0;
    }
  } else if (ejectionStage === 'full_eject') {
    // Stage 3 of Cancellation: Card glides all the way up into the strader frame
    if (index === currentIndex) {
      x = 0;
      y = 0;
      z = 20;
      zIndex = 50;
      rotateY = 0;
      rotateZ = 0;
    }
  }

  const scale = 1 - Math.min(0.06, Math.abs(distanceFromCenter) * 0.035);

  return (
    <div
      data-interactive="true"
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      className={cn(
        'absolute h-[335px] w-[212px] will-change-transform select-none touch-none pointer-events-auto cursor-grab active:cursor-grabbing',
        index !== currentIndex ? 'cursor-pointer' : '',
        isActivating
          ? 'transition-all duration-600 ease-in'
          : ejectionStage === 'dock_appear' && index === currentIndex
            ? 'transition-none'
            : ejectionStage === 'atm_peek' && index === currentIndex
              ? 'transition-all duration-500 ease-out'
              : ejectionStage === 'full_eject' && index === currentIndex
                ? 'transition-all duration-650 ease-[cubic-bezier(0.18,0.89,0.32,1.28)]'
                : isDragging
                  ? 'transition-none'
                  : 'transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]',
        props.className,
      )}
      style={{
        transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
        transformOrigin: 'center 20%',
        opacity,
        zIndex,
        touchAction: 'none',
      }}
      onClick={(e) => {
        if (!isDragging && index !== currentIndex) {
          e.stopPropagation();
          onSelect?.(index);
        }
      }}
      onPointerDown={onPointerDown}
    >
      <QueueCardMaster card={card} onPointerDown={onPointerDown} />
    </div>
  );
}
