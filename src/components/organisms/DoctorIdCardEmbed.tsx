'use client';

import React from 'react';
import { DoctorIdCard3D, type DoctorCardProfile } from '@/components/atoms/DoctorIdCard3D';
import { cn } from '@/lib/utils';

export function DoctorIdCardEmbed(props: {
  theme?: 'dark' | 'light';
  profile?: Partial<DoctorCardProfile>;
  transparent?: boolean;
}) {
  const [profile, setProfile] = React.useState<DoctorCardProfile>({
    name: props.profile?.name ?? 'dr. Amelia Cantika',
    role: props.profile?.role ?? 'Dokter Spesialis Anak',
    sip: props.profile?.sip ?? '503/442.1/SIP-D/2026',
    hospital: props.profile?.hospital ?? 'RS AMANAH SEHAT',
    avatarUrl: props.profile?.avatarUrl ?? '/assets/images/doctors/woman-doctor-4.png',
  });

  const [theme, setTheme] = React.useState<'dark' | 'light'>(props.theme ?? 'dark');
  const [isTransparent, setIsTransparent] = React.useState(props.transparent ?? false);

  // Sync with URL query parameters for direct WebView loading
  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const urlTheme = params.get('theme');
    if (urlTheme === 'dark' || urlTheme === 'light') {
      setTheme(urlTheme);
    }
    if (params.get('transparent') === 'true') {
      setIsTransparent(true);
    }

    setProfile(prev => ({
      name: params.get('name') ?? prev.name,
      role: params.get('role') ?? prev.role,
      sip: params.get('sip') ?? prev.sip,
      hospital: params.get('hospital') ?? prev.hospital,
      avatarUrl: params.get('avatarUrl') ?? prev.avatarUrl,
    }));

    // Listen for bi-directional messages from Flutter WebView bridge
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data.type === 'UPDATE_PROFILE') {
          setProfile(p => ({ ...p, ...data.payload }));
        } else if (data.type === 'SET_THEME') {
          if (data.payload === 'dark' || data.payload === 'light') {
            setTheme(data.payload);
          }
        }
      } catch {
        // Ignored
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const isDark = theme === 'dark';

  return (
    <main
      className={cn(
        'relative w-screen h-screen overflow-hidden select-none touch-none overscroll-none flex items-center justify-center',
        isTransparent
          ? 'bg-transparent'
          : isDark
            ? 'bg-[#070b14] text-white'
            : 'bg-[#f8faff] text-slate-900',
      )}
    >
      {/* Ambient Medical Blue Underglow */}
      <div
        className={cn(
          'absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full filter blur-[100px] pointer-events-none transition-all duration-700',
          isDark ? 'bg-cyan-500/20' : 'bg-blue-400/25',
        )}
      />

      {/* Full-Bleed 3D Lanyard Canvas */}
      <div className="relative w-full h-full">
        <DoctorIdCard3D profile={profile} theme={theme} />
      </div>
    </main>
  );
}
