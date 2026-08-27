'use client';

import { ArrowLeft, RefreshCw } from 'lucide-react';
import React from 'react';
import { GiftBox3DSvg } from '@/components/atoms/GiftBox3DSvg';
import { QueueCardMaster } from '@/components/atoms/QueueCardMaster';
import { cn } from '@/lib/utils';
import type { QueueDockCardData } from '@/types/queue-dock.types';

export function PokemonCollectionGridScreen(props: {
  collectedCards: QueueDockCardData[];
  onRedraw: () => void;
  onBack: () => void;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const { collectedCards, onRedraw, onBack, className } = props;
  const [selectedCard, setSelectedCard] = React.useState<QueueDockCardData | null>(null);

  return (
    <div
      className={cn(
        'relative flex h-full w-full flex-col overflow-hidden bg-[#0f0f0f] text-white select-none',
        className,
      )}
    >
      {/* 1. Header Bar (Clean title without subtitle, vector base-color buttons) */}
      <header className="z-20 flex items-center justify-between px-4 pt-5 pb-3 shrink-0 border-b border-white/10 bg-[#0f0f0f]/90 backdrop-blur-md">
        <button
          type="button"
          aria-label="Back to Deck"
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>

        <h1 className="text-sm font-bold tracking-wide uppercase text-yellow-400">
          Pokémon Binder
        </h1>

        {/* Top Redraw Button (Vector base color only) */}
        <button
          type="button"
          aria-label="Redraw"
          onClick={onRedraw}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
        >
          <RefreshCw size={17} strokeWidth={2.2} />
        </button>
      </header>

      {/* 2. Collection Cards Grid Viewport (3 Cards per row, no hover animations, no redundant pill tags) */}
      <div className="flex-1 overflow-y-auto px-3.5 pt-4 pb-6 no-scrollbar">
        {collectedCards.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-16 text-center">
            <GiftBox3DSvg size={88} className="mb-4" />
            <h3 className="text-base font-bold text-white mb-1">No Cards Collected Yet</h3>
            <p className="text-xs text-gray-400 max-w-[240px]">
              Pull cards from the 3D mystery rail to start filling your Pokémon binder!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
            {collectedCards.map((card, idx) => (
              <div
                key={`${card.id}-${idx}`}
                onClick={() => setSelectedCard(card)}
                className="relative flex flex-col overflow-hidden rounded-xl bg-white/[0.04] p-1.5 border border-white/10 active:scale-95 cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.4)]"
              >
                {/* Card Artwork (Clean, no redundant pill badge, no hover animation) */}
                <div className="relative aspect-[0.718] w-full overflow-hidden rounded-lg bg-black/40">
                  <img
                    src={card.imageUrl ?? card.spriteUrl}
                    alt={card.brand}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Card Name */}
                <div className="mt-1.5 px-0.5 text-center">
                  <span className="text-[11px] font-semibold text-white truncate block">{card.brand}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Fullscreen 3D Card Inspector Modal */}
      {selectedCard && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-6 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
          <button
            type="button"
            aria-label="Close Inspector"
            onClick={() => setSelectedCard(null)}
            className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="w-full max-w-[300px] flex justify-center mb-6">
            <QueueCardMaster
              card={selectedCard}
              isRevealed={true}
              isSpinReady={true}
              badgeText="COLLECTION"
            />
          </div>

          <div className="text-center max-w-[280px]">
            <h3 className="text-base font-bold text-white mb-1">{selectedCard.brand}</h3>
            <span className="text-xs font-semibold text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full border border-yellow-400/20 inline-block mb-3">
              {selectedCard.rarity ?? 'Rare Holo'}
            </span>
            <p className="text-xs text-gray-300 leading-relaxed mb-6">
              {selectedCard.desc ?? 'Official Pokémon card in your collection binder.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCard(null);
                onRedraw();
              }}
              className="w-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 py-3 text-xs font-bold text-black shadow-[0_0_20px_rgba(251,191,36,0.35)] active:scale-95 transition-all cursor-pointer"
            >
              Redraw Another Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
