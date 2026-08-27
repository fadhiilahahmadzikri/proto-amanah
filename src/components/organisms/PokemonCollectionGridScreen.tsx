'use client';

import { ArrowLeft, RefreshCw } from 'lucide-react';
import React from 'react';
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
  const { collectedCards, onRedraw, onBack, theme = 'dark', className } = props;
  const [selectedCard, setSelectedCard] = React.useState<QueueDockCardData | null>(null);
  const isDark = theme === 'dark';

  return (
    <div
      className={cn(
        'relative flex h-full w-full flex-col overflow-hidden select-none',
        isDark ? 'bg-[#0a0e1a] text-white' : 'bg-[#f4f7ff] text-neutral-900',
        className,
      )}
    >
      {/* Top Header */}
      <header
        className={cn(
          'z-20 flex items-center justify-between px-4 pt-5 pb-3 shrink-0 border-b backdrop-blur-md',
          isDark ? 'border-white/10 bg-[#0a0e1a]/90' : 'border-slate-200 bg-white/90',
        )}
      >
        <button
          type="button"
          aria-label="Kembali ke Rel"
          onClick={onBack}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-full active:scale-95 transition-all cursor-pointer',
            isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
          )}
        >
          <ArrowLeft size={18} />
        </button>

        <h1 className="text-sm font-bold tracking-wide uppercase text-[#0a44ff] dark:text-[#38bdf8]">
          Riwayat Antrean Diproses
        </h1>

        <button
          type="button"
          aria-label="Pilih Antrean"
          onClick={onRedraw}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-full active:scale-95 transition-all cursor-pointer',
            isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
          )}
        >
          <RefreshCw size={17} strokeWidth={2.2} />
        </button>
      </header>

      {/* Grid List */}
      <div className="flex-1 overflow-y-auto px-3.5 pt-4 pb-6 no-scrollbar">
        {collectedCards.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 h-20 w-20 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <span className="text-3xl font-extrabold text-[#0a44ff] dark:text-[#38bdf8]">#</span>
            </div>
            <h3 className={cn('text-base font-bold mb-1', isDark ? 'text-white' : 'text-slate-900')}>
              Belum Ada Antrean Diproses
            </h3>
            <p className={cn('text-xs max-w-[240px]', isDark ? 'text-slate-400' : 'text-slate-500')}>
              Tarik kartu antrean pasien ke bawah pada rel 3D untuk memproses dan memanggil pasien!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {collectedCards.map((card, idx) => (
              <div
                key={`${card.id}-${idx}`}
                onClick={() => setSelectedCard(card)}
                className={cn(
                  'relative flex flex-col overflow-hidden rounded-2xl p-3 border active:scale-95 cursor-pointer shadow-md transition-all',
                  isDark ? 'bg-[#121624] border-slate-700/80' : 'bg-white border-slate-200',
                )}
              >
                <div className="flex items-start justify-between">
                  <span className="text-xl font-extrabold text-[#0a44ff] dark:text-[#38bdf8] leading-none">
                    {card.queueNumber || '#01'}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-sky-300">
                    {card.poly || 'Poli Gigi'}
                  </span>
                </div>

                <div className="mt-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {card.patientName || card.brand}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {card.complaint || card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen 3D Card Inspector Modal */}
      {selectedCard && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-6 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
          <button
            type="button"
            aria-label="Tutup Inspector"
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
              badgeText="ANTREAN"
              theme={theme}
            />
          </div>

          <div className="text-center max-w-[280px]">
            <h3 className="text-base font-bold text-white mb-0.5">
              {selectedCard.queueNumber} · {selectedCard.patientName || selectedCard.brand}
            </h3>
            <span className="text-xs font-semibold text-sky-400 bg-sky-400/10 px-2.5 py-0.5 rounded-full border border-sky-400/20 inline-block mb-2">
              {selectedCard.poly || 'Poli Umum'} · {selectedCard.priority || 'Reguler'}
            </span>
            <p className="text-xs text-gray-300 leading-relaxed mb-5">
              Keluhan: {selectedCard.complaint || selectedCard.desc}
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCard(null);
                onRedraw();
              }}
              className={cn(
                'w-full rounded-2xl py-3 text-xs font-bold active:scale-95 transition-all cursor-pointer text-center',
                isDark
                  ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'bg-gradient-to-r from-[#0a44ff] via-[#1a55ff] to-[#0055ff] hover:from-blue-700 hover:to-blue-600 text-white shadow-[0_10px_20px_rgba(10,68,255,0.3)]',
              )}
            >
              Pilih Antrean Lain
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
