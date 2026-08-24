'use client';

import type React from 'react';
import { Button } from '@/components/atoms/Button';
import { PasswordInput } from '@/components/molecules/PasswordInput';
import { MobileAuthTemplate } from '@/components/templates/MobileAuthTemplate';
import contentData from '@/data/auth/content.json';
import type { AuthFormData, AuthValidationErrors } from '@/types/auth.types';

export function ChangePasswordScreen(props: {
  formData: AuthFormData;
  errors: AuthValidationErrors;
  isLoading: boolean;
  onInputChange: (field: keyof AuthFormData, value: string) => void;
  onSubmit: (event?: React.SyntheticEvent) => void;
  onBack: () => void;
  onClose: () => void;
}) {
  const content = contentData.changePassword;

  return (
    <MobileAuthTemplate
      showBack
      showClose
      onBack={props.onBack}
      onClose={props.onClose}
    >
      <div className="flex flex-col gap-5 pt-1 pb-4">
        {/* Header & Subtitle */}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 leading-snug">
            {content.title}
          </h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
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
