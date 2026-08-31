'use client';

import { Mail } from 'lucide-react';
import type React from 'react';
import { Button } from '@/components/atoms/Button';
import { FormField } from '@/components/molecules/FormField';
import { MobileAuthTemplate } from '@/components/templates/MobileAuthTemplate';
import contentData from '@/data/auth/content.json';
import type { AuthFormData, AuthValidationErrors } from '@/types/auth.types';

import { cn } from '@/lib/utils';

export function ForgotPasswordScreen(props: {
  formData: AuthFormData;
  errors: AuthValidationErrors;
  isLoading: boolean;
  onInputChange: (field: keyof AuthFormData, value: string) => void;
  onSubmit: (event?: React.SyntheticEvent) => void;
  onBack: () => void;
  onClose: () => void;
  theme?: 'dark' | 'light';
}) {
  const content = contentData.forgotPassword;
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

        {/* Form & Submit Button close together in natural flow */}
        <form onSubmit={props.onSubmit} className="flex flex-col gap-3 pt-1">
          <FormField
            id="forgot-email"
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
