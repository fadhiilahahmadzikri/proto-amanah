'use client';

import gsap from 'gsap';
import { X } from 'lucide-react';
import React from 'react';
import { BottomNotchedDock } from '@/components/atoms/BottomNotchedDock';
import { type EjectionStage } from '@/components/atoms/QueueDockCardItem';
import {
  ConfettiCanvas,
  type ConfettiCanvasHandle,
} from '@/components/atoms/ConfettiCanvas';
import { QueueActivationOverlay } from '@/components/molecules/QueueActivationOverlay';
import { QueueDock3DCarousel } from '@/components/molecules/QueueDock3DCarousel';
import { cn } from '@/lib/utils';
import {
  DEFAULT_DOCK_CARDS,
  type QueueDockCardData,
} from '@/types/queue-dock.types';

import { usePokemonCards } from '@/hooks/use-pokemon-cards';
import { runGenieAnimation } from '@/lib/genie-renderer';

export function QueueDockScreen(props: {
  cards?: QueueDockCardData[];
  theme?: 'dark' | 'light';
  onBack?: () => void;
  onSelectCard?: (card: QueueDockCardData) => void;
  className?: string;
}) {
  const pokemonData = usePokemonCards();
  const cards = props.cards ?? (pokemonData.cards.length > 0 ? pokemonData.cards : DEFAULT_DOCK_CARDS);
  const [currentIndex, setCurrentIndex] = React.useState(1);
  const [activationStage, setActivationStage] = React.useState<'idle' | 'plunging' | 'activating'>('idle');
  const [ejectionStage, setEjectionStage] = React.useState<EjectionStage>('idle');
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [isGenieSettled, setIsGenieSettled] = React.useState(false);
  const [dragProgress, setDragProgress] = React.useState(0);
  const [isLongPressing, setIsLongPressing] = React.useState(false);

  const confettiRef = React.useRef<ConfettiCanvasHandle>(null);
  const textRef = React.useRef<HTMLHeadingElement>(null);
  const heroCardRef = React.useRef<HTMLDivElement>(null);
  const screenContainerRef = React.useRef<HTMLDivElement>(null);

  const [displayedHeadline, setDisplayedHeadline] = React.useState('Pilih kartu misteri Pokémon');
  const prevHeadlineRef = React.useRef('Pilih kartu misteri Pokémon');

  const isPlungingOrActive = activationStage === 'plunging' || activationStage === 'activating';
  const isMorphingActive = activationStage === 'activating';

  const currentCard = cards[currentIndex];
  const isNearSlot = dragProgress >= 0.75 && !isPlungingOrActive;

  let headlineText = 'Pilih kartu misteri Pokémon';
  if (isMorphingActive) {
    headlineText = 'Membuka misteri Pokémon...';
  } else if (isNearSlot) {
    headlineText = 'Lepas untuk reveal Pokémon!';
  }

  // Native GSAP Text Blurry Morph Transformation
  React.useEffect(() => {
    if (prevHeadlineRef.current === headlineText) return;
    prevHeadlineRef.current = headlineText;

    if (!textRef.current) {
      setDisplayedHeadline(headlineText);
      return;
    }

    gsap.killTweensOf(textRef.current);
    gsap.to(textRef.current, {
      filter: 'blur(8px)',
      opacity: 0,
      scale: 0.94,
      duration: 0.18,
      ease: 'power2.in',
      onComplete: () => {
        setDisplayedHeadline(headlineText);
        gsap.fromTo(
          textRef.current,
          { filter: 'blur(8px)', opacity: 0, scale: 1.06 },
          {
            filter: 'blur(0px)',
            opacity: 1,
            scale: 1,
            duration: 0.32,
            ease: 'power2.out',
          },
        );
      },
    });
  }, [headlineText]);

  const handleActivate = React.useCallback(() => {
    // Stage 1 (t = 0ms): Card plunges completely down into the slot mouth off-screen
    setActivationStage('plunging');

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(20);
      } catch {}
    }

    // Stage 2 (t = 600ms): Strictly AFTER card is 100% swallowed and invisible:
    // Header morphs & glides down to center, sun orange progress bar appears & fills, dock slides down!
    setTimeout(() => {
      setActivationStage('activating');
    }, 600);

    // Stage 3 (t = 2800ms): Eject the SAME card from the bottom slot mouth using the macOS Genie wave!
    setTimeout(async () => {
      setShowSuccess(true);
      setIsGenieSettled(false);

      const getTargetRect = (): DOMRect => {
        const screenRect = screenContainerRef.current?.getBoundingClientRect();
        const defaultX = screenRect ? screenRect.left + screenRect.width / 2 : window.innerWidth / 2;
        const defaultY = screenRect ? screenRect.top + screenRect.height - 50 : window.innerHeight - 50;
        return new DOMRect(defaultX - 20, defaultY - 10, 40, 20);
      };

      if (heroCardRef.current) {
        try {
          await runGenieAnimation('open', heroCardRef.current, getTargetRect, 'bottom');
        } catch {}
      }

      setIsGenieSettled(true);
      confettiRef.current?.fire();
    }, 2800);
  }, []);

  const handleCloseOverlay = React.useCallback(async () => {
    setIsGenieSettled(false);

    // Step 1: Genie minimize suction of the hero card back down into the slot mouth
    const getTargetRect = (): DOMRect => {
      const screenRect = screenContainerRef.current?.getBoundingClientRect();
      const defaultX = screenRect ? screenRect.left + screenRect.width / 2 : window.innerWidth / 2;
      const defaultY = screenRect ? screenRect.top + screenRect.height - 50 : window.innerHeight - 50;
      return new DOMRect(defaultX - 20, defaultY - 10, 40, 20);
    };

    if (heroCardRef.current) {
      try {
        await runGenieAnimation('minimize', heroCardRef.current, getTargetRect, 'bottom');
      } catch {}
    }

    // Step 2 (t = 0ms): Overlay closes, bottom dock slot slides up into view (takes 500ms).
    setShowSuccess(false);
    setActivationStage('idle');
    setEjectionStage('dock_appear');
    setDragProgress(0);

    // Step 3 (t = 550ms): Strictly AFTER the dock slot is 100% rendered and docked,
    // the card ascends from beneath the screen into the slot mouth (ATM peek)!
    setTimeout(() => {
      setEjectionStage('atm_peek');
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(14);
        } catch {}
      }
    }, 550);

    // Step 4 (t = 1250ms): After presenting the head, the card glides all the way up into the strader frame!
    setTimeout(() => {
      setEjectionStage('full_eject');
    }, 1250);

    // Step 5 (t = 1900ms): Card locks firmly into the frame with strader snap glow & haptic click
    setTimeout(() => {
      setEjectionStage('idle');
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([15, 25]);
        } catch {}
      }
    }, 1900);
  }, []);

  return (
    <div
      ref={screenContainerRef}
      onPointerDown={(e) => {
        const targetEl = e.target as HTMLElement;
        console.log('[SCREEN ROOT] PointerDown at', e.clientX, e.clientY, '| Target:', targetEl?.tagName, targetEl?.className);
      }}
      className={cn(
        'relative flex h-full w-full flex-col overflow-hidden bg-[#0f0f0f] font-sans text-white select-none',
        props.className,
      )}
    >
      {/* 1. Screen Header */}
      <header className="absolute top-0 inset-x-0 z-30 flex items-center justify-between p-5 sm:p-6 pointer-events-none">
        <button
          type="button"
          aria-label="Kembali"
          className="p-1.5 -ml-1 text-white hover:opacity-80 active:scale-90 transition-all cursor-pointer pointer-events-auto"
          onClick={props.onBack}
        >
          <X size={22} strokeWidth={2.5} />
        </button>
        <span className="text-xs font-semibold tracking-wide text-gray-300 pointer-events-auto">S&K Antrean</span>
      </header>

      {/* 2. Title & Greeting with 100% Pure Morphing to Center (Starts ONLY after card is swallowed) */}
      <div
        className={cn(
          'absolute top-12 sm:top-14 inset-x-0 z-20 flex flex-col items-center px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none',
          isMorphingActive
            ? 'translate-y-48 sm:translate-y-56 scale-105'
            : 'translate-y-0 scale-100',
          showSuccess ? 'opacity-0' : 'opacity-100',
        )}
      >
        {/* Morphing Gift Icon (Solid Yellow on activating or near slot, no glow) */}
        <div
          className={cn(
            'mb-3 transition-all duration-300',
            isMorphingActive || isNearSlot ? 'text-yellow-400 scale-105' : 'text-red-500 scale-100',
          )}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20 12v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9H3a1 1 0 0 1-.7-1.7l1.38-1.55A3.981 3.981 0 0 1 6.64 6H9.5a3.5 3.5 0 1 1 5 0h2.86c1.13 0 2.19.48 2.96 1.3l1.38 1.55A1 1 0 0 1 21 12h-1zm-9 8v-8H6v8h5zm2 0h5v-8h-5v8zm0-10h4.4l-1.07-1.2a2 2 0 0 0-1.49-.65H13v1.85zm-2 0V8.15H8.16c-.55 0-1.08.23-1.49.65L5.6 10H11zM9.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
          </svg>
        </div>

        {/* Morphing Headline Text with GSAP Blurry Morph (Solid yellow, max 2 words per line wrap) */}
        <h1
          ref={textRef}
          className={cn(
            'text-center text-xl sm:text-2xl font-bold leading-snug select-none will-change-[filter,transform,opacity]',
            isMorphingActive
              ? 'text-yellow-400 max-w-[220px]'
              : isNearSlot
                ? 'text-yellow-400 max-w-[190px]'
                : 'text-white max-w-[170px]',
          )}
        >
          {displayedHeadline}
        </h1>

        {/* Morphing Sun Orange Gradient Progress Bar */}
        <div
          className={cn(
            'mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-white/15 p-[0.5px] transition-opacity duration-500',
            isMorphingActive ? 'opacity-100' : 'opacity-0 pointer-events-none',
          )}
        >
          <div
            className={cn(
              'h-full rounded-full bg-gradient-to-r from-[#ff9900] via-[#ea580c] to-[#f59e0b] shadow-[0_0_8px_rgba(234,88,12,0.6)]',
              isMorphingActive ? 'w-full transition-all duration-[2400ms] ease-out' : 'w-0 transition-none',
            )}
          />
        </div>
      </div>

      {/* 3. 3D Cylindrical Carousel Molecule */}
      <QueueDock3DCarousel
        cards={cards}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
        onActivate={handleActivate}
        onDragProgress={setDragProgress}
        onLongPressChange={setIsLongPressing}
        isActivating={isPlungingOrActive}
        ejectionStage={ejectionStage}
        showSuccess={showSuccess}
      />

      {/* 4. Notched Clip-Path Bottom Floor Mask with Radiant Slot Light Emitter */}
      <BottomNotchedDock
        isActivating={isMorphingActive}
        dragProgress={dragProgress}
        isLongPressing={isLongPressing}
        label="Tarik kartu ke bawah untuk reveal"
      />

      {/* 5. Activation & Success Overlay */}
      <QueueActivationOverlay
        isActivating={isMorphingActive}
        showSuccess={showSuccess}
        isGenieSettled={isGenieSettled}
        activeCard={currentCard}
        cardRef={heroCardRef}
        onClose={handleCloseOverlay}
        onActionClick={() => {
          if (currentCard) {
            props.onSelectCard?.(currentCard);
          }
          props.onBack?.();
        }}
      />

      {/* 6. HTML5 Canvas Celebration Particles */}
      <ConfettiCanvas ref={confettiRef} />
    </div>
  );
}
