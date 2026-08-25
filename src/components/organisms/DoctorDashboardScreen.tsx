'use client';

import React from 'react';
import { type BottomNavTab, BottomNavBar } from '@/components/molecules/BottomNavBar';
import { DoctorProfileHeader } from '@/components/molecules/DoctorProfileHeader';
import { AccountTabScreen } from '@/components/organisms/AccountTabScreen';
import { NotificationTabScreen } from '@/components/organisms/NotificationTabScreen';
import { QrScannerTabScreen } from '@/components/organisms/QrScannerTabScreen';
import { QuickAccessSection } from '@/components/organisms/QuickAccessSection';
import { ScheduleCardStack } from '@/components/organisms/ScheduleCardStack';
import { ScheduleTabScreen } from '@/components/organisms/ScheduleTabScreen';
import { TodayActivitySection } from '@/components/organisms/TodayActivitySection';
import portalData from '@/data/portal/portal-data.json';
import { cn } from '@/lib/utils';
import type { PortalData } from '@/types/portal.types';

export function DoctorDashboardScreen(props: {
  data?: PortalData;
  theme?: 'dark' | 'light';
  onLogout?: () => void;
  className?: string;
}) {
  const data = (props.data ?? portalData) as PortalData;
  const isDark = props.theme === 'dark';
  const [activeTab, setActiveTab] = React.useState<BottomNavTab>('home');
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const handleTabChange = (tab: BottomNavTab) => {
    setActiveTab(tab);
  };

  const handleQuickAction = (id: string) => {
    if (id === 'presensi') {
      setActiveTab('qr');
    } else if (id === 'jadwal-saya') {
      setActiveTab('schedule');
    } else if (id === 'cari-visit') {
      showToast('Fitur Cari Visit Pasien');
    } else if (id === 'kartu-id') {
      setActiveTab('account');
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
            : 'bg-white text-neutral-900',
        props.className,
      )}
    >
      {/* Dynamic Aurora Ambient Glow (Rendered EXCLUSIVELY on Home) */}
      {activeTab === 'home' && (
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

      {/* Content Viewport Container */}
      <div
        className={cn(
          'relative z-10 flex-1 px-5 pt-2',
          activeTab === 'home' || activeTab === 'account' || activeTab === 'qr'
            ? 'h-full flex flex-col justify-start overflow-hidden pb-24 overscroll-none touch-pan-x select-none'
            : 'overflow-y-auto pb-32 no-scrollbar overscroll-contain',
        )}
      >
        {activeTab === 'home' && (
          <div className="flex flex-col h-full justify-between">
            {/* 1. Doctor Profile Header */}
            <DoctorProfileHeader
              profile={data.profile}
              onNotificationClick={() => setActiveTab('notification')}
              onProfileClick={() => setActiveTab('account')}
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
              onDetailClick={() => setActiveTab('schedule')}
              onActivityClick={() => showToast('Membuka rincian aktivitas')}
            />
          </div>
        )}

        {activeTab === 'schedule' && (
          <ScheduleTabScreen theme={props.theme} />
        )}

        {activeTab === 'qr' && (
          <QrScannerTabScreen theme={props.theme} />
        )}

        {activeTab === 'notification' && (
          <NotificationTabScreen theme={props.theme} />
        )}

        {activeTab === 'account' && (
          <AccountTabScreen
            theme={props.theme}
            onLogout={props.onLogout}
          />
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
