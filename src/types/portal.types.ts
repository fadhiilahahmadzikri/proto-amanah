export type BadgeVariant = 'success' | 'primary' | 'warning' | 'live' | 'trend';

export type DoctorProfile = {
  id: string;
  name: string;
  role: string;
  greeting: string;
  avatarUrl: string;
  unreadNotifications: number;
};

export type DayScheduleSetting = {
  targetQuota: number;
  isCuti: boolean;
  cutiReason?: string;
};

export type BookedPatient = {
  id: string;
  patientName: string;
  avatarUrl?: string;
  patientRm: string;
  patientAge: string;
  patientComplaint: string;
  patientGuardian?: string;
  queueNumber: string;
  timeSlot: string;
  badge: string;
  badgeVariant: BadgeVariant;
};

export type DoctorSchedule = {
  id: string;
  title: string;
  date: string;
  time: string;
  startTime?: string;
  endTime?: string;
  poli: string;
  room: string;
  slotCount: string;
  slotText: string;
  badge: string;
  badgeVariant: BadgeVariant;
  patientName?: string;
  patientRm?: string;
  patientAge?: string;
  patientComplaint?: string;
  patientGuardian?: string;
  queueNumber?: string;
  sessionType?: 'Pagi' | 'Siang' | 'Malam' | 'Dini Hari';
  bookedPatients?: BookedPatient[];
};


export type QuickActionItem = {
  id: string;
  label: string;
  icon: 'history' | 'presence' | 'schedule' | 'search' | 'idCard';
};

export type ActivityMetric = {
  id: string;
  title: string;
  count: number | string;
  unit: string;
  badgeText: string;
  badgeType: 'live' | 'trend';
  icon: 'users' | 'stethoscope';
  glowVariant: 'blue' | 'emerald';
};

export type PortalData = {
  profile: DoctorProfile;
  schedules: DoctorSchedule[];
  quickActions: QuickActionItem[];
  activities: ActivityMetric[];
};
