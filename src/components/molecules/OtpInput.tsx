'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function OtpInput(props: {
  value: string;
  length?: number;
  onChange: (otp: string) => void;
  onComplete?: (otp: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}) {
  const digitsCount = props.length ?? 6;
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const otpArray = Array.from({ length: digitsCount }, (_, i) => {
    return props.value[i] ?? '';
  });

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const rawVal = event.target.value;
    const sanitized = rawVal.replace(/\D/g, '');

    if (!sanitized) {
      const nextOtp = Array.from(props.value);
      nextOtp[index] = '';
      const updated = nextOtp.join('');
      props.onChange(updated);
      return;
    }

    if (sanitized.length > 1) {
      const pastedDigits = sanitized.slice(0, digitsCount);
      props.onChange(pastedDigits);
      if (pastedDigits.length === digitsCount && props.onComplete) {
        props.onComplete(pastedDigits);
      }
      const nextFocusIndex = Math.min(pastedDigits.length, digitsCount - 1);
      inputRefs.current[nextFocusIndex]?.focus();
      return;
    }

    const nextOtp = Array.from(props.value);
    nextOtp[index] = sanitized;
    const updated = nextOtp.join('');
    props.onChange(updated);

    if (index < digitsCount - 1 && sanitized) {
      inputRefs.current[index + 1]?.focus();
    }

    if (updated.length === digitsCount && props.onComplete) {
      props.onComplete(updated);
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Backspace') {
      if (!props.value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowRight' && index < digitsCount - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text').replace(/\D/g, '');
    if (pastedData) {
      const slice = pastedData.slice(0, digitsCount);
      props.onChange(slice);
      if (slice.length === digitsCount && props.onComplete) {
        props.onComplete(slice);
      }
      const nextFocusIndex = Math.min(slice.length, digitsCount - 1);
      inputRefs.current[nextFocusIndex]?.focus();
    }
  };

  return (
    <div className={cn('flex flex-col items-center gap-2 w-full', props.className)}>
      <div className="flex items-center justify-between gap-2 w-full max-w-[340px]">
        {otpArray.map((digit, index) => {
          const isFilled = digit.length > 0;
          return (
            <input
              key={`otp-digit-${index}`}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={digitsCount}
              value={digit}
              disabled={props.disabled}
              onChange={(e) => {
                handleInputChange(index, e);
              }}
              onKeyDown={(e) => {
                handleKeyDown(index, e);
              }}
              onPaste={handlePaste}
              autoFocus={index === 0}
              aria-label={`Digit ke ${index + 1}`}
              className={cn(
                'h-13 w-11 sm:h-14 sm:w-12 text-center text-xl font-bold rounded-2xl border transition-all duration-200 focus:outline-none',
                isFilled
                  ? 'border-neutral-900 bg-neutral-50 text-neutral-950 shadow-2xs ring-1 ring-neutral-900/10'
                  : 'border-neutral-200/90 bg-neutral-50/70 text-neutral-900 hover:border-neutral-300',
                props.error
                  ? 'border-red-400 bg-red-50/40 text-red-700 ring-2 ring-red-500/20'
                  : 'focus:border-neutral-950 focus:bg-white focus:ring-2 focus:ring-neutral-950/15',
                props.disabled ? 'opacity-50 cursor-not-allowed bg-neutral-100' : '',
              )}
            />
          );
        })}
      </div>
      {props.error && (
        <p className="mt-1 text-center text-xs font-medium text-red-600 animate-in fade-in slide-in-from-top-1">
          {props.error}
        </p>
      )}
    </div>
  );
}
