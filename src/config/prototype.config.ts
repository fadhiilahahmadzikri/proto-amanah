import type { BottomNavTab } from '@/components/molecules/BottomNavBar';
import type { AuthScreen } from '@/types/auth.types';

export type PrototypeConfig = {
  /**
   * Initial screen to load when opening the app.
   * Options:
   * - 'dashboard' (Doctor Portal)
   * - 'onboarding' (Welcome / Onboarding screen)
   * - 'login' (Sign-in drawer sheet)
   * - 'signup' (Sign-up drawer sheet)
   * - 'forgot-password' (Forgot password drawer)
   * - 'otp' (OTP verification screen)
   * - 'change-password' (Set new password screen)
   * - 'success' (Success confirmation)
   */
  initialScreen: AuthScreen;

  /**
   * Initial tab when active screen is 'dashboard'.
   * Options: 'home' | 'schedule' | 'qr' | 'notification' | 'account'
   */
  initialDashboardTab: BottomNavTab;

  /**
   * Initial theme mode.
   * Options: 'light' | 'dark'
   */
  initialTheme: 'light' | 'dark';

  /**
   * Show or hide the floating DevTools route switcher.
   */
  enableDevTools: boolean;
};

/**
 * Global prototype routes & devtools configuration.
 * Ubah 'initialScreen' dan 'initialDashboardTab' di sini untuk mengatur halaman awal sesuka hati.
 */
export const prototypeConfig: PrototypeConfig = {
  initialScreen: 'dashboard',
  initialDashboardTab: 'home',
  initialTheme: 'dark',
  enableDevTools: true,
};
