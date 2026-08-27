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

export function QueueDockCardItem(props: {
  card: QueueDockCardData;
  index: number;
  currentIndex: number;
  dragOffset: { x: number; y: number };
  dragAxis: 'x' | 'y' | null;
  isDragging: boolean;
  isActivating: boolean;
  ejectionStage?: EjectionStage;
  isLongPressing?: boolean;
  showSuccess?: boolean;
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
  } = props;

  const offsetRatio = dragOffset.x / DOCK_SPACING;
  const distanceFromCenter = index - currentIndex + offsetRatio;

  // U-Railway Track Trigonometry: cards glide seamlessly along the U-curve like train carriages on rails
  const angleDeg = distanceFromCenter * DOCK_RAIL_ANGLE_STEP;
  const angleRad = (angleDeg * Math.PI) / 180;

  // 1. Horizontal position along the circular U-railway arc
  let x = DOCK_RAIL_RADIUS * Math.sin(angleRad);

  // 2. Vertical position: elevated upwards along the U-rail to sit directly on the rail line
  let y = -DOCK_RAIL_RADIUS * (1 - Math.cos(angleRad)) * 0.8;

  // 3. Tangent rotation along the U-curve (Left card tilts clockwise, Right card tilts counter-clockwise)
  let rotateZ = -distanceFromCenter * DOCK_MAX_ROTATION_Z;
  let rotateY = distanceFromCenter * DOCK_MAX_ROTATION_Y;
  let z = -Math.abs(distanceFromCenter) * Math.abs(DOCK_CURVE_DEPTH);
  let zIndex = Math.round(20 - Math.abs(distanceFromCenter) * 2);
  const opacity = 1;

  // Pull-down activation gesture handling (stays strictly in front of the target frame, 100% solid)
  if (dragAxis === 'y' && dragOffset.y > 0 && Math.abs(distanceFromCenter) < 0.5) {
    y += dragOffset.y;
    z = 10;
    zIndex = 40;
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
      z = -40;
      rotateY = 0;
      rotateZ = 0;
    }
  } else if (ejectionStage === 'dock_appear') {
    // Stage 1 of Cancellation: Dock slot appears first; card sits completely offscreen below the phone frame
    if (index === currentIndex) {
      x = 0;
      y = 650;
      z = -40;
      rotateY = 0;
      rotateZ = 0;
    }
  } else if (ejectionStage === 'atm_peek') {
    // Stage 2 of Cancellation: ATM-style peek - emerges from way below off-screen up into the slot mouth
    if (index === currentIndex) {
      x = 0;
      y = 165;
      z = -10;
      rotateY = 0;
      rotateZ = 0;
    }
  }

  const scale = 1 - Math.min(0.06, Math.abs(distanceFromCenter) * 0.035);

  return (
    <div
      className={cn(
        'absolute flex h-[320px] w-[195px] flex-col overflow-hidden rounded-[16px] p-4 sm:p-5 shadow-[0_20px_40px_rgba(0,0,0,0.8)] will-change-transform select-none',
        card.bgClass,
        isActivating
          ? 'transition-all duration-700 ease-out'
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
      }}
    >
      {/* Brand Header */}
      <div className="mb-auto flex items-center justify-between z-10">
        <span
          className={cn(
            'text-lg font-bold tracking-tight uppercase',
            card.id === 'zomato'
              ? 'text-[#f50]'
              : card.id === 'spotify'
                ? 'text-[#1DB954]'
                : card.id === 'netflix'
                  ? 'text-[#E50914]'
                  : 'text-white',
          )}
        >
          {card.brand}
        </span>
        <span className="text-[10px] font-semibold tracking-wider text-white/50 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm">
          VOUCHER
        </span>
      </div>

      {/* Card Content Anatomy */}
      <div className="z-10 mt-6 flex flex-col">
        <div className="text-3xl font-black leading-tight text-white tracking-tight">
          {card.title}
        </div>
        <div className="text-base font-bold text-white/90 tracking-wide">{card.subtitle}</div>
        {card.desc && (
          <p className="mt-2 text-xs font-medium text-white/70 line-clamp-2">{card.desc}</p>
        )}
      </div>

      {/* Bespoke Graphical Elements for each of the 10 distinct brands */}
      {card.id === 'amazon' && (
        <div className="absolute bottom-4 right-4 text-white/25 pointer-events-none">
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
          </svg>
        </div>
      )}
      {card.id === 'airtel' && (
        <div className="absolute bottom-0 right-0 h-32 w-32 rounded-tl-full bg-white/10" />
      )}
      {card.id === 'zomato' && (
        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full border-4 border-[#f50]/25" />
      )}
      {card.id === 'spotify' && (
        <div className="absolute bottom-4 right-4 flex items-end gap-1 opacity-40">
              <div className="w-1.5 h-6 bg-[#1DB954] rounded-full animate-pulse" />
              <div className="w-1.5 h-10 bg-[#1DB954] rounded-full animate-pulse delay-100" />
              <div className="w-1.5 h-8 bg-[#1DB954] rounded-full animate-pulse delay-200" />
              <div className="w-1.5 h-12 bg-[#1DB954] rounded-full animate-pulse delay-300" />
            </div>
          )}
          {card.id === 'apple' && (
            <div className="absolute -bottom-8 -right-8 h-36 w-36 rounded-full bg-white/5 border border-white/15 backdrop-blur-md" />
          )}
          {card.id === 'disney' && (
            <div className="absolute bottom-0 right-0 h-36 w-36 bg-radial from-cyan-400/20 via-transparent to-transparent blur-xl" />
          )}
          {card.id === 'grab' && (
            <div className="absolute -bottom-6 -right-6 h-28 w-28 rotate-45 border-2 border-emerald-400/30 bg-emerald-500/10" />
          )}
          {card.id === 'gojek' && (
            <div className="absolute -bottom-8 -right-8 flex h-36 w-36 items-center justify-center rounded-full border-2 border-lime-400/20">
              <div className="h-20 w-20 rounded-full border-2 border-lime-400/30" />
            </div>
          )}
          {card.id === 'netflix' && (
            <div className="absolute bottom-0 right-3 flex h-28 w-14 items-end">
              <div className="h-full w-4 bg-[#E50914]/20 shadow-[0_0_15px_#E50914]" />
            </div>
          )}
          {card.id === 'halodoc' && (
            <div className="absolute bottom-4 right-4 text-pink-400/25">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z" />
              </svg>
            </div>
          )}
    </div>
  );
}
