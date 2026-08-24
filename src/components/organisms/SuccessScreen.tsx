'use client';

import { Button } from '@/components/atoms/Button';
import { LottieCheckAnimation } from '@/components/molecules/LottieCheckAnimation';
import { MobileAuthTemplate } from '@/components/templates/MobileAuthTemplate';
import contentData from '@/data/auth/content.json';

export function SuccessScreen(props: { onLogin: () => void; onClose: () => void }) {
  const content = contentData.success;

  return (
    <MobileAuthTemplate showClose showBack={false} onClose={props.onClose}>
      <div className="flex flex-col items-center justify-center gap-5 pt-2 pb-4 text-center">
        {/* Lottie Animation Visual Feedback */}
        <div className="pt-2">
          <LottieCheckAnimation size={110} />
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-2xl leading-snug font-bold tracking-tight text-neutral-900">
            {content.title}
          </h2>
          <p className="mx-auto max-w-[270px] text-xs leading-relaxed text-neutral-500">
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
