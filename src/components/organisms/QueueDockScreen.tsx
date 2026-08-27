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
import { GiftBox3DSvg } from '@/components/atoms/GiftBox3DSvg';
import { PokemonCollectionGridScreen } from '@/components/organisms/PokemonCollectionGridScreen';
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
  const [viewMode, setViewMode] = React.useState<'dock' | 'collection'>('dock');
  const [collectedCards, setCollectedCards] = React.useState<QueueDockCardData[]>([]);
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

  const [displayedHeadline, setDisplayedHeadline] = React.useState('Choose your Pokémon');
  const prevHeadlineRef = React.useRef('Choose your Pokémon');

  const isPlungingOrActive = activationStage === 'plunging' || activationStage === 'activating';
  const isMorphingActive = activationStage === 'activating';

  const currentCard = cards[currentIndex];
  const isNearSlot = dragProgress >= 0.75 && !isPlungingOrActive;

  let headlineText = 'Choose your Pokémon';
  if (isMorphingActive) {
    headlineText = 'Opening mystery Pokémon...';
  } else if (isNearSlot) {
    headlineText = 'Release to reveal';
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

  // Automated Genie Open Emergence Sequence: Genie Emergence -> Settle -> Blur -> 3D Flip Rotation
  React.useEffect(() => {
    if (!showSuccess) return;

    let isMounted = true;
    const runOpenSequence = async () => {
      // Ensure DOM has mounted and laid out heroCardRef
      await new Promise((r) => requestAnimationFrame(r));

      if (!isMounted) return;

      const getTargetRect = (): DOMRect => {
        const screenRect = screenContainerRef.current?.getBoundingClientRect();
        const defaultX = screenRect ? screenRect.left + screenRect.width / 2 : window.innerWidth / 2;
        const defaultY = screenRect ? screenRect.top + screenRect.height - 50 : window.innerHeight - 50;
        return new DOMRect(defaultX - 20, defaultY - 10, 40, 20);
      };

      if (heroCardRef.current) {
        try {
          // 1. Genie effect emerges with card in 100% card-back mode
          await runGenieAnimation('open', heroCardRef.current, getTargetRect, 'bottom');
        } catch (err) {
          console.warn('Genie open error:', err);
        }
      }

      if (isMounted) {
        // 2. Genie settles -> triggers blur -> 3D flip rotation -> confetti apex!
        setIsGenieSettled(true);
      }
    };

    runOpenSequence();

    return () => {
      isMounted = false;
    };
  }, [showSuccess]);

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

    // Stage 3 (t = 2800ms): Trigger showSuccess -> mounts overlay and starts Genie emergence
    setTimeout(() => {
      setIsGenieSettled(false);
      setShowSuccess(true);
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

  const handleCollectCard = (card: QueueDockCardData) => {
    setCollectedCards((prev) => {
      if (prev.some((c) => c.id === card.id)) return prev;
      return [card, ...prev];
    });
    setShowSuccess(false);
    setIsGenieSettled(false);
    setActivationStage('idle');
    setViewMode('collection');
    props.onSelectCard?.(card);
  };

  if (viewMode === 'collection') {
    return (
      <PokemonCollectionGridScreen
        collectedCards={collectedCards}
        onRedraw={() => {
          setViewMode('dock');
          setActivationStage('idle');
          setShowSuccess(false);
          setIsGenieSettled(false);
        }}
        onBack={() => {
          props.onBack?.();
        }}
        theme={props.theme}
        className={props.className}
      />
    );
  }

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
          aria-label="Back"
          className="p-1.5 -ml-1 text-white hover:opacity-80 active:scale-90 transition-all cursor-pointer pointer-events-auto"
          onClick={props.onBack}
        >
          <X size={22} strokeWidth={2.5} />
        </button>
        <span className="text-xs font-semibold tracking-wide text-gray-300 pointer-events-auto">Queue Rules</span>
      </header>

      {/* 2. Title & Greeting with 100% Pure Morphing to Center (Starts ONLY after card is swallowed) */}
      <div
        className={cn(
          'absolute top-9 sm:top-11 inset-x-0 z-20 flex flex-col items-center px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none',
          isMorphingActive
            ? 'translate-y-48 sm:translate-y-56 scale-105'
            : 'translate-y-0 scale-100',
          showSuccess ? 'opacity-0' : 'opacity-100',
        )}
      >
        {/* 3D Gift Box Vector Component */}
        <div
          className={cn(
            'mb-1 transition-all duration-300',
            isMorphingActive || isNearSlot ? 'scale-110 drop-shadow-[0_0_20px_rgba(252,224,104,0.5)]' : 'scale-100 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]',
          )}
        >
          <GiftBox3DSvg size={88} isOpen={isMorphingActive} />
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
        label="Pull card down to reveal"
      />

      {/* 5. Activation & Success Overlay */}
      <QueueActivationOverlay
        isActivating={isMorphingActive}
        showSuccess={showSuccess}
        isGenieSettled={isGenieSettled}
        activeCard={currentCard}
        cardRef={heroCardRef}
        onClose={handleCloseOverlay}
        onRevealApex={() => confettiRef.current?.fire()}
        onActionClick={() => {
          if (currentCard) {
            handleCollectCard(currentCard);
          }
        }}
      />

      {/* 6. HTML5 Canvas Celebration Particles */}
      <ConfettiCanvas ref={confettiRef} />
    </div>
  );
}
