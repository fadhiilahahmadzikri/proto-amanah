import { X } from 'lucide-react';
import { QueueCardMaster } from '@/components/atoms/QueueCardMaster';
import { cn } from '@/lib/utils';
import type { QueueDockCardData } from '@/types/queue-dock.types';

export function QueueActivationOverlay(props: {
  isActivating: boolean;
  showSuccess: boolean;
  isGenieSettled: boolean;
  activeCard?: QueueDockCardData;
  cardRef?: React.Ref<HTMLDivElement>;
  onClose: () => void;
  onActionClick?: () => void;
  className?: string;
}) {
  const { showSuccess, isGenieSettled, activeCard, cardRef, onClose, onActionClick } = props;

  return (
    <div
      className={cn(
        'absolute inset-0 z-40 flex flex-col bg-black/85 px-6 pt-6 backdrop-blur-md transition-opacity duration-500 select-none',
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
          aria-label="Tutup Overlay"
          className="p-2 text-white hover:opacity-80 transition-opacity cursor-pointer"
          onClick={onClose}
        >
          <X size={20} strokeWidth={2.5} />
        </button>
        <span className="text-sm font-semibold tracking-wide text-gray-300">Bantuan</span>
      </header>

      {/* Activated Hero Card (Spewed first via Genie animation - 100% Identical instance of QueueCardMaster) */}
      <div className="mt-4 flex flex-col flex-1">
        <div ref={cardRef} className="w-full shrink-0">
          {activeCard && (
            <QueueCardMaster
              card={activeCard}
              badgeText="VOUCHER AKTIF"
              className="!w-full !h-[330px] shadow-2xl"
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
          <h3 className="mb-2 text-xs font-bold text-white">Bagaimana cara proses antrean?</h3>
          <div className="flex items-start space-x-3">
            <div className="text-sm font-black text-gray-500">1</div>
            <p className="text-xs font-medium text-gray-300">
              Tunjukkan nomor antrean saat memasuki <span className="font-bold text-white">Poli Praktik</span>
            </p>
          </div>
        </div>

        {/* Action Buttons: Panggil Antrean & Batal (Fades in ONLY AFTER card is settled) */}
        <div
          className={cn(
            'mb-6 mt-auto w-full flex flex-col gap-3 transition-all duration-500 delay-150',
            isGenieSettled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none',
          )}
        >
          <button
            type="button"
            onClick={onActionClick ?? onClose}
            className="w-full rounded-full bg-[#ff9900] hover:bg-[#ffaa22] py-3.5 text-base font-bold text-black shadow-[0_0_20px_rgba(255,153,0,0.4)] active:scale-98 transition-all cursor-pointer text-center"
          >
            Panggil / Masuk Antrean
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full py-3 text-sm font-semibold text-gray-400 hover:text-white active:scale-98 transition-all cursor-pointer text-center bg-transparent hover:bg-white/5"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
