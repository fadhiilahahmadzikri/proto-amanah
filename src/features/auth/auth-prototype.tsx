'use client';

import React from 'react';
import { ThemeSwitcher } from '@/components/atoms/ThemeSwitcher';
import { ChangePasswordScreen } from '@/components/organisms/ChangePasswordScreen';
import { DoctorDashboardScreen } from '@/components/organisms/DoctorDashboardScreen';
import { ForgotPasswordScreen } from '@/components/organisms/ForgotPasswordScreen';
import { LoginScreen } from '@/components/organisms/LoginScreen';
import { OnboardingScreen } from '@/components/organisms/OnboardingScreen';
import { OtpScreen } from '@/components/organisms/OtpScreen';
import { PhoneFrame } from '@/components/organisms/PhoneFrame';
import { SignUpScreen } from '@/components/organisms/SignUpScreen';
import { SuccessScreen } from '@/components/organisms/SuccessScreen';
import { useAuthPrototype } from '@/features/auth/hooks/use-auth-prototype';
import { cn } from '@/lib/utils';

export function AuthPrototype() {
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');

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

  const isDarkScreen = currentScreen === 'onboarding' || currentScreen === 'dashboard';

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
    }
  };

  return (
    <div
      className={cn(
        'relative flex min-h-screen w-full items-center justify-center p-4 sm:p-6 selection:bg-blue-500 selection:text-white overflow-hidden transition-all duration-700 ease-in-out',
        theme === 'dark'
          ? 'bg-gradient-to-b from-neutral-900 via-neutral-950 to-black text-white'
          : 'bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] text-neutral-900',
      )}
    >
      {/* Top Right Liquid Glass Theme Switcher (Moon / Sun Switcher) */}
      <div className="fixed top-4 right-4 z-50 sm:top-6 sm:right-6">
        <ThemeSwitcher theme={theme} onToggle={toggleTheme} />
      </div>

      {/* Apple Studio Frosted Glass Blurry Ambient Mesh Layers */}
      {theme === 'dark' ? (
        <>
          {/* Dark Mode Cosmic Glow */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/15 blur-[140px] transition-all duration-1000" />
          <div className="pointer-events-none absolute top-1/4 left-1/3 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[120px] transition-all duration-1000" />
        </>
      ) : (
        <>
          {/* Light Mode Apple Frosted Glass Morph Glow Orbs */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-[620px] w-[620px] rounded-full bg-gradient-to-tr from-sky-400/25 via-blue-300/20 to-indigo-300/25 blur-[130px] transition-all duration-1000" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-[620px] w-[620px] rounded-full bg-gradient-to-bl from-violet-300/20 via-pink-200/15 to-sky-200/25 blur-[140px] transition-all duration-1000" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-[100px] transition-all duration-1000" />
        </>
      )}

      {/* Main iPhone Device Frame with Edge Swipe & Liquid Glass Touch Cursor */}
      <main className="relative z-20 flex items-center justify-center w-full">
        <PhoneFrame
          isDarkContent={isDarkScreen}
          onSwipeBack={handleSwipeBack}
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
            <DoctorDashboardScreen onLogout={handleLogout} />
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
    </div>
  );
}
