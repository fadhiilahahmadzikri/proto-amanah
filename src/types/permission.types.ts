export type PermissionStatus = 'menunggu' | 'disetujui' | 'ditolak' | 'dibatalkan';

export type PermissionType =
  | 'Cuti Tahunan'
  | 'Izin Sakit'
  | 'Seminar / Simposium'
  | 'Urusan Keluarga'
  | 'Tugas Luar RS';

export type PermissionRecord = {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  userAvatarUrl: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  type: PermissionType;
  reason: string;
  substituteDoctor?: string;
  status: PermissionStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewerName?: string;
  reviewerNotes?: string;
  cancelledAt?: string;
};
