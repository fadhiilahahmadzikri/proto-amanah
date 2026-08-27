'use client';

import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { PatientDetailDrawer } from '@/components/molecules/PatientDetailDrawer';
import { cn } from '@/lib/utils';
import type { QueueDockCardData } from '@/types/queue-dock.types';

export function PokemonCollectionGridScreen(props: {
  collectedCards: QueueDockCardData[];
  onRedraw: () => void;
  onBack: () => void;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const [drawerPatient, setDrawerPatient] = React.useState<QueueDockCardData | null>(null);
  const isDark = (props.theme ?? 'dark') === 'dark';

  return (
    <div
      className={cn(
        'relative flex h-full w-full flex-col overflow-hidden select-none',
        isDark ? 'bg-[#0a0e1a] text-white' : 'bg-[#f4f7ff] text-neutral-900',
        props.className,
      )}
    >
      {/* Top Header - Sentence case: Riwayat antrean diproses */}
      <header
        className={cn(
          'z-20 flex items-center justify-between px-4 pt-5 pb-3 shrink-0 border-b backdrop-blur-md',
          isDark ? 'border-white/10 bg-[#0a0e1a]/90' : 'border-slate-200 bg-white/90',
        )}
      >
        <button
          type="button"
          aria-label="Kembali ke rel"
          onClick={props.onBack}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-full active:scale-95 transition-all cursor-pointer',
            isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
          )}
        >
          <ArrowLeft size={18} />
        </button>

        <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
          Riwayat antrean diproses
        </h1>

        <div className="w-9 h-9" />
      </header>

      {/* Grid List - Strictly 2 cards per row (1 row muat 2 card saja) */}
      <div className="flex-1 overflow-y-auto px-3.5 pt-4 pb-4 no-scrollbar select-text">
        {props.collectedCards.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 h-20 w-20 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <span className="text-3xl font-extrabold text-[#0a44ff] dark:text-[#38bdf8]">#</span>
            </div>
            <h3 className={cn('text-base font-bold mb-1', isDark ? 'text-white' : 'text-slate-900')}>
              Belum ada antrean diproses
            </h3>
            <p className={cn('text-xs max-w-[240px]', isDark ? 'text-slate-400' : 'text-slate-500')}>
              Tarik kartu antrean pasien ke bawah pada rel 3D untuk memproses dan memanggil pasien!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {props.collectedCards.map((card, idx) => (
              <div
                key={`${card.id}-${idx}`}
                onClick={() => setDrawerPatient(card)}
                className={cn(
                  'relative flex flex-col justify-between overflow-hidden rounded-[20px] p-3.5 border active:scale-[0.97] cursor-pointer shadow-md transition-all group min-h-[140px]',
                  isDark
                    ? 'bg-[#121624] border-slate-700/80 hover:border-cyan-500/50 shadow-[0_4px_20px_rgba(0,0,0,0.25)]'
                    : 'bg-white border-slate-200/90 hover:border-blue-500/50 shadow-sm',
                )}
              >
                {/* Background Watermark Silhouette */}
                <img
                  src={card.watermarkUrl || '/assets/images/wm.svg'}
                  alt="Watermark"
                  className="absolute -top-3 -right-3 h-20 w-20 object-contain opacity-10 pointer-events-none select-none"
                />

                {/* Top Row: Queue Number + Poly Tag */}
                <div className="flex items-center justify-between z-10 gap-1">
                  <span className="text-xl font-black text-[#0a44ff] dark:text-[#38bdf8] leading-none tracking-tight">
                    {card.queueNumber || '#01'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-sky-300 shrink-0 whitespace-nowrap">
                    {card.poly || 'Poli Gigi'}
                  </span>
                </div>

                {/* Patient Photo Thumbnail & Information */}
                <div className="mt-3.5 z-10 flex flex-col gap-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={card.doctorImage || '/assets/images/doctors/woman-docter-3.png'}
                      alt={card.patientName || card.brand || 'Pasien'}
                      className="w-7 h-7 rounded-full object-cover border border-blue-400/30 shrink-0 shadow-xs"
                    />
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {card.patientName || card.brand}
                    </h4>
                  </div>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-snug mt-0.5">
                    {card.complaint || card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Bar Action: Panggil lagi */}
      <div
        className={cn(
          'z-20 shrink-0 px-4 pt-3 pb-8 sm:pb-6 border-t backdrop-blur-md transition-colors',
          isDark ? 'border-white/10 bg-[#0a0e1a]/95' : 'border-slate-200 bg-white/95',
        )}
      >
        <button
          type="button"
          onClick={props.onRedraw}
          className={cn(
            'w-full rounded-2xl py-3.5 text-xs font-bold active:scale-[0.98] transition-all cursor-pointer text-center',
            isDark
              ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_25px_rgba(6,182,212,0.35)]'
              : 'bg-gradient-to-r from-[#0a44ff] via-[#1a55ff] to-[#0055ff] hover:from-blue-700 hover:to-blue-600 text-white shadow-[0_10px_25px_rgba(10,68,255,0.25)]',
          )}
        >
          Panggil lagi
        </button>
      </div>

      {/* Patient Detail Master Drawer */}
      <PatientDetailDrawer
        isOpen={!!drawerPatient}
        patient={drawerPatient}
        onClose={() => setDrawerPatient(null)}
        theme={props.theme}
      />
    </div>
  );
}
