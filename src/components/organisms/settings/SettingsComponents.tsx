'use client';

import { ChevronRight } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Section container with clean Android-style header.
 * @param props Component properties.
 * @returns React node for the settings section.
 */
export function SettingSection(props: {
  title: string;
  isDark: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <span
        className={cn(
          'text-xs font-semibold px-1 mb-1.5',
          props.isDark ? 'text-neutral-400' : 'text-slate-500',
        )}
      >
        {props.title}
      </span>
      <div
        className={cn(
          'rounded-2xl border divide-y overflow-hidden transition-colors',
          props.isDark
            ? 'bg-[#111624] border-white/5 divide-white/5'
            : 'bg-white border-slate-100 divide-slate-100 shadow-2xs',
        )}
      >
        {props.children}
      </div>
    </div>
  );
}

/**
 * Standard label and value display row.
 * @param props Component properties.
 * @returns React node for the info row.
 */
export function SettingInfoRow(props: {
  label: string;
  value: string;
  isDark: boolean;
  isHighlighted?: boolean;
}) {
  let valueColor = props.isDark ? 'text-white' : 'text-slate-900';
  if (props.isHighlighted) {
    valueColor = props.isDark ? 'text-emerald-400' : 'text-emerald-600';
  }

  return (
    <div className="flex flex-col px-4 py-3 gap-0.5">
      <span
        className={cn(
          'text-[11px] font-medium',
          props.isDark ? 'text-neutral-400' : 'text-slate-500',
        )}
      >
        {props.label}
      </span>
      <span className={cn('text-[13px] font-semibold tracking-tight', valueColor)}>
        {props.value}
      </span>
    </div>
  );
}

/**
 * Interactive editable row for native Android setting edit behavior with harmonized trailing Chevron.
 * @param props Component properties.
 * @returns React node for the editable row.
 */
export function SettingEditableRow(props: {
  label: string;
  value: string;
  onEdit: () => void;
  isDark: boolean;
  helperText?: string;
}) {
  return (
    <button
      type="button"
      onClick={props.onEdit}
      className={cn(
        'flex items-center justify-between w-full text-left px-4 py-3 gap-3 cursor-pointer transition-colors select-none group',
        props.isDark ? 'hover:bg-white/5 active:bg-white/10' : 'hover:bg-slate-50 active:bg-slate-100',
      )}
    >
      <div className="flex flex-col flex-1 min-w-0 gap-0.5">
        <span
          className={cn(
            'text-[11px] font-medium',
            props.isDark ? 'text-neutral-400' : 'text-slate-500',
          )}
        >
          {props.label}
        </span>
        <span
          className={cn(
            'text-[13px] font-semibold tracking-tight truncate',
            props.isDark ? 'text-white' : 'text-slate-900',
          )}
        >
          {props.value}
        </span>
        {props.helperText && (
          <span
            className={cn(
              'text-[10.5px] mt-0.5',
              props.isDark ? 'text-neutral-400' : 'text-slate-500',
            )}
          >
            {props.helperText}
          </span>
        )}
      </div>

      <ChevronRight
        className={cn(
          'h-4 w-4 shrink-0 transition-opacity opacity-40 group-hover:opacity-80',
          props.isDark ? 'text-neutral-400' : 'text-slate-400',
        )}
      />
    </button>
  );
}

/**
 * Navigable setting row that opens a sub-screen with harmonized trailing Chevron.
 * @param props Component properties.
 * @returns React node for the navigation row.
 */
export function SettingNavRow(props: {
  category?: string;
  title: string;
  subtitle?: string;
  onClick: () => void;
  isDark: boolean;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={cn(
        'flex items-center justify-between w-full text-left px-4 py-3 gap-3 transition-colors cursor-pointer select-none group',
        props.isDark ? 'hover:bg-white/5 active:bg-white/10' : 'hover:bg-slate-50 active:bg-slate-100',
      )}
    >
      <div className="flex flex-col flex-1 min-w-0 gap-0.5">
        {props.category && (
          <span
            className={cn(
              'text-[10.5px] font-semibold',
              props.isDark ? 'text-sky-400' : 'text-blue-600',
            )}
          >
            {props.category}
          </span>
        )}
        <span
          className={cn(
            'text-[12.5px] font-semibold tracking-tight leading-snug',
            props.isDark ? 'text-white' : 'text-slate-900',
          )}
        >
          {props.title}
        </span>
        {props.subtitle && (
          <span
            className={cn(
              'text-[11px] mt-0.5',
              props.isDark ? 'text-neutral-400' : 'text-slate-500',
            )}
          >
            {props.subtitle}
          </span>
        )}
      </div>

      <ChevronRight
        className={cn(
          'h-4 w-4 shrink-0 transition-opacity opacity-40 group-hover:opacity-80',
          props.isDark ? 'text-neutral-400' : 'text-slate-400',
        )}
      />
    </button>
  );
}

