'use client';

import { gsap } from 'gsap';
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  PhoneCall,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import React from 'react';
import {
  Medical3DIcon,
  type Medical3DIconName,
  Medical3DSVGDefs,
} from '@/components/atoms/Medical3DIcons';
import { cn } from '@/lib/utils';

// ==========================================
// 1. CAROUSEL GEOMETRY & MATH (1:1 with mcp-example)
// ==========================================
export type DeckSlotProperties = {
  filter: string;
  opacity: number;
  pointerEvents: 'auto' | 'none';
  scale: number;
  xPercent: number;
  z: number;
  zIndex: number;
};

export const INITIAL_SLIDE_INDEX = 0;
export const MOUSE_SWIPE_THRESHOLD_PX = 35;
export const TOUCH_SWIPE_THRESHOLD_PX = 30;
export const AUTOPLAY_DELAY_MS = 3800;

export function getWrappedIndex(index: number, totalItems: number): number {
  if (totalItems <= 0) return 0;
  return ((index % totalItems) + totalItems) % totalItems;
}

export function getOffset(index: number, currentIndex: number, totalItems: number): number {
  if (totalItems <= 0) return 0;
  let offset = index - currentIndex;
  while (offset < -Math.floor(totalItems / 2)) {
    offset += totalItems;
  }
  while (offset > Math.floor((totalItems - 1) / 2)) {
    offset -= totalItems;
  }
  return offset;
}

export function getDeckSlot(index: number, currentIndex: number, totalItems: number): DeckSlotProperties {
  const offset = getOffset(index, currentIndex, totalItems);

  if (offset === 0) {
    return {
      filter: 'blur(0px) brightness(1)',
      opacity: 1,
      pointerEvents: 'auto',
      scale: 1,
      xPercent: 0,
      z: 0,
      zIndex: 30,
    };
  }

  if (offset === -1) {
    return {
      filter: 'blur(1.5px) brightness(0.85)',
      opacity: 0.5,
      pointerEvents: 'auto',
      scale: 0.88,
      xPercent: -64,
      z: -100,
      zIndex: 20,
    };
  }

  if (offset === 1) {
    return {
      filter: 'blur(1.5px) brightness(0.85)',
      opacity: 0.5,
      pointerEvents: 'auto',
      scale: 0.88,
      xPercent: 64,
      z: -100,
      zIndex: 20,
    };
  }

  if (offset < -1) {
    return {
      filter: 'blur(4px) brightness(0.4)',
      opacity: 0,
      pointerEvents: 'none',
      scale: 0.7,
      xPercent: -130,
      z: -220,
      zIndex: 10,
    };
  }

  return {
    filter: 'blur(4px) brightness(0.4)',
    opacity: 0,
    pointerEvents: 'none',
    scale: 0.7,
    xPercent: 130,
    z: -220,
    zIndex: 10,
  };
}

// ==========================================
// 2. SLIDES DATA MODEL WITH 3D SVG MEDICAL ICONS
// ==========================================
export interface ClinicSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaText: string;
  ctaIcon: React.ReactNode;
  iconName: Medical3DIconName;
}

const CLINIC_SLIDES: ClinicSlide[] = [
  {
    id: 'slide-1',
    eyebrow: 'Poli Anak',
    title: 'Konsultasi Spesialis Anak',
    description: 'Jadwalkan temu dokter spesialis anak responsif dan terpadu RS Amanah.',
    ctaText: 'Jadwalkan',
    ctaIcon: <Sparkles className="w-3.5 h-3.5 fill-current shrink-0" />,
    iconName: 'briefcase',
  },
  {
    id: 'slide-2',
    eyebrow: 'Imunisasi',
    title: 'Vaksinasi & Booster Anak',
    description: 'Paket imunisasi balita primer lengkap dengan sertifikat medis resmi.',
    ctaText: 'Lihat Paket',
    ctaIcon: <ShieldCheck className="w-3.5 h-3.5 shrink-0" />,
    iconName: 'syringe',
  },
  {
    id: 'slide-3',
    eyebrow: 'Tumbuh Kembang',
    title: 'Skrining Tumbuh Kembang',
    description: 'Evaluasi berkala nutrisi dan motorik buah hati bersama tenaga ahli.',
    ctaText: 'Reservasi',
    ctaIcon: <CalendarCheck className="w-3.5 h-3.5 shrink-0" />,
    iconName: 'dna',
  },
  {
    id: 'slide-4',
    eyebrow: 'Layanan 24 Jam',
    title: 'Instalasi Gawat Darurat',
    description: 'Kesiapan dokter jaga dan fasilitas darurat anak responsif 24 jam.',
    ctaText: 'Hubungi IGD',
    ctaIcon: <PhoneCall className="w-3.5 h-3.5 shrink-0" />,
    iconName: 'shield',
  },
];

