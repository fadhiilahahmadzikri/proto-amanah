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

export type ModalTriggerType = 'add' | 'edit' | 'detail' | 'delete' | 'action' | 'overlay';

export type ScreenModalVariant = {
  id: string;
  label: string;
  badgeLabel: string;
  modalKey: string;
  triggerType: ModalTriggerType;
  description: string;
};

export type SplittingArtboardDefinition = {
  id: string;
  routeId: string;
  screen: AuthScreen;
  tab?: BottomNavTab;
  category: 'Dashboard' | 'Auth';
  label: string;
  subLabel?: string;
  badgeLabel: string;
  isModalVariant: boolean;
  modalVariant?: ScreenModalVariant;
};

/**
 * Registry of modal, drawer, and overlay sub-states mapped to their parent route ID.
 * Used by Splitting Mode to duplicate artboards with pre-opened modals.
 */
export const SCREEN_MODAL_REGISTRY: Record<string, ScreenModalVariant[]> = {
  // 1. Jadwal Praktek (dash-schedule)
  'dash-schedule': [
    {
      id: 'schedule-add-drawer',
      label: 'Tambah Jadwal Praktik',
      badgeLabel: 'Drawer: Tambah Jadwal',
      modalKey: 'add-schedule',
      triggerType: 'add',
      description: 'Drawer form pembuatan sesi jadwal praktik baru dan pengaturan kuota.',
    },
    {
      id: 'schedule-edit-drawer',
      label: 'Ubah Jadwal Praktik',
      badgeLabel: 'Drawer: Ubah Jadwal',
      modalKey: 'edit-schedule',
      triggerType: 'edit',
      description: 'Drawer pengubahan jam sesi praktik, ruang poli, dan status ketersediaan.',
    },
    {
      id: 'schedule-session-detail',
      label: 'Detail Sesi Praktik',
      badgeLabel: 'Drawer: Detail Sesi',
      modalKey: 'session-detail',
      triggerType: 'detail',
      description: 'Drawer inspeksi rincian sesi praktik dan daftar pasien terdaftar.',
    },
    {
      id: 'schedule-patient-detail',
      label: 'Detail Pasien Antrean',
      badgeLabel: 'Drawer: Detail Pasien',
      modalKey: 'patient-detail',
      triggerType: 'detail',
      description: 'Drawer detail rekam medis pasien, status antrean, dan panggil pasien.',
    },
    {
      id: 'schedule-calendar-drawer',
      label: 'Kalender Bulanan Jadwal',
      badgeLabel: 'Drawer: Kalender',
      modalKey: 'monthly-calendar',
      triggerType: 'action',
      description: 'Drawer kalender bulanan interaktif untuk navigasi tanggal jadwal.',
    },
    {
      id: 'schedule-sessions-mgmt',
      label: 'Kelola Slot Sesi Praktik',
      badgeLabel: 'Layar: Kelola Sesi',
      modalKey: 'sessions-management',
      triggerType: 'action',
      description: 'Halaman manajemen dan konfigurasi slot sesi jam praktik dokter.',
    },
    {
      id: 'schedule-session-patients',
      label: 'Daftar Pasien Booking Sesi',
      badgeLabel: 'Layar: Pasien Sesi',
      modalKey: 'session-patients',
      triggerType: 'detail',
      description: 'Halaman daftar pasien yang terdaftar dalam sesi poli tertentu.',
    },
  ],

  // 2. Presensi QR (dash-qr)
  'dash-qr': [
    {
      id: 'qr-scanner-manual',
      label: 'Input PIN Presensi Manual',
      badgeLabel: 'Drawer: PIN Manual',
      modalKey: 'qr-manual',
      triggerType: 'add',
      description: 'Drawer input 6-digit PIN kode presensi manual alternatif scanner.',
    },
    {
      id: 'qr-scanner-myqr',
      label: 'Tampilkan QR Presensi Dokter',
      badgeLabel: 'Drawer: QR Dokter',
      modalKey: 'qr-myqr',
      triggerType: 'detail',
      description: 'Drawer kode QR dokter dan 5-digit angka presensi untuk dipindai resepsionis.',
    },
    {
      id: 'qr-scanner-upload',
      label: 'Upload File QR Code',
      badgeLabel: 'Drawer: Upload QR',
      modalKey: 'qr-upload',
      triggerType: 'add',
      description: 'Drawer unggah berkas gambar kode QR dari galeri ponsel.',
    },
    {
      id: 'qr-scanner-success',
      label: 'Status Presensi Masuk Berhasil',
      badgeLabel: 'Card: Presensi Sukses',
      modalKey: 'qr-success',
      triggerType: 'detail',
      description: 'Banner notifikasi verifikasi presensi kehadiran dokter berhasil tercatat.',
    },
  ],

  // 3. Perizinan Dokter (dash-notif)
  'dash-notif': [
    {
      id: 'permission-add-form',
      label: 'Form Pengajuan Cuti Baru',
      badgeLabel: 'Modal: Tambah Cuti',
      modalKey: 'add-form',
      triggerType: 'add',
      description: 'Drawer form permohonan cuti/izin, pilih tanggal, dan unggah dokumen.',
    },
    {
      id: 'permission-detail-drawer',
      label: 'Detail Status Izin',
      badgeLabel: 'Drawer: Detail Izin',
      modalKey: 'detail-record',
      triggerType: 'detail',
      description: 'Drawer inspeksi rincian izin, status persetujuan, dan catatan verifikator.',
    },
    {
      id: 'permission-cancel-dialog',
      label: 'Dialog Batalkan Izin',
      badgeLabel: 'Dialog: Batalkan Izin',
      modalKey: 'cancel-dialog',
      triggerType: 'delete',
      description: 'Alert dialog konfirmasi pembatalan permohonan izin dokter.',
    },
  ],

  // 4. Profil & Pengaturan Dokter (dash-account)
  'dash-account': [
    {
      id: 'account-edit-profile',
      label: 'Edit identitas dokter',
      badgeLabel: 'Drawer: edit profil',
      modalKey: 'edit-profile',
      triggerType: 'edit',
      description: 'Drawer formulir pembaruan data SIP, STR, telepon, dan bio dokter.',
    },
    {
      id: 'settings-account',
      label: 'Akun & identitas dokter',
      badgeLabel: 'Layar: akun dokter',
      modalKey: 'settings-account',
      triggerType: 'detail',
      description: 'Layar dedikasi pengaturan akun dan identitas dokter.',
    },
    {
      id: 'settings-security',
      label: 'Privasi & keamanan',
      badgeLabel: 'Layar: keamanan',
      modalKey: 'settings-security',
      triggerType: 'detail',
      description: 'Layar dedikasi pengaturan privasi, PIN, dan keamanan.',
    },
    {
      id: 'settings-data',
      label: 'Data & penyimpanan',
      badgeLabel: 'Layar: data SIMRS',
      modalKey: 'settings-data',
      triggerType: 'detail',
      description: 'Layar dedikasi pengaturan data laporan dan penyimpanan SIMRS.',
    },
    {
      id: 'settings-help',
      label: 'Bantuan teknisi IT',
      badgeLabel: 'Layar: bantuan IT',
      modalKey: 'settings-help',
      triggerType: 'detail',
      description: 'Layar dedikasi bantuan dan support teknisi IT.',
    },
  ],

  // 4. Home Dashboard (dash-home)
  'dash-home': [
    {
      id: 'home-notification-center',
      label: 'Pusat Notifikasi & IGD',
      badgeLabel: 'Drawer: Notifikasi',
      modalKey: 'notification-center',
      triggerType: 'overlay',
      description: 'Drawer notifikasi panggilan darurat IGD dan broadcast pengumuman.',
    },
    {
      id: 'home-queue-dock-main',
      label: 'Rel 3D Antrean Poli',
      badgeLabel: 'Layar: Rel Antrean',
      modalKey: 'queue-dock-main',
      triggerType: 'overlay',
      description: 'Layar rel 3D antrean pasien poli dengan interaksi fisik pull-to-activate.',
    },
    {
      id: 'home-queue-dock-sliding',
      label: 'Tarik Kartu ke Bawah',
      badgeLabel: 'Interaksi: Sliding Kartu',
      modalKey: 'queue-dock-sliding',
      triggerType: 'action',
      description: 'State saat kartu antrean digeser ke bawah mendekati slot dock pemrosesan.',
    },
    {
      id: 'home-queue-dock-morphing',
      label: 'Memproses Antrean (Morphing)',
      badgeLabel: 'State: Morphing Text',
      modalKey: 'queue-dock-morphing',
      triggerType: 'action',
      description: 'State saat kartu tertelan ke slot dengan teks morphing memproses antrean.',
    },
    {
      id: 'home-queue-dock-activation',
      label: 'Aktivasi Pasien (3D Genie)',
      badgeLabel: 'Overlay: Panggil Pasien',
      modalKey: 'queue-dock-activation',
      triggerType: 'action',
      description: 'Layar animasi 3D genie emergence dan panggilan pasien aktif.',
    },
    {
      id: 'home-queue-dock-genie-minimize',
      label: 'Pilih Antrean Lain (Genie Masuk)',
      badgeLabel: 'Genie: Suction Masuk',
      modalKey: 'queue-dock-genie-minimize',
      triggerType: 'action',
      description: 'Snapshot kartu disedot masuk ke slot bawah dengan efek Genie Minimize saat tombol Pilih Antrean Lain ditekan.',
    },
    {
      id: 'home-queue-dock-eject',
      label: 'Kembali Terkunci di Rel',
      badgeLabel: 'Transisi: Eject Kartu',
      modalKey: 'queue-dock-eject',
      triggerType: 'action',
      description: 'State saat kartu menyembul (ATM Peek) dan kembali terkunci di rel 3D.',
    },
    {
      id: 'home-queue-dock-patient-detail',
      label: 'Detail Rekam Pasien Antrean',
      badgeLabel: 'Drawer: Rekam Pasien',
      modalKey: 'queue-dock-patient-detail',
      triggerType: 'detail',
      description: 'Drawer rincian rekam medis dan keluhan pasien saat kartu aktif diklik.',
    },
    {
      id: 'home-queue-dock-info',
      label: 'Panduan Alur Antrean',
      badgeLabel: 'Drawer: Panduan Antrean',
      modalKey: 'queue-dock-info',
      triggerType: 'detail',
      description: 'Drawer panduan langkah alur pemanggilan dan proses antrean pasien.',
    },
    {
      id: 'home-queue-dock-collection',
      label: 'Riwayat Koleksi Antrean',
      badgeLabel: 'Layar: Riwayat Antrean',
      modalKey: 'queue-dock-collection',
      triggerType: 'detail',
      description: 'Layar grid riwayat pasien yang telah selesai dilayani dokter.',
    },
  ],
};

