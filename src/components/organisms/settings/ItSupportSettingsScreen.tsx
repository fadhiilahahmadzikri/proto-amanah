'use client';

import { gsap } from 'gsap';
import { ChevronRight } from 'lucide-react';
import React from 'react';
import { ScreenHeader } from '@/components/molecules/ScreenHeader';
import { ItChatFullScreen } from '@/components/organisms/settings/ItChatFullScreen';
import { ItFaqDetailScreen } from '@/components/organisms/settings/ItFaqDetailScreen';
import type { FaqItem } from '@/components/organisms/settings/ItFaqDetailScreen';
import { ItMyReportsScreen } from '@/components/organisms/settings/ItMyReportsScreen';
import type { ReportItem } from '@/components/organisms/settings/ItMyReportsScreen';
import {
  SettingInfoRow,
  SettingSection,
} from '@/components/organisms/settings/SettingsComponents';
import { cn } from '@/lib/utils';

const FAQ_LIST: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Presensi & scanner',
    title: 'Kamera scanner presensi tidak merespons atau blank hitam',
    solution: [
      'Pastikan izin akses kamera pada peramban/aplikasi sudah diberikan (Allow Camera).',
      'Tutup paksa aplikasi dan buka kembali untuk me-refresh driver kamera.',
      'Jika kamera masih blank, gunakan fitur input PIN presensi manual sebagai alternatif cepat.',
      'Hubungi tim IT jika kendala berulang pada tablet atau perangkat poli.',
    ],
  },
  {
    id: 'faq-2',
    category: 'Lokasi & GPS',
    title: 'Muncul pesan error "Di luar radius presensi poliklinik"',
    solution: [
      'Pastikan fitur GPS/Location pada ponsel dalam status aktif dengan akurasi tinggi (High Accuracy).',
      'Pastikan Anda berada dalam radius maksimal 50 meter dari gedung poliklinik RS Amanah Sehat.',
      'Hubungi tim IT untuk kalibrasi ulang koordinat access point jika Anda berada di dalam ruangan beton.',
    ],
  },
  {
    id: 'faq-3',
    category: 'SIMRS & jadwal',
    title: 'Jadwal praktik atau kuota pasien belum tersinkronisasi',
    solution: [
      'Buka menu Data & penyimpanan lalu lakukan sinkronisasi data SIMRS secara manual.',
      'Pastikan koneksi jaringan Wi-Fi RS terhubung ke SSID Medis resmi.',
      'Periksa apakah ada perubahan shift yang belum disetujui pihak manajemen pelayanan medis.',
    ],
  },
  {
    id: 'faq-4',
    category: 'Akun & keamanan',
    title: 'Cara reset PIN presensi mandiri jika lupa',
    solution: [
      'Buka halaman pengaturan lalu pilih menu Privasi & keamanan.',
      'Pilih opsi Ubah PIN presensi dokter.',
      'Masukkan 6 digit angka PIN baru lalu tekan Simpan.',
    ],
  },
];

const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep-1',
    ticketNumber: 'TK-2026-0819',
    title: 'Scanner QR poliklinik anak lambat membaca kode',
    date: 'Kemarin, 14:20 WIB',
    status: 'proses',
    technicianNote: 'Teknisi sedang melakukan pengecekan lensa scanner dan firmware bridge SIMRS.',
  },
];

/**
 * Sub-screen container switcher for IT Support.
 * @param props Component properties.
 * @returns React node for active subscreen.
 */
function ItSubScreenContainer(props: {
  activeSubScreen: 'faq' | 'reports' | 'chat';
  selectedFaq: FaqItem | null;
  reports: ReportItem[];
  theme?: 'dark' | 'light';
  onBack: () => void;
  onOpenChat: () => void;
  onNewTicket: (ticket: { title: string; date: string }) => void;
}) {
  if (props.activeSubScreen === 'faq' && props.selectedFaq) {
    return (
      <ItFaqDetailScreen
        faq={props.selectedFaq}
        theme={props.theme}
        onBack={props.onBack}
        onOpenChat={props.onOpenChat}
      />
    );
  }

  if (props.activeSubScreen === 'reports') {
    return (
      <ItMyReportsScreen
        reports={props.reports}
        theme={props.theme}
        onBack={props.onBack}
        onOpenChat={props.onOpenChat}
      />
    );
  }

  return (
    <ItChatFullScreen
      theme={props.theme}
      onBack={props.onBack}
      onTicketCreated={props.onNewTicket}
    />
  );
}

