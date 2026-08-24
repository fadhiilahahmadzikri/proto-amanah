'use client';

import { Button } from '@/components/atoms/Button';
import contentData from '@/data/auth/content.json';

export function OnboardingScreen(props: {
  onGetStarted: () => void;
  onAlreadyHaveAccount: () => void;
}) {
  const content = contentData.onboarding;

  return (
    <div className="relative flex h-full min-h-[640px] w-full flex-1 flex-col justify-between overflow-hidden bg-neutral-900 p-6 text-white">
      {/* Skincare Editorial Hero Background from Local Disk Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
        style={{
          backgroundImage: 'url("/assets/images/woman-signin-hero.png")',
        }}
      >
        {/* Editorial Atmospheric Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20" />
      </div>

      {/* Top spacing */}
      <div className="relative z-20 pt-8" />

      {/* Center Empty Space */}
      <div className="relative z-20 my-auto" />

      {/* Bottom Content & Primary Call-to-Actions */}
      <div className="relative z-20 flex flex-col gap-3.5 pb-2">
        <div className="mb-2 flex flex-col gap-2">
          <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-white">
            {content.title}
          </h1>
          <p className="text-sm leading-relaxed font-normal text-neutral-200/90">
            {content.subtitle}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5 pt-1">
          <Button
            variant="outline"
            fullWidth
            size="lg"
            onClick={props.onGetStarted}
            className="bg-white font-semibold text-neutral-950 shadow-lg shadow-black/20 hover:bg-neutral-100"
          >
            {content.getStarted}
          </Button>

          <Button
            variant="glass"
            fullWidth
            size="lg"
            onClick={props.onAlreadyHaveAccount}
            className="font-medium"
          >
            {content.alreadyHaveAccount}
          </Button>
        </div>

        {/* Footer Disclaimer */}
        <p className="mt-1 px-2 text-center text-[11px] leading-relaxed text-neutral-400/90">
          {content.termsNotice}
        </p>
      </div>
    </div>
  );
}
