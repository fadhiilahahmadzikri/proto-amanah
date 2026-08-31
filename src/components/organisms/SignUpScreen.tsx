'use client';

import { Mail, Phone, User } from 'lucide-react';
import type React from 'react';
import { Button } from '@/components/atoms/Button';
import { FormField } from '@/components/molecules/FormField';
import { PasswordInput } from '@/components/molecules/PasswordInput';
import { SocialButton } from '@/components/molecules/SocialButton';
import { MobileAuthTemplate } from '@/components/templates/MobileAuthTemplate';
import contentData from '@/data/auth/content.json';
import type { AuthFormData, AuthValidationErrors } from '@/types/auth.types';

import { cn } from '@/lib/utils';

export function SignUpScreen(props: {
  formData: AuthFormData;
  errors: AuthValidationErrors;
  isLoading: boolean;
  onInputChange: (field: keyof AuthFormData, value: string) => void;
  onSubmit: (event?: React.SyntheticEvent) => void;
  onGoToLogin: () => void;
  onClose: () => void;
  theme?: 'dark' | 'light';
}) {
  const content = contentData.signUp;
  const isDark = props.theme === 'dark';

  return (
    <MobileAuthTemplate
      showClose
      onClose={props.onClose}
      theme={props.theme}
    >
      <div className="flex flex-col gap-4 pt-1 pb-4">
        {/* Title */}
        <div className="flex flex-col gap-1">
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
            {content.subtitle}
          </p>
        </div>

        {/* Registration Form (Clean & Minimalist without redundant labels) */}
        <form onSubmit={props.onSubmit} className="flex flex-col gap-2.5">
          <FormField
            id="signup-fullname"
            placeholder={content.fullNamePlaceholder}
            value={props.formData.fullName}
            onChange={(e) => {
              props.onInputChange('fullName', e.target.value);
            }}
            startIcon={<User className="h-4 w-4 text-neutral-400" />}
            error={props.errors.fullName}
            autoComplete="name"
            theme={props.theme}
          />

          <FormField
            id="signup-email"
            type="email"
            placeholder={content.emailPlaceholder}
            value={props.formData.email}
            onChange={(e) => {
              props.onInputChange('email', e.target.value);
            }}
            startIcon={<Mail className="h-4 w-4 text-neutral-400" />}
            error={props.errors.email}
            autoComplete="email"
            theme={props.theme}
          />

          <FormField
            id="signup-phone"
            type="tel"
            placeholder={content.phonePlaceholder}
            value={props.formData.phone}
            onChange={(e) => {
              props.onInputChange('phone', e.target.value);
            }}
            startIcon={<Phone className="h-4 w-4 text-neutral-400" />}
            error={props.errors.phone}
            autoComplete="tel"
            theme={props.theme}
          />

          <PasswordInput
            id="signup-password"
            placeholder={content.passwordPlaceholder}
            value={props.formData.password}
            onChange={(e) => {
              props.onInputChange('password', e.target.value);
            }}
            error={props.errors.password}
            showStrength
            autoComplete="new-password"
            theme={props.theme}
          />

          <PasswordInput
            id="signup-confirm-password"
            placeholder={content.confirmPasswordPlaceholder}
            value={props.formData.confirmPassword}
            onChange={(e) => {
              props.onInputChange('confirmPassword', e.target.value);
            }}
            error={props.errors.confirmPassword}
            autoComplete="new-password"
            theme={props.theme}
          />

          {/* Primary Submit Action & Alternative Options */}
          <div className="flex flex-col gap-2.5 pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              isLoading={props.isLoading}
              className="shadow-md shadow-neutral-900/10 font-semibold"
            >
              {content.submitButton}
            </Button>

            <div className="relative flex items-center justify-center my-0.5">
              <div className={cn(
                'w-full border-t transition-colors',
                isDark ? 'border-white/10' : 'border-neutral-200',
              )} />
              <span className={cn(
                'absolute px-3 text-[11px] font-medium transition-colors',
                isDark ? 'bg-[#0a0e1a] text-neutral-400' : 'bg-white text-neutral-400',
              )}>
                {content.dividerText}
              </span>
            </div>

            <SocialButton
              provider="google"
              label={content.continueWithGoogle}
              onClick={() => {}}
              theme={props.theme}
            />
          </div>
        </form>

        {/* Footer Navigation */}
        <div className={cn(
          'flex items-center justify-center gap-1.5 text-xs pt-1 transition-colors',
          isDark ? 'text-neutral-400' : 'text-neutral-500',
        )}>
          <span>{content.alreadyHaveAccount}</span>
          <button
            type="button"
            onClick={props.onGoToLogin}
            className={cn(
              'font-semibold hover:underline focus:outline-none cursor-pointer transition-colors',
              isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-[#0d66e9] hover:text-blue-700',
            )}
          >
            {content.signInLink}
          </button>
        </div>
      </div>
    </MobileAuthTemplate>
  );
}
