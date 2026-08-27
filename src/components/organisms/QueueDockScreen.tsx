'use client';

import gsap from 'gsap';
import { Info, X } from 'lucide-react';
import React from 'react';
import { BottomNotchedDock } from '@/components/atoms/BottomNotchedDock';
import { type EjectionStage } from '@/components/atoms/QueueDockCardItem';
import {
  ConfettiCanvas,
  type ConfettiCanvasHandle,
} from '@/components/atoms/ConfettiCanvas';
import { PokemonCollectionGridScreen } from '@/components/organisms/PokemonCollectionGridScreen';
import { ParamedicToolbox3DSvg } from '@/components/atoms/ParamedicToolbox3DSvg';
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
  const [dotCount, setDotCount] = React.useState(0);

  const [showInfoModal, setShowInfoModal] = React.useState(false);
  const infoDrawerRef = React.useRef<HTMLDivElement>(null);
  const infoContentRef = React.useRef<HTMLDivElement>(null);
  const infoStartYRef = React.useRef(0);
  const infoCurrentDragYRef = React.useRef(0);
  const infoIsDraggingRef = React.useRef(false);
  const infoIsClosingRef = React.useRef(false);

  const confettiRef = React.useRef<ConfettiCanvasHandle>(null);
  const textRef = React.useRef<HTMLHeadingElement>(null);
  const heroCardRef = React.useRef<HTMLDivElement>(null);
  const screenContainerRef = React.useRef<HTMLDivElement>(null);

  // Info Drawer Entrance Animation (GSAP)
  React.useEffect(() => {
    if (showInfoModal && infoDrawerRef.current) {
      gsap.fromTo(
        infoDrawerRef.current,
        { y: '100%', opacity: 0.95 },
        { y: '0%', opacity: 1, duration: 0.32, ease: 'power3.out' },
      );
    }
  }, [showInfoModal]);

  const triggerCloseInfoDrawer = React.useCallback(() => {
    if (infoIsClosingRef.current || !infoDrawerRef.current) {
      setShowInfoModal(false);
      return;
    }
    infoIsClosingRef.current = true;

    gsap.to(infoDrawerRef.current, {
      y: '100%',
      opacity: 0.9,
      duration: 0.28,
      ease: 'power3.in',
      onComplete: () => {
        setShowInfoModal(false);
        infoIsClosingRef.current = false;
      },
    });
  }, []);

  const handleInfoPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target instanceof HTMLElement ? e.target : null;
    if (target?.closest('input, textarea, select, button, a')) {
      return;
    }
    infoStartYRef.current = e.clientY;
    infoCurrentDragYRef.current = 0;
    if (!infoContentRef.current || infoContentRef.current.scrollTop <= 0) {
      infoIsDraggingRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handleInfoPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!infoIsDraggingRef.current || !infoDrawerRef.current) return;
    const deltaY = e.clientY - infoStartYRef.current;
    if (deltaY > 0) {
      infoCurrentDragYRef.current = deltaY;
      gsap.set(infoDrawerRef.current, { y: deltaY });
    }
  };

  const handleInfoPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!infoIsDraggingRef.current || !infoDrawerRef.current) return;
    infoIsDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
    if (infoCurrentDragYRef.current > 70) {
      triggerCloseInfoDrawer();
    } else {
      gsap.to(infoDrawerRef.current, { y: 0, duration: 0.35, ease: 'elastic.out(1, 0.75)' });
    }
  };

  const [displayedHeadline, setDisplayedHeadline] = React.useState('Pilih Antrean Pasien');
  const prevHeadlineRef = React.useRef('Pilih Antrean Pasien');
  const isDark = props.theme !== 'light';

  const isPlungingOrActive = activationStage === 'plunging' || activationStage === 'activating';
  const isMorphingActive = activationStage === 'activating';

  const currentCard = cards[currentIndex];
  const isNearSlot = dragProgress >= 0.75 && !isPlungingOrActive;

  let headlineText = 'Pilih Antrean Pasien';
  if (isMorphingActive) {
    headlineText = 'Memproses antrean';
  } else if (isNearSlot) {
    headlineText = 'Lepaskan untuk proses antrean';
  }

  // Typewriter animation for exactly 3 dots during active processing
  React.useEffect(() => {
    if (!isMorphingActive) {
      setDotCount(0);
      return;
    }
    setDotCount(1);
    const timer = window.setInterval(() => {
      setDotCount((prev) => (prev >= 3 ? 1 : prev + 1));
    }, 320);
    return () => window.clearInterval(timer);
  }, [isMorphingActive]);

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

          if (!isMounted) return;

          // 2. Card has fully landed & settled at center -> trigger 3D spin reveal
          setIsGenieSettled(true);
        } catch {
          if (isMounted) setIsGenieSettled(true);
        }
      } else {
        setIsGenieSettled(true);
      }
    };

    void runOpenSequence();

    return () => {
      isMounted = false;
    };
  }, [showSuccess]);

  const handleActivate = () => {
    if (isPlungingOrActive) return;

    // 1. Trigger ATM Card Plunge
    setActivationStage('plunging');
    setEjectionStage('atm_plunge');

    // 2. Transition to Center Morphing
    window.setTimeout(() => {
      setActivationStage('activating');
      setEjectionStage('idle');
    }, 450);

    // 3. Complete Activation & Trigger Genie Open
    window.setTimeout(() => {
      setShowSuccess(true);
      setActivationStage('idle');
      if (currentCard) {
        props.onSelectCard?.(currentCard);
      }
    }, 1800);
  };

  const handleCollectCard = (card: QueueDockCardData) => {
    setCollectedCards((prev) => [card, ...prev]);
    setShowSuccess(false);
    setIsGenieSettled(false);
    resetToFreshDock();
    setViewMode('collection');
  };

  const handleCloseOverlay = () => {
    setShowSuccess(false);
    setIsGenieSettled(false);
    resetToFreshDock();
  };

  // Full state reset to guarantee fresh dock state
  const resetToFreshDock = () => {
    setDragProgress(0);
    setIsLongPressing(false);
    setActivationStage('idle');
    setEjectionStage('idle');
    setShowSuccess(false);
    setIsGenieSettled(false);
  };

  if (viewMode === 'collection') {
    return (
      <PokemonCollectionGridScreen
        collectedCards={collectedCards}
        theme={props.theme}
        onRedraw={() => {
          resetToFreshDock();
          setViewMode('dock');
        }}
        onBack={() => {
          resetToFreshDock();
          setViewMode('dock');
        }}
        className={props.className}
      />
    );
  }

  return (
    <div
      ref={screenContainerRef}
      className={cn(
        'relative flex h-full w-full flex-col overflow-hidden font-sans select-none transition-colors duration-300',
        isDark ? 'bg-[#0a0e1a] text-white' : 'bg-[#f4f7ff] text-slate-900',
        props.className,
      )}
    >
      {/* 1. Screen Header */}
      <header className="absolute top-0 inset-x-0 z-30 flex items-center justify-between p-5 sm:p-6 pointer-events-none">
        <button
          type="button"
          aria-label="Kembali"
          className={cn(
            'p-1.5 -ml-1 hover:opacity-80 active:scale-90 transition-all cursor-pointer pointer-events-auto rounded-full',
            isDark ? 'text-white hover:bg-white/10' : 'text-slate-800 hover:bg-slate-100',
          )}
          onClick={props.onBack}
        >
          <X size={22} strokeWidth={2.5} />
        </button>

        {/* Info Tip Button */}
        <button
          type="button"
          aria-label="Informasi Sistem Antrean"
          onClick={() => setShowInfoModal(true)}
          className={cn(
            'flex items-center justify-center w-7 h-7 rounded-full transition-all cursor-pointer active:scale-90 pointer-events-auto shadow-xs',
            isDark
              ? 'bg-white/10 text-neutral-300 hover:text-white hover:bg-white/20'
              : 'bg-slate-200/70 text-slate-600 hover:text-slate-950 hover:bg-slate-200',
          )}
        >
          <Info className="w-4 h-4 stroke-[2.3]" />
        </button>
      </header>

      {/* 2. Title & Greeting with Morphing to Center */}
      <div
        className={cn(
          'absolute top-9 sm:top-11 inset-x-0 z-20 flex flex-col items-center px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none',
          isMorphingActive
            ? 'translate-y-48 sm:translate-y-56 scale-105'
            : 'translate-y-0 scale-100',
          showSuccess ? 'opacity-0' : 'opacity-100',
        )}
      >
        {/* Animated 3D Paramedic Toolbox */}
        <div
          className={cn(
            'mb-2 flex items-center justify-center transition-all duration-500',
            isMorphingActive || isNearSlot ? 'scale-110' : 'scale-100',
          )}
        >
          <ParamedicToolbox3DSvg
            isOpen={isMorphingActive || isNearSlot}
            size={76}
            className="transition-transform duration-500"
          />
        </div>

        {/* Morphing Headline Text with GSAP Blurry Morph & 2-Line Typewriter Dots */}
        <h1
          ref={textRef}
          className={cn(
            'text-center text-xl sm:text-2xl font-extrabold tracking-tight leading-snug select-none will-change-[filter,transform,opacity]',
            isMorphingActive
              ? 'text-[#0a44ff] dark:text-[#38bdf8] max-w-[240px]'
              : isNearSlot
                ? 'text-[#0a44ff] dark:text-[#38bdf8] max-w-[220px]'
                : isDark ? 'text-white max-w-[200px]' : 'text-slate-900 max-w-[200px]',
          )}
        >
          {isMorphingActive ? (
            <span className="flex flex-col items-center leading-tight">
              <span>Memproses</span>
              <span className="inline-flex items-center justify-center">
                antrean
                <span className="inline-block w-5 text-left font-mono tracking-widest text-inherit pl-0.5 select-none">
                  {'.'.repeat(dotCount)}
                </span>
              </span>
            </span>
          ) : (
            displayedHeadline
          )}
        </h1>
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
        theme={props.theme}
      />

      {/* 4. Notched Clip-Path Bottom Floor Mask with Radiant Slot Light Emitter */}
      <BottomNotchedDock
        isActivating={isMorphingActive}
        dragProgress={dragProgress}
        isLongPressing={isLongPressing}
        theme={props.theme}
        label="Tarik antrean ke bawah untuk proses"
      />

      {/* 5. Activation & Success Overlay */}
      <QueueActivationOverlay
        isActivating={isMorphingActive}
        showSuccess={showSuccess}
        isGenieSettled={isGenieSettled}
        activeCard={currentCard}
        cardRef={heroCardRef}
        theme={props.theme}
        onClose={handleCloseOverlay}
        onRedraw={() => {
          handleCloseOverlay();
        }}
        onRevealApex={() => confettiRef.current?.fire()}
        onActionClick={() => {
          if (currentCard) {
            handleCollectCard(currentCard);
          }
        }}
      />

      {/* 6. HTML5 Canvas Celebration Particles */}
      <ConfettiCanvas ref={confettiRef} />

      {/* 7. Panduan & Info Sistem Antrean Master Drawer */}
      {showInfoModal && (
        <>
          <div
            onClick={triggerCloseInfoDrawer}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in pointer-events-auto"
          />

          <div
            ref={infoDrawerRef}
            onPointerDown={handleInfoPointerDown}
            onPointerMove={handleInfoPointerMove}
            onPointerUp={handleInfoPointerUp}
            onPointerCancel={handleInfoPointerUp}
            className={cn(
              'absolute inset-x-0 bottom-0 z-50 flex min-h-[380px] max-h-[88%] w-full flex-col justify-between overflow-hidden rounded-t-[32px] sm:rounded-t-[36px] shadow-[0_-12px_45px_rgba(0,0,0,0.25)] border-t will-change-transform select-text touch-pan-y backdrop-blur-2xl pointer-events-auto',
              isDark
                ? 'bg-[#0a0e1a] border-white/10 text-white shadow-black/80'
                : 'bg-white border-neutral-100 text-slate-900 shadow-[0_-12px_45px_rgba(0,0,0,0.25)]',
            )}
          >
            <div>
              {/* Interactive Drag Handle */}
              <div
                role="button"
                tabIndex={0}
                aria-label="Tarik ke bawah untuk menutup"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerCloseInfoDrawer();
                }}
                className="flex w-full cursor-grab active:cursor-grabbing flex-col items-center justify-center pt-3 pb-1 shrink-0 touch-none select-none hover:bg-neutral-50/50 dark:hover:bg-white/5 transition-colors"
              >
                <div className={cn('h-1 w-9 rounded-full transition-colors duration-150', isDark ? 'bg-white/20' : 'bg-slate-300')} />
              </div>

              {/* Master Header with thin hairline border */}
              <div className={cn('relative z-20 flex items-center justify-between px-6 pt-1 pb-2.5 shrink-0 border-b', isDark ? 'border-white/5' : 'border-slate-100')}>
                <h3 className={cn('text-sm font-semibold tracking-tight', isDark ? 'text-white' : 'text-slate-900')}>
                  Panduan Alur Sistem Antrean
                </h3>
                <button
                  type="button"
                  aria-label="Tutup Panduan"
                  onClick={triggerCloseInfoDrawer}
                  className={cn(
                    'p-1.5 -mr-2 rounded-full transition-colors cursor-pointer flex items-center justify-center shrink-0',
                    isDark ? 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:text-slate-900',
                  )}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Detail Content Body */}
              <div ref={infoContentRef} className="flex w-full flex-col px-6 pt-3 pb-4 overflow-y-auto no-scrollbar select-text gap-4">
                <p className={cn('text-xs leading-relaxed', isDark ? 'text-neutral-300' : 'text-slate-600')}>
                  Sistem rel antrean 3D interaktif Klinik Amanah mempermudah dokter &amp; staf dalam memproses dan memanggil pasien:
                </p>

                {/* Step List Divide-y */}
                <div
                  className={cn(
                    'divide-y text-xs',
                    isDark ? 'divide-white/5 text-neutral-200' : 'divide-slate-100 text-slate-900',
                  )}
                >
                  <div className="flex items-start justify-between py-3 gap-3">
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                      <span className={cn('font-bold', isDark ? 'text-white' : 'text-slate-950')}>1. Geser Rel 3D</span>
                    </div>
                    <span className={cn('font-medium text-right text-[11px]', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                      Geser kartu ke kiri/kanan untuk memilih nomor antrean pasien
                    </span>
                  </div>

                  <div className="flex items-start justify-between py-3 gap-3">
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0" />
                      <span className={cn('font-bold', isDark ? 'text-white' : 'text-slate-950')}>2. Tarik ke Bawah</span>
                    </div>
                    <span className={cn('font-medium text-right text-[11px]', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                      Tarik kartu ke slot bawah hingga kotak paramedis terbuka untuk memproses
                    </span>
                  </div>

                  <div className="flex items-start justify-between py-3 gap-3">
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="h-2 w-2 rounded-full bg-teal-400 shrink-0" />
                      <span className={cn('font-bold', isDark ? 'text-white' : 'text-slate-950')}>3. Putar &amp; Cek Kartu</span>
                    </div>
                    <span className={cn('font-medium text-right text-[11px]', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                      Kartu berputar 3D menampilkan nama pasien, keluhan, dan poli tujuan
                    </span>
                  </div>

                  <div className="flex items-start justify-between py-3 gap-3">
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="h-2 w-2 rounded-full bg-indigo-400 shrink-0" />
                      <span className={cn('font-bold', isDark ? 'text-white' : 'text-slate-950')}>4. Panggil Pasien</span>
                    </div>
                    <span className={cn('font-medium text-right text-[11px]', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                      Tekan &apos;Panggil Pasien&apos; untuk aktivasi atau simpan ke riwayat antrean
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button: Tutup */}
            <div className="px-6 pb-28 sm:pb-32 pt-2 shrink-0">
              <button
                type="button"
                onClick={triggerCloseInfoDrawer}
                className={cn(
                  'w-full py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-98',
                  isDark
                    ? 'border-white/10 text-neutral-200 hover:bg-white/10 bg-white/5'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs',
                )}
              >
                Mengerti
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
