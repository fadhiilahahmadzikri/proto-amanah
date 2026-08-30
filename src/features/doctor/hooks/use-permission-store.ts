'use client';

import React from 'react';
import { doctorStore } from '@/features/doctor/hooks/use-doctor-store';
import type { PermissionRecord, PermissionType } from '@/types/permission.types';

export const INITIAL_PERMISSION_RECORDS: PermissionRecord[] = [
  {
    id: 'perm_001',
    userId: 'doc_001',
    userName: 'dr. Amelia Cantika',
    userRole: 'Dokter Spesialis Anak',
    userAvatarUrl: '/assets/images/doctors/woman-doctor-4.png',
    startDate: '2026-09-02',
    endDate: '2026-09-04',
    durationDays: 3,
    type: 'Seminar / Simposium',
    reason: 'Menghadiri Kongres Nasional Ilmu Kesehatan Anak (KONIKA) XIX di Bali sebagai pembicara panelis.',
    substituteDoctor: 'dr. Budi Santoso, Sp.A',
    status: 'menunggu',
    createdAt: '2026-08-30T08:30:00Z',
  },
  {
    id: 'perm_002',
    userId: 'doc_001',
    userName: 'dr. Amelia Cantika',
    userRole: 'Dokter Spesialis Anak',
    userAvatarUrl: '/assets/images/doctors/woman-doctor-4.png',
    startDate: '2026-09-15',
    endDate: '2026-09-16',
    durationDays: 2,
    type: 'Urusan Keluarga',
    reason: 'Keperluan mendesak keluarga di luar kota dan pendampingan wisuda keluarga inti.',
    substituteDoctor: 'dr. Ratna Sp.A',
    status: 'menunggu',
    createdAt: '2026-08-29T14:15:00Z',
  },
  {
    id: 'perm_003',
    userId: 'doc_001',
    userName: 'dr. Amelia Cantika',
    userRole: 'Dokter Spesialis Anak',
    userAvatarUrl: '/assets/images/doctors/woman-doctor-4.png',
    startDate: '2026-08-10',
    endDate: '2026-08-12',
    durationDays: 3,
    type: 'Cuti Tahunan',
    reason: 'Pengambilan cuti tahunan terjadwal Semester 2 (Hak cuti dokter spesialis).',
    substituteDoctor: 'dr. Budi Santoso, Sp.A',
    status: 'disetujui',
    createdAt: '2026-08-01T09:00:00Z',
    reviewedAt: '2026-08-02T11:20:00Z',
    reviewerName: 'dr. H. Hendra, Sp.JP (Direktur Pelayanan Medis)',
    reviewerNotes: 'Disetujui. Kuota dokter pengganti rawat jalan dan jaga bangsal aman.',
  },
  {
    id: 'perm_004',
    userId: 'doc_001',
    userName: 'dr. Amelia Cantika',
    userRole: 'Dokter Spesialis Anak',
    userAvatarUrl: '/assets/images/doctors/woman-doctor-4.png',
    startDate: '2026-07-20',
    endDate: '2026-07-21',
    durationDays: 2,
    type: 'Tugas Luar RS',
    reason: 'Bakti sosial pengobatan gratis dan edukasi stunting anak di Puskesmas Binaan.',
    substituteDoctor: 'dr. Kevin Pratama, Sp.A',
    status: 'disetujui',
    createdAt: '2026-07-10T10:00:00Z',
    reviewedAt: '2026-07-11T16:45:00Z',
    reviewerName: 'Bagian SDM & Komite Medik RS Amanah',
    reviewerNotes: 'Surat tugas dinas luar telah diterbitkan nomor ST/2026/07/088.',
  },
  {
    id: 'perm_005',
    userId: 'doc_001',
    userName: 'dr. Amelia Cantika',
    userRole: 'Dokter Spesialis Anak',
    userAvatarUrl: '/assets/images/doctors/woman-doctor-4.png',
    startDate: '2026-06-18',
    endDate: '2026-06-19',
    durationDays: 2,
    type: 'Cuti Tahunan',
    reason: 'Pengajuan cuti tambahan libur cuti bersama.',
    substituteDoctor: '-',
    status: 'ditolak',
    createdAt: '2026-06-12T07:45:00Z',
    reviewedAt: '2026-06-13T09:10:00Z',
    reviewerName: 'dr. H. Hendra, Sp.JP (Direktur Pelayanan Medis)',
    reviewerNotes: 'Mohon maaf tidak dapat disetujui karena jadwal operasi dan visit pasien poliklinik sedang padat.',
  },
  {
    id: 'perm_006',
    userId: 'doc_001',
    userName: 'dr. Amelia Cantika',
    userRole: 'Dokter Spesialis Anak',
    userAvatarUrl: '/assets/images/doctors/woman-doctor-4.png',
    startDate: '2026-05-05',
    endDate: '2026-05-06',
    durationDays: 2,
    type: 'Izin Sakit',
    reason: 'Demam dan radang tenggorokan akut, istirahat mandiri.',
    substituteDoctor: 'dr. Budi Santoso, Sp.A',
    status: 'dibatalkan',
    createdAt: '2026-05-04T19:00:00Z',
    cancelledAt: '2026-05-05T06:30:00Z',
  },
];

const STORAGE_KEY = 'portal_doctor_permissions';

function getStoredPermissions(): PermissionRecord[] {
  if (typeof window === 'undefined') {
    return INITIAL_PERMISSION_RECORDS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as PermissionRecord[];
    }
  } catch {
    // Fallback on JSON parse error
  }
  return INITIAL_PERMISSION_RECORDS;
}

