import type React from 'react';
import { Input } from '@/components/atoms/Input';
import { cn } from '@/lib/utils';

export function FormField(props: {
  id?: string;
  name?: string;
  label?: string;
  type?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  error?: string;
  helperText?: string;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const isDark = props.theme === 'dark';

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', props.className)}>
      {props.label && (
        <label
          htmlFor={props.id}
          className={cn(
            'pl-1 text-xs font-semibold tracking-wide transition-colors',
            isDark ? 'text-neutral-300' : 'text-neutral-700',
          )}
        >
          {props.label}
          {props.required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <Input
        id={props.id}
        name={props.name}
        type={props.type}
        value={props.value}
        placeholder={props.placeholder}
        disabled={props.disabled}
        required={props.required}
        autoFocus={props.autoFocus}
        autoComplete={props.autoComplete}
        onChange={props.onChange}
        startIcon={props.startIcon}
        endIcon={props.endIcon}
        error={props.error}
        theme={props.theme}
      />
      {props.helperText && !props.error && (
        <p className={cn(
          'pl-1 text-[11px]',
          isDark ? 'text-neutral-400' : 'text-neutral-500',
        )}>
          {props.helperText}
        </p>
      )}
    </div>
  );
}
