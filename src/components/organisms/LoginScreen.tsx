'use client';

import { Mail } from 'lucide-react';
import type React from 'react';
import { Button } from '@/components/atoms/Button';
import { FormField } from '@/components/molecules/FormField';
import { PasswordInput } from '@/components/molecules/PasswordInput';
import { SocialButton } from '@/components/molecules/SocialButton';
import { MobileAuthTemplate } from '@/components/templates/MobileAuthTemplate';
import contentData from '@/data/auth/content.json';
import type { AuthFormData, AuthValidationErrors } from '@/types/auth.types';

export function LoginScreen(props: {
  formData: AuthFormData;
  errors: AuthValidationErrors;
  isLoading: boolean;
  onInputChange: (field: keyof AuthFormData, value: string) => void;
  onSubmit: (event?: React.SyntheticEvent) => void;
  onForgotPassword: () => void;
  onGoToSignUp: () => void;
  onClose: () => void;
}) {
  const content = contentData.login;

  return (
    <MobileAuthTemplate
      showClose
      onClose={props.onClose}
    >
      <div className="flex flex-col gap-5 pt-1 pb-4">
        {/* Screen Title & Subtitle */}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 leading-snug">
            {content.title}
          </h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            {content.subtitle}
          </p>
        </div>

        {/* Credentials Form (Clean & Minimalist without redundant labels) */}
        <form onSubmit={props.onSubmit} className="flex flex-col gap-3">
          <FormField
            id="login-email"
            placeholder={content.emailOrPhonePlaceholder}
            value={props.formData.emailOrPhone}
            onChange={(e) => {
              props.onInputChange('emailOrPhone', e.target.value);
            }}
            startIcon={<Mail className="h-4 w-4 text-neutral-400" />}
            error={props.errors.emailOrPhone}
            autoComplete="username"
          />

          <div className="flex flex-col gap-1">
            <PasswordInput
              id="login-password"
              placeholder={content.passwordPlaceholder}
              value={props.formData.password}
              onChange={(e) => {
                props.onInputChange('password', e.target.value);
              }}
              error={props.errors.password}
              autoComplete="current-password"
            />

            {/* Forgot Password Link */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={props.onForgotPassword}
                className="text-xs font-semibold text-[#0d66e9] hover:text-blue-700 hover:underline transition-colors focus:outline-none cursor-pointer"
              >
                {content.forgotPasswordLink}
              </button>
            </div>
          </div>

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

            {/* Divider */}
            <div className="relative flex items-center justify-center my-1">
              <div className="w-full border-t border-neutral-200" />
              <span className="absolute bg-white px-3 text-[11px] text-neutral-400 font-medium">
                {content.dividerText}
              </span>
            </div>

            <SocialButton
              provider="google"
              label={content.continueWithGoogle}
              onClick={() => {}}
            />
          </div>
        </form>

        {/* Footer Navigation */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 pt-1">
          <span>{content.dontHaveAccount}</span>
          <button
            type="button"
            onClick={props.onGoToSignUp}
            className="font-semibold text-[#0d66e9] hover:text-blue-700 hover:underline focus:outline-none cursor-pointer"
          >
            {content.signUpLink}
          </button>
        </div>
      </div>
    </MobileAuthTemplate>
  );
}
