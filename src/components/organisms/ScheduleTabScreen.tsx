'use client';

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { gsap } from 'gsap';
import {
  AlertCircle,
  Calendar,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit3,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import React from 'react';
import { DateCarouselStrip } from '@/components/molecules/DateCarouselStrip';
import { ScreenHeader } from '@/components/molecules/ScreenHeader';
import { cn } from '@/lib/utils';
import type {
  BookedPatient,
  DayScheduleSetting,
  DoctorSchedule,
} from '@/types/portal.types';

// Custom SF-styled SVG Icons for 1:1 match with reference POC
const Icons = {
  Plus: () => (
    <svg className="w-3.5 h-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Cross: () => (
    <svg className="w-3.5 h-3.5 stroke-[2.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

const TIME_OPTIONS = [
  '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM',
  '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM',
];

interface FormSessionSlot {
  id: string;
  from: string;
  to: string;
  room: string;
  poli: string;
}

interface FormSessionItem {
  id: 'dini_hari' | 'pagi' | 'siang' | 'malam';
  name: string;
  active: boolean;
  slots: FormSessionSlot[];
}

const INITIAL_SESSIONS: FormSessionItem[] = [
  { id: 'dini_hari', name: 'Sesi Dini Hari', active: false, slots: [{ id: 'dh1', from: '1:00 AM', to: '4:00 AM', room: 'Ruang 201', poli: 'Poli Gigi & Mulut' }] },
  { id: 'pagi', name: 'Sesi Pagi', active: false, slots: [{ id: 'p1', from: '7:00 AM', to: '11:00 AM', room: 'Ruang 201', poli: 'Poli Gigi & Mulut' }] },
  { id: 'siang', name: 'Sesi Siang', active: false, slots: [{ id: 's1', from: '1:00 PM', to: '5:00 PM', room: 'Ruang 201', poli: 'Poli Gigi & Mulut' }] },
  { id: 'malam', name: 'Sesi Malam', active: false, slots: [{ id: 'm1', from: '7:00 PM', to: '10:00 PM', room: 'Ruang 201', poli: 'Poli Gigi & Mulut' }] },
];

const ToggleSwitch = (props: {
  active: boolean;
  onChange: (val: boolean) => void;
  id?: string;
  isDark?: boolean;
}) => (
  <button
    type="button"
    id={props.id}
    aria-label="Toggle availability"
    onClick={(e) => {
      e.stopPropagation();
      props.onChange(!props.active);
    }}
    className={cn(
      'relative inline-flex h-[26px] w-[46px] shrink-0 cursor-pointer rounded-full p-[2px] transition-colors duration-300 ease-out focus:outline-none',
      props.active
        ? (props.isDark ? 'bg-cyan-500' : 'bg-[#1C1C1E]')
        : (props.isDark ? 'bg-white/20' : 'bg-[#E5E5EA]'),
    )}
  >
    <span
      className={cn(
        'pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,0.2)] transition-transform duration-500 ease-[cubic-bezier(0.34,1.8,0.64,1)]',
        props.active ? 'translate-x-[20px]' : 'translate-x-[0px]',
      )}
    />
  </button>
);

// Smooth Slide-down Blurry Reveal using real GSAP
const GsapSlotRow = (props: {
  children: React.ReactNode;
  className?: string;
}) => {
  const rowRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!rowRef.current) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rowRef.current,
        {
          y: -14,
          opacity: 0,
          filter: 'blur(8px)',
        },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.38,
          ease: 'power3.out',
        },
      );
    }, rowRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rowRef} className={cn('will-change-[transform,opacity,filter] transform-gpu', props.className)}>
      {props.children}
    </div>
  );
};

const DEFAULT_ROOM_OPTIONS = [
  'Ruang 101',
  'Ruang 102',
  'Ruang 201',
  'Ruang 202',
  'Ruang 203',
  'Ruang 301',
  'Ruang 302',
  'Ruang VIP 1',
  'Ruang VIP 2',
  'Ruang Bedah A',
  'Ruang Konsultasi 1',
  'Ruang Radiologi',
];

// Mock occupied items representing previously booked / unavailable slots
const OCCUPIED_TIME_OPTIONS = [
  '2:00 AM',
  '3:00 AM',
  '9:00 AM',
  '10:00 AM',
  '2:00 PM',
  '3:00 PM',
  '8:00 PM',
];

const OCCUPIED_ROOM_OPTIONS = [
  'Ruang 102',
  'Ruang 203',
  'Ruang VIP 1',
];

const DEFAULT_POLI_OPTIONS = [
  'Poli Gigi & Mulut',
  'Poli Umum',
  'Poli Spesialis Anak',
  'Poli Penyakit Dalam',
  'Poli Jantung & Pembuluh',
  'Poli Mata',
  'Poli THT',
  'Poli Kulit & Kelamin',
  'Poli Syaraf',
  'Poli Kandungan (Obgyn)',
  'Poli Bedah Umum',
  'Poli Fisioterapi',
];

interface ActiveModalTarget {
  type: 'from' | 'to' | 'room' | 'poli';
  sessionId: string;
  slotIndex: number;
  currentValue: string;
}

