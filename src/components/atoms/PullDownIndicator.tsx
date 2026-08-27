import { cn } from '@/lib/utils';

export function PullDownIndicator(props: {
  isActivating: boolean;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative z-40 flex flex-col items-center pb-4 sm:pb-6 transition-opacity duration-300 select-none w-full shrink-0 -mt-2',
        props.isActivating ? 'opacity-0 pointer-events-none' : 'opacity-100',
        props.className,
      )}
    >
      {/* 1. Drag-to-Activate Instruction Prompt Text */}
      <p className="text-xs sm:text-[13px] font-semibold tracking-wide text-[#fbbf24] drop-shadow-[0_0_8px_rgba(251,191,36,0.35)]">
        {props.label ?? 'Tarik ke bawah untuk mengaktifkan antrean'}
      </p>

      {/* 3. Small Visual Feedback / Status Gesture Dot */}
      <div className="mt-2 flex items-center justify-center">
        <div className="relative flex h-2 w-2 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_#f59e0b]" />
        </div>
      </div>

      {/* 4. Bottom Home Indicator Gesture Bar */}
      <div className="mt-3.5 h-1 w-28 rounded-full bg-white/35 backdrop-blur-sm" />
    </div>
  );
}
