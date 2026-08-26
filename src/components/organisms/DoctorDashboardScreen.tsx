'use client';

import { gsap } from 'gsap';
import React from 'react';
import { type BottomNavTab, BottomNavBar } from '@/components/molecules/BottomNavBar';
import { DoctorProfileHeader } from '@/components/molecules/DoctorProfileHeader';
import { AccountTabScreen } from '@/components/organisms/AccountTabScreen';
import { NotificationTabScreen } from '@/components/organisms/NotificationTabScreen';
import { PresenceHistoryScreen } from '@/components/organisms/PresenceHistoryScreen';
import { QrScannerTabScreen } from '@/components/organisms/QrScannerTabScreen';
import { QuickAccessSection } from '@/components/organisms/QuickAccessSection';
import { ScheduleCardStack } from '@/components/organisms/ScheduleCardStack';
import { ScheduleTabScreen } from '@/components/organisms/ScheduleTabScreen';
import { TodayActivitySection } from '@/components/organisms/TodayActivitySection';
import { prototypeConfig } from '@/config/prototype.config';
import portalData from '@/data/portal/portal-data.json';
import { cn } from '@/lib/utils';
import type { PortalData } from '@/types/portal.types';

const TAB_ORDER: BottomNavTab[] = ['home', 'schedule', 'qr', 'notification', 'account'];

