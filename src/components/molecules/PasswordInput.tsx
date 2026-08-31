'use client';

import { Eye, EyeOff, Lock } from 'lucide-react';
import React from 'react';
import { Input } from '@/components/atoms/Input';
import { PasswordStrengthTicker } from '@/components/molecules/PasswordStrengthTicker';
import { cn } from '@/lib/utils';

export function PasswordInput(props: {
  id?: string;
  name?: string;
  label?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  helperText?: string;
  theme?: 'dark' | 'light';
  className?: string;
  showStrength?: boolean;
}) {
  const [showPassword, setShowPassword] = React.useState(false);
  const value = props.value ?? '';
  const isDark = props.theme === 'dark';

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', props.className)}>
      {props.label && (
        <label
          htmlFor={props.id}
          className={cn(
            'text-xs font-semibold tracking-wide pl-1 transition-colors',
            isDark ? 'text-neutral-300' : 'text-neutral-700',
          )}
        >
          {props.label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <Input
        id={props.id}
        name={props.name}
        type={showPassword ? 'text' : 'password'}
        value={props.value}
        placeholder={props.placeholder ?? 'Masukkan password'}
        disabled={props.disabled}
        required={props.required}
        autoComplete={props.autoComplete ?? 'current-password'}
        onChange={props.onChange}
        startIcon={<Lock className="h-4 w-4 text-neutral-400" />}
        endIcon={(
          <button
            type="button"
            tabIndex={-1}
            onClick={() => {
              setShowPassword(prev => !prev);
            }}
            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            className={cn(
              'transition-colors p-1 rounded-full focus:outline-none cursor-pointer',
              isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-400 hover:text-neutral-700',
            )}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
        error={props.error}
        theme={props.theme}
      />
      {props.showStrength && value.length > 0 && (
        <div className="mt-0.5">
          <PasswordStrengthTicker password={value} theme={props.theme} />
        </div>
      )}
      {props.helperText && !props.error && (
        <p className={cn(
          'text-[11px] pl-1',
          isDark ? 'text-neutral-400' : 'text-neutral-500',
        )}>
          {props.helperText}
        </p>
      )}
    </div>
  );
}
