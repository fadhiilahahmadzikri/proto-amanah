'use client';

import { Award, ChevronRight, FileBadge, HelpCircle, Lock, LogOut, Shield } from 'lucide-react';
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
    { id: 'specialist', label: 'Spesialisasi & Sertifikasi', icon: Award, detail: 'Ikatan Dokter Anak Indonesia' },
    { id: 'security', label: 'Keamanan & PIN Presensi', icon: Lock },
    { id: 'privacy', label: 'Privasi Data Rekam Medis', icon: Shield },
    { id: 'help', label: 'Pusat Bantuan & IT Support', icon: HelpCircle },
  ];

  return (
    <div className={cn('flex flex-col gap-4 pt-2 pb-28 select-text', props.className)}>
      {/* Profile Header Card */}
      <div
        className={cn(
          'flex flex-col items-center text-center p-6 rounded-[28px] border backdrop-blur-xl shadow-xl transition-all',
          isDark
            ? 'bg-neutral-900/80 border-white/10 text-white shadow-black/40'
            : 'bg-white border-slate-100 text-slate-900 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)]',
        )}
      >
        <DoctorAvatar
          src={profile.avatarUrl}
          alt={profile.name}
          size={72}
          className="mb-3 ring-4 ring-blue-500/20"
        />
        <h2 className="text-lg font-bold tracking-tight">{profile.name}</h2>
        <span
          className={cn(
            'text-xs font-semibold mt-0.5',
            isDark ? 'text-cyan-400' : 'text-blue-600',
          )}
        >
          {profile.role}
        </span>
        <span className="text-[11px] text-neutral-400 mt-1">
          ID Dokter: DOC-2026-0819 • RS Amanah Sehat
        </span>
      </div>

      {/* Profile Settings Menu List */}
      <div
        className={cn(
          'flex flex-col rounded-[24px] border overflow-hidden transition-all divide-y',
          isDark
            ? 'bg-neutral-900/80 border-white/10 divide-white/5 text-white'
            : 'bg-white border-slate-100 divide-slate-100 text-slate-800 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.04)]',
        )}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className={cn(
                'flex items-center justify-between p-4 transition-colors text-left cursor-pointer focus:outline-none select-none',
                isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50',
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'p-2 rounded-xl',
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
                    <span className="text-[10px] text-neutral-400 block mt-0.5">
                      {item.detail}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-400" />
            </button>
          );
        })}
      </div>

      {/* Logout Action */}
      {props.onLogout && (
        <button
          type="button"
          onClick={props.onLogout}
          className={cn(
            'flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer select-none',
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
