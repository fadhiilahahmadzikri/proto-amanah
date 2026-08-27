export type QueueDockCardData = {
  id: string;
  queueNumber: string; // "#01", "#02", ... "#10"
  patientName: string; // "Budi Mulyono", etc.
  complaint: string; // "Sakit kepala dan panas dalam", etc.
  poly: string; // "Poli Gigi", "Poli Umum", etc.
  doctorName: string; // "dr. Sarah Wijaya, Sp.A"
  doctorImage: string; // "/assets/images/doctors/woman-docter-3.png"
  watermarkUrl: string; // "/assets/images/wm.svg"
  priority: 'Reguler' | 'Prioritas' | 'BPJS' | 'VIP';
  timeSlot: string;
  age: number;
  gender: 'L' | 'P';
  room?: string;
  status?: string;
  // Compatibility fields
  brand?: string;
  title?: string;
  subtitle?: string;
  desc?: string;
  bgClass?: string;
  textColor?: string;
  imageUrl?: string;
  spriteUrl?: string;
  types?: string[];
  rarity?: string;
  supertype?: string;
  subtypes?: string[];
  number?: string;
  set?: string;
};

export const DOCK_CARD_WIDTH = 195;
export const DOCK_SPACING = 230; // Drag sensitivity spacing
export const DOCK_RAIL_RADIUS = 660; // Radius of circular U-railway track
export const DOCK_RAIL_ANGLE_STEP = 19.5; // Angle in degrees per card along U-railway
export const DOCK_CURVE_DEPTH = -25; // Z translation along track
export const DOCK_MAX_ROTATION_Y = 8; // Subtle 3D Y rotation
export const DOCK_MAX_ROTATION_Z = 13; // Tilt angle along top curved arc (13deg)
export const DOCK_ACTIVATION_THRESHOLD = 100;

