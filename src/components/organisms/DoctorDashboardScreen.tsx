'use client';

import React from 'react';
import { type BottomNavTab, BottomNavBar } from '@/components/molecules/BottomNavBar';
import { DoctorProfileHeader } from '@/components/molecules/DoctorProfileHeader';
import { QuickAccessSection } from '@/components/organisms/QuickAccessSection';
import { ScheduleCardStack } from '@/components/organisms/ScheduleCardStack';
import { TodayActivitySection } from '@/components/organisms/TodayActivitySection';
import portalData from '@/data/portal/portal-data.json';
import { cn } from '@/lib/utils';
import type { PortalData } from '@/types/portal.types';

export function DoctorDashboardScreen(props: {
  data?: PortalData;
  onLogout?: () => void;
  className?: string;
}) {
  const data = (props.data ?? portalData) as PortalData;
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
    if (tab === 'account') {
      showToast('Profil Dokter & Pengaturan Akun');
    } else if (tab === 'notification') {
      showToast('3 Notifikasi Baru Tersedia');
    } else if (tab === 'qr') {
      showToast('Membuka Pemindai QR Presensi...');
    } else if (tab === 'schedule') {
      showToast('Membuka Seluruh Jadwal Praktek...');
    }
  };

  return (
    <div
      className={cn(
        'relative flex h-full w-full flex-col overflow-hidden bg-[#f8faff] select-text',
        props.className,
      )}
    >
      {/* Background Aurora Biru yang memudar halus (Apple & Amanah Fluid Glow) */}
      <div
        className="absolute top-0 left-0 w-full h-[550px] z-0 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
        }}
      >
        {/* Deep Blue Base */}
        <div className="absolute -top-[10%] -left-[20%] w-[140%] h-[350px] bg-[#0A44FF] rounded-full filter blur-[100px] opacity-90" />
        {/* Vibrant Cyan Glow */}
        <div className="absolute top-[5%] -right-[20%] w-[100%] h-[250px] bg-[#00D4FF] rounded-full filter blur-[90px] opacity-80" />
      </div>

      {/* Main Content Scrollable Area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-5 pt-2 pb-32 no-scrollbar">
        {/* Doctor Profile Header */}
        <DoctorProfileHeader
          profile={data.profile}
          onNotificationClick={() => showToast('Membuka Notifikasi...')}
          onProfileClick={() => showToast(`Dokter: ${data.profile.name}`)}
        />

        {/* 3D Stack of Schedule Cards with Swipe & Drag Gesture */}
        <ScheduleCardStack schedules={data.schedules} />

        {/* Quick Access Menu Grid */}
        <QuickAccessSection
          actions={data.quickActions}
          onActionClick={(id) => {
            showToast(`Akses menu: ${id}`);
          }}
        />

        {/* Today's Activity Stat Cards */}
        <TodayActivitySection
          activities={data.activities}
          onDetailClick={() => showToast('Membuka rincian aktivitas hari ini...')}
          onActivityClick={(id) => showToast(`Rincian data: ${id}`)}
        />

        {/* Logout Quick Trigger for Prototype Testing */}
        {props.onLogout && (
          <div className="flex justify-center pt-2 pb-4">
            <button
              type="button"
              onClick={props.onLogout}
              className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer py-1.5 px-3 rounded-full hover:bg-slate-100"
            >
              Keluar ke Halaman Utama
            </button>
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
      />
    </div>
  );
}
