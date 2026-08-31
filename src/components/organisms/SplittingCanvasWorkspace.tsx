'use client';

import React from 'react';
import type { BottomNavTab } from '@/components/molecules/BottomNavBar';
import { ChangePasswordScreen } from '@/components/organisms/ChangePasswordScreen';
import { DoctorDashboardScreen } from '@/components/organisms/DoctorDashboardScreen';
import { DoctorIdCardScreen } from '@/components/organisms/DoctorIdCardScreen';
import { ForgotPasswordScreen } from '@/components/organisms/ForgotPasswordScreen';
import { LoginScreen } from '@/components/organisms/LoginScreen';
import { OnboardingScreen } from '@/components/organisms/OnboardingScreen';
import { OtpScreen } from '@/components/organisms/OtpScreen';
import { PhoneFrame } from '@/components/organisms/PhoneFrame';
import { PresenceHistoryScreen } from '@/components/organisms/PresenceHistoryScreen';
import { SignUpScreen } from '@/components/organisms/SignUpScreen';
import { SuccessScreen } from '@/components/organisms/SuccessScreen';
import {
  generateSplittingArtboards,
  type PrototypeRouteDefinition,
  type SplittingArtboardDefinition,
} from '@/config/routes.registry';
import { ModalProvider } from '@/features/portal/hooks/use-modal-store';
import { cn } from '@/lib/utils';
import type { AuthFormData } from '@/types/auth.types';

