export type BadgeVariant = 'success' | 'primary' | 'warning' | 'live' | 'trend';

export type DoctorProfile = {
  id: string;
  name: string;
  role: string;
  greeting: string;
  avatarUrl: string;
  unreadNotifications: number;
};

export type DoctorSchedule = {
  id: string;
  title: string;
  date: string;
  time: string;
  poli: string;
  room: string;
  slotCount: string;
  slotText: string;
  badge: string;
  badgeVariant: BadgeVariant;
};

export type QuickActionItem = {
  id: string;
  label: string;
  icon: 'presence' | 'schedule' | 'search' | 'idCard';
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
