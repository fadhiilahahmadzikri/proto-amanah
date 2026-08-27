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
  badgeText?: string;
  className?: string;
  onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
  children?: React.ReactNode;
}) {
  const { card, isRevealed = false, className, onPointerDown, children } = props;
  const [imgSrc, setImgSrc] = React.useState<string | undefined>(card.imageUrl);
  const [isInteracting, setIsInteracting] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const rafRef = React.useRef<number | null>(null);

  // Holographic shader spring / pointer state
  const [pointer, setPointer] = React.useState({
    x: 50,
    y: 50,
    rx: 0,
    ry: 0,
    bgX: 50,
    bgY: 50,
    opacity: 0,
  });

  React.useEffect(() => {
    setImgSrc(card.imageUrl);
  }, [card.imageUrl]);

  // Initial showcase sparkle when revealed
  React.useEffect(() => {
    if (!isRevealed) return;

    let step = 0;
    const interval = setInterval(() => {
      step += 0.08;
      const rx = Math.sin(step) * 14;
      const ry = Math.cos(step) * 14;
      const px = 50 + Math.sin(step) * 35;
      const py = 50 + Math.cos(step) * 35;

      setPointer({
        x: round(px),
        y: round(py),
        rx: round(rx),
        ry: round(ry),
        bgX: adjust(px, 0, 100, 37, 63),
        bgY: adjust(py, 0, 100, 33, 67),
        opacity: 0.85,
      });

      if (step >= Math.PI * 2.2) {
        clearInterval(interval);
        // Smooth return to neutral rest
        setTimeout(() => {
          setPointer({ x: 50, y: 50, rx: 0, ry: 0, bgX: 50, bgY: 50, opacity: 0 });
        }, 300);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [isRevealed]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
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
    setPointer({
      x: 50,
      y: 50,
      rx: 0,
      ry: 0,
      bgX: 50,
      bgY: 50,
      opacity: 0,
    });
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
                  } else if (card.spriteUrl) {
                    setImgSrc(card.spriteUrl);
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
