'use client';

import type React from 'react';
import { Button } from '@/components/atoms/Button';
import { PasswordInput } from '@/components/molecules/PasswordInput';
import { MobileAuthTemplate } from '@/components/templates/MobileAuthTemplate';
import contentData from '@/data/auth/content.json';
import type { AuthFormData, AuthValidationErrors } from '@/types/auth.types';

import { cn } from '@/lib/utils';

export function ChangePasswordScreen(props: {
  formData: AuthFormData;
  errors: AuthValidationErrors;
  isLoading: boolean;
  onInputChange: (field: keyof AuthFormData, value: string) => void;
  onSubmit: (event?: React.SyntheticEvent) => void;
  onBack: () => void;
  onClose: () => void;
  theme?: 'dark' | 'light';
}) {
  const content = contentData.changePassword;
  const isDark = props.theme === 'dark';

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
            {content.subtitle}
          </p>
        </div>

        {/* New Password Form & Action Button close together */}
        <form onSubmit={props.onSubmit} className="flex flex-col gap-3 pt-1">
          <PasswordInput
            id="new-password"
            placeholder={content.newPasswordPlaceholder}
            value={props.formData.newPassword}
            onChange={(e) => {
              props.onInputChange('newPassword', e.target.value);
            }}
            error={props.errors.newPassword}
            showStrength
            autoComplete="new-password"
            theme={props.theme}
          />

          <PasswordInput
            id="confirm-new-password"
            placeholder={content.confirmPasswordPlaceholder}
            value={props.formData.confirmNewPassword}
            onChange={(e) => {
              props.onInputChange('confirmNewPassword', e.target.value);
            }}
            error={props.errors.confirmNewPassword}
            autoComplete="new-password"
            theme={props.theme}
          />

          <div className="pt-2">
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
          </div>
        </form>
      </div>
    </MobileAuthTemplate>
  );
}