function saveStoredPermissions(records: PermissionRecord[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Ignore storage quota errors
  }
}

type PermissionListener = () => void;

let globalRecords: PermissionRecord[] = getStoredPermissions();
const listeners = new Set<PermissionListener>();

function emitChange() {
  saveStoredPermissions(globalRecords);
  for (const listener of listeners) {
    listener();
  }
}

export const permissionStore = {
  getRecords: () => globalRecords,
  subscribe: (listener: PermissionListener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  /**
   * Submit new leave/permission request connected to current active user profile.
   */
  createPermission: (data: {
    startDate: string;
    endDate: string;
    durationDays?: number;
    type: PermissionType;
    reason: string;
    substituteDoctor?: string;
  }): PermissionRecord => {
    const profile = doctorStore.getProfile();
    const duration = data.durationDays && data.durationDays > 0
      ? data.durationDays
      : calculateDays(data.startDate, data.endDate);

    const newRecord: PermissionRecord = {
      id: `perm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId: profile.id,
      userName: profile.name,
      userRole: profile.role || profile.title,
      userAvatarUrl: profile.avatarUrl,
      startDate: data.startDate,
      endDate: data.endDate,
      durationDays: duration,
      type: data.type,
      reason: data.reason,
      substituteDoctor: data.substituteDoctor?.trim() || undefined,
      status: 'menunggu',
      createdAt: new Date().toISOString(),
    };

    globalRecords = [newRecord, ...globalRecords];
    emitChange();
    return newRecord;
  },

  /**
   * Edit existing permission. Only permitted if status is 'menunggu' (not yet approved/rejected/cancelled).
   */
  updatePermission: (
    id: string,
    updates: {
      startDate?: string;
      endDate?: string;
      durationDays?: number;
      type?: PermissionType;
      reason?: string;
      substituteDoctor?: string;
    },
  ): { success: boolean; message: string; record?: PermissionRecord } => {
    const target = globalRecords.find((r) => r.id === id);
    if (!target) {
      return { success: false, message: 'Data perizinan tidak ditemukan.' };
    }

    if (target.status !== 'menunggu') {
      return {
        success: false,
        message:
          target.status === 'disetujui'
            ? 'Perizinan yang sudah disetujui tidak dapat diedit.'
            : 'Perizinan dengan status ini tidak dapat diedit.',
      };
    }

    const startDate = updates.startDate ?? target.startDate;
    const endDate = updates.endDate ?? target.endDate;
    const duration = updates.durationDays && updates.durationDays > 0
      ? updates.durationDays
      : calculateDays(startDate, endDate);

    const updatedRecord: PermissionRecord = {
      ...target,
      startDate,
      endDate,
      durationDays: duration,
      type: updates.type ?? target.type,
      reason: updates.reason ?? target.reason,
      substituteDoctor: updates.substituteDoctor !== undefined ? updates.substituteDoctor : target.substituteDoctor,
    };

    globalRecords = globalRecords.map((r) => (r.id === id ? updatedRecord : r));
    emitChange();
    return { success: true, message: 'Perizinan berhasil diperbarui.', record: updatedRecord };
  },

  /**
   * Cancel permission request. Only permitted if status is 'menunggu'.
   * If already 'disetujui', cancellation is blocked.
   */
  cancelPermission: (
    id: string,
  ): { success: boolean; message: string; record?: PermissionRecord } => {
    const target = globalRecords.find((r) => r.id === id);
    if (!target) {
      return { success: false, message: 'Data perizinan tidak ditemukan.' };
    }

    if (target.status === 'disetujui') {
      return {
        success: false,
        message: 'Izin yang telah disetujui oleh Direksi/HRD tidak dapat dibatalkan melalui aplikasi.',
      };
    }

    if (target.status === 'dibatalkan') {
      return { success: false, message: 'Izin ini sudah dibatalkan sebelumnya.' };
    }

    if (target.status === 'ditolak') {
      return { success: false, message: 'Izin yang telah ditolak tidak dapat dibatalkan.' };
    }

    const updatedRecord: PermissionRecord = {
      ...target,
      status: 'dibatalkan',
      cancelledAt: new Date().toISOString(),
    };

    globalRecords = globalRecords.map((r) => (r.id === id ? updatedRecord : r));
    emitChange();
    return { success: true, message: 'Pengajuan perizinan berhasil dibatalkan.', record: updatedRecord };
  },

  /**
   * Reset to initial dummy seed records.
   */
  reset: () => {
    globalRecords = [...INITIAL_PERMISSION_RECORDS];
    emitChange();
  },
};

function calculateDays(startStr: string, endStr: string): number {
  try {
    const start = new Date(startStr);
    const end = new Date(endStr);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return 1;
    }
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  } catch {
    return 1;
  }
}

/**
 * Shared hook to observe and manage permission and leave records reactively.
 */
export function usePermissionStore() {
  const records = React.useSyncExternalStore(
    permissionStore.subscribe,
    permissionStore.getRecords,
    permissionStore.getRecords,
  );

  const pendingCount = records.filter((r) => r.status === 'menunggu').length;
  const approvedCount = records.filter((r) => r.status === 'disetujui').length;

  return {
    records,
    pendingCount,
    approvedCount,
    createPermission: permissionStore.createPermission,
    updatePermission: permissionStore.updatePermission,
    cancelPermission: permissionStore.cancelPermission,
    reset: permissionStore.reset,
  };
}
