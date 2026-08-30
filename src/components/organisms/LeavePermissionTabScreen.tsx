'use client';

import { gsap } from 'gsap';
import {
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Edit3,
  FileCheck,
  Info,
  Plus,
  Stethoscope,
  Trash2,
  UserCheck,
  X,
} from 'lucide-react';
import React from 'react';
import { Button } from '@/components/atoms/Button';
import { ClayIcon } from '@/components/atoms/ClayIcon';
import { DoctorAvatar } from '@/components/atoms/DoctorAvatar';
import { ScreenHeader } from '@/components/molecules/ScreenHeader';
import { useDoctorStore } from '@/features/doctor/hooks/use-doctor-store';
import { usePermissionStore } from '@/features/doctor/hooks/use-permission-store';
import { useModalStore } from '@/features/portal/hooks/use-modal-store';
import { cn } from '@/lib/utils';
import type { PermissionRecord, PermissionStatus, PermissionType } from '@/types/permission.types';

const PERMISSION_TYPES: PermissionType[] = [
  'Cuti Tahunan',
  'Izin Sakit',
  'Seminar / Simposium',
  'Urusan Keluarga',
  'Tugas Luar RS',
];

const TYPE_THEMES: Record<
  PermissionType,
  {
    primary: string;
    light: string;
    dark: string;
  }
> = {
  'Cuti Tahunan': {
    primary: '#2563EB',
    light: '#60A5FA',
    dark: '#1D4ED8',
  },
  'Izin Sakit': {
    primary: '#EF4444',
    light: '#FCA5A5',
    dark: '#DC2626',
  },
  'Seminar / Simposium': {
    primary: '#8B5CF6',
    light: '#C4B5FD',
    dark: '#6D28D9',
  },
  'Urusan Keluarga': {
    primary: '#F59E0B',
    light: '#FCD34D',
    dark: '#D97706',
  },
  'Tugas Luar RS': {
    primary: '#06B6D4',
    light: '#67E8F9',
    dark: '#0891B2',
  },
};

