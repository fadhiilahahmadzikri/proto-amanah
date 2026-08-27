import { gsap } from 'gsap';
import { X } from 'lucide-react';
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
  onActionClick?: () => void;
  onRevealApex?: () => void;
  className?: string;
}) {
  const { showSuccess, isGenieSettled, activeCard, cardRef, onClose, onActionClick, onRevealApex } = props;

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
    // 2. Slow, graceful 3D Y-rotation and smooth descent into the binder
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
        'absolute inset-0 z-40 flex flex-col bg-[#0f0f0f]/95 px-6 pt-6 backdrop-blur-md transition-opacity duration-500 select-none',
        showSuccess ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        props.className,
      )}
    >
      {/* Top Header (Fades in ONLY AFTER card is spewed and settled) */}
      <header
        className={cn(
          'flex w-full items-center justify-between transition-all duration-500 shrink-0',
          isGenieSettled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none',
        )}
      >
        <button
          type="button"
          aria-label="Close"
          className="p-2 text-white hover:opacity-80 transition-opacity cursor-pointer"
          onClick={onClose}
        >
          <X size={20} strokeWidth={2.5} />
        </button>
        <span className="text-sm font-semibold tracking-wide text-gray-300">Help</span>
      </header>

      {/* Activated Hero Card (Spewed first via Genie animation - Expanded full size) */}
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
              badgeText="POKÉMON TCG"
              onRevealApex={onRevealApex}
            />
          )}
        </div>

        {/* Steps / Info (Fades in ONLY AFTER card is settled) */}
        <div
          className={cn(
            'mt-5 w-full transition-all duration-500 delay-100',
            isGenieSettled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {activeCard?.brand ?? 'Pokémon Card'}
            </h3>
            <span className="text-[10px] font-semibold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/20">
              {activeCard?.rarity ?? 'Rare Holo'}
            </span>
          </div>
          <div className="flex items-start space-x-3 bg-white/5 p-3 rounded-2xl border border-white/10">
            <div className="text-sm font-black text-amber-400">★</div>
            <p className="text-xs font-medium text-gray-300">
              {activeCard?.desc ?? 'Official Pokémon card revealed from mystery deck!'}
            </p>
          </div>
        </div>

        {/* Action Buttons: Collect Card & Draw Another Card (Fades in ONLY AFTER card is settled) */}
        <div
          className={cn(
            'mb-6 mt-auto w-full flex flex-col gap-3 transition-all duration-500 delay-150',
            isGenieSettled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none',
          )}
        >
          <button
            type="button"
            onClick={handleCollectClick}
            className="w-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 py-3.5 text-base font-bold text-black shadow-[0_0_25px_rgba(251,191,36,0.45)] active:scale-98 transition-all cursor-pointer text-center"
          >
            Collect Card
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full py-3 text-sm font-semibold text-gray-400 hover:text-white active:scale-98 transition-all cursor-pointer text-center bg-transparent hover:bg-white/5"
          >
            Draw Another Card
          </button>
        </div>
      </div>
    </div>
  );
}