/**
 * Core Algorithm: Generates all Splitting Canvas artboards,
 * multiplying base screens with their pre-opened modal/drawer duplicate views.
 * @param options Generation filter and view mode options.
 * @returns Array of artboard definitions for Splitting Canvas.
 */
export function generateSplittingArtboards(options?: {
  viewMode?: 'all' | 'base-only' | 'modals-only';
  categoryFilter?: 'all' | 'Dashboard' | 'Auth';
  triggerFilter?: 'all' | ModalTriggerType;
}): SplittingArtboardDefinition[] {
  const viewMode = options?.viewMode ?? 'all';
  const categoryFilter = options?.categoryFilter ?? 'all';
  const triggerFilter = options?.triggerFilter ?? 'all';

  const artboards: SplittingArtboardDefinition[] = [];

  for (const baseRoute of PROTOTYPE_ROUTES) {
    if (categoryFilter !== 'all' && baseRoute.category !== categoryFilter) {
      continue;
    }

    // 1. Include Base Screen
    if (viewMode === 'all' || viewMode === 'base-only') {
      artboards.push({
        id: `base-${baseRoute.id}`,
        routeId: baseRoute.id,
        screen: baseRoute.screen,
        tab: baseRoute.tab,
        category: baseRoute.category,
        label: baseRoute.label,
        badgeLabel: baseRoute.category,
        isModalVariant: false,
      });
    }

    // 2. Duplicate and Invert for Registered Modal/Drawer States
    if (viewMode === 'all' || viewMode === 'modals-only') {
      const modalVariants = SCREEN_MODAL_REGISTRY[baseRoute.id] || [];

      for (const variant of modalVariants) {
        if (triggerFilter !== 'all' && variant.triggerType !== triggerFilter) {
          continue;
        }

        artboards.push({
          id: `modal-${variant.id}`,
          routeId: baseRoute.id,
          screen: baseRoute.screen,
          tab: baseRoute.tab,
          category: baseRoute.category,
          label: baseRoute.label,
          subLabel: variant.label,
          badgeLabel: variant.badgeLabel,
          isModalVariant: true,
          modalVariant: variant,
        });
      }
    }
  }

  return artboards;
}
