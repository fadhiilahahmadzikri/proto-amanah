'use client';

import { Button } from '@/components/atoms/Button';
import { LottieCheckAnimation } from '@/components/molecules/LottieCheckAnimation';
import { MobileAuthTemplate } from '@/components/templates/MobileAuthTemplate';
import contentData from '@/data/auth/content.json';

import { cn } from '@/lib/utils';

export function SuccessScreen(props: {
  onLogin: () => void;
  onClose: () => void;
  theme?: 'dark' | 'light';
}) {
  const content = contentData.success;
  const isDark = props.theme === 'dark';

  return (
    <MobileAuthTemplate
      showClose
      showBack={false}
      onClose={props.onClose}
      theme={props.theme}
    >
      <div className="flex flex-col items-center justify-center gap-6 pt-6 sm:pt-8 pb-4 text-center">
        {/* 3D Game Emblem Shield Checkmark Visual Feedback */}
        <div className="pt-4 sm:pt-6">
          <LottieCheckAnimation size={124} theme={props.theme} />
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className={cn(
            'text-2xl leading-snug font-bold tracking-tight transition-colors',
            isDark ? 'text-white' : 'text-neutral-900',
          )}>
            {content.title}
          </h2>
          <p className={cn(
            'mx-auto max-w-[270px] text-xs leading-relaxed transition-colors',
            isDark ? 'text-neutral-400' : 'text-neutral-500',
          )}>
            {content.subtitle}
          </p>
        </div>

        {/* Action Button close to content */}
        <div className="w-full pt-2">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={props.onLogin}
            className="font-semibold shadow-md shadow-neutral-900/10"
          >
            {content.loginButton}
          </Button>
        </div>
      </div>
    </MobileAuthTemplate>
  );
}