/**
 * Label and right-aligned value row.
 * @param props Component properties.
 * @returns React node for the horizontal info row.
 */
export function SettingHorizontalRow(props: {
  label: string;
  value: string;
  isDark: boolean;
  isBold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span
        className={cn(
          'text-[11px] font-medium',
          props.isDark ? 'text-neutral-400' : 'text-slate-500',
        )}
      >
        {props.label}
      </span>
      <span
        className={cn(
          'text-[13px] tracking-tight',
          props.isBold ? 'font-bold' : 'font-semibold',
          props.isDark ? 'text-white' : 'text-slate-900',
        )}
      >
        {props.value}
      </span>
    </div>
  );
}

/**
 * Native Android-style toggle switch row.
 * @param props Component properties.
 * @returns React node for the toggle row.
 */
export function SettingToggleRow(props: {
  title: string;
  subtitle: string;
  checked: boolean;
  onToggle: () => void;
  isDark: boolean;
}) {
  let switchBg = 'bg-slate-300';
  if (props.checked) {
    switchBg = 'bg-[#0d66e9]';
  } else if (props.isDark) {
    switchBg = 'bg-white/20';
  }

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex flex-col pr-4">
        <span
          className={cn(
            'text-[13px] font-semibold tracking-tight',
            props.isDark ? 'text-white' : 'text-slate-900',
          )}
        >
          {props.title}
        </span>
        <span
          className={cn(
            'text-[11px] mt-0.5',
            props.isDark ? 'text-neutral-400' : 'text-slate-500',
          )}
        >
          {props.subtitle}
        </span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={props.checked}
        aria-label={props.title}
        onClick={props.onToggle}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none',
          switchBg,
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition duration-200 ease-in-out mt-0.5',
            props.checked ? 'translate-x-5.5' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  );
}

/**
 * Setting action button row (e.g. Clear Cache, Export).
 * @param props Component properties.
 * @returns React node for the action row.
 */
export function SettingActionRow(props: {
  title: string;
  subtitle: string;
  actionLabel: string;
  onAction: () => void;
  isDark: boolean;
  disabled?: boolean;
  isSuccess?: boolean;
}) {
  let buttonStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
  if (props.isSuccess) {
    buttonStyle = props.isDark
      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
      : 'bg-emerald-50 border-emerald-200 text-emerald-700';
  } else if (props.isDark) {
    buttonStyle = 'bg-white/5 border-white/10 text-neutral-200 hover:bg-white/10';
  }

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex flex-col pr-3">
        <span
          className={cn(
            'text-[13px] font-semibold tracking-tight',
            props.isDark ? 'text-white' : 'text-slate-900',
          )}
        >
          {props.title}
        </span>
        <span
          className={cn(
            'text-[11px] mt-0.5',
            props.isDark ? 'text-neutral-400' : 'text-slate-500',
          )}
        >
          {props.subtitle}
        </span>
      </div>
      <button
        type="button"
        onClick={props.onAction}
        disabled={props.disabled}
        className={cn(
          'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer select-none active:scale-95 shrink-0',
          buttonStyle,
        )}
      >
        {props.actionLabel}
      </button>
    </div>
  );
}

/**
 * Native Android-style modal dialog for editing a single setting value.
 * @param props Component properties.
 * @returns React node for the dialog.
 */
export function SettingEditDialog(props: {
  title: string;
  label: string;
  value: string;
  inputType?: string;
  placeholder?: string;
  onSave: (newValue: string) => void;
  onClose: () => void;
  isDark: boolean;
}) {
  const [draft, setDraft] = React.useState(props.value);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className={cn(
          'w-full max-w-[320px] rounded-3xl p-5 border shadow-2xl flex flex-col gap-4',
          props.isDark
            ? 'bg-[#111624] border-white/10 text-white'
            : 'bg-white border-slate-200 text-slate-900',
        )}
      >
        <div className="flex flex-col gap-1">
          <h4 className="text-sm font-bold tracking-tight">{props.title}</h4>
          <span
            className={cn(
              'text-xs',
              props.isDark ? 'text-neutral-400' : 'text-slate-500',
            )}
          >
            {props.label}
          </span>
        </div>

        <input
          type={props.inputType ?? 'text'}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={props.placeholder}
          autoFocus
          className={cn(
            'w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-none transition-colors',
            props.isDark
              ? 'bg-white/5 border-white/10 text-white focus:border-sky-400'
              : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600',
          )}
        />

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={props.onClose}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer',
              props.isDark ? 'text-neutral-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100',
            )}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              props.onSave(draft);
              props.onClose();
            }}
            className={cn(
              'px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-transform active:scale-95',
              props.isDark
                ? 'bg-sky-500 text-white hover:bg-sky-400'
                : 'bg-blue-600 text-white hover:bg-blue-700',
            )}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
