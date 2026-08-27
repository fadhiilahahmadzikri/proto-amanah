export type QueueDockCardData = {
  id: string;
  brand: string;
  title: string;
  subtitle: string;
  desc?: string;
  bgClass: string;
  textColor: string;
  patientName?: string;
  queueNumber?: string;
  room?: string;
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
    id: 'airtel',
    brand: 'airtel',
    title: '50%',
    subtitle: 'CASHBACK',
    desc: 'Pulsa & Kuota Dokter',
    bgClass: 'bg-gradient-to-br from-red-600 via-rose-700 to-red-950',
    textColor: 'text-white',
  },
  {
    id: 'amazon',
    brand: 'amazon',
    title: '50%',
    subtitle: 'CASHBACK',
    desc: 'hingga Rp100k',
    bgClass: 'bg-gradient-to-br from-[#ff9900] via-[#ea580c] to-[#7c2d12]',
    textColor: 'text-white',
  },
  {
    id: 'zomato',
    brand: 'zomato',
    title: '50%',
    subtitle: 'OFF',
    desc: 'Gourmet Hospital Menu',
    bgClass: 'bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950',
    textColor: 'text-[#f50]',
  },
  {
    id: 'spotify',
    brand: 'spotify',
    title: '3 BLN',
    subtitle: 'PREMIUM',
    desc: 'Musik Relaksasi Praktik',
    bgClass: 'bg-gradient-to-br from-[#1DB954] via-emerald-950 to-black',
    textColor: 'text-[#1DB954]',
  },
  {
    id: 'apple',
    brand: 'apple tv+',
    title: 'GRATIS',
    subtitle: '6 BULAN',
    desc: 'Eksklusif ID Dokter',
    bgClass: 'bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950',
    textColor: 'text-slate-100',
  },
  {
    id: 'disney',
    brand: 'disney+',
    title: '40% OFF',
    subtitle: 'HOTSTAR',
    desc: 'Hiburan Pasien Anak',
    bgClass: 'bg-gradient-to-br from-blue-700 via-indigo-900 to-[#0c1126]',
    textColor: 'text-cyan-300',
  },
  {
    id: 'grab',
    brand: 'grab',
    title: '60% OFF',
    subtitle: 'UNLIMITED',
    desc: 'Transportasi Dokter Jaga',
    bgClass: 'bg-gradient-to-br from-[#00B14F] via-emerald-800 to-teal-950',
    textColor: 'text-emerald-300',
  },
  {
    id: 'gojek',
    brand: 'gojek',
    title: '75K',
    subtitle: 'VOUCHER',
    desc: 'GoFood & GoRide Prioritas',
    bgClass: 'bg-gradient-to-b from-[#00AA13] via-green-900 to-slate-950',
    textColor: 'text-lime-300',
  },
  {
    id: 'netflix',
    brand: 'netflix',
    title: '4K HDR',
    subtitle: 'STREAMING',
    desc: 'Paket Prioritas Bulanan',
    bgClass: 'bg-gradient-to-br from-[#E50914] via-red-950 to-black',
    textColor: 'text-[#E50914]',
  },
  {
    id: 'halodoc',
    brand: 'halodoc',
    title: 'VIP',
    subtitle: 'KONSULTASI',
    desc: 'Akses Spesialis Langsung',
    bgClass: 'bg-gradient-to-br from-[#FF2D55] via-pink-900 to-slate-950',
    textColor: 'text-pink-300',
  },
];
