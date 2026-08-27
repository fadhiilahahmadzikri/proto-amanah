import type { BottomNavTab } from '@/components/molecules/BottomNavBar';
import type { AuthScreen } from '@/types/auth.types';

export type PrototypeConfig = {
  /**
   * Initial screen to load when opening the app.
   * Options:
   * - 'dashboard' (Doctor Portal)
   * - 'id-card' (Doctor 3D ID Card Screen)
   * - 'presence-history' (Presence History Screen)
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
 * Global prototype routes & devtools default configuration.
 */
export const prototypeConfig: PrototypeConfig = {
  initialScreen: 'dashboard',
  initialDashboardTab: 'home',
  initialTheme: 'dark',
  enableDevTools: true,
};

const STORAGE_KEY_SCREEN = 'prototype_initial_screen';
const STORAGE_KEY_TAB = 'prototype_initial_tab';
const STORAGE_KEY_THEME = 'prototype_initial_theme';

export function getEffectiveInitialConfig(): {
  initialScreen: AuthScreen;
  initialDashboardTab: BottomNavTab;
  initialTheme: 'light' | 'dark';
} {
  if (typeof window === 'undefined') {
    return {
      initialScreen: prototypeConfig.initialScreen,
      initialDashboardTab: prototypeConfig.initialDashboardTab,
      initialTheme: prototypeConfig.initialTheme,
    };
  }

  const storedScreen = localStorage.getItem(STORAGE_KEY_SCREEN) as AuthScreen | null;
  const storedTab = localStorage.getItem(STORAGE_KEY_TAB) as BottomNavTab | null;
  const storedTheme = localStorage.getItem(STORAGE_KEY_THEME) as 'light' | 'dark' | null;

  return {
    initialScreen: storedScreen ?? prototypeConfig.initialScreen,
    initialDashboardTab: storedTab ?? prototypeConfig.initialDashboardTab,
    initialTheme: storedTheme ?? prototypeConfig.initialTheme,
  };
}

export function saveUserInitialConfig(screen: AuthScreen, tab?: BottomNavTab) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_SCREEN, screen);
  if (tab) {
    localStorage.setItem(STORAGE_KEY_TAB, tab);
  } else {
    localStorage.removeItem(STORAGE_KEY_TAB);
  }
}

export function resetUserInitialConfig() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_SCREEN);
  localStorage.removeItem(STORAGE_KEY_TAB);
  localStorage.removeItem(STORAGE_KEY_THEME);
}

export function getStoredUserInitialConfig(): {
  screen: AuthScreen | null;
  tab: BottomNavTab | null;
} {
  if (typeof window === 'undefined') {
    return { screen: null, tab: null };
  }
  return {
    screen: localStorage.getItem(STORAGE_KEY_SCREEN) as AuthScreen | null,
    tab: localStorage.getItem(STORAGE_KEY_TAB) as BottomNavTab | null,
  };
}
