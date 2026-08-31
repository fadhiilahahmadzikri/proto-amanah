'use client';

import {
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

export type M3BannerVariant = 'warning' | 'info' | 'error' | 'success' | 'neutral';

export interface M3BannerAction {
  label: string;
  onClick: () => void;
  loading?: boolean;
}

export interface M3BannerProps {
  /**
   * Visual theme and semantic intent of the banner.
   * Default: 'warning'
   */
  variant?: M3BannerVariant;

  /**
   * Slot 1: Optional Supporting Illustration or Icon.
   */
  illustration?: React.ReactNode;

  /**
   * Slot 2: Primary headline message (Required).
   */
  primaryText: string | React.ReactNode;

  /**
   * Slot 2: Secondary / Supporting description message (Optional).
   */
  supportingText?: string | React.ReactNode;

  /**
   * Slot 3: Primary Action Button (Tonal / Filled style).
   */
  primaryAction?: M3BannerAction;

  /**
   * Slot 3: Secondary Action Button (Text button style).
   */
  secondaryAction?: M3BannerAction;

  /**
   * Allow user to dismiss or close the banner.
   */
  dismissible?: boolean;

  /**
   * Callback fired on dismissal.
   */
  onDismiss?: () => void;

  /**
   * Current app theme mode.
   */
  theme?: 'dark' | 'light';

  /**
   * Optional custom className.
   */
  className?: string;
}

/**
 * Material Design 3 (M3) Official Banner Master Component
 *
 * Placed directly below the Top App Bar (ScreenHeader), edge-to-edge across the screen width.
 * Implements the 4-part M3 Anatomy (m3.material.io):
 * 1. Supporting Illustration Area (left)
 * 2. Content Area (Primary + Supporting Message)
 * 3. Action Area (Up to 2 action buttons at bottom-right)
 * 4. Main Flat Container (Edge-to-edge, flat surface with subtle bottom divider, no card borders)
 */
export function M3Banner(props: M3BannerProps) {
  const isDark = props.theme === 'dark';
  const variant = props.variant ?? 'warning';
  const [isDismissed, setIsDismissed] = React.useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          container: isDark
            ? 'bg-amber-950/40 border-b border-amber-500/20 text-amber-200'
            : 'bg-amber-50 border-b border-amber-200 text-amber-950',
          illustrationBg: isDark ? 'text-amber-400' : 'text-amber-600',
          primaryBtn: isDark
            ? 'bg-amber-500 hover:bg-amber-400 text-amber-950 shadow-xs'
            : 'bg-amber-500 hover:bg-amber-600 text-amber-950 shadow-xs',
          secondaryBtn: isDark
            ? 'text-amber-300 hover:bg-amber-500/15'
            : 'text-amber-800 hover:bg-amber-100',
          defaultIcon: <AlertTriangle className="h-5 w-5 shrink-0" />,
        };
      case 'error':
        return {
          container: isDark
            ? 'bg-rose-950/40 border-b border-rose-500/20 text-rose-200'
            : 'bg-rose-50 border-b border-rose-200 text-rose-950',
          illustrationBg: isDark ? 'text-rose-400' : 'text-rose-600',
          primaryBtn: isDark
            ? 'bg-rose-500 hover:bg-rose-400 text-white'
            : 'bg-rose-600 hover:bg-rose-700 text-white',
          secondaryBtn: isDark
            ? 'text-rose-300 hover:bg-rose-500/15'
            : 'text-rose-800 hover:bg-rose-100',
          defaultIcon: <AlertCircle className="h-5 w-5 shrink-0" />,
        };
      case 'info':
        return {
          container: isDark
            ? 'bg-blue-950/40 border-b border-blue-500/20 text-cyan-200'
            : 'bg-blue-50 border-b border-blue-200 text-blue-950',
          illustrationBg: isDark ? 'text-cyan-400' : 'text-[#0d66e9]',
          primaryBtn: isDark
            ? 'btn-crisp-blue-dark font-bold'
            : 'btn-crisp-blue font-bold',
          secondaryBtn: isDark
            ? 'text-cyan-300 hover:bg-cyan-500/15'
            : 'text-[#0d66e9] hover:bg-blue-100/80',
          defaultIcon: <Info className="h-5 w-5 shrink-0" />,
        };
      case 'success':
        return {
          container: isDark
            ? 'bg-emerald-950/40 border-b border-emerald-500/20 text-emerald-200'
            : 'bg-emerald-50 border-b border-emerald-200 text-emerald-950',
          illustrationBg: isDark ? 'text-emerald-400' : 'text-emerald-600',
          primaryBtn: isDark
            ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950'
            : 'bg-emerald-600 hover:bg-emerald-700 text-white',
          secondaryBtn: isDark
            ? 'text-emerald-300 hover:bg-emerald-500/15'
            : 'text-emerald-800 hover:bg-emerald-100',
          defaultIcon: <AlertCircle className="h-5 w-5 shrink-0" />,
        };
      case 'neutral':
      default:
        return {
          container: isDark
            ? 'bg-neutral-900/90 border-b border-white/10 text-neutral-100'
            : 'bg-slate-50 border-b border-slate-200 text-slate-900',
          illustrationBg: isDark ? 'text-neutral-300' : 'text-slate-700',
          primaryBtn: isDark
            ? 'bg-white hover:bg-neutral-200 text-neutral-950'
            : 'bg-slate-900 hover:bg-slate-800 text-white',
          secondaryBtn: isDark
            ? 'text-neutral-300 hover:bg-white/10'
            : 'text-slate-700 hover:bg-slate-200',
          defaultIcon: <Info className="h-5 w-5 shrink-0" />,
        };
    }
  };

  const style = getVariantStyles();

  if (isDismissed) {
    return null;
  }

  return (
    <aside
      role="status"
      aria-live="polite"
      className={cn(
        'w-full shrink-0 px-4 py-3 select-none transition-all duration-200 flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-1 border-x-0 border-t-0 rounded-none',
        style.container,
        props.className,
      )}
    >
      <div className="flex items-start gap-3">
        {/* 1. Supporting Illustration Area (M3 Slot 1) */}
        <div className={cn('mt-0.5 shrink-0', style.illustrationBg)}>
          {props.illustration ?? style.defaultIcon}
        </div>

        {/* 2. Content Area (M3 Slot 2: Primary Message + Supporting Message) */}
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-[13px] font-bold tracking-tight leading-snug">
            {props.primaryText}
          </p>

          {props.supportingText && (
            <p className="text-[11.5px] font-normal leading-relaxed opacity-90 mt-0.5">
              {props.supportingText}
            </p>
          )}
        </div>

        {/* Dismiss Button */}
        {props.dismissible && (
          <button
            type="button"
            aria-label="Tutup banner"
            onClick={() => {
              setIsDismissed(true);
              props.onDismiss?.();
            }}
            className="p-1 -mr-1 -mt-0.5 rounded-full opacity-60 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 3. Action Area (M3 Slot 3: Buttons at bottom-right) */}
      {(props.primaryAction || props.secondaryAction) && (
        <div className="flex items-center justify-end gap-2 pt-0.5">
          {props.secondaryAction && (
            <button
              type="button"
              onClick={props.secondaryAction.onClick}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-semibold tracking-tight transition-colors cursor-pointer active:scale-95',
                style.secondaryBtn,
              )}
            >
              {props.secondaryAction.label}
            </button>
          )}

          {props.primaryAction && (
            <button
              type="button"
              onClick={props.primaryAction.onClick}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-bold tracking-tight transition-all cursor-pointer active:scale-95 shadow-2xs',
                style.primaryBtn,
              )}
            >
              {props.primaryAction.label}
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
