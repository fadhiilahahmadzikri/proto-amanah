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
import { PROTOTYPE_ROUTES, type PrototypeRouteDefinition } from '@/config/routes.registry';
import { cn } from '@/lib/utils';
import type { AuthFormData } from '@/types/auth.types';

const SplittingSingleFrameInstance = React.memo(function SplittingSingleFrameInstance(props: {
  route: PrototypeRouteDefinition;
  index: number;
  theme: 'dark' | 'light';
  isFrameless?: boolean;
  onNavigateToSingle?: (route: PrototypeRouteDefinition) => void;
}) {
  const { route, theme } = props;
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
    route.tab ?? 'home',
  );

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isDarkScreen =
    route.screen === 'onboarding'
      ? true
      : route.screen === 'dashboard' || route.screen === 'id-card' || route.screen === 'presence-history'
        ? isDark
        : true;

  const noop = () => {};

  const renderScreenContent = () => {
    if (route.screen === 'onboarding') {
      return <OnboardingScreen onGetStarted={noop} onAlreadyHaveAccount={noop} />;
    }

    if (route.screen === 'dashboard') {
      return (
        <DoctorDashboardScreen
          theme={theme}
          activeTab={activeDashboardTab}
          onTabChange={setActiveDashboardTab}
        />
      );
    }

    if (route.screen === 'id-card') {
      return <DoctorIdCardScreen theme={theme} />;
    }

    if (route.screen === 'presence-history') {
      return <PresenceHistoryScreen theme={theme} />;
    }

    // Auth Sheets with Drawer Backdrop
    return (
      <div className="relative flex h-full w-full flex-col justify-end overflow-hidden bg-neutral-950">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/assets/images/woman-signin-hero.png")',
          }}
        />
        <div className="absolute inset-0 z-10 w-full h-full bg-black/65 backdrop-blur-[1.5px]" />

        {route.screen === 'login' && (
          <LoginScreen
            formData={formData}
            errors={{}}
            isLoading={false}
            onInputChange={handleInputChange}
            onSubmit={noop}
            onForgotPassword={noop}
            onGoToSignUp={noop}
            onClose={noop}
          />
        )}

        {route.screen === 'signup' && (
          <SignUpScreen
            formData={formData}
            errors={{}}
            isLoading={false}
            onInputChange={handleInputChange}
            onSubmit={noop}
            onGoToLogin={noop}
            onClose={noop}
          />
        )}

        {route.screen === 'forgot-password' && (
          <ForgotPasswordScreen
            formData={formData}
            errors={{}}
            isLoading={false}
            onInputChange={handleInputChange}
            onSubmit={noop}
            onBack={noop}
            onClose={noop}
          />
        )}

        {route.screen === 'otp' && (
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
          />
        )}

        {route.screen === 'change-password' && (
          <ChangePasswordScreen
            formData={formData}
            errors={{}}
            isLoading={false}
            onInputChange={handleInputChange}
            onSubmit={noop}
            onBack={noop}
            onClose={noop}
          />
        )}

        {route.screen === 'success' && (
          <SuccessScreen onLogin={noop} onClose={noop} />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center select-none shrink-0">
      {/* Minimal Header Capsule Indicator (No font-mono, clean sans-serif) */}
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 mb-2 rounded-full border text-xs font-semibold backdrop-blur-md transition-colors shadow-xs',
          isDark
            ? 'bg-neutral-900/90 border-white/10 text-neutral-200'
            : 'bg-white/95 border-slate-200 text-slate-800',
        )}
      >
        <span className="text-[10.5px] font-bold opacity-60">
          #{String(props.index + 1).padStart(2, '0')}
        </span>
        <span className="truncate max-w-[140px] font-medium">{route.label}</span>
        <span
          className={cn(
            'px-1.5 py-0.2 rounded-md text-[9px] font-bold tracking-tight',
            route.category === 'Dashboard'
              ? isDark ? 'bg-blue-500/20 text-cyan-300' : 'bg-blue-50 text-[#0d66e9]'
              : isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-50 text-emerald-700',
          )}
        >
          {route.category}
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
        {PROTOTYPE_ROUTES.map((route, index) => (
          <SplittingSingleFrameInstance
            key={route.id}
            route={route}
            index={index}
            theme={props.theme}
            isFrameless={props.isFrameless}
            onNavigateToSingle={props.onNavigateToSingle}
          />
        ))}
      </div>
    </div>
  );
});
