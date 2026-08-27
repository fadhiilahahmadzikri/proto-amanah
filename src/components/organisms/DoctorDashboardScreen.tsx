'use client';

import { gsap } from 'gsap';
import React from 'react';
import { AuroraBackground } from '@/components/atoms/AuroraBackground';
import { type BottomNavTab, BottomNavBar } from '@/components/molecules/BottomNavBar';
import { DoctorProfileHeader } from '@/components/molecules/DoctorProfileHeader';
import { AccountTabScreen } from '@/components/organisms/AccountTabScreen';
import { DoctorIdCardScreen } from '@/components/organisms/DoctorIdCardScreen';
import { NotificationTabScreen } from '@/components/organisms/NotificationTabScreen';
import { PresenceHistoryScreen } from '@/components/organisms/PresenceHistoryScreen';
import { QrScannerTabScreen } from '@/components/organisms/QrScannerTabScreen';
import { QueueDockScreen } from '@/components/organisms/QueueDockScreen';
import { QuickAccessSection } from '@/components/organisms/QuickAccessSection';
import { ScheduleCardStack } from '@/components/organisms/ScheduleCardStack';
import { ScheduleTabScreen } from '@/components/organisms/ScheduleTabScreen';
import { TodayActivitySection } from '@/components/organisms/TodayActivitySection';
import { prototypeConfig } from '@/config/prototype.config';
import portalData from '@/data/portal/portal-data.json';
import { useDoctorStore } from '@/features/doctor/hooks/use-doctor-store';
import { useModalStore } from '@/features/portal/hooks/use-modal-store';
import { useScheduleStore } from '@/features/schedule/hooks/use-schedule-store';
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
  const { profile: liveDoctorProfile } = useDoctorStore();
  const { todaySchedules } = useScheduleStore();
  const { isModalOpen } = useModalStore();
  const [internalTab, setInternalTab] = React.useState<BottomNavTab>(
    props.activeTab ?? prototypeConfig.initialDashboardTab ?? 'home',
  );

  const activeTab = props.activeTab ?? internalTab;
  const prevTabRef = React.useRef<BottomNavTab>(activeTab);
  const [slideDirection, setSlideDirection] = React.useState<'forward' | 'backward'>('forward');

  // Sub-screen Presence History state & animation refs
  const [showPresenceHistory, setShowPresenceHistory] = React.useState(false);
  const presenceScreenRef = React.useRef<HTMLDivElement>(null);

  // Sub-screen 3D Doctor ID Card state & animation refs
  const [showIdCard, setShowIdCard] = React.useState(false);
  const idCardScreenRef = React.useRef<HTMLDivElement>(null);

  // Sub-screen 3D Queue Dock state & animation refs
  const [showQueueDock, setShowQueueDock] = React.useState(false);
  const queueDockScreenRef = React.useRef<HTMLDivElement>(null);

  const tabContentRef = React.useRef<HTMLDivElement>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const handleTabChange = (newTab: BottomNavTab) => {
    if (newTab === activeTab && !showPresenceHistory && !showIdCard && !showQueueDock) return;

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
    } else if (showIdCard) {
      handleBackFromIdCard(() => {
        setInternalTab(newTab);
        props.onTabChange?.(newTab);
      });
    } else if (showQueueDock) {
      handleBackFromQueueDock(() => {
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

  // Android Native Activity Push/Pop Animation for 3D ID Card
  const handleOpenIdCard = () => {
    setShowIdCard(true);
  };

  const handleBackFromIdCard = (onDone?: () => void) => {
    if (!idCardScreenRef.current) {
      setShowIdCard(false);
      onDone?.();
      return;
    }

    gsap.to(idCardScreenRef.current, {
      x: '100%',
      opacity: 0.9,
      duration: 0.28,
      ease: 'power3.in',
      onComplete: () => {
        setShowIdCard(false);
        onDone?.();
      },
    });
  };

  // Sub-screen 3D Queue Dock Push/Pop Animation
  const handleOpenQueueDock = () => {
    setShowQueueDock(true);
  };

  const handleBackFromQueueDock = (onDone?: () => void) => {
    if (!queueDockScreenRef.current) {
      setShowQueueDock(false);
      onDone?.();
      return;
    }

    gsap.to(queueDockScreenRef.current, {
      x: '100%',
      opacity: 0.9,
      duration: 0.28,
      ease: 'power3.in',
      onComplete: () => {
        setShowQueueDock(false);
        onDone?.();
      },
    });
  };

  // Entrance slide for 3D Queue Dock
  React.useEffect(() => {
    if (showQueueDock && queueDockScreenRef.current) {
      gsap.fromTo(
        queueDockScreenRef.current,
        { x: '100%', opacity: 0.95 },
        { x: '0%', opacity: 1, duration: 0.3, ease: 'power3.out' },
      );
    }
  }, [showQueueDock]);

  // Entrance slide for 3D ID Card
  React.useEffect(() => {
    if (showIdCard && idCardScreenRef.current) {
      gsap.fromTo(
        idCardScreenRef.current,
        { x: '100%', opacity: 0.95 },
        { x: '0%', opacity: 1, duration: 0.3, ease: 'power3.out' },
      );
    }
  }, [showIdCard]);

  // Android Native Horizontal Context Switcher Slide Animation for Tab switching
  React.useEffect(() => {
    if (tabContentRef.current && !showPresenceHistory && !showIdCard && !showQueueDock) {
      const fromX = slideDirection === 'forward' ? '25%' : '-25%';
      gsap.fromTo(
        tabContentRef.current,
        { x: fromX, opacity: 0.8 },
        { x: '0%', opacity: 1, duration: 0.28, ease: 'power3.out', clearProps: 'transform,opacity' },
      );
    }
  }, [activeTab, slideDirection, showPresenceHistory, showIdCard, showQueueDock]);

  const handleQuickAction = (id: string) => {
    if (id === 'history' || id === 'presensi') {
      handleOpenPresenceHistory();
    } else if (id === 'jadwal-saya') {
      handleTabChange('schedule');
    } else if (id === 'antrean' || id === 'cari-visit') {
      handleOpenQueueDock();
    } else if (id === 'kartu-id') {
      handleOpenIdCard();
    }
  };

  return (
    <div
      className={cn(
        'relative flex h-full w-full flex-col overflow-hidden select-text transition-colors duration-500 overscroll-none touch-auto',
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
      {activeTab === 'home' && !showPresenceHistory && !showIdCard && !showQueueDock && (
        <AuroraBackground theme={props.theme} />
      )}

      {/* Main Tab Content Viewport */}
      <div
        ref={tabContentRef}
        key={`tab-${activeTab}`}
        className={cn(
          'w-full h-full will-change-transform overflow-hidden flex flex-col min-h-0',
          activeTab === 'qr' || activeTab === 'schedule' || activeTab === 'notification' || activeTab === 'account'
            ? 'p-0 select-none'
            : 'px-5 pt-2 justify-start overflow-y-auto no-scrollbar pb-24 overscroll-none touch-auto select-none',
        )}
      >
        {activeTab === 'home' && (
          <div className="flex flex-col">
            {/* 1. Doctor Profile Header */}
            <DoctorProfileHeader
              profile={liveDoctorProfile}
              onNotificationClick={() => handleTabChange('notification')}
              onProfileClick={() => handleTabChange('account')}
            />

            {/* 2. 3D Stack of Schedule Cards with Wave Petal Texture (Synced with Schedule Screen) */}
            <ScheduleCardStack
              schedules={todaySchedules.length > 0 ? todaySchedules : data.schedules}
              theme={props.theme}
              onCardClick={() => handleTabChange('schedule')}
            />

            {/* 3. Quick Access Menu Grid (Kartu ID triggers 3D ID Card) */}
            <QuickAccessSection
              actions={data.quickActions}
              theme={props.theme}
              onActionClick={handleQuickAction}
            />

            {/* 4. Today's Activity Stat Cards (Synced with Schedule Bookings) */}
            <TodayActivitySection
              activities={[
                {
                  id: 'act-1',
                  title: 'Antrean Pasien',
                  count: todaySchedules.reduce((acc, s) => acc + (s.bookedPatients?.length ?? (Number.parseInt(s.slotCount, 10) || 0)), 0) || 4,
                  unit: 'Pasien',
                  badgeText: 'Live',
                  badgeType: 'live',
                  icon: 'users',
                  glowVariant: 'blue',
                },
                {
                  id: 'act-2',
                  title: 'Selesai Praktik',
                  count: 45,
                  unit: 'Tindakan',
                  badgeText: '+12%',
                  badgeType: 'trend',
                  icon: 'stethoscope',
                  glowVariant: 'emerald',
                },
              ]}
              theme={props.theme}
              onDetailClick={() => handleOpenQueueDock()}
              onActivityClick={(actId) => {
                if (actId === 'act-1') {
                  handleOpenQueueDock();
                } else {
                  showToast('Membuka rincian aktivitas');
                }
              }}
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

      {/* Fixed Bottom App Bar Navigation (Smoothly slides down & hides when any Modal/Drawer is active) */}
      <BottomNavBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        theme={props.theme}
        className={cn(
          'transition-all duration-300',
          isModalOpen || showPresenceHistory || showIdCard || showQueueDock
            ? 'opacity-0 pointer-events-none translate-y-12 z-0'
            : 'opacity-100 translate-y-0 z-20',
        )}
      />

      {/* Presence History Sub-Screen (Android Activity Push Overlay - Z-40) */}
      {showPresenceHistory && (
        <div
          ref={presenceScreenRef}
          className={cn(
            'absolute inset-0 z-40 w-full h-full shadow-[-12px_0_30px_rgba(0,0,0,0.3)] will-change-transform',
            isDark ? 'bg-[#0a0e1a]' : 'bg-white',
          )}
        >
          <PresenceHistoryScreen
            theme={props.theme}
            onBack={() => handleBackFromPresenceHistory()}
          />
        </div>
      )}

      {/* 3D Doctor ID Card Sub-Screen (Interactive Physics Lanyard - Z-40) */}
      {showIdCard && (
        <div
          ref={idCardScreenRef}
          className={cn(
            'absolute inset-0 z-40 w-full h-full shadow-[-12px_0_30px_rgba(0,0,0,0.3)] will-change-transform',
            isDark ? 'bg-[#070b14]' : 'bg-[#f8faff]',
          )}
        >
          <DoctorIdCardScreen
            theme={props.theme}
            onBack={() => handleBackFromIdCard()}
          />
        </div>
      )}

      {/* 3D Queue Dock Sub-Screen (Interactive 3D Carousel & Activation - Z-40) */}
      {showQueueDock && (
        <div
          ref={queueDockScreenRef}
          className={cn(
            'absolute inset-0 z-40 w-full h-full shadow-[-12px_0_30px_rgba(0,0,0,0.3)] will-change-transform',
            isDark ? 'bg-[#0a0e1a]' : 'bg-[#f4f7ff]',
          )}
        >
          <QueueDockScreen
            theme={props.theme}
            onBack={() => handleBackFromQueueDock()}
          />
        </div>
      )}

      {/* Ephemeral Feedback Toast (Z-50) */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 rounded-full bg-neutral-900/90 text-white px-4 py-2 text-xs font-medium backdrop-blur-md shadow-xl border border-white/20 animate-in fade-in zoom-in-95 duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
