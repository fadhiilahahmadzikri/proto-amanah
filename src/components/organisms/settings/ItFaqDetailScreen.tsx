'use client';

import { ScreenHeader } from '@/components/molecules/ScreenHeader';
import { cn } from '@/lib/utils';

export type FaqItem = {
  id: string;
  title: string;
  category: string;
  solution: string[];
};

/**
 * Dedicated screen for viewing detailed FAQ answers and technical steps.
 * @param props Component properties.
 * @returns React node for the FAQ detail screen.
 */
export function ItFaqDetailScreen(props: {
  faq: FaqItem;
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
        title="Pusat bantuan"
        onBack={props.onBack}
        theme={props.theme}
      />

      <div className="flex-1 min-h-0 w-full overflow-y-auto no-scrollbar px-5 pt-3 pb-6 flex flex-col gap-4">
        {/* Question Header Card */}
        <div
          className={cn(
            'p-4 rounded-2xl border flex flex-col gap-1.5 transition-colors',
            isDark
              ? 'bg-[#111624] border-white/5'
              : 'bg-white border-slate-100 shadow-2xs',
          )}
        >
          <span
            className={cn(
              'text-[10.5px] font-semibold tracking-tight',
              isDark ? 'text-sky-400' : 'text-blue-600',
            )}
          >
            {props.faq.category}
          </span>
          <h3 className="text-sm font-bold tracking-tight leading-snug">
            {props.faq.title}
          </h3>
        </div>

        {/* Solution Steps Card */}
        <div
          className={cn(
            'p-4 rounded-2xl border flex flex-col gap-3 transition-colors',
            isDark
              ? 'bg-[#111624] border-white/5'
              : 'bg-white border-slate-100 shadow-2xs',
          )}
        >
          <span
            className={cn(
              'text-xs font-semibold',
              isDark ? 'text-neutral-400' : 'text-slate-500',
            )}
          >
            Langkah penyelesaian
          </span>

          <div className="flex flex-col gap-2.5">
            {props.faq.solution.map((step, index) => (
              <div key={step} className="flex items-start gap-3">
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
                    isDark
                      ? 'bg-white/10 text-neutral-200'
                      : 'bg-slate-100 text-slate-700',
                  )}
                >
                  {index + 1}
                </span>
                <p
                  className={cn(
                    'text-xs leading-relaxed flex-1',
                    isDark ? 'text-neutral-300' : 'text-slate-700',
                  )}
                >
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Fallback Action */}
        <div
          className={cn(
            'p-4 rounded-2xl border flex flex-col gap-2.5 items-center text-center transition-colors',
            isDark
              ? 'bg-white/5 border-white/5'
              : 'bg-slate-50 border-slate-200 shadow-2xs',
          )}
        >
          <span
            className={cn(
              'text-xs font-medium',
              isDark ? 'text-neutral-300' : 'text-slate-600',
            )}
          >
            Kendala belum terselesaikan?
          </span>
          <button
            type="button"
            onClick={props.onOpenChat}
            className={cn(
              'w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer select-none active:scale-98',
              isDark
                ? 'bg-sky-500 text-white hover:bg-sky-400'
                : 'bg-blue-600 text-white hover:bg-blue-700',
            )}
          >
            Chat dengan tim IT
          </button>
        </div>
      </div>
    </div>
  );
}
