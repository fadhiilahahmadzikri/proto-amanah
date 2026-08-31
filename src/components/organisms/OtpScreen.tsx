'use client';

import { CheckCircle2, RotateCw } from 'lucide-react';
import type React from 'react';
import { Button } from '@/components/atoms/Button';
import { OtpInput } from '@/components/molecules/OtpInput';
import { MobileAuthTemplate } from '@/components/templates/MobileAuthTemplate';
import contentData from '@/data/auth/content.json';
import type { AuthFormData, AuthValidationErrors } from '@/types/auth.types';

import { cn } from '@/lib/utils';

export function OtpScreen(props: {
  formData: AuthFormData;
  errors: AuthValidationErrors;
  isLoading: boolean;
  isResending: boolean;
  countdownSeconds: number;
  canResend: boolean;
  onOtpChange: (otp: string) => void;
  onOtpComplete: (otp: string) => void;
  onSubmit: (event?: React.SyntheticEvent) => void;
  onResend: () => void;
  onBack: () => void;
  onClose: () => void;
  statusMessage?: string | null;
  theme?: 'dark' | 'light';
}) {
  const content = contentData.otp;
  const isDark = props.theme === 'dark';

  const minutes = Math.floor(props.countdownSeconds / 60);
  const seconds = props.countdownSeconds % 60;
  const formattedCountdown = `${String(minutes).padStart(2, '0')}:${String(
    seconds,
  ).padStart(2, '0')}`;

  const emailDisplay = props.formData.email || 'emailmu';

  return (
    <MobileAuthTemplate
      showBack
      showClose
      onBack={props.onBack}
      onClose={props.onClose}
      theme={props.theme}
    >
      <div className="flex flex-col gap-5 pb-4">
        {/* Header & Subtitle */}
        <div className="flex flex-col gap-1.5">
          <h2 className={cn(
            'text-2xl font-bold tracking-tight leading-snug transition-colors',
            isDark ? 'text-white' : 'text-neutral-900',
          )}>
            {content.title}
          </h2>
          <p className={cn(
            'text-xs leading-relaxed transition-colors',
            isDark ? 'text-neutral-400' : 'text-neutral-500',
          )}>
            {content.subtitle}{' '}
            <span className={cn(
              'font-semibold transition-colors',
              isDark ? 'text-neutral-200' : 'text-neutral-800',
            )}>
              {emailDisplay}
            </span>
          </p>
        </div>

        {/* OTP Grid Input & Submit Button in Natural Compact Flow */}
        <form onSubmit={props.onSubmit} className="flex flex-col gap-4 pt-1">
          <OtpInput
            value={props.formData.otp}
            length={6}
            disabled={props.isLoading || props.isResending}
            onChange={props.onOtpChange}
            onComplete={props.onOtpComplete}
            error={props.errors.otp}
            theme={props.theme}
          />

          {/* Resend OTP Area */}
          <div className="flex flex-col items-center justify-center min-h-[32px]">
            {props.canResend ? (
              <button
                type="button"
                onClick={props.onResend}
                disabled={props.isResending}
                className={cn(
                  'inline-flex items-center gap-1.5 text-xs font-semibold p-1.5 transition-colors cursor-pointer disabled:opacity-50',
                  isDark
                    ? 'text-neutral-200 hover:text-white'
                    : 'text-neutral-800 hover:text-neutral-950',
                )}
              >
                <RotateCw className={`h-3.5 w-3.5 ${props.isResending ? 'animate-spin' : ''}`} />
                <span>
                  {props.isResending
                    ? content.resendingText
                    : content.resendButton}
                </span>
              </button>
            ) : (
              <div className={cn(
                'flex items-center gap-1 text-xs font-medium transition-colors',
                isDark ? 'text-neutral-400' : 'text-neutral-500',
              )}>
                <span>{content.resendCountdownPrefix}</span>
                <span className={cn(
                  'font-bold tabular-nums transition-colors',
                  isDark ? 'text-white' : 'text-neutral-900',
                )}>
                  {formattedCountdown}
                </span>
              </div>
            )}
          </div>

          {/* In-place Toast / Status Feedback */}
          {props.statusMessage && (
            <div className={cn(
              'flex items-center justify-center gap-1.5 text-xs font-medium py-2 px-3 rounded-xl border animate-in fade-in slide-in-from-top-1 transition-colors',
              isDark
                ? 'text-emerald-300 bg-emerald-950/60 border-emerald-500/30'
                : 'text-emerald-700 bg-emerald-50 border-emerald-200/60',
            )}>
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{props.statusMessage}</span>
            </div>
          )}

          {/* Submit Action Button directly below OTP */}
          <div className="pt-1">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              isLoading={props.isLoading}
              disabled={props.formData.otp.length < 6}
              className="shadow-md shadow-neutral-900/10 font-semibold"
            >
              {content.submitButton}
            </Button>
          </div>
        </form>
      </div>
    </MobileAuthTemplate>
  );
}
