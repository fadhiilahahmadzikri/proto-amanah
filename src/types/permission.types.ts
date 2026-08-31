export type PermissionStatus = 'menunggu' | 'disetujui' | 'ditolak' | 'dibatalkan';

export type PermissionType = string;

export type PermissionRecord = {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  userAvatarUrl: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  type: string; // Subjek Perizinan (e.g. Urusan Keluarga, Seminar / Simposium, Cuti Tahunan)
  reason: string;
  substituteDoctor?: string;
  status: PermissionStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewerName?: string;
  reviewerNotes?: string;
  cancelledAt?: string;
};
