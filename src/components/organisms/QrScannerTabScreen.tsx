'use client';

import { CheckCircle2, Flashlight, QrCode, RefreshCw } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

export function QrScannerTabScreen(props: {
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const isDark = props.theme === 'dark';
  const [isFlashOn, setIsFlashOn] = React.useState(false);
  const [isScanned, setIsScanned] = React.useState(false);

  return (
    <div className={cn('flex flex-col items-center gap-6 pt-3 pb-28 select-text text-center', props.className)}>
      {/* Title Header */}
      <div className="flex flex-col items-center gap-1">
        <h2
          className={cn(
            'text-xl font-bold tracking-tight',
            isDark ? 'text-white' : 'text-slate-900',
          )}
        >
          Presensi Mandiri
        </h2>
        <p
          className={cn(
            'text-xs max-w-[260px]',
            isDark ? 'text-neutral-400' : 'text-slate-500',
          )}
        >
          Arahkan kamera ke QR Code di meja resepsionis atau poli praktek
        </p>
      </div>

      {/* Camera Viewfinder Frame */}
      <div
        className={cn(
          'relative w-64 h-64 rounded-[32px] overflow-hidden border-2 shadow-2xl flex items-center justify-center p-6 transition-all',
          isDark
            ? 'border-white/40 bg-black/40 backdrop-blur-md'
            : 'border-slate-300 bg-slate-950 text-white shadow-slate-900/10',
        )}
      >
        {/* Animated Laser Scan Line */}
        <div className="absolute inset-x-4 top-4 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(34,211,238,0.8)] animate-bounce" />

        {/* Viewfinder Corners */}
        <div className="absolute top-4 left-4 w-7 h-7 border-t-4 border-l-4 border-cyan-400 rounded-tl-xl" />
        <div className="absolute top-4 right-4 w-7 h-7 border-t-4 border-r-4 border-cyan-400 rounded-tr-xl" />
        <div className="absolute bottom-4 left-4 w-7 h-7 border-b-4 border-l-4 border-cyan-400 rounded-bl-xl" />
        <div className="absolute bottom-4 right-4 w-7 h-7 border-b-4 border-r-4 border-cyan-400 rounded-br-xl" />

        <div className="flex flex-col items-center gap-3 text-white/80">
          <QrCode className="h-16 w-16 stroke-[1.2] animate-pulse" />
          <span className="text-[11px] font-medium tracking-wide">
            {isScanned ? 'Presensi Berhasil!' : 'Mencari QR Code...'}
          </span>
        </div>
      </div>

      {/* Scanner Controls */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setIsFlashOn(prev => !prev)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all backdrop-blur-md border cursor-pointer select-none',
            isFlashOn
              ? 'bg-amber-400 text-neutral-900 border-amber-300 shadow-lg shadow-amber-400/20'
              : isDark
                ? 'bg-white/15 text-white border-white/20 hover:bg-white/25'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
          )}
        >
          <Flashlight className="h-4 w-4" />
          <span>{isFlashOn ? 'Flash Nyala' : 'Flash'}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsScanned(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer select-none"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Simulasi Scan</span>
        </button>
      </div>

      {/* Status Result Card */}
      {isScanned && (
        <div
          className={cn(
            'flex items-center gap-3 p-4 rounded-2xl border text-left max-w-xs animate-in zoom-in-95 duration-200 select-none',
            isDark
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900',
          )}
        >
          <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
          <div>
            <span className="text-xs font-bold block">
              Presensi Masuk Berhasil
            </span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300">
              Poli Anak • 21 Mei 2026, 07:28 WIB
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