export const DEFAULT_DOCK_CARDS: QueueDockCardData[] = [
  {
    id: 'queue-01',
    queueNumber: '#01',
    patientName: 'Budi Mulyono',
    complaint: 'sakit kepala dan panas dalam',
    poly: 'Poli gigi',
    doctorName: 'dr. Sarah Wijaya, Sp.A',
    doctorImage: '/assets/images/doctors/woman-docter-3.png',
    watermarkUrl: '/assets/images/wm.svg',
    priority: 'Reguler',
    timeSlot: '08:30 WIB',
    age: 34,
    gender: 'L',
    room: 'R. Periksa 101',
    status: 'Menunggu',
    brand: 'Budi Mulyono',
    title: '#01 · Poli gigi',
    subtitle: 'REGULER',
    desc: 'sakit kepala dan panas dalam',
    bgClass: 'bg-gradient-to-br from-blue-600 to-indigo-900',
    textColor: 'text-white',
  },
  {
    id: 'queue-02',
    queueNumber: '#02',
    patientName: 'Siti Rahmawati',
    complaint: 'Pemeriksaan rutin anak & flu batuk',
    poly: 'Poli Anak',
    doctorName: 'dr. Sarah Wijaya, Sp.A',
    doctorImage: '/assets/images/doctors/woman-docter-3.png',
    watermarkUrl: '/assets/images/wm.svg',
    priority: 'Prioritas',
    timeSlot: '08:45 WIB',
    age: 6,
    gender: 'P',
    room: 'R. Anak 104',
    status: 'Menunggu',
    brand: 'Siti Rahmawati',
    title: '#02 · Poli Anak',
    subtitle: 'PRIORITAS',
    desc: 'Pemeriksaan rutin anak & flu batuk',
    bgClass: 'bg-gradient-to-br from-amber-600 to-orange-900',
    textColor: 'text-white',
  },
  {
    id: 'queue-03',
    queueNumber: '#03',
    patientName: 'Ahmad Fauzi',
    complaint: 'Kontrol hipertensi berkala & vertigo',
    poly: 'Poli Umum',
    doctorName: 'dr. Sarah Wijaya, Sp.A',
    doctorImage: '/assets/images/doctors/woman-docter-3.png',
    watermarkUrl: '/assets/images/wm.svg',
    priority: 'BPJS',
    timeSlot: '09:00 WIB',
    age: 52,
    gender: 'L',
    room: 'R. Umum 102',
    status: 'Menunggu',
    brand: 'Ahmad Fauzi',
    title: '#03 · Poli Umum',
    subtitle: 'BPJS KESEHATAN',
    desc: 'Kontrol hipertensi berkala & vertigo',
    bgClass: 'bg-gradient-to-br from-emerald-600 to-teal-900',
    textColor: 'text-white',
  },
  {
    id: 'queue-04',
    queueNumber: '#04',
    patientName: 'Dewi Sartika',
    complaint: 'Konsultasi gusi bengkak & cabut gigi',
    poly: 'Poli Gigi',
    doctorName: 'dr. Sarah Wijaya, Sp.A',
    doctorImage: '/assets/images/doctors/woman-docter-3.png',
    watermarkUrl: '/assets/images/wm.svg',
    priority: 'Reguler',
    timeSlot: '09:15 WIB',
    age: 28,
    gender: 'P',
    room: 'R. Gigi 201',
    status: 'Menunggu',
    brand: 'Dewi Sartika',
    title: '#04 · Poli Gigi',
    subtitle: 'REGULER',
    desc: 'Konsultasi gusi bengkak & cabut gigi',
    bgClass: 'bg-gradient-to-br from-cyan-600 to-blue-900',
    textColor: 'text-white',
  },
  {
    id: 'queue-05',
    queueNumber: '#05',
    patientName: 'Hendra Wijaya',
    complaint: 'Nyeri lambung akut kronis & mual',
    poly: 'Poli Penyakit Dalam',
    doctorName: 'dr. Sarah Wijaya, Sp.A',
    doctorImage: '/assets/images/doctors/woman-docter-3.png',
    watermarkUrl: '/assets/images/wm.svg',
    priority: 'Prioritas',
    timeSlot: '09:30 WIB',
    age: 41,
    gender: 'L',
    room: 'R. Interna 105',
    status: 'Menunggu',
    brand: 'Hendra Wijaya',
    title: '#05 · Poli Interna',
    subtitle: 'PRIORITAS',
    desc: 'Nyeri lambung akut kronis & mual',
    bgClass: 'bg-gradient-to-br from-rose-600 to-red-950',
    textColor: 'text-white',
  },
  {
    id: 'queue-06',
    queueNumber: '#06',
    patientName: 'Rina Marlina',
    complaint: 'Pemeriksaan USG kandungan & trimester 2',
    poly: 'Poli Obgyn',
    doctorName: 'dr. Sarah Wijaya, Sp.A',
    doctorImage: '/assets/images/doctors/woman-docter-3.png',
    watermarkUrl: '/assets/images/wm.svg',
    priority: 'VIP',
    timeSlot: '09:45 WIB',
    age: 30,
    gender: 'P',
    room: 'R. Obgyn 203',
    status: 'Menunggu',
    brand: 'Rina Marlina',
    title: '#06 · Poli Obgyn',
    subtitle: 'VIP AMANAH',
    desc: 'Pemeriksaan USG kandungan & trimester 2',
    bgClass: 'bg-gradient-to-br from-purple-600 to-indigo-950',
    textColor: 'text-white',
  },
  {
    id: 'queue-07',
    queueNumber: '#07',
    patientName: 'Agus Setiawan',
    complaint: 'Alergi dingin, gatal kemerahan & ruam kulit',
    poly: 'Poli Kulit',
    doctorName: 'dr. Sarah Wijaya, Sp.A',
    doctorImage: '/assets/images/doctors/woman-docter-3.png',
    watermarkUrl: '/assets/images/wm.svg',
    priority: 'Reguler',
    timeSlot: '10:00 WIB',
    age: 24,
    gender: 'L',
    room: 'R. Kulit 108',
    status: 'Menunggu',
    brand: 'Agus Setiawan',
    title: '#07 · Poli Kulit',
    subtitle: 'REGULER',
    desc: 'Alergi dingin, gatal kemerahan & ruam kulit',
    bgClass: 'bg-gradient-to-br from-teal-600 to-slate-900',
    textColor: 'text-white',
  },
  {
    id: 'queue-08',
    queueNumber: '#08',
    patientName: 'Nurul Hidayah',
    complaint: 'Pemeriksaan mata buram & resep kacamata',
    poly: 'Poli Mata',
    doctorName: 'dr. Sarah Wijaya, Sp.A',
    doctorImage: '/assets/images/doctors/woman-docter-3.png',
    watermarkUrl: '/assets/images/wm.svg',
    priority: 'BPJS',
    timeSlot: '10:15 WIB',
    age: 38,
    gender: 'P',
    room: 'R. Mata 106',
    status: 'Menunggu',
    brand: 'Nurul Hidayah',
    title: '#08 · Poli Mata',
    subtitle: 'BPJS KESEHATAN',
    desc: 'Pemeriksaan mata buram & resep kacamata',
    bgClass: 'bg-gradient-to-br from-blue-500 to-slate-900',
    textColor: 'text-white',
  },
  {
    id: 'queue-09',
    queueNumber: '#09',
    patientName: 'Eko Prasetyo',
    complaint: 'Nyeri persendian lutut & cek asam urat',
    poly: 'Poli Saraf',
    doctorName: 'dr. Sarah Wijaya, Sp.A',
    doctorImage: '/assets/images/doctors/woman-docter-3.png',
    watermarkUrl: '/assets/images/wm.svg',
    priority: 'Reguler',
    timeSlot: '10:30 WIB',
    age: 49,
    gender: 'L',
    room: 'R. Saraf 107',
    status: 'Menunggu',
    brand: 'Eko Prasetyo',
    title: '#09 · Poli Saraf',
    subtitle: 'REGULER',
    desc: 'Nyeri persendian lutut & cek asam urat',
    bgClass: 'bg-gradient-to-br from-violet-600 to-purple-950',
    textColor: 'text-white',
  },
  {
    id: 'queue-10',
    queueNumber: '#10',
    patientName: 'Maya Kusuma',
    complaint: 'Medical check-up berkala & tes lab darah',
    poly: 'Poli Umum',
    doctorName: 'dr. Sarah Wijaya, Sp.A',
    doctorImage: '/assets/images/doctors/woman-docter-3.png',
    watermarkUrl: '/assets/images/wm.svg',
    priority: 'VIP',
    timeSlot: '10:45 WIB',
    age: 32,
    gender: 'P',
    room: 'R. Executive 205',
    status: 'Menunggu',
    brand: 'Maya Kusuma',
    title: '#10 · Poli Umum',
    subtitle: 'VIP AMANAH',
    desc: 'Medical check-up berkala & tes lab darah',
    bgClass: 'bg-gradient-to-br from-amber-500 to-slate-900',
    textColor: 'text-white',
  },
];
