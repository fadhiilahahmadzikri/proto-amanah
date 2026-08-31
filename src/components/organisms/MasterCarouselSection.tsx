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
// ==========================================
// 3. DECK CAROUSEL CARD (Heroic Corner 3D Icon & Inward Notched Material Clipping)
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
      style={{
        clipPath: 'url(#carousel-card-inward-notch)',
        WebkitClipPath: 'url(#carousel-card-inward-notch)',
      }}
      className={cn(
        'card-item absolute inset-0 w-full p-4 sm:p-4.5 px-4.5 sm:px-5 cursor-pointer select-none overflow-hidden shadow-sm flex flex-col justify-between',
        '[backface-visibility:hidden] [transform-style:preserve-3d] [will-change:transform,opacity,filter] transition-colors duration-300',
        props.isDark
          ? 'bg-gradient-to-br from-[#0f1422] via-[#131b2e] to-[#16233d] text-white shadow-[0_12px_32px_rgba(0,0,0,0.4)]'
          : 'bg-gradient-to-br from-white via-[#f4f7ff] to-[#eaf0ff] text-slate-900 shadow-[0_8px_28px_rgba(10,68,255,0.06)]',
      )}
      data-index={props.index}
    >
      {/* Dynamic Pixel-Perfect Notched Rim Stroke Overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-30"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M 70 0 L 930 0 C 970 0 1000 70 1000 160 L 1000 840 C 1000 930 970 1000 930 1000 L 670 1000 C 635 1000 620 860 585 860 L 415 860 C 380 860 365 1000 330 1000 L 70 1000 C 30 1000 0 930 0 840 L 0 160 C 0 70 30 0 70 0 Z"
          stroke={props.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(219,234,254,0.95)'}
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Subtle Organic Ribbon Waves */}
      <svg
        className={cn(
          'absolute inset-0 w-full h-full pointer-events-none',
          props.isDark ? 'opacity-15' : 'opacity-[0.09]',
        )}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 180"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`carousel-ribbon-grad-${props.index}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              stopColor={props.isDark ? '#38bdf8' : '#ffffff'}
              stopOpacity={props.isDark ? 0.9 : 0.95}
            />
            <stop
              offset="45%"
              stopColor={props.isDark ? '#0284c7' : '#0d66e9'}
              stopOpacity={1}
            />
            <stop
              offset="100%"
              stopColor={props.isDark ? '#0369a1' : '#1d58ac'}
              stopOpacity={props.isDark ? 0.7 : 0.85}
            />
          </linearGradient>
        </defs>
        <path
          d="M-20,60 C80,140 180,-20 300,90 C360,140 420,70 440,50"
          fill="none"
          stroke={`url(#carousel-ribbon-grad-${props.index})`}
          strokeWidth="28"
          strokeLinecap="round"
        />
        <path
          d="M-10,130 C120,40 220,180 340,80 C390,40 430,100 450,110"
          fill="none"
          stroke={`url(#carousel-ribbon-grad-${props.index})`}
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
      <div className="relative z-10 flex items-center pt-1 pb-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            props.onActionClick();
          }}
          className={cn(
            'btn-crisp-blue inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs cursor-pointer select-none shrink-0 shadow-xs',
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
// 5. CAROUSEL NOTCHED CAVITY INDICATOR
// ==========================================
function DeckCarouselNotchedIndicator(props: {
  currentIndex: number;
  totalSlides: number;
  isDark?: boolean;
  onSelectSlide: (index: number) => void;
}) {
  return (
    <div className="absolute bottom-0 h-[22px] sm:h-[23px] left-1/2 -translate-x-1/2 z-40 flex items-center justify-center gap-1.5 px-3 pointer-events-auto select-none">
      {Array.from({ length: props.totalSlides }).map((_, index) => {
        const isActive = index === props.currentIndex;
        return (
          <button
            key={index}
            type="button"
            aria-label={`Ke slide ${index + 1}`}
            onClick={() => props.onSelectSlide(index)}
            className="flex h-full items-center justify-center focus:outline-none cursor-pointer"
          >
            <span
              className={cn(
                'block h-1.5 rounded-full transition-all duration-300',
                isActive
                  ? props.isDark
                    ? 'w-5 bg-[#38bdf8] shadow-[0_0_8px_rgba(56,189,248,0.4)]'
                    : 'w-5 bg-[#0d66e9] shadow-[0_1px_3px_rgba(13,102,233,0.3)]'
                  : props.isDark
                    ? 'w-1.5 bg-neutral-600 hover:bg-neutral-500'
                    : 'w-1.5 bg-slate-300 hover:bg-slate-400',
              )}
            />
          </button>
        );
      })}
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
    <div className={cn('relative w-full mb-3.5 pt-0.5 select-none', props.className)}>
      {/* Shared Global 3D SVG Gradient & Filter Definitions */}
      <Medical3DSVGDefs />

      {/* SVG Inward Notch Clip Path for Deck Card Material */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="carousel-card-inward-notch" clipPathUnits="objectBoundingBox">
            <path d="M 0.07 0 L 0.93 0 C 0.97 0 1 0.07 1 0.16 L 1 0.84 C 1 0.93 0.97 1 0.93 1 L 0.67 1 C 0.635 1 0.62 0.86 0.585 0.86 L 0.415 0.86 C 0.38 0.86 0.365 1 0.33 1 L 0.07 1 C 0.03 1 0 0.93 0 0.84 L 0 0.16 C 0 0.07 0.03 0 0.07 0 Z" />
          </clipPath>
        </defs>
      </svg>

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

        {/* Absolute Left & Right Compact Navigators (Hugging the Outer Walls) */}
        <button
          type="button"
          aria-label="Slide Sebelumnya"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className={cn(
            'absolute -left-2.5 sm:-left-3 top-1/2 -translate-y-1/2 z-40 w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-85 cursor-pointer border shadow-md',
            isDark
              ? 'bg-[#0f1422]/85 hover:bg-[#0f1422] border-white/20 text-white shadow-black/50'
              : 'bg-white/95 hover:bg-white border-blue-100/90 text-slate-700 shadow-slate-900/10',
          )}
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.4]" />
        </button>

        <button
          type="button"
          aria-label="Slide Berikutnya"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className={cn(
            'absolute -right-2.5 sm:-right-3 top-1/2 -translate-y-1/2 z-40 w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-85 cursor-pointer border shadow-md',
            isDark
              ? 'bg-[#0f1422]/85 hover:bg-[#0f1422] border-white/20 text-white shadow-black/50'
              : 'bg-white/95 hover:bg-white border-blue-100/90 text-slate-700 shadow-slate-900/10',
          )}
        >
          <ChevronRight className="w-4 h-4 stroke-[2.4]" />
        </button>

        {/* Docked Notch Indicator Toolbar (Bottom Center) */}
        <DeckCarouselNotchedIndicator
          currentIndex={currentIndex}
          isDark={isDark}
          totalSlides={totalSlides}
          onSelectSlide={goToSlide}
        />
      </div>
    </div>
  );
}
