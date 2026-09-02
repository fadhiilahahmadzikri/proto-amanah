'use client';

import { ScreenHeader } from '@/components/molecules/ScreenHeader';
import { cn } from '@/lib/utils';

export type ReportItem = {
  id: string;
  ticketNumber: string;
  title: string;
  date: string;
  status: 'proses' | 'selesai';
  technicianNote: string;
};

/**
 * Dedicated screen for viewing submitted technical reports and tickets.
 * @param props Component properties.
 * @returns React node for the reports screen.
 */
export function ItMyReportsScreen(props: {
  reports: ReportItem[];
  theme?: 'dark' | 'light';
  onBack: () => void;
  onOpenChat: () => void;
  className?: string;
}) {
  const isDark = props.theme === 'dark';

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden select-text flex flex-col',
        isDark ? 'bg-[#0a0e1a] text-white' : 'bg-[#f8faff] text-slate-900',
        props.className,
      )}
    >
      <ScreenHeader
        title="Laporan saya"
        onBack={props.onBack}
        theme={props.theme}
      />

      <div className="flex-1 min-h-0 w-full overflow-y-auto no-scrollbar px-5 pt-3 pb-6 flex flex-col gap-4">
        {props.reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span
              className={cn(
                'text-xs',
                isDark ? 'text-neutral-400' : 'text-slate-500',
              )}
            >
              Belum ada riwayat laporan kendala teknis.
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {props.reports.map((report) => {
              const isProcessing = report.status === 'proses';
              let badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
              let badgeText = 'Selesai ditangani';

              if (isProcessing) {
                badgeStyle = isDark
                  ? 'bg-amber-950/40 text-amber-300 border-amber-500/30'
                  : 'bg-amber-50 text-amber-700 border-amber-200';
                badgeText = 'Sedang ditangani';
              } else if (isDark) {
                badgeStyle = 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30';
              }

              return (
                <div
                  key={report.id}
                  className={cn(
                    'p-4 rounded-2xl border flex flex-col gap-2 transition-colors',
                    isDark
                      ? 'bg-[#111624] border-white/5'
                      : 'bg-white border-slate-100 shadow-2xs',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn('text-[10.5px] font-mono', isDark ? 'text-neutral-400' : 'text-slate-400')}>
                      {report.ticketNumber}
                    </span>
                    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-md border', badgeStyle)}>
                      {badgeText}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold tracking-tight">
                    {report.title}
                  </h4>

                  <p
                    className={cn(
                      'text-[11px] leading-relaxed p-2.5 rounded-xl border',
                      isDark
                        ? 'bg-white/5 border-white/5 text-neutral-300'
                        : 'bg-slate-50 border-slate-100 text-slate-600',
                    )}
                  >
                    {report.technicianNote}
                  </p>

                  <span className={cn('text-[10px]', isDark ? 'text-neutral-400' : 'text-slate-400')}>
                    Diajukan pada: {report.date}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={props.onOpenChat}
          className={cn(
            'w-full py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer select-none active:scale-98 text-center mt-2',
            isDark
              ? 'bg-sky-500 text-white hover:bg-sky-400'
              : 'bg-blue-600 text-white hover:bg-blue-700',
          )}
        >
          Laporkan kendala baru via chat IT
        </button>
      </div>
    </div>
  );
}
