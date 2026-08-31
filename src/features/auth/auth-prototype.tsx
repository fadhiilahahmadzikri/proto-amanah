'use client';

import React from 'react';
import type { BottomNavTab } from '@/components/molecules/BottomNavBar';
import { DevToolsRouteSwitcher } from '@/components/molecules/DevToolsRouteSwitcher';
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
import { SplittingCanvasWorkspace } from '@/components/organisms/SplittingCanvasWorkspace';
import { SuccessScreen } from '@/components/organisms/SuccessScreen';
import { getEffectiveInitialConfig, prototypeConfig } from '@/config/prototype.config';
import { useAuthPrototype } from '@/features/auth/hooks/use-auth-prototype';
import { cn } from '@/lib/utils';

export function AuthPrototype() {
  const [theme, setTheme] = React.useState<'dark' | 'light'>(prototypeConfig.initialTheme);
  const [dashboardTab, setDashboardTab] = React.useState<BottomNavTab>(prototypeConfig.initialDashboardTab);
  const [isSplitting, setIsSplitting] = React.useState(false);
  const [isFrameless, setIsFrameless] = React.useState(false);
  const [zoomLevel, setZoomLevel] = React.useState<number>(0.5);

  const ZOOM_PRESETS = [0.33, 0.5, 0.67, 0.75, 1.0, 1.25];

  const handleZoomIn = () => {
    setZoomLevel((curr) => {
      const next = ZOOM_PRESETS.find(z => z > curr + 0.01);
      return next ?? curr;
    });
  };

  const handleZoomOut = () => {
    setZoomLevel((curr) => {
      const prev = [...ZOOM_PRESETS].reverse().find(z => z < curr - 0.01);
      return prev ?? curr;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(0.5);
  };

  const toggleFrameless = () => {
    setIsFrameless(prev => !prev);
  };

  React.useEffect(() => {
    const initial = getEffectiveInitialConfig();
    if (initial.initialTheme && initial.initialTheme !== prototypeConfig.initialTheme) {
      setTheme(initial.initialTheme);
    }
    if (initial.initialDashboardTab && initial.initialDashboardTab !== prototypeConfig.initialDashboardTab) {
      setDashboardTab(initial.initialDashboardTab);
    }
  }, []);

  const {
    currentScreen,
    formData,
    errors,
    isLoading,
    isResending,
    countdownSeconds,
    canResend,
    statusMessage,
    navigateTo,
    handleInputChange,
    handleLoginSubmit,
    handleSignUpSubmit,
    handleForgotPasswordSubmit,
    handleResendOtp,
    handleOtpSubmit,
    handleChangePasswordSubmit,
    handleSuccessLogin,
    handleLogout,
  } = useAuthPrototype();

  const isDarkScreen =
    currentScreen === 'onboarding'
      ? true
      : currentScreen === 'dashboard' || currentScreen === 'id-card' || currentScreen === 'presence-history'
        ? theme === 'dark'
        : true;

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSwipeBack = () => {
    if (currentScreen === 'login' || currentScreen === 'signup') {
      navigateTo('onboarding');
    } else if (currentScreen === 'forgot-password') {
      navigateTo('login');
    } else if (currentScreen === 'otp') {
      navigateTo('forgot-password');
    } else if (currentScreen === 'change-password') {
      navigateTo('otp');
    } else if (currentScreen === 'success') {
      navigateTo('login');
    } else if (currentScreen === 'dashboard') {
      navigateTo('onboarding');
    } else if (currentScreen === 'id-card' || currentScreen === 'presence-history') {
      navigateTo('dashboard');
    }
  };

  const handleSelectCredential = (user: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    handleInputChange('emailOrPhone', user.email);
    handleInputChange('email', user.email);
    handleInputChange('phone', user.phone);
    handleInputChange('password', user.password);
    handleInputChange('confirmPassword', user.password);
    handleInputChange('fullName', user.name);
  };

  const [isEmulatorMode, setIsEmulatorMode] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setIsEmulatorMode(params.get('emulator') === 'true');
      if (params.get('splitting') === 'true') {
        setIsSplitting(true);
      }
    }
  }, []);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [isNotchCollapsed, setIsNotchCollapsed] = React.useState(false);
  const [isHoveredTop, setIsHoveredTop] = React.useState(false);
  const lastScrollTopRef = React.useRef(0);
  const scrollIdleTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useLayoutEffect(() => {
    if (isSplitting) {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    }
  }, [isSplitting]);

  React.useEffect(() => {
    const handleScrollEvent = (e: Event) => {
      const target = e.target;
      const scrollTop =
        target === document
          ? window.scrollY || document.documentElement.scrollTop
          : (target as HTMLElement)?.scrollTop ?? window.scrollY;

      const delta = Math.abs(scrollTop - lastScrollTopRef.current);

      // Collapse whenever user is actively scrolling (scroll up OR scroll down)
      if (scrollTop > 20 && delta > 2) {
        setIsNotchCollapsed(true);
      } else if (scrollTop <= 10) {
        // When returned to very top edge, stay fully visible
        setIsNotchCollapsed(false);
      }

      lastScrollTopRef.current = Math.max(0, scrollTop);

      // Auto-reappear: When user stops scrolling, smoothly slide notch back into view
      if (scrollIdleTimerRef.current) {
        clearTimeout(scrollIdleTimerRef.current);
      }
      scrollIdleTimerRef.current = setTimeout(() => {
        setIsNotchCollapsed(false);
      }, 750);
    };

    window.addEventListener('scroll', handleScrollEvent, { passive: true, capture: true });
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScrollEvent, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScrollEvent, { capture: true });
      if (container) {
        container.removeEventListener('scroll', handleScrollEvent);
      }
      if (scrollIdleTimerRef.current) {
        clearTimeout(scrollIdleTimerRef.current);
      }
    };
  }, [isSplitting]);

  const toggleSplitting = () => {
    setIsSplitting((prev) => {
      const next = !prev;
      if (next && scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      return next;
    });
  };

  return (
    <div
      ref={scrollContainerRef}
      className={cn(
        'relative w-full selection:bg-blue-500 selection:text-white transition-colors duration-500',
        isSplitting
          ? 'h-screen overflow-x-auto overflow-y-auto overscroll-contain flex justify-center'
          : 'min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden',
        isEmulatorMode
          ? 'p-0 bg-neutral-950 text-white'
          : theme === 'dark'
            ? 'bg-gradient-to-b from-neutral-900 via-neutral-950 to-black text-white'
            : 'bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] text-neutral-900',
      )}
    >
      {/* Top Edge Hover Trigger Zone (Expands Notch when mouse approaches top 16px) */}
      <div
        onMouseEnter={() => setIsHoveredTop(true)}
        className="fixed top-0 inset-x-0 h-4 z-50 pointer-events-auto"
        aria-hidden="true"
      />

      {/* Apple Studio Frosted Glass Blurry Ambient Mesh Layers */}
      {!isEmulatorMode && (
        theme === 'dark' ? (
          <>
            {/* Dark Mode Cosmic Glow */}
            <div className="pointer-events-none fixed top-1/2 left-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/15 blur-[140px] transition-all duration-1000" />
            <div className="pointer-events-none fixed top-1/4 left-1/3 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[120px] transition-all duration-1000" />
          </>
        ) : (
          <>
            {/* Light Mode Apple Frosted Glass Morph Glow Orbs */}
            <div className="pointer-events-none fixed -top-24 -left-24 h-[620px] w-[620px] rounded-full bg-gradient-to-tr from-sky-400/25 via-blue-300/20 to-indigo-300/25 blur-[130px] transition-all duration-1000" />
            <div className="pointer-events-none fixed -bottom-24 -right-24 h-[620px] w-[620px] rounded-full bg-gradient-to-bl from-violet-300/20 via-pink-200/15 to-sky-200/25 blur-[140px] transition-all duration-1000" />
            <div className="pointer-events-none fixed top-1/2 left-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-[100px] transition-all duration-1000" />
          </>
        )
      )}

      {/* Apple MacBook Notch DevTools (Docked Flush to Top Edge with Scroll Slide-Collapse Animation) */}
      {prototypeConfig.enableDevTools && (
        <div
          onMouseEnter={() => setIsHoveredTop(true)}
          onMouseLeave={() => setIsHoveredTop(false)}
          className={cn(
            'fixed top-0 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center pointer-events-auto',
            'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform',
            isNotchCollapsed && !isHoveredTop
              ? '-translate-y-full opacity-0 pointer-events-none shadow-none'
              : 'translate-y-0 opacity-100 pointer-events-auto',
            isEmulatorMode && 'scale-90',
          )}
        >
          <DevToolsRouteSwitcher
            currentScreen={currentScreen}
            activeTab={dashboardTab}
            onNavigateScreen={navigateTo}
            onNavigateTab={setDashboardTab}
            theme={theme}
            onToggleTheme={toggleTheme}
            isSplitting={isSplitting}
            onToggleSplitting={toggleSplitting}
            isFrameless={isFrameless}
            onToggleFrameless={toggleFrameless}
            zoomLevel={zoomLevel}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetZoom={handleResetZoom}
            isCollapsed={isNotchCollapsed && !isHoveredTop}
            onExpand={() => setIsNotchCollapsed(false)}
            onSelectCredential={handleSelectCredential}
          />
        </div>
      )}

      {/* Mode 1: 5-Column Horizontal Splitting Workspace */}
      {isSplitting ? (
        <SplittingCanvasWorkspace
          theme={theme}
          isFrameless={isFrameless}
          zoomLevel={zoomLevel}
          onNavigateToSingle={(route) => {
            navigateTo(route.screen);
            if (route.tab) setDashboardTab(route.tab);
            setIsSplitting(false);
          }}
        />
      ) : (
        /* Mode 2: Single PhoneFrame Centered Layout */
        <main className="relative z-20 flex flex-col items-center justify-center w-full my-auto pt-8 sm:pt-6">
          <PhoneFrame
            isDarkContent={isDarkScreen}
            onSwipeBack={handleSwipeBack}
            className={isEmulatorMode ? 'my-0 sm:my-0' : undefined}
          >
          {currentScreen === 'onboarding' ? (
            <OnboardingScreen
              onGetStarted={() => {
                navigateTo('signup');
              }}
              onAlreadyHaveAccount={() => {
                navigateTo('login');
              }}
            />
          ) : currentScreen === 'dashboard' ? (
            <DoctorDashboardScreen
              theme={theme}
              activeTab={dashboardTab}
              onTabChange={setDashboardTab}
              onLogout={handleLogout}
            />
          ) : currentScreen === 'id-card' ? (
            <DoctorIdCardScreen
              theme={theme}
              onBack={() => navigateTo('dashboard')}
            />
          ) : currentScreen === 'presence-history' ? (
            <PresenceHistoryScreen
              theme={theme}
              onBack={() => navigateTo('dashboard')}
            />
          ) : (
            <div className="relative flex h-full w-full flex-col justify-end overflow-hidden bg-neutral-950">
              {/* Underlying Hero Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
                style={{
                  backgroundImage: 'url("/assets/images/woman-signin-hero.png")',
                }}
              />

              {/* Clickable Backdrop Overlay (Tap to dismiss drawer) */}
              <button
                type="button"
                aria-label="Tutup Sheet"
                onClick={() => {
                  navigateTo('onboarding');
                }}
                className="absolute inset-0 z-10 w-full h-full bg-black/65 backdrop-blur-[1.5px] cursor-pointer focus:outline-none transition-opacity duration-300"
              />

              {/* Render Active Screen as the Single Sheet Drawer */}
              {currentScreen === 'login' && (
                <LoginScreen
                  formData={formData}
                  errors={errors}
                  isLoading={isLoading}
                  onInputChange={handleInputChange}
                  onSubmit={handleLoginSubmit}
                  onForgotPassword={() => {
                    navigateTo('forgot-password');
                  }}
                  onGoToSignUp={() => {
                    navigateTo('signup');
                  }}
                  onClose={() => {
                    navigateTo('onboarding');
                  }}
                />
              )}

              {currentScreen === 'signup' && (
                <SignUpScreen
                  formData={formData}
                  errors={errors}
                  isLoading={isLoading}
                  onInputChange={handleInputChange}
                  onSubmit={handleSignUpSubmit}
                  onGoToLogin={() => {
                    navigateTo('login');
                  }}
                  onClose={() => {
                    navigateTo('onboarding');
                  }}
                />
              )}

              {currentScreen === 'forgot-password' && (
                <ForgotPasswordScreen
                  formData={formData}
                  errors={errors}
                  isLoading={isLoading}
                  onInputChange={handleInputChange}
                  onSubmit={handleForgotPasswordSubmit}
                  onBack={() => {
                    navigateTo('login');
                  }}
                  onClose={() => {
                    navigateTo('login');
                  }}
                />
              )}

              {currentScreen === 'otp' && (
                <OtpScreen
                  formData={formData}
                  errors={errors}
                  isLoading={isLoading}
                  isResending={isResending}
                  countdownSeconds={countdownSeconds}
                  canResend={canResend}
                  onOtpChange={(val) => {
                    handleInputChange('otp', val);
                  }}
                  onOtpComplete={async () => {
                    await handleOtpSubmit();
                  }}
                  onSubmit={handleOtpSubmit}
                  onResend={handleResendOtp}
                  onBack={() => {
                    navigateTo('forgot-password');
                  }}
                  onClose={() => {
                    navigateTo('login');
                  }}
                  statusMessage={statusMessage}
                />
              )}

              {currentScreen === 'change-password' && (
                <ChangePasswordScreen
                  formData={formData}
                  errors={errors}
                  isLoading={isLoading}
                  onInputChange={handleInputChange}
                  onSubmit={handleChangePasswordSubmit}
                  onBack={() => {
                    navigateTo('otp');
                  }}
                  onClose={() => {
                    navigateTo('login');
                  }}
                />
              )}

              {currentScreen === 'success' && (
                <SuccessScreen
                  onLogin={() => {
                    handleSuccessLogin();
                    navigateTo('login');
                  }}
                  onClose={() => {
                    handleSuccessLogin();
                    navigateTo('login');
                  }}
                />
              )}
            </div>
          )}
        </PhoneFrame>
      </main>
      )}
    </div>
  );
}
