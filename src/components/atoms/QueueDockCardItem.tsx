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

export type EjectionStage = 'idle' | 'atm_plunge' | 'dock_appear' | 'rail_converge' | 'atm_peek' | 'full_eject';

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
  theme?: 'dark' | 'light';
  onSelect?: (index: number) => void;
  onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
  className?: string;
}) {
  const ejectionStage = props.ejectionStage ?? 'idle';

  // Compute offset from center active card index
  let distanceFromCenter = props.index - props.currentIndex;

  if (props.isDragging && props.dragAxis !== 'y') {
    distanceFromCenter += props.dragOffset.x / DOCK_SPACING;
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
  let zIndex = Math.round(30 - Math.abs(distanceFromCenter) * 4);
  let opacity = Math.max(0, Math.min(1, 1 - Math.max(0, Math.abs(distanceFromCenter) - 0.85) * 0.95));

  // Pull-down activation gesture handling (stays strictly in front of the target frame, 100% solid)
  if (props.dragAxis === 'y' && props.dragOffset.y > 0 && props.index === props.currentIndex) {
    y += props.dragOffset.y;
    z = 20;
    zIndex = 50;
  }

  // Activation & Ejection dispersion state:
  const isDispersed =
    props.isActivating ||
    Boolean(props.showSuccess) ||
    ejectionStage === 'dock_appear';

  if (isDispersed) {
    if (props.index < props.currentIndex) {
      x = -550 - (props.currentIndex - props.index) * 120;
      y = -40;
      z = -200;
      rotateZ = -45;
      rotateY = -35;
      opacity = 0;
    } else if (props.index > props.currentIndex) {
      x = 550 + (props.index - props.currentIndex) * 120;
      y = -40;
      z = -200;
      rotateZ = 45;
      rotateY = 35;
      opacity = 0;
    } else {
      // Center card plunged deep in slot
      x = 0;
      y = 650;
      z = 20;
      zIndex = 50;
      rotateY = 0;
      rotateZ = 0;
      opacity = props.showSuccess ? 0 : 1;
    }
  } else if (ejectionStage === 'rail_converge') {
    // Stage: "Temen-temen nya dulu yang masuk!"
    // Surrounding friend cards have their normal U-railway coordinates and fly in smoothly (opacity = 1)
    // Center card remains deep in the slot waiting for its friends to take their positions
    if (props.index === props.currentIndex) {
      x = 0;
      y = 650;
      z = 20;
      zIndex = 50;
      rotateY = 0;
      rotateZ = 0;
      opacity = 0;
    } else {
      opacity = 1;
    }
  } else if (ejectionStage === 'atm_peek') {
    // Stage: Friends already seated; center card peeks out of the slot mouth
    if (props.index === props.currentIndex) {
      x = 0;
      y = 165;
      z = 20;
      zIndex = 50;
      rotateY = 0;
      rotateZ = 0;
      opacity = 1;
    } else {
      opacity = 1;
    }
  } else if (ejectionStage === 'full_eject') {
    // Stage: Center card rises from slot mouth and glides gracefully into the center frame!
    if (props.index === props.currentIndex) {
      x = 0;
      y = 0;
      z = 20;
      zIndex = 50;
      rotateY = 0;
      rotateZ = 0;
      opacity = 1;
    } else {
      opacity = 1;
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
        props.index !== props.currentIndex ? 'cursor-pointer' : '',
        props.isActivating || Boolean(props.showSuccess)
          ? 'transition-all duration-600 ease-in'
          : ejectionStage === 'dock_appear'
            ? 'transition-none'
            : ejectionStage === 'rail_converge'
              ? props.index === props.currentIndex
                ? 'transition-none'
                : 'transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]'
              : ejectionStage === 'atm_peek'
                ? props.index === props.currentIndex
                  ? 'transition-all duration-450 ease-out'
                  : 'transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]'
                : ejectionStage === 'full_eject'
                  ? props.index === props.currentIndex
                    ? 'transition-all duration-650 ease-[cubic-bezier(0.18,0.89,0.32,1.28)]'
                    : 'transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]'
                  : props.isDragging
                    ? 'transition-none'
                    : 'transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]',
        props.className,
      )}
      style={{
        transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
        transformOrigin: 'center 20%',
        opacity,
        zIndex,
        pointerEvents: opacity > 0.05 ? 'auto' : 'none',
        touchAction: 'none',
      }}
      onClick={(e) => {
        if (!props.isDragging && props.index !== props.currentIndex) {
          e.stopPropagation();
          props.onSelect?.(props.index);
        }
      }}
      onPointerDown={props.onPointerDown}
    >
      <QueueCardMaster card={props.card} theme={props.theme} onPointerDown={props.onPointerDown} />
    </div>
  );
}
