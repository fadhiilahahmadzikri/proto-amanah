import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { QueueDockCardData } from '@/types/queue-dock.types';

export function QueueActivationOverlay(props: {
  isActivating: boolean;
  showSuccess: boolean;
  activeCard?: QueueDockCardData;
  onClose: () => void;
  onActionClick?: () => void;
  className?: string;
}) {
  const { showSuccess, activeCard, onClose, onActionClick } = props;

  return (
    <div
      className={cn(
        'absolute inset-0 z-40 flex flex-col bg-black/85 px-6 pt-6 backdrop-blur-md transition-all duration-500 select-none',
        showSuccess ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        props.className,
      )}
    >
      {/* Top Header */}
      <header className="flex w-full items-center justify-between">
        <button
          type="button"
          aria-label="Tutup Overlay"
          className="p-2 text-white hover:opacity-80 transition-opacity cursor-pointer"
          onClick={onClose}
        >
          <X size={20} strokeWidth={2.5} />
        </button>
        <span className="text-sm font-semibold tracking-wide text-gray-300">Bantuan</span>
      </header>

      {/* Activated Hero Card */}
      <div className="mt-8 flex flex-col flex-1">
        <div
          className={cn(
            'relative overflow-hidden rounded-3xl p-6 shadow-2xl border border-white/10',
            activeCard?.bgClass ?? 'bg-[#1a202c]',
          )}
        >
          <div className="mb-8 flex items-center justify-between">
            <span className="text-lg font-bold text-white uppercase tracking-tight">
              {activeCard?.brand ?? 'amazon'}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-white/90">
              VOUCHER AKTIF
            </span>
          </div>

          <div className="mb-2 text-5xl font-black text-white">
            {activeCard?.title ?? '50%'}
          </div>
          <div className="mb-8 text-2xl font-bold text-white">
            {activeCard?.subtitle ?? 'cashback'}
          </div>

          <div className="mb-4 text-sm text-gray-400">
            Gunakan kartu antrean untuk proses konsultasi cepat
          </div>

          <div className="flex w-fit items-center space-x-2 rounded-full bg-gray-800/50 px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
            <span className="text-xs font-semibold text-yellow-500">Berlaku Hari Ini</span>
          </div>

          <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-[#ff9900]/20 blur-2xl pointer-events-none" />
        </div>

        {/* Steps / Info */}
        <div className="mt-8">
          <h3 className="mb-4 text-sm font-bold text-white">Bagaimana cara proses antrean?</h3>
          <div className="flex items-start space-x-4">
            <div className="mt-1 text-xl font-black text-gray-500">1</div>
            <p className="text-sm font-medium text-gray-300">
              Tunjukkan nomor antrean saat memasuki <span className="font-bold text-white">Poli Praktik</span>
            </p>
          </div>
        </div>

        {/* Action Buttons: Panggil Antrean & Batal */}
        <div className="mb-6 mt-auto flex flex-col gap-3">
          <button
            type="button"
            onClick={onActionClick ?? onClose}
            className="w-full rounded-full bg-[#ff9900] hover:bg-[#ffaa22] py-4 text-base sm:text-lg font-bold text-black shadow-[0_0_20px_rgba(255,153,0,0.4)] active:scale-98 transition-all cursor-pointer text-center"
          >
            Panggil / Masuk Antrean
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full py-3.5 text-sm sm:text-base font-semibold text-gray-400 hover:text-white active:scale-98 transition-all cursor-pointer text-center bg-transparent hover:bg-white/5"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
