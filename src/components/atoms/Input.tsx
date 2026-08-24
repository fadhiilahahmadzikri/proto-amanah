import type React from 'react';
import { cn } from '@/lib/utils';

export function Input(props: {
  id?: string;
  name?: string;
  type?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  error?: string;
  className?: string;
  inputClassName?: string;
}) {
  return (
    <div className={cn('relative w-full', props.className)}>
      <div
        className={cn(
          'group flex items-center w-full rounded-2xl border bg-neutral-50/70 px-4 py-3.5 transition-all duration-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-neutral-950/10 focus-within:border-neutral-950',
          props.error
            ? 'border-red-400 bg-red-50/30 focus-within:border-red-600 focus-within:ring-red-500/10'
            : 'border-neutral-200/90 hover:border-neutral-300',
          props.disabled ? 'opacity-60 bg-neutral-100 cursor-not-allowed' : '',
        )}
      >
        {props.startIcon && (
          <span className="mr-3 shrink-0 text-neutral-400 flex items-center justify-center transition-colors group-focus-within:text-neutral-900">
            {props.startIcon}
          </span>
        )}
        <input
          id={props.id}
          name={props.name}
          type={props.type ?? 'text'}
          value={props.value}
          defaultValue={props.defaultValue}
          placeholder={props.placeholder}
          disabled={props.disabled}
          readOnly={props.readOnly}
          required={props.required}
          autoFocus={props.autoFocus}
          autoComplete={props.autoComplete}
          onChange={props.onChange}
          onKeyDown={props.onKeyDown}
          className={cn(
            'w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none disabled:cursor-not-allowed',
            props.inputClassName,
          )}
        />
        {props.endIcon && (
          <span className="ml-2 shrink-0 flex items-center justify-center">
            {props.endIcon}
          </span>
        )}
      </div>
      {props.error && (
        <p className="mt-1.5 text-xs text-red-600 font-medium pl-1 animate-in fade-in slide-in-from-top-1">
          {props.error}
        </p>
      )}
    </div>
  );
}
