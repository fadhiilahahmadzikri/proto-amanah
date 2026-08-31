'use client';

import { gsap } from 'gsap';
import {
  Bell,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Database,
  FileText,
  HelpCircle,
  Laptop,
  LogOut,
  Mail,
  Pencil,
  Phone,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import React from 'react';
import { ClayIcon } from '@/components/atoms/ClayIcon';
import { DoctorAvatar } from '@/components/atoms/DoctorAvatar';
import { useDoctorStore } from '@/features/doctor/hooks/use-doctor-store';
import { useModalStore } from '@/features/portal/hooks/use-modal-store';
import { cn } from '@/lib/utils';

type SettingsItem = {
  id: string;
  title: string;
  subtitle: string;
  colorPrimary: string;
  colorLight: string;
  colorDark: string;
  icon: React.ComponentType<{ className?: string }>;
};

const SETTINGS_ITEMS: SettingsItem[] = [
  {
    id: 'account',
    title: 'Akun & Identitas Dokter',
    subtitle: 'SIP, STR, NIK, Bio Medis',
    colorPrimary: '#0d66e9',
    colorLight: '#38bdf8',
    colorDark: '#1d58ac',
    icon: User,
  },
  {
    id: 'practice',
    title: 'Pengaturan Praktik & Shift',
    subtitle: 'Poli Spesialis, Kuota Pasien, Jadwal',
    colorPrimary: '#F59E0B',
    colorLight: '#FCD34D',
    colorDark: '#D97706',
    icon: Calendar,
  },
  {
    id: 'security',
    title: 'Privasi & Keamanan',
    subtitle: 'PIN Presensi, Biometrik, Akses Data',
    colorPrimary: '#10B981',
    colorLight: '#6EE7B7',
    colorDark: '#059669',
    icon: ShieldCheck,
  },
  {
    id: 'notifications',
    title: 'Notifikasi & Pengingat',
    subtitle: 'Panggilan Darurat IGD, Suara, Alarm Shift',
    colorPrimary: '#EF4444',
    colorLight: '#FCA5A5',
    colorDark: '#DC2626',
    icon: Bell,
  },
  {
    id: 'data',
    title: 'Data & Penyimpanan',
    subtitle: 'Unduh Laporan PDF, Cache SIMRS',
    colorPrimary: '#0d66e9',
    colorLight: '#38bdf8',
    colorDark: '#1d58ac',
    icon: Database,
  },
  {
    id: 'documents',
    title: 'Dokumen & Sertifikasi',
    subtitle: 'SIP Aktif, STR KKI, IDAI',
    colorPrimary: '#06B6D4',
    colorLight: '#67E8F9',
    colorDark: '#0891B2',
    icon: FileText,
  },
  {
    id: 'devices',
    title: 'Perangkat Terhubung',
    subtitle: 'Mobile App, Tablet Poli, Desktop RS',
    colorPrimary: '#14B8A6',
    colorLight: '#5EEAD4',
    colorDark: '#0F766E',
    icon: Laptop,
  },
  {
    id: 'help',
    title: 'Bantuan & IT Support',
    subtitle: 'Helpdesk SIMRS, Panduan Presensi',
    colorPrimary: '#8B5CF6',
    colorLight: '#C4B5FD',
    colorDark: '#6D28D9',
    icon: HelpCircle,
  },
];

export function AccountTabScreen(props: {
  theme?: 'dark' | 'light';
  onBack?: () => void;
  onLogout?: () => void;
  initialModalVariant?: string;
  className?: string;
}) {
  const isDark = props.theme === 'dark';
  const { profile, updateProfile, setAvatarUrl } = useDoctorStore();

  // Image Upload State & Ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Edit Profile States
  const [showEditModal, setShowEditModal] = React.useState(
    props.initialModalVariant === 'edit-profile',
  );
  const [draftName, setDraftName] = React.useState(profile.name);
  const [draftPhone, setDraftPhone] = React.useState(profile.phone);
  const [draftEmail, setDraftEmail] = React.useState(profile.email);
  const [draftBio, setDraftBio] = React.useState(profile.bio);
  const [isSaved, setIsSaved] = React.useState(false);

  const { openModal, closeModal } = useModalStore();

  // Sync drawer visibility with master modal store to hide BottomNavBar
  React.useEffect(() => {
    if (showEditModal) {
      openModal();
      return () => {
        closeModal();
      };
    }
    return undefined;
  }, [showEditModal, openModal, closeModal]);

  // Edit Profile Drawer GSAP & Gesture Refs
  const editDrawerRef = React.useRef<HTMLDivElement>(null);
  const editContentRef = React.useRef<HTMLDivElement>(null);
  const editStartYRef = React.useRef(0);
  const editCurrentDragYRef = React.useRef(0);
  const editIsDraggingRef = React.useRef(false);
  const editIsClosingRef = React.useRef(false);

  // Sync draft when opening Drawer
  React.useEffect(() => {
    if (showEditModal) {
      setDraftName(profile.name);
      setDraftPhone(profile.phone);
      setDraftEmail(profile.email);
      setDraftBio(profile.bio);
    }
  }, [showEditModal, profile.name, profile.phone, profile.email, profile.bio]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drawer Entrance Animation
  React.useEffect(() => {
    if (showEditModal && editDrawerRef.current) {
      gsap.fromTo(
        editDrawerRef.current,
        { y: '100%', opacity: 0.95 },
        { y: '0%', opacity: 1, duration: 0.32, ease: 'power3.out' },
      );
    }
  }, [showEditModal]);

  const triggerCloseEditDrawer = React.useCallback(() => {
    if (editIsClosingRef.current || !editDrawerRef.current) {
      setShowEditModal(false);
      return;
    }
    editIsClosingRef.current = true;

    gsap.to(editDrawerRef.current, {
      y: '100%',
      opacity: 0.9,
      duration: 0.28,
      ease: 'power3.in',
      onComplete: () => {
        setShowEditModal(false);
        editIsClosingRef.current = false;
      },
    });
  }, []);

  const handleEditPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target instanceof HTMLElement ? e.target : null;
    if (target?.closest('input, textarea, select, button, a')) {
      return;
    }
    editStartYRef.current = e.clientY;
    editCurrentDragYRef.current = 0;
    if (!editContentRef.current || editContentRef.current.scrollTop <= 0) {
      editIsDraggingRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handleEditPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!editIsDraggingRef.current || !editDrawerRef.current) return;
    const deltaY = e.clientY - editStartYRef.current;
    if (deltaY > 0) {
      editCurrentDragYRef.current = deltaY;
      gsap.set(editDrawerRef.current, { y: deltaY });
    }
  };

  const handleEditPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!editIsDraggingRef.current || !editDrawerRef.current) return;
    editIsDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
    if (editCurrentDragYRef.current > 70) {
      triggerCloseEditDrawer();
    } else {
      gsap.to(editDrawerRef.current, { y: 0, duration: 0.35, ease: 'elastic.out(1, 0.75)' });
    }
  };

  const handleSaveProfile = () => {
    updateProfile({
      name: draftName,
      phone: draftPhone,
      email: draftEmail,
      bio: draftBio,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      triggerCloseEditDrawer();
    }, 500);
  };

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-y-auto no-scrollbar flex flex-col select-text',
        isDark ? 'bg-[#0a0e1a] text-white' : 'bg-[#f8faff] text-slate-900',
        props.className,
      )}
    >
      {/* 1. Full-Bleed Nature Masked Profile Header */}
      <div
        className={cn(
          'relative w-full overflow-hidden transition-all select-none shrink-0',
          isDark ? 'bg-[#0a0e1a] text-white' : 'bg-white text-slate-900',
        )}
      >
        {/* Scenic Nature Cover Photo with Linear Mask */}
        <div
          className="relative h-[135px] w-full overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop)',
            maskImage: 'linear-gradient(to bottom, black 35%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 35%, transparent 100%)',
          }}
        />

        {/* Floating Liquid Glassmorphism Back Button */}
        {props.onBack && (
          <button
            type="button"
            aria-label="Kembali ke Beranda"
            onClick={props.onBack}
            className={cn(
              'absolute top-4 left-4 z-30 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-90 cursor-pointer shadow-md',
              isDark
                ? 'bg-black/40 text-white border border-white/20 hover:bg-black/60 shadow-black/40'
                : 'bg-white/75 text-slate-800 border border-white/80 hover:bg-white/90 shadow-slate-900/10',
            )}
          >
            <ChevronLeft className="h-4.5 w-4.5 -ml-0.5" />
          </button>
        )}

        {/* Seamless Theme Gradient Fade */}
        <div
          className={cn(
            'absolute inset-x-0 top-0 h-[135px] pointer-events-none',
            isDark
              ? 'bg-gradient-to-b from-transparent via-[#0a0e1a]/30 to-[#0a0e1a]'
              : 'bg-gradient-to-b from-transparent via-white/30 to-white',
          )}
        />

        {/* Profile Identity Body */}
        <div className="relative px-5 pt-0 pb-3.5">
          {/* Overlapping Avatar with Pure White Ring and Floating Camera Upload Button */}
          <div className="flex items-end justify-between -mt-12 mb-2.5">
            <div className="relative inline-block">
              {/* Hidden file input for uploading image directly */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />

              <DoctorAvatar
                src={profile.avatarUrl}
                alt={profile.name}
                size={74}
                className={cn(
                  'ring-4 shadow-lg transition-colors',
                  isDark ? 'ring-[#0a0e1a] bg-[#0a0e1a]' : 'ring-white bg-white',
                )}
              />

              {/* Floating Camera Button (100% Optically & Geometrically Centered SVG) */}
              <button
                type="button"
                aria-label="Upload Foto Profil Dokter"
                title="Upload Foto Profil"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#2AABEE] text-white shadow-md ring-2 transition-transform active:scale-90 cursor-pointer hover:bg-[#2299d6] p-0',
                  isDark ? 'ring-[#0a0e1a]' : 'ring-white',
                )}
              >
                <svg
                  className="w-4 h-4 text-white shrink-0 block"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 4h-5L7.5 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5L14.5 4z" />
                  <circle cx="12" cy="13.5" r="3.2" />
                </svg>
              </button>
            </div>
          </div>

          {/* Doctor Name & Role */}
          <div className="flex flex-col">
            <h2 className="text-[18px] font-bold tracking-tight leading-tight">
              {profile.name}
            </h2>
            <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mt-0.5">
              {profile.role}
            </p>

            {/* Doctor Bio (Rendered on Front) */}
            {profile.bio && (
              <p
                className={cn(
                  'text-[11.5px] leading-relaxed mt-1.5 line-clamp-2',
                  isDark ? 'text-neutral-300' : 'text-slate-600',
                )}
              >
                {profile.bio}
              </p>
            )}

            {/* Sub-row: ID Metadata & Compose [Icon + Text] Edit Profil Trigger with generous spacing */}
            <div className="flex items-center justify-between mt-3 pt-0.5">
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-neutral-400">
                <span>ID: DOC-2026-0819</span>
                {/* Separator matches exact text color */}
                <span className="w-px h-3 bg-current opacity-40 shrink-0" />
                <span>RS Amanah Sehat</span>
              </div>

              {/* Compose: [Leading Icon + Text] */}
              <button
                type="button"
                onClick={() => setShowEditModal(true)}
                className={cn(
                  'inline-flex items-center gap-1.5 text-[11px] font-semibold transition-colors cursor-pointer hover:opacity-80 active:scale-95 shrink-0',
                  isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700',
                )}
              >
                <Pencil className="w-3 h-3" />
                <span>Edit Profil</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Settings Items Container (ClayIcon Style without outline border) */}
      <div className="flex flex-col px-5 pt-1 pb-28 gap-3">
        {/* Main Settings Card Container - Outline Removed */}
        <div
          className={cn(
            'flex flex-col rounded-3xl overflow-hidden transition-colors select-none divide-y',
            isDark
              ? 'bg-[#111624] divide-white/5 shadow-2xs'
              : 'bg-white divide-slate-100 shadow-2xs',
          )}
        >
          {SETTINGS_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={cn(
                  'flex items-center justify-between px-4 py-3 transition-colors text-left cursor-pointer focus:outline-none select-none group',
                  isDark ? 'hover:bg-white/5 text-white active:bg-white/10' : 'hover:bg-slate-50 text-slate-900 active:bg-slate-100',
                )}
              >
                {/* Left: 3D ClayIcon Badge without glow + Title & Subtitle */}
                <div className="flex items-center gap-3.5 min-w-0 pr-2">
                  <ClayIcon
                    size={28}
                    colorPrimary={item.colorPrimary}
                    colorLight={item.colorLight}
                    colorDark={item.colorDark}
                  >
                    <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                  </ClayIcon>

                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-semibold tracking-tight leading-tight truncate">
                      {item.title}
                    </span>
                    <span className="text-[11px] font-normal leading-tight text-neutral-400 dark:text-neutral-400 text-slate-500 mt-0.5 truncate">
                      {item.subtitle}
                    </span>
                  </div>
                </div>

                {/* Right: Subtle Trailing Chevron */}
                <ChevronRight className={cn('h-4 w-4 shrink-0 transition-opacity opacity-40 group-hover:opacity-80', isDark ? 'text-neutral-400' : 'text-slate-400')} />
              </button>
            );
          })}
        </div>

        {/* Logout Action Button */}
        {props.onLogout && (
          <button
            type="button"
            onClick={props.onLogout}
            className={cn(
              'flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer select-none w-full active:scale-98 mt-1',
              isDark
                ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20'
                : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200 shadow-2xs',
            )}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Keluar dari Akun Dokter</span>
          </button>
        )}
      </div>

      {/* 3. Compact Edit Profile Master Drawer (Contained inside Phone Screen) */}
      {showEditModal && (
        <>
          <div
            onClick={triggerCloseEditDrawer}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />

          <div
            ref={editDrawerRef}
            onPointerDown={handleEditPointerDown}
            onPointerMove={handleEditPointerMove}
            onPointerUp={handleEditPointerUp}
            onPointerCancel={handleEditPointerUp}
            className={cn(
              'absolute inset-x-0 bottom-0 z-50 flex min-h-[440px] max-h-[90%] w-full flex-col justify-between overflow-hidden rounded-t-[32px] sm:rounded-t-[36px] shadow-[0_-12px_45px_rgba(0,0,0,0.25)] border-t will-change-transform select-text touch-pan-y backdrop-blur-2xl',
              isDark
                ? 'bg-[#0a0e1a] border-white/10 text-white shadow-black/80'
                : 'bg-white border-neutral-100 text-slate-900 shadow-[0_-12px_45px_rgba(0,0,0,0.25)]',
            )}
          >
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Interactive Drag Handle */}
              <div
                role="button"
                tabIndex={0}
                aria-label="Tarik ke bawah untuk menutup"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerCloseEditDrawer();
                }}
                className="flex w-full cursor-grab active:cursor-grabbing flex-col items-center justify-center pt-3 pb-1 shrink-0 touch-none select-none hover:bg-neutral-50/50 dark:hover:bg-white/5 transition-colors"
              >
                <div className={cn('h-1 w-9 rounded-full transition-colors duration-150', isDark ? 'bg-white/20' : 'bg-slate-300')} />
              </div>

              {/* Master Header with thin hairline border */}
              <div className={cn('relative z-20 flex items-center justify-between px-6 pt-1 pb-2.5 shrink-0 border-b', isDark ? 'border-white/5' : 'border-slate-100')}>
                <div>
                  <h3 className={cn('text-sm font-semibold tracking-tight', isDark ? 'text-white' : 'text-slate-900')}>
                    Edit Profil Dokter
                  </h3>
                  <p className={cn('text-[11px] font-normal mt-0.5', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                    Perbarui kontak dan bio profil
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Tutup Edit Profil"
                  onClick={triggerCloseEditDrawer}
                  className={cn(
                    'p-1.5 -mr-2 rounded-full transition-colors cursor-pointer flex items-center justify-center shrink-0',
                    isDark ? 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:text-slate-900',
                  )}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Detail Form Fields Body */}
              <div ref={editContentRef} className="flex w-full flex-1 flex-col px-6 pt-3.5 pb-3 overflow-y-auto no-scrollbar select-text gap-4">
                {/* 1. Nama Dokter */}
                <div className="flex flex-col gap-1.5">
                  <span className={cn('text-xs font-semibold tracking-tight', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                    Nama Lengkap Dokter
                  </span>
                  <input
                    type="text"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    placeholder="Nama Dokter..."
                    className={cn(
                      'w-full px-3.5 py-2.5 rounded-2xl border text-xs font-medium focus:outline-none transition-colors',
                      isDark
                        ? 'bg-white/5 border-white/10 text-white focus:border-cyan-400'
                        : 'bg-white border-slate-200 text-slate-900 focus:border-blue-600',
                    )}
                  />
                  <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium">
                    ✓ Terverifikasi Manajemen RS Amanah Sehat
                  </span>
                </div>

                {/* 2. Nomor WhatsApp / Telepon */}
                <div className="flex flex-col gap-1.5">
                  <span className={cn('text-xs font-semibold tracking-tight', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                    Nomor WhatsApp / Telepon
                  </span>
                  <div className="relative">
                    <Phone className={cn('absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5', isDark ? 'text-neutral-400' : 'text-slate-400')} />
                    <input
                      type="tel"
                      value={draftPhone}
                      onChange={(e) => setDraftPhone(e.target.value)}
                      placeholder="+62 812-xxxx-xxxx"
                      className={cn(
                        'w-full pl-9 pr-3.5 py-2.5 rounded-2xl border text-xs font-medium focus:outline-none transition-colors',
                        isDark
                          ? 'bg-white/5 border-white/10 text-white focus:border-cyan-400'
                          : 'bg-white border-slate-200 text-slate-900 focus:border-blue-600',
                      )}
                    />
                  </div>
                </div>

                {/* 3. Email Dokter */}
                <div className="flex flex-col gap-1.5">
                  <span className={cn('text-xs font-semibold tracking-tight', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                    Email Resmi
                  </span>
                  <div className="relative">
                    <Mail className={cn('absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5', isDark ? 'text-neutral-400' : 'text-slate-400')} />
                    <input
                      type="email"
                      value={draftEmail}
                      onChange={(e) => setDraftEmail(e.target.value)}
                      placeholder="dokter@rsamanah.co.id"
                      className={cn(
                        'w-full pl-9 pr-3.5 py-2.5 rounded-2xl border text-xs font-medium focus:outline-none transition-colors',
                        isDark
                          ? 'bg-white/5 border-white/10 text-white focus:border-cyan-400'
                          : 'bg-white border-slate-200 text-slate-900 focus:border-blue-600',
                      )}
                    />
                  </div>
                </div>

                {/* 4. Bio / Keterangan Profil */}
                <div className="flex flex-col gap-1.5">
                  <span className={cn('text-xs font-semibold tracking-tight', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                    Bio Medis
                  </span>
                  <textarea
                    rows={2}
                    value={draftBio}
                    onChange={(e) => setDraftBio(e.target.value)}
                    placeholder="Tuliskan bio atau catatan singkat profil..."
                    className={cn(
                      'w-full px-3.5 py-2 rounded-2xl border text-xs font-medium focus:outline-none transition-colors resize-none leading-relaxed',
                      isDark
                        ? 'bg-white/5 border-white/10 text-white focus:border-cyan-400'
                        : 'bg-white border-slate-200 text-slate-900 focus:border-blue-600',
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons: Batal & Simpan */}
            <div className="px-6 pb-28 sm:pb-32 pt-2 shrink-0 border-t border-white/5 dark:border-white/5 border-slate-100 flex items-center gap-2.5">
              <button
                type="button"
                onClick={triggerCloseEditDrawer}
                className={cn(
                  'w-1/3 py-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer active:scale-98 text-center',
                  isDark
                    ? 'border-white/10 text-neutral-300 hover:bg-white/5'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-100',
                )}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className={cn(
                  'w-2/3 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-98 text-center flex items-center justify-center gap-1.5',
                  isDark
                    ? 'bg-white text-slate-950 border-white hover:bg-neutral-100'
                    : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800',
                )}
              >
                {isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Tersimpan</span>
                  </>
                ) : (
                  <span>Simpan Perubahan</span>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
