import { ArrowUpRight } from 'lucide-react';
import React from 'react';
import { PixelTexture } from './PixelTexture';
import { cn } from '@/lib/utils';
import type { QueueDockCardData } from '@/types/queue-dock.types';

const round = (value: number, precision = 3) => parseFloat(value.toFixed(precision));
const clamp = (value: number, min = 0, max = 100) => Math.min(Math.max(value, min), max);

/**
 * Reusable Card Cover Component (Closed card back with large theme-respecting watermark, queue number & bottom-to-top gradient texture)
 */
function QueueCardCover(props: {
  queueNumber: string;
  watermarkUrl?: string;
  isDarkCard: boolean;
  className?: string;
}) {
  const isDarkCard = props.isDarkCard;
  const wmUrl = props.watermarkUrl || '/assets/images/wm.svg';

  return (
    <div
      className={cn(
        'relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[22px] p-6 select-none transition-all duration-300 box-border',
        isDarkCard
          ? 'bg-[#121624] text-white shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.2),inset_0_-1.5px_2px_rgba(0,0,0,0.6),0_25px_50px_-12px_rgba(0,0,0,0.7)]'
          : 'bg-gradient-to-b from-white via-[#f8faff] to-[#edf2ff] text-slate-900 shadow-[inset_0_2px_2.5px_rgba(255,255,255,1),inset_0_-1.5px_2px_rgba(0,0,0,0.06),0_18px_40px_-12px_rgba(10,30,80,0.18)]',
        props.className,
      )}
    >
      {/* Background Texture with Bottom-to-Top Gradient Masking */}
      <div
        className={cn(
          'absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_top,black_80%,transparent_100%)]',
          isDarkCard
            ? 'bg-gradient-to-t from-cyan-950/60 via-slate-900/30 to-transparent'
            : 'bg-gradient-to-t from-blue-100/70 via-blue-50/25 to-transparent',
        )}
      />

      {/* Subtle Ambient Radial Glowing Accent */}
      <div
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-52 w-52 rounded-full blur-3xl pointer-events-none opacity-25',
          isDarkCard ? 'bg-cyan-400/30' : 'bg-blue-600/20',
        )}
      />

      {/* Organic Cybernetic Pixel Texture with Smooth Concave Bottom Masking */}
      <PixelTexture
        maskGradient="radial-gradient(120% 85% at 50% -5%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.25) 54%, rgba(0,0,0,0.65) 74%, rgba(0,0,0,0.92) 88%, rgba(0,0,0,1) 100%)"
        colorMode={isDarkCard ? 'custom' : 'theme'}
        customColors={
          isDarkCard
            ? ['#00d4ff', '#38bdf8', '#0d66e9', '#60a5fa', '#93c5fd']
            : ['#0d66e9', '#38bdf8', '#93c5fd', '#bfdbfe']
        }
        primaryColor={isDarkCard ? '#00d4ff' : '#0d66e9'}
        secondaryColor={isDarkCard ? '#38bdf8' : '#60a5fa'}
        opacity={isDarkCard ? 0.32 : 0.22}
        blendMode={isDarkCard ? 'screen' : 'multiply'}
        pixelSize={4}
        gap={1.8}
        density="subtle"
        className="z-0 pointer-events-none"
      />

      {/* Center Group: Theme-Respecting Watermark + Queue Number */}
      <div className="z-10 flex flex-col items-center justify-center gap-4 my-auto">
        {/* Watermark Logo (Color respects theme via CSS mask) */}
        <div
          className={cn(
            'h-28 w-28 sm:h-32 sm:w-32 transition-all duration-300 drop-shadow-sm',
            isDarkCard
              ? 'bg-gradient-to-br from-cyan-300 via-cyan-400 to-teal-400'
              : 'bg-gradient-to-br from-[#0d66e9] via-[#1a55ff] to-[#00d4ff]',
          )}
          style={{
            maskImage: `url("${wmUrl}")`,
            WebkitMaskImage: `url("${wmUrl}")`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
          }}
        />

        {/* Queue Number (#01, #04, etc.) */}
        <span
          className={cn(
            'text-3xl sm:text-4xl font-extrabold tracking-tight font-sans leading-none drop-shadow-xs',
            isDarkCard ? 'text-cyan-400' : 'text-[#0d66e9]',
          )}
        >
          {props.queueNumber || '#01'}
        </span>
      </div>

      {/* Glossy Sheen Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-20" />
    </div>
  );
}

export function QueueCardMaster(props: {
  card: QueueDockCardData;
  isRevealed?: boolean;
  isSpinReady?: boolean;
  badgeText?: string;
  theme?: 'dark' | 'light';
  className?: string;
  onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onRevealApex?: () => void;
  onCardClick?: (card: QueueDockCardData) => void;
  children?: React.ReactNode;
}) {
  const isRevealed = props.isRevealed ?? false;
  const isSpinReady = props.isSpinReady ?? false;
  const theme = props.theme ?? 'dark';

  const cardRef = React.useRef<HTMLDivElement>(null);
  const rafRef = React.useRef<number | null>(null);
  const springDecayRafRef = React.useRef<number | null>(null);

  const [spinAngle, setSpinAngle] = React.useState(isRevealed ? 180 : 0);
  const [pointer, setPointer] = React.useState({
    x: 50,
    y: 50,
    rx: 0,
    ry: 0,
    tx: 0,
    ty: 0,
    scale: 1,
    opacity: 0,
  });

  const pointerRef = React.useRef(pointer);
  pointerRef.current = pointer;

  // Initial 3D Flip & Spin Reveal Animation (starts with backface 180deg, spins to front 0deg when isSpinReady is true)
  React.useEffect(() => {
    if (!isRevealed) return;

    if (!isSpinReady) {
      setSpinAngle(180);
      setPointer({
        x: 50,
        y: 50,
        rx: 0,
        ry: 0,
        tx: 0,
        ty: 0,
        scale: 1,
        opacity: 0,
      });
      return;
    }

    let startTime: number | null = null;
    const duration = 850;
    let apexTriggered = false;

    setSpinAngle(180);
    setPointer({
      x: 50,
      y: 50,
      rx: 0,
      ry: 0,
      tx: 0,
      ty: 0,
      scale: 1.05,
      opacity: 0.3,
    });

    const animateReveal = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Smooth cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentRotation = 180 * (1 - ease);

      setSpinAngle(round(currentRotation));
      setPointer((prev) => ({
        ...prev,
        x: 50 + Math.sin(progress * Math.PI) * 20,
        y: 50,
        rx: round(Math.sin(progress * Math.PI) * 6),
        ry: round(Math.sin(progress * Math.PI) * 12),
        tx: round(Math.sin(progress * Math.PI) * 8),
        ty: round(-10 * Math.sin(progress * Math.PI)),
        opacity: round(Math.min(1, ease * 1.2)),
      }));

      // Trigger apex confetti when front face crosses view (halfway through spin)
      if (progress >= 0.45 && !apexTriggered) {
        apexTriggered = true;
        props.onRevealApex?.();
      }

      if (progress < 1) {
        requestAnimationFrame(animateReveal);
      } else {
        setSpinAngle(0);
        // Settle smoothly to rest
        let restFrame = 0;
        const settleRest = () => {
          restFrame++;
          const settleProgress = Math.min(1, restFrame / 16);
          const settleEase = 1 - Math.pow(1 - settleProgress, 2);
          setPointer((prev) => ({
            ...prev,
            rx: round(prev.rx * (1 - settleEase)),
            ry: round(prev.ry * (1 - settleEase)),
            tx: round(prev.tx * (1 - settleEase)),
            ty: round(prev.ty * (1 - settleEase)),
            scale: round(1 + 0.05 * (1 - settleEase)),
            opacity: round(1 - settleEase * 0.6),
          }));
          if (settleProgress < 1) {
            requestAnimationFrame(settleRest);
          }
        };
        requestAnimationFrame(settleRest);
      }
    };

    const animId = requestAnimationFrame(animateReveal);
    return () => cancelAnimationFrame(animId);
  }, [isRevealed, isSpinReady, props.onRevealApex]);

  // Authentic 3D Interactive Pointer Physics
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    if (springDecayRafRef.current) {
      cancelAnimationFrame(springDecayRafRef.current);
      springDecayRafRef.current = null;
    }

    const rect = cardRef.current.getBoundingClientRect();
    const absX = e.clientX - rect.left;
    const absY = e.clientY - rect.top;

    const percentX = clamp(round((100 / rect.width) * absX));
    const percentY = clamp(round((100 / rect.height) * absY));
    const centerX = percentX - 50;
    const centerY = percentY - 50;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      setPointer({
        x: round(percentX),
        y: round(percentY),
        rx: round(-(centerY / 2.6)), // Authentic 3D tilt on X
        ry: round(centerX / 2.6),    // Authentic 3D tilt on Y
        tx: round(centerX / 6),      // Dynamic 3D translation X
        ty: round(-10 + centerY / 6),// Dynamic 3D floating lift Y
        scale: 1.07,                 // Subtle 3D lift scale
        opacity: 0.9,                // Dynamic specular glare visibility
      });
    });
  };

  const handlePointerLeave = () => {
    if (springDecayRafRef.current) cancelAnimationFrame(springDecayRafRef.current);

    let frame = 0;
    const initialRx = pointerRef.current.rx;
    const initialRy = pointerRef.current.ry;
    const initialTx = pointerRef.current.tx;
    const initialTy = pointerRef.current.ty;
    const initialScale = pointerRef.current.scale;

    const decay = () => {
      frame++;
      const progress = Math.min(1, frame / 20);
      const ease = 1 - Math.pow(1 - progress, 3);

      setPointer((prev) => ({
        ...prev,
        rx: round(initialRx * (1 - ease)),
        ry: round(initialRy * (1 - ease)),
        tx: round(initialTx * (1 - ease)),
        ty: round(initialTy * (1 - ease)),
        scale: round(1 + (initialScale - 1) * (1 - ease)),
        opacity: round(1 - ease),
      }));

      if (progress < 1) {
        springDecayRafRef.current = requestAnimationFrame(decay);
      } else {
        springDecayRafRef.current = null;
      }
    };

    springDecayRafRef.current = requestAnimationFrame(decay);
  };

  // Direct theme adherence:
  // - Light App Theme (theme === 'light') -> Crisp Light Card (white/ice background, dark text, royal blue accents)
  // - Dark App Theme (theme === 'dark')   -> Dark Obsidian Card (dark background, white text, cyan accents)
  const isDarkCard = theme === 'dark';

  // 1. Unrevealed state (on 3D rail): Closed textured card back with emblem & queue number
  if (!isRevealed) {
    return (
      <div
        className={cn(
          'relative flex h-[335px] w-[212px] shrink-0 flex-col select-none pointer-events-auto cursor-grab active:cursor-grabbing',
          props.className,
        )}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        onPointerDown={props.onPointerDown}
      >
        <QueueCardCover
          queueNumber={props.card.queueNumber || '#01'}
          watermarkUrl={props.card.watermarkUrl}
          isDarkCard={isDarkCard}
        />

        {props.children}
      </div>
    );
  }

  // 2. Revealed State (Modal): Authentic 3D interactive floating & tilting hero card with 3D Flip from Cover to Front
  return (
    <div
      ref={cardRef}
      className={cn(
        'relative aspect-[0.718] w-full max-w-[320px] select-none cursor-pointer [perspective:900px] touch-none',
        props.className,
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* 3D Translater (Floating Lift & Scale) */}
      <div
        className="relative h-full w-full transition-transform duration-100 ease-out [transform-style:preserve-3d]"
        style={{
          transform: `translate3d(${pointer.tx}px, ${pointer.ty}px, 0px) scale(${pointer.scale})`,
        }}
      >
        {/* 3D Rotator (X & Y Rotational Physics) */}
        <div
          className="relative h-full w-full transition-transform duration-100 ease-out [transform-style:preserve-3d]"
          style={{
            transform: `rotateY(${spinAngle + pointer.ry}deg) rotateX(${pointer.rx}deg)`,
          }}
        >
          {/* Card Back Face (Official Closed Textured Medical Card Cover) */}
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <QueueCardCover
              queueNumber={props.card.queueNumber || '#01'}
              watermarkUrl={props.card.watermarkUrl}
              isDarkCard={isDarkCard}
            />
          </div>

          {/* Card Front Face (Composed Patient Queue Hero Card) */}
          <div
            className={cn(
              'absolute inset-0 flex flex-col justify-between rounded-[22px] overflow-hidden p-4 select-none transition-all duration-300 [backface-visibility:hidden]',
              isDarkCard
                ? 'bg-[#121624] text-white shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.2),inset_0_-1.5px_2px_rgba(0,0,0,0.6),0_25px_50px_-12px_rgba(0,0,0,0.7)]'
                : 'bg-gradient-to-b from-white via-[#f8faff] to-[#edf2ff] text-neutral-900 shadow-[inset_0_2px_2.5px_rgba(255,255,255,1),inset_0_-1.5px_2px_rgba(0,0,0,0.06),0_18px_40px_-12px_rgba(10,30,80,0.18)]',
            )}
          >
            {/* Background Watermark Switched to Left (wm.svg) */}
            <img
              src={props.card.watermarkUrl || '/assets/images/wm.svg'}
              alt="Watermark"
              style={{ transform: 'translateZ(1px)' }}
              className={cn(
                'absolute -top-4 -left-6 h-52 w-52 object-contain pointer-events-none select-none z-0',
                isDarkCard ? 'opacity-15' : 'opacity-25',
              )}
            />

            {/* Organic Cybernetic Pixel Texture (Deep Background Layer with Seamless Integration) */}
            <PixelTexture
              maskVariant="bottom-left"
              colorMode={isDarkCard ? 'custom' : 'theme'}
              customColors={isDarkCard ? ['#00d4ff', '#38bdf8', '#0d66e9', '#60a5fa', '#93c5fd'] : ['#0d66e9', '#38bdf8', '#93c5fd', '#bfdbfe']}
              primaryColor={isDarkCard ? '#00d4ff' : '#0d66e9'}
              secondaryColor={isDarkCard ? '#38bdf8' : '#60a5fa'}
              opacity={isDarkCard ? 0.32 : 0.22}
              blendMode={isDarkCard ? 'screen' : 'multiply'}
              pixelSize={4}
              gap={1.8}
              density="subtle"
              style={{ transform: 'translateZ(1px)' }}
              className="z-0 pointer-events-none"
            />

            {/* Top-Left: Queue Number (Foreground Layer) */}
            <div
              style={{ transform: 'translateZ(18px)' }}
              className="absolute top-4 left-5 z-20 flex items-center justify-start"
            >
              <span
                className={cn(
                  'text-3xl sm:text-4xl font-extrabold tracking-tighter drop-shadow-sm font-sans leading-none',
                  isDarkCard ? 'text-cyan-400' : 'text-[#0d66e9]',
                )}
              >
                {props.card.queueNumber || '#01'}
              </span>
            </div>

            {/* Patient Figure Image - Solid Foreground Layer with Silky Smooth Waist Easing Fade */}
            <div
              style={{ transform: 'translateZ(14px)' }}
              className="absolute right-0 sm:right-1 top-7 sm:top-9 bottom-18 sm:bottom-20 w-[104%] sm:w-[108%] pointer-events-none select-none z-10 overflow-hidden flex items-end justify-end"
            >
              <img
                src={props.card.doctorImage || '/assets/images/doctors/woman-docter-3.png'}
                alt={props.card.patientName || props.card.doctorName || 'Patient'}
                style={{
                  maskImage:
                    'linear-gradient(to bottom, #000 0%, #000 65%, rgba(0,0,0,0.96) 72%, rgba(0,0,0,0.85) 79%, rgba(0,0,0,0.64) 86%, rgba(0,0,0,0.38) 92%, rgba(0,0,0,0.12) 97%, transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to bottom, #000 0%, #000 65%, rgba(0,0,0,0.96) 72%, rgba(0,0,0,0.85) 79%, rgba(0,0,0,0.64) 86%, rgba(0,0,0,0.38) 92%, rgba(0,0,0,0.12) 97%, transparent 100%)',
                }}
                className="w-full h-full object-contain object-right-bottom drop-shadow-lg"
              />
            </div>

            {/* Section 1: Patient Name & Complaint (Highest Foreground Content with Clickable Area) */}
            <div
              style={{ transform: 'translateZ(24px)' }}
              onClick={(e) => {
                if (props.onCardClick) {
                  e.stopPropagation();
                  props.onCardClick(props.card);
                }
              }}
              className={cn(
                'absolute bottom-14 sm:bottom-16 inset-x-5 z-20 flex flex-col select-none',
                props.onCardClick ? 'pointer-events-auto cursor-pointer active:scale-98 transition-transform' : 'pointer-events-none',
              )}
            >
              {/* Patient Name with Clickable Arrow ↗ */}
              <h4
                className={cn(
                  'flex items-center text-[17px] sm:text-[18px] font-extrabold truncate leading-tight tracking-tight drop-shadow-xs group',
                  isDarkCard ? 'text-white' : 'text-slate-900',
                )}
              >
                <ArrowUpRight
                  className={cn(
                    'h-5 w-5 mr-0.5 stroke-[3] shrink-0 inline-block transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
                    isDarkCard ? 'text-cyan-400' : 'text-[#0d66e9]',
                  )}
                />
                <span className="truncate">{props.card.patientName || props.card.brand || 'Budi Mulyono'}</span>
              </h4>

              {/* Patient Complaint */}
              <p
                className={cn(
                  'text-xs font-normal tracking-tight truncate pl-0.5 mt-0.5',
                  isDarkCard ? 'text-slate-300' : 'text-slate-500',
                )}
              >
                {props.card.complaint || props.card.desc || 'sakit kepala dan panas dalam'}
              </p>
            </div>

            {/* Section 2: Polyclinic Tag (Foreground Layer) */}
            <div
              style={{ transform: 'translateZ(20px)' }}
              className="absolute bottom-3.5 right-5 z-20 flex items-center justify-end select-none pointer-events-none"
            >
              <span
                className={cn(
                  'text-xs sm:text-sm font-bold tracking-tight',
                  isDarkCard ? 'text-cyan-400' : 'text-[#0d66e9]',
                )}
              >
                {props.card.poly || 'Poli gigi'}
              </span>
            </div>

            {/* Realistic Dynamic Specular Glare */}
            <div
              className="absolute inset-0 rounded-[22px] pointer-events-none z-30 transition-opacity duration-150 mix-blend-overlay"
              style={{
                opacity: pointer.opacity,
                transform: 'translateZ(28px)',
                background: `radial-gradient(farthest-corner circle at ${pointer.x}% ${pointer.y}%, rgba(255,255,255,0.7) 10%, rgba(255,255,255,0.25) 30%, transparent 75%)`,
              }}
            />
          </div>
        </div>
      </div>

      {props.children}
    </div>
  );
}
