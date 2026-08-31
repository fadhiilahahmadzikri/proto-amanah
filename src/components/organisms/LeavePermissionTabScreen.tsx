'use client';

import { gsap } from 'gsap';
import {
  Calendar,
  Download,
  Edit3,
  FileCheck,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import React from 'react';
import { Button } from '@/components/atoms/Button';
import { DoctorAvatar } from '@/components/atoms/DoctorAvatar';
import { DatePicker } from '@/components/molecules/DatePicker';
import { ScreenHeader } from '@/components/molecules/ScreenHeader';
import { usePermissionStore } from '@/features/doctor/hooks/use-permission-store';
import { useModalStore } from '@/features/portal/hooks/use-modal-store';
import { cn } from '@/lib/utils';
import type { PermissionRecord, PermissionStatus, PermissionType } from '@/types/permission.types';

const STATUS_STACK_THEMES: Record<
  PermissionStatus,
  {
    bgLight: string;
    bgDark: string;
    textLight: string;
    textDark: string;
    label: string;
  }
> = {
  menunggu: {
    bgLight: 'bg-[#93c5fd]',
    bgDark: 'bg-[#0c2a4d]',
    textLight: 'text-[#1e40af]',
    textDark: 'text-[#38bdf8]',
    label: 'Menunggu',
  },
  disetujui: {
    bgLight: 'bg-[#86efac]',
    bgDark: 'bg-[#063b22]',
    textLight: 'text-[#166534]',
    textDark: 'text-[#4ade80]',
    label: 'Disetujui',
  },
  ditolak: {
    bgLight: 'bg-[#fda4af]',
    bgDark: 'bg-[#4c0d17]',
    textLight: 'text-[#9f1239]',
    textDark: 'text-[#fb7185]',
    label: 'Ditolak',
  },
  dibatalkan: {
    bgLight: 'bg-[#cbd5e1]',
    bgDark: 'bg-[#1e293b]',
    textLight: 'text-[#334155]',
    textDark: 'text-[#94a3b8]',
    label: 'Dibatalkan',
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
  initialModalVariant?: string;
  className?: string;
}) {
  const isDark = props.theme === 'dark';
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
  const [detailRecord, setDetailRecord] = React.useState<PermissionRecord | null>(
    props.initialModalVariant === 'detail-record' ? (records[0] ?? null) : null,
  );
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = React.useState(
    props.initialModalVariant === 'detail-record',
  );
  const detailDrawerRef = React.useRef<HTMLDivElement>(null);
  const isClosingDetailRef = React.useRef(false);

  // Form Drawer state (Create & Edit)
  const [isFormDrawerOpen, setIsFormDrawerOpen] = React.useState(
    props.initialModalVariant === 'add-form',
  );
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
  const [recordToCancel, setRecordToCancel] = React.useState<PermissionRecord | null>(
    props.initialModalVariant === 'cancel-dialog' ? (records[0] ?? null) : null,
  );
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

  const handleDownloadPdf = (record: PermissionRecord) => {
    showToast('Membuka dokumen PDF perizinan...');
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Gagal membuka jendela unduh. Izinkan pop-up pada browser.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="UTF-8" />
          <title>Surat_Perizinan_${record.id}.pdf</title>
          <style>
            @page { size: A4; margin: 18mm; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: #1e293b;
              line-height: 1.5;
              padding: 24px;
              margin: 0;
            }
            .header {
              border-bottom: 2.5px solid #0d66e9;
              padding-bottom: 12px;
              margin-bottom: 20px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .hospital-title {
              font-size: 20px;
              font-weight: 800;
              color: #0d66e9;
              margin: 0;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .hospital-sub {
              font-size: 11px;
              color: #64748b;
              margin-top: 2px;
            }
            .doc-type {
              font-size: 12px;
              font-weight: 700;
              color: #0284c7;
              background: #f0f9ff;
              padding: 4px 10px;
              border-radius: 6px;
              border: 1px solid #bae6fd;
            }
            .title-box {
              text-align: center;
              margin-bottom: 20px;
            }
            .title-box h1 {
              font-size: 16px;
              font-weight: 800;
              text-transform: uppercase;
              margin: 0;
              color: #0f172a;
            }
            .title-box p {
              font-size: 11px;
              color: #64748b;
              margin-top: 4px;
            }
            .section-title {
              font-size: 12px;
              font-weight: 700;
              color: #0f172a;
              margin-top: 16px;
              margin-bottom: 6px;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 4px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 10px;
            }
            td {
              padding: 5px 4px;
              font-size: 12px;
              vertical-align: top;
            }
            td.label {
              width: 170px;
              color: #64748b;
              font-weight: 600;
            }
            td.value {
              color: #0f172a;
              font-weight: 700;
            }
            .status-badge {
              display: inline-block;
              padding: 3px 8px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
            }
            .status-menunggu { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
            .status-disetujui { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
            .status-ditolak { background: #ffe4e6; color: #be123c; border: 1px solid #fecdd3; }
            .status-dibatalkan { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
            .reason-box {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 10px 14px;
              font-size: 12px;
              color: #334155;
              line-height: 1.6;
              margin-top: 4px;
            }
            .signatures {
              margin-top: 36px;
              display: flex;
              justify-content: space-between;
              page-break-inside: avoid;
            }
            .sign-box {
              width: 200px;
              text-align: center;
            }
            .sign-box .role {
              font-size: 11px;
              color: #64748b;
              margin-bottom: 45px;
            }
            .sign-box .name {
              font-size: 12px;
              font-weight: 700;
              color: #0f172a;
              border-top: 1px solid #94a3b8;
              padding-top: 4px;
            }
            .footer-note {
              margin-top: 24px;
              font-size: 9px;
              color: #94a3b8;
              text-align: center;
              border-top: 1px dashed #e2e8f0;
              padding-top: 8px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="hospital-title">RS AMANAH SEHAT</div>
              <div class="hospital-sub">Jl. Medika Husada No. 88, Jakarta Selatan • Telp: (021) 7890123</div>
            </div>
            <div class="doc-type">SIMRS E-PERIZINAN</div>
          </div>

          <div class="title-box">
            <h1>Surat Keterangan Pengajuan Perizinan</h1>
            <p>Nomor Registrasi: ${record.id.toUpperCase()}</p>
          </div>

          <div class="section-title">Data Pengaju</div>
          <table>
            <tr>
              <td class="label">Nama Pemohon</td>
              <td class="value">${record.userName}</td>
            </tr>
            <tr>
              <td class="label">Jabatan / Spesialisasi</td>
              <td class="value">${record.userRole}</td>
            </tr>
            <tr>
              <td class="label">ID Pemohon</td>
              <td class="value">${record.userId}</td>
            </tr>
          </table>

          <div class="section-title">Detail Perizinan</div>
          <table>
            <tr>
              <td class="label">Subjek Perizinan</td>
              <td class="value">${record.type}</td>
            </tr>
            <tr>
              <td class="label">Periode Izin</td>
              <td class="value">${formatDateIndo(record.startDate)} s/d ${formatDateIndo(record.endDate)}</td>
            </tr>
            <tr>
              <td class="label">Durasi Hari Kerja</td>
              <td class="value">${record.durationDays} Hari</td>
            </tr>
            <tr>
              <td class="label">Status Pengajuan</td>
              <td class="value">
                <span class="status-badge status-${record.status}">
                  ● ${record.status.toUpperCase()}
                </span>
              </td>
            </tr>
            ${record.substituteDoctor ? `
            <tr>
              <td class="label">Dokter Pengganti</td>
              <td class="value">${record.substituteDoctor}</td>
            </tr>
            ` : ''}
          </table>

          <div class="section-title">Keterangan / Alasan</div>
          <div class="reason-box">${record.reason}</div>

          ${record.reviewerNotes ? `
          <div class="section-title">Catatan Verifikator Medis / HRD</div>
          <div class="reason-box">
            ${record.reviewerNotes}
            ${record.reviewerName ? `<div style="margin-top: 6px; font-weight: 700; font-size: 11px; color: #0f172a;">Oleh: ${record.reviewerName}</div>` : ''}
          </div>
          ` : ''}

          <div class="signatures">
            <div class="sign-box">
              <div class="role">Pemohon,</div>
              <div class="name">${record.userName}</div>
            </div>
            <div class="sign-box">
              <div class="role">Komite Medik / Direksi,</div>
              <div class="name">${record.reviewerName || 'dr. H. Hendra, Sp.JP'}</div>
            </div>
          </div>

          <div class="footer-note">
            Dokumen ini diterbitkan secara elektronik melalui Portal Dokter RS Amanah Sehat dan sah tanpa tanda tangan basah. Dicetak pada: ${new Date().toLocaleString('id-ID')}
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 250);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleOpenCreateForm = () => {
    setEditingRecordId(null);
    setFormData({
      type: '',
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
    if (!formData.type.trim()) {
      errors.type = 'Subjek perizinan wajib diisi';
    }
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
                : 'text-[#0d66e9] hover:text-blue-700 hover:bg-slate-100',
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
      <div className="flex-1 min-h-0 w-full overflow-y-auto no-scrollbar px-5 pt-1 pb-36 sm:pb-40 flex flex-col gap-3.5 sm:gap-4">
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
            const stackTheme = STATUS_STACK_THEMES[item.status] || STATUS_STACK_THEMES.menunggu;

            return (
              <article
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => handleOpenDetail(item)}
                className={cn(
                  'group relative w-full shrink-0 rounded-[24px] sm:rounded-[26px] select-none transition-all duration-200 active:scale-[0.99] cursor-pointer overflow-hidden shadow-xs hover:shadow-md flex flex-col',
                  isDark ? stackTheme.bgDark : stackTheme.bgLight,
                )}
              >
                {/* 1. Top Stacking Layer Status Header */}
                <div className="w-full flex items-center justify-center pt-2 pb-1.5 px-4 text-center shrink-0">
                  <span
                    className={cn(
                      'text-[12px] font-extrabold tracking-wide capitalize',
                      isDark ? stackTheme.textDark : stackTheme.textLight,
                    )}
                  >
                    {stackTheme.label}
                  </span>
                </div>

                {/* 2. Main Stacked White Card Wrapper */}
                <div
                  className={cn(
                    'w-full rounded-[20px] sm:rounded-[22px] p-[2px] flex flex-col transition-colors border shadow-xs shrink-0',
                    isDark
                      ? 'bg-[#0f1524] border-white/5 text-white'
                      : 'bg-white border-slate-100 text-slate-900',
                  )}
                >
                  {/* 3. Inner Dashed Stitched Content Layer (Motif Jahitan Dalam with 2px Inset Gap) */}
                  <div
                    className={cn(
                      'w-full rounded-[18px] sm:rounded-[20px] p-4 sm:p-4.5 flex flex-col gap-2.5 border-[1.5px] border-dashed',
                      isDark
                        ? 'border-white/15 bg-white/[0.02]'
                        : 'border-slate-200/90 bg-slate-50/40',
                    )}
                  >
                    {/* Title (Full Width, No Pills) */}
                    <h4
                      className={cn(
                        'text-[16px] sm:text-[17px] font-black tracking-tight truncate',
                        isDark ? 'text-white' : 'text-[#0f172b]',
                      )}
                    >
                      {item.type}
                    </h4>

                    {/* Reason (Truncated with Ellipsis) */}
                    <p
                      className={cn(
                        'text-[12.5px] font-medium leading-relaxed truncate text-[#90a1b9] dark:text-neutral-400 -mt-0.5',
                      )}
                      title={item.reason}
                    >
                      {item.reason}
                    </p>

                    {/* Dates (Mulai & Selesai) */}
                    <div className="flex items-center gap-8 pt-0.5">
                      {/* Mulai */}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-[#90a1b9] dark:text-neutral-400 stroke-[2] shrink-0" />
                          <span
                            className={cn(
                              'text-[14px] sm:text-[14.5px] font-bold tracking-tight leading-none',
                              isDark ? 'text-white' : 'text-[#0f172b]',
                            )}
                          >
                            {formatDateIndo(item.startDate)}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-[#90a1b9] dark:text-neutral-400 mt-1 pl-5.5">
                          Mulai
                        </span>
                      </div>

                      {/* Selesai */}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-[#90a1b9] dark:text-neutral-400 stroke-[2] shrink-0" />
                          <span
                            className={cn(
                              'text-[14px] sm:text-[14.5px] font-bold tracking-tight leading-none',
                              isDark ? 'text-white' : 'text-[#0f172b]',
                            )}
                          >
                            {formatDateIndo(item.endDate)}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-[#90a1b9] dark:text-neutral-400 mt-1 pl-5.5">
                          Selesai
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
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
                ? 'bg-[#0a0e1a]/98 border-white/10 text-white shadow-black/80'
                : 'bg-white/98 border-[#e2e8f0] text-[#0f172b]',
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
              <div className={cn('h-1.25 w-11 rounded-full transition-colors', isDark ? 'bg-white/25' : 'bg-[#cbd5e1]')} />
            </div>

            {/* Header */}
            <div className="relative z-20 flex items-center justify-between px-6 pt-0.5 pb-3 shrink-0 border-b border-[#e2e8f0] dark:border-white/10">
              <h3 className={cn('text-base font-bold tracking-tight', isDark ? 'text-white' : 'text-[#0f172b]')}>
                Detail perizinan
              </h3>
              <div className="flex items-center gap-1.5 -mr-2">
                {/* Download PDF Button */}
                <button
                  type="button"
                  aria-label="Unduh Dokumen PDF"
                  title="Unduh PDF Surat Izin"
                  onClick={() => handleDownloadPdf(detailRecord)}
                  className={cn(
                    'p-1.5 rounded-full transition-colors cursor-pointer flex items-center justify-center shrink-0',
                    isDark
                      ? 'bg-white/10 text-neutral-300 hover:text-white hover:bg-white/15'
                      : 'bg-[#eff6ff] text-[#0d66e9] hover:bg-blue-100/80',
                  )}
                >
                  <Download className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  aria-label="Tutup detail perizinan"
                  onClick={triggerCloseDetailDrawer}
                  className={cn(
                    'p-1.5 rounded-full transition-colors cursor-pointer flex items-center justify-center shrink-0',
                    isDark
                      ? 'bg-white/10 text-neutral-300 hover:text-white'
                      : 'bg-slate-100 text-[#314158] hover:text-[#0f172b] hover:bg-slate-200',
                  )}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Drawer Body Content */}
            <div className="flex w-full flex-1 flex-col px-6 pt-2 pb-6 overflow-y-auto no-scrollbar select-text divide-y divide-[#e2e8f0] dark:divide-white/10">
              {/* 1. Header: Type Title & Status Pill Row */}
              <div className="flex items-center justify-between gap-3 pb-4">
                <h4
                  className={cn(
                    'text-lg sm:text-[19px] font-black tracking-tight truncate',
                    isDark ? 'text-white' : 'text-[#0f172b]',
                  )}
                >
                  {detailRecord.type}
                </h4>

                {/* Status Pill Badge */}
                {detailRecord.status === 'menunggu' && (
                  <div
                    className={cn(
                      'px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 border text-xs font-bold tracking-tight',
                      isDark
                        ? 'bg-amber-950/50 border-amber-500/30 text-amber-300'
                        : 'bg-[#fffbeb] border-[#fde68a] text-[#b45309]',
                    )}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#f59e0b] shrink-0" />
                    <span>Menunggu</span>
                  </div>
                )}

                {detailRecord.status === 'disetujui' && (
                  <div
                    className={cn(
                      'px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 border text-xs font-bold tracking-tight',
                      isDark
                        ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-800',
                    )}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Disetujui</span>
                  </div>
                )}

                {detailRecord.status === 'ditolak' && (
                  <div
                    className={cn(
                      'px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 border text-xs font-bold tracking-tight',
                      isDark
                        ? 'bg-rose-950/50 border-rose-500/30 text-rose-300'
                        : 'bg-rose-50 border-rose-200 text-rose-800',
                    )}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#fb2c36] shrink-0" />
                    <span>Ditolak</span>
                  </div>
                )}

                {detailRecord.status === 'dibatalkan' && (
                  <div
                    className={cn(
                      'px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 border text-xs font-bold tracking-tight',
                      isDark
                        ? 'bg-white/5 border-white/10 text-neutral-400'
                        : 'bg-slate-100 border-slate-200 text-slate-600',
                    )}
                  >
                    <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                    <span>Dibatalkan</span>
                  </div>
                )}
              </div>

              {/* 2. Date Interval & Duration */}
              <div className="py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className={cn('text-xs font-bold block mb-1', isDark ? 'text-white' : 'text-[#0f172b]')}>
                      Mulai Izin
                    </span>
                    <span className={cn('text-sm font-bold block', isDark ? 'text-white' : 'text-[#0f172b]')}>
                      {formatDateIndo(detailRecord.startDate)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className={cn('text-xs font-bold block mb-1', isDark ? 'text-white' : 'text-[#0f172b]')}>
                      Selesai Izin
                    </span>
                    <span className={cn('text-sm font-bold block', isDark ? 'text-white' : 'text-[#0f172b]')}>
                      {formatDateIndo(detailRecord.endDate)}
                    </span>
                  </div>
                </div>
                <div className="mt-2.5 flex items-center gap-1.5">
                  <span className={cn('text-xs font-bold tracking-tight tabular-nums', isDark ? 'text-white' : 'text-[#0f172b]')}>
                    Durasi: {detailRecord.durationDays} Hari Kerja
                  </span>
                </div>
              </div>

              {/* 3. Reason / Message */}
              <div className="flex flex-col gap-1.5 py-4">
                <span className={cn('text-xs font-bold block', isDark ? 'text-white' : 'text-[#0f172b]')}>
                  Pesan / Alasan Perizinan
                </span>
                <p className={cn('text-[13.5px] leading-relaxed font-medium', isDark ? 'text-neutral-200' : 'text-[#314158]')}>
                  {detailRecord.reason}
                </p>
              </div>

              {/* 4. Substitute Doctor */}
              {detailRecord.substituteDoctor && (
                <div className="flex flex-col gap-2.5 py-4">
                  <span className={cn('text-xs font-bold block', isDark ? 'text-white' : 'text-[#0f172b]')}>
                    Dokter Pengganti
                  </span>
                  <div className="flex items-center gap-3">
                    <DoctorAvatar
                      src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
                      alt={detailRecord.substituteDoctor}
                      size={40}
                      className="shrink-0 ring-1 ring-black/5 dark:ring-white/10"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className={cn('text-sm font-bold truncate leading-tight', isDark ? 'text-white' : 'text-[#0f172b]')}>
                        {detailRecord.substituteDoctor}
                      </span>
                      <span className={cn('text-xs font-medium truncate mt-0.5', isDark ? 'text-neutral-400' : 'text-[#90a1b9]')}>
                        Dokter Spesialis Anak / Dokter Pengganti
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Reviewer Notes */}
              {detailRecord.reviewerNotes && (
                <div className="flex flex-col gap-1.5 py-4">
                  <span className={cn('text-xs font-bold block', isDark ? 'text-white' : 'text-[#0f172b]')}>
                    Catatan Verifikasi
                  </span>
                  <p className={cn('text-[13.5px] leading-relaxed font-medium', isDark ? 'text-neutral-200' : 'text-[#314158]')}>
                    {detailRecord.reviewerNotes}
                  </p>
                  {detailRecord.reviewerName && (
                    <span className={cn('text-xs font-semibold mt-1 block', isDark ? 'text-neutral-400' : 'text-[#90a1b9]')}>
                      Oleh: {detailRecord.reviewerName}
                    </span>
                  )}
                </div>
              )}

              {/* 6. Actions Footer */}
              <div className="flex flex-col gap-2 pt-5 mt-auto border-t border-[#e2e8f0] dark:border-white/10">
                {detailRecord.status === 'menunggu' && (
                  <div className="grid grid-cols-2 gap-2.5">
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      onClick={() => handleOpenEditForm(detailRecord)}
                      startIcon={<Edit3 className="w-4 h-4" />}
                    >
                      Edit Izin
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="md"
                      onClick={() => setRecordToCancel(detailRecord)}
                      startIcon={<Trash2 className="w-4 h-4 text-[#fb2c36]" />}
                      className="text-[#fb2c36] hover:text-rose-700 hover:bg-rose-50/80 dark:text-rose-400 dark:hover:bg-rose-950/40 font-bold border-0 shadow-none"
                    >
                      Batalkan
                    </Button>
                  </div>
                )}

                {detailRecord.status === 'disetujui' && (
                  <div
                    className={cn(
                      'p-3 rounded-2xl text-center text-xs font-bold border flex items-center justify-center gap-2',
                      isDark ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900',
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
                ? 'bg-[#0a0e1a]/98 border-white/10 text-white shadow-black/80'
                : 'bg-white/98 border-[#e2e8f0] text-[#0f172b]',
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
              <div className={cn('h-1.25 w-11 rounded-full transition-colors', isDark ? 'bg-white/25' : 'bg-[#cbd5e1]')} />
            </div>

            {/* Header */}
            <div className="relative z-20 flex items-center justify-between px-6 pt-0.5 pb-3 shrink-0 border-b border-[#e2e8f0] dark:border-white/10">
              <h3 className={cn('text-base font-bold tracking-tight', isDark ? 'text-white' : 'text-[#0f172b]')}>
                {editingRecordId ? 'Edit perizinan' : 'Pengajuan izin baru'}
              </h3>
              <button
                type="button"
                aria-label="Tutup form"
                onClick={triggerCloseFormDrawer}
                className={cn(
                  'p-1.5 -mr-2 rounded-full transition-colors cursor-pointer flex items-center justify-center shrink-0',
                  isDark ? 'bg-white/10 text-neutral-300 hover:text-white' : 'bg-slate-100 text-[#314158] hover:text-[#0f172b] hover:bg-slate-200',
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
              {/* Field 1: Subjek Perizinan (Free text input) */}
              <div className="flex flex-col gap-1.5">
                <label className={cn('text-xs font-bold tracking-tight', isDark ? 'text-white' : 'text-[#0f172b]')}>
                  Subjek Perizinan <span className="text-[#fb2c36]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Urusan Keluarga, Seminar / Simposium, Cuti Tahunan..."
                  value={formData.type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                  className={cn(
                    'w-full h-11 px-3.5 rounded-2xl border text-xs font-semibold focus:outline-none transition-all',
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                      : 'bg-white border-[#e2e8f0] text-[#0f172b] placeholder:text-[#90a1b9] focus:border-[#0d66e9] focus:ring-2 focus:ring-[#0d66e9]/15 shadow-2xs',
                    formErrors.type && 'border-[#fb2c36] ring-1 ring-[#fb2c36]/30',
                  )}
                />
                {formErrors.type && (
                  <span className="text-[11px] font-medium text-[#fb2c36] pl-1">{formErrors.type}</span>
                )}
              </div>

              {/* Field 2: Rentang Tanggal */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className={cn('text-xs font-bold tracking-tight', isDark ? 'text-white' : 'text-[#0f172b]')}>
                    Rentang Tanggal <span className="text-[#fb2c36]">*</span>
                  </label>
                  <span className={cn('text-xs font-bold tracking-tight tabular-nums', isDark ? 'text-white' : 'text-[#0f172b]')}>
                    {calculatedDays} Hari Kerja
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <DatePicker
                    label="Mulai Izin"
                    value={formData.startDate}
                    onChange={(dateStr) =>
                      setFormData((prev) => ({ ...prev, startDate: dateStr }))
                    }
                    error={formErrors.startDate}
                    theme={isDark ? 'dark' : 'light'}
                    placeholder="Pilih tanggal mulai"
                  />

                  <DatePicker
                    label="Selesai Izin"
                    value={formData.endDate}
                    onChange={(dateStr) =>
                      setFormData((prev) => ({ ...prev, endDate: dateStr }))
                    }
                    error={formErrors.endDate}
                    theme={isDark ? 'dark' : 'light'}
                    placeholder="Pilih tanggal selesai"
                  />
                </div>
              </div>

              {/* Field 3: Pesan / Alasan */}
              <div className="flex flex-col gap-1.5">
                <label className={cn('text-xs font-bold tracking-tight', isDark ? 'text-white' : 'text-[#0f172b]')}>
                  Pesan / Alasan Perizinan <span className="text-[#fb2c36]">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan keterangan keperluan izin..."
                  value={formData.reason}
                  onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
                  className={cn(
                    'w-full p-3 rounded-2xl border text-xs leading-relaxed transition-all focus:outline-none resize-none',
                    formErrors.reason
                      ? 'border-[#fb2c36] bg-red-50/20 text-[#fb2c36]'
                      : isDark
                        ? 'bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-cyan-400'
                        : 'bg-white border-[#e2e8f0] text-[#0f172b] placeholder:text-[#90a1b9] focus:border-[#0d66e9] focus:ring-2 focus:ring-[#0d66e9]/15 shadow-2xs',
                  )}
                />
                {formErrors.reason && (
                  <span className="text-[11px] font-medium text-[#fb2c36] pl-1">{formErrors.reason}</span>
                )}
              </div>

              {/* Field 4: Dokter Pengganti */}
              <div className="flex flex-col gap-1.5">
                <label className={cn('text-xs font-bold tracking-tight', isDark ? 'text-white' : 'text-[#0f172b]')}>
                  Dokter Pengganti <span className={cn('font-normal', isDark ? 'text-neutral-400' : 'text-[#90a1b9]')}> (Opsional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Nama dokter pengganti..."
                  value={formData.substituteDoctor}
                  onChange={(e) => setFormData((prev) => ({ ...prev, substituteDoctor: e.target.value }))}
                  className={cn(
                    'w-full h-11 px-3.5 rounded-2xl border text-xs font-semibold focus:outline-none transition-all',
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-cyan-400'
                      : 'bg-white border-[#e2e8f0] text-[#0f172b] placeholder:text-[#90a1b9] focus:border-[#0d66e9] focus:ring-2 focus:ring-[#0d66e9]/15 shadow-2xs',
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
                  className="rounded-2xl"
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
                ? 'bg-[#111624]/98 border-[#fb2c36]/30 text-white shadow-black/90'
                : 'bg-white/98 border-rose-200 text-[#0f172b] shadow-2xl',
            )}
          >
            <h4 className={cn('text-sm font-bold tracking-tight', isDark ? 'text-white' : 'text-[#0f172b]')}>
              Batalkan pengajuan perizinan?
            </h4>
            <p className="text-xs leading-relaxed text-[#314158] dark:text-neutral-300">
              Apakah Anda yakin ingin membatalkan pengajuan izin ini ({formatDateIndo(recordToCancel.startDate)} — {formatDateIndo(recordToCancel.endDate)})? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e2e8f0] dark:border-white/10">
              <button
                type="button"
                onClick={() => setRecordToCancel(null)}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95',
                  isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-slate-100 text-[#314158] hover:bg-slate-200',
                )}
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={handleConfirmCancelRecord}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#fb2c36] text-white hover:bg-rose-700 active:scale-95 transition-all cursor-pointer"
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