function formatDateIndo(dateStr: string) {
  try {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function LeavePermissionTabScreen(props: {
  theme?: 'dark' | 'light';
  onBack?: () => void;
  className?: string;
}) {
  const isDark = props.theme === 'dark';
  const { profile } = useDoctorStore();
  const {
    records,
    pendingCount,
    createPermission,
    updatePermission,
    cancelPermission,
  } = usePermissionStore();

  const { openModal, closeModal } = useModalStore();

  // Filter state
  const [statusFilter, setStatusFilter] = React.useState<'all' | PermissionStatus>('all');

  // Detail Drawer state
  const [detailRecord, setDetailRecord] = React.useState<PermissionRecord | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = React.useState(false);
  const detailDrawerRef = React.useRef<HTMLDivElement>(null);
  const isClosingDetailRef = React.useRef(false);

  // Form Drawer state (Create & Edit)
  const [isFormDrawerOpen, setIsFormDrawerOpen] = React.useState(false);
  const [editingRecordId, setEditingRecordId] = React.useState<string | null>(null);
  const formDrawerRef = React.useRef<HTMLDivElement>(null);
  const isClosingFormRef = React.useRef(false);

  const [formData, setFormData] = React.useState<{
    type: PermissionType;
    startDate: string;
    endDate: string;
    reason: string;
    substituteDoctor: string;
  }>({
    type: 'Cuti Tahunan',
    startDate: '2026-09-05',
    endDate: '2026-09-07',
    reason: '',
    substituteDoctor: 'dr. Budi Santoso, Sp.A',
  });
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Cancel Confirmation Modal state
  const [recordToCancel, setRecordToCancel] = React.useState<PermissionRecord | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Sync drawer visibility with master modal store to hide BottomNavBar
  const isAnyDrawerOpen = isDetailDrawerOpen || isFormDrawerOpen || Boolean(recordToCancel);
  React.useEffect(() => {
    if (isAnyDrawerOpen) {
      openModal();
      return () => {
        closeModal();
      };
    }
    return undefined;
  }, [isAnyDrawerOpen, openModal, closeModal]);

  // Detail Drawer Animations
  React.useEffect(() => {
    if (isDetailDrawerOpen && detailDrawerRef.current) {
      isClosingDetailRef.current = false;
      gsap.fromTo(
        detailDrawerRef.current,
        { y: '100%', opacity: 0.95 },
        { y: '0%', opacity: 1, duration: 0.32, ease: 'power3.out' },
      );
    }
  }, [isDetailDrawerOpen]);

  const triggerCloseDetailDrawer = () => {
    if (isClosingDetailRef.current || !detailDrawerRef.current) {
      setIsDetailDrawerOpen(false);
      return;
    }
    isClosingDetailRef.current = true;
    gsap.to(detailDrawerRef.current, {
      y: '100%',
      opacity: 0.9,
      duration: 0.28,
      ease: 'power3.in',
      onComplete: () => {
        setIsDetailDrawerOpen(false);
        isClosingDetailRef.current = false;
      },
    });
  };

  // Form Drawer Animations
  React.useEffect(() => {
    if (isFormDrawerOpen && formDrawerRef.current) {
      isClosingFormRef.current = false;
      gsap.fromTo(
        formDrawerRef.current,
        { y: '100%', opacity: 0.95 },
        { y: '0%', opacity: 1, duration: 0.32, ease: 'power3.out' },
      );
    }
  }, [isFormDrawerOpen]);

  const triggerCloseFormDrawer = () => {
    if (isClosingFormRef.current || !formDrawerRef.current) {
      setIsFormDrawerOpen(false);
      return;
    }
    isClosingFormRef.current = true;
    gsap.to(formDrawerRef.current, {
      y: '100%',
      opacity: 0.9,
      duration: 0.28,
      ease: 'power3.in',
      onComplete: () => {
        setIsFormDrawerOpen(false);
        isClosingFormRef.current = false;
      },
    });
  };

  // Handlers for Drawer Triggers
  const handleOpenDetail = (record: PermissionRecord) => {
    setDetailRecord(record);
    setIsDetailDrawerOpen(true);
  };

  const handleOpenCreateForm = () => {
    setEditingRecordId(null);
    setFormData({
      type: 'Cuti Tahunan',
      startDate: '2026-09-05',
      endDate: '2026-09-07',
      reason: '',
      substituteDoctor: 'dr. Budi Santoso, Sp.A',
    });
    setFormErrors({});
    setIsFormDrawerOpen(true);
  };

  const handleOpenEditForm = (record: PermissionRecord) => {
    if (record.status !== 'menunggu') {
      showToast('Hanya perizinan dengan status menunggu yang dapat diedit.');
      return;
    }
    setEditingRecordId(record.id);
    setFormData({
      type: record.type,
      startDate: record.startDate,
      endDate: record.endDate,
      reason: record.reason,
      substituteDoctor: record.substituteDoctor || '',
    });
    setFormErrors({});
    setIsDetailDrawerOpen(false);
    setIsFormDrawerOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.startDate) {
      errors.startDate = 'Tanggal mulai wajib dipilih';
    }
    if (!formData.endDate) {
      errors.endDate = 'Tanggal selesai wajib dipilih';
    }
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      errors.endDate = 'Tanggal selesai tidak boleh sebelum tanggal mulai';
    }
    if (!formData.reason.trim()) {
      errors.reason = 'Pesan / alasan perizinan wajib diisi';
    } else if (formData.reason.trim().length < 8) {
      errors.reason = 'Tuliskan alasan minimal 8 karakter';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      if (editingRecordId) {
        const res = updatePermission(editingRecordId, {
          type: formData.type,
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason,
          substituteDoctor: formData.substituteDoctor,
        });
        setIsSubmitting(false);
        if (res.success) {
          showToast('Perubahan perizinan berhasil disimpan.');
          triggerCloseFormDrawer();
        } else {
          showToast(res.message);
        }
      } else {
        createPermission({
          type: formData.type,
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason,
          substituteDoctor: formData.substituteDoctor,
        });
        setIsSubmitting(false);
        showToast('Pengajuan izin berhasil dikirim.');
        triggerCloseFormDrawer();
      }
    }, 350);
  };

  const handleConfirmCancelRecord = () => {
    if (!recordToCancel) return;
    const res = cancelPermission(recordToCancel.id);
    setRecordToCancel(null);
    setIsDetailDrawerOpen(false);
    if (res.success) {
      showToast('Pengajuan izin berhasil dibatalkan.');
    } else {
      showToast(res.message);
    }
  };

  const calculatedDays = (() => {
    try {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1;
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return diff > 0 ? diff : 1;
    } catch {
      return 1;
    }
  })();

  const filteredRecords = records.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden select-text flex flex-col',
        isDark ? 'bg-[#0a0e1a] text-white' : 'bg-[#f8faff] text-slate-900',
        props.className,
      )}
    >
      {/* 1. Header (Matching ScheduleTabScreen: Clean Title, Back Button, Simple Vector Plus Button) */}
      <ScreenHeader
        title="Perizinan"
        onBack={props.onBack}
        theme={props.theme}
        rightAction={
          <button
            type="button"
            aria-label="Tambah Perizinan Baru"
            onClick={handleOpenCreateForm}
            className={cn(
              'p-1.5 -mr-1.5 rounded-full transition-all cursor-pointer active:scale-90 flex items-center justify-center',
              isDark
                ? 'text-cyan-400 hover:text-cyan-300 hover:bg-white/10'
                : 'text-blue-600 hover:text-blue-700 hover:bg-slate-100',
            )}
          >
            <Plus className="h-6 w-6 stroke-[2]" />
          </button>
        }
      />

      {/* 2. Filter Chips (Clean, Minimalist Segmented Chips) */}
      <div className="flex items-center gap-1.5 px-5 pt-1 pb-2.5 overflow-x-auto no-scrollbar shrink-0 select-none">
        {[
          { id: 'all', label: 'Semua' },
          { id: 'menunggu', label: 'Menunggu' },
          { id: 'disetujui', label: 'Disetujui' },
          { id: 'ditolak', label: 'Ditolak' },
          { id: 'dibatalkan', label: 'Dibatalkan' },
        ].map((chip) => {
          const isActive = statusFilter === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => setStatusFilter(chip.id as 'all' | PermissionStatus)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all cursor-pointer shrink-0 flex items-center gap-1.5 active:scale-95',
                isActive
                  ? isDark
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'bg-slate-900 text-white shadow-xs'
                  : isDark
                    ? 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900',
              )}
            >
              <span>{chip.label}</span>
              {chip.id === 'menunggu' && pendingCount > 0 && (
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-bold',
                    isActive
                      ? isDark
                        ? 'bg-slate-200 text-slate-900'
                        : 'bg-slate-800 text-white'
                      : isDark
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-amber-100 text-amber-800',
                  )}
                >
                  {pendingCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Cards List Viewport (Identical Paradigm & Card Layout with Schedule Cards) */}
      <div className="flex-1 min-h-0 w-full overflow-y-auto no-scrollbar px-5 pt-1 pb-36 sm:pb-40 flex flex-col gap-3">
        {filteredRecords.length === 0 ? (
          <div
            className={cn(
              'p-6 rounded-3xl border text-center flex flex-col items-center justify-center gap-2 my-auto',
              isDark ? 'bg-white/5 border-white/10 text-neutral-400' : 'bg-slate-50 border-slate-200 text-slate-500',
            )}
          >
            <Calendar className="w-8 h-8 opacity-40 mb-1" />
            <h4 className={cn('text-sm font-bold', isDark ? 'text-white' : 'text-slate-900')}>
              Tidak ada perizinan
            </h4>
            <p className="text-xs max-w-xs leading-relaxed opacity-80">
              Belum ada riwayat perizinan pada filter ini. Tekan tombol tambah di atas untuk membuat izin baru.
            </p>
          </div>
        ) : (
          filteredRecords.map((item) => {
            const typeTheme = TYPE_THEMES[item.type] || TYPE_THEMES['Cuti Tahunan'];
            const isPending = item.status === 'menunggu';
            const isApproved = item.status === 'disetujui';
            const isRejected = item.status === 'ditolak';

            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => handleOpenDetail(item)}
                className={cn(
                  'relative w-full rounded-3xl p-4.5 select-none transition-all duration-200 active:scale-[0.99] cursor-pointer border flex flex-col justify-between shadow-sm hover:shadow-md',
                  isDark
                    ? 'bg-[#111624]/90 border-white/10 text-white hover:border-white/20'
                    : 'bg-white border-slate-100 text-slate-900 hover:border-slate-200',
                )}
              >
                {/* Card Header: Type with ClayIcon + Status Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ClayIcon
                      size={28}
                      colorPrimary={typeTheme.primary}
                      colorLight={typeTheme.light}
                      colorDark={typeTheme.dark}
                    >
                      <Calendar className="w-3.5 h-3.5 stroke-[2.2]" />
                    </ClayIcon>
                    <span className="text-sm font-bold tracking-tight truncate">
                      {item.type}
                    </span>
                  </div>

                  {/* Status Badge */}
                  {isPending && (
                    <div
                      className={cn(
                        'px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0 border',
                        isDark
                          ? 'bg-amber-950/60 border-amber-500/30 text-amber-400'
                          : 'bg-amber-50 border-amber-200 text-amber-800',
                      )}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                      <span className="text-[10px] font-bold tracking-tight">Menunggu</span>
                    </div>
                  )}

                  {isApproved && (
                    <div
                      className={cn(
                        'px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0 border',
                        isDark
                          ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-800',
                      )}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span className="text-[10px] font-bold tracking-tight">Disetujui</span>
                    </div>
                  )}

                  {isRejected && (
                    <div
                      className={cn(
                        'px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0 border',
                        isDark
                          ? 'bg-rose-950/60 border-rose-500/30 text-rose-400'
                          : 'bg-rose-50 border-rose-200 text-rose-800',
                      )}
                    >
                      <X className="w-3 h-3 stroke-[3]" />
                      <span className="text-[10px] font-bold tracking-tight">Ditolak</span>
                    </div>
                  )}

                  {item.status === 'dibatalkan' && (
                    <div
                      className={cn(
                        'px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0 border',
                        isDark
                          ? 'bg-white/5 border-white/10 text-neutral-400'
                          : 'bg-slate-100 border-slate-200 text-slate-600',
                      )}
                    >
                      <span className="text-[10px] font-bold tracking-tight">Dibatalkan</span>
                    </div>
                  )}
                </div>

                {/* Card Center / Hero: Date Range & Duration (Exposing Key Info Only) */}
                <div className="flex items-center justify-between mb-3.5 pt-0.5">
                  <div className="flex flex-col">
                    <span
                      className={cn(
                        'text-[17px] font-extrabold tracking-tight leading-tight',
                        isDark ? 'text-white' : 'text-slate-900',
                      )}
                    >
                      {formatDateIndo(item.startDate)} — {formatDateIndo(item.endDate)}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-neutral-400 mt-0.5">
                      Durasi izin praktik
                    </span>
                  </div>

                  <span
                    className={cn(
                      'text-xs font-black px-2.5 py-1 rounded-xl tabular-nums shadow-2xs',
                      isDark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-800',
                    )}
                  >
                    {item.durationDays} Hari
                  </span>
                </div>

                {/* Card Footer: Applicant User Info & Chevron (Clean and Identical Hierarchy) */}
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <DoctorAvatar
                      src={item.userAvatarUrl}
                      alt={item.userName}
                      size={28}
                      className="shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold truncate leading-tight">
                        {item.userName}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-neutral-400 truncate">
                        {item.userRole}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 opacity-60 group-hover:opacity-100 shrink-0" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. DETAIL DRAWER (Exposing All Detailed Info When Card is Clicked) */}
      {isDetailDrawerOpen && detailRecord && (
        <>
          <div
            onClick={triggerCloseDetailDrawer}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />

          <div
            ref={detailDrawerRef}
            className={cn(
              'absolute inset-x-0 bottom-0 z-60 flex max-h-[88%] min-h-[480px] w-full flex-col overflow-hidden rounded-t-[32px] sm:rounded-t-[36px] shadow-[0_-12px_45px_rgba(0,0,0,0.3)] border-t will-change-transform select-text touch-pan-y backdrop-blur-2xl',
              isDark
                ? 'bg-[#0a0e1a] border-white/10 text-white shadow-black/80'
                : 'bg-white border-neutral-100 text-slate-900',
            )}
          >
            {/* Interactive Drag Handle */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Tarik ke bawah untuk menutup"
              onClick={triggerCloseDetailDrawer}
              className="flex w-full cursor-grab active:cursor-grabbing flex-col items-center justify-center pt-3.5 pb-1 shrink-0 touch-none select-none"
            >
              <div className={cn('h-1.25 w-11 rounded-full transition-colors', isDark ? 'bg-white/25' : 'bg-neutral-300')} />
            </div>

            {/* Header */}
            <div className="relative z-20 flex items-center justify-between px-6 pt-0.5 pb-3 shrink-0 border-b border-slate-100 dark:border-white/10">
              <h3 className="text-base font-bold tracking-tight">
                Detail perizinan
              </h3>
              <button
                type="button"
                aria-label="Tutup detail perizinan"
                onClick={triggerCloseDetailDrawer}
                className={cn(
                  'p-1.5 -mr-2 rounded-full transition-colors cursor-pointer flex items-center justify-center shrink-0',
                  isDark ? 'bg-white/10 text-neutral-300 hover:text-white' : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900',
                )}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Drawer Body Content */}
            <div className="flex w-full flex-1 flex-col px-6 pt-3 pb-6 overflow-y-auto no-scrollbar select-text gap-3.5">
              {/* Status Banner */}
              <div
                className={cn(
                  'p-3 rounded-2xl border flex items-center justify-between text-xs font-bold',
                  detailRecord.status === 'menunggu'
                    ? isDark ? 'bg-amber-950/40 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
                    : detailRecord.status === 'disetujui'
                      ? isDark ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : detailRecord.status === 'ditolak'
                        ? isDark ? 'bg-rose-950/40 border-rose-500/30 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-800'
                        : isDark ? 'bg-white/5 border-white/10 text-neutral-400' : 'bg-slate-100 border-slate-200 text-slate-700',
                )}
              >
                <div className="flex items-center gap-2">
                  {detailRecord.status === 'menunggu' && <Clock className="w-4 h-4 text-amber-500" />}
                  {detailRecord.status === 'disetujui' && <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />}
                  {detailRecord.status === 'ditolak' && <X className="w-4 h-4 text-rose-500 stroke-[3]" />}
                  {detailRecord.status === 'dibatalkan' && <Info className="w-4 h-4" />}
                  <span className="capitalize">Status: {detailRecord.status}</span>
                </div>
                <span>{detailRecord.durationDays} Hari Izin</span>
              </div>

              {/* Applicant Info */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5">
                <DoctorAvatar
                  src={detailRecord.userAvatarUrl}
                  alt={detailRecord.userName}
                  size={42}
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold truncate">{detailRecord.userName}</span>
                  <span className="text-[11px] text-slate-500 dark:text-neutral-400 truncate">
                    {detailRecord.userRole}
                  </span>
                </div>
              </div>

              {/* Date Interval */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5">
                  <span className="text-[10px] text-slate-400 dark:text-neutral-500 block mb-0.5 font-semibold">
                    Mulai Izin
                  </span>
                  <span className="font-bold">{formatDateIndo(detailRecord.startDate)}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5">
                  <span className="text-[10px] text-slate-400 dark:text-neutral-500 block mb-0.5 font-semibold">
                    Selesai Izin
                  </span>
                  <span className="font-bold">{formatDateIndo(detailRecord.endDate)}</span>
                </div>
              </div>

              {/* Reason / Message (Detailed Explanation) */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 text-xs">
                <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-bold block mb-1">
                  Pesan / Alasan Perizinan:
                </span>
                <p className="leading-relaxed text-slate-700 dark:text-neutral-300">
                  {detailRecord.reason}
                </p>
              </div>

              {/* Substitute Doctor */}
              {detailRecord.substituteDoctor && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 text-xs flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-cyan-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-semibold block">
                      Dokter Pengganti:
                    </span>
                    <span className="font-bold">{detailRecord.substituteDoctor}</span>
                  </div>
                </div>
              )}

              {/* Reviewer / HRD Notes */}
              {detailRecord.reviewerNotes && (
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 text-xs">
                  <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-bold block mb-1">
                    Catatan Verifikasi:
                  </span>
                  <p className="leading-relaxed text-slate-700 dark:text-neutral-300">
                    {detailRecord.reviewerNotes}
                  </p>
                  {detailRecord.reviewerName && (
                    <span className="text-[10px] text-slate-400 dark:text-neutral-500 mt-1 block">
                      Oleh: {detailRecord.reviewerName}
                    </span>
                  )}
                </div>
              )}

              {/* Actions Footer (CRUD Operations inside Drawer) */}
              <div className="flex flex-col gap-2 pt-2 mt-auto">
                {detailRecord.status === 'menunggu' && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      onClick={() => handleOpenEditForm(detailRecord)}
                      startIcon={<Edit3 className="w-4 h-4" />}
                      className={cn(
                        isDark ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700',
                      )}
                    >
                      Edit Izin
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={() => setRecordToCancel(detailRecord)}
                      startIcon={<Trash2 className="w-4 h-4 text-rose-500" />}
                      className="border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-950/30"
                    >
                      Batalkan
                    </Button>
                  </div>
                )}

                {detailRecord.status === 'disetujui' && (
                  <div
                    className={cn(
                      'p-2.5 rounded-xl text-center text-xs font-semibold border flex items-center justify-center gap-1.5',
                      isDark ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800',
                    )}
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Izin telah disetujui (Terkonfirmasi di SIMRS)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 5. FORM DRAWER (Pengajuan & Edit Perizinan Baru) */}
      {isFormDrawerOpen && (
        <>
          <div
            onClick={triggerCloseFormDrawer}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />

          <div
            ref={formDrawerRef}
            className={cn(
              'absolute inset-x-0 bottom-0 z-60 flex max-h-[92%] min-h-[520px] w-full flex-col overflow-hidden rounded-t-[32px] sm:rounded-t-[36px] shadow-[0_-12px_45px_rgba(0,0,0,0.3)] border-t will-change-transform select-text touch-pan-y backdrop-blur-2xl',
              isDark
                ? 'bg-[#0a0e1a] border-white/10 text-white shadow-black/80'
                : 'bg-white border-neutral-100 text-slate-900',
            )}
          >
            {/* Interactive Drag Handle */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Tarik ke bawah untuk menutup"
              onClick={triggerCloseFormDrawer}
              className="flex w-full cursor-grab active:cursor-grabbing flex-col items-center justify-center pt-3.5 pb-1 shrink-0 touch-none select-none"
            >
              <div className={cn('h-1.25 w-11 rounded-full transition-colors', isDark ? 'bg-white/25' : 'bg-neutral-300')} />
            </div>

            {/* Header */}
            <div className="relative z-20 flex items-center justify-between px-6 pt-0.5 pb-3 shrink-0 border-b border-slate-100 dark:border-white/10">
              <h3 className="text-base font-bold tracking-tight">
                {editingRecordId ? 'Edit perizinan' : 'Pengajuan izin baru'}
              </h3>
              <button
                type="button"
                aria-label="Tutup form"
                onClick={triggerCloseFormDrawer}
                className={cn(
                  'p-1.5 -mr-2 rounded-full transition-colors cursor-pointer flex items-center justify-center shrink-0',
                  isDark ? 'bg-white/10 text-neutral-300 hover:text-white' : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900',
                )}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form Content */}
            <form
              onSubmit={handleFormSubmit}
              className="flex w-full flex-1 flex-col px-6 pt-3 pb-6 overflow-y-auto no-scrollbar select-text gap-4"
            >
              {/* Applicant Header Badge */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5">
                <DoctorAvatar
                  src={profile.avatarUrl}
                  alt={profile.name}
                  size={42}
                  className="shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold truncate">{profile.name}</span>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-neutral-400 truncate">
                    {profile.role || profile.title}
                  </span>
                </div>
              </div>

              {/* Field 1: Jenis Perizinan */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold tracking-tight text-slate-700 dark:text-neutral-300">
                  Jenis Perizinan <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PERMISSION_TYPES.map((type) => {
                    const isSelected = formData.type === type;
                    const theme = TYPE_THEMES[type];
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, type }))}
                        className={cn(
                          'flex items-center gap-2 p-2.5 rounded-2xl border text-xs font-bold text-left transition-all cursor-pointer active:scale-98',
                          isSelected
                            ? isDark
                              ? 'bg-neutral-900 border-blue-500 text-white ring-1 ring-blue-500'
                              : 'bg-white border-blue-600 text-blue-900 ring-1 ring-blue-600 shadow-xs'
                            : isDark
                              ? 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100',
                        )}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <span className="truncate">{type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Field 2: Rentang Tanggal */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold tracking-tight text-slate-700 dark:text-neutral-300">
                    Rentang Tanggal <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-cyan-400">
                    {calculatedDays} Hari Kerja
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-semibold pl-1">
                      Mulai
                    </span>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                      className={cn(
                        'w-full p-2.5 rounded-2xl border text-xs font-medium focus:outline-none transition-all',
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900',
                      )}
                    />
                    {formErrors.startDate && (
                      <span className="text-[10px] text-red-500 pl-1">{formErrors.startDate}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-semibold pl-1">
                      Selesai
                    </span>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                      className={cn(
                        'w-full p-2.5 rounded-2xl border text-xs font-medium focus:outline-none transition-all',
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900',
                      )}
                    />
                    {formErrors.endDate && (
                      <span className="text-[10px] text-red-500 pl-1">{formErrors.endDate}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Field 3: Pesan / Alasan */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold tracking-tight text-slate-700 dark:text-neutral-300">
                  Pesan / Alasan Perizinan <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan keterangan keperluan izin..."
                  value={formData.reason}
                  onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
                  className={cn(
                    'w-full p-3 rounded-2xl border text-xs leading-relaxed transition-all focus:outline-none resize-none',
                    formErrors.reason
                      ? 'border-red-400 bg-red-50/20 text-red-900'
                      : isDark
                        ? 'bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-blue-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-600',
                  )}
                />
                {formErrors.reason && (
                  <span className="text-[10px] text-red-500 pl-1">{formErrors.reason}</span>
                )}
              </div>

              {/* Field 4: Dokter Pengganti */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold tracking-tight text-slate-700 dark:text-neutral-300">
                  Dokter Pengganti (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Nama dokter pengganti..."
                  value={formData.substituteDoctor}
                  onChange={(e) => setFormData((prev) => ({ ...prev, substituteDoctor: e.target.value }))}
                  className={cn(
                    'w-full p-2.5 rounded-2xl border text-xs focus:outline-none transition-all',
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900',
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 mt-auto">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                  isLoading={isSubmitting}
                  className={cn(
                    'rounded-2xl',
                    isDark ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700',
                  )}
                >
                  {editingRecordId ? 'Simpan Perubahan' : 'Kirim Pengajuan Izin'}
                </Button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* 6. CANCEL CONFIRMATION MODAL */}
      {recordToCancel && (
        <>
          <div
            onClick={() => setRecordToCancel(null)}
            className="absolute inset-0 z-70 bg-black/65 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />

          <div
            className={cn(
              'absolute inset-x-5 top-1/2 -translate-y-1/2 z-80 p-5 rounded-3xl shadow-2xl border transition-all animate-in zoom-in-95 duration-200 select-none flex flex-col gap-3 backdrop-blur-2xl',
              isDark
                ? 'bg-[#111624]/98 border-rose-500/30 text-white shadow-black/90'
                : 'bg-white/98 border-rose-200 text-slate-900 shadow-2xl',
            )}
          >
            <h4 className="text-sm font-bold tracking-tight">
              Batalkan pengajuan perizinan?
            </h4>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-neutral-300">
              Apakah Anda yakin ingin membatalkan pengajuan izin ini ({formatDateIndo(recordToCancel.startDate)} — {formatDateIndo(recordToCancel.endDate)})? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
              <button
                type="button"
                onClick={() => setRecordToCancel(null)}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95',
                  isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-slate-100 text-slate-800 hover:bg-slate-200',
                )}
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={handleConfirmCancelRecord}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 active:scale-95 transition-all cursor-pointer"
              >
                Ya, Batalkan Izin
              </button>
            </div>
          </div>
        </>
      )}

      {/* Ephemeral Toast Feedback */}
      {toastMessage && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-80 rounded-full bg-neutral-900/95 text-white px-4 py-2 text-xs font-bold backdrop-blur-md shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
