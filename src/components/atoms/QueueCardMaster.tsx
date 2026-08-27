import React from 'react';
import { cn } from '@/lib/utils';
import type { QueueDockCardData } from '@/types/queue-dock.types';

export function QueueCardMaster(props: {
  card: QueueDockCardData;
  badgeText?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const card = props.card;
  const badge = props.badgeText ?? 'VOUCHER';

  return (
    <div
      className={cn(
        'relative flex h-[335px] w-[212px] shrink-0 flex-col overflow-hidden rounded-[18px] p-4 sm:p-5 shadow-[0_20px_40px_rgba(0,0,0,0.8)] select-none bg-[#121212]',
        card.bgClass,
        props.className,
      )}
    >
      {/* 1. Brand Header */}
      <div className="mb-auto flex items-center justify-between z-10 relative">
        <span
          className={cn(
            'text-lg font-bold tracking-tight uppercase',
            card.id === 'zomato'
              ? 'text-[#f50]'
              : card.id === 'spotify'
                ? 'text-[#1DB954]'
                : card.id === 'netflix'
                  ? 'text-[#E50914]'
                  : 'text-white',
          )}
        >
          {card.brand}
        </span>
        <span className="text-[10px] font-semibold tracking-wider text-white/70 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-sm whitespace-nowrap shrink-0">
          {badge}
        </span>
      </div>

      {/* 2. Card Main Typography Anatomy */}
      <div className="z-10 relative mt-6 flex flex-col">
        <div className="text-3xl font-black leading-tight text-white tracking-tight">
          {card.title}
        </div>
        <div className="text-base font-bold text-white/90 tracking-wide mt-0.5">
          {card.subtitle}
        </div>
        {card.desc && (
          <p className="mt-2 text-xs font-medium text-white/70 line-clamp-2">{card.desc}</p>
        )}
      </div>

      {/* 3. Bespoke Graphical Elements for each brand variant */}
      {card.id === 'amazon' && (
        <div className="absolute bottom-4 right-4 text-white/25 pointer-events-none">
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
          </svg>
        </div>
      )}
      {card.id === 'airtel' && (
        <div className="absolute bottom-0 right-0 h-32 w-32 rounded-tl-full bg-white/10 pointer-events-none" />
      )}
      {card.id === 'zomato' && (
        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full border-4 border-[#f50]/25 pointer-events-none" />
      )}
      {card.id === 'spotify' && (
        <div className="absolute bottom-4 right-4 flex items-end gap-1 opacity-40 pointer-events-none">
          <div className="w-1.5 h-6 bg-[#1DB954] rounded-full animate-pulse" />
          <div className="w-1.5 h-10 bg-[#1DB954] rounded-full animate-pulse delay-100" />
          <div className="w-1.5 h-8 bg-[#1DB954] rounded-full animate-pulse delay-200" />
          <div className="w-1.5 h-12 bg-[#1DB954] rounded-full animate-pulse delay-300" />
        </div>
      )}
      {card.id === 'apple' && (
        <div className="absolute -bottom-8 -right-8 h-36 w-36 rounded-full bg-white/5 border border-white/15 backdrop-blur-md pointer-events-none" />
      )}
      {card.id === 'disney' && (
        <div className="absolute bottom-0 right-0 h-36 w-36 bg-radial from-cyan-400/20 via-transparent to-transparent blur-xl pointer-events-none" />
      )}
      {card.id === 'grab' && (
        <div className="absolute -bottom-6 -right-6 h-28 w-28 rotate-45 border-2 border-emerald-400/30 bg-emerald-500/10 pointer-events-none" />
      )}
      {card.id === 'gojek' && (
        <div className="absolute -bottom-8 -right-8 flex h-36 w-36 items-center justify-center rounded-full border-2 border-lime-400/20 pointer-events-none">
          <div className="h-20 w-20 rounded-full border-2 border-lime-400/30" />
        </div>
      )}
      {card.id === 'netflix' && (
        <div className="absolute bottom-0 right-3 flex h-28 w-14 items-end pointer-events-none">
          <div className="h-full w-4 bg-[#E50914]/20 shadow-[0_0_15px_#E50914]" />
        </div>
      )}
      {card.id === 'halodoc' && (
        <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-[#FF2D55]/15 blur-xl pointer-events-none" />
      )}

      {props.children}
    </div>
  );
}