// ==========================================
// 3. DECK CAROUSEL CARD (Heroic Corner 3D Icon & Clean Left Composition)
// ==========================================
const DeckCarouselCard = React.forwardRef<
  HTMLElement,
  {
    slide: ClinicSlide;
    index: number;
    totalSlides: number;
    isDark?: boolean;
    onClick: () => void;
    onActionClick: () => void;
  }
>(function DeckCarouselCard(props, ref) {
  return (
    <article
      ref={ref}
      onClick={props.onClick}
      className={cn(
        'card-item absolute inset-0 w-full rounded-[26px] sm:rounded-[30px] p-4 sm:p-4.5 px-4.5 sm:px-5 cursor-pointer select-none overflow-hidden border shadow-sm flex flex-col justify-between',
        '[backface-visibility:hidden] [transform-style:preserve-3d] [will-change:transform,opacity,filter] transition-colors duration-300',
        props.isDark
          ? 'bg-gradient-to-br from-[#0f1422] via-[#131b2e] to-[#16233d] border-white/10 text-white shadow-[0_12px_32px_rgba(0,0,0,0.4)]'
          : 'bg-gradient-to-br from-white via-[#f4f7ff] to-[#eaf0ff] border-blue-100/80 text-slate-900 shadow-[0_8px_28px_rgba(10,68,255,0.06)]',
      )}
      data-index={props.index}
    >
      {/* Subtle Organic Ribbon Waves */}
      <svg
        className={cn(
          'absolute inset-0 w-full h-full pointer-events-none',
          props.isDark ? 'opacity-10' : 'opacity-[0.06]',
        )}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 180"
        preserveAspectRatio="none"
      >
        <path
          d="M-20,60 C80,140 180,-20 300,90 C360,140 420,70 440,50"
          fill="none"
          stroke={props.isDark ? '#38BDF8' : '#0A44FF'}
          strokeWidth="28"
          strokeLinecap="round"
        />
        <path
          d="M-10,130 C120,40 220,180 340,80 C390,40 430,100 450,110"
          fill="none"
          stroke={props.isDark ? '#38BDF8' : '#0A44FF'}
          strokeWidth="14"
          strokeLinecap="round"
        />
      </svg>

      {/* Heroic 3D SVG Medical Icon - Rotated & Cropped in Bottom-Right Corner */}
      <div
        className={cn(
          'absolute -right-3 -bottom-4 sm:-right-4 sm:-bottom-5 w-32 h-32 sm:w-36 sm:h-36 pointer-events-none select-none z-0 rotate-[-12deg] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-16deg]',
        )}
      >
        <Medical3DIcon
          name={props.slide.iconName}
          isDark={props.isDark}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Top Left Information Content Hierarchy */}
      <div className="relative z-10 flex flex-col items-start gap-0.5 max-w-[60%] sm:max-w-[64%]">
        <h3
          className={cn(
            'card-title font-black text-[15px] sm:text-[16px] leading-tight tracking-tight line-clamp-1 truncate [will-change:transform,opacity,filter]',
            props.isDark ? 'text-white' : 'text-slate-900',
          )}
        >
          {props.slide.title}
        </h3>

        <p
          className={cn(
            'card-desc text-[11px] sm:text-[11.5px] font-medium leading-[1.38] line-clamp-2 mt-0.5 [will-change:transform,opacity,filter]',
            props.isDark ? 'text-neutral-300' : 'text-slate-600',
          )}
        >
          {props.slide.description}
        </p>
      </div>

      {/* Bottom Row: Theme-Respecting Crisp Gradient Action Button (Zero Trailing) */}
      <div className="relative z-10 flex items-center pt-1.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            props.onActionClick();
          }}
          className={cn(
            'btn-crisp-blue inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs cursor-pointer select-none shrink-0',
            props.isDark && 'btn-crisp-blue-dark',
          )}
        >
          {props.slide.ctaIcon}
          <span>{props.slide.ctaText}</span>
        </button>
      </div>
    </article>
  );
});

