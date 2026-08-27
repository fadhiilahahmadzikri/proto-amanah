import { gsap } from 'gsap';
import { X } from 'lucide-react';
import React from 'react';
import { QueueCardMaster } from '@/components/atoms/QueueCardMaster';
import { cn } from '@/lib/utils';
import type { QueueDockCardData } from '@/types/queue-dock.types';

export function QueueActivationOverlay(props: {
  isActivating?: boolean;
  showSuccess: boolean;
  isGenieSettled: boolean;
  activeCard?: QueueDockCardData;
  cardRef?: React.Ref<HTMLDivElement>;
  onClose: () => void;
  onRedraw?: () => void;
  onActionClick?: () => void;
  onRevealApex?: () => void;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const { showSuccess, isGenieSettled, activeCard, cardRef, onClose, onRedraw, onActionClick, onRevealApex, theme = 'dark' } = props;
  const isDark = theme === 'dark';

  if (!showSuccess) {
    return null;
  }

  const handleCollectClick = () => {
    const cardEl = (cardRef && typeof cardRef !== 'function' ? cardRef.current : null) as HTMLElement | null;
    if (!cardEl) {
      onActionClick?.();
      return;
    }

    // Ultra-graceful & elegant 3D Card Retreat choreography (slow & cinematic)
    const tl = gsap.timeline({
      onComplete: () => {
        onActionClick?.();
      },
    });

    // 1. Initial gentle floating lift with subtle scale
    tl.to(cardEl, {
      y: -22,
      scale: 1.04,
      rotateX: -4,
      duration: 0.35,
      ease: 'power2.out',
    })
    // 2. Slow, graceful 3D Y-rotation and smooth descent into the queue records
    .to(cardEl, {
      rotateY: 360,
      rotateX: 0,
      scale: 0.42,
      y: 190,
      opacity: 0,
      duration: 1.05,
      ease: 'power2.inOut',
    });
  };

  return (
    <div
      className={cn(
        'absolute inset-0 z-40 flex flex-col px-6 pt-6 backdrop-blur-md transition-opacity duration-500 select-none',
        isDark ? 'bg-[#0a0e1a]/95 text-white' : 'bg-[#f8faff]/95 text-neutral-900',
        showSuccess ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        props.className,
      )}
    >
      {/* Top Header */}
      <header
        className={cn(
          'flex w-full items-center justify-between transition-all duration-500 shrink-0',
          isGenieSettled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none',
        )}
      >
        <button
          type="button"
          aria-label="Tutup"
          className={cn(
            'p-2 rounded-full hover:opacity-80 transition-opacity cursor-pointer',
            isDark ? 'text-white' : 'text-slate-800',
          )}
          onClick={onClose}
        >
          <X size={20} strokeWidth={2.5} />
        </button>
        <span className={cn('text-sm font-semibold tracking-wide', isDark ? 'text-slate-300' : 'text-slate-600')}>
          Antrean Terpilih
        </span>
      </header>

      {/* Activated Hero Card */}
      <div className="mt-2 flex flex-col flex-1 items-center justify-center">
        <div
          ref={cardRef}
          className={cn(
            'w-full max-w-[320px] flex justify-center shrink-0 will-change-transform',
            isGenieSettled ? 'opacity-100' : 'opacity-0',
          )}
        >
          {activeCard && (
            <QueueCardMaster
              card={activeCard}
              isRevealed={true}
              isSpinReady={isGenieSettled}
              badgeText="ANTREAN AKTIF"
              theme={theme}
              onRevealApex={onRevealApex}
            />
          )}
        </div>

        {/* Action Buttons: Panggil Pasien & Pilih Antrean Lain */}
        <div
          className={cn(
            'mb-6 mt-auto w-full flex flex-col gap-2.5 transition-all duration-500 delay-150',
            isGenieSettled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none',
          )}
        >
          {/* Primary Action: Panggil & Proses Pasien */}
          <button
            type="button"
            onClick={handleCollectClick}
            className={cn(
              'w-full rounded-2xl py-3.5 text-sm font-bold active:scale-98 transition-all cursor-pointer text-center',
              isDark
                ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_25px_rgba(6,182,212,0.45)]'
                : 'bg-gradient-to-r from-[#0a44ff] via-[#1a55ff] to-[#0055ff] hover:from-blue-700 hover:to-blue-600 text-white shadow-[0_10px_25px_rgba(10,68,255,0.3)]',
            )}
          >
            Panggil &amp; Proses Pasien
          </button>

          {/* Secondary Action: Pilih Antrean Lain */}
          <button
            type="button"
            onClick={onRedraw ?? onClose}
            className={cn(
              'w-full rounded-2xl py-3 text-xs font-semibold active:scale-98 transition-all cursor-pointer text-center',
              isDark
                ? 'border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 bg-transparent'
                : 'border border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100/90 bg-white/90 shadow-2xs',
            )}
          >
            Pilih Antrean Lain
          </button>
        </div>
      </div>
    </div>
  );
}