const SplittingSingleFrameInstance = React.memo(function SplittingSingleFrameInstance(props: {
  artboard: SplittingArtboardDefinition;
  index: number;
  theme: 'dark' | 'light';
  isFrameless?: boolean;
  onNavigateToSingle?: (route: PrototypeRouteDefinition) => void;
}) {
  const { artboard, theme } = props;
  const isDark = theme === 'dark';

  // Isolated mock state for interactive form fields per frame
  const [formData, setFormData] = React.useState<AuthFormData>({
    emailOrPhone: 'dr.amelia@rsamanah.co.id',
    fullName: 'dr. Amelia Cantika, Sp.A',
    email: 'dr.amelia@rsamanah.co.id',
    phone: '081234567890',
    password: 'password123',
    confirmPassword: 'password123',
    otp: '1234',
    newPassword: 'password123',
    confirmNewPassword: 'password123',
  });

  const [activeDashboardTab, setActiveDashboardTab] = React.useState<BottomNavTab>(
    artboard.tab ?? 'home',
  );

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isDarkScreen =
    artboard.screen === 'onboarding'
      ? true
      : isDark;

  const noop = () => {};

  const renderScreenContent = () => {
    if (artboard.screen === 'onboarding') {
      return <OnboardingScreen onGetStarted={noop} onAlreadyHaveAccount={noop} />;
    }

    if (artboard.screen === 'dashboard') {
      return (
        <DoctorDashboardScreen
          theme={theme}
          activeTab={activeDashboardTab}
          onTabChange={setActiveDashboardTab}
          initialModalVariant={artboard.modalVariant?.modalKey}
        />
      );
    }

    if (artboard.screen === 'id-card') {
      return <DoctorIdCardScreen theme={theme} />;
    }

    if (artboard.screen === 'presence-history') {
      return <PresenceHistoryScreen theme={theme} />;
    }

    // Auth Sheets with Drawer Backdrop
    return (
      <div className={cn(
        'relative flex h-full w-full flex-col justify-end overflow-hidden transition-colors',
        isDark ? 'bg-neutral-950' : 'bg-slate-900',
      )}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/assets/images/woman-signin-hero.png")',
          }}
        />
        <div className="absolute inset-0 z-10 w-full h-full bg-black/60 backdrop-blur-xs transition-opacity duration-300" />

        {artboard.screen === 'login' && (
          <LoginScreen
            formData={formData}
            errors={{}}
            isLoading={false}
            onInputChange={handleInputChange}
            onSubmit={noop}
            onForgotPassword={noop}
            onGoToSignUp={noop}
            onClose={noop}
            theme={theme}
          />
        )}

        {artboard.screen === 'signup' && (
          <SignUpScreen
            formData={formData}
            errors={{}}
            isLoading={false}
            onInputChange={handleInputChange}
            onSubmit={noop}
            onGoToLogin={noop}
            onClose={noop}
            theme={theme}
          />
        )}

        {artboard.screen === 'forgot-password' && (
          <ForgotPasswordScreen
            formData={formData}
            errors={{}}
            isLoading={false}
            onInputChange={handleInputChange}
            onSubmit={noop}
            onBack={noop}
            onClose={noop}
            theme={theme}
          />
        )}

        {artboard.screen === 'otp' && (
          <OtpScreen
            formData={formData}
            errors={{}}
            isLoading={false}
            isResending={false}
            countdownSeconds={45}
            canResend={false}
            onOtpChange={val => handleInputChange('otp', val)}
            onOtpComplete={async () => {}}
            onSubmit={noop}
            onResend={noop}
            onBack={noop}
            onClose={noop}
            theme={theme}
          />
        )}

        {artboard.screen === 'change-password' && (
          <ChangePasswordScreen
            formData={formData}
            errors={{}}
            isLoading={false}
            onInputChange={handleInputChange}
            onSubmit={noop}
            onBack={noop}
            onClose={noop}
            theme={theme}
          />
        )}

        {artboard.screen === 'success' && (
          <SuccessScreen onLogin={noop} onClose={noop} theme={theme} />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center select-none shrink-0">
      {/* Minimal Clean Annotation Indicator (No Glow, No Pills, Breadcrumb Diagonal Separator) */}
      <div
        className={cn(
          'flex items-center px-3.5 py-1 mb-2.5 rounded-full border text-xs font-semibold backdrop-blur-md transition-colors',
          isDark
            ? 'bg-neutral-900/90 border-white/10 text-neutral-200'
            : 'bg-white/95 border-slate-200 text-slate-800',
        )}
      >
        <span className="text-[10.5px] font-bold opacity-60">
          #{String(props.index + 1).padStart(2, '0')}
        </span>
        <span className="mx-2 text-[11px] opacity-30 font-light select-none">/</span>
        <span className="truncate max-w-[260px] font-medium inline-flex items-center">
          <span>{artboard.label}</span>
          {artboard.subLabel && (
            <>
              <span className="mx-2 text-[11px] opacity-30 font-light select-none">/</span>
              <span className="opacity-80 text-[11.5px] font-normal">{artboard.subLabel}</span>
            </>
          )}
        </span>
      </div>

      {/* Screen Container: Either Frameless Artboard or Authentic PhoneFrame */}
      {props.isFrameless ? (
        <div
          className={cn(
            'relative h-[790px] w-[375px] sm:h-[844px] sm:w-[393px] rounded-[36px] sm:rounded-[42px] overflow-hidden border shadow-2xl transition-all duration-300 select-text flex flex-col',
            isDark
              ? 'bg-neutral-950 border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/5'
              : 'bg-white border-slate-200 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12)] ring-1 ring-slate-900/5',
          )}
        >
          <div className="relative flex w-full flex-1 flex-col overflow-x-hidden overflow-y-auto no-scrollbar">
            {renderScreenContent()}
          </div>
        </div>
      ) : (
        <PhoneFrame isDarkContent={isDarkScreen} className="my-0">
          {renderScreenContent()}
        </PhoneFrame>
      )}
    </div>
  );
});

export const SplittingCanvasWorkspace = React.memo(function SplittingCanvasWorkspace(props: {
  theme: 'dark' | 'light';
  isFrameless?: boolean;
  zoomLevel?: number;
  onNavigateToSingle?: (route: PrototypeRouteDefinition) => void;
  className?: string;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      containerRef.current.scrollLeft = 0;
    }
  }, []);

  const artboards = React.useMemo(() => {
    return generateSplittingArtboards();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'w-max min-w-full min-h-screen pt-16 pb-20 px-8 flex justify-center',
        props.className,
      )}
      style={{
        zoom: props.zoomLevel ?? 0.5,
      }}
    >
      {/* 5-Column Horizontal Record Grid System (100% Native Scale Canvas) */}
      <div className="grid grid-cols-5 gap-7 sm:gap-8 min-w-[2050px] w-max justify-items-center items-start shrink-0">
        {artboards.map((artboard, index) => (
          <ModalProvider key={artboard.id}>
            <div
              style={{
                contentVisibility: 'auto',
                containIntrinsicSize: '393px 920px',
              }}
            >
              <SplittingSingleFrameInstance
                artboard={artboard}
                index={index}
                theme={props.theme}
                isFrameless={props.isFrameless}
                onNavigateToSingle={props.onNavigateToSingle}
              />
            </div>
          </ModalProvider>
        ))}
      </div>
    </div>
  );
});


