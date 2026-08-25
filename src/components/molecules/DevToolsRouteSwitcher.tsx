'use client';

import {
  Bell,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Compass,
  Home,
  Key,
  KeyRound,
  Lock,
  Moon,
  QrCode,
  Sparkles,
  Sun,
  User,
  UserPlus,
  X,
} from 'lucide-react';
import React from 'react';
import type { BottomNavTab } from '@/components/molecules/BottomNavBar';
import { cn } from '@/lib/utils';
import type { AuthScreen } from '@/types/auth.types';

export function DevToolsRouteSwitcher(props: {
  currentScreen: AuthScreen;
  activeTab?: BottomNavTab;
  onNavigateScreen: (screen: AuthScreen) => void;
  onNavigateTab?: (tab: BottomNavTab) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenCredentialsModal?: () => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const isDark = props.theme === 'dark';

  const routes: Array<{
    id: string;
    label: string;
    screen: AuthScreen;
    tab?: BottomNavTab;
    icon: React.ComponentType<{ className?: string }>;
    category: 'Dashboard / Portal' | 'Auth Flow';
  }> = [
    {
      id: 'dash-home',
      label: 'Home Dashboard',
      screen: 'dashboard',
      tab: 'home',
      icon: Home,
      category: 'Dashboard / Portal',
    },
    {
      id: 'dash-schedule',
      label: 'Jadwal Praktek',
      screen: 'dashboard',
      tab: 'schedule',
      icon: Calendar,
      category: 'Dashboard / Portal',
    },
    {
      id: 'dash-qr',
      label: 'Presensi QR',
      screen: 'dashboard',
      tab: 'qr',
      icon: QrCode,
      category: 'Dashboard / Portal',
    },
    {
      id: 'dash-notif',
      label: 'Pusat Notifikasi',
      screen: 'dashboard',
      tab: 'notification',
      icon: Bell,
      category: 'Dashboard / Portal',
    },
    {
      id: 'dash-account',
      label: 'Profil Dokter',
      screen: 'dashboard',
      tab: 'account',
      icon: User,
      category: 'Dashboard / Portal',
    },
    {
      id: 'auth-onboarding',
      label: 'Onboarding Screen',
      screen: 'onboarding',
      icon: Compass,
      category: 'Auth Flow',
    },
    {
      id: 'auth-login',
      label: 'Login Drawer',
      screen: 'login',
      icon: Key,
      category: 'Auth Flow',
    },
    {
      id: 'auth-signup',
      label: 'Register / Sign Up',
      screen: 'signup',
      icon: UserPlus,
      category: 'Auth Flow',
    },
    {
      id: 'auth-forgot',
      label: 'Lupa Password',
      screen: 'forgot-password',
      icon: KeyRound,
      category: 'Auth Flow',
    },
    {
      id: 'auth-otp',
      label: 'Verifikasi OTP',
      screen: 'otp',
      icon: Lock,
      category: 'Auth Flow',
    },
    {
      id: 'auth-change-pass',
      label: 'Ubah Password',
      screen: 'change-password',
      icon: Lock,
      category: 'Auth Flow',
    },
    {
      id: 'auth-success',
      label: 'Sukses Konfirmasi',
      screen: 'success',
      icon: CheckCircle2,
      category: 'Auth Flow',
    },
  ];

  const currentLabel =
    props.currentScreen === 'dashboard'
      ? props.activeTab === 'schedule'
        ? 'Jadwal Praktek'
        : props.activeTab === 'qr'
          ? 'Presensi QR'
          : props.activeTab === 'notification'
            ? 'Notifikasi'
            : props.activeTab === 'account'
              ? 'Profil Dokter'
              : 'Home Dashboard'
      : routes.find(r => r.screen === props.currentScreen)?.label ?? 'Select Route';

  const handleSelectRoute = (item: (typeof routes)[0]) => {
    props.onNavigateScreen(item.screen);
    if (item.tab && props.onNavigateTab) {
      props.onNavigateTab(item.tab);
    }
    setIsOpen(false);
  };

  return (
    <div className={cn('relative z-50 select-none', props.className)}>
      {/* Trigger Capsule Pill */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-full border shadow-xl backdrop-blur-xl transition-all cursor-pointer focus:outline-none select-none text-xs font-bold',
            isDark
              ? 'bg-neutral-900/90 border-white/20 text-white hover:bg-neutral-800 ring-1 ring-white/10'
              : 'bg-white/90 border-slate-200 text-slate-900 hover:bg-white ring-1 ring-black/5',
          )}
        >
          <div className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-neutral-400 font-extrabold">
            DevTools:
          </span>
          <span className="max-w-[120px] truncate text-xs font-bold">
            {currentLabel}
          </span>
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 transition-transform duration-300',
              isOpen && 'rotate-180',
            )}
          />
        </button>

        {/* Quick Theme Toggle */}
        <button
          type="button"
          aria-label="Toggle Theme"
          onClick={props.onToggleTheme}
          className={cn(
            'p-2 rounded-full border shadow-xl backdrop-blur-xl transition-all cursor-pointer select-none',
            isDark
              ? 'bg-neutral-900/90 border-white/20 text-amber-400 hover:bg-neutral-800'
              : 'bg-white/90 border-slate-200 text-indigo-600 hover:bg-white',
          )}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>

      {/* DevTools Menu Modal / Dropdown Panel */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className={cn(
              'relative w-full max-w-lg overflow-hidden rounded-[28px] border shadow-2xl p-5 transition-all select-text',
              isDark
                ? 'bg-neutral-900/95 border-white/15 text-white shadow-black/80 ring-1 ring-white/10'
                : 'bg-white/98 border-slate-200 text-slate-900 shadow-2xl ring-1 ring-black/5',
            )}
            style={{
              backdropFilter: 'blur(30px) saturate(180%)',
              WebkitBackdropFilter: 'blur(30px) saturate(180%)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/60 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/15 text-blue-600 dark:text-cyan-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight leading-none">
                    DevTools: Route & Page Switcher
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-1">
                    Atur initial page di <code>src/config/prototype.config.ts</code>
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Tutup DevTools"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-400 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Routes Grid Grouped */}
            <div className="flex flex-col gap-4 py-3.5 max-h-[62vh] overflow-y-auto no-scrollbar select-none">
              {/* Category: Dashboard Pages */}
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-neutral-500 px-1 mb-2 block">
                  Dashboard & Portal Pages
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {routes
                    .filter(r => r.category === 'Dashboard / Portal')
                    .map((item) => {
                      const Icon = item.icon;
                      const isItemActive =
                        props.currentScreen === item.screen &&
                        (item.tab === undefined || props.activeTab === item.tab);

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectRoute(item)}
                          className={cn(
                            'flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all cursor-pointer',
                            isItemActive
                              ? 'bg-blue-600 text-white border-blue-500 font-bold shadow-md shadow-blue-500/25'
                              : isDark
                                ? 'bg-neutral-800/60 border-white/5 text-slate-200 hover:bg-neutral-800 hover:border-white/20'
                                : 'bg-slate-50 border-slate-200/70 text-slate-800 hover:bg-slate-100',
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="text-xs font-semibold truncate">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Category: Auth Flow */}
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-neutral-500 px-1 mb-2 block">
                  Auth & Onboarding Flow
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {routes
                    .filter(r => r.category === 'Auth Flow')
                    .map((item) => {
                      const Icon = item.icon;
                      const isItemActive = props.currentScreen === item.screen;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectRoute(item)}
                          className={cn(
                            'flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all cursor-pointer',
                            isItemActive
                              ? 'bg-blue-600 text-white border-blue-500 font-bold shadow-md shadow-blue-500/25'
                              : isDark
                                ? 'bg-neutral-800/60 border-white/5 text-slate-200 hover:bg-neutral-800 hover:border-white/20'
                                : 'bg-slate-50 border-slate-200/70 text-slate-800 hover:bg-slate-100',
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="text-xs font-semibold truncate">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Footer Shortcuts */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-white/10 text-xs">
              {props.onOpenCredentialsModal && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    props.onOpenCredentialsModal?.();
                  }}
                  className="flex items-center gap-1.5 text-blue-600 dark:text-cyan-400 font-bold hover:underline cursor-pointer"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  <span>Kredensial Demo</span>
                </button>
              )}
              <span className="text-[10px] text-slate-400 dark:text-neutral-500 ml-auto">
                File: <code>prototype.config.ts</code>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