export function DoctorDashboardScreen(props: {
  data?: PortalData;
  theme?: 'dark' | 'light';
  onLogout?: () => void;
  activeTab?: BottomNavTab;
  onTabChange?: (tab: BottomNavTab) => void;
  className?: string;
}) {
  const data = (props.data ?? portalData) as PortalData;
  const isDark = props.theme === 'dark';
  const [internalTab, setInternalTab] = React.useState<BottomNavTab>(
    props.activeTab ?? prototypeConfig.initialDashboardTab ?? 'home',
  );

  const activeTab = props.activeTab ?? internalTab;
  const prevTabRef = React.useRef<BottomNavTab>(activeTab);
  const [slideDirection, setSlideDirection] = React.useState<'forward' | 'backward'>('forward');

  // Sub-screen Presence History state & animation refs
  const [showPresenceHistory, setShowPresenceHistory] = React.useState(false);
  const presenceScreenRef = React.useRef<HTMLDivElement>(null);
  const tabContentRef = React.useRef<HTMLDivElement>(null);

  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const handleTabChange = (newTab: BottomNavTab) => {
    if (newTab === activeTab && !showPresenceHistory) return;

    const currentIndex = TAB_ORDER.indexOf(activeTab);
    const nextIndex = TAB_ORDER.indexOf(newTab);
    const direction = nextIndex >= currentIndex ? 'forward' : 'backward';

    setSlideDirection(direction);
    prevTabRef.current = activeTab;

    if (showPresenceHistory) {
      handleBackFromPresenceHistory(() => {
        setInternalTab(newTab);
        props.onTabChange?.(newTab);
      });
    } else {
      setInternalTab(newTab);
      props.onTabChange?.(newTab);
    }
  };

  // Android Native Activity Push/Pop Animation for Presence History
  const handleOpenPresenceHistory = () => {
    setShowPresenceHistory(true);
  };

  const handleBackFromPresenceHistory = (onDone?: () => void) => {
    if (!presenceScreenRef.current) {
      setShowPresenceHistory(false);
      onDone?.();
      return;
    }

    gsap.to(presenceScreenRef.current, {
      x: '100%',
      opacity: 0.9,
      duration: 0.28,
      ease: 'power3.in',
      onComplete: () => {
        setShowPresenceHistory(false);
        onDone?.();
      },
    });
  };

  // Entrance slide for Presence History
  React.useEffect(() => {
    if (showPresenceHistory && presenceScreenRef.current) {
      gsap.fromTo(
        presenceScreenRef.current,
        { x: '100%', opacity: 0.95 },
        { x: '0%', opacity: 1, duration: 0.3, ease: 'power3.out' },
      );
    }
  }, [showPresenceHistory]);

  // Android Native Horizontal Context Switcher Slide Animation for Tab switching
  React.useEffect(() => {
    if (tabContentRef.current && !showPresenceHistory) {
      const fromX = slideDirection === 'forward' ? '25%' : '-25%';
      gsap.fromTo(
        tabContentRef.current,
        { x: fromX, opacity: 0.8 },
        { x: '0%', opacity: 1, duration: 0.28, ease: 'power3.out', clearProps: 'transform,opacity' },
      );
    }
  }, [activeTab, slideDirection, showPresenceHistory]);

  const handleQuickAction = (id: string) => {
    if (id === 'history' || id === 'presensi') {
      handleOpenPresenceHistory();
    } else if (id === 'jadwal-saya') {
      handleTabChange('schedule');
    } else if (id === 'cari-visit') {
      showToast('Fitur Cari Visit Pasien');
    } else if (id === 'kartu-id') {
      handleTabChange('account');
    }
  };

  return (
    <div
      className={cn(
        'relative flex h-full w-full flex-col overflow-hidden select-text transition-colors duration-500 overscroll-none touch-pan-x',
        isDark
          ? 'bg-[#0a0e1a] text-white'
          : activeTab === 'home'
            ? 'bg-[#f8faff] text-neutral-900'
            : activeTab === 'qr'
              ? 'bg-[#0a0f18] text-white'
              : 'bg-white text-neutral-900',
        props.className,
      )}
    >
      {/* Dynamic Aurora Ambient Glow (Rendered EXCLUSIVELY on Home) */}
      {activeTab === 'home' && !showPresenceHistory && (
        <div
          className="absolute top-0 left-0 w-full h-[550px] z-0 pointer-events-none"
          style={{
            maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          }}
        >
          {isDark ? (
            <>
              {/* Deep Cosmic Sapphire Glow */}
              <div className="absolute -top-[15%] -left-[20%] w-[140%] h-[380px] bg-[#07247a] rounded-full filter blur-[100px] opacity-90 transition-all duration-700" />
              {/* Electric Cyan/Teal Glow */}
              <div className="absolute top-[5%] -right-[20%] w-[100%] h-[260px] bg-[#0088cc] rounded-full filter blur-[90px] opacity-70 transition-all duration-700" />
            </>
          ) : (
            <>
              {/* Vibrant Apple/Amanah Blue Base */}
              <div className="absolute -top-[10%] -left-[20%] w-[140%] h-[350px] bg-[#0A44FF] rounded-full filter blur-[100px] opacity-90 transition-all duration-700" />
              {/* Radiant Cyan Glow */}
              <div className="absolute top-[5%] -right-[20%] w-[100%] h-[250px] bg-[#00D4FF] rounded-full filter blur-[90px] opacity-80 transition-all duration-700" />
            </>
          )}
        </div>
      )}

      {/* Content Viewport Container with Android Activity Slide Motion */}
      <div className="relative z-10 flex-1 min-h-0 w-full overflow-hidden">
        {/* Main Tab Content Viewport */}
        <div
          ref={tabContentRef}
          key={`tab-${activeTab}`}
          className={cn(
            'w-full h-full will-change-transform',
            activeTab === 'qr' || activeTab === 'schedule' || activeTab === 'notification' || activeTab === 'account'
              ? 'p-0 select-none'
              : 'px-5 pt-2 flex flex-col justify-start overflow-hidden pb-24 overscroll-none touch-pan-x select-none',
          )}
        >
          {activeTab === 'home' && (
            <div className="flex flex-col h-full justify-between">
              {/* 1. Doctor Profile Header */}
              <DoctorProfileHeader
                profile={data.profile}
                onNotificationClick={() => handleTabChange('notification')}
                onProfileClick={() => handleTabChange('account')}
              />

              {/* 2. 3D Stack of Schedule Cards with Wave Petal Texture */}
              <ScheduleCardStack
                schedules={data.schedules}
                theme={props.theme}
              />

              {/* 3. Quick Access Menu Grid */}
              <QuickAccessSection
                actions={data.quickActions}
                theme={props.theme}
                onActionClick={handleQuickAction}
              />

              {/* 4. Today's Activity Stat Cards */}
              <TodayActivitySection
                activities={data.activities}
                theme={props.theme}
                onDetailClick={() => handleTabChange('schedule')}
                onActivityClick={() => showToast('Membuka rincian aktivitas')}
              />
            </div>
          )}

          {activeTab === 'schedule' && (
            <ScheduleTabScreen
              theme={props.theme}
              onBack={() => handleTabChange('home')}
            />
          )}

          {activeTab === 'qr' && (
            <QrScannerTabScreen
              theme={props.theme}
              onBack={() => handleTabChange('home')}
            />
          )}

          {activeTab === 'notification' && (
            <NotificationTabScreen
              theme={props.theme}
              onBack={() => handleTabChange('home')}
            />
          )}

          {activeTab === 'account' && (
            <AccountTabScreen
              theme={props.theme}
              onBack={() => handleTabChange('home')}
              onLogout={props.onLogout}
            />
          )}
        </div>

        {/* Presence History Sub-Screen (Android Activity Push Overlay) */}
        {showPresenceHistory && (
          <div
            ref={presenceScreenRef}
            className="absolute inset-0 z-40 w-full h-full bg-[#0a0e1a] dark:bg-[#0a0e1a] bg-white shadow-[-12px_0_30px_rgba(0,0,0,0.3)] will-change-transform"
          >
            <PresenceHistoryScreen
              theme={props.theme}
              onBack={() => handleBackFromPresenceHistory()}
            />
          </div>
        )}
      </div>

      {/* Ephemeral Feedback Toast */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 rounded-full bg-neutral-900/90 text-white px-4 py-2 text-xs font-medium backdrop-blur-md shadow-xl border border-white/20 animate-in fade-in zoom-in-95 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Fixed Bottom App Bar Navigation */}
      <BottomNavBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        theme={props.theme}
      />
    </div>
  );
}
