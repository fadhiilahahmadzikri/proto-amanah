import React from 'react';
import { cn } from '@/lib/utils';
import type { QueueDockCardData } from '@/types/queue-dock.types';

export const POKEMON_CARD_BACK = 'https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg';

const round = (value: number, precision = 3) => parseFloat(value.toFixed(precision));
const clamp = (value: number, min = 0, max = 100) => Math.min(Math.max(value, min), max);
const adjust = (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) => {
  return round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));
};

export function QueueCardMaster(props: {
  card: QueueDockCardData;
  isRevealed?: boolean;
  isSpinReady?: boolean;
  badgeText?: string;
  className?: string;
  onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onRevealApex?: () => void;
  children?: React.ReactNode;
}) {
  const { card, isRevealed = false, isSpinReady = false, className, onPointerDown, onRevealApex, children } = props;
  const [imgSrc, setImgSrc] = React.useState<string | undefined>(card.imageUrl);
  const [isInteracting, setIsInteracting] = React.useState(false);
  const [motionBlur, setMotionBlur] = React.useState(0);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const rafRef = React.useRef<number | null>(null);
  const springDecayRafRef = React.useRef<number | null>(null);

  const [pointer, setPointer] = React.useState({
    x: 50,
    y: 50,
    rx: 0,
    ry: 0,
    bgX: 50,
    bgY: 50,
    opacity: 0,
  });

  const pointerRef = React.useRef(pointer);
  pointerRef.current = pointer;

  React.useEffect(() => {
    setImgSrc(card.imageUrl);
  }, [card.imageUrl]);

  // Initial 3D Flip & Spin Reveal Animation (starts with backface 180deg, spins to front 0deg ONLY when isSpinReady is true)
  React.useEffect(() => {
    if (!isRevealed) return;

    if (!isSpinReady) {
      // While emerging from Genie, stay firmly in pristine Card Back mode
      setMotionBlur(0);
      setPointer({
        x: 50,
        y: 50,
        rx: 180,
        ry: 0,
        bgX: 50,
        bgY: 50,
        opacity: 0,
      });
      return;
    }

    let startTime: number | null = null;
    const duration = 900;
    let apexTriggered = false;

    setMotionBlur(8);
    setPointer({
      x: 50,
      y: 50,
      rx: 180,
      ry: 0,
      bgX: 50,
      bgY: 50,
      opacity: 0.2,
    });

    const animateReveal = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Smooth custom ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentRotation = 180 * (1 - ease);
      const currentBlur = Math.max(0, 8 * (1 - ease * 1.3));

      setMotionBlur(round(currentBlur, 1));
      setPointer({
        x: 50 + Math.sin(progress * Math.PI) * 20,
        y: 50,
        rx: round(currentRotation),
        ry: round(Math.sin(progress * Math.PI) * 12),
        bgX: adjust(50 + Math.sin(progress * Math.PI) * 20, 0, 100, 37, 63),
        bgY: 50,
        opacity: round(Math.min(1, ease * 1.2)),
      });

      // Trigger apex confetti when front face crosses view (halfway through spin)
      if (progress >= 0.45 && !apexTriggered) {
        apexTriggered = true;
        onRevealApex?.();
      }

      if (progress < 1) {
        requestAnimationFrame(animateReveal);
      } else {
        setMotionBlur(0);
        // Smooth transition to neutral rest
        let restFrame = 0;
        const settleRest = () => {
          restFrame++;
          const settleProgress = Math.min(1, restFrame / 16);
          const settleEase = 1 - Math.pow(1 - settleProgress, 2);
          setPointer((prev) => ({
            ...prev,
            rx: round(prev.rx * (1 - settleEase)),
            ry: round(prev.ry * (1 - settleEase)),
            opacity: round(1 - settleEase * 0.4),
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
  }, [isRevealed, isSpinReady, onRevealApex]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    if (springDecayRafRef.current) {
      cancelAnimationFrame(springDecayRafRef.current);
      springDecayRafRef.current = null;
    }
    setIsInteracting(true);

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
        rx: round(-(centerX / 3.2)),
        ry: round(centerY / 3.2),
        bgX: adjust(percentX, 0, 100, 37, 63),
        bgY: adjust(percentY, 0, 100, 33, 67),
        opacity: 1,
      });
    });
  };

  const handlePointerLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setIsInteracting(false);

    // Smooth physical spring decay back to resting equilibrium (no freezing/abrupt snapping)
    let frame = 0;
    const totalFrames = 22;
    const startRx = pointerRef.current.rx;
    const startRy = pointerRef.current.ry;
    const startX = pointerRef.current.x;
    const startY = pointerRef.current.y;
    const startOpacity = pointerRef.current.opacity;

    const animateSpringDecay = () => {
      frame++;
      const progress = Math.min(1, frame / totalFrames);
      // Damped harmonic easeOutCubic curve
      const ease = 1 - Math.pow(1 - progress, 3);

      const curRx = round(startRx * (1 - ease));
      const curRy = round(startRy * (1 - ease));
      const curX = round(startX + (50 - startX) * ease);
      const curY = round(startY + (50 - startY) * ease);
      const curOpacity = round(startOpacity * (1 - ease));

      setPointer({
        x: curX,
        y: curY,
        rx: curRx,
        ry: curRy,
        bgX: adjust(curX, 0, 100, 37, 63),
        bgY: adjust(curY, 0, 100, 33, 67),
        opacity: curOpacity,
      });

      if (progress < 1) {
        springDecayRafRef.current = requestAnimationFrame(animateSpringDecay);
      } else {
        springDecayRafRef.current = null;
      }
    };

    springDecayRafRef.current = requestAnimationFrame(animateSpringDecay);
  };

  // Unrevealed state (default on 3D rail): Displays authentic Pokémon card back
  if (!isRevealed) {
    return (
      <div
        className={cn(
          'relative flex h-[335px] w-[212px] shrink-0 flex-col overflow-hidden rounded-[18px] shadow-[0_20px_45px_rgba(0,0,0,0.85)] select-none bg-[#0c142c] border border-blue-400/20 box-border pointer-events-auto cursor-grab active:cursor-grabbing',
          className,
        )}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        onPointerDown={onPointerDown}
      >
        {/* Official Pokémon TCG Card Back Image */}
        <img
          src={POKEMON_CARD_BACK}
          alt="Pokémon Mystery Card Back"
          className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
          loading="eager"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
        />

        {/* Glossy Sheen Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

        {/* Outer Bevel Stroke */}
        <div className="absolute inset-0 rounded-[18px] ring-1 ring-inset ring-white/15 pointer-events-none" />

        {children}
      </div>
    );
  }

  const primaryType = (card.types?.[0] ?? card.subtitle ?? 'lightning').toLowerCase();
  const rarity = (card.rarity ?? card.title ?? 'rare holo').toLowerCase();
  const subtypes = (card.subtypes?.join(' ') ?? 'basic').toLowerCase();
  const supertype = (card.supertype ?? 'pokémon').toLowerCase();
  const number = (card.number ?? card.id ?? '160').toLowerCase();
  const set = (card.set ?? 'swsh12pt5').toLowerCase();

  const centerX = pointer.x - 50;
  const centerY = pointer.y - 50;
  const fromCenter = clamp(Math.sqrt(centerX * centerX + centerY * centerY) / 50, 0, 1);

  const dynamicStyles = {
    '--pointer-x': `${pointer.x}%`,
    '--pointer-y': `${pointer.y}%`,
    '--pointer-from-center': `${fromCenter}`,
    '--pointer-from-top': `${pointer.y / 100}`,
    '--pointer-from-left': `${pointer.x / 100}`,
    '--card-opacity': `${pointer.opacity}`,
    '--rotate-x': `${pointer.rx}deg`,
    '--rotate-y': `${pointer.ry}deg`,
    '--background-x': `${pointer.bgX}%`,
    '--background-y': `${pointer.bgY}%`,
    '--card-scale': '1',
    '--translate-x': '0px',
    '--translate-y': '0px',
    filter: motionBlur > 0 ? `blur(${motionBlur}px)` : undefined,
    willChange: 'transform, filter',
  } as React.CSSProperties;

  // Revealed state (on Page 2): 100% Fidelity 3D Holographic Foil & Glitter Shader
  return (
    <div
      ref={cardRef}
      className={cn(
        'pokemon-holo-card interactive masked',
        primaryType,
        isInteracting ? 'interacting active' : '',
        'aspect-[0.718] w-full max-w-[340px] select-none cursor-pointer',
        className,
      )}
      data-rarity={rarity}
      data-subtypes={subtypes}
      data-supertype={supertype}
      data-number={number}
      data-set={set}
      style={dynamicStyles}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="card__translater">
        <div className="card__rotator">
          {/* Card Back */}
          <img
            className="card__back"
            src={POKEMON_CARD_BACK}
            alt="The back of a Pokemon Card"
            loading="lazy"
            width="660"
            height="921"
          />

          {/* Card Front with Holographic Shine & Glare Shaders */}
          <div className="card__front">
            {imgSrc && (
              <img
                src={imgSrc}
                alt={`${card.brand} Pokemon Card`}
                loading="eager"
                width="660"
                height="921"
                onError={() => {
                  if (imgSrc.includes('_hires.png')) {
                    setImgSrc(imgSrc.replace('_hires.png', '.png'));
                  }
                }}
              />
            )}
            <div className="card__shine" />
            <div className="card__glare" />
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
