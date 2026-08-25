'use client';

import React from 'react';
import { prototypeConfig } from '@/config/prototype.config';
import otpConfig from '@/data/auth/otp.json';
import type {
  AuthFormData,
  AuthScreen,
  AuthValidationErrors,
} from '@/types/auth.types';

const INITIAL_FORM_DATA: AuthFormData = {
  fullName: '',
  emailOrPhone: 'sarah@lovi.id',
  email: 'sarah@lovi.id',
  phone: '081234567890',
  password: '',
  confirmPassword: '',
  otp: '',
  newPassword: '',
  confirmNewPassword: '',
};

const delay = async (ms: number) => {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

export function useAuthPrototype() {
  const [currentScreen, setCurrentScreen] = React.useState<AuthScreen>(
    prototypeConfig.initialScreen ?? 'dashboard',
  );
  const [formData, setFormData] = React.useState<AuthFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = React.useState<AuthValidationErrors>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState('');
  const [isResending, setIsResending] = React.useState(false);
  const [countdownSeconds, setCountdownSeconds] = React.useState(otpConfig.expiresInSeconds);
  const [canResend, setCanResend] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);

  // Countdown timer for OTP screen
  React.useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    if (currentScreen === 'otp' && countdownSeconds > 0) {
      setCanResend(false);
      timer = setInterval(() => {
        setCountdownSeconds((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (countdownSeconds === 0) {
      setCanResend(true);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [currentScreen, countdownSeconds]);

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const navigateTo = (screen: AuthScreen) => {
    setErrors({});
    setStatusMessage(null);
    setCurrentScreen(screen);
  };

  // 1. Submit Login
  const handleLoginSubmit = async (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
    }
    const newErrors: AuthValidationErrors = {};

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email atau nomor telepon wajib diisi';
    }
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Sedang masuk...');

    await delay(800);

    setIsLoading(false);
    setStatusMessage('Berhasil masuk!');
    navigateTo('dashboard');
  };

  // 2. Submit Sign Up
  const handleSignUpSubmit = async (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
    }
    const newErrors: AuthValidationErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nama lengkap wajib diisi';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Membuat akun...');

    await delay(900);

    setIsLoading(false);
    navigateTo('login');
  };

  // 3. Submit Forgot Password -> Kirim OTP
  const handleForgotPasswordSubmit = async (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
    }
    const newErrors: AuthValidationErrors = {};

    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Masukkan alamat email yang valid';
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Mengirim kode OTP...');

    await delay(750);

    setIsLoading(false);
    setCountdownSeconds(otpConfig.expiresInSeconds);
    setCanResend(false);
    setFormData(prev => ({ ...prev, otp: '' }));
    navigateTo('otp');
  };

  // 4. Resend OTP (Background)
  const handleResendOtp = async () => {
    if (isResending) {
      return;
    }

    setIsResending(true);
    setStatusMessage(null);

    await delay(800);

    setIsResending(false);
    setCountdownSeconds(otpConfig.expiresInSeconds);
    setCanResend(false);
    setStatusMessage('Kode OTP baru berhasil dikirim ulang ke emailmu!');
  };

  // 5. Submit OTP Verification -> Loading -> Ganti Password
  const handleOtpSubmit = async (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
    }
    const newErrors: AuthValidationErrors = {};

    if (formData.otp.length !== 6) {
      newErrors.otp = 'Masukkan 6 digit kode OTP';
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Memvalidasi kode OTP...');

    await delay(800);

    setIsLoading(false);
    navigateTo('change-password');
  };

  // 6. Submit Change Password -> Loading -> Success
  const handleChangePasswordSubmit = async (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
    }
    const newErrors: AuthValidationErrors = {};

    if (!formData.newPassword || formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password baru minimal 8 karakter';
    }
    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Konfirmasi password wajib diisi';
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Password baru dan konfirmasi tidak cocok';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Menyimpan password baru...');

    await delay(850);

    setIsLoading(false);
    navigateTo('success');
  };

  // 7. Success Screen -> Return to Login
  const handleSuccessLogin = () => {
    setFormData(prev => ({
      ...prev,
      password: '',
      newPassword: '',
      confirmNewPassword: '',
      otp: '',
    }));
    setStatusMessage('Silakan masuk dengan password baru kamu.');
    navigateTo('login');
  };

  // 8. Logout -> Return to Onboarding
  const handleLogout = () => {
    setFormData(INITIAL_FORM_DATA);
    setStatusMessage(null);
    navigateTo('onboarding');
  };

  return {
    currentScreen,
    formData,
    errors,
    isLoading,
    loadingMessage,
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
  };
}
