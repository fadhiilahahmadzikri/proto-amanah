'use client';

import {
  AppWindow,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Columns3,
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
  Minus,
  Moon,
  Plus,
  QrCode,
  RotateCcw,
  Sliders,
  Smartphone,
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
import { DEVICE_FRAMES_REGISTRY, getDeviceBrands } from '@/config/device-frames';
import { runGenieAnimation } from '@/lib/genie-renderer';
import { cn } from '@/lib/utils';
import type { AuthScreen } from '@/types/auth.types';

function AppleNotchBackground(props: { isDark: boolean }) {
  const { isDark } = props;
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none transition-colors duration-300"
      viewBox="0 0 100 38"
      preserveAspectRatio="none"
      fill="none"
    >
      {/* S-Curve Filleted Notch Body matching the user's diagram */}
      <path
        d="M 0 0 C 2.2 0, 4.2 3.5, 4.8 11 L 4.8 26 C 4.8 33.5, 6.8 38, 9.5 38 L 90.5 38 C 93.2 38, 95.2 33.5, 95.2 26 L 95.2 11 C 95.8 3.5, 97.8 0, 100 0 Z"
        fill={isDark ? 'rgba(10, 10, 10, 0.96)' : 'rgba(255, 255, 255, 0.97)'}
      />

      {/* Sub-pixel Rim Stroke along the bottom & curved ears */}
      <path
        d="M 0 0 C 2.2 0, 4.2 3.5, 4.8 11 L 4.8 26 C 4.8 33.5, 6.8 38, 9.5 38 L 90.5 38 C 93.2 38, 95.2 33.5, 95.2 26 L 95.2 11 C 95.8 3.5, 97.8 0, 100 0"
        stroke={isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'}
        strokeWidth="0.75"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function DevToolsRouteSwitcher(props: {
  currentScreen: AuthScreen;
  activeTab?: BottomNavTab;
  onNavigateScreen: (screen: AuthScreen) => void;
  onNavigateTab?: (tab: BottomNavTab) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isSplitting?: boolean;
  onToggleSplitting?: () => void;
  isFrameless?: boolean;
  onToggleFrameless?: () => void;
  selectedDeviceId?: string;
  onSelectDevice?: (deviceId: string) => void;
  zoomLevel?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  isCollapsed?: boolean;
  onExpand?: () => void;
  onSelectCredential?: (user: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeMenuTab, setActiveMenuTab] = React.useState<'routes' | 'config' | 'credentials' | 'devices'>('routes');
  const [selectedBrandFilter, setSelectedBrandFilter] = React.useState<string>('All');
  const [deviceSearchQuery, setDeviceSearchQuery] = React.useState<string>('');
  const [copiedField, setCopiedField] = React.useState<string | null>(null);
  const [initialConfigSavedFeedback, setInitialConfigSavedFeedback] = React.useState<string | null>(null);
  const isDark = props.theme === 'dark';

  const notchBarRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const isGenieAnimatingRef = React.useRef(false);

  const handleOpenTab = (tab: 'routes' | 'config' | 'credentials' | 'devices') => {
    if (isOpen && activeMenuTab === tab) {
      handleClosePanel();
      return;
    }
    setActiveMenuTab(tab);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleClosePanel = async () => {
    if (isGenieAnimatingRef.current || !isOpen) return;
    if (panelRef.current && notchBarRef.current) {
      isGenieAnimatingRef.current = true;
      try {
        await runGenieAnimation(
          'minimize',
          panelRef.current,
          () => notchBarRef.current!.getBoundingClientRect(),
          'top',
        );
      } catch (e) {
        console.warn('Genie minimize error:', e);
      }
      isGenieAnimatingRef.current = false;
    }
    setIsOpen(false);
  };

  React.useEffect(() => {
    if (isOpen && panelRef.current && notchBarRef.current) {
      isGenieAnimatingRef.current = true;
      runGenieAnimation(
        'open',
        panelRef.current,
        () => notchBarRef.current!.getBoundingClientRect(),
        'top',
      )
        .catch((_e: unknown) => {
          // Fallback handled seamlessly
        })
        .finally(() => {
          isGenieAnimatingRef.current = false;
        });
    }
  }, [isOpen]);

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
      {/* 1. Main Interactive Apple Notch Island Trigger Bar */}
      <div
        ref={notchBarRef}
        onClick={props.isCollapsed ? props.onExpand : undefined}
        className={cn(
          'relative group/notch flex items-center justify-center pt-0.5 pb-1 px-5 sm:px-6 transition-all duration-300',
          isDark
            ? 'drop-shadow-[0_4px_14px_rgba(0,0,0,0.55)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]'
            : 'drop-shadow-[0_4px_12px_rgba(0,0,0,0.06)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
        )}
      >
        {/* Organic S-Curve Notch SVG Backdrop */}
        <AppleNotchBackground isDark={isDark} />

        <div
          className={cn(
            'relative z-10 flex items-center gap-1 py-0.5 text-xs transition-colors duration-200',
            isDark ? 'text-neutral-200' : 'text-slate-800',
          )}
        >
          {/* Route Trigger */}
          <button
          type="button"
          onClick={() => handleOpenTab('routes')}
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
          onClick={() => handleOpenTab('config')}
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
          onClick={() => handleOpenTab('credentials')}
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

        {/* Quick Frame HP Device Picker Trigger */}
        <button
          type="button"
          aria-label="Pilih Frame Mockup HP (73 Varian)"
          title="Pilih Frame Mockup HP (73 Varian)"
          onClick={() => handleOpenTab('devices')}
          className={cn(
            'p-1.5 rounded-full transition-colors cursor-pointer relative',
            props.selectedDeviceId && props.selectedDeviceId !== 'native-css'
              ? (isDark ? 'bg-indigo-500/25 text-indigo-300 ring-1 ring-indigo-400/50 font-bold' : 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-500/50 font-bold')
              : (isDark ? 'hover:bg-white/10 text-neutral-300' : 'hover:bg-slate-100 text-slate-600'),
            isOpen && activeMenuTab === 'devices' && (isDark ? 'bg-white/15 text-white' : 'bg-slate-200 text-slate-900'),
          )}
        >
          <Smartphone className="h-3.5 w-3.5" />
          {props.selectedDeviceId && props.selectedDeviceId !== 'native-css' && (
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          )}
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

        {/* Splitting Multi-Frame Canvas Toggle Trigger */}
        {props.onToggleSplitting && (
          <button
            type="button"
            aria-label={props.isSplitting ? 'Kembali ke Layar Tunggal' : 'Mode Splitting (Multi-Frame 5-Kolom)'}
            title={props.isSplitting ? 'Kembali ke Layar Tunggal' : 'Mode Splitting (Multi-Frame 5-Kolom)'}
            onClick={props.onToggleSplitting}
            className={cn(
              'p-1.5 rounded-full transition-all cursor-pointer',
              props.isSplitting
                ? (isDark ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/40 font-bold' : 'bg-blue-50 text-[#0d66e9] ring-1 ring-blue-500/40 font-bold')
                : (isDark ? 'hover:bg-white/10 text-neutral-300' : 'hover:bg-slate-100 text-slate-600'),
            )}
          >
            <Columns3 className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Frameless Artboard Mode Toggle Trigger (Mutates & Appears only when Splitting is Active) */}
        {props.isSplitting && props.onToggleFrameless && (
          <button
            type="button"
            aria-label={props.isFrameless ? 'Gunakan Mockup iPhone' : 'Lepas Mockup iPhone (Mode Artboard)'}
            title={props.isFrameless ? 'Gunakan Mockup iPhone' : 'Lepas Mockup iPhone (Mode Artboard)'}
            onClick={props.onToggleFrameless}
            className={cn(
              'p-1.5 rounded-full transition-all cursor-pointer',
              props.isFrameless
                ? (isDark ? 'bg-indigo-500/25 text-indigo-300 ring-1 ring-indigo-400/50 font-bold shadow-xs' : 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-500/50 font-bold shadow-xs')
                : (isDark ? 'hover:bg-white/10 text-neutral-300' : 'hover:bg-slate-100 text-slate-600'),
            )}
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Native Browser Zoom Controller (Blink/Webkit Engine Level Zoom) */}
        {props.isSplitting && (
          <div
            className={cn(
              'flex items-center gap-0.5 px-1 py-0.5 rounded-full border text-[11px] font-bold tracking-tight transition-colors select-none',
              isDark
                ? 'bg-white/5 border-white/10 text-neutral-200'
                : 'bg-slate-100/90 border-slate-200 text-slate-700',
            )}
          >
            <button
              type="button"
              aria-label="Zoom Out"
              title="Zoom Out (Kecilkan Kanvas)"
              onClick={props.onZoomOut}
              className={cn(
                'p-1 rounded-full transition-colors cursor-pointer active:scale-90',
                isDark ? 'hover:bg-white/15 text-neutral-300' : 'hover:bg-slate-200 text-slate-700',
              )}
            >
              <Minus className="h-3 w-3" />
            </button>

            <button
              type="button"
              aria-label="Reset Zoom"
              title="Klik untuk Reset Zoom"
              onClick={props.onResetZoom}
              className={cn(
                'px-1 py-0.5 text-[10px] font-bold hover:underline cursor-pointer tabular-nums select-none min-w-[32px] text-center',
                isDark ? 'text-cyan-300' : 'text-[#0d66e9]',
              )}
            >
              {Math.round((props.zoomLevel ?? 0.5) * 100)}%
            </button>

            <button
              type="button"
              aria-label="Zoom In"
              title="Zoom In (Perbesar Kanvas)"
              onClick={props.onZoomIn}
              className={cn(
                'p-1 rounded-full transition-colors cursor-pointer active:scale-90',
                isDark ? 'hover:bg-white/15 text-neutral-300' : 'hover:bg-slate-200 text-slate-700',
              )}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        )}

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
      </div>

      {/* 2. Genie Downward Expanding Panel Directly Attached to Bottom Mouth of Top Notch */}
      {isOpen && (
        <>
          {/* Subtle click-outside backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px] transition-opacity duration-200"
            onClick={handleClosePanel}
          />

          {/* Liquid Genie Expansion Panel anchored directly underneath the notch */}
          <div
            ref={panelRef}
            onClick={e => e.stopPropagation()}
            className={cn(
              'absolute top-full left-1/2 -translate-x-1/2 mt-1.5 z-50 w-[450px] max-w-[94vw] select-text',
            )}
          >
            {/* Glassmorphic Panel with Notch Seam Glow */}
            <div
              className={cn(
                'relative w-full overflow-hidden rounded-2xl border shadow-2xl p-5 backdrop-blur-2xl transition-colors',
                isDark
                  ? 'bg-neutral-900/95 border-white/10 text-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(13,102,233,0.15)] ring-1 ring-white/5'
                  : 'bg-white/95 border-slate-200/90 text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.18)] ring-1 ring-black/5',
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
                onClick={handleClosePanel}
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
              <button
                type="button"
                onClick={() => setActiveMenuTab('devices')}
                className={cn(
                  'flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center',
                  activeMenuTab === 'devices'
                    ? (isDark ? 'bg-neutral-800 text-white font-semibold shadow-xs' : 'bg-white text-slate-900 font-semibold shadow-xs')
                    : (isDark ? 'text-neutral-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'),
                )}
              >
                Frame HP
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

            {/* TAB 4: Device Mockup Frames (All 73 Hardware Devices) */}
            {activeMenuTab === 'devices' && (
              <div className="flex flex-col gap-3 py-3 max-h-[55vh] overflow-y-auto no-scrollbar">
                {/* Search & Filter Header */}
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={deviceSearchQuery}
                    onChange={e => setDeviceSearchQuery(e.target.value)}
                    placeholder="Cari frame HP (iPhone, Samsung, Pixel, Razr...)"
                    className={cn(
                      'w-full px-3 py-2 rounded-xl text-xs border transition-colors outline-none focus:ring-1',
                      isDark
                        ? 'bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-500 focus:ring-white/30'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-slate-400',
                    )}
                  />

                  {/* Brand Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                    {['All', ...getDeviceBrands()].map((brand) => (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => setSelectedBrandFilter(brand)}
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-[10.5px] font-semibold tracking-tight shrink-0 transition-all cursor-pointer',
                          selectedBrandFilter === brand
                            ? (isDark ? 'bg-white text-neutral-950' : 'bg-slate-900 text-white')
                            : (isDark ? 'bg-neutral-800 text-neutral-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'),
                        )}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Default Native CSS Option */}
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      props.onSelectDevice?.('native-css');
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer text-xs mb-2',
                      props.selectedDeviceId === 'native-css' || !props.selectedDeviceId
                        ? (isDark ? 'bg-white text-neutral-950 font-bold border-white' : 'bg-slate-900 text-white font-bold border-slate-900')
                        : (isDark ? 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:bg-neutral-800' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'),
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="h-4 w-4 shrink-0" />
                      <div>
                        <span className="font-bold block">Native CSS Titanium Frame</span>
                        <span className={cn('text-[10px] font-normal block', props.selectedDeviceId === 'native-css' || !props.selectedDeviceId ? (isDark ? 'text-neutral-700' : 'text-slate-300') : (isDark ? 'text-neutral-400' : 'text-slate-500'))}>
                          Frame bawaan murni CSS tanpa gambar eksternal
                        </span>
                      </div>
                    </div>
                    {(props.selectedDeviceId === 'native-css' || !props.selectedDeviceId) && (
                      <Check className="h-4 w-4 shrink-0" />
                    )}
                  </button>
                </div>

                {/* Device Mockups Grid */}
                <div className="grid grid-cols-2 gap-1.5">
                  {DEVICE_FRAMES_REGISTRY
                    .filter((dev) => {
                      const matchesBrand = selectedBrandFilter === 'All' || dev.brand === selectedBrandFilter;
                      const matchesSearch = dev.name.toLowerCase().includes(deviceSearchQuery.toLowerCase()) || dev.id.toLowerCase().includes(deviceSearchQuery.toLowerCase());
                      return matchesBrand && matchesSearch;
                    })
                    .map((dev) => {
                      const isSelected = props.selectedDeviceId === dev.id;

                      return (
                        <button
                          key={dev.id}
                          type="button"
                          onClick={() => {
                            props.onSelectDevice?.(dev.id);
                            setIsOpen(false);
                          }}
                          className={cn(
                            'flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer text-xs',
                            isSelected
                              ? (isDark ? 'bg-white text-neutral-950 font-bold border-white' : 'bg-slate-900 text-white font-bold border-slate-900')
                              : (isDark
                                  ? 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'),
                          )}
                        >
                          <Smartphone className="h-3.5 w-3.5 shrink-0 opacity-70" />
                          <div className="min-w-0 flex-1">
                            <span className="truncate block font-medium">{dev.name}</span>
                            <span className={cn('text-[9.5px] block truncate', isSelected ? (isDark ? 'text-neutral-600' : 'text-slate-300') : (isDark ? 'text-neutral-500' : 'text-slate-400'))}>
                              {dev.screenWidth} × {dev.screenHeight} px
                            </span>
                          </div>
                          {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    )}
  </div>
);
}
