'use client';

import {
  Award,
  ChevronRight,
  FileBadge,
  HelpCircle,
  Lock,
  LogOut,
  Shield,
} from 'lucide-react';
import { DoctorAvatar } from '@/components/atoms/DoctorAvatar';
import portalData from '@/data/portal/portal-data.json';
import { cn } from '@/lib/utils';

export function AccountTabScreen(props: {
  theme?: 'dark' | 'light';
  onLogout?: () => void;
  className?: string;
}) {
  const isDark = props.theme === 'dark';
  const profile = portalData.profile;

  const menuItems = [
    { id: 'sip', label: 'Surat Izin Praktek (SIP)', icon: FileBadge, detail: 'SIP: 446/1029/DS/2024' },
    { id: 'specialist', label: 'Spesialisasi & Sertifikasi', icon: Award, detail: 'Ikatan Dokter Anak Indonesia (IDAI)' },
    { id: 'security', label: 'Keamanan & PIN Presensi', icon: Lock },
    { id: 'privacy', label: 'Privasi Data Rekam Medis', icon: Shield },
    { id: 'help', label: 'Pusat Bantuan & IT Support', icon: HelpCircle },
  ];

  return (
    <div className={cn('flex flex-col justify-between h-full select-text w-full', props.className)}>
      <div>
        {/* Full-Bleed Profile Header with Scenic Nature Cover (No border/shadow separation) */}
        <div
          className={cn(
            'relative w-[calc(100%+40px)] -mx-5 -mt-2 overflow-hidden transition-all select-none',
            isDark
              ? 'bg-neutral-900/90 text-white'
              : 'bg-white text-slate-900',
          )}
        >
          {/* Scenic Nature Atmospheric Cover Banner */}
          <div
            className="relative h-[125px] w-full overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=800&auto=format&fit=crop)',
            }}
          >
            {/* Subtle Ambient Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/25" />
          </div>

          {/* Profile Identity Body (Blends seamlessly into canvas) */}
          <div className="relative px-5 pt-0 pb-3.5">
            {/* Overlapping Avatar with Solid Pure White Ring */}
            <div className="flex items-end justify-between -mt-10 mb-2">
              <DoctorAvatar
                src={profile.avatarUrl}
                alt={profile.name}
                size={72}
                className="ring-4 ring-white bg-white shadow-md"
              />
            </div>

            {/* Doctor Name & Identity Info */}
            <div className="flex flex-col">
              <h2 className="text-[18px] font-bold tracking-tight leading-tight">
                {profile.name}
              </h2>
              <p className="text-xs font-semibold text-blue-600 dark:text-cyan-400 mt-0.5">
                {profile.role}
              </p>

              {/* Vertical Hairline Separator Metadata */}
              <div className="flex items-center gap-2.5 text-[11px] text-slate-500 dark:text-neutral-400 mt-1.5">
                <span>ID: DOC-2026-0819</span>
                <span className="w-px h-3 bg-slate-300 dark:bg-neutral-700 shrink-0" />
                <span>RS Amanah Sehat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fluid Unboxed Settings Menu List */}
        <div className="flex flex-col divide-y divide-slate-100/90 dark:divide-white/5 w-full mt-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={cn(
                  'flex items-center justify-between py-3.5 px-1 transition-colors text-left cursor-pointer focus:outline-none select-none rounded-xl',
                  isDark ? 'hover:bg-white/5 text-white' : 'hover:bg-slate-50/80 text-slate-800',
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'p-2 rounded-xl shrink-0 transition-colors',
                      isDark
                        ? 'bg-blue-950/60 text-cyan-400'
                        : 'bg-blue-50 text-blue-600',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">{item.label}</span>
                    {item.detail && (
                      <span className="text-[10px] text-slate-400 dark:text-neutral-400 block mt-0.5">
                        {item.detail}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 dark:text-neutral-500" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout Action */}
      {props.onLogout && (
        <button
          type="button"
          onClick={props.onLogout}
          className={cn(
            'flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer select-none w-full mb-1',
            isDark
              ? 'bg-red-500/15 hover:bg-red-500/25 text-red-400 border-red-500/30'
              : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200',
          )}
        >
          <LogOut className="h-4 w-4" />
          <span>Keluar dari Akun Dokter</span>
        </button>
      )}
    </div>
  );
}