// Interactive Selection Sheet Drawer for Time, Room, and Polyclinic (Contained inside iPhone mock frame)
const SelectionModal = (props: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  currentValue: string;
  options: string[];
  disabledOptions?: string[];
  onSelect: (val: string) => void;
  isDark?: boolean;
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const sheetRef = React.useRef<HTMLDivElement>(null);
  const isClosingRef = React.useRef(false);

  // Smooth slide-up entrance
  React.useEffect(() => {
    if (props.isOpen && sheetRef.current) {
      isClosingRef.current = false;
      setSearchQuery('');
      gsap.fromTo(
        sheetRef.current,
        { y: '100%', opacity: 0.95 },
        { y: '0%', opacity: 1, duration: 0.32, ease: 'power3.out' },
      );
    }
  }, [props.isOpen]);

  const triggerClose = () => {
    if (isClosingRef.current || !sheetRef.current) {
      props.onClose();
      return;
    }
    isClosingRef.current = true;
    gsap.to(sheetRef.current, {
      y: '100%',
      opacity: 0.9,
      duration: 0.25,
      ease: 'power3.in',
      onComplete: () => {
        props.onClose();
        isClosingRef.current = false;
      },
    });
  };

  if (!props.isOpen) {
    return null;
  }

  const filteredOptions = props.options.filter(opt =>
    opt.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleManualSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      props.onSelect(searchQuery.trim());
      triggerClose();
    }
  };

  return (
    <div className="absolute inset-0 z-60 overflow-hidden flex flex-col justify-end select-text">
      {/* Absolute Backdrop inside frame */}
      <div
        className="absolute -inset-10 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={triggerClose}
      />

      {/* Nested Sheet Drawer inside iPhone frame with bottom navigation clearance */}
      <div
        ref={sheetRef}
        className={cn(
          'relative z-10 w-full max-h-[88%] rounded-t-[36px] border-t p-5 pb-28 sm:pb-32 shadow-2xl transition-colors flex flex-col gap-3.5 will-change-transform backdrop-blur-2xl overflow-hidden',
          props.isDark
            ? 'bg-[#0a0e1a] border-white/15 text-white shadow-black/80'
            : 'bg-white border-slate-200 text-slate-900 shadow-2xl',
        )}
      >
        {/* Drag Handle */}
        <div className={cn('w-12 h-1.5 rounded-full mx-auto mb-1 shrink-0', props.isDark ? 'bg-white/25' : 'bg-slate-300')} />

        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b shrink-0" style={{ borderColor: props.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }}>
          <div>
            <h3 className="text-sm font-bold tracking-tight">{props.title}</h3>
            {props.subtitle && (
              <p className={cn('text-[11px] mt-0.5', props.isDark ? 'text-neutral-400' : 'text-slate-500')}>
                {props.subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="Tutup"
            onClick={triggerClose}
            className={cn(
              'p-1.5 rounded-full transition-colors cursor-pointer',
              props.isDark ? 'text-neutral-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100',
            )}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Manual Input / Search Field */}
        <form onSubmit={handleManualSubmit} className="flex gap-2 shrink-0">
          <div className="relative flex-1">
            <Search className={cn('w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2', props.isDark ? 'text-neutral-400' : 'text-slate-400')} />
            <input
              type="text"
              placeholder="Cari atau ketik manual..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={cn(
                'w-full pl-8 pr-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none transition-all',
                props.isDark
                  ? 'bg-transparent border-white/15 text-white placeholder:text-neutral-500 focus:border-cyan-400'
                  : 'bg-transparent border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-600',
              )}
            />
          </div>
          {searchQuery.trim().length > 0 && (
            <button
              type="submit"
              className={cn(
                'px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 active:scale-95',
                props.isDark
                  ? 'bg-cyan-500 text-neutral-950 hover:bg-cyan-400'
                  : 'bg-blue-600 text-white hover:bg-blue-700',
              )}
            >
              Gunakan
            </button>
          )}
        </form>

        {/* Options Grid (Outline with inherited background) */}
        <div className="space-y-1.5 overflow-hidden flex flex-col flex-1 min-h-0">
          <span className={cn('block text-[11px] font-semibold px-0.5 shrink-0', props.isDark ? 'text-neutral-400' : 'text-slate-500')}>
            Pilihan Tersedia
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto no-scrollbar pr-0.5 max-h-52 sm:max-h-56 pb-4">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = props.currentValue.trim().toLowerCase() === opt.trim().toLowerCase();
                const isDisabled = !isSelected && Boolean(props.disabledOptions?.some(d => d.trim().toLowerCase() === opt.trim().toLowerCase()));

                return (
                  <button
                    type="button"
                    key={opt}
                    disabled={isDisabled}
                    onClick={() => {
                      if (!isDisabled) {
                        props.onSelect(opt);
                        triggerClose();
                      }
                    }}
                    className={cn(
                      'px-2.5 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between',
                      isDisabled
                        ? props.isDark
                          ? 'opacity-35 cursor-not-allowed border-dashed border-white/10 bg-white/[0.02] text-neutral-500 line-through select-none'
                          : 'opacity-40 cursor-not-allowed border-dashed border-slate-200 bg-slate-100/60 text-slate-400 line-through select-none'
                        : isSelected
                          ? props.isDark
                            ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300 font-bold shadow-xs cursor-pointer active:scale-95'
                            : 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-xs cursor-pointer active:scale-95'
                          : props.isDark
                            ? 'border-white/15 bg-transparent text-neutral-300 hover:border-white/30 hover:bg-white/5 cursor-pointer active:scale-95'
                            : 'border-slate-200 bg-transparent text-slate-700 hover:border-slate-300 hover:bg-slate-50 cursor-pointer active:scale-95',
                    )}
                  >
                    <span className="truncate">{opt}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-cyan-400 dark:text-cyan-300" />}
                  </button>
                );
              })
            ) : (
              <div className="col-span-2 sm:col-span-3 py-4 text-center">
                <p className={cn('text-xs', props.isDark ? 'text-neutral-400' : 'text-slate-500')}>
                  Tidak ada opsi cocok. Tekan <b>Gunakan</b> untuk memakai teks input manual di atas.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Initial Mock Schedule Data: Doctor Practice Sessions with Booked Patients
const INITIAL_SCHEDULES_MAP: Record<string, DoctorSchedule[]> = {
  '2026-08-26': [
    {
      id: 'ses-1',
      title: 'Sesi Pagi',
      date: 'Rabu, 26 Agustus 2026',
      time: '07:00 - 11:00 WIB',
      startTime: '07:00',
      endTime: '11:00',
      sessionType: 'Pagi',
      poli: 'Poli Gigi & Mulut',
      room: 'Ruang 201',
      slotCount: '2',
      slotText: '2 Pasien Booking',
      badge: 'Buka',
      badgeVariant: 'success',
      bookedPatients: [
        {
          id: 'p-1',
          patientName: 'Steven Pratama',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
          patientAge: '28 Thn',
          patientRm: 'RM-2026-0412',
          patientComplaint: 'Pembersihan karang gigi (scaling) & tambal gigi geraham belakang',
          queueNumber: '#01',
          timeSlot: '08:00 - 09:30 WIB',
          badge: 'Aktif',
          badgeVariant: 'success',
        },
        {
          id: 'p-2',
          patientName: 'An. Kevin Sanjaya',
          avatarUrl: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=300&auto=format&fit=crop',
          patientAge: '7 Thn',
          patientRm: 'RM-2026-0523',
          patientGuardian: 'Bpk. Budi Sanjaya (Ayah)',
          patientComplaint: 'Cabut gigi susu goyang & aplikasi fluoride',
          queueNumber: '#02',
          timeSlot: '10:00 - 11:00 WIB',
          badge: 'Mendatang',
          badgeVariant: 'primary',
        },
      ],
    },
    {
      id: 'ses-2',
      title: 'Sesi Siang',
      date: 'Rabu, 26 Agustus 2026',
      time: '13:00 - 17:00 WIB',
      startTime: '13:00',
      endTime: '17:00',
      sessionType: 'Siang',
      poli: 'Klinik Spesialis Konservasi',
      room: 'Ruang 204',
      slotCount: '1',
      slotText: '1 Pasien Booking',
      badge: 'Buka',
      badgeVariant: 'success',
      bookedPatients: [
        {
          id: 'p-3',
          patientName: 'Ibu Ratna Dewi',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
          patientAge: '42 Thn',
          patientRm: 'RM-2026-0789',
          patientComplaint: 'Perawatan saluran akar lanjutan tahap 2 & persiapan crown',
          queueNumber: '#01',
          timeSlot: '13:30 - 15:00 WIB',
          badge: 'Mendatang',
          badgeVariant: 'primary',
        },
      ],
    },
    {
      id: 'ses-3',
      title: 'Sesi Malam',
      date: 'Rabu, 26 Agustus 2026',
      time: '19:00 - 22:00 WIB',
      startTime: '19:00',
      endTime: '22:00',
      sessionType: 'Malam',
      poli: 'Klinik Eksekutif VIP',
      room: 'Suite VIP 01',
      slotCount: '1',
      slotText: '1 Pasien Booking',
      badge: 'Buka',
      badgeVariant: 'success',
      bookedPatients: [
        {
          id: 'p-4',
          patientName: 'Andi Budiman',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
          patientAge: '34 Thn',
          patientRm: 'RM-2026-0811',
          patientComplaint: 'Pemeriksaan estetika veneer & konsultasi clear aligner',
          queueNumber: '#01',
          timeSlot: '19:30 - 21:00 WIB',
          badge: 'Mendatang',
          badgeVariant: 'primary',
        },
      ],
    },
  ],
  '2026-08-27': [
    {
      id: 'ses-4',
      title: 'Sesi Pagi',
      date: 'Kamis, 27 Agustus 2026',
      time: '08:00 - 12:00 WIB',
      startTime: '08:00',
      endTime: '12:00',
      sessionType: 'Pagi',
      poli: 'Poli Gigi Umum',
      room: 'Ruang 201',
      slotCount: '1',
      slotText: '1 Pasien Booking',
      badge: 'Buka',
      badgeVariant: 'success',
      bookedPatients: [
        {
          id: 'p-5',
          patientName: 'Rafi Ahmad',
          avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300&auto=format&fit=crop',
          patientAge: '35 Thn',
          patientRm: 'RM-2026-0911',
          patientComplaint: 'Pemeriksaan rutin & scaling berkala',
          queueNumber: '#01',
          timeSlot: '09:00 - 10:30 WIB',
          badge: 'Mendatang',
          badgeVariant: 'primary',
        },
      ],
    },
    {
      id: 'ses-5',
      title: 'Sesi Siang',
      date: 'Kamis, 27 Agustus 2026',
      time: '13:00 - 17:00 WIB',
      startTime: '13:00',
      endTime: '17:00',
      sessionType: 'Siang',
      poli: 'Spesialis Bedah Mulut',
      room: 'Ruang Tindakan 2',
      slotCount: '1',
      slotText: '1 Pasien Booking',
      badge: 'Buka',
      badgeVariant: 'success',
      bookedPatients: [
        {
          id: 'p-6',
          patientName: 'Bpk. Hendra Gunawan',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop',
          patientAge: '49 Thn',
          patientRm: 'RM-2026-1044',
          patientComplaint: 'Tindakan odontektomi gigi bungsu impaksi',
          queueNumber: '#01',
          timeSlot: '14:00 - 15:30 WIB',
          badge: 'Mendatang',
          badgeVariant: 'primary',
        },
      ],
    },
  ],
  '2026-08-28': [
    {
      id: 'ses-6',
      title: 'Sesi Pagi',
      date: 'Jumat, 28 Agustus 2026',
      time: '08:00 - 11:30 WIB',
      startTime: '08:00',
      endTime: '11:30',
      sessionType: 'Pagi',
      poli: 'Telemedisin Gigi',
      room: 'Studio D-02',
      slotCount: '1',
      slotText: '1 Pasien Booking',
      badge: 'Buka',
      badgeVariant: 'success',
      bookedPatients: [
        {
          id: 'p-7',
          patientName: 'Nadia Saphira',
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
          patientAge: '24 Thn',
          patientRm: 'RM-2026-1120',
          patientComplaint: 'Konsultasi rencana kawat gigi / clear aligner estetika',
          queueNumber: '#01',
          timeSlot: '08:30 - 10:00 WIB',
          badge: 'Mendatang',
          badgeVariant: 'primary',
        },
      ],
    },
  ],
  '2026-08-29': [
    {
      id: 'ses-7',
      title: 'Sesi Pagi',
      date: 'Sabtu, 29 Agustus 2026',
      time: '09:00 - 12:00 WIB',
      startTime: '09:00',
      endTime: '12:00',
      sessionType: 'Pagi',
      poli: 'Poli Eksekutif VIP',
      room: 'Suite VIP 02',
      slotCount: '1',
      slotText: '1 Pasien Booking',
      badge: 'Buka',
      badgeVariant: 'success',
      bookedPatients: [
        {
          id: 'p-8',
          patientName: 'drg. Maya Kusuma (VIP)',
          avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop',
          patientAge: '31 Thn',
          patientRm: 'RM-2026-1205',
          patientComplaint: 'Pemasangan bleaching / pemutihan gigi & fluoride polish',
          queueNumber: '#01',
          timeSlot: '09:00 - 11:00 WIB',
          badge: 'Mendatang',
          badgeVariant: 'primary',
        },
      ],
    },
  ],
  '2026-08-31': [
    {
      id: 'ses-8',
      title: 'Sesi Pagi',
      date: 'Senin, 31 Agustus 2026',
      time: '08:30 - 12:00 WIB',
      startTime: '08:30',
      endTime: '12:00',
      sessionType: 'Pagi',
      poli: 'Poli Gigi & Mulut',
      room: 'Ruang 201',
      slotCount: '1',
      slotText: '1 Pasien Booking',
      badge: 'Buka',
      badgeVariant: 'success',
      bookedPatients: [
        {
          id: 'p-9',
          patientName: 'Farhan Maulana',
          avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop',
          patientAge: '29 Thn',
          patientRm: 'RM-2026-1310',
          patientComplaint: 'Penambalan gigi berlubang & konsultasi',
          queueNumber: '#01',
          timeSlot: '08:30 - 10:00 WIB',
          badge: 'Mendatang',
          badgeVariant: 'primary',
        },
      ],
    },
  ],
};

export function ScheduleTabScreen(props: {
  theme?: 'dark' | 'light';
  onBack?: () => void;
  className?: string;
}) {
  const isDark = props.theme === 'dark';

  // Real Calendar: Base Today date 26 August 2026
  const baseToday = React.useMemo(() => new Date(2026, 7, 26), []);
  const [selectedDate, setSelectedDate] = React.useState<Date>(baseToday);
  const [schedulesMap, setSchedulesMap] = React.useState<Record<string, DoctorSchedule[]>>(INITIAL_SCHEDULES_MAP);

  // Day POV Settings Map (Target Kuota Pasien & Status Cuti Harian)
  const [daySettingsMap, setDaySettingsMap] = React.useState<Record<string, DayScheduleSetting>>({
    '2026-08-26': { targetQuota: 8, isCuti: false },
    '2026-08-27': { targetQuota: 6, isCuti: false },
    '2026-08-28': { targetQuota: 6, isCuti: false },
    '2026-08-29': { targetQuota: 10, isCuti: false },
    '2026-08-30': { targetQuota: 0, isCuti: true, cutiReason: 'Cuti Akhir Pekan' },
    '2026-08-31': { targetQuota: 8, isCuti: false },
  });

  // Add / Edit Master Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [editingSchedule, setEditingSchedule] = React.useState<DoctorSchedule | null>(null);

  // Detail Sheet Drawer State
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = React.useState(false);
  const [detailSchedule, setDetailSchedule] = React.useState<DoctorSchedule | null>(null);
  const detailDrawerRef = React.useRef<HTMLDivElement>(null);
  const isClosingDetailRef = React.useRef(false);

  // Patient List Sheet Drawer State (Daftar Pasien Booking)
  const [isPatientListDrawerOpen, setIsPatientListDrawerOpen] = React.useState(false);
  const patientListDrawerRef = React.useRef<HTMLDivElement>(null);
  const isClosingPatientListRef = React.useRef(false);

  const triggerClosePatientListDrawer = React.useCallback(() => {
    if (isClosingPatientListRef.current || !patientListDrawerRef.current) {
      setIsPatientListDrawerOpen(false);
      return;
    }
    isClosingPatientListRef.current = true;

    gsap.to(patientListDrawerRef.current, {
      y: '100%',
      opacity: 0.9,
      duration: 0.28,
      ease: 'power3.in',
      onComplete: () => {
        setIsPatientListDrawerOpen(false);
        isClosingPatientListRef.current = false;
      },
    });
  }, []);

  // Single Patient Detail Modal State (Keluhan & Rekam Pasien)
  const [isPatientDetailModalOpen, setIsPatientDetailModalOpen] = React.useState(false);
  const [detailPatient, setDetailPatient] = React.useState<BookedPatient | null>(null);
  const patientDetailModalRef = React.useRef<HTMLDivElement>(null);
  const isClosingPatientDetailRef = React.useRef(false);

  const triggerClosePatientDetailModal = React.useCallback(() => {
    if (isClosingPatientDetailRef.current || !patientDetailModalRef.current) {
      setIsPatientDetailModalOpen(false);
      return;
    }
    isClosingPatientDetailRef.current = true;

    gsap.to(patientDetailModalRef.current, {
      y: '100%',
      opacity: 0.9,
      duration: 0.28,
      ease: 'power3.in',
      onComplete: () => {
        setIsPatientDetailModalOpen(false);
        isClosingPatientDetailRef.current = false;
      },
    });
  }, []);

  // 3-way Form Status Switcher State (Menunggu | Buka | Cuti)
  const [formStatus, setFormStatus] = React.useState<'menunggu' | 'buka' | 'cuti'>('buka');

  // Doc Schedule Big Calendar Drawer State
  const [isDocScheduleDrawerOpen, setIsDocScheduleDrawerOpen] = React.useState(false);
  const [docScheduleMonth, setDocScheduleMonth] = React.useState<Date>(baseToday);
  const docScheduleDrawerRef = React.useRef<HTMLDivElement>(null);
  const isClosingDocScheduleRef = React.useRef(false);

  // Master Drawer Gesture Refs
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const drawerContentRef = React.useRef<HTMLDivElement>(null);
  const startYRef = React.useRef(0);
  const currentDragYRef = React.useRef(0);
  const isDraggingRef = React.useRef(false);
  const isClosingRef = React.useRef(false);

  // Selected Date Context Values
  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');
  const currentDaySetting = daySettingsMap[selectedDateKey] ?? { targetQuota: 8, isCuti: false };
  const isDayCuti = currentDaySetting.isCuti;
  const currentSchedules = schedulesMap[selectedDateKey] ?? [];
  const targetDailyQuota = currentDaySetting.targetQuota;
  const totalBookedPatientsToday = currentSchedules.reduce(
    (acc, sch) => acc + (sch.bookedPatients?.length ?? 0),
    0,
  );
  const capacityPercentage = targetDailyQuota > 0
    ? Math.min(100, Math.round((totalBookedPatientsToday / targetDailyQuota) * 100))
    : 0;

  // Nature background pool
  const NATURE_IMAGES_POOL = [
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
  ];

  // Open Detail Drawer
  const handleOpenDetailDrawer = (sch: DoctorSchedule) => {
    setDetailSchedule(sch);
    setIsDetailDrawerOpen(true);
  };

  const triggerCloseDetailDrawer = React.useCallback(() => {
    if (isClosingDetailRef.current || !detailDrawerRef.current) {
      setIsDetailDrawerOpen(false);
      return;
    }
    isClosingDetailRef.current = true;

    gsap.to(detailDrawerRef.current, {
      y: '100%',
      opacity: 0.9,
      duration: 0.3,
      ease: 'power3.in',
      onComplete: () => {
        setIsDetailDrawerOpen(false);
        isClosingDetailRef.current = false;
      },
    });
  }, []);

  // Doc Schedule Drawer Handlers
  const triggerCloseDocScheduleDrawer = React.useCallback(() => {
    if (isClosingDocScheduleRef.current || !docScheduleDrawerRef.current) {
      setIsDocScheduleDrawerOpen(false);
      return;
    }
    isClosingDocScheduleRef.current = true;

    gsap.to(docScheduleDrawerRef.current, {
      y: '100%',
      opacity: 0.9,
      duration: 0.3,
      ease: 'power3.in',
      onComplete: () => {
        setIsDocScheduleDrawerOpen(false);
        isClosingDocScheduleRef.current = false;
      },
    });
  }, []);

  // Drawer Entrance Animations
  React.useEffect(() => {
    if (isDetailDrawerOpen && detailDrawerRef.current) {
      gsap.fromTo(
        detailDrawerRef.current,
        { y: '100%', opacity: 0.95 },
        { y: '0%', opacity: 1, duration: 0.4, ease: 'power3.out' },
      );
    }
  }, [isDetailDrawerOpen]);

  React.useEffect(() => {
    if (isPatientListDrawerOpen && patientListDrawerRef.current) {
      gsap.fromTo(
        patientListDrawerRef.current,
        { y: '100%', opacity: 0.95 },
        { y: '0%', opacity: 1, duration: 0.35, ease: 'power3.out' },
      );
    }
  }, [isPatientListDrawerOpen]);

  React.useEffect(() => {
    if (isPatientDetailModalOpen && patientDetailModalRef.current) {
      gsap.fromTo(
        patientDetailModalRef.current,
        { y: '100%', opacity: 0.95 },
        { y: '0%', opacity: 1, duration: 0.35, ease: 'power3.out' },
      );
    }
  }, [isPatientDetailModalOpen]);

  React.useEffect(() => {
    if (isDocScheduleDrawerOpen && docScheduleDrawerRef.current) {
      gsap.fromTo(
        docScheduleDrawerRef.current,
        { y: '100%', opacity: 0.95 },
        { y: '0%', opacity: 1, duration: 0.4, ease: 'power3.out' },
      );
    }
  }, [isDocScheduleDrawerOpen]);

  // Helper to determine status on big calendar (past/disabled, today, upcoming/buka, cuti, tutup)
  const getDayScheduleStatus = (day: Date) => {
    const dayStart = startOfDay(day);
    const todayStart = startOfDay(baseToday);
    const dateKey = format(day, 'yyyy-MM-dd');
    const schedules = schedulesMap[dateKey] ?? [];
    const setting = daySettingsMap[dateKey];
    const isCutiDay = setting?.isCuti ?? (day.getDay() === 0);

    if (isBefore(dayStart, todayStart)) {
      return {
        status: 'past' as const,
        label: 'Selesai',
        disabled: true,
      };
    }

    if (isCutiDay) {
      return {
        status: 'leave' as const,
        label: 'Cuti',
        disabled: false,
      };
    }

    if (isSameDay(dayStart, todayStart)) {
      return {
        status: 'today' as const,
        label: 'Hari Ini',
        count: schedules.length,
        disabled: false,
      };
    }

    if (schedules.length > 0) {
      return {
        status: 'upcoming' as const,
        label: 'Mendatang',
        count: schedules.length,
        disabled: false,
      };
    }

    return {
      status: 'closed' as const,
      label: 'Tutup',
      disabled: false,
    };
  };

  // Form Fields - Doctor Schedule Creation / Editing (Doctor POV with per-slot Room & Poli)
  const [formDate, setFormDate] = React.useState<Date>(baseToday);
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [calendarMonth, setCalendarMonth] = React.useState<Date>(baseToday);
  const [sessions, setSessions] = React.useState<FormSessionItem[]>(INITIAL_SESSIONS);
  const [activeModalTarget, setActiveModalTarget] = React.useState<ActiveModalTarget | null>(null);

  // POC Session Toggling
  const toggleSession = (sessionId: string, forcedState: boolean | null = null) => {
    setSessions(prev =>
      prev.map((session) => {
        if (session.id === sessionId) {
          const nextActive = forcedState !== null ? forcedState : !session.active;
          return {
            ...session,
            active: nextActive,
            slots: nextActive && session.slots.length === 0
              ? [{ id: `${sessionId}-${Date.now()}`, from: '7:00 AM', to: '8:00 AM', room: 'Ruang 201', poli: 'Poli Gigi & Mulut' }]
              : session.slots,
          };
        }
        return session;
      }),
    );
  };

  // Add Time Slot Row with own Room & Poli
  const addTimeSlot = (sessionId: string) => {
    setSessions(prev =>
      prev.map((session) => {
        if (session.id === sessionId) {
          let from = '8:00 AM';
          let to = '10:00 AM';

          if (sessionId === 'dini_hari') {
            from = '2:00 AM';
            to = '4:00 AM';
          } else if (sessionId === 'pagi') {
            from = '8:00 AM';
            to = '10:00 AM';
          } else if (sessionId === 'siang') {
            from = '2:00 PM';
            to = '4:00 PM';
          } else if (sessionId === 'malam') {
            from = '8:00 PM';
            to = '10:00 PM';
          }

          const prevSlot = session.slots[session.slots.length - 1];
          const room = prevSlot?.room || 'Ruang 201';
          const poli = prevSlot?.poli || 'Poli Gigi & Mulut';

          return {
            ...session,
            slots: [...session.slots, { id: `${sessionId}-${Date.now()}`, from, to, room, poli }],
          };
        }
        return session;
      }),
    );
  };

  // Remove Time Slot Row
  const removeTimeSlot = (sessionId: string, slotIndex: number) => {
    setSessions(prev =>
      prev.map((session) => {
        if (session.id === sessionId) {
          const updatedSlots = session.slots.filter((_, idx) => idx !== slotIndex);
          return {
            ...session,
            slots: updatedSlots,
          };
        }
        return session;
      }),
    );
  };

  // Update Time Slot Row Field (from, to, room, poli)
  const updateTimeSlot = (sessionId: string, slotIndex: number, field: 'from' | 'to' | 'room' | 'poli', value: string) => {
    setSessions(prev =>
      prev.map((session) => {
        if (session.id === sessionId) {
          const updatedSlots = session.slots.map((s, idx) => (idx === slotIndex ? { ...s, [field]: value } : s));
          return { ...session, slots: updatedSlots };
        }
        return session;
      }),
    );
  };

  // Master Drawer Entrance Animation
  React.useEffect(() => {
    if (isDrawerOpen && drawerRef.current) {
      gsap.fromTo(
        drawerRef.current,
        { y: '100%', opacity: 0.95 },
        { y: '0%', opacity: 1, duration: 0.4, ease: 'power3.out' },
      );
    }
  }, [isDrawerOpen]);

  // Master Drawer Close Action
  const triggerCloseDrawer = React.useCallback(() => {
    if (isClosingRef.current || !drawerRef.current) {
      setIsDrawerOpen(false);
      return;
    }
    isClosingRef.current = true;

    gsap.to(drawerRef.current, {
      y: '100%',
      opacity: 0.9,
      duration: 0.3,
      ease: 'power3.in',
      onComplete: () => {
        setIsDrawerOpen(false);
        isClosingRef.current = false;
      },
    });
  }, []);

  // Master Drawer Drag Gesture Handling
  const handleDrawerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target instanceof HTMLElement ? e.target : null;
    if (target?.closest('input, textarea, select, button, a')) {
      return;
    }

    startYRef.current = e.clientY;
    currentDragYRef.current = 0;

    if (!drawerContentRef.current || drawerContentRef.current.scrollTop <= 0) {
      isDraggingRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handleDrawerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !drawerRef.current) {
      return;
    }

    const deltaY = e.clientY - startYRef.current;
    if (deltaY > 0) {
      currentDragYRef.current = deltaY;
      gsap.set(drawerRef.current, { y: deltaY });
    }
  };

  const handleDrawerPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !drawerRef.current) {
      return;
    }
    isDraggingRef.current = false;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }

    if (currentDragYRef.current > 70) {
      triggerCloseDrawer();
    } else {
      gsap.to(drawerRef.current, {
        y: 0,
        duration: 0.4,
        ease: 'elastic.out(1, 0.75)',
      });
    }
  };

  // Open Add Schedule Drawer
  const handleOpenAddDrawer = (targetDate?: Date) => {
    const initialDate = targetDate ?? selectedDate ?? baseToday;
    setEditingSchedule(null);
    setFormDate(initialDate);
    setCalendarMonth(initialDate);
    setIsCalendarOpen(false);
    setFormStatus('menunggu');
    setSessions([
      { id: 'dini_hari', name: 'Sesi Dini Hari', active: false, slots: [{ id: 'dh1', from: '1:00 AM', to: '4:00 AM', room: 'Ruang 201', poli: 'Poli Gigi & Mulut' }] },
      { id: 'pagi', name: 'Sesi Pagi', active: false, slots: [{ id: 'p1', from: '7:00 AM', to: '11:00 AM', room: 'Ruang 201', poli: 'Poli Gigi & Mulut' }] },
      { id: 'siang', name: 'Sesi Siang', active: false, slots: [{ id: 's1', from: '1:00 PM', to: '5:00 PM', room: 'Ruang 201', poli: 'Poli Gigi & Mulut' }] },
      { id: 'malam', name: 'Sesi Malam', active: false, slots: [{ id: 'm1', from: '7:00 PM', to: '10:00 PM', room: 'Ruang 201', poli: 'Poli Gigi & Mulut' }] },
    ]);
    setIsDrawerOpen(true);
  };

  // Open Edit Schedule Drawer
  const handleOpenEditDrawer = (sch: DoctorSchedule) => {
    setEditingSchedule(sch);
    const b = sch.badge?.toLowerCase();
    setFormStatus(b === 'cuti' ? 'cuti' : b === 'menunggu' ? 'menunggu' : 'buka');
    const matchedSessionId = sch.sessionType === 'Dini Hari' ? 'dini_hari' : sch.sessionType === 'Siang' ? 'siang' : sch.sessionType === 'Malam' ? 'malam' : 'pagi';
    setSessions([
      { id: 'dini_hari', name: 'Sesi Dini Hari', active: matchedSessionId === 'dini_hari', slots: [{ id: 'dh1', from: '1:00 AM', to: '4:00 AM', room: sch.room, poli: sch.poli }] },
      { id: 'pagi', name: 'Sesi Pagi', active: matchedSessionId === 'pagi', slots: [{ id: 'p1', from: sch.startTime ?? '7:00 AM', to: sch.endTime ?? '11:00 AM', room: sch.room, poli: sch.poli }] },
      { id: 'siang', name: 'Sesi Siang', active: matchedSessionId === 'siang', slots: [{ id: 's1', from: '1:00 PM', to: '5:00 PM', room: sch.room, poli: sch.poli }] },
      { id: 'malam', name: 'Sesi Malam', active: matchedSessionId === 'malam', slots: [{ id: 'm1', from: '7:00 PM', to: '10:00 PM', room: sch.room, poli: sch.poli }] },
    ]);

    // Find date for this schedule
    let scheduleDate = selectedDate;
    for (const [dateKey, list] of Object.entries(schedulesMap)) {
      if (list.some(item => item.id === sch.id)) {
        const [y, m, d] = dateKey.split('-').map(Number);
        if (y && m && d) {
          scheduleDate = new Date(y, m - 1, d);
        }
        break;
      }
    }
    setFormDate(scheduleDate);
    setCalendarMonth(scheduleDate);
    setIsCalendarOpen(false);
    setIsDrawerOpen(true);
  };

  // Delete Schedule Handler
  const handleDeleteSchedule = (schId: string) => {
    setSchedulesMap((prev) => {
      const next = { ...prev };
      for (const k of Object.keys(next)) {
        next[k] = (next[k] ?? []).filter(item => item.id !== schId);
      }
      return next;
    });
  };

  // Save Schedule Handler (Doctor POV: creates / updates doctor schedule with active sessions and slots)
  const handleSaveSchedule = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const targetDateKey = format(formDate, 'yyyy-MM-dd');
    const formattedDate = format(formDate, 'EEEE, d MMMM yyyy', { locale: idLocale });

    const activeSessions = sessions.filter(s => s.active);
    const targetSessions = activeSessions.length > 0
      ? activeSessions
      : [sessions[1] ?? { id: 'pagi', name: 'Sesi Pagi', active: true, slots: [{ id: 'p1', from: '7:00 AM', to: '11:00 AM', room: 'Ruang 201', poli: 'Poli Gigi & Mulut' }] }];

    if (editingSchedule) {
      const mappedBadge = formStatus === 'cuti' ? 'Cuti' : formStatus === 'menunggu' ? 'Menunggu' : 'Buka';
      const mappedBadgeVariant: 'warning' | 'primary' | 'success' = formStatus === 'cuti' ? 'warning' : formStatus === 'menunggu' ? 'primary' : 'success';

      if (formStatus === 'cuti') {
        setDaySettingsMap(prev => ({
          ...prev,
          [targetDateKey]: { ...(prev[targetDateKey] ?? { targetQuota: 8, isCuti: false }), isCuti: true, cutiReason: 'Dokter Cuti Praktik' },
        }));
      } else {
        setDaySettingsMap(prev => ({
          ...prev,
          [targetDateKey]: { ...(prev[targetDateKey] ?? { targetQuota: 8, isCuti: false }), isCuti: false },
        }));
      }

      const firstActive = targetSessions[0]!;
      const firstSlot = firstActive.slots[0] ?? { from: '7:00 AM', to: '11:00 AM', room: 'Ruang 201', poli: 'Poli Gigi & Mulut' };
      const sessionTypeMapped: 'Pagi' | 'Siang' | 'Malam' | 'Dini Hari' = firstActive.id === 'dini_hari' ? 'Dini Hari' : firstActive.id === 'siang' ? 'Siang' : firstActive.id === 'malam' ? 'Malam' : 'Pagi';

      setSchedulesMap((prev) => {
        const next = { ...prev };
        for (const k of Object.keys(next)) {
          next[k] = (next[k] ?? []).filter(item => item.id !== editingSchedule.id);
        }
        const updatedItem: DoctorSchedule = {
          ...editingSchedule,
          title: firstActive.name,
          date: formattedDate,
          time: `${firstSlot.from} - ${firstSlot.to} WIB`,
          startTime: firstSlot.from,
          endTime: firstSlot.to,
          sessionType: sessionTypeMapped,
          poli: firstSlot.poli || 'Poli Gigi & Mulut',
          room: firstSlot.room || 'Ruang 201',
          badge: mappedBadge,
          badgeVariant: mappedBadgeVariant,
          bookedPatients: editingSchedule.bookedPatients ?? [],
        };
        next[targetDateKey] = [...(next[targetDateKey] ?? []), updatedItem];
        return next;
      });
    } else {
      const newSessions: DoctorSchedule[] = [];
      targetSessions.forEach((ses, sesIdx) => {
        const sessionTypeMapped: 'Pagi' | 'Siang' | 'Malam' | 'Dini Hari' = ses.id === 'dini_hari' ? 'Dini Hari' : ses.id === 'siang' ? 'Siang' : ses.id === 'malam' ? 'Malam' : 'Pagi';
        const firstSlot = ses.slots[0] ?? { from: '7:00 AM', to: '11:00 AM', room: 'Ruang 201', poli: 'Poli Gigi & Mulut' };
        newSessions.push({
          id: `ses-${Date.now()}-${ses.id}-${sesIdx}`,
          title: ses.name,
          date: formattedDate,
          time: `${firstSlot.from} - ${firstSlot.to} WIB`,
          startTime: firstSlot.from,
          endTime: firstSlot.to,
          sessionType: sessionTypeMapped,
          poli: firstSlot.poli || 'Poli Gigi & Mulut',
          room: firstSlot.room || 'Ruang 201',
          slotCount: '0',
          slotText: '0 Pasien Booking',
          badge: 'Menunggu',
          badgeVariant: 'primary',
          bookedPatients: [],
        });
      });

      setSchedulesMap((prev) => {
        const currentList = prev[targetDateKey] ?? [];
        return {
          ...prev,
          [targetDateKey]: [...currentList, ...newSessions],
        };
      });
    }

    // Move to created/edited schedule date context
    setSelectedDate(formDate);
    triggerCloseDrawer();
  };

  return (
    <div
      className={cn('relative w-full h-full overflow-hidden', props.className)}
    >
      {/* Dynamic Spring Transitions directly from POC */}
      <style>{`
        .spring-card-transition {
          transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .spring-grid-transition {
          transition: grid-template-rows 0.48s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease-out;
        }
      `}</style>

      {/* 1. Master Overlay Glassmorphic Screen Header */}
      <ScreenHeader
        title="Jadwal Praktik"
        onBack={props.onBack}
        theme={props.theme}
        rightAction={(
          <button
            type="button"
            aria-label="Tambah Jadwal Baru"
            onClick={() => {
              handleOpenAddDrawer();
            }}
            className={cn(
              'p-1.5 -mr-1.5 rounded-full transition-all cursor-pointer active:scale-90 flex items-center justify-center',
              isDark
                ? 'text-cyan-400 hover:text-cyan-300 hover:bg-white/10'
                : 'text-blue-600 hover:text-blue-700 hover:bg-slate-100',
            )}
          >
            <Plus className="h-6 w-6 stroke-[2]" />
          </button>
        )}
      />

      {/* 2. Full-Height Scrollable Content Viewport */}
      <div className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar px-5 pt-20 pb-36 flex flex-col gap-3.5">
        {/* 1. Top Row: Kapasitas Hari Ini Radial & Lihat Schedule Trigger */}
        <div className="flex justify-between items-center px-1 shrink-0 mt-1 select-none">
          {/* Left: Kapasitas Hari Ini Radial Component */}
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Radial Circular Progress Gauge */}
            <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
              <svg className="w-11 h-11 -rotate-90 transform-gpu" viewBox="0 0 48 48">
                <defs>
                  <linearGradient id="capacityRadialGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={isDark ? '#22d3ee' : '#2563eb'} />
                    <stop offset="100%" stopColor={isDark ? '#06b6d4' : '#4f46e5'} />
                  </linearGradient>
                </defs>
                {/* Track Circle */}
                <circle
                  cx="24"
                  cy="24"
                  r="19"
                  fill="transparent"
                  stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
                  strokeWidth="4"
                />
                {/* Active Progress Arc */}
                <circle
                  cx="24"
                  cy="24"
                  r="19"
                  fill="transparent"
                  stroke={isDayCuti ? '#f59e0b' : 'url(#capacityRadialGradient)'}
                  strokeWidth="4"
                  strokeDasharray={119.38}
                  strokeDashoffset={119.38 - (119.38 * (isDayCuti ? 0 : capacityPercentage)) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              {/* Radial Center Value */}
              <span className={cn('absolute text-[9.5px] font-bold tracking-tight', isDark ? 'text-white' : 'text-slate-900')}>
                {isDayCuti ? '0%' : `${capacityPercentage}%`}
              </span>
            </div>

            {/* Capacity Label & Real Patient Count */}
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={cn('text-xs font-bold tracking-tight', isDark ? 'text-white' : 'text-slate-900')}>
                  Kapasitas Hari Ini
                </span>
                <span
                  className={cn(
                    'px-1.5 py-0.2 rounded-full text-[9.5px] font-bold inline-flex items-center gap-1 shrink-0',
                    isDayCuti
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
                  )}
                >
                  <span className={cn('h-1.5 w-1.5 rounded-full', isDayCuti ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse')} />
                  {isDayCuti ? 'Cuti' : 'Buka'}
                </span>
              </div>
              <p className={cn('text-[11px] font-medium mt-0.5', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                <span className={cn('font-bold', isDark ? 'text-cyan-400' : 'text-blue-600')}>
                  {totalBookedPatientsToday}
                </span>
                <span> / {targetDailyQuota} Pasien Terdaftar</span>
              </p>
            </div>
          </div>

          {/* Right: Lihat Schedule Trigger */}
          <button
            type="button"
            onClick={() => {
              setDocScheduleMonth(selectedDate);
              setIsDocScheduleDrawerOpen(true);
            }}
            className={cn(
              'text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 hover:underline',
              isDark
                ? 'text-cyan-400 hover:text-cyan-300'
                : 'text-blue-600 hover:text-blue-700',
            )}
          >
            <span>Lihat Schedule</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 2. GSAP 3D Coverflow Date Carousel with Swipe Gestures */}
        <div className="w-full max-w-full shrink-0 my-0.5 overflow-hidden">
          <DateCarouselStrip
            selectedDate={selectedDate}
            onSelectDate={(d) => {
              setSelectedDate(d);
            }}
            schedulesMap={schedulesMap}
            daySettingsMap={daySettingsMap}
            baseToday={baseToday}
            theme={props.theme}
          />
        </div>

        {/* 4. Cuti Alert Banner if Day is on Cuti */}
        {isDayCuti && (
          <div
            className={cn(
              'p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in',
              isDark
                ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                : 'bg-amber-50 border-amber-200 text-amber-800',
            )}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
              <span>Dokter Cuti Praktik: Seluruh jadwal dinonaktifkan.</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setDaySettingsMap(prev => ({
                  ...prev,
                  [selectedDateKey]: { ...currentDaySetting, isCuti: false },
                }));
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-500 text-neutral-950 font-bold text-[11px] shrink-0 hover:bg-amber-400 transition-colors cursor-pointer"
            >
              Buka Jadwal
            </button>
          </div>
        )}

        {/* 5. Singular Schedule Cards (1 Card = 1 Patient) */}
        <div className="flex flex-col gap-3 mt-1">
          <div className="flex justify-between items-center px-1">
            <h3
              className={cn(
                'text-xs font-semibold tracking-tight',
                isDark ? 'text-slate-400' : 'text-slate-600',
              )}
            >
              {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: idLocale })}
            </h3>
            <span className={cn('text-[11px] font-medium', isDark ? 'text-neutral-500' : 'text-slate-400')}>
              {currentSchedules.length} Sesi Praktik
            </span>
          </div>

          {currentSchedules.length > 0 ? (
            currentSchedules.map((sch, index) => {
              const natureImage = NATURE_IMAGES_POOL[index % NATURE_IMAGES_POOL.length];
              const sessionTitle = sch.title;
              const displayStartTime = sch.startTime ?? (sch.time.split(' ')[0] ?? '08:00');
              const displayEndTime = sch.endTime ?? (sch.time.split(' - ')[1]?.split(' ')[0] ?? '11:00');
              const bookedCount = sch.bookedPatients?.length ?? 0;

              return (
                <div
                  key={sch.id}
                  data-schedule-card
                  onClick={() => {
                    handleOpenDetailDrawer(sch);
                  }}
                  className={cn(
                    'relative w-full h-[360px] rounded-[32px] overflow-hidden shadow-2xl bg-slate-900 select-none border border-black/10 transition-all duration-300 active:scale-[0.99] cursor-pointer isolate [transform:translateZ(0)]',
                    isDayCuti && 'opacity-85 grayscale-20',
                  )}
                  style={{
                    clipPath: 'inset(0 round 32px)',
                    WebkitClipPath: 'inset(0 round 32px)',
                  }}
                >
                  {/* Layer 1: Single 100% Crisp Background Photo */}
                  <img
                    src={natureImage}
                    alt={sessionTitle}
                    className="absolute inset-0 w-full h-full object-cover object-center rounded-[32px]"
                  />

                  {/* Layer 2: Real-time GPU Liquid Glass */}
                  <div
                    className="absolute inset-0 pointer-events-none z-10 rounded-[32px]"
                    style={{
                      backdropFilter: 'blur(20px) saturate(160%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                      maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 35%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0) 75%)',
                      WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 35%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0) 75%)',
                    }}
                  />

                  {/* Layer 3: High-Contrast Ambient Gradient */}
                  <div
                    className="absolute inset-0 pointer-events-none z-15 rounded-[32px]"
                    style={{
                      background: 'linear-gradient(to top, rgba(12, 20, 15, 0.82) 0%, rgba(12, 20, 15, 0.4) 40%, rgba(12, 20, 15, 0) 70%)',
                    }}
                  />

                  {/* Top Badge: Status Badge (Top-Left) */}
                  <div className="absolute top-4 left-4 z-30">
                    <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-white/90">
                      <span
                        className={cn(
                          'h-2 w-2 rounded-full',
                          isDayCuti
                            ? 'bg-amber-500'
                            : sch.badgeVariant === 'success'
                              ? 'bg-emerald-500 animate-pulse'
                              : sch.badgeVariant === 'warning'
                                ? 'bg-amber-500'
                                : 'bg-cyan-500',
                        )}
                      />
                      <span className="text-xs font-semibold text-gray-900 tracking-tight">
                        {isDayCuti ? 'Cuti' : sch.badge}
                      </span>
                    </div>
                  </div>

                  {/* Top Badge: Booked Patients Count (Top-Right) */}
                  <div className="absolute top-4 right-4 z-30">
                    <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-white/20 text-white">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold tracking-tight">
                        {bookedCount} Pasien Booking
                      </span>
                    </div>
                  </div>

                  {/* Card Content Overlay Layer */}
                  <div className="absolute bottom-0 inset-x-0 z-20 p-5 pt-6 text-white">
                    {/* Session Name Heading */}
                    <h1 className="text-white text-[24px] font-semibold tracking-tight leading-none mb-3">
                      {sessionTitle}
                    </h1>

                    {/* Details Row: Room & Poli on Left, Time Mulai & Selesai on Right */}
                    <div className="flex items-end justify-between gap-2">
                      {/* Room & Poli */}
                      <div className="flex flex-col justify-end text-left space-y-0.5 max-w-[55%]">
                        <p className="text-white/70 text-[13px] font-normal leading-snug tracking-tight truncate">
                          {sch.poli} • {sch.room}
                        </p>
                        <p className="text-white/95 text-[13.5px] font-medium leading-snug tracking-tight">
                          {sch.date}
                        </p>
                      </div>

                      {/* Specifications: Jam Mulai & Jam Selesai (Pure uncolored white icons) */}
                      <div className="flex items-center gap-3 shrink-0">
                        {/* Jam Mulai */}
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-1 text-white font-medium text-[13.5px]">
                            <Clock className="w-3.5 h-3.5 text-white" />
                            <span>{displayStartTime}</span>
                          </div>
                          <span className="text-[11px] text-white/70 font-normal mt-0.5">Mulai</span>
                        </div>

                        {/* Separator Line */}
                        <div className="w-[1px] h-7 bg-white/20 self-center" />

                        {/* Jam Selesai */}
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-1 text-white font-medium text-[13.5px]">
                            <Clock className="w-3.5 h-3.5 text-white" />
                            <span>{displayEndTime}</span>
                          </div>
                          <span className="text-[11px] text-white/70 font-normal mt-0.5">Selesai</span>
                        </div>
                      </div>
                    </div>

                    {/* Glass Line Separator */}
                    <div className="w-full h-[1px] bg-white/20 my-3.5" />

                    {/* Footer Actions: Detail + Edit + Delete */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetailDrawer(sch);
                        }}
                        className="flex-1 py-2.5 rounded-2xl bg-white hover:bg-white/90 text-slate-950 font-bold text-xs shadow-lg transition-all text-center cursor-pointer active:scale-[0.98]"
                      >
                        Detail Sesi
                      </button>

                      {/* Icon-based Edit Action */}
                      <button
                        type="button"
                        aria-label="Edit Jadwal"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditDrawer(sch);
                        }}
                        className="h-10 w-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 bg-white/15 hover:bg-white/25 text-white border border-white/20 shadow-sm"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>

                      {/* Icon-based Delete Action */}
                      <button
                        type="button"
                        aria-label="Hapus Jadwal"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSchedule(sch.id);
                        }}
                        className="h-10 w-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 shadow-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            // Empty State
            <div
              className={cn(
                'flex flex-col items-center justify-center p-8 rounded-3xl border text-center my-2',
                isDark
                  ? 'bg-neutral-900/60 border-white/10 text-neutral-300'
                  : 'bg-slate-50/80 border-slate-200 text-slate-600',
              )}
            >
              <div
                className={cn(
                  'flex h-13 w-13 items-center justify-center rounded-2xl mb-3',
                  isDark ? 'bg-white/10 text-neutral-400' : 'bg-slate-100 text-slate-400',
                )}
              >
                <CalendarDays className="h-6 w-6" />
              </div>
              <h4 className={cn('text-sm font-bold mb-1', isDark ? 'text-white' : 'text-slate-900')}>
                Tidak Ada Jadwal
              </h4>
              <p className="text-xs max-w-[220px] mb-4 text-neutral-400">
                {isDayCuti
                  ? 'Dokter sedang cuti pada tanggal ini.'
                  : 'Belum ada sesi praktik dokter pada tanggal ini.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  handleOpenAddDrawer(selectedDate);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all cursor-pointer active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Jadwal Dokter</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. Master Drawer: Tambah / Edit Jadwal Pasien */}
      {isDrawerOpen && (
        <>
          {/* Flat Backdrop Overlay */}
          <div
            className="absolute -inset-10 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={triggerCloseDrawer}
          />

          {/* Master Bottom Sheet Drawer */}
          <div
            ref={drawerRef}
            onPointerDown={handleDrawerPointerDown}
            onPointerMove={handleDrawerPointerMove}
            onPointerUp={handleDrawerPointerUp}
            onPointerCancel={handleDrawerPointerUp}
            className={cn(
              'absolute inset-x-0 bottom-0 z-50 h-auto max-h-[88%] rounded-t-[36px] border-t p-5 pb-28 sm:pb-32 shadow-2xl transition-colors duration-300 select-text touch-pan-y backdrop-blur-2xl will-change-transform flex flex-col justify-between',
              isDark
                ? 'bg-[#0a0e1a] border-white/15 text-white shadow-black/80'
                : 'bg-white border-slate-200 text-slate-900 shadow-xl',
            )}
          >
            {/* GSAP Drag Handle Indicator */}
            <div className={cn('w-12 h-1.5 rounded-full mx-auto mb-2 cursor-grab active:cursor-grabbing shrink-0', isDark ? 'bg-white/25' : 'bg-slate-300')} />

            <div ref={drawerContentRef} className="overflow-y-auto no-scrollbar flex flex-col gap-3">
              {/* Header Bar inside Drawer Base */}
              <div className="flex items-center justify-between pb-2 border-b shrink-0" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}>
                <h4 className={cn('text-base font-bold tracking-tight', isDark ? 'text-white' : 'text-slate-950')}>
                  {editingSchedule ? 'Edit Jadwal' : 'Tambah Jadwal'}
                </h4>
                <button
                  type="button"
                  aria-label="Tutup drawer"
                  onClick={triggerCloseDrawer}
                  className={cn(
                    'p-1.5 rounded-full transition-colors cursor-pointer',
                    isDark ? 'text-neutral-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100',
                  )}
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>

              {/* Form Fields for Doctor Practice Schedule (Doctor POV) */}
              <form onSubmit={handleSaveSchedule} className="space-y-3.5">
                {/* 0. Status Jadwal Praktik: Menunggu | Buka | Cuti (Hanya ditampilkan saat Edit Jadwal) */}
                {editingSchedule && (
                  <div>
                    <label className={cn('block text-xs font-semibold mb-1.5', isDark ? 'text-neutral-200' : 'text-slate-700')}>
                      Status Praktik
                    </label>
                    <div
                      className={cn(
                        'p-1 rounded-2xl flex items-center gap-1 border transition-colors',
                        isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200',
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setFormStatus('menunggu')}
                        className={cn(
                          'flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5',
                          formStatus === 'menunggu'
                            ? isDark
                              ? 'bg-amber-500 text-neutral-950 shadow-md'
                              : 'bg-amber-500 text-white shadow-sm'
                            : isDark
                              ? 'text-neutral-400 hover:text-white hover:bg-white/5'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-white',
                        )}
                      >
                        <span className={cn('h-1.5 w-1.5 rounded-full', formStatus === 'menunggu' ? (isDark ? 'bg-neutral-950' : 'bg-white') : 'bg-amber-400')} />
                        <span>Menunggu</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormStatus('buka')}
                        className={cn(
                          'flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5',
                          formStatus === 'buka'
                            ? isDark
                              ? 'bg-emerald-500 text-neutral-950 shadow-md'
                              : 'bg-emerald-600 text-white shadow-sm'
                            : isDark
                              ? 'text-neutral-400 hover:text-white hover:bg-white/5'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-white',
                        )}
                      >
                        <span className={cn('h-1.5 w-1.5 rounded-full', formStatus === 'buka' ? (isDark ? 'bg-neutral-950' : 'bg-white') : 'bg-emerald-400 animate-pulse')} />
                        <span>Buka</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormStatus('cuti')}
                        className={cn(
                          'flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5',
                          formStatus === 'cuti'
                            ? isDark
                              ? 'bg-rose-500 text-white shadow-md'
                              : 'bg-rose-600 text-white shadow-sm'
                            : isDark
                              ? 'text-neutral-400 hover:text-white hover:bg-white/5'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-white',
                        )}
                      >
                        <span className={cn('h-1.5 w-1.5 rounded-full', formStatus === 'cuti' ? 'bg-white' : 'bg-rose-400')} />
                        <span>Cuti</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 1. Tanggal Praktik (Date Picker) */}
                <div>
                  <label className={cn('block text-xs font-semibold mb-1', isDark ? 'text-neutral-200' : 'text-slate-700')}>
                    Tanggal Praktik
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCalendarOpen(!isCalendarOpen);
                    }}
                    className={cn(
                      'w-full px-3.5 py-3 rounded-2xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer select-none',
                      isDark
                        ? isCalendarOpen
                          ? 'bg-white/10 text-white'
                          : 'bg-white/5 text-white hover:bg-white/[0.08]'
                        : isCalendarOpen
                          ? 'bg-slate-100/90 text-slate-900'
                          : 'bg-slate-50 text-slate-900 hover:bg-slate-100/70',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'p-1.5 rounded-lg shrink-0 transition-colors',
                          isDark ? 'bg-blue-950/60 text-cyan-400' : 'bg-blue-50 text-blue-600',
                        )}
                      >
                        <Calendar className="h-4 w-4" />
                      </div>
                      <span className="font-semibold">
                        {format(formDate, 'EEEE, d MMMM yyyy', { locale: idLocale })}
                      </span>
                    </div>
                    <ChevronDown className={cn('h-4 w-4 text-slate-400 transition-transform duration-200', isCalendarOpen && 'rotate-180')} />
                  </button>

                  {/* Calendar Card Dropdown */}
                  {isCalendarOpen && (
                    <div
                      className={cn(
                        'mt-2 p-3.5 rounded-2xl transition-all select-none',
                        isDark ? 'bg-white/5 text-white' : 'bg-slate-50 text-slate-900',
                      )}
                    >
                      <div className="flex items-center justify-between mb-3 px-1">
                        <button
                          type="button"
                          aria-label="Bulan sebelumnya"
                          onClick={() => {
                            setCalendarMonth(prev => subMonths(prev, 1));
                          }}
                          className={cn(
                            'p-1.5 rounded-lg transition-colors cursor-pointer',
                            isDark ? 'hover:bg-white/10 text-neutral-300' : 'hover:bg-slate-100 text-slate-600',
                          )}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className={cn('text-xs font-bold capitalize', isDark ? 'text-white' : 'text-slate-900')}>
                          {format(calendarMonth, 'MMMM yyyy', { locale: idLocale })}
                        </span>
                        <button
                          type="button"
                          aria-label="Bulan berikutnya"
                          onClick={() => {
                            setCalendarMonth(prev => addMonths(prev, 1));
                          }}
                          className={cn(
                            'p-1.5 rounded-lg transition-colors cursor-pointer',
                            isDark ? 'hover:bg-white/10 text-neutral-300' : 'hover:bg-slate-100 text-slate-600',
                          )}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center mb-1">
                        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(dayName => (
                          <span
                            key={dayName}
                            className={cn('text-[10px] font-semibold', isDark ? 'text-neutral-500' : 'text-slate-400')}
                          >
                            {dayName}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {eachDayOfInterval({
                          start: startOfWeek(startOfMonth(calendarMonth)),
                          end: endOfWeek(endOfMonth(calendarMonth)),
                        }).map((day) => {
                          const isCurMonth = isSameMonth(day, calendarMonth);
                          const isSelected = isSameDay(day, formDate);
                          const isTodayDate = isSameDay(day, baseToday);

                          return (
                            <button
                              key={day.toISOString()}
                              type="button"
                              onClick={() => {
                                setFormDate(day);
                                setIsCalendarOpen(false);
                              }}
                              className={cn(
                                'h-8 w-8 mx-auto rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer active:scale-95',
                                isSelected
                                  ? isDark
                                    ? 'bg-cyan-500 text-neutral-950 font-bold shadow-md shadow-cyan-500/25'
                                    : 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/25'
                                  : isTodayDate
                                    ? isDark
                                      ? 'bg-cyan-500/15 text-cyan-400 font-bold'
                                      : 'bg-blue-50 text-blue-600 font-bold'
                                    : isCurMonth
                                      ? isDark ? 'text-neutral-200 hover:bg-white/10' : 'text-slate-800 hover:bg-slate-100'
                                      : isDark ? 'text-neutral-600 hover:bg-white/5' : 'text-slate-300 hover:bg-slate-50',
                              )}
                            >
                              {format(day, 'd')}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Sesi Praktik & Jam (Direct 4 Sessions with Per-Slot Room & Poli) */}
                <div className="space-y-1.5 pt-1">
                  <label className={cn('block text-xs font-semibold px-0.5', isDark ? 'text-neutral-200' : 'text-slate-700')}>
                    Sesi Praktik & Jam
                  </label>

                  <div className="space-y-2.5">
                    {sessions.map((session) => {
                      const isExpanded = session.active;
                      return (
                        <div
                          key={session.id}
                          className={cn(
                            'spring-card-transition w-full transform-gpu border',
                            isExpanded
                              ? isDark
                                ? 'bg-white/5 rounded-[22px] border-white/15 p-3.5 shadow-md'
                                : 'bg-slate-50 rounded-[22px] border-slate-200 p-3.5 shadow-sm'
                              : isDark
                                ? 'bg-white/5 hover:bg-white/[0.08] rounded-[20px] px-3.5 py-3 border-transparent'
                                : 'bg-slate-50 hover:bg-slate-100/70 rounded-[20px] px-3.5 py-3 border-transparent',
                          )}
                        >
                          {/* Header Row - w-full & justify-between */}
                          <div
                            className={cn('w-full flex items-center justify-between cursor-pointer', isExpanded ? 'mb-3' : '')}
                            onClick={() => toggleSession(session.id)}
                          >
                            <span
                              className={cn(
                                'font-semibold tracking-tight text-xs sm:text-[14px] transition-colors',
                                isExpanded
                                  ? isDark ? 'text-white' : 'text-slate-900'
                                  : isDark ? 'text-neutral-300' : 'text-slate-700',
                              )}
                            >
                              {session.name}
                            </span>
                            <ToggleSwitch
                              id={`toggle-${session.id}`}
                              active={session.active}
                              isDark={isDark}
                              onChange={val => toggleSession(session.id, val)}
                            />
                          </div>

                          {/* Collapsible Slots Body with Bouncy Spring Expansion */}
                          <div
                            className={cn(
                              'grid spring-grid-transition',
                              isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                            )}
                          >
                            <div className="overflow-hidden space-y-2.5 pt-0.5">
                              {/* Time Slots List */}
                              {session.slots.map((slot, idx) => (
                                <React.Fragment key={slot.id}>
                                  {idx > 0 && (
                                    <div className={cn('border-t border-dashed my-2.5', isDark ? 'border-white/15' : 'border-slate-300')} />
                                  )}
                                  <GsapSlotRow className="space-y-2">
                                    {/* Row 1: From, To, and Remove Button (x) */}
                                    <div className="flex items-center gap-2">
                                      {/* From Selector Trigger */}
                                      <span className={cn('text-[11px] font-medium min-w-[30px]', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                                        From
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => setActiveModalTarget({ type: 'from', sessionId: session.id, slotIndex: idx, currentValue: slot.from })}
                                        className={cn(
                                          'flex-1 flex items-center justify-between border rounded-xl px-2.5 py-1.5 text-xs font-semibold shadow-2xs transition-all cursor-pointer text-left active:scale-[0.98]',
                                          isDark
                                            ? 'bg-white/5 border-white/15 text-white hover:border-cyan-400/60 hover:bg-white/10'
                                            : 'bg-white border-slate-200 text-slate-900 hover:border-blue-600/60 hover:bg-slate-50',
                                        )}
                                      >
                                        <span className="truncate">{slot.from}</span>
                                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                                      </button>

                                      {/* To Selector Trigger */}
                                      <span className={cn('text-[11px] font-medium px-0.5', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                                        To
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => setActiveModalTarget({ type: 'to', sessionId: session.id, slotIndex: idx, currentValue: slot.to })}
                                        className={cn(
                                          'flex-1 flex items-center justify-between border rounded-xl px-2.5 py-1.5 text-xs font-semibold shadow-2xs transition-all cursor-pointer text-left active:scale-[0.98]',
                                          isDark
                                            ? 'bg-white/5 border-white/15 text-white hover:border-cyan-400/60 hover:bg-white/10'
                                            : 'bg-white border-slate-200 text-slate-900 hover:border-blue-600/60 hover:bg-slate-50',
                                        )}
                                      >
                                        <span className="truncate">{slot.to}</span>
                                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                                      </button>

                                      {/* Remove Button (x) */}
                                      <button
                                        type="button"
                                        id={`remove-${session.id}-${idx}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeTimeSlot(session.id, idx);
                                        }}
                                        className={cn(
                                          'w-7 h-7 shrink-0 flex items-center justify-center rounded-lg transition-transform active:scale-75 cursor-pointer',
                                          isDark
                                            ? 'text-neutral-400 hover:text-white hover:bg-white/10'
                                            : 'text-slate-400 hover:text-slate-800 hover:bg-slate-200/70',
                                        )}
                                        title="Hapus slot waktu"
                                      >
                                        <Icons.Cross />
                                      </button>
                                    </div>

                                    {/* Row 2: Ruang Praktik & Poli Spesialis button triggers */}
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className={cn('block text-[10.5px] font-medium mb-1', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                                          Ruang Praktik
                                        </label>
                                        <button
                                          type="button"
                                          onClick={() => setActiveModalTarget({ type: 'room', sessionId: session.id, slotIndex: idx, currentValue: slot.room })}
                                          className={cn(
                                            'w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-left active:scale-[0.98]',
                                            isDark
                                              ? 'bg-white/5 border-white/15 text-white hover:border-cyan-400/60 hover:bg-white/10'
                                              : 'bg-white border-slate-200 text-slate-900 hover:border-blue-600/60 hover:bg-slate-50',
                                          )}
                                        >
                                          <span className="truncate">{slot.room || 'Pilih Ruang'}</span>
                                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                                        </button>
                                      </div>

                                      <div>
                                        <label className={cn('block text-[10.5px] font-medium mb-1', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                                          Poli / Spesialisasi
                                        </label>
                                        <button
                                          type="button"
                                          onClick={() => setActiveModalTarget({ type: 'poli', sessionId: session.id, slotIndex: idx, currentValue: slot.poli })}
                                          className={cn(
                                            'w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-left active:scale-[0.98]',
                                            isDark
                                              ? 'bg-white/5 border-white/15 text-white hover:border-cyan-400/60 hover:bg-white/10'
                                              : 'bg-white border-slate-200 text-slate-900 hover:border-blue-600/60 hover:bg-slate-50',
                                          )}
                                        >
                                          <span className="truncate">{slot.poli || 'Pilih Poli'}</span>
                                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                                        </button>
                                      </div>
                                    </div>
                                  </GsapSlotRow>
                                </React.Fragment>
                              ))}

                              {/* + Add More Button */}
                              <button
                                type="button"
                                id={`add-more-${session.id}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addTimeSlot(session.id);
                                }}
                                className={cn(
                                  'w-full py-2.5 mt-1 rounded-xl active:scale-[0.97] font-medium text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border',
                                  isDark
                                    ? 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200',
                                )}
                              >
                                <Icons.Plus />
                                <span>Add More</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Submit / Cancel / Delete Actions */}
                <div className="flex items-center gap-2 pt-3">
                  {editingSchedule && (
                    <button
                      type="button"
                      aria-label="Hapus Jadwal"
                      onClick={() => {
                        handleDeleteSchedule(editingSchedule.id);
                        triggerCloseDrawer();
                      }}
                      className={cn(
                        'p-3 rounded-xl border transition-all cursor-pointer shrink-0',
                        isDark
                          ? 'border-rose-500/30 text-rose-400 hover:bg-rose-500/15'
                          : 'border-rose-200 text-rose-600 hover:bg-rose-50',
                      )}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={triggerCloseDrawer}
                    className={cn(
                      'flex-1 py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer',
                      isDark
                        ? 'border-white/15 text-neutral-300 hover:bg-white/10'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-100',
                    )}
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer active:scale-98"
                  >
                    {editingSchedule ? 'Simpan Perubahan' : 'Tambah Jadwal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* 7. Detail Sheet Drawer (Detail Sesi Praktik - Read Only) */}
      {isDetailDrawerOpen && detailSchedule && (
        <>
          <div
            onClick={triggerCloseDetailDrawer}
            className="absolute -inset-10 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />

          <div
            ref={detailDrawerRef}
            className={cn(
              'absolute inset-x-0 bottom-0 z-50 h-auto max-h-[85%] rounded-t-[36px] border-t p-5 pb-28 sm:pb-32 shadow-2xl flex flex-col justify-between backdrop-blur-2xl will-change-transform',
              isDark
                ? 'bg-[#0a0e1a] border-white/15 text-white shadow-black/80'
                : 'bg-white border-slate-200 text-slate-900 shadow-slate-400/40',
            )}
          >
            {/* Drag Handle Bar */}
            <div className="pb-1 flex justify-center shrink-0">
              <div className={cn('w-12 h-1.5 rounded-full', isDark ? 'bg-white/20' : 'bg-slate-300')} />
            </div>

            {/* Header with Title and Close Button */}
            <div className={cn('flex justify-between items-center py-2 border-b shrink-0', isDark ? 'border-white/10' : 'border-slate-200')}>
              <h3 className={cn('text-base font-bold tracking-tight', isDark ? 'text-white' : 'text-slate-950')}>
                Detail Sesi Praktik
              </h3>
              <button
                type="button"
                aria-label="Tutup Detail"
                onClick={triggerCloseDetailDrawer}
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center transition-all cursor-pointer',
                  isDark ? 'bg-white/10 text-neutral-300 hover:bg-white/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                )}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Detail Content Body */}
            <div className="overflow-y-auto py-3 flex flex-col gap-4 no-scrollbar">
              {/* Title & Date Heading + Status Badge */}
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h4 className={cn('text-xl font-black tracking-tight leading-tight', isDark ? 'text-white' : 'text-slate-950')}>
                    {detailSchedule.title}
                  </h4>
                  <p className={cn('text-xs font-medium mt-0.5', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                    {detailSchedule.date}
                  </p>
                </div>
                <span
                  className={cn(
                    'px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 flex items-center gap-1.5',
                    isDayCuti
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : detailSchedule.badgeVariant === 'success'
                        ? isDark ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : detailSchedule.badgeVariant === 'warning'
                          ? isDark ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          : isDark ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-50 text-blue-700 border border-blue-200',
                  )}
                >
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      isDayCuti
                        ? 'bg-amber-400'
                        : detailSchedule.badgeVariant === 'success'
                          ? 'bg-emerald-500 animate-pulse'
                          : detailSchedule.badgeVariant === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-blue-500',
                    )}
                  />
                  <span>{isDayCuti ? 'Cuti' : detailSchedule.badge}</span>
                </span>
              </div>

              {/* Specification Records List */}
              <div
                className={cn(
                  'divide-y text-xs',
                  isDark ? 'divide-white/10 text-neutral-200' : 'divide-slate-100 text-slate-900',
                )}
              >
                {/* Row 1: Sesi Praktik */}
                <div className="flex items-center justify-between py-3">
                  <span className={cn('font-medium', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                    Sesi Praktik
                  </span>
                  <span className={cn('font-bold', isDark ? 'text-white' : 'text-slate-950')}>
                    {detailSchedule.sessionType ? `Sesi ${detailSchedule.sessionType}` : detailSchedule.title}
                  </span>
                </div>

                {/* Row 2: Jam Praktik */}
                <div className="flex items-center justify-between py-3">
                  <span className={cn('font-medium', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                    Jam Praktik
                  </span>
                  <span className={cn('font-bold', isDark ? 'text-white' : 'text-slate-950')}>
                    {detailSchedule.time}
                  </span>
                </div>

                {/* Row 3: Ruang Praktik */}
                <div className="flex items-center justify-between py-3">
                  <span className={cn('font-medium', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                    Ruang Praktik
                  </span>
                  <span className={cn('font-bold', isDark ? 'text-white' : 'text-slate-950')}>
                    {detailSchedule.room}
                  </span>
                </div>

                {/* Row 4: Poli / Layanan */}
                <div className="flex items-center justify-between py-3">
                  <span className={cn('font-medium', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                    Poli / Spesialisasi
                  </span>
                  <span className={cn('font-bold', isDark ? 'text-white' : 'text-slate-950')}>
                    {detailSchedule.poli}
                  </span>
                </div>

                {/* Row 5: Total Pasien Booking */}
                <div className="flex items-center justify-between py-3">
                  <span className={cn('font-medium', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                    Total Pasien Booking
                  </span>
                  <span className={cn('font-bold', isDark ? 'text-cyan-400' : 'text-blue-600')}>
                    {detailSchedule.bookedPatients?.length ?? 0} Pasien
                  </span>
                </div>
              </div>

              {/* Text-based Trigger Button with Stacked Avatars (Point of view: Daftar Pasien Booking) */}
              <div className="py-2.5 border-t border-b" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsPatientListDrawerOpen(true);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between py-1 text-xs font-bold transition-all cursor-pointer group',
                    isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700',
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Stacked Circular Real Avatars */}
                    <div className="flex items-center -space-x-2 shrink-0">
                      {detailSchedule.bookedPatients && detailSchedule.bookedPatients.length > 0 ? (
                        detailSchedule.bookedPatients.slice(0, 3).map((p, idx) => (
                          <img
                            key={p.id || idx}
                            src={p.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                            alt={p.patientName}
                            className={cn(
                              'h-6 w-6 rounded-full object-cover border-2 shadow-xs',
                              isDark ? 'border-[#0a0e1a]' : 'border-white',
                            )}
                          />
                        ))
                      ) : (
                        <div className={cn('h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2', isDark ? 'bg-white/10 border-[#0a0e1a] text-white' : 'bg-slate-200 border-white text-slate-700')}>
                          0
                        </div>
                      )}
                    </div>
                    <span className="group-hover:underline">Lihat Pasien Booking ({detailSchedule.bookedPatients?.length ?? 0} Pasien)</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Action Button: Ubah Sesi Praktik */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    triggerCloseDetailDrawer();
                    handleOpenEditDrawer(detailSchedule);
                  }}
                  className={cn(
                    'w-full py-3 rounded-2xl text-xs font-bold shadow-lg transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2',
                    isDark
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-neutral-950 shadow-cyan-500/20'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30',
                  )}
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Ubah Sesi Praktik</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 7b. Patient List Sheet Drawer (Daftar Pasien Booking - Liquid Glass Cards) */}
      {isPatientListDrawerOpen && detailSchedule && (
        <>
          <div
            onClick={triggerClosePatientListDrawer}
            className="absolute -inset-10 z-55 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />

          <div
            ref={patientListDrawerRef}
            className={cn(
              'absolute inset-x-0 bottom-0 z-55 h-auto max-h-[88%] rounded-t-[36px] border-t p-5 pb-28 sm:pb-32 shadow-2xl flex flex-col justify-between backdrop-blur-2xl will-change-transform',
              isDark
                ? 'bg-[#0a0e1a] border-white/15 text-white shadow-black/80'
                : 'bg-white border-slate-200 text-slate-900 shadow-slate-400/40',
            )}
          >
            {/* Drag Handle Bar */}
            <div className="pb-1 flex justify-center shrink-0">
              <div className={cn('w-12 h-1.5 rounded-full', isDark ? 'bg-white/20' : 'bg-slate-300')} />
            </div>

            {/* Header with Back Button, Title, and Close Button */}
            <div className={cn('flex justify-between items-center py-2 border-b shrink-0', isDark ? 'border-white/10' : 'border-slate-200')}>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Kembali ke Detail Sesi"
                  onClick={triggerClosePatientListDrawer}
                  className={cn(
                    'p-1.5 rounded-full transition-all cursor-pointer',
                    isDark ? 'text-neutral-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100',
                  )}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div>
                  <h3 className={cn('text-sm font-bold tracking-tight', isDark ? 'text-white' : 'text-slate-950')}>
                    Daftar Pasien Booking
                  </h3>
                  <p className={cn('text-[11px]', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                    {detailSchedule.title} • {detailSchedule.date}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Tutup"
                onClick={triggerClosePatientListDrawer}
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center transition-all cursor-pointer',
                  isDark ? 'bg-white/10 text-neutral-300 hover:bg-white/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                )}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Patient Liquid Glass Cards List (Exposing Name, Real Avatar, Age, and Time) */}
            <div className="overflow-y-auto py-3.5 flex flex-col gap-3.5 no-scrollbar max-h-96">
              {detailSchedule.bookedPatients && detailSchedule.bookedPatients.length > 0 ? (
                detailSchedule.bookedPatients.map((patient: BookedPatient, pIdx) => {
                  const patientNatureBg = NATURE_IMAGES_POOL[pIdx % NATURE_IMAGES_POOL.length];
                  return (
                    <div
                      key={patient.id || pIdx}
                      className="relative w-full h-[270px] rounded-[28px] overflow-hidden shadow-xl bg-slate-900 select-none border border-black/10 transition-all duration-300 active:scale-[0.99] isolate [transform:translateZ(0)] shrink-0"
                      style={{
                        clipPath: 'inset(0 round 28px)',
                        WebkitClipPath: 'inset(0 round 28px)',
                      }}
                    >
                      {/* Layer 1: Crisp Background Photo */}
                      <img
                        src={patientNatureBg}
                        alt={patient.patientName}
                        className="absolute inset-0 w-full h-full object-cover object-center rounded-[28px]"
                      />

                      {/* Layer 2: Real-time GPU Liquid Glass */}
                      <div
                        className="absolute inset-0 pointer-events-none z-10 rounded-[28px]"
                        style={{
                          backdropFilter: 'blur(20px) saturate(160%)',
                          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 35%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0) 75%)',
                          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 35%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0) 75%)',
                        }}
                      />

                      {/* Layer 3: High-Contrast Ambient Gradient */}
                      <div
                        className="absolute inset-0 pointer-events-none z-15 rounded-[28px]"
                        style={{
                          background: 'linear-gradient(to top, rgba(12, 20, 15, 0.85) 0%, rgba(12, 20, 15, 0.4) 40%, rgba(12, 20, 15, 0) 70%)',
                        }}
                      />

                      {/* Top Badge: Status (Top-Left) */}
                      <div className="absolute top-3.5 left-3.5 z-30">
                        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-md border border-white/90">
                          <span
                            className={cn(
                              'h-2 w-2 rounded-full',
                              patient.badgeVariant === 'success'
                                ? 'bg-emerald-500 animate-pulse'
                                : patient.badgeVariant === 'warning'
                                  ? 'bg-amber-500'
                                  : 'bg-cyan-500',
                            )}
                          />
                          <span className="text-[11px] font-bold text-gray-900 tracking-tight">
                            {patient.badge}
                          </span>
                        </div>
                      </div>

                      {/* Top Badge: Queue Number (Top-Right) */}
                      <div className="absolute top-3.5 right-3.5 z-30">
                        <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md border border-white/20 text-white">
                          <span className="text-[11px] font-bold tracking-tight">
                            Antrean {patient.queueNumber}
                          </span>
                        </div>
                      </div>

                      {/* Overlay Content: Avatar, Name, Age, Time, Detail Button */}
                      <div className="absolute bottom-0 inset-x-0 z-20 p-4 pt-5 text-white">
                        {/* Avatar & Name & Age Row */}
                        <div className="flex items-center gap-3 mb-2.5">
                          <img
                            src={patient.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                            alt={patient.patientName}
                            className="h-11 w-11 rounded-full object-cover border-2 border-white/90 shadow-md shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white text-[19px] font-bold tracking-tight leading-tight truncate">
                              {patient.patientName}
                            </h4>
                            <p className="text-white/80 text-[12px] font-medium leading-snug">
                              Usia: {patient.patientAge}
                            </p>
                          </div>
                        </div>

                        {/* Time Slot Row */}
                        <div className="flex items-center gap-1.5 text-white text-[12.5px] font-semibold mb-2.5">
                          <Clock className="w-3.5 h-3.5 text-white" />
                          <span>{patient.timeSlot}</span>
                        </div>

                        {/* Glass Line Separator */}
                        <div className="w-full h-[1px] bg-white/20 mb-2.5" />

                        {/* Detail Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setDetailPatient(patient);
                            setIsPatientDetailModalOpen(true);
                          }}
                          className="w-full py-2.5 rounded-2xl bg-white hover:bg-white/90 text-slate-950 font-bold text-xs shadow-lg transition-all text-center cursor-pointer active:scale-[0.98]"
                        >
                          Detail Pasien
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center">
                  <p className={cn('text-xs', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                    Belum ada pasien yang melakukan booking pada sesi ini.
                  </p>
                </div>
              )}
            </div>

            {/* Back Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={triggerClosePatientListDrawer}
                className={cn(
                  'w-full py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer',
                  isDark
                    ? 'border-white/15 text-neutral-300 hover:bg-white/10'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-100',
                )}
              >
                Kembali ke Detail Sesi
              </button>
            </div>
          </div>
        </>
      )}

      {/* 7c. Single Patient Detail Modal Sheet (Keluhan & Rekam Pasien) */}
      {isPatientDetailModalOpen && detailPatient && (
        <>
          <div
            onClick={triggerClosePatientDetailModal}
            className="absolute -inset-10 z-60 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />

          <div
            ref={patientDetailModalRef}
            className={cn(
              'absolute inset-x-0 bottom-0 z-60 h-auto max-h-[88%] rounded-t-[36px] border-t p-5 pb-28 sm:pb-32 shadow-2xl flex flex-col justify-between backdrop-blur-2xl will-change-transform',
              isDark
                ? 'bg-[#0a0e1a] border-white/15 text-white shadow-black/80'
                : 'bg-white border-slate-200 text-slate-900 shadow-slate-400/40',
            )}
          >
            {/* Drag Handle Bar */}
            <div className="pb-1 flex justify-center shrink-0">
              <div className={cn('w-12 h-1.5 rounded-full', isDark ? 'bg-white/20' : 'bg-slate-300')} />
            </div>

            {/* Header with Title and Close Button */}
            <div className={cn('flex justify-between items-center py-2 border-b shrink-0', isDark ? 'border-white/10' : 'border-slate-200')}>
              <h3 className={cn('text-base font-bold tracking-tight', isDark ? 'text-white' : 'text-slate-950')}>
                Detail Rekam Pasien
              </h3>
              <button
                type="button"
                aria-label="Tutup Detail Pasien"
                onClick={triggerClosePatientDetailModal}
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center transition-all cursor-pointer',
                  isDark ? 'bg-white/10 text-neutral-300 hover:bg-white/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                )}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Detail Patient Body */}
            <div className="overflow-y-auto py-3 flex flex-col gap-4 no-scrollbar">
              {/* Profile Card Header with Real Avatar */}
              <div className="flex flex-col items-center text-center gap-2 pt-1 pb-2">
                <img
                  src={detailPatient.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop'}
                  alt={detailPatient.patientName}
                  className="h-16 w-16 rounded-full object-cover border-2 border-blue-500 shadow-lg"
                />
                <div>
                  <h4 className={cn('text-lg font-black tracking-tight leading-tight', isDark ? 'text-white' : 'text-slate-950')}>
                    {detailPatient.patientName}
                  </h4>
                  <p className={cn('text-xs font-semibold mt-0.5', isDark ? 'text-cyan-400' : 'text-blue-600')}>
                    {detailPatient.patientRm} • Usia {detailPatient.patientAge}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-[11px] font-bold',
                      isDark ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-blue-100 text-blue-800',
                    )}
                  >
                    Antrean {detailPatient.queueNumber}
                  </span>
                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-[11px] font-bold',
                      detailPatient.badgeVariant === 'success'
                        ? isDark ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isDark ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-50 text-blue-700 border border-blue-200',
                    )}
                  >
                    {detailPatient.badge}
                  </span>
                </div>
              </div>

              {/* Patient Specification Table */}
              <div
                className={cn(
                  'divide-y text-xs',
                  isDark ? 'divide-white/10 text-neutral-200' : 'divide-slate-100 text-slate-900',
                )}
              >
                {/* Jam Booking */}
                <div className="flex items-center justify-between py-3">
                  <span className={cn('font-medium', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                    Waktu / Jam Booking
                  </span>
                  <span className={cn('font-bold', isDark ? 'text-white' : 'text-slate-950')}>
                    {detailPatient.timeSlot}
                  </span>
                </div>

                {/* Sesi Praktik */}
                {detailSchedule && (
                  <div className="flex items-center justify-between py-3">
                    <span className={cn('font-medium', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                      Sesi Praktik
                    </span>
                    <span className={cn('font-bold', isDark ? 'text-white' : 'text-slate-950')}>
                      {detailSchedule.title} ({detailSchedule.poli})
                    </span>
                  </div>
                )}

                {/* Ruang Praktik */}
                {detailSchedule && (
                  <div className="flex items-center justify-between py-3">
                    <span className={cn('font-medium', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                      Ruang Praktik
                    </span>
                    <span className={cn('font-bold', isDark ? 'text-white' : 'text-slate-950')}>
                      {detailSchedule.room}
                    </span>
                  </div>
                )}

                {/* Pendamping */}
                {detailPatient.patientGuardian && (
                  <div className="flex items-center justify-between py-3">
                    <span className={cn('font-medium', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                      Nama Pendamping
                    </span>
                    <span className={cn('font-bold', isDark ? 'text-white' : 'text-slate-950')}>
                      {detailPatient.patientGuardian}
                    </span>
                  </div>
                )}

                {/* Keluhan Medis (Full detailed complaint inside modal) */}
                <div className="flex flex-col gap-1.5 py-3">
                  <span className={cn('font-medium', isDark ? 'text-neutral-400' : 'text-slate-500')}>
                    Keluhan & Catatan Medis Pasien
                  </span>
                  <p className={cn('font-semibold text-xs leading-relaxed p-3 rounded-xl border', isDark ? 'bg-white/5 border-white/10 text-neutral-200' : 'bg-slate-50 border-slate-200 text-slate-800')}>
                    {detailPatient.patientComplaint || 'Tidak ada catatan keluhan khusus.'}
                  </p>
                </div>
              </div>

              {/* Action Button: Tutup */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={triggerClosePatientDetailModal}
                  className={cn(
                    'w-full py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer',
                    isDark
                      ? 'border-white/15 text-neutral-300 hover:bg-white/10'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-100',
                  )}
                >
                  Tutup Detail Pasien
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 8. Doc Schedule Super Big Monthly Calendar Drawer */}
      {isDocScheduleDrawerOpen && (
        <>
          {/* Full-Bleed Flat Backdrop Overlay */}
          <div
            onClick={triggerCloseDocScheduleDrawer}
            className="absolute -inset-10 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />

          {/* Super Big Calendar Drawer Container */}
          <div
            ref={docScheduleDrawerRef}
            className={cn(
              'absolute inset-x-0 bottom-0 z-50 h-auto max-h-[90%] rounded-t-[36px] border-t p-5 pb-28 sm:pb-32 shadow-2xl flex flex-col justify-between backdrop-blur-2xl will-change-transform',
              isDark
                ? 'bg-[#0a0e1a] border-white/15 text-white shadow-black/80'
                : 'bg-white border-slate-200 text-slate-900 shadow-xl',
            )}
          >
            {/* Drag Handle Bar */}
            <div className="pb-1 flex justify-center shrink-0">
              <div className={cn('w-12 h-1.5 rounded-full', isDark ? 'bg-white/20' : 'bg-slate-300')} />
            </div>

            {/* Fluid Header with Month Navigation & Close Button */}
            <div className={cn('flex items-center justify-between py-2 border-b shrink-0 mb-3 gap-2', isDark ? 'border-white/10' : 'border-slate-200')}>
              <div className="flex-1 flex items-center justify-between">
                <button
                  type="button"
                  aria-label="Bulan sebelumnya"
                  onClick={() => {
                    setDocScheduleMonth(prev => subMonths(prev, 1));
                  }}
                  className={cn(
                    'p-1.5 rounded-lg transition-colors cursor-pointer',
                    isDark ? 'hover:bg-white/10 text-neutral-300' : 'hover:bg-slate-100 text-slate-600',
                  )}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className={cn('text-sm font-bold capitalize text-center', isDark ? 'text-white' : 'text-slate-900')}>
                  {format(docScheduleMonth, 'MMMM yyyy', { locale: idLocale })}
                </span>
                <button
                  type="button"
                  aria-label="Bulan selanjutnya"
                  onClick={() => {
                    setDocScheduleMonth(prev => addMonths(prev, 1));
                  }}
                  className={cn(
                    'p-1.5 rounded-lg transition-colors cursor-pointer',
                    isDark ? 'hover:bg-white/10 text-neutral-300' : 'hover:bg-slate-100 text-slate-600',
                  )}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className={cn('h-5 w-px mx-1', isDark ? 'bg-white/15' : 'bg-slate-200')} />

              <button
                type="button"
                aria-label="Tutup Kalender"
                onClick={triggerCloseDocScheduleDrawer}
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0',
                  isDark ? 'bg-white/10 text-neutral-300 hover:bg-white/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                )}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Big Month Calendar Grid */}
            <div className="overflow-y-auto no-scrollbar flex flex-col gap-2">
              {/* Day of week labels */}
              <div className="grid grid-cols-7 gap-1 text-center mb-1">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day, idx) => (
                  <div
                    key={day}
                    className={cn(
                      'text-[10px] font-bold py-1',
                      idx === 0 ? 'text-rose-500' : isDark ? 'text-neutral-400' : 'text-slate-500',
                    )}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1">
                {eachDayOfInterval({
                  start: startOfWeek(startOfMonth(docScheduleMonth)),
                  end: endOfWeek(endOfMonth(docScheduleMonth)),
                }).map((day) => {
                  const isCurMonth = isSameMonth(day, docScheduleMonth);
                  const isSelected = isSameDay(day, selectedDate);
                  const isTodayDate = isSameDay(day, baseToday);
                  const statusInfo = getDayScheduleStatus(day);

                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      disabled={statusInfo.disabled || !isCurMonth}
                      onClick={() => {
                        setSelectedDate(day);
                        triggerCloseDocScheduleDrawer();
                      }}
                      className={cn(
                        'h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all select-none',
                        !isCurMonth && 'opacity-0 pointer-events-none',
                        isCurMonth && statusInfo.status === 'past' && 'opacity-30 cursor-not-allowed',
                        isCurMonth && statusInfo.status !== 'past' && 'cursor-pointer hover:bg-white/5 active:scale-95',
                        isSelected && (isDark ? 'ring-2 ring-cyan-400 bg-white/10' : 'ring-2 ring-blue-600 bg-blue-50/80'),
                        isCurMonth && !isSelected && statusInfo.status === 'today' && (isDark ? 'bg-white/5' : 'bg-slate-100/70'),
                      )}
                    >
                      {/* Day number */}
                      <span
                        className={cn(
                          'text-xs font-bold leading-none',
                          isCurMonth && isTodayDate && (isDark ? 'text-cyan-400 font-extrabold' : 'text-blue-600 font-extrabold'),
                          isCurMonth && !isTodayDate && (isDark ? 'text-white' : 'text-slate-900'),
                        )}
                      >
                        {format(day, 'd')}
                      </span>

                      {/* Dot Indicator */}
                      {isCurMonth && statusInfo.status !== 'past' && (
                        <span
                          className={cn(
                            'h-1.5 w-1.5 rounded-full shrink-0',
                            statusInfo.status === 'today' && (isDark ? 'bg-cyan-400' : 'bg-blue-600'),
                            statusInfo.status === 'upcoming' && 'bg-emerald-500',
                            statusInfo.status === 'leave' && 'bg-amber-500',
                            statusInfo.status === 'closed' && (isDark ? 'bg-neutral-600' : 'bg-slate-300'),
                          )}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Status Legend */}
              <div className={cn('flex flex-wrap items-center justify-between gap-2 pt-3 mt-2 border-t', isDark ? 'border-white/10 text-neutral-300' : 'border-slate-200 text-slate-600')}>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>Buka / Terjadwal</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold">
                  <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                  <span>Cuti</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold">
                  <span className={cn('h-2 w-2 rounded-full shrink-0', isDark ? 'bg-neutral-600' : 'bg-slate-300')} />
                  <span>Tutup</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold">
                  <span className={cn('h-2 w-2 rounded-full shrink-0', isDark ? 'bg-cyan-400' : 'bg-blue-600')} />
                  <span>Hari Ini</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 7. Interactive Selection Modal for Time, Room, and Polyclinic */}
      {activeModalTarget && (
        <SelectionModal
          isOpen={Boolean(activeModalTarget)}
          onClose={() => setActiveModalTarget(null)}
          title={
            activeModalTarget.type === 'from'
              ? 'Pilih Waktu Mulai (From)'
              : activeModalTarget.type === 'to'
                ? 'Pilih Waktu Selesai (To)'
                : activeModalTarget.type === 'room'
                  ? 'Pilih Ruang Praktik'
                  : 'Pilih Poli / Spesialisasi'
          }
          subtitle={
            activeModalTarget.type === 'from' || activeModalTarget.type === 'to'
              ? 'Pilih jam dari daftar atau ketik manual'
              : activeModalTarget.type === 'room'
                ? 'Pilih ruangan praktik dokter'
                : 'Pilih poliklinik atau bidang spesialisasi'
          }
          currentValue={activeModalTarget.currentValue}
          options={
            activeModalTarget.type === 'from' || activeModalTarget.type === 'to'
              ? TIME_OPTIONS
              : activeModalTarget.type === 'room'
                ? DEFAULT_ROOM_OPTIONS
                : DEFAULT_POLI_OPTIONS
          }
          disabledOptions={
            activeModalTarget.type === 'from' || activeModalTarget.type === 'to'
              ? Array.from(
                  new Set([
                    ...OCCUPIED_TIME_OPTIONS,
                    ...sessions.flatMap(sess =>
                      sess.active
                        ? sess.slots
                            .filter((_, sIdx) => !(sess.id === activeModalTarget.sessionId && sIdx === activeModalTarget.slotIndex))
                            .flatMap(s => [s.from, s.to].filter(Boolean))
                        : [],
                    ),
                  ]),
                )
              : activeModalTarget.type === 'room'
                ? Array.from(
                    new Set([
                      ...OCCUPIED_ROOM_OPTIONS,
                      ...sessions.flatMap(sess =>
                        sess.active
                          ? sess.slots
                              .filter((_, sIdx) => !(sess.id === activeModalTarget.sessionId && sIdx === activeModalTarget.slotIndex))
                              .map(s => s.room)
                              .filter(Boolean)
                          : [],
                      ),
                    ]),
                  )
                : []
          }
          onSelect={(val) => {
            updateTimeSlot(activeModalTarget.sessionId, activeModalTarget.slotIndex, activeModalTarget.type, val);
          }}
          isDark={isDark}
        />
      )}
    </div>
  );
}
