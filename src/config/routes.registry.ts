import type { BottomNavTab } from '@/components/molecules/BottomNavBar';
import type { AuthScreen } from '@/types/auth.types';

export type PrototypeRouteDefinition = {
  id: string;
  label: string;
  screen: AuthScreen;
  tab?: BottomNavTab;
  category: 'Dashboard' | 'Auth';
  description?: string;
};

/**
 * Canonical registry of all unique screens and sub-routes in the prototype.
 * Used for automatic detection, routing navigation, and DevTools Splitting view.
 */
export const PROTOTYPE_ROUTES: PrototypeRouteDefinition[] = [
  // 1. Doctor Portal Screens (7 unique views)
  {
    id: 'dash-home',
    label: 'Home Dashboard',
    screen: 'dashboard',
    tab: 'home',
    category: 'Dashboard',
    description: 'Ringkasan aktivitas hari ini, jadwal aktif, quick access, dan promosi RS.',
  },
  {
    id: 'dash-id-card',
    label: 'Kartu ID Dokter (3D)',
    screen: 'id-card',
    category: 'Dashboard',
    description: 'Kartu tanda pengenal dokter 3D interaktif dengan physics lanyard.',
  },
  {
    id: 'dash-schedule',
    label: 'Jadwal Praktek',
    screen: 'dashboard',
    tab: 'schedule',
    category: 'Dashboard',
    description: 'Kalender jadwal harian/mingguan dan manajemen sesi poli dokter.',
  },
  {
    id: 'dash-qr',
    label: 'Presensi QR',
    screen: 'dashboard',
    tab: 'qr',
    category: 'Dashboard',
    description: 'Scanner kamera QR Code dan panduan presensi cepat kehadiran.',
  },
  {
    id: 'dash-presence-history',
    label: 'Riwayat Presensi',
    screen: 'presence-history',
    category: 'Dashboard',
    description: 'Catatan log kehadiran, waktu check-in/out, dan status verifikasi.',
  },
  {
    id: 'dash-notif',
    label: 'Perizinan Dokter',
    screen: 'dashboard',
    tab: 'notification',
    category: 'Dashboard',
    description: 'Daftar pengajuan izin/cuti dokter serta form permohonan baru.',
  },
  {
    id: 'dash-account',
    label: 'Profil Dokter',
    screen: 'dashboard',
    tab: 'account',
    category: 'Dashboard',
    description: 'Pengaturan akun dokter, spesialisasi, preferensi keamanan, dan data.',
  },

  // 2. Authentication & Onboarding Screens (7 unique views)
  {
    id: 'auth-onboarding',
    label: 'Onboarding',
    screen: 'onboarding',
    category: 'Auth',
    description: 'Layar selamat datang portal mobile RS Amanah.',
  },
  {
    id: 'auth-login',
    label: 'Login',
    screen: 'login',
    category: 'Auth',
    description: 'Drawer modal masuk akun dokter menggunakan kredensial terdaftar.',
  },
  {
    id: 'auth-signup',
    label: 'Register',
    screen: 'signup',
    category: 'Auth',
    description: 'Drawer pendaftaran akun baru dokter spesialis.',
  },
  {
    id: 'auth-forgot',
    label: 'Lupa Password',
    screen: 'forgot-password',
    category: 'Auth',
    description: 'Form pemulihan kata sandi melalui nomor ponsel / email.',
  },
  {
    id: 'auth-otp',
    label: 'Verifikasi OTP',
    screen: 'otp',
    category: 'Auth',
    description: 'Input 4 digit kode OTP verifikasi keamanan.',
  },
  {
    id: 'auth-change-pass',
    label: 'Ubah Password',
    screen: 'change-password',
    category: 'Auth',
    description: 'Form pembuatan kata sandi baru pasca verifikasi OTP.',
  },
  {
    id: 'auth-success',
    label: 'Konfirmasi Sukses',
    screen: 'success',
    category: 'Auth',
    description: 'Layar animasi status sukses operasi akun.',
  },
];