// ==========================================
// 5. CAROUSEL TOOLBAR (Matching mcp-example Paradigm)
// ==========================================
function DeckCarouselToolbar(props: {
  currentIndex: number;
  totalSlides: number;
  isDark?: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSelectSlide: (index: number) => void;
}) {
  return (
    <div className="flex items-center justify-between w-full px-1 pt-2">
      {/* Prev Button */}
      <button
        type="button"
        aria-label="Slide Sebelumnya"
        onClick={props.onPrevious}
        className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90 cursor-pointer border shadow-xs',
          props.isDark
            ? 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300'
            : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700',
        )}
      >
        <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
      </button>

      {/* Centered Pagination Indicator Dots */}
      <div
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-xs transition-colors',
          props.isDark
            ? 'bg-[#0f1422] border-white/10'
            : 'bg-white border-slate-200/90',
        )}
      >
        {Array.from({ length: props.totalSlides }).map((_, index) => {
          const isActive = index === props.currentIndex;
          return (
            <button
              key={index}
              type="button"
              aria-label={`Ke slide ${index + 1}`}
              onClick={() => props.onSelectSlide(index)}
              className="flex h-3 items-center justify-center focus:outline-none cursor-pointer"
            >
              <span
                className={cn(
                  'block h-1.5 rounded-full transition-all duration-300',
                  isActive
                    ? props.isDark
                      ? 'w-5 bg-[#38bdf8] shadow-[0_0_8px_rgba(56,189,248,0.4)]'
                      : 'w-5 bg-[#0d66e9] shadow-[0_1px_3px_rgba(13,102,233,0.3)]'
                    : props.isDark
                      ? 'w-1.5 bg-neutral-700 hover:bg-neutral-600'
                      : 'w-1.5 bg-slate-300 hover:bg-slate-400',
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        type="button"
        aria-label="Slide Berikutnya"
        onClick={props.onNext}
        className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90 cursor-pointer border shadow-xs',
          props.isDark
            ? 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300'
            : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700',
        )}
      >
        <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
      </button>
    </div>
  );
}

// ==========================================
// 6. MASTER CAROUSEL SECTION COMPONENT
// ==========================================
export function MasterCarouselSection(props: {
  theme?: 'dark' | 'light';
  onSlideAction?: (slideId: string) => void;
  className?: string;
}) {
  const isDark = props.theme === 'dark';
  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const cardRefs = React.useRef<Array<HTMLElement | null>>([]);
  const [currentIndex, setCurrentIndex] = React.useState(INITIAL_SLIDE_INDEX);
  const activeIndexRef = React.useRef(INITIAL_SLIDE_INDEX);
  const isAnimatingRef = React.useRef(false);
  const dragStartXRef = React.useRef<number | null>(null);
  const autoplayTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const isInteractingRef = React.useRef(false);

  const totalSlides = CLINIC_SLIDES.length;

  const getCardElements = React.useCallback(() => {
    return cardRefs.current.filter(Boolean) as HTMLElement[];
  }, []);

  const animateCardContent = React.useCallback(
    (index: number) => {
      const cards = getCardElements();
      const activeCard = cards[index];
      if (!activeCard) return;

      const title = activeCard.querySelector('.card-title');
      const desc = activeCard.querySelector('.card-desc');

      if (title && desc) {
        gsap.fromTo(
          [title, desc],
          { filter: 'blur(12px)', opacity: 0, scale: 0.98, y: -16 },
          {
            delay: 0.1,
            duration: 0.45,
            ease: 'power3.out',
            filter: 'blur(0px)',
            opacity: 1,
            scale: 1,
            stagger: 0.08,
            y: 0,
          },
        );
      }
    },
    [getCardElements],
  );

  const stopAutoplay = React.useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  const goToSlide = React.useCallback(
    (targetIndex: number) => {
      if (totalSlides === 0 || isAnimatingRef.current) return;
      const normalizedIndex = getWrappedIndex(targetIndex, totalSlides);
      if (normalizedIndex === activeIndexRef.current) return;

      isAnimatingRef.current = true;
      const prevIndex = activeIndexRef.current;
      activeIndexRef.current = normalizedIndex;
      setCurrentIndex(normalizedIndex);

      const cards = getCardElements();
      const oldActiveCard = cards[prevIndex];

      cards.forEach((card) => {
        gsap.killTweensOf(card);
      });

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });

      if (oldActiveCard) {
        tl.to(oldActiveCard, {
          duration: 0.2,
          ease: 'power2.in',
          filter: 'blur(1.5px) brightness(0.8)',
          scale: 0.88,
          z: -100,
        });
      }

      cards.forEach((card, idx) => {
        const targetSlot = getDeckSlot(idx, normalizedIndex, totalSlides);
        tl.to(
          card,
          {
            duration: 0.45,
            ease: 'power3.out',
            filter: targetSlot.filter,
            onStart: () => {
              if (idx === normalizedIndex) {
                card.style.zIndex = '30';
              } else if (idx === prevIndex) {
                card.style.zIndex = '20';
              } else {
                card.style.zIndex = String(targetSlot.zIndex);
              }
              card.style.pointerEvents = targetSlot.pointerEvents;
            },
            opacity: targetSlot.opacity,
            scale: targetSlot.scale,
            xPercent: targetSlot.xPercent,
            z: targetSlot.z,
          },
          '<+=0.02',
        );
      });

      animateCardContent(normalizedIndex);
    },
    [animateCardContent, getCardElements, totalSlides],
  );

  const prevSlide = React.useCallback(() => {
    goToSlide(activeIndexRef.current - 1);
  }, [goToSlide]);

  const nextSlide = React.useCallback(() => {
    goToSlide(activeIndexRef.current + 1);
  }, [goToSlide]);

  const startAutoplay = React.useCallback(() => {
    stopAutoplay();
    autoplayTimerRef.current = setInterval(() => {
      if (!isInteractingRef.current && !isAnimatingRef.current) {
        nextSlide();
      }
    }, AUTOPLAY_DELAY_MS);
  }, [nextSlide, stopAutoplay]);

  // Initialize 3D Deck Slots on mount
  React.useEffect(() => {
    const cards = getCardElements();
    cards.forEach((card, index) => {
      const slot = getDeckSlot(index, activeIndexRef.current, totalSlides);
      gsap.set(card, {
        filter: slot.filter,
        opacity: slot.opacity,
        scale: slot.scale,
        xPercent: slot.xPercent,
        z: slot.z,
        zIndex: slot.zIndex,
      });
      card.style.pointerEvents = slot.pointerEvents;
    });

    animateCardContent(activeIndexRef.current);
    startAutoplay();

    return () => {
      stopAutoplay();
    };
  }, [animateCardContent, getCardElements, startAutoplay, stopAutoplay, totalSlides]);

  const handleCardClick = React.useCallback(
    (index: number) => {
      if (isAnimatingRef.current) return;
      const diff = getOffset(index, activeIndexRef.current, totalSlides);
      if (diff === -1) prevSlide();
      if (diff === 1) nextSlide();
    },
    [nextSlide, prevSlide, totalSlides],
  );

  // Gesture handling
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    isInteractingRef.current = true;
    dragStartXRef.current = event.clientX;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    isInteractingRef.current = false;
    if (dragStartXRef.current === null) return;
    const diffX = event.clientX - dragStartXRef.current;
    dragStartXRef.current = null;

    const threshold = event.pointerType === 'touch' ? TOUCH_SWIPE_THRESHOLD_PX : MOUSE_SWIPE_THRESHOLD_PX;
    if (diffX > threshold) {
      prevSlide();
      return;
    }
    if (diffX < -threshold) {
      nextSlide();
    }
  };

  const handlePointerCancel = () => {
    isInteractingRef.current = false;
    dragStartXRef.current = null;
  };

  const handlePointerEnter = () => {
    isInteractingRef.current = true;
  };

  const handlePointerLeave = () => {
    isInteractingRef.current = false;
    dragStartXRef.current = null;
  };

  return (
    <div className={cn('w-full flex flex-col gap-2 mb-4 select-none', props.className)}>
      {/* Shared Global 3D SVG Gradient & Filter Definitions */}
      <Medical3DSVGDefs />

      {/* 3D Perspective Stage Container */}
      <div
        ref={stageRef}
        className="carousel-stage relative flex h-[154px] sm:h-[162px] w-full touch-pan-y items-center justify-center overflow-visible select-none [perspective-origin:50%_50%] [perspective:1000px]"
        onPointerCancel={handlePointerCancel}
        onPointerDown={handlePointerDown}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerUp={handlePointerUp}
      >
        {CLINIC_SLIDES.map((slide, index) => (
          <DeckCarouselCard
            key={slide.id}
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
            index={index}
            isDark={isDark}
            slide={slide}
            totalSlides={totalSlides}
            onClick={() => handleCardClick(index)}
            onActionClick={() => props.onSlideAction?.(slide.id)}
          />
        ))}
      </div>

      {/* Toolbar Controls */}
      <DeckCarouselToolbar
        currentIndex={currentIndex}
        isDark={isDark}
        totalSlides={totalSlides}
        onNext={nextSlide}
        onPrevious={prevSlide}
        onSelectSlide={goToSlide}
      />
    </div>
  );
}
