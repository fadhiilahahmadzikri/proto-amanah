'use client';

import {
  AppWindow,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Compass,
  Copy,
  CreditCard,
  FileCode,
  History,
  Home,
  Key,
  KeyRound,
  Lock,
  Mail,
  Mails,
  Moon,
  QrCode,
  RotateCcw,
  Sliders,
  Sun,
  User,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react';
import React from 'react';
import type { BottomNavTab } from '@/components/molecules/BottomNavBar';
import {
  getStoredUserInitialConfig,
  prototypeConfig,
  resetUserInitialConfig,
  saveUserInitialConfig,
} from '@/config/prototype.config';
import credentialsData from '@/data/auth/credentials.json';
import otpConfig from '@/data/auth/otp.json';
import { useDoctorStore } from '@/features/doctor/hooks/use-doctor-store';
import { useScheduleStore } from '@/features/schedule/hooks/use-schedule-store';
import { cn } from '@/lib/utils';
import type { AuthScreen } from '@/types/auth.types';

export function DevToolsRouteSwitcher(props: {
  currentScreen: AuthScreen;
  activeTab?: BottomNavTab;
  onNavigateScreen: (screen: AuthScreen) => void;
  onNavigateTab?: (tab: BottomNavTab) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onSelectCredential?: (user: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeMenuTab, setActiveMenuTab] = React.useState<'routes' | 'config' | 'credentials'>('routes');
  const [copiedField, setCopiedField] = React.useState<string | null>(null);
  const [initialConfigSavedFeedback, setInitialConfigSavedFeedback] = React.useState<string | null>(null);
  const isDark = props.theme === 'dark';

  const [storedInitial, setStoredInitial] = React.useState<{
    screen: AuthScreen | null;
    tab: BottomNavTab | null;
  }>({ screen: null, tab: null });

  React.useEffect(() => {
    setStoredInitial(getStoredUserInitialConfig());
  }, []);

  const { reset: resetDoctor } = useDoctorStore();
  const { reset: resetSchedules } = useScheduleStore();

  const routes: Array<{
    id: string;
    label: string;
    screen: AuthScreen;
    tab?: BottomNavTab;
    icon: React.ComponentType<{ className?: string }>;
    category: 'Dashboard' | 'Auth';
  }> = [
    {
      id: 'dash-home',
      label: 'Home Dashboard',
      screen: 'dashboard',
      tab: 'home',
      icon: Home,
      category: 'Dashboard',
    },
    {
      id: 'dash-id-card',
      label: 'Kartu ID Dokter (3D)',
      screen: 'id-card',
      icon: CreditCard,
      category: 'Dashboard',
    },
    {
      id: 'dash-schedule',
      label: 'Jadwal Praktek',
      screen: 'dashboard',
      tab: 'schedule',
      icon: Calendar,
      category: 'Dashboard',
    },
    {
      id: 'dash-qr',
      label: 'Presensi QR',
      screen: 'dashboard',
      tab: 'qr',
      icon: QrCode,
      category: 'Dashboard',
    },
    {
      id: 'dash-presence-history',
      label: 'Riwayat Presensi',
      screen: 'presence-history',
      icon: History,
      category: 'Dashboard',
    },
    {
      id: 'dash-notif',
      label: 'Perizinan Dokter',
      screen: 'dashboard',
      tab: 'notification',
      icon: Mails,
      category: 'Dashboard',
    },
    {
      id: 'dash-account',
      label: 'Profil Dokter',
      screen: 'dashboard',
      tab: 'account',
      icon: User,
      category: 'Dashboard',
    },
    {
      id: 'auth-onboarding',
      label: 'Onboarding',
      screen: 'onboarding',
      icon: Compass,
      category: 'Auth',
    },
    {
      id: 'auth-login',
      label: 'Login',
      screen: 'login',
      icon: Key,
      category: 'Auth',
    },
    {
      id: 'auth-signup',
      label: 'Register',
      screen: 'signup',
      icon: UserPlus,
      category: 'Auth',
    },
    {
      id: 'auth-forgot',
      label: 'Lupa Password',
      screen: 'forgot-password',
      icon: KeyRound,
      category: 'Auth',
    },
    {
      id: 'auth-otp',
      label: 'Verifikasi OTP',
      screen: 'otp',
      icon: Lock,
      category: 'Auth',
    },
    {
      id: 'auth-change-pass',
      label: 'Ubah Password',
      screen: 'change-password',
      icon: Lock,
      category: 'Auth',
    },
    {
      id: 'auth-success',
      label: 'Konfirmasi Sukses',
      screen: 'success',
      icon: CheckCircle2,
      category: 'Auth',
    },
  ];

  const currentLabel =
    props.currentScreen === 'dashboard'
      ? props.activeTab === 'schedule'
        ? 'Jadwal Praktek'
        : props.activeTab === 'qr'
          ? 'Presensi QR'
          : props.activeTab === 'notification'
            ? 'Perizinan Dokter'
            : props.activeTab === 'account'
              ? 'Profil Dokter'
              : 'Home Dashboard'
      : props.currentScreen === 'id-card'
        ? 'Kartu ID Dokter'
        : props.currentScreen === 'presence-history'
          ? 'Riwayat Presensi'
          : routes.find(r => r.screen === props.currentScreen)?.label ?? 'Pilih Halaman';

  const handleSelectRoute = (item: (typeof routes)[0]) => {
    props.onNavigateScreen(item.screen);
    if (item.tab && props.onNavigateTab) {
      props.onNavigateTab(item.tab);
    }
    setIsOpen(false);
  };

  const handleSetCustomInitialPage = (screen: AuthScreen, tab?: BottomNavTab) => {
    saveUserInitialConfig(screen, tab);
    setStoredInitial({ screen, tab: tab ?? null });
    setInitialConfigSavedFeedback(`${screen}${tab ? ` (${tab})` : ''}`);
    setTimeout(() => {
      setInitialConfigSavedFeedback(null);
    }, 2000);
  };

  const handleResetToDefaultFileConfig = () => {
    resetUserInitialConfig();
    setStoredInitial({ screen: null, tab: null });
    setInitialConfigSavedFeedback('Default File (prototype.config.ts)');
    setTimeout(() => {
      setInitialConfigSavedFeedback(null);
    }, 2000);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(id);
    setTimeout(() => {
      setCopiedField(null);
    }, 1800);
  };

  const handleResetAllData = () => {
    resetDoctor();
    resetSchedules();
    resetUserInitialConfig();
    setStoredInitial({ screen: null, tab: null });
  };

  const isCurrentConfigDefault = (screen: AuthScreen, tab?: BottomNavTab) => {
    if (storedInitial.screen) {
      if (screen === 'dashboard') {
        return storedInitial.screen === 'dashboard' && (storedInitial.tab ?? 'home') === (tab ?? 'home');
      }
      return storedInitial.screen === screen;
    }
    // Fallback to prototype.config.ts
    if (screen === 'dashboard') {
      return prototypeConfig.initialScreen === 'dashboard' && prototypeConfig.initialDashboardTab === (tab ?? 'home');
    }
    return prototypeConfig.initialScreen === screen;
  };

  const handleOpenEmulatorWindow = () => {
    if (typeof window === 'undefined') return;
    const width = 425;
    const height = 910;
    const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2));
    const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2));
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('emulator', 'true');
    window.open(
      currentUrl.toString(),
      'iPhoneEmulatorWindow',
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=no`,
    );
  };

  return (
    <div className={cn('relative z-50 select-none', props.className)}>
      {/* 1. Minimalist Floating Capsule */}
      <div
        className={cn(
          'flex items-center gap-1 p-1 rounded-full border shadow-lg backdrop-blur-xl transition-colors duration-200',
          isDark
            ? 'bg-neutral-900/90 border-white/10 text-neutral-200'
            : 'bg-white/90 border-slate-200 text-slate-800',
        )}
      >
        {/* Route Trigger */}
        <button
          type="button"
          onClick={() => {
            setActiveMenuTab('routes');
            setIsOpen(prev => !prev);
          }}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer select-none active:scale-95',
            isDark
              ? 'hover:bg-white/10 text-white'
              : 'hover:bg-slate-100 text-slate-900',
          )}
        >
          <span className="max-w-[150px] truncate text-xs">
            {currentLabel}
          </span>
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 opacity-60 transition-transform duration-200',
              isOpen && activeMenuTab === 'routes' && 'rotate-180',
            )}
          />
        </button>

        <div className={cn('h-3.5 w-px', isDark ? 'bg-white/15' : 'bg-slate-200')} />

        {/* Config Tab Trigger */}
        <button
          type="button"
          aria-label="Pengaturan Prototype & Initial Page"
          title="Pengaturan Prototype & Initial Page"
          onClick={() => {
            setActiveMenuTab('config');
            setIsOpen(true);
          }}
          className={cn(
            'p-1.5 rounded-full transition-colors cursor-pointer',
            isDark
              ? 'hover:bg-white/10 text-neutral-300'
              : 'hover:bg-slate-100 text-slate-600',
            isOpen && activeMenuTab === 'config' && (isDark ? 'bg-white/15 text-white' : 'bg-slate-200 text-slate-900'),
          )}
        >
          <Sliders className="h-3.5 w-3.5" />
        </button>

        {/* Credentials Tab Trigger */}
        <button
          type="button"
          aria-label="Kredensial Demo"
          title="Kredensial Demo"
          onClick={() => {
            setActiveMenuTab('credentials');
            setIsOpen(true);
          }}
          className={cn(
            'p-1.5 rounded-full transition-colors cursor-pointer',
            isDark
              ? 'hover:bg-white/10 text-neutral-300'
              : 'hover:bg-slate-100 text-slate-600',
            isOpen && activeMenuTab === 'credentials' && (isDark ? 'bg-white/15 text-white' : 'bg-slate-200 text-slate-900'),
          )}
        >
          <KeyRound className="h-3.5 w-3.5" />
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          aria-label="Ganti Tema"
          title="Ganti Tema"
          onClick={props.onToggleTheme}
          className={cn(
            'p-1.5 rounded-full transition-colors cursor-pointer',
            isDark
              ? 'hover:bg-white/10 text-neutral-300'
              : 'hover:bg-slate-100 text-slate-600',
          )}
        >
          {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </button>

        {/* Standalone iPhone Emulator Pop-out Trigger */}
        <button
          type="button"
          aria-label="Buka di Jendela Emulator Sendiri (Hug Frame)"
          title="Buka di Jendela Emulator Sendiri (Hug Frame)"
          onClick={handleOpenEmulatorWindow}
          className={cn(
            'p-1.5 rounded-full transition-colors cursor-pointer',
            isDark
              ? 'hover:bg-white/10 text-neutral-300'
              : 'hover:bg-slate-100 text-slate-600',
          )}
        >
          <AppWindow className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 2. Minimalist Modal Panel */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className={cn(
              'relative w-full max-w-md overflow-hidden rounded-2xl border shadow-xl p-5 transition-colors select-text',
              isDark
                ? 'bg-neutral-900 border-neutral-800 text-neutral-100'
                : 'bg-white border-slate-200 text-slate-900',
            )}
          >
            {/* Header */}
            <div className={cn('flex items-center justify-between pb-3 border-b', isDark ? 'border-neutral-800' : 'border-slate-100')}>
              <div>
                <h3 className="font-semibold text-sm tracking-tight">
                  Navigasi & Konfigurasi
                </h3>
                <p className={cn('text-xs mt-0.5', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                  Pilih halaman aktif atau atur halaman default
                </p>
              </div>
              <button
                type="button"
                aria-label="Tutup"
                onClick={() => setIsOpen(false)}
                className={cn(
                  'p-1 rounded-lg transition-colors cursor-pointer',
                  isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-slate-100 text-slate-400',
                )}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Segmented Tab Controls */}
            <div
              className={cn(
                'flex items-center p-1 mt-3 rounded-xl border text-xs font-medium',
                isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-100 border-slate-200',
              )}
            >
              <button
                type="button"
                onClick={() => setActiveMenuTab('routes')}
                className={cn(
                  'flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center',
                  activeMenuTab === 'routes'
                    ? (isDark ? 'bg-neutral-800 text-white font-semibold shadow-xs' : 'bg-white text-slate-900 font-semibold shadow-xs')
                    : (isDark ? 'text-neutral-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'),
                )}
              >
                Halaman
              </button>
              <button
                type="button"
                onClick={() => setActiveMenuTab('config')}
                className={cn(
                  'flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center',
                  activeMenuTab === 'config'
                    ? (isDark ? 'bg-neutral-800 text-white font-semibold shadow-xs' : 'bg-white text-slate-900 font-semibold shadow-xs')
                    : (isDark ? 'text-neutral-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'),
                )}
              >
                Konfigurasi
              </button>
              <button
                type="button"
                onClick={() => setActiveMenuTab('credentials')}
                className={cn(
                  'flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center',
                  activeMenuTab === 'credentials'
                    ? (isDark ? 'bg-neutral-800 text-white font-semibold shadow-xs' : 'bg-white text-slate-900 font-semibold shadow-xs')
                    : (isDark ? 'text-neutral-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'),
                )}
              >
                Kredensial
              </button>
            </div>

            {/* TAB 1: Route Switcher */}
            {activeMenuTab === 'routes' && (
              <div className="flex flex-col gap-3 py-3 max-h-[55vh] overflow-y-auto no-scrollbar">
                {/* Category: Dashboard */}
                <div>
                  <span className={cn('text-[11px] font-semibold block mb-1.5 px-1', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                    Portal Dokter
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {routes
                      .filter(r => r.category === 'Dashboard')
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
                              'flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer text-xs',
                              isItemActive
                                ? (isDark ? 'bg-white text-neutral-950 font-bold border-white' : 'bg-slate-900 text-white font-bold border-slate-900')
                                : (isDark
                                    ? 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'),
                            )}
                          >
                            <Icon className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{item.label}</span>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Category: Auth */}
                <div>
                  <span className={cn('text-[11px] font-semibold block mb-1.5 px-1', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                    Autentikasi
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {routes
                      .filter(r => r.category === 'Auth')
                      .map((item) => {
                        const Icon = item.icon;
                        const isItemActive = props.currentScreen === item.screen;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectRoute(item)}
                            className={cn(
                              'flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer text-xs',
                              isItemActive
                                ? (isDark ? 'bg-white text-neutral-950 font-bold border-white' : 'bg-slate-900 text-white font-bold border-slate-900')
                                : (isDark
                                    ? 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'),
                            )}
                          >
                            <Icon className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{item.label}</span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Config (Custom User Initial Page Selector) */}
            {activeMenuTab === 'config' && (
              <div className="flex flex-col gap-3 py-3 max-h-[55vh] overflow-y-auto no-scrollbar text-xs">
                {/* 1. Quick Set Current Screen as Default Initial Page */}
                <div
                  className={cn(
                    'p-3 rounded-xl border flex flex-col gap-2',
                    isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-200',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Halaman Awal Saat Reload</span>
                    {initialConfigSavedFeedback && (
                      <span className="text-[10px] text-emerald-500 font-bold animate-in fade-in">
                        ✓ Tersimpan
                      </span>
                    )}
                  </div>
                  <p className={cn('text-[11px] leading-relaxed', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                    Pilih halaman mana yang otomatis terbuka setiap kali browser di-reload:
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSetCustomInitialPage(props.currentScreen, props.activeTab)}
                    className={cn(
                      'flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer active:scale-98',
                      isDark
                        ? 'bg-white text-neutral-950 hover:bg-neutral-200'
                        : 'bg-slate-900 text-white hover:bg-slate-800',
                    )}
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Jadikan Halaman Aktif ({currentLabel}) Default</span>
                  </button>
                </div>

                {/* 2. Interactive Initial Page Cards */}
                <div className="flex flex-col gap-1.5">
                  <span className={cn('text-[11px] font-semibold px-1', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                    Pilih Halaman Awal
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {routes.map((item) => {
                      const isInitial = isCurrentConfigDefault(item.screen, item.tab);
                      return (
                        <button
                          key={`initial-${item.id}`}
                          type="button"
                          onClick={() => handleSetCustomInitialPage(item.screen, item.tab)}
                          className={cn(
                            'p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[58px]',
                            isInitial
                              ? (isDark
                                  ? 'bg-white/10 border-white text-white font-bold'
                                  : 'bg-slate-100 border-slate-900 text-slate-900 font-bold')
                              : (isDark
                                  ? 'border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                                  : 'border-slate-200 text-slate-700 hover:bg-slate-100'),
                          )}
                        >
                          <span className="truncate block text-xs">{item.label}</span>
                          {isInitial ? (
                            <span className="text-[10px] text-emerald-500 font-semibold mt-1">
                              ✓ Default Reload
                            </span>
                          ) : (
                            <span className={cn('text-[10px] mt-1', isDark ? 'text-neutral-500' : 'text-slate-400')}>
                              Klik untuk jadikan default
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Reset Button */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleResetToDefaultFileConfig}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-[11px] font-medium transition-colors cursor-pointer',
                      isDark
                        ? 'border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                        : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100',
                    )}
                  >
                    <FileCode className="h-3 w-3" />
                    <span>Reset ke File prototype.config.ts</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetAllData}
                    className={cn(
                      'flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-[11px] font-medium transition-colors cursor-pointer',
                      isDark
                        ? 'border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                        : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100',
                    )}
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset Data</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: Credentials */}
            {activeMenuTab === 'credentials' && (
              <div className="flex flex-col gap-2.5 py-3 max-h-[55vh] overflow-y-auto no-scrollbar text-xs">
                {credentialsData.users.map((user) => (
                  <div
                    key={user.id}
                    className={cn(
                      'flex flex-col gap-2 p-3 rounded-xl border',
                      isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-200',
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{user.name}</span>
                      {props.onSelectCredential && (
                        <button
                          type="button"
                          onClick={() => {
                            props.onSelectCredential?.(user);
                            setIsOpen(false);
                          }}
                          className={cn(
                            'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer active:scale-95',
                            isDark
                              ? 'bg-white text-neutral-950 hover:bg-neutral-200'
                              : 'bg-slate-900 text-white hover:bg-slate-800',
                          )}
                        >
                          <UserCheck className="h-3 w-3" />
                          <span>Gunakan</span>
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 text-[11px] font-mono">
                      {/* Email */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 opacity-80">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </div>
                        <button
                          type="button"
                          aria-label="Salin email"
                          onClick={() => handleCopy(user.email, `${user.id}-email`)}
                          className="p-1 opacity-60 hover:opacity-100 cursor-pointer"
                        >
                          {copiedField === `${user.id}-email` ? (
                            <Check className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>

                      {/* Password */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 opacity-80">
                          <Lock className="h-3 w-3" />
                          <span>{user.password}</span>
                        </div>
                        <button
                          type="button"
                          aria-label="Salin password"
                          onClick={() => handleCopy(user.password, `${user.id}-password`)}
                          className="p-1 opacity-60 hover:opacity-100 cursor-pointer"
                        >
                          {copiedField === `${user.id}-password` ? (
                            <Check className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Default OTP */}
                <div
                  className={cn(
                    'flex items-center justify-between p-3 rounded-xl border',
                    isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-200',
                  )}
                >
                  <div>
                    <span className="font-semibold block">OTP Tester</span>
                    <span className={cn('text-[11px]', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                      Kode verifikasi universal
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className={cn('px-2 py-0.5 rounded-md font-bold', isDark ? 'bg-neutral-800' : 'bg-slate-200')}>
                      {otpConfig.defaultOtp}
                    </span>
                    <button
                      type="button"
                      aria-label="Salin OTP"
                      onClick={() => handleCopy(otpConfig.defaultOtp, 'otp-code')}
                      className="p-1 opacity-60 hover:opacity-100 cursor-pointer"
                    >
                      {copiedField === 'otp-code' ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