/**
 * Main IT support screen with FAQ directory, My Reports section, and Full-Screen IT Chat.
 * @param props Component properties.
 * @returns React node for the IT support screen.
 */
export function ItSupportSettingsScreen(props: {
  theme?: 'dark' | 'light';
  onBack?: () => void;
  className?: string;
}) {
  const isDark = props.theme === 'dark';

  const [activeSubScreen, setActiveSubScreen] = React.useState<'faq' | 'reports' | 'chat' | null>(null);
  const [selectedFaq, setSelectedFaq] = React.useState<FaqItem | null>(null);
  const [reports, setReports] = React.useState<ReportItem[]>(INITIAL_REPORTS);

  const subScreenRef = React.useRef<HTMLDivElement>(null);
  const isSubScreenClosingRef = React.useRef(false);

  React.useEffect(() => {
    if (activeSubScreen && subScreenRef.current) {
      gsap.fromTo(
        subScreenRef.current,
        { x: '100%', opacity: 0.95 },
        { x: '0%', opacity: 1, duration: 0.3, ease: 'power3.out' },
      );
    }
  }, [activeSubScreen]);

  const handleBackFromSubScreen = () => {
    if (isSubScreenClosingRef.current || !subScreenRef.current) {
      setActiveSubScreen(null);
      setSelectedFaq(null);
      return;
    }
    isSubScreenClosingRef.current = true;

    gsap.to(subScreenRef.current, {
      x: '100%',
      opacity: 0.9,
      duration: 0.28,
      ease: 'power3.in',
      onComplete: () => {
        setActiveSubScreen(null);
        setSelectedFaq(null);
        isSubScreenClosingRef.current = false;
      },
    });
  };

  const handleOpenFaq = (faq: FaqItem) => {
    setSelectedFaq(faq);
    setActiveSubScreen('faq');
  };

  const handleNewTicketFromChat = (ticket: { title: string; date: string }) => {
    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      ticketNumber: `TK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: ticket.title,
      date: ticket.date,
      status: 'proses',
      technicianNote: 'Laporan baru dibuat via live chat IT. Teknisi sedang memverifikasi kendala.',
    };
    setReports(prev => [newReport, ...prev]);
  };

  const activeReportsCount = reports.filter(r => r.status === 'proses').length;
  let reportBadgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
  if (activeReportsCount > 0) {
    reportBadgeStyle = isDark
      ? 'bg-amber-950/40 text-amber-300 border-amber-500/30'
      : 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (isDark) {
    reportBadgeStyle = 'bg-white/10 text-neutral-300 border-white/10';
  }

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden select-text flex flex-col',
        isDark ? 'bg-[#0a0e1a] text-white' : 'bg-[#f8faff] text-slate-900',
        props.className,
      )}
    >
      <ScreenHeader
        title="Bantuan teknisi IT"
        onBack={props.onBack}
        theme={props.theme}
      />

      <div className="flex-1 min-h-0 w-full overflow-y-auto no-scrollbar px-5 pt-3 pb-6 flex flex-col gap-5">
        {/* Laporan saya quick navigation card */}
        <button
          type="button"
          onClick={() => setActiveSubScreen('reports')}
          className={cn(
            'p-4 rounded-2xl border flex items-center justify-between gap-3 text-left transition-all cursor-pointer select-none active:scale-98 group',
            isDark
              ? 'bg-[#111624] border-white/5 hover:bg-white/5'
              : 'bg-white border-slate-100 shadow-2xs hover:bg-slate-50',
          )}
        >
          <div className="flex flex-col">
            <span className={cn('text-xs font-bold tracking-tight', isDark ? 'text-white' : 'text-slate-900')}>
              Laporan saya
            </span>
            <span className={cn('text-[11px] mt-0.5', isDark ? 'text-neutral-400' : 'text-slate-500')}>
              Pantau status penanganan tiket kendala teknis
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-full border shrink-0', reportBadgeStyle)}>
              {activeReportsCount > 0 ? `${activeReportsCount} proses` : '0 laporan'}
            </span>
            <ChevronRight
              className={cn(
                'h-4 w-4 shrink-0 transition-opacity opacity-40 group-hover:opacity-80',
                isDark ? 'text-neutral-400' : 'text-slate-400',
              )}
            />
          </div>
        </button>

        {/* Section: Pertanyaan sering diajukan */}
        <div className="flex flex-col">
          <span
            className={cn(
              'text-xs font-semibold px-1 mb-1.5',
              isDark ? 'text-neutral-400' : 'text-slate-500',
            )}
          >
            Pertanyaan sering diajukan
          </span>

          <div
            className={cn(
              'rounded-2xl border divide-y overflow-hidden transition-colors',
              isDark
                ? 'bg-[#111624] border-white/5 divide-white/5'
                : 'bg-white border-slate-100 divide-slate-100 shadow-2xs',
            )}
          >
            {FAQ_LIST.map((faq) => (
              <button
                key={faq.id}
                type="button"
                onClick={() => handleOpenFaq(faq)}
                className={cn(
                  'flex w-full items-center justify-between gap-3 text-left px-4 py-3 transition-colors cursor-pointer select-none group',
                  isDark ? 'hover:bg-white/5 active:bg-white/10' : 'hover:bg-slate-50 active:bg-slate-100',
                )}
              >
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span
                    className={cn(
                      'text-[10.5px] font-semibold tracking-tight',
                      isDark ? 'text-sky-400' : 'text-blue-600',
                    )}
                  >
                    {faq.category}
                  </span>
                  <span
                    className={cn(
                      'text-[12.5px] font-semibold tracking-tight leading-snug',
                      isDark ? 'text-white' : 'text-slate-900',
                    )}
                  >
                    {faq.title}
                  </span>
                </div>
                <ChevronRight
                  className={cn(
                    'h-4 w-4 shrink-0 transition-opacity opacity-40 group-hover:opacity-80',
                    isDark ? 'text-neutral-400' : 'text-slate-400',
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Section: Kontak Helpdesk IT */}
        <SettingSection title="Kontak helpdesk IT" isDark={isDark}>
          <SettingInfoRow
            label="Telepon ekstensi internal"
            value="Ext. 1044 / 1045"
            isDark={isDark}
          />
          <SettingInfoRow
            label="WhatsApp IT support"
            value="+62 811-9876-5432"
            isDark={isDark}
          />
          <SettingInfoRow
            label="Jam layanan siaga"
            value="24 jam (siaga IGD & poliklinik)"
            isDark={isDark}
          />
        </SettingSection>

        {/* Record akhir: tombol chat dengan tim IT */}
        <div
          className={cn(
            'p-4 rounded-2xl border flex flex-col gap-3 transition-colors',
            isDark
              ? 'bg-white/5 border-white/10'
              : 'bg-blue-50/70 border-blue-100 shadow-2xs',
          )}
        >
          <div className="flex flex-col">
            <h4 className={cn('text-xs font-bold tracking-tight', isDark ? 'text-white' : 'text-blue-950')}>
              Butuh bantuan teknisi langsung?
            </h4>
            <p className={cn('text-[11px] mt-0.5 leading-relaxed', isDark ? 'text-neutral-400' : 'text-slate-600')}>
              Hubungi petugas IT melalui percakapan langsung untuk penanganan kendala cepat.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveSubScreen('chat')}
            className={cn(
              'w-full py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer select-none active:scale-98 text-center',
              isDark
                ? 'bg-sky-500 text-white hover:bg-sky-400'
                : 'bg-blue-600 text-white hover:bg-blue-700',
            )}
          >
            Chat dengan tim IT
          </button>
        </div>
      </div>

      {/* Sub-Screen Rendering */}
      {activeSubScreen && (
        <div
          ref={subScreenRef}
          className={cn(
            'absolute inset-0 z-40 w-full h-full shadow-[-12px_0_30px_rgba(0,0,0,0.3)] will-change-transform',
            isDark ? 'bg-[#0a0e1a]' : 'bg-[#f8faff]',
          )}
        >
          <ItSubScreenContainer
            activeSubScreen={activeSubScreen}
            selectedFaq={selectedFaq}
            reports={reports}
            theme={props.theme}
            onBack={handleBackFromSubScreen}
            onOpenChat={() => setActiveSubScreen('chat')}
            onNewTicket={handleNewTicketFromChat}
          />
        </div>
      )}
    </div>
  );
}
